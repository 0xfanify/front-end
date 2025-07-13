import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Clock, TrendingUp, Activity } from 'lucide-react';
import { createPublicClient, getContract, http } from 'viem';
import { spicy } from 'viem/chains';
import deployedContracts from '@/lib/deployedContracts';

interface Game {
  homeTeam: { name: string; logo: string };
  awayTeam: { name: string; logo: string };
  hypeId: string;
}

interface HypeTimelineChartProps {
  currentGame: Game;
}

const HypeTimelineChart: React.FC<HypeTimelineChartProps> = ({ currentGame }) => {
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [gameStartTime] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000)); // 2 hours from now
  const [currentHype, setCurrentHype] = useState<{ home: number; away: number } | null>(null);
  
  const publicClient = createPublicClient({ chain: spicy, transport: http() });

  // Fetch real hype data from blockchain
  useEffect(() => {
    const fetchCurrentHype = async () => {
      if (!currentGame?.hypeId) return;
      
      try {
        const oracleContract = getContract({
          address: deployedContracts.Oracle.address as `0x${string}`,
          abi: deployedContracts.Oracle.abi,
          client: publicClient,
        });
        const data = await oracleContract.read.getHype([
          currentGame.hypeId as `0x${string}`
        ]);
        const hypeA = Number(data[0]) / 100;
        const hypeB = Number(data[1]) / 100;
        setCurrentHype({ home: hypeA, away: hypeB });
      } catch (err) {
        setCurrentHype(null);
      }
    };
    
    fetchCurrentHype();
  }, [currentGame?.hypeId]);
  
  // Generate timeline data with mock historical and real current data
  useEffect(() => {
    const generateTimelineData = () => {
      const data = [];
      const now = new Date();
      const startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      
      // Generate data for each day
      for (let i = 0; i <= 9; i++) { // 7 days historical + today + 2 days prediction
        const time = new Date(startTime.getTime() + i * 24 * 60 * 60 * 1000);
        const isToday = time.toDateString() === now.toDateString();
        const isHistorical = time < now;
        const isPrediction = time > now && time <= gameStartTime;
        
        let dayName;
        if (isToday) {
          dayName = 'Today';
        } else if (time.getTime() === now.getTime() + 24 * 60 * 60 * 1000) {
          dayName = 'Tomorrow';
        } else {
          dayName = time.toLocaleDateString('en-US', { weekday: 'short' });
        }
        
        if (isHistorical || isToday) {
          // Historical data with some variation
          let hypeA, hypeB;
          
          if (isToday && currentHype) {
            // Use real data for today
            hypeA = currentHype.home;
            hypeB = currentHype.away;
          } else {
            // Mock historical data with realistic progression
            const baseHypeA = 45 + Math.sin(i * 0.4) * 15 + (Math.random() - 0.5) * 10;
            hypeA = Math.max(20, Math.min(80, baseHypeA));
            hypeB = 100 - hypeA;
          }
          
          data.push({
            day: dayName,
            timestamp: time.getTime(),
            [currentGame.homeTeam.name]: Math.round(hypeA),
            [currentGame.awayTeam.name]: Math.round(hypeB),
            type: isToday ? 'current' : 'historical'
          });
        } else if (isPrediction) {
          // Prediction data (dotted line) - trending toward current hype
          const trend = currentHype ? 
            (currentHype.home - 50) * 0.1 : // Slight trend based on current hype
            (Math.random() - 0.5) * 2;
          
          const baseHypeA = currentHype ? 
            currentHype.home + trend * (i - 7) + (Math.random() - 0.5) * 5 :
            55 + trend * (i - 7) + (Math.random() - 0.5) * 5;
          
          const hypeA = Math.max(25, Math.min(75, baseHypeA));
          const hypeB = 100 - hypeA;
          
          data.push({
            day: dayName,
            timestamp: time.getTime(),
            [`${currentGame.homeTeam.name}_predicted`]: Math.round(hypeA),
            [`${currentGame.awayTeam.name}_predicted`]: Math.round(hypeB),
            type: 'prediction'
          });
        }
      }
      
      return data;
    };

    setTimelineData(generateTimelineData());
    
    // Update every 60 seconds
    const interval = setInterval(() => {
      setTimelineData(generateTimelineData());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [currentGame, gameStartTime, currentHype]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPrediction = data.type === 'prediction';
      const isCurrent = data.type === 'current';
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {isPrediction && (
            <p className="text-xs text-amber-600 mb-2 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Predicted Hype
            </p>
          )}
          {isCurrent && (
            <p className="text-xs text-green-600 mb-2 flex items-center">
              <Activity className="w-3 h-3 mr-1" />
              Live Data
            </p>
          )}
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name.replace('_predicted', ' (predicted)')}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const todayLabel = 'Today';
  const gameStartLabel = gameStartTime.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Hype Timeline</h3>
          <p className="text-gray-600">7-day historical data and predictions until game start</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-brand-500 rounded-full"></div>
            <span className="text-gray-600">Historical</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Current</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 border-2 border-amber-500 rounded-full bg-amber-100"></div>
            <span className="text-gray-600">Predicted</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ value: 'Hype %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="line"
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            
            {/* Today reference line */}
            <ReferenceLine 
              x={todayLabel} 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: "Today", position: "top", fill: "#10b981", fontSize: 12 }}
            />
            
            {/* Game start time reference line */}
            <ReferenceLine 
              x={gameStartLabel} 
              stroke="#ef4444" 
              strokeWidth={2}
              label={{ value: "Game Day", position: "top", fill: "#ef4444", fontSize: 12 }}
            />
            
            {/* Historical and current lines */}
            <Line
              type="monotone"
              dataKey={currentGame.homeTeam.name}
              stroke="#e11d48"
              strokeWidth={3}
              dot={{ r: 4, fill: "#e11d48" }}
              activeDot={{ r: 6, fill: "#e11d48" }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey={currentGame.awayTeam.name}
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#3b82f6" }}
              activeDot={{ r: 6, fill: "#3b82f6" }}
              connectNulls={false}
            />
            
            {/* Prediction lines (dotted) */}
            <Line
              type="monotone"
              dataKey={`${currentGame.homeTeam.name}_predicted`}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={{ r: 3, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 5, fill: "#f59e0b" }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey={`${currentGame.awayTeam.name}_predicted`}
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={{ r: 3, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 5, fill: "#8b5cf6" }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-semibold text-green-800">Current Data</span>
          </div>
          <p className="text-green-700 text-sm">Live hype from blockchain</p>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-amber-800">Prediction Zone</span>
          </div>
          <p className="text-amber-700 text-sm">AI-powered hype forecasting</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-red-600" />
            <span className="font-semibold text-red-800">Game Day</span>
          </div>
          <p className="text-red-700 text-sm">Odds will be locked on game day</p>
        </div>
      </div>
    </div>
  );
};

export default HypeTimelineChart;