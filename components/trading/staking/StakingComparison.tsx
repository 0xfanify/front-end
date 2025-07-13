'use client';

import React from 'react';

const StakingComparison: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Staking vs Unstaking</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
              <th className="text-center py-3 px-4 font-semibold text-purple-600">CHZ</th>
              <th className="text-center py-3 px-4 font-semibold text-brand-600">Fan Token</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 font-medium text-gray-700">Stake</td>
              <td className="py-3 px-4 text-center text-gray-600">Get HYPE, bet freely</td>
              <td className="py-3 px-4 text-center text-green-600">Get HYPE +50%, season lock</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 font-medium text-gray-700">Unstake</td>
              <td className="py-3 px-4 text-center text-gray-600">Get CHZ back anytime</td>
              <td className="py-3 px-4 text-center text-amber-600">Get USD + rewards, end season</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-3 px-4 font-medium text-gray-700">Lock Period</td>
              <td className="py-3 px-4 text-center text-green-600">Flexible</td>
              <td className="py-3 px-4 text-center text-amber-600">Until season ends</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-gray-700">Rewards</td>
              <td className="py-3 px-4 text-center text-gray-600">Betting profits only</td>
              <td className="py-3 px-4 text-center text-green-600">Betting + season yield</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StakingComparison; 