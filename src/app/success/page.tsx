"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSessionId(urlParams.get('session_id'));
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center bg-gradient-card border-border/50 shadow-luxury">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Booking Successful! 🎉
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Thank you for your booking! You'll receive a confirmation email shortly with all the details.
        </p>
        
        {sessionId && (
          <p className="text-xs text-muted-foreground mb-6">
            Session ID: {sessionId}
          </p>
        )}
        
        <div className="space-y-3">
          <Link href="/">
            <Button variant="hero" className="w-full">
              Return Home
            </Button>
          </Link>
          
          {/* <Link href="#availability">
            <Button variant="outline" className="w-full">
              Book Another Stay
            </Button>
          </Link> */}
        </div>
      </Card>
    </div>
  );
}