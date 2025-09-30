import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns";
import { useState } from "react";
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
const CalendarView = ({ bookings, setCalendarView }: { bookings: Booking[], setCalendarView: (view: boolean) => void }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());


    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

 
    const bookingsByDate = bookings.reduce((acc, booking) => {
        const checkIn = parseISO(booking.check_in);
        const checkOut = parseISO(booking.check_out);


        let currentDate = checkIn;
        while (currentDate < checkOut) {
            const dateKey = format(currentDate, 'yyyy-MM-dd');
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(booking);
            currentDate = addDays(currentDate, 1);
        }

        return acc;
    }, {} as Record<string, Booking[]>);

    const getDayStatus = (date: Date) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const dayBookings = bookingsByDate[dateKey] || [];

        if (dayBookings.length === 0) return 'available';
        if (dayBookings.some(b => b.status === 'confirmed')) return 'occupied';
        return 'pending';
    };

    const getDayColor = (status: string) => {
        switch (status) {
            case 'occupied': return 'bg-red-100 border-red-300 text-red-900';
            case 'pending': return 'bg-yellow-100 border-yellow-300 text-yellow-900';
            default: return 'bg-green-50 border-green-200 text-green-900';
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-6 bg-gradient-card border-border/50">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Calendar View</h3>
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded bg-green-200 border border-green-300"></div>
                                <span>Available</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded bg-yellow-200 border border-yellow-300"></div>
                                <span>Pending</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded bg-red-200 border border-red-300"></div>
                                <span>Occupied</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCalendarView(false)}
                        >
                            Table View
                        </Button>
                    </div>
                </div>

            
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(addDays(startOfMonth(currentMonth), -1))}
                    >
                        Previous
                    </Button>
                    <h4 className="text-lg font-semibold">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h4>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(addDays(endOfMonth(currentMonth), 1))}
                    >
                        Next
                    </Button>
                </div>

            
                <div className="grid grid-cols-7 gap-2">
                 
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                            {day}
                        </div>
                    ))}

                  
                    {monthDays.map(day => {
                        const status = getDayStatus(day);
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const dayBookings = bookingsByDate[dateKey] || [];

                        return (
                            <div
                                key={day.toISOString()}
                                className={cn(
                                    "min-h-[80px] p-2 border rounded-lg cursor-pointer hover:shadow-sm transition-all",
                                    getDayColor(status),
                                    !isSameMonth(day, currentMonth) && "opacity-30"
                                )}
                                onClick={() => setSelectedDate(day)}
                            >
                                <div className="font-medium mb-1">
                                    {format(day, 'd')}
                                </div>

                                {dayBookings.slice(0, 2).map((booking, index) => (
                                    <div
                                        key={booking.id}
                                        className="text-xs p-1 mb-1 bg-white/60 rounded truncate"
                                        title={`${booking.guest_email} - $${booking.total_amount}`}
                                    >
                                        {booking.guest_email.split('@')[0]}
                                    </div>
                                ))}

                                {dayBookings.length > 2 && (
                                    <div className="text-xs text-muted-foreground">
                                        +{dayBookings.length - 2} more
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

               
                {selectedDate && (
                    <Card className="mt-6 p-4 bg-muted/10">
                        <h5 className="font-medium mb-3">
                            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </h5>

                        {(() => {
                            const dateKey = format(selectedDate, 'yyyy-MM-dd');
                            const dayBookings = bookingsByDate[dateKey] || [];

                            if (dayBookings.length === 0) {
                                return (
                                    <p className="text-muted-foreground">No bookings for this date</p>
                                );
                            }

                            return (
                                <div className="space-y-2">
                                    {dayBookings.map(booking => (
                                        <div
                                            key={booking.id}
                                            className="flex items-center justify-between p-3 bg-white rounded-lg border"
                                        >
                                            <div>
                                                <div className="font-medium">{booking.guest_email}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {format(parseISO(booking.check_in), 'MMM d')} - {format(parseISO(booking.check_out), 'MMM d')}
                                                    {' • '}{booking.guests_count} guests
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">${booking.total_amount}</div>
                                                <Badge
                                                    variant={booking.status === 'confirmed' ? 'secondary' : 'outline'}
                                                    className={booking.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }
                                                >
                                                    {booking.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </Card>
                )}
            </Card>
        </div>
    );
};

export default CalendarView;
