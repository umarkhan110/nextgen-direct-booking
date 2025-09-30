import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
// import { supabase } from '@/lib/supabaseClient';
// In your webhook route.ts file, replace the supabase import
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  try {
    
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items']
    });

    const customerEmail = session.customer_email || session.customer_details?.email;
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    
    const bookingMetadata = session.metadata;
    
    if (customerEmail && bookingMetadata) {
      const { data, error } = await supabase
        .from('bookings')
        .upsert({
          user_id: bookingMetadata.user_id,
          guest_email: customerEmail,
          check_in: bookingMetadata.check_in,
          check_out: bookingMetadata.check_out,
          guests_count: parseInt(bookingMetadata.guests_count || '2'),
          total_amount: amount,
          status: 'confirmed',
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'stripe_session_id'
        });

      if (error) {
        console.error('Error updating booking:', error);
        return;
      }

      if (bookingMetadata.check_in && bookingMetadata.check_out) {
        await blockBookedDates(
          bookingMetadata.check_in,
          bookingMetadata.check_out,
          session.id
        );
      }

      console.log('Booking confirmed and dates blocked:', data);
    }
  } catch (error) {
    console.error('Error handling checkout session:', error);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  
  try {
    
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        stripe_payment_intent: paymentIntent.id,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_payment_intent', paymentIntent.id);

    if (error) {
      console.error('Error updating booking payment status:', error);
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
  
  try {
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('check_in, check_out')
      .eq('stripe_payment_intent', paymentIntent.id)
      .single();

    if (fetchError) {
      console.error('Error fetching booking for failed payment:', fetchError);
      return;
    }

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_payment_intent', paymentIntent.id);

    if (updateError) {
      console.error('Error updating booking status:', updateError);
    }

    if (booking) {
      await unblockDates(booking.check_in, booking.check_out, paymentIntent.id);
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id);
}

async function blockBookedDates(checkIn: string, checkOut: string, sessionId: string) {
  try {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const datesToBlock = [];

    // Generate all dates between check-in and check-out (excluding check-out)
    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      datesToBlock.push({
        date: d.toISOString().slice(0, 10),
        source: 'booking',
        summary: `Booking - ${sessionId}`,
        booking_reference: sessionId
      });
    }

    if (datesToBlock.length > 0) {
      const { error } = await supabase
        .from('blocked_dates')
        .upsert(datesToBlock, {
          onConflict: 'date,source'
        });

      if (error) {
        console.error('Error blocking dates:', error);
      } else {
        console.log(`Blocked ${datesToBlock.length} dates for booking ${sessionId}`);
      }
    }
  } catch (error) {
    console.error('Error in blockBookedDates:', error);
  }
}

async function unblockDates(checkIn: string, checkOut: string, reference: string) {
  try {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const datesToUnblock = [];

    // Generate all dates between check-in and check-out
    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      datesToUnblock.push(d.toISOString().slice(0, 10));
    }

    if (datesToUnblock.length > 0) {
      const { error } = await supabase
        .from('blocked_dates')
        .delete()
        .in('date', datesToUnblock)
        .eq('booking_reference', reference);

      if (error) {
        console.error('Error unblocking dates:', error);
      } else {
        console.log(`Unblocked ${datesToUnblock.length} dates for failed payment ${reference}`);
      }
    }
  } catch (error) {
    console.error('Error in unblockDates:', error);
  }
}