"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { CalendarSync, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";


const DEFAULT_RATES = { baseRate: 295, cleaningFee: 180, taxRate: 8 };

const nightsBetween = (start?: Date, end?: Date) =>
  start && end ? Math.ceil(Math.abs(end.getTime() - start.getTime()) / 86400000) : 0;

const calculatePricing = (nights: number, rates: typeof DEFAULT_RATES) => {
  const subtotal = nights * rates.baseRate + rates.cleaningFee;
  const tax = (subtotal * rates.taxRate) / 100;
  return { nights, subtotal, tax, total: subtotal + tax, ...rates };
};

const AuthModal = ({ mode, setMode, onClose, onLogin }: any) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget as any;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setError("Enter a valid email.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        error ? setError(error.message) : setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        error ? setError(error.message) : onLogin();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="p-8 bg-gradient-card border-border/50 shadow-lg w-full max-w-lg relative">
        <h2 className="text-xl font-bold mb-4">{mode === "signin" ? "Log In" : "Sign Up"}</h2>

        <form onSubmit={handleAuth}>
          <input name="email" type="email" placeholder="Email" className="mb-2 w-full p-3 border rounded-md" />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="mb-4 w-full p-3 border rounded-md"
          />
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : mode === "signin" ? "Log In" : "Sign Up"}
          </Button>
        </form>

        <div className="text-sm text-center mt-4">
          {mode === "signin" ? (
            <>
              Don’t have an account?{" "}
              <button className="text-blue-600 underline" onClick={() => setMode("signup")}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="text-blue-600 underline" onClick={() => setMode("signin")}>
                Log In
              </button>
            </>
          )}
        </div>

        <button className="absolute top-2 right-2" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

const Availability = () => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("2");
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [syncUrls, setSyncUrls] = useState({
    airbnb: '',
    vrbo: '',
    custom: ''
  });
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    supabase.from("blocked_dates").select("date").then(({ data }) =>
      setBlockedDates(data?.map((row: any) => new Date(row.date)) || [])
    );
    supabase
      .from("rates")
      .select("base_rate, cleaning_fee, tax_rate")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) =>
        data &&
        setRates({
          baseRate: Number(data.base_rate),
          cleaningFee: Number(data.cleaning_fee),
          taxRate: Number(data.tax_rate),
        })
      );
  }, []);

  const nights = nightsBetween(checkIn, checkOut);
  const pricing = calculatePricing(nights, rates);

  const isDateBlocked = (date: Date) =>
    blockedDates.some((d) => d.toDateString() === date.toDateString());

  // const handleICSUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   const text = await file.text();
  //   const matches = [...text.matchAll(/DTSTART;VALUE=DATE:(\d{8})/g)];
  //   const dates = matches.map((m) => `${m[1].slice(0, 4)}-${m[1].slice(4, 6)}-${m[1].slice(6, 8)}`);
  //   await supabase.from("blocked_dates").upsert(dates.map((date) => ({ date })));
  //   const { data } = await supabase.from("blocked_dates").select("date");
  //   setBlockedDates(data?.map((r: any) => new Date(r.date)) || []);
  //   toast({ title: "Calendar Synced!", description: `${dates.length} dates blocked.` });
  // };

  // const handleClearBlocks = async () => {
  //   await supabase.from("blocked_dates").delete().neq("date", "");
  //   setBlockedDates([]);
  // };
