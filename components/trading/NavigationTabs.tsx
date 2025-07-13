'use client';

import React, { useState } from 'react';
import { 
  TrendingUp,
  Coins,
  Gift,
  ChevronDown,
  BarChart3,
  Wallet,
  Trophy,
  Settings,
  HelpCircle,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationTabsProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeSection,
  onSectionChange
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationSections = [
    {
      id: 'trading',
      label: 'Live Trading',
      icon: TrendingUp,
      color: 'text-brand-600',
      description: 'Trade in real-time'
    },
    {
      id: 'staking',
      label: 'Staking Pool',
      icon: Coins,
      color: 'text-purple-600',
      description: 'Stake your tokens'
    },
    {
      id: 'rewards',
      label: 'Rewards Hub',
      icon: Gift,
      color: 'text-pink-600',
      description: 'Claim your rewards'
    },
  ];

  const menuItems = [
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: BarChart3,
      description: 'View your investments',
      action: () => console.log('Portfolio clicked')
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: Wallet,
      description: 'Manage your funds',
      action: () => console.log('Wallet clicked')
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      description: 'Top traders ranking',
      action: () => console.log('Leaderboard clicked')
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Account settings',
      action: () => console.log('Profile clicked')
    },
  ];

  const quickActions = [
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      action: () => console.log('Settings clicked')
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      action: () => console.log('Help clicked')
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
        {/* Main Navigation Tabs */}
        <div className="flex items-center space-x-1 flex-1">
          {navigationSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`group flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 flex-1 justify-center relative overflow-hidden ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600 hover:scale-102'
                }`}
              >
                {/* Background animation for active state */}
                {activeSection === section.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-500 opacity-20 animate-pulse"></div>
                )}
                
                <IconComponent className={`w-5 h-5 transition-transform duration-300 ${
                  activeSection === section.id ? 'scale-110' : 'group-hover:scale-110'
                }`} />
                <span className="font-semibold text-sm relative z-10">{section.label}</span>
                
                {/* Active indicator */}
                {activeSection === section.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Dropdown Menu */}
        <div className="ml-4">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 border-2 ${
                isMenuOpen 
                  ? 'bg-brand-50 border-brand-200 text-brand-700 shadow-md' 
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-brand-200 hover:text-brand-600'
              }`}>
                <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="font-semibold text-sm">Menu</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                  isMenuOpen ? 'rotate-180' : ''
                }`} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              className="w-72 p-2 shadow-xl border-0 rounded-2xl bg-white/95 backdrop-blur-sm"
              align="end"
              sideOffset={8}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 mb-2">
                <h3 className="font-bold text-gray-900 text-sm">Quick Actions</h3>
                <p className="text-xs text-gray-500 mt-1">Access your tools and settings</p>
              </div>

              {/* Main Menu Items */}
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={item.action}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-brand-50 hover:to-purple-50 transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:from-brand-100 group-hover:to-purple-100 transition-all duration-200">
                        <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-brand-600 transition-colors duration-200" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </div>

              <DropdownMenuSeparator className="my-3 bg-gray-100" />

              {/* Quick Actions */}
              <div className="space-y-1">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <DropdownMenuItem
                      key={action.id}
                      onClick={action.action}
                      className="flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <IconComponent className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                        {action.label}
                      </span>
                    </DropdownMenuItem>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="px-4 py-2">
                  <div className="text-xs text-gray-400 text-center">
                    Fanify Trading Platform v2.0
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Section Info */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
          {(() => {
            const activeTab = navigationSections.find(s => s.id === activeSection);
            if (!activeTab) return null;
            const IconComponent = activeTab.icon;
            return (
              <>
                <IconComponent className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-medium text-gray-700">{activeTab.description}</span>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default NavigationTabs;