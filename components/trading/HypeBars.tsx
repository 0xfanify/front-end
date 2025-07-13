import React from 'react';
import { Activity } from 'lucide-react';

interface Game {
  homeTeam: { name: string; logo: string };
  awayTeam: { name: string; logo: string };
}

interface HypeBarsProps {
  currentGame: Game;
  hype: { home: number; away: number } | null;
  hypeLoading: boolean;
}

const HypeBars: React.FC<HypeBarsProps> = ({ currentGame, hype, hypeLoading }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Current Hype Distribution</h3>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">Live Updates</span>
        </div>
      </div>
      
      {/* Team A Hype Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentGame.homeTeam.logo}</span>
            <span className="font-bold text-gray-900 text-lg">{currentGame.homeTeam.name}</span>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-brand-600">
              {hypeLoading ? '...' : hype ? `${Math.round(hype.home)}%` : '...'}
            </div>
            <div className="text-sm text-gray-500">Fan Hype</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-brand-500 to-brand-600 h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
            style={{ width: `${hype ? hype.home : 0}%` }}
          >
            {hype && hype.home > 15 && (
              <span className="text-white text-sm font-bold">{Math.round(hype.home)}%</span>
            )}
          </div>
        </div>
      </div>

      {/* Team B Hype Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentGame.awayTeam.logo}</span>
            <span className="font-bold text-gray-900 text-lg">{currentGame.awayTeam.name}</span>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-blue-600">
              {hypeLoading ? '...' : hype ? `${Math.round(hype.away)}%` : '...'}
            </div>
            <div className="text-sm text-gray-500">Fan Hype</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
            style={{ width: `${hype ? hype.away : 0}%` }}
          >
            {hype && hype.away > 15 && (
              <span className="text-white text-sm font-bold">{Math.round(hype.away)}%</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HypeBars;