import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  DollarSign,
  PieChart,
  Clock,
  Target,
  Award,
  Coins
} from 'lucide-react';

interface PoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGame: {
    homeTeam: { name: string; logo: string };
    awayTeam: { name: string; logo: string };
  };
}

const PoolModal: React.FC<PoolModalProps> = ({ isOpen, onClose, currentGame }) => {
  // Mock data - replace with real data
  const poolData = {
    totalPool: 10000,
    teamAPool: 6200,
    teamBPool: 3800,
    totalBettors: 1247,
    teamABettors: 789,
    teamBBettors: 458,
    averageBet: 8,
    biggestBet: 150,
    timeRemaining: '1h 23m',
    estimatedPayout: {
      teamA: 1.62,
      teamB: 2.61
    }
  };

  const teamAPercentage = (poolData.teamAPool / poolData.totalPool) * 100;
  const teamBPercentage = (poolData.teamBPool / poolData.totalPool) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span>Prize Pool Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Total Pool */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-8 text-center">
            <div className="text-5xl font-black text-purple-600 mb-3">
              {poolData.totalPool.toLocaleString()} HYPE
            </div>
            <div className="text-xl text-gray-700 font-semibold mb-2">Total Prize Pool</div>
            <div className="text-gray-600">
              Will be distributed to all winners proportionally
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center">
              <Target className="w-6 h-6 mr-3 text-purple-600" />
              How Prize Distribution Works
            </h3>
            
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">1</div>
                <div>
                  <div className="font-bold text-lg text-gray-900 mb-1">All bets go into one big pool</div>
                  <div className="text-gray-600">Everyone's bets are combined into a single prize pool</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">2</div>
                <div>
                  <div className="font-bold text-lg text-gray-900 mb-1">Winners share the entire pool</div>
                  <div className="text-gray-600">Your share depends on how much you bet compared to other winners</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">3</div>
                <div>
                  <div className="font-bold text-lg text-gray-900 mb-1">Automatic distribution after game</div>
                  <div className="text-gray-600">Winners automatically receive their share when the game ends</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PoolModal;