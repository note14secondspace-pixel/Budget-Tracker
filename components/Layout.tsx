import React from 'react';
import { useApp } from '../context/AppContext';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, PlusCircle, Settings } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  const { theme } = useApp();
  
  // Dynamic classes based on state
  const baseClasses = "flex flex-col md:flex-row items-center md:justify-start p-2 md:px-4 md:py-3 rounded-xl transition-all duration-200";
  const activeClasses = isActive 
    ? "text-primary-light dark:text-primary-dark bg-green-50 dark:bg-green-900/20 font-medium" 
    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <Link to={to} className={`${baseClasses} ${activeClasses}`}>
      <span className="mb-1 md:mb-0 md:me-3 text-2xl md:text-xl">{icon}</span>
      <span className="text-[10px] md:text-sm">{label}</span>
    </Link>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useApp();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <LayoutDashboard />, label: t('home') },
    { path: '/transactions', icon: <List />, label: t('all_transactions') },
    { path: '/add', icon: <PlusCircle />, label: t('add_transaction') },
    { path: '/settings', icon: <Settings />, label: t('settings') },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto bg-gray-50 dark:bg-dark-bg overflow-hidden shadow-2xl md:my-8 md:rounded-3xl md:border dark:border-gray-800">
      
      {/* Desktop Sidebar / Mobile Bottom Nav */}
      <nav className="
        fixed md:relative bottom-0 left-0 right-0 z-50 
        md:w-64 bg-white dark:bg-dark-surface 
        border-t md:border-t-0 md:border-e dark:border-gray-800
        pb-safe md:pb-0
      ">
        <div className="hidden md:flex items-center justify-center h-20 border-b dark:border-gray-800">
          <h1 className="text-xl font-bold text-primary-light dark:text-primary-dark tracking-tight">
            {t('app_name')}
          </h1>
        </div>

        <div className="flex md:flex-col justify-around md:justify-start h-16 md:h-auto p-2 md:p-4 space-y-0 md:space-y-2">
          {navItems.map((item) => (
            <NavItem 
              key={item.path}
              to={item.path} 
              icon={item.icon} 
              label={item.label}
              isActive={location.pathname === item.path} 
            />
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen md:h-[calc(100vh-4rem)] pb-20 md:pb-0">
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
