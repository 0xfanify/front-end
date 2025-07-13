'use client';

import React, { useState } from 'react';
import { 
  TrendingUp,
  Coins,
  Gift,
  BarChart3,
  Wallet,
  Trophy,
  Settings,
  HelpCircle,
  User,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
  Activity,
  CreditCard,
  Users,
  FileText,
  Shield,
  LogOut,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarMenuProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  activeSection,
  onSectionChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const mainNavItems = [
    {
      id: 'trading',
      label: 'Live Trading',
      icon: TrendingUp,
      badge: 'Live',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'staking',
      label: 'Staking Pool',
      icon: Coins,
      badge: '18.5%',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'rewards',
      label: 'Rewards Hub',
      icon: Gift,
      badge: '3',
      badgeColor: 'bg-brand-500'
    },
    {
      id: 'season',
      label: 'Season',
      icon: Trophy,
    },
  ];

  const secondaryNavItems = [
    {
      id: 'fantokens',
      label: 'Fan Tokens',
      icon: Coins,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: CreditCard,
    },
  ];

  const supportItem = {
    id: 'support',
    label: 'Documentation',
    icon: HelpCircle,
    href: 'https://0xfanify.github.io/documentation/',
    external: true
  };

  const NavItem = ({ item, isActive, onClick }: any) => {
    const IconComponent = item.icon;
    
    return (
      <button
        onClick={() => onClick(item.id)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
          isActive 
            ? "bg-brand-500 text-white shadow-lg" 
            : "text-gray-600 hover:bg-gray-50 hover:text-brand-600"
        )}
      >
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
          isActive 
            ? "bg-white/20" 
            : "bg-gray-100 group-hover:bg-brand-100"
        )}>
          <IconComponent className={cn(
            "w-4 h-4 transition-colors duration-200",
            isActive 
              ? "text-white" 
              : "text-gray-600 group-hover:text-brand-600"
          )} />
        </div>
        
        {!isCollapsed && (
          <>
            <span className="font-medium text-sm flex-1 text-left">
              {item.label}
            </span>
            
            {item.badge && (
              <div className={cn(
                "px-2 py-0.5 rounded-full text-xs font-bold text-white",
                item.badgeColor
              )}>
                {item.badge}
              </div>
            )}
          </>
        )}
        
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
        )}
      </button>
    );
  };

  const ExternalNavItem = ({ item }: any) => {
    const IconComponent = item.icon;
    
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative text-gray-600 hover:bg-gray-50 hover:text-brand-600"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 bg-gray-100 group-hover:bg-brand-100">
          <IconComponent className="w-4 h-4 transition-colors duration-200 text-gray-600 group-hover:text-brand-600" />
        </div>
        
        {!isCollapsed && (
          <>
            <span className="font-medium text-sm flex-1 text-left">
              {item.label}
            </span>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-brand-600" />
          </>
        )}
      </a>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <h1 className="font-black text-gray-900">Fanify</h1>
              <p className="text-xs text-gray-500">Trading Platform</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex w-8 h-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 px-4 py-2 space-y-6">
        {/* Primary Actions */}
        <div className="space-y-1">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Trading
            </h3>
          )}
          {mainNavItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              onClick={onSectionChange}
            />
          ))}
        </div>

        {/* Secondary Actions */}
        <div className="space-y-1">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Tools
            </h3>
          )}
          {secondaryNavItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              onClick={onSectionChange}
            />
          ))}
        </div>

        {/* Support */}
        <div className="space-y-1">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Support
            </h3>
          )}
          <ExternalNavItem item={supportItem} />
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 group-hover:bg-red-200 transition-all duration-200">
            <LogOut className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <span className="font-medium text-sm">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 p-0 bg-white shadow-lg border border-gray-200"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-72"
      )}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative w-72 h-full">
            <SidebarContent />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarMenu;