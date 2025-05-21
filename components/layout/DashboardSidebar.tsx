'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function DashboardSidebar({ user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: <User size={20} />,
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: <Settings size={20} />,
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-md bg-gray-800 text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ 
          x: 0,
          width: isCollapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-gray-900 border-r border-gray-800 flex flex-col',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Lazreus Tech
            </Link>
          )}
          
          <button
            onClick={isCollapsed ? toggleSidebar : toggleMobileSidebar}
            className="p-1 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-800">
            <div className="font-medium text-white">{user.name}</div>
            <div className="text-xs text-gray-400">{user.email}</div>
            <div className="mt-1 text-xs px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded-full inline-block">
              {user.role}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-400 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle (Desktop Only) */}
        <div className="hidden md:block p-4 border-t border-gray-800">
          <button
            onClick={toggleSidebar}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-400 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
          >
            <ChevronRight size={20} className={`transform transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
            {!isCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
