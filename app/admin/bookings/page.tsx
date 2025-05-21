'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useSession } from 'next-auth/react';
import { Calendar, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import BookingsTable from '@/components/admin/BookingsTable';

interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  contactedBookings: number;
  todayBookings: number;
}

export default function AdminBookingsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const { showToast } = useToast();
  
  const [stats, setStats] = useState<BookingStats>({
    totalBookings: 0,
    pendingBookings: 0,
    contactedBookings: 0,
    todayBookings: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/bookings/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch booking stats');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching booking stats:', error);
        showToast('Failed to load booking stats', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [showToast]);
  
  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toString(),
      icon: <Calendar size={24} className="text-blue-500" />,
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings.toString(),
      icon: <XCircle size={24} className="text-yellow-500" />,
    },
    {
      title: 'Contacted Bookings',
      value: stats.contactedBookings.toString(),
      icon: <CheckCircle size={24} className="text-green-500" />,
    },
    {
      title: 'Today\'s Bookings',
      value: stats.todayBookings.toString(),
      icon: <Clock size={24} className="text-purple-500" />,
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white">Booking Management</h1>
        <p className="text-gray-400 mt-1">
          Manage and track all customer bookings
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {isLoading ? "..." : stat.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingsTable />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
