'use client';

import { format } from 'date-fns';
import { FaCalendar, FaClock } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

interface DateTimePickerProps {
  date?: Date;
  disabled?: boolean;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DateTimePicker({
  date,
  disabled = false,
  onDateChange,
  placeholder = 'Pick a date and time',
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);
  const [timeValue, setTimeValue] = useState<string>(() => {
    if (date) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return '14:00';
  });

  const [prevDateProp, setPrevDateProp] = useState<Date | undefined>(date);

  if (date !== prevDateProp) {
    setPrevDateProp(date);
    setSelectedDate(date);
    if (date) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      setTimeValue(`${hours}:${minutes}`);
    }
  }

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setSelectedDate(undefined);
      onDateChange(undefined);
      return;
    }

    const [hours, minutes] = timeValue.split(':').map((v) => Number.parseInt(v, 10));

    const dateWithTime = new Date(newDate);
    dateWithTime.setHours(hours || 0);
    dateWithTime.setMinutes(minutes || 0);
    dateWithTime.setSeconds(0);
    dateWithTime.setMilliseconds(0);

    const now = new Date();
    if (dateWithTime <= now) {
      dateWithTime.setHours(now.getHours());
      dateWithTime.setMinutes(now.getMinutes() + 1);
      const hh = dateWithTime.getHours().toString().padStart(2, '0');
      const mm = dateWithTime.getMinutes().toString().padStart(2, '0');
      setTimeValue(`${hh}:${mm}`);
    }

    setSelectedDate(dateWithTime);
    onDateChange(dateWithTime);
  };

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime);

    if (!selectedDate) return;

    const [hours, minutes] = newTime.split(':').map((v) => Number.parseInt(v, 10));

    if (
      hours === undefined ||
      minutes === undefined ||
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    )
      return;

    const newDate = new Date(selectedDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);

    const now = new Date();
    const isToday =
      newDate.getFullYear() === now.getFullYear() &&
      newDate.getMonth() === now.getMonth() &&
      newDate.getDate() === now.getDate();

    if (isToday && newDate <= now) {
      return;
    }

    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  const minTime = useMemo(() => {
    if (!selectedDate) return undefined;
    const now = new Date();
    const isToday =
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();
    if (!isToday) return undefined;
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }, [selectedDate]);

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'w-full justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground',
          )}
          disabled={disabled}
          variant="outline"
        >
          <FaCalendar className="mr-2" size={16} />
          {selectedDate ? format(selectedDate, "PPP 'at' h:mm a") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex flex-col">
          <Calendar
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            mode="single"
            onSelect={handleDateSelect}
            selected={selectedDate}
          />
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <FaClock className="text-muted-foreground" size={16} />
              <Input
                className="h-8"
                min={minTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                type="time"
                value={timeValue}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Time: {timeValue}</p>
          </div>
          <div className="border-t border-border p-2 flex justify-end gap-2">
            <Button onClick={() => setIsOpen(false)} size="sm" variant="outline">
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)} size="sm">
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
