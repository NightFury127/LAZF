'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Search, 
  Filter, 
  User, 
  Mail, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { format, isAfter, isBefore, startOfDay, endOfDay, parseISO } from 'date-fns';

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

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'contacted' | 'pending'>('all');
  const [sortField, setSortField] = useState<'date' | 'createdAt'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { showToast } = useToast();
  
  const fetchBookings = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/bookings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data.bookings);
      applyFilters(data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showToast('Failed to load bookings', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  useEffect(() => {
    applyFilters(bookings);
  }, [searchQuery, startDate, endDate, statusFilter, sortField, sortDirection]);
  
  const applyFilters = (bookingsToFilter: Booking[]) => {
    let result = [...bookingsToFilter];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(booking => 
        booking.user.email.toLowerCase().includes(query) ||
        (booking.user.name && booking.user.name.toLowerCase().includes(query)) ||
        booking.message.toLowerCase().includes(query)
      );
    }
    
    // Apply date range filter
    if (startDate) {
      const start = startOfDay(new Date(startDate));
      result = result.filter(booking => 
        isAfter(new Date(booking.date), start) || 
        booking.date.startsWith(startDate)
      );
    }
    
    if (endDate) {
      const end = endOfDay(new Date(endDate));
      result = result.filter(booking => 
        isBefore(new Date(booking.date), end) || 
        booking.date.startsWith(endDate)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => 
        statusFilter === 'contacted' ? booking.contacted : !booking.contacted
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(sortField === 'date' ? a.date : a.createdAt);
      const dateB = new Date(sortField === 'date' ? b.date : b.createdAt);
      
      return sortDirection === 'asc' 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    });
    
    setFilteredBookings(result);
  };
  
  const handleMarkAsContacted = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}/contact`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update booking');
      }
      
      showToast('Booking marked as contacted', 'success');
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === id 
            ? { ...booking, contacted: true, contactedAt: new Date().toISOString() } 
            : booking
        )
      );
      
      // Update filtered bookings
      setFilteredBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === id 
            ? { ...booking, contacted: true, contactedAt: new Date().toISOString() } 
            : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking:', error);
      showToast('Failed to update booking', 'error');
    }
  };
  
  const toggleSort = (field: 'date' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setStatusFilter('all');
    setSortField('date');
    setSortDirection('desc');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchBookings}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'contacted' | 'pending')}
                  className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All</option>
                  <option value="contacted">Contacted</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetFilters}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 size={32} className="animate-spin text-primary-500" />
          <span className="ml-2 text-gray-400">Loading bookings...</span>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 border border-gray-800 rounded-lg">
          <p className="text-gray-400">No bookings found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-900/70 border-b border-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    User
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('date')}>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    Appointment Date
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center">
                    <MessageSquare size={14} className="mr-1" />
                    Message
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('createdAt')}>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    Booked On
                    {sortField === 'createdAt' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredBookings.map((booking) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900/30 hover:bg-gray-900/50 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{booking.user.name || 'Unnamed'}</span>
                      <span className="text-xs text-gray-400">{booking.user.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm text-white">{format(new Date(booking.date), 'MMM d, yyyy')}</span>
                      <span className="text-xs text-gray-400">{format(new Date(booking.date), 'h:mm a')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-300 line-clamp-2">{booking.message}</p>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                    {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {booking.contacted ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">
                        <CheckCircle size={12} className="mr-1" />
                        Contacted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-800">
                        <XCircle size={12} className="mr-1" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                    {!booking.contacted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsContacted(booking.id)}
                        className="text-blue-500 hover:text-blue-400 hover:bg-blue-900/20"
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Mark as Contacted
                      </Button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="text-xs text-gray-400 mt-2">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </div>
    </div>
  );
}
