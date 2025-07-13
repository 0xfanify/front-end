import React from 'react';
import { Circle } from 'lucide-react';

interface Game {
  homeTeam: { name: string; logo: string };
  awayTeam: { name: string; logo: string };
}

interface LiveData {
  psgOdds: number;
  realOdds: number;
}

interface OddsDisplayProps {
  currentGame: Game;
  odds: { oddsA: string; oddsB: string } | null;
  oddsLoading: boolean;
  gameStarted: boolean;
  liveData: LiveData;
}

const OddsDisplay: React.FC<OddsDisplayProps> = ({ 
  currentGame, 
  odds, 
  oddsLoading, 
  gameStarted, 
  liveData 
}) => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <div className="bg-gradient-to-r from-brand-50 to-pink-50 p-6 rounded-2xl border border-brand-200/50">
        <div className="flex items-center space-x-3 mb-3">
          <span className="text-2xl">{currentGame.homeTeam.logo}</span>
          <span className="font-bold text-gray-900">{currentGame.homeTeam.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Odds:</span>
          <span className="text-2xl font-bold text-brand-600">
            {oddsLoading
              ? '...'
              : odds?.oddsA
                ? `${parseFloat(odds.oddsA).toFixed(2)}x`
                : 'Calculating...'}
          </span>
        </div>
        {!gameStarted && (
          <div className="text-xs text-gray-500 mt-2 flex items-center">
            <Circle className="w-2 h-2 mr-1 animate-pulse" />
            Updating live
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200/50">
        <div className="flex items-center space-x-3 mb-3">
          <span className="text-2xl">{currentGame.awayTeam.logo}</span>
          <span className="font-bold text-gray-900">{currentGame.awayTeam.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Odds:</span>
          <span className="text-2xl font-bold text-blue-600">
            {oddsLoading
              ? '...'
              : odds?.oddsB
                ? `${parseFloat(odds.oddsB).toFixed(2)}x`
                : 'Calculating...'}
          </span>
        </div>
        {!gameStarted && (
          <div className="text-xs text-gray-500 mt-2 flex items-center">
            <Circle className="w-2 h-2 mr-1 animate-pulse" />
            Updating live
          </div>
        )}
      </div>
    </div>
  );
};

export default OddsDisplay;