'use client';

import React from 'react';
import { Coins, Trophy } from 'lucide-react';

interface StakingHeaderProps {
  activeTab: 'chz' | 'fantoken';
  setActiveTab: (tab: 'chz' | 'fantoken') => void;
}

const StakingHeader: React.FC<StakingHeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Staking Pool
        </h2>
        <p className="text-gray-600">
          Choose your staking strategy and start earning rewards
        </p>
      </div>

      {/* Tab Selection */}
      <div className="flex justify-center">
        <div className="flex bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          <button
            onClick={() => setActiveTab('chz')}
            className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
              activeTab === 'chz'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Coins className="w-5 h-5" />
            <div className="text-left">
              <div className="font-bold">CHZ Staking</div>
              <div className="text-sm opacity-90">Simple & Flexible</div>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('fantoken')}
            className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
              activeTab === 'fantoken'
                ? 'bg-brand-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-brand-600'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <div className="text-left">
              <div className="font-bold">Fan Token Staking</div>
              <div className="text-sm opacity-90">Season Loyalty</div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default StakingHeader; 