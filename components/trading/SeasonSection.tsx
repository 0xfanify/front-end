'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Coins,
  Award,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Minus,
  Eye,
  EyeOff,
  Star,
  Gift,
  DollarSign,
  TrendingDown,
  Activity,
  Info,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAccount } from 'wagmi';

const SeasonSection: React.FC = () => {
  const { address: account, isConnected } = useAccount();
  const [selectedTeam, setSelectedTeam] = useState('PSG');
  const [seasonData, setSeasonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for available fan tokens
  const availableTeams = [
    { 
      symbol: 'PSG', 
      name: 'Paris Saint-Germain', 
      logo: '🔵',
      stakedAmount: '0',
      currentValue: '0',
      seasonStart: '2024-01-15',
      seasonEnd: '2024-12-15'
    },
  ];

  const selectedTeamData = availableTeams.find(team => team.symbol === selectedTeam);

  // Mock season performance data
  const mockSeasonData = {
    PSG: {
      wins: 0,
      losses: 0,
      draws: 0,
      gamesNotPlayed: 0,
      totalGames: 0,
      winRate: 0,
      yieldEarned: 0,
      estimatedSeasonYield: 0,
      position: 0,
      totalTeams: 20,
      recentGames: []
    }
  };

  // Load season data when team changes
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSeasonData(mockSeasonData[selectedTeam as keyof typeof mockSeasonData] || null);
      setLoading(false);
    }, 500);
  }, [selectedTeam]);

  const getResultIcon = (result: string, played: boolean) => {
    if (!played) return <EyeOff className="w-4 h-4 text-gray-400" />;
    
    switch (result) {
      case 'win':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'loss':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'draw':
        return <Minus className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getResultColor = (result: string, played: boolean) => {
    if (!played) return 'bg-gray-100 text-gray-600';
    
    switch (result) {
      case 'win':
        return 'bg-green-100 text-green-700';
      case 'loss':
        return 'bg-red-100 text-red-700';
      case 'draw':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const calculateDaysRemaining = () => {
    if (!selectedTeamData) return 0;
    const endDate = new Date(selectedTeamData.seasonEnd);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const hasStake = selectedTeamData && parseFloat(selectedTeamData.stakedAmount) > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Season Dashboard
        </h2>
        <p className="text-gray-600">
          Track your Fan Token performance throughout the season
        </p>
      </div>

      {/* Team Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4 mb-4">
          <Trophy className="w-6 h-6 text-brand-600" />
          <h3 className="text-xl font-bold text-gray-900">Select Your Team</h3>
        </div>
        
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="w-full h-16 text-lg">
            <SelectValue>
              {selectedTeamData && (
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{selectedTeamData.logo}</span>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">{selectedTeamData.name}</div>
                    <div className="text-sm text-gray-600">
                      {hasStake ? `${selectedTeamData.stakedAmount} ${selectedTeam} staked` : 'No stake yet'}
                    </div>
                  </div>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableTeams.map((team) => (
              <SelectItem key={team.symbol} value={team.symbol}>
                <div className="flex items-center space-x-3 py-2">
                  <span className="text-2xl">{team.logo}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{team.name}</div>
                    <div className="text-sm text-gray-600">
                      {parseFloat(team.stakedAmount) > 0 
                        ? `${team.stakedAmount} ${team.symbol} staked`
                        : 'No stake'
                      }
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Season Overview */}
      {selectedTeamData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stake Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Your Stake</h4>
                <p className="text-sm text-gray-600">Season commitment</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Staked Amount:</span>
                <span className="font-bold text-gray-900">{selectedTeamData.stakedAmount} {selectedTeam}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Value:</span>
                <span className="font-bold text-brand-600">{selectedTeamData.currentValue} HYPE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bonus Applied:</span>
                <span className="font-bold text-green-600">+50%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Days Remaining:</span>
                <span className="font-bold text-blue-600">{calculateDaysRemaining()} days</span>
              </div>
            </div>

            {!hasStake && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-700 text-sm text-center mb-3">
                  You haven't staked {selectedTeam} tokens yet. Go to Staking to start earning season rewards!
                </p>
                <div className="text-center">
                  <a 
                    href="https://socios.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <span>Buy PSG tokens at socios.com</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Season Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Season Progress</h4>
                <p className="text-sm text-gray-600">2024 Championship</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Season Start:</span>
                <span className="font-bold text-gray-900">Jan 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Season End:</span>
                <span className="font-bold text-gray-900">Dec 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Progress:</span>
                <span className="font-bold text-blue-600">78%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>

          {/* Yield Rewards */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Yield Rewards</h4>
                <p className="text-sm text-gray-600">Performance based</p>
              </div>
            </div>
            
            {hasStake && seasonData ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Earned This Season:</span>
                  <span className="font-bold text-green-600">{seasonData.yieldEarned} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Total:</span>
                  <span className="font-bold text-blue-600">{seasonData.estimatedSeasonYield} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Win Rate:</span>
                  <span className="font-bold text-gray-900">{seasonData.winRate}%</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <DollarSign className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No stake = No rewards</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Performance Stats */}
      {seasonData && hasStake && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">Season Performance</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-2xl font-bold text-green-600">{seasonData.wins}</div>
              <div className="text-sm text-green-700">Wins</div>
              <div className="text-xs text-gray-500 mt-1">You played: {seasonData.wins}</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="text-2xl font-bold text-red-600">{seasonData.losses}</div>
              <div className="text-sm text-red-700">Losses</div>
              <div className="text-xs text-gray-500 mt-1">You played: {seasonData.losses}</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{seasonData.draws}</div>
              <div className="text-sm text-yellow-700">Draws</div>
              <div className="text-xs text-gray-500 mt-1">You played: {seasonData.draws}</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">{seasonData.gamesNotPlayed}</div>
              <div className="text-sm text-gray-700">Not Played</div>
              <div className="text-xs text-gray-500 mt-1">You skipped</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">#{seasonData.position}</div>
              <div className="text-sm text-purple-700">Position</div>
              <div className="text-xs text-gray-500 mt-1">of {seasonData.totalTeams} teams</div>
            </div>
          </div>

          {/* Recent Games */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Recent Games</h4>
            <div className="space-y-3">
              {seasonData.recentGames.map((game: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getResultIcon(game.result, game.played)}
                    <div>
                      <div className="font-medium text-gray-900">vs {game.opponent}</div>
                      <div className="text-sm text-gray-600">{game.date}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{game.score}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${getResultColor(game.result, game.played)}`}>
                        {!game.played ? 'Not Played' : game.result.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Stake Message */}
      {!hasStake && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Season Stake for {selectedTeamData?.name}
          </h3>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't staked {selectedTeam} tokens yet. Start staking to track your team's performance and earn season rewards!
          </p>

          <div className="space-y-4">
            <Button className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-xl">
              <Coins className="w-5 h-5 mr-2" />
              Go to Staking
            </Button>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Don't have PSG tokens?</p>
              <a 
                href="https://socios.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <span>Buy at socios.com</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonSection;