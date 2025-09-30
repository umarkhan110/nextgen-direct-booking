"use client";
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminRateManagement from '@/components/AdminRateManagement';
import { supabase } from '@/lib/supabaseClient';
import {
  Lock,
  Home,
  Calendar,
  DollarSign,
  Users,
  Settings,
  BarChart3,
  Upload,
  Shield,
  Loader2
} from 'lucide-react';
// import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns";
// import { cn } from '@/lib/utils';
import CalendarView from './CalendarView';
import Link from 'next/link';

interface Booking {
  id: string;
  // guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
}

interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRating: number;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('rates');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    averageRating: 0,
    confirmedBookings: 0,
    pendingBookings: 0
  });

  const [calendarView, setCalendarView] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          id,
          guest_email,
          check_in,
          check_out,
          guests_count,
          total_amount,
          status,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
        setBookingStats(calculateStats(data || []));
      }
    } catch (error) {
      console.error('Error:', error);
      const fallbackBookings: Booking[] = [];
      setBookings(fallbackBookings);
      setBookingStats(calculateStats(fallbackBookings));
    } finally {
      setLoading(false);
    }
  };

  // Calculate booking statistics
  const calculateStats = (bookingsData: Booking[]): BookingStats => {
    const total = bookingsData.length;
    const confirmed = bookingsData.filter((b: Booking) => b.status === 'confirmed').length;
    const pending = bookingsData.filter((b: Booking) => b.status === 'pending').length;
    const totalRevenue = bookingsData.reduce((sum: number, b: Booking) => sum + (b.total_amount || 0), 0);

    return {
      totalBookings: total,
      totalRevenue: totalRevenue,
      occupancyRate: 85, // This would need more complex calculation
      averageRating: 4.8, // This would come from reviews table
      confirmedBookings: confirmed,
      pendingBookings: pending
    };
  };

  useEffect(() => {
    if (activeTab === 'bookings' && isAuthenticated) {
      fetchBookings();
    }
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (bookings.length > 0) {
      calculateStats(bookings);
    }
  }, [bookings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'nextgen2025') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const adminTabs = [
    { id: 'rates', label: 'Rate Management', icon: DollarSign },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'photos', label: 'Photo Management', icon: Upload },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md p-8 bg-gradient-card border-border/50 shadow-luxury">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src="/logo.png" alt="NextGen Retreats" className="h-12 w-auto" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
            <p className="text-muted-foreground">Enter password to access admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Admin Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Access Dashboard
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to Main Site
            </Link>
          </div>
        </Card>
      </div>
    );
  }


  const renderTabContent = () => {
    switch (activeTab) {
      case 'rates':
        return <AdminRateManagement />;

      case 'bookings':
        return calendarView ? (
          <CalendarView bookings={bookings} setCalendarView={setCalendarView} />
        ) : (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Booking Management</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{bookingStats.confirmedBookings} Active</Badge>
                  <Badge variant="outline">{bookingStats.pendingBookings} Pending</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchBookings}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
                  </Button>
                </div>
              </div>

              {/* Booking Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{bookingStats.totalBookings}</div>
                  <div className="text-sm text-muted-foreground">Total Bookings</div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">${bookingStats.totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                </div>
                {/* <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{bookingStats.occupancyRate}%</div>
                    <div className="text-sm text-muted-foreground">Occupancy Rate</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary-glow">{bookingStats.averageRating}★</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div> */}
              </div>

              {/* Bookings Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No bookings found</p>
                    <p className="text-sm text-muted-foreground">
                      Bookings will appear here once guests make reservations
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 font-semibold">Guest</th>
                        <th className="text-left py-3 px-4 font-semibold">Dates</th>
                        <th className="text-left py-3 px-4 font-semibold">Guests</th>
                        <th className="text-left py-3 px-4 font-semibold">Total</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        {/* <th className="text-left py-3 px-4 font-semibold">Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => {
                        const checkIn = new Date(booking.check_in);
                        const checkOut = new Date(booking.check_out);
                        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

                        return (
                          <tr key={booking.id || index} className="border-b border-border/20 hover:bg-muted/10">
                            <td className="py-4 px-4">
                              <div>
                                {/* <div className="font-medium">{booking.guest_name}</div> */}
                                <div className="text-sm text-muted-foreground">{booking.guest_email}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium">
                                  {checkIn.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })} - {checkOut.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                                <div className="text-sm text-muted-foreground">{nights} nights</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">{booking.guests_count}</td>
                            <td className="py-4 px-4 font-medium">${booking.total_amount}</td>
                            <td className="py-4 px-4">
                              <Badge
                                variant={booking.status === 'confirmed' ? 'secondary' : 'outline'}
                                className={booking.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                }
                              >
                                {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                              </Badge>
                            </td>
                            {/* <td className="py-4 px-4">
                                <Button variant="outline" size="sm">
                                  {booking.status === 'confirmed' ? 'View' : 'Review'}
                                </Button>
                              </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-border/50">
                <div className="text-sm text-muted-foreground">
                  Showing {bookings.length} of {bookingStats.totalBookings} bookings
                </div>
                <div className="flex space-x-2">
                  {/* <Button variant="outline" size="sm">Export</Button> */}
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => setCalendarView(true)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar View
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );
      case 'photos':
        return (
          <Card className="p-6 bg-gradient-card border-border/50">
            <h3 className="text-xl font-bold mb-4">Photo Management</h3>
            <div className="text-muted-foreground">
              <p>Upload and organize property photos:</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>• Bulk photo upload</li>
                <li>• Category organization</li>
                <li>• Image optimization</li>
                <li>• Gallery management</li>
              </ul>
            </div>
          </Card>
        );

      case 'analytics':
        return (
          <Card className="p-6 bg-gradient-card border-border/50">
            <h3 className="text-xl font-bold mb-4">Analytics Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-primary">24</div>
                <div className="text-sm text-muted-foreground">Inquiries This Month</div>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-secondary">85%</div>
                <div className="text-sm text-muted-foreground">Occupancy Rate</div>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <div className="text-2xl font-bold text-accent">4.9★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </Card>
        );

      case 'settings':
        return (
          <Card className="p-6 bg-gradient-card border-border/50">
            <h3 className="text-xl font-bold mb-4">Property Settings</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Property Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Property Name" defaultValue="NextGen Retreats" />
                  <Input placeholder="Max Guests" defaultValue="10" />
                  <Input placeholder="Bedrooms" defaultValue="3" />
                  <Input placeholder="Bathrooms" defaultValue="2" />
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Host Email" />
                  <Input placeholder="Host Phone" />
                </div>
              </div>

              <Button variant="hero">Save Settings</Button>
            </div>
          </Card>
        );

      default:
        return <AdminRateManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-card to-background border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="NextGen Retreats" className="h-10 w-auto" />
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">NextGen Retreats Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Secure Area</span>
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAuthenticated(false)}
              >
                Logout
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  View Site
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Admin Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "hero" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;