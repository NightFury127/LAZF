'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { Calendar, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

interface Booking {
  id: string;
  date: string;
  message: string;
  contacted: boolean;
  contactedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const { data: session } = useSession();
  
  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showToast('Failed to load booking history', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const handleMarkAsContacted = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}/contact`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update booking');
      }
      
      showToast('Booking marked as contacted', 'success');
      
      // Refresh bookings
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      showToast('Failed to update booking', 'error');
    }
  };
  
  const isAdmin = session?.user?.role === 'ADMIN';
  
  return (
    <Card animate={false}>
      <CardHeader>
        <CardTitle>Booking History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 size={24} className="animate-spin text-primary-500" />
            <span className="ml-2 text-gray-400">Loading bookings...</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-800 rounded-lg p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar size={16} className="text-primary-400 mr-2" />
                      <span className="text-white">
                        {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Clock size={16} className="text-primary-400 mr-2" />
                      <span className="text-white">
                        {format(new Date(booking.date), 'h:mm a')}
                      </span>
                    </div>
                    {isAdmin && (
                      <div className="text-sm text-gray-400">
                        {booking.user.name || 'Unnamed'} ({booking.user.email})
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    {booking.contacted ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle size={16} className="mr-1" />
                        <span>Contacted</span>
                        {booking.contactedAt && (
                          <span className="text-xs text-gray-400 ml-2">
                            {format(new Date(booking.contactedAt), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {isAdmin ? (
                          <button
                            onClick={() => handleMarkAsContacted(booking.id)}
                            className="flex items-center text-blue-500 hover:text-blue-400 transition-colors"
                          >
                            <CheckCircle size={16} className="mr-1" />
                            <span>Mark as Contacted</span>
                          </button>
                        ) : (
                          <div className="flex items-center text-yellow-500">
                            <XCircle size={16} className="mr-1" />
                            <span>Pending</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-sm text-gray-300">{booking.message}</p>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  Booked on {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