console.log(checkIn)
  const handleRequestToBook = async () => {
    setLoading(true);
    if (!user) {
      setLoading(false)
      return setShowAuth(true);
    }
    if (!checkIn || !checkOut) {
      setLoading(false)
      return toast({ title: "Missing fields", description: "Select check-in and check-out." });
    }
    if (checkOut <= checkIn) {
      setLoading(false)
      return toast({ title: "Invalid dates", description: "Check-out must be after check-in." });
    }

    const { data } = await supabase.auth.getUser();
    if (!data?.user) return setShowAuth(true);

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: pricing.total,
        email: data.user.email,
        checkIn: checkIn.toISOString().slice(0, 10),
        checkOut: checkOut.toISOString().slice(0, 10),
        guests: Number(guests),
        user_id: data.user.id
      }),
    });
    const stripeData = await response.json();
    if (stripeData.url) window.location.href = stripeData.url;

    // await supabase.from("bookings").insert([
    //   {
    //     user_id: data.user.id,
    //     guest_email: data.user.email,
    //     check_in: checkIn.toISOString().slice(0, 10),
    //     check_out: checkOut.toISOString().slice(0, 10),
    //     guests_count: Number(guests),
    //     total_amount: pricing.total,
    //     status: "confirmed"
    //   },
    // ]);

    // const datesToBlock = [];
    // for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
    //   datesToBlock.push({ date: d.toISOString().slice(0, 10) });
    // }
    // const { error: blockError } = await supabase
    //   .from('blocked_dates')
    //   .upsert(datesToBlock);
    // if (blockError) {
    //   console.error('Blocking dates error:', blockError);
    //   toast({
    //     title: "Failed to block booked dates",
    //     description: blockError.message,
    //   });
    //   return;
    // }
    setLoading(false);
    // toast({ title: "Booking successful", description: `Total: $${pricing.total}` });

  };

  const syncCalendarData = async (events: any[], source: string) => {
    setSyncing(true);

    try {

      // await supabase
      //   .from('blocked_dates')
      //   .delete()
      //   .eq('source', source);

      const blockedDates = events.map(event => ({
        date: event.date,
        source: event.source || source,
        summary: event.summary || 'Blocked'
      }));

      if (blockedDates.length > 0) {
        await supabase
          .from('blocked_dates')
          .upsert(blockedDates);
      }


      const { data } = await supabase
        .from('blocked_dates')
        .select('date');

      setBlockedDates(data?.map((r: any) => new Date(r.date)) || []);
      // setLastSyncTime(new Date());

    } catch (error) {
      console.error('Sync error:', error);
      throw error;
    } finally {
      setSyncing(false);
    }
  };

  const syncFromURL = async (url: string, platform: string) => {
    try {
      setSyncing(true);

      const response = await fetch(`/api/sync-calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, platform })
      });

      const data = await response.json();

      if (data.events) {
        // Ensure events are unique by date
        const uniqueEvents = Array.from(
          new Map(data.events.map((event: any) => [event.date, event])).values()
        );
        await syncCalendarData(uniqueEvents, platform);
        toast({
          title: `${platform} Calendar Synced!`,
          description: `${uniqueEvents.length} dates updated.`
        });
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: `Could not sync ${platform} calendar.`
      });
    } finally {
      setSyncing(false);
    }
  };

  const autoSync = async () => {
    const urls = [
      { url: "https://calendar.google.com/calendar/ical/en.usa%23holiday%40group.v.calendar.google.com/public/basic.ics", platform: 'airbnb' },
      { url: syncUrls.vrbo, platform: 'vrbo' },
      { url: syncUrls.custom, platform: 'custom' }
    ].filter(item => item.url);

    for (const { url, platform } of urls) {
      await syncFromURL(url, platform);
    }
  };


  return (
    <section id="availability" className="py-20 bg-background">
      {showAuth && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setShowAuth(false)}
          onLogin={async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data?.user ?? null);
            setShowAuth(false);
          }}
        />
      )}

      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Check availability
          </h2>
          <p className="text-muted-foreground">Upload Airbnb/VRBO .ics to block reservations.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calendar Section */}
          <div>
            <Button variant="outline" size="sm" onClick={autoSync}>
              <CalendarSync /> Sync calendars
            </Button>
            {/* <Card className="p-6 mb-6 bg-gradient-card">
              <h4 className="font-semibold mb-3">Sync calendars</h4>
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer">
                  <input type="file" accept=".ics" className="hidden" onChange={handleICSUpload} />
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <span className="flex items-center">
                      <Upload className="h-4 w-4 mr-2" /> Upload .ics
                    </span>
                  </Button>
                </label>
                <Button variant="outline" size="sm" onClick={handleClearBlocks} disabled={!blockedDates.length}>
                  Clear Blocks
                </Button>
              </div>
            </Card>  */}

            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              disabledDates={blockedDates}
              className="mb-6"
            />

            <Input
              type="number"
              min="1"
              max="10"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-32"
            />
          </div>

          {/* Booking Summary */}
          <div className="lg:sticky lg:top-8">
            <Card className="p-6 bg-gradient-card">
              <div className="flex justify-between mb-6">
                <h3 className="text-2xl font-bold">${rates.baseRate}</h3>
                <span>/ night</span>
              </div>

              {pricing.nights > 0 && (
                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span>Nights</span>
                    <span>{pricing.nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated total</span>
                    <span>${pricing.total.toFixed(0)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Base ${pricing.baseRate}/night • Cleaning ${pricing.cleaningFee}
                  </div>
                </div>
              )}

              <Button variant="hero" size="lg" className="w-full" onClick={handleRequestToBook} disabled={!checkIn || !checkOut}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Request to Book'}

              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Availability;
