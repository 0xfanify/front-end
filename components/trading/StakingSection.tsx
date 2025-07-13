'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import StakingHeader from './staking/StakingHeader';
import ChzStaking from './staking/ChzStaking';
import FanTokenStaking from './staking/FanTokenStaking';
import StakingComparison from './staking/StakingComparison';
import FeedbackMessages from './staking/FeedbackMessages';

const StakingSection: React.FC = () => {
  const { address: account, isConnected } = useAccount();
  const { balance: chzBalance, hypeBalance } = useWalletBalance();
  const [activeTab, setActiveTab] = useState<'chz' | 'fantoken'>('chz');
  
  // Fan Token Staking States
  const [selectedTeam, setSelectedTeam] = useState('PSG'); // Default PSG
  const [fanTokenLoading, setFanTokenLoading] = useState(false);
  const [fanTokenUnstakeLoading, setFanTokenUnstakeLoading] = useState(false);
  
  // General States
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mock staked amounts (replace with real data from contracts)
  const [stakedAmounts, setStakedAmounts] = useState({
    CHZ: '250.0',
    PSG: '0'
  });

  // Mock data for fan tokens
  const [availableTeams, setAvailableTeams] = useState([
    { symbol: 'PSG', name: 'Paris Saint-Germain', logo: '🔵', balance: '5' },
  ]);

  // Fan Token Staking function
  const handleFanTokenStake = async (amount: string, team: string) => {
    setError(null);
    setSuccess(null);
    setFanTokenLoading(true);
    
    try {
      if (!account || !amount) throw new Error('Connect wallet and enter amount.');
      
      // Mock staking logic - replace with real contract calls
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction
      
      const fanTokenToHype = (fanToken: string) => {
        const fanTokenAmount = parseFloat(fanToken || '0');
        const baseHype = fanTokenAmount * 1800; // 1 Fan Token = 1.800 HYPE base
        const bonus = baseHype * 0.5; // +50% bonus
        return (baseHype + bonus).toFixed(0);
      };
      
      // Update available balance - spend 1 token
      const currentBalance = parseFloat(availableTeams.find(t => t.symbol === team)?.balance || '0');
      const newBalance = Math.max(0, currentBalance - 1); // Spend 1 token, minimum 0
      
      // Update the availableTeams array
      const updatedTeams = availableTeams.map(teamData => 
        teamData.symbol === team 
          ? { ...teamData, balance: newBalance.toString() }
          : teamData
      );
      
      setAvailableTeams(updatedTeams);
      
      // Update staked amounts
      setStakedAmounts(prev => ({
        ...prev,
        [team]: (parseFloat(prev[team as keyof typeof prev] || '0') + 1).toFixed(1)
      }));
      
      setSuccess(`Successfully staked 1 ${team} and received ${fanTokenToHype('1')} HYPE with 50% bonus!`);
    } catch (err: any) {
      setError(err?.message || 'Error staking Fan Token');
    }
    
    setFanTokenLoading(false);
  };

  // Fan Token Unstaking function
  const handleFanTokenUnstake = async (amount: string, team: string) => {
    setError(null);
    setSuccess(null);
    setFanTokenUnstakeLoading(true);
    
    try {
      if (!account || !amount) throw new Error('Connect wallet and enter amount.');
      
      // Mock unstaking logic - replace with real contract calls
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction
      
      setSuccess(`Successfully unstaked ${amount} ${team}!`);
      
      // Update staked amounts
      setStakedAmounts(prev => ({
        ...prev,
        [team]: (parseFloat(prev[team as keyof typeof prev] || '0') - parseFloat(amount)).toFixed(1)
      }));
    } catch (err: any) {
      setError(err?.message || 'Error unstaking Fan Token');
    }
    
    setFanTokenUnstakeLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <StakingHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      {activeTab === 'chz' ? (
        <ChzStaking />
      ) : (
        <FanTokenStaking
          account={account}
          selectedTeam={selectedTeam}
          availableTeams={availableTeams}
          stakedAmount={stakedAmounts[selectedTeam as keyof typeof stakedAmounts]}
          onStake={handleFanTokenStake}
          onUnstake={handleFanTokenUnstake}
          loading={fanTokenLoading}
          unstakeLoading={fanTokenUnstakeLoading}
        />
      )}

      <FeedbackMessages error={error} success={success} />
      <StakingComparison />
    </div>
  );
};

export default StakingSection;