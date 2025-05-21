'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { Calendar, Clock, MessageSquare } from 'lucide-react';
import { format, addDays, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

export default function BookingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [date, setDate] = useState<Date>(addDays(new Date(), 1));
  const [time, setTime] = useState('10:00');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    date?: string;
    time?: string;
    message?: string;
  }>({});
  
  const { showToast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate form
    let hasError = false;
    const newErrors: {
      date?: string;
      time?: string;
      message?: string;
    } = {};
    
    // Validate date
    const today = new Date();
    const minDate = startOfDay(today);
    const maxDate = addDays(today, 30);
    
    if (!date) {
      newErrors.date = 'Date is required';
      hasError = true;
    } else if (isBefore(date, minDate)) {
      newErrors.date = 'Date cannot be in the past';
      hasError = true;
    } else if (isAfter(date, maxDate)) {
      newErrors.date = 'Date cannot be more than 30 days in the future';
      hasError = true;
    }
    
    // Validate time
    if (!time) {
      newErrors.time = 'Time is required';
      hasError = true;
    }
    
    // Validate message
    if (!message) {
      newErrors.message = 'Message is required';
      hasError = true;
    } else if (message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      hasError = true;
    } else if (message.length > 500) {
      newErrors.message = 'Message cannot exceed 500 characters';
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Combine date and time
      const [hours, minutes] = time.split(':').map(Number);
      const bookingDate = new Date(date);
      bookingDate.setHours(hours, minutes, 0, 0);
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: bookingDate.toISOString(),
          message,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        showToast(data.error || 'Failed to create booking', 'error');
        setIsLoading(false);
        return;
      }
      
      showToast('Booking created successfully!', 'success');
      
      // Reset form
      setDate(addDays(new Date(), 1));
      setTime('10:00');
      setMessage('');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Booking error:', error);
      showToast('An error occurred while creating the booking', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card animate={false}>
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <CardDescription>
          Schedule a meeting with our team to discuss your needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-200 mb-1">
                Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <Input
                  id="date"
                  type="date"
                  value={date ? format(date, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : null)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                  className="pl-10"
                  error={errors.date}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-200 mb-1">
                Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={16} className="text-gray-400" />
                </div>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  min="09:00"
                  max="17:00"
                  className="pl-10"
                  error={errors.time}
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Business hours: 9:00 AM - 5:00 PM
              </p>
            </div>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1">
              Message
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <MessageSquare size={16} className="text-gray-400" />
              </div>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe what you'd like to discuss..."
                className={`flex w-full rounded-md border bg-gray-900 px-3 py-2 pl-10 text-sm ring-offset-dark placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.message ? 'border-red-500' : 'border-gray-700'
                }`}
                rows={4}
                disabled={isLoading}
              ></textarea>
              {errors.message && (
                <p className="text-xs text-red-500 mt-1">{errors.message}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {message.length}/500 characters
              </p>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button type="submit" fullWidth isLoading={isLoading}>
              Book Appointment
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}
