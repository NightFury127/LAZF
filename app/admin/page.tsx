'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useSession } from 'next-auth/react';
import { Users, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/Toast';

interface StatsData {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  adminUsers: number;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const { showToast } = useToast();
  
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        showToast('Failed to load dashboard stats', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [showToast]);
  
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: <Users size={24} className="text-blue-500" />,
    },
    {
      title: 'New Users (Last 7 Days)',
      value: stats.newUsers.toString(),
      icon: <Activity size={24} className="text-green-500" />,
    },
    {
      title: 'Admin Users',
      value: stats.adminUsers.toString(),
      icon: <AlertTriangle size={24} className="text-red-500" />,
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toString(),
      icon: <TrendingUp size={24} className="text-purple-500" />,
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
        <h1 className="text-3xl font-bold text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 mt-1">
          Welcome to the admin panel, {user?.name || 'Admin'}
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
                  {isLoading ? '...' : stat.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-gray-400">Loading activity...</p>
                ) : (
                  [1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                      <div>
                        <p className="text-sm text-white">
                          New user registered
                        </p>
                        <p className="text-xs text-gray-400">
                          {i + 1} hour{i !== 0 ? 's' : ''} ago
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-gray-400">Loading status...</p>
                ) : (
                  [
                    { name: 'Database', status: 'Operational', color: 'bg-green-500' },
                    { name: 'API', status: 'Operational', color: 'bg-green-500' },
                    { name: 'Email Service', status: 'Operational', color: 'bg-green-500' },
                  ].map((service, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-white">{service.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${service.color}`} />
                        <span className="text-xs text-gray-400">{service.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
