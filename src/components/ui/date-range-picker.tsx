"use client";

import * as React from "react";
import { format, addDays, isBefore, isAfter } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DateRangePickerProps {
  checkIn?: Date;
  checkOut?: Date;
  onCheckInChange: (date: Date | undefined) => void;
  onCheckOutChange: (date: Date | undefined) => void;
  disabledDates?: Date[];
  className?: string;
}

export function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  disabledDates = [],
  className
}: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectingCheckOut, setSelectingCheckOut] = React.useState(false);

  const generateCalendarDays = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    const endDate = new Date(endOfMonth);

    const firstDayOfWeek = startOfMonth.getDay();
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      startDate.setDate(startDate.getDate() - 1);
    }

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isBefore(date, today)) return true;
    return disabledDates.some(disabledDate => {
      const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const blockedDate = new Date(disabledDate.getFullYear(), disabledDate.getMonth(), disabledDate.getDate());
      
      return targetDate.getTime() === blockedDate.getTime();
    });
  };

  const isDateInRange = (date: Date) => {
    if (!checkIn || !checkOut) return false;
    return date >= checkIn && date <= checkOut;
  };

  const isCheckInDate = (date: Date) => {
    return checkIn && date.toDateString() === checkIn.toDateString();
  };

  const isCheckOutDate = (date: Date) => {
    return checkOut && date.toDateString() === checkOut.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (!checkIn || selectingCheckOut) {
      if (!checkIn) {
        // First selection - set check-in
        onCheckInChange(date);
        setSelectingCheckOut(true);
      } else {
        // Second selection - set check-out
        if (isAfter(date, checkIn)) {
          onCheckOutChange(date);
          setSelectingCheckOut(false);
        } else {
          // If selected date is before check-in, reset and start over
          onCheckInChange(date);
          onCheckOutChange(undefined);
          setSelectingCheckOut(true);
        }
      }
    } else {
      // Reset selection
      onCheckInChange(date);
      onCheckOutChange(undefined);
      setSelectingCheckOut(true);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = generateCalendarDays();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Date Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Check-in</label>
          <Button 
            variant="outline" 
            className={cn(
              "w-full justify-start",
              !checkIn && "text-muted-foreground"
            )}
            onClick={() => setSelectingCheckOut(false)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {checkIn ? format(checkIn, "MM/dd/yyyy") : "Select date"}
          </Button>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Check-out</label>
          <Button 
            variant="outline" 
            className={cn(
              "w-full justify-start",
              !checkOut && "text-muted-foreground"
            )}
            onClick={() => setSelectingCheckOut(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {checkOut ? format(checkOut, "MM/dd/yyyy") : "Select date"}
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <Card className="p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isDisabled = isDateDisabled(day);
            const isInRange = isDateInRange(day);
            const isCheckIn = isCheckInDate(day);
            const isCheckOut = isCheckOutDate(day);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                disabled={isDisabled}
                className={cn(
                  "p-2 text-sm rounded-md transition-colors min-h-[2.5rem] relative",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  !isCurrentMonth && "text-muted-foreground opacity-50",
                  isDisabled && "opacity-30 cursor-not-allowed hover:bg-transparent",
                  isInRange && !isCheckIn && !isCheckOut && "bg-primary/10",
                  isCheckIn && "bg-primary text-primary-foreground font-semibold",
                  isCheckOut && "bg-primary text-primary-foreground font-semibold"
                )}
              >
                {day.getDate()}
                {isCheckIn && (
                  <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    ✓
                  </span>
                )}
                {isCheckOut && (
                  <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    ✗
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-muted-foreground text-center">
          {!checkIn && "Select your check-in date"}
          {checkIn && !checkOut && "Select your check-out date"}
          {checkIn && checkOut && "Click any date to change selection"}
        </div>
      </Card>
    </div>
  );
}