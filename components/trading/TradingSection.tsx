'use client';

import React from 'react';
import LiveHypeDisplay from './LiveHypeDisplay';
import HypeTimelineChart from './HypeTimelineChart';
import SocialFeed from './SocialFeed';

interface Game {
  hypeId: string;
  homeTeam: { name: string; logo: string; hype: number };
  awayTeam: { name: string; logo: string; hype: number };
  status: string;
  goalsA: number;
  goalsB: number;
}

interface LiveData {
  psgHype: number;
  realHype: number;
  tweets: number;
  totalFans: number;
  volume: number;
  activeTraders: number;
  psgOdds: number;
  realOdds: number;
}

interface Trade {
  user: string;
  action: string;
  amount: string;
  time: string;
  profit: string;
}

interface ChartData {
  time: string;
  psg: number;
  real: number;
}

interface TradingSectionProps {
  currentGame: Game;
  liveData: LiveData;
}

const TradingSection: React.FC<TradingSectionProps> = ({
  currentGame,
  liveData,
}) => {
  return (
    <div className="space-y-8">
      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Trading Interface */}
        <div className="xl:col-span-2 space-y-6">
          <LiveHypeDisplay currentGame={currentGame} liveData={liveData} />
        </div>

        {/* Right Column - Social Feed */}
        <div className="space-y-6">
          <SocialFeed currentGame={currentGame} />
        </div>
      </div>
      
      {/* Timeline Chart - Full Width */}
      <div className="w-full">
        <HypeTimelineChart currentGame={currentGame} />
      </div>
    </div>
  );
};

export default TradingSection;