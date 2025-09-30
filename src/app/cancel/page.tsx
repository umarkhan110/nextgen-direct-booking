"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center bg-gradient-card border-border/50 shadow-luxury">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold mb-4">
          Booking Cancelled
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Your booking was cancelled. No payment was processed. You can try again whenever you are ready.
        </p>
        
        <div className="space-y-3">
          <Link href="/">
            <Button variant="hero" className="w-full">
              Return Home
            </Button>
          </Link>
          
          <Link href="#availability">
            <Button variant="outline" className="w-full">
              Try Booking Again
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}