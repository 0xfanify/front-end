import React, { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { 
  TrendingUp,
  RefreshCw,
  Circle,
  Clock,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useAccount } from "wagmi";
import { createWalletClient, custom, getContract, formatEther, parseEther, createPublicClient, http } from 'viem';
import { spicy } from 'viem/chains';
import deployedContracts from '@/lib/deployedContracts';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import HypeBars from './HypeBars';
import OddsDisplay from './OddsDisplay';
import BettingInterface from './BettingInterface';
import PoolModal from './PoolModal';

interface Game {
  homeTeam: { name: string; logo: string; hype: number };
  awayTeam: { name: string; logo: string; hype: number };
  hypeId: string;
}

interface LiveData {
  psgOdds: number;
  realOdds: number;
}

interface LiveHypeDisplayProps {
  currentGame: Game;
  liveData: LiveData;
}

const LiveHypeDisplay: React.FC<LiveHypeDisplayProps> = ({
  currentGame,
  liveData
}) => {
  const { address: account, isConnected } = useAccount();
  const { hypeBalance } = useWalletBalance();
  const [betAmount, setBetAmount] = useState("");
  const [approveAmount, setApproveAmount] = useState("");
  const [allowance, setAllowance] = useState("0");
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingBet, setLoadingBet] = useState<'A' | 'B' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [odds, setOdds] = useState<{ oddsA: string; oddsB: string } | null>(null);
  const [oddsLoading, setOddsLoading] = useState(false);
  const [hype, setHype] = useState<{ home: number; away: number } | null>(null);
  const [hypeLoading, setHypeLoading] = useState(false);
  const [matchInfo, setMatchInfo] = useState<{ status: number; goalsA: number; goalsB: number } | null>(null);
  const [matchInfoLoading, setMatchInfoLoading] = useState(false);
  const [poolModalOpen, setPoolModalOpen] = useState(false);

  // Mock data for game start time (replace with real data)
  const gameStartTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
  const [timeToStart, setTimeToStart] = useState<string>("");

  const publicClient = createPublicClient({ chain: spicy, transport: http() });

  // Calculate time remaining
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = gameStartTime.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeToStart(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeToStart("Game Started");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStartTime]);

  // Fetch allowance
  useEffect(() => {
    const fetchAllowance = async () => {
      if (!account) {
        setAllowance('0');
        return;
      }
      try {
        const publicClient = createWalletClient({ chain: spicy, transport: custom(window.ethereum as any) });
        const hypeTokenContract = getContract({
          address: deployedContracts.HypeToken.address as `0x${string}`,
          abi: deployedContracts.HypeToken.abi,
          client: publicClient,
        });
        const allowanceValue = await hypeTokenContract.read.allowance([
          account as `0x${string}`,
          deployedContracts.Funify.address as `0x${string}`,
        ]);
        setAllowance(formatEther(allowanceValue as bigint));
      } catch (err) {
        setAllowance('0');
      }
    };
    if (isConnected) fetchAllowance();
  }, [account, isConnected, success]);

  // Approve HYPE
  const handleApprove = async () => {
    setError(null);
    setSuccess(null);
    setLoadingApprove(true);
    try {
      if (!account || !approveAmount) throw new Error('Connect wallet and enter approve amount.');
      const walletClient = createWalletClient({ chain: spicy, transport: custom(window.ethereum as any) });
      const hypeTokenContract = getContract({
        address: deployedContracts.HypeToken.address as `0x${string}`,
        abi: deployedContracts.HypeToken.abi,
        client: walletClient,
      });
      await hypeTokenContract.write.approve([
        deployedContracts.Funify.address as `0x${string}`,
        parseEther(approveAmount)
      ], { account: account as `0x${string}` });
      setSuccess('Tokens approved!');
      
      // Refetch allowance after approve with retry logic
      const refetchAllowance = async (retries = 3) => {
        try {
          const hypeTokenContract = getContract({
            address: deployedContracts.HypeToken.address as `0x${string}`,
            abi: deployedContracts.HypeToken.abi,
            client: publicClient,
          });
          const allowanceValue = await hypeTokenContract.read.allowance([
            account as `0x${string}`,
            deployedContracts.Funify.address as `0x${string}`,
          ]);
          const newAllowance = formatEther(allowanceValue as bigint);
          setAllowance(newAllowance);
          
          // If allowance is still not enough and we have retries left, try again
          if (Number(newAllowance) < Number(approveAmount) && retries > 0) {
            setTimeout(() => refetchAllowance(retries - 1), 2000);
          }
        } catch (err) {
          if (retries > 0) {
            setTimeout(() => refetchAllowance(retries - 1), 2000);
          }
        }
      };
      
      // Start refetching with a small delay
      setTimeout(() => refetchAllowance(), 1000);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Error approving tokens');
      return false;
    }
    setLoadingApprove(false);
  };

  // Place bet
  const handleBet = async (teamA: boolean) => {
    setError(null);
    setSuccess(null);
    setLoadingBet(teamA ? 'A' : 'B');
    try {
      if (!account || !betAmount) throw new Error('Connect wallet and enter amount.');
      if (!currentGame || !currentGame.hypeId) throw new Error('Select a game first.');
      const walletClient = createWalletClient({ chain: spicy, transport: custom(window.ethereum as any) });
      const funifyContract = getContract({
        address: deployedContracts.Funify.address as `0x${string}`,
        abi: deployedContracts.Funify.abi,
        client: walletClient,
      });
      await funifyContract.write.placeBet([
        currentGame.hypeId as `0x${string}`,
        teamA,
        parseEther(betAmount)
      ], { account: account as `0x${string}` });
      setSuccess('Bet placed successfully!');
    } catch (err: any) {
      setError(err?.message || 'Error placing bet');
    }
    setLoadingBet(null);
  };

  useEffect(() => {
    const fetchOdds = async () => {
      setOddsLoading(true);
      if (!currentGame?.hypeId) {
        setOdds(null);
        setOddsLoading(false);
        return;
      }
      try {
        const funifyContract = getContract({
          address: deployedContracts.Funify.address as `0x${string}`,
          abi: deployedContracts.Funify.abi,
          client: publicClient,
        });
        const data = await funifyContract.read.getOdds([
          currentGame.hypeId as `0x${string}`
        ]);
        setOdds({
          oddsA: formatEther(data[0]),
          oddsB: formatEther(data[1]),
        });
      } catch (err) {
        setOdds(null);
      }
      setOddsLoading(false);
    };
    fetchOdds();
  }, [currentGame?.hypeId]);

  // Fetch hype from blockchain
  useEffect(() => {
    const fetchHype = async () => {
      setHypeLoading(true);
      if (!currentGame?.hypeId) {
        setHype(null);
        setHypeLoading(false);
        return;
      }
      try {
        const oracleContract = getContract({
          address: deployedContracts.Oracle.address as `0x${string}`,
          abi: deployedContracts.Oracle.abi,
          client: publicClient,
        });
        const data = await oracleContract.read.getHype([
          currentGame.hypeId as `0x${string}`
        ]);
        // Remove two zeros and convert to percentage
        const hypeA = Number(data[0]) / 100;
        const hypeB = Number(data[1]) / 100;
        setHype({ home: hypeA, away: hypeB });
      } catch (err) {
        setHype(null);
      }
      setHypeLoading(false);
    };
    fetchHype();
  }, [currentGame?.hypeId]);

  // Fetch match info (status, goals)
  useEffect(() => {
    const fetchMatchInfo = async () => {
      setMatchInfoLoading(true);
      if (!currentGame?.hypeId) {
        setMatchInfo(null);
        setMatchInfoLoading(false);
        return;
      }
      try {
        const oracleContract = getContract({
          address: deployedContracts.Oracle.address as `0x${string}`,
          abi: deployedContracts.Oracle.abi,
          client: publicClient,
        });
        const data = await oracleContract.read.getMatch([
          currentGame.hypeId as `0x${string}`
        ]);
        setMatchInfo({
          status: Number(data[7]),
          goalsA: Number(data[2]),
          goalsB: Number(data[3]),
        });
      } catch (err) {
        setMatchInfo(null);
      }
      setMatchInfoLoading(false);
    };
    fetchMatchInfo();
  }, [currentGame?.hypeId]);

  const gameStarted = timeToStart === "Game Started";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Live Hype Trading</h2>
          <p className="text-gray-600">Real-time fan sentiment analysis</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Game Timer */}
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
            <Clock className="w-4 h-4 text-blue-600" />
            <div className="text-sm">
              <span className="font-semibold text-blue-600">{timeToStart}</span>
              <div className="text-blue-500 text-xs">to game start</div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Circle className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className="mb-6 text-sm font-semibold text-gray-700 flex items-center gap-2">
        <span>Game Status:</span>
        {matchInfoLoading ? '...' : matchInfo ? (
          matchInfo.status === 0
            ? 'Not started yet'
            : `${matchInfo.goalsA}-${matchInfo.goalsB} • 67'` // TODO: Replace 67' with actual time if available
        ) : '...'}
      </div>

      {/* Prize Pool */}
      <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl">💰</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Prize Pool</h3>
              <p className="text-sm text-gray-600">Total from all bettors</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-purple-600">
              {currentGame?.hypeId ? '10,000' : '0'} HYPE
            </div>
            <div className="text-sm text-gray-500">≈ $500 USD</div>
          </div>
        </div>
        
        <Button
          onClick={() => setPoolModalOpen(true)}
          variant="outline"
          className="w-full border-purple-300 text-purple-700 hover:bg-purple-100 font-semibold"
        >
          View Pool Details & Distribution
        </Button>
      </div>

      {/* Pool Modal */}
      <PoolModal
        isOpen={poolModalOpen}
        onClose={() => setPoolModalOpen(false)}
        currentGame={currentGame}
      />

      {/* Dynamic Odds Alert */}
      {!gameStarted && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-amber-800">Dynamic Odds</span>
          </div>
          <p className="text-amber-700 text-sm">
            Odds are changing in real-time based on fan hype. Final odds will be locked when the game starts in <strong>{timeToStart}</strong>.
          </p>
        </div>
      )}

      {/* Hype Bars Component */}
      <HypeBars 
        currentGame={currentGame}
        hype={hype}
        hypeLoading={hypeLoading}
      />

      {/* Betting Interface Component */}
      <BettingInterface 
        currentGame={currentGame}
        liveData={liveData}
        odds={odds}
        oddsLoading={oddsLoading}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        approveAmount={approveAmount}
        setApproveAmount={setApproveAmount}
        allowance={allowance}
        loadingApprove={loadingApprove}
        loadingBet={loadingBet}
        handleApprove={handleApprove}
        handleBet={handleBet}
        gameStarted={gameStarted}
        account={account}
        error={error}
        success={success}
      />
    </div>
  );
};

export default LiveHypeDisplay;