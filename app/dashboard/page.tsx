"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useSession } from "next-auth/react";
import { Clock, Users, Activity, TrendingUp, Calendar } from "lucide-react";
import BookingForm from "@/components/booking/BookingForm";
import BookingHistory from "@/components/booking/BookingHistory";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [refreshBookings, setRefreshBookings] = useState(0);

  const stats = [
    {
      title: "Active Projects",
      value: "3",
      icon: <Activity size={24} className="text-blue-500" />,
      change: "+2 this month",
    },
    {
      title: "Team Members",
      value: "12",
      icon: <Users size={24} className="text-purple-500" />,
      change: "+3 this month",
    },
    {
      title: "Hours Logged",
      value: "164",
      icon: <Clock size={24} className="text-green-500" />,
      change: "+28 this week",
    },
    {
      title: "Growth",
      value: "24%",
      icon: <TrendingUp size={24} className="text-orange-500" />,
      change: "+7% this month",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleBookingSuccess = () => {
    // Trigger a refresh of the booking history
    setRefreshBookings((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name || "User"}
        </h1>
        <p className="text-gray-400 mt-1">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                  {stat.value}
                </div>
                <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
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
          <BookingForm onSuccess={handleBookingSuccess} />
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.5 }}
          key={refreshBookings} // Force re-render when refreshBookings changes
        >
          <BookingHistory />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm text-white">
                        Project {i + 1} updated
                      </p>
                      <p className="text-xs text-gray-400">
                        {i + 1} hour{i !== 0 ? "s" : ""} ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          i === 0
                            ? "bg-red-500"
                            : i === 1
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                      <span className="text-sm text-white">Task {i + 1}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {i === 0 ? "Today" : i === 1 ? "Tomorrow" : "Next Week"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
