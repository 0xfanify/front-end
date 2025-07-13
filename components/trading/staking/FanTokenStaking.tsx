'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Gift,
  Star,
  Award,
  Lock,
  Info,
  ExternalLink,
  Calculator,
  Clock,
  CheckCircle,
  Shield,
  Zap,
  AlertCircle
} from 'lucide-react';
import { createWalletClient, custom, getContract, parseEther } from 'viem';
import { spicy } from 'viem/chains';
import deployedContracts from '@/lib/deployedContracts';
import { useAccount, useWalletClient } from 'wagmi';

interface FanTokenStakingProps {
  account: string | undefined;
  selectedTeam: string;
  availableTeams: Array<{ symbol: string; name: string; logo: string; balance: string }>;
  stakedAmount: string;
  onStake: (amount: string, team: string) => Promise<void>;
  onUnstake: (amount: string, team: string) => Promise<void>;
  loading: boolean;
  unstakeLoading: boolean;
}

const FanTokenStaking: React.FC<FanTokenStakingProps> = ({
  account,
  selectedTeam,
  availableTeams,
  stakedAmount,
  onStake,
  onUnstake,
  loading,
  unstakeLoading
}) => {
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [activeAction, setActiveAction] = useState<'stake' | 'unstake'>('stake');
  const [fanTokenAmount, setFanTokenAmount] = useState('');
  const [fanTokenUnstakeAmount, setFanTokenUnstakeAmount] = useState('');
  const [currentSelectedTeam, setCurrentSelectedTeam] = useState(selectedTeam);
  
  // Approval flow states
  const [step, setStep] = useState<'select' | 'amount' | 'approve' | 'confirm'>('select');
  const [approveAmount, setApproveAmount] = useState('');
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [allowance, setAllowance] = useState('0'); // Mock allowance
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedTeamData = availableTeams.find(team => team.symbol === currentSelectedTeam);

  // Conversion calculations
  const fanTokenToHype = (fanToken: string) => {
    const amount = parseFloat(fanToken || '0');
    const baseHype = amount * 1800; // 1 Fan Token = 1.800 HYPE base
    const bonus = baseHype * 0.5; // +50% bonus
    return (baseHype + bonus).toFixed(0);
  };

  // Percentage buttons handler
  const setPercentage = (percentage: number, action: 'stake' | 'unstake') => {
    if (action === 'stake') {
      const balance = parseFloat(selectedTeamData?.balance || '0');
      const amount = (balance * percentage / 100).toFixed(6);
      setFanTokenAmount(amount);
    } else {
      const stakedAmountValue = parseFloat(stakedAmount || '0');
      const amount = (stakedAmountValue * percentage / 100).toFixed(6);
      setFanTokenUnstakeAmount(amount);
    }
  };

  // Mock allowance check - always start with 0 to force approval
  useEffect(() => {
    // Always start with 0 allowance to force approval step
    setAllowance('0');
  }, []);

  const allowanceEnough = Number(allowance) >= Number(fanTokenAmount || 0);
  const isAmountValid = !!fanTokenAmount && !isNaN(Number(fanTokenAmount)) && Number(fanTokenAmount) > 0;

  // Reset flow when action changes
  useEffect(() => {
    setStep('select');
    setFanTokenAmount('');
    setError(null);
    setSuccess(null);
  }, [activeAction]);

  const handleAmountNext = () => {
    if (!isAmountValid) return;
    
    // Always go to approve step before staking
    setStep('approve');
    setApproveAmount(fanTokenAmount); // Auto-fill approve amount
  };

  const handleApproveNext = async () => {
    setLoadingApprove(true);
    setError(null);
    
    try {
      if (!address || !isConnected) {
        throw new Error('Connect your wallet first');
      }

      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Wallet not available');
      }

      // Create wallet client
      const walletClient = createWalletClient({
        chain: spicy,
        transport: custom(window.ethereum as any),
      });

      // Get the HypeToken contract (same as CHZ staking)
      const hypeTokenContract = getContract({
        address: deployedContracts.HypeToken.address as `0x${string}`,
        abi: deployedContracts.HypeToken.abi,
        client: walletClient,
      });

      // Call the stake function with the fan token amount
      // Note: This assumes fan tokens are staked the same way as CHZ
      // You may need to adjust this based on your specific contract implementation
      const hash = await hypeTokenContract.write.stake({
        value: parseEther(fanTokenAmount),
        account: address as `0x${string}`,
      });

      console.log('Fan token staking successful!', hash);
      
      // Update allowance to reflect successful staking
      setAllowance(fanTokenAmount);
      setSuccess('Fan token staking successful! You can now proceed to confirm.');
      
      // Move to confirm step after a delay
      setTimeout(() => {
        setStep('confirm');
        setSuccess(null);
      }, 1500);
      
    } catch (err: any) {
      console.error('Error staking fan tokens:', err);
      
      let errorMessage = 'Fan token staking failed. Please try again.';
      if (err?.message) {
        if (err.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient fan token balance.';
        } else if (err.message.includes('user rejected')) {
          errorMessage = 'Transaction rejected by user.';
        } else if (err.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoadingApprove(false);
    }
  };

  const handleStake = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      if (!address || !isConnected) {
        throw new Error('Connect your wallet first');
      }

      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Wallet not available');
      }

      // Create wallet client
      const walletClient = createWalletClient({
        chain: spicy,
        transport: custom(window.ethereum as any),
      });

      // Get the HypeToken contract
      const hypeTokenContract = getContract({
        address: deployedContracts.HypeToken.address as `0x${string}`,
        abi: deployedContracts.HypeToken.abi,
        client: walletClient,
      });

      // Call the stake function with the fan token amount
      const hash = await hypeTokenContract.write.stake({
        value: parseEther(fanTokenAmount),
        account: address as `0x${string}`,
      });

      console.log('Fan token staking confirmed!', hash);
      
      setSuccess('Staking successful! Your tokens are now locked for the season.');
      setFanTokenAmount('');
      setStep('select');
      
      // Call the parent onStake function for any additional logic
      await onStake(fanTokenAmount, currentSelectedTeam);
      
    } catch (err: any) {
      console.error('Error confirming fan token staking:', err);
      
      let errorMessage = 'Staking failed. Please try again.';
      if (err?.message) {
        if (err.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient fan token balance.';
        } else if (err.message.includes('user rejected')) {
          errorMessage = 'Transaction rejected by user.';
        } else if (err.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  const handleUnstake = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      if (!address || !isConnected) {
        throw new Error('Connect your wallet first');
      }

      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Wallet not available');
      }

      // Create wallet client
      const walletClient = createWalletClient({
        chain: spicy,
        transport: custom(window.ethereum as any),
      });

      // Get the HypeToken contract
      const hypeTokenContract = getContract({
        address: deployedContracts.HypeToken.address as `0x${string}`,
        abi: deployedContracts.HypeToken.abi,
        client: walletClient,
      });

      // Call the unstake function with the fan token amount
      const hash = await hypeTokenContract.write.unstake([
        parseEther(fanTokenUnstakeAmount)
      ], {
        account: address as `0x${string}`,
      });

      console.log('Fan token unstaking successful!', hash);
      
      setSuccess('Unstaking successful! You have received your tokens back.');
      setFanTokenUnstakeAmount('');
      
      // Call the parent onUnstake function for any additional logic
      await onUnstake(fanTokenUnstakeAmount, currentSelectedTeam);
      
    } catch (err: any) {
      console.error('Error unstaking fan tokens:', err);
      
      let errorMessage = 'Unstaking failed. Please try again.';
      if (err?.message) {
        if (err.message.includes('insufficient')) {
          errorMessage = 'Insufficient staked fan token balance.';
        } else if (err.message.includes('user rejected')) {
          errorMessage = 'Transaction rejected by user.';
        } else if (err.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  const getStepIcon = (stepName: string) => {
    const currentStepIndex = ['select', 'amount', 'approve', 'confirm'].indexOf(step);
    const stepIndex = ['select', 'amount', 'approve', 'confirm'].indexOf(stepName);
    
    if (stepIndex < currentStepIndex) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (stepIndex === currentStepIndex) {
      return <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{stepIndex + 1}</div>;
    } else {
      return <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold">{stepIndex + 1}</div>;
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Fan Token Staking Info */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Fan Token Staking</h3>
            <p className="text-brand-600 font-semibold">Season Loyalty Program</p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveAction('stake')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeAction === 'stake'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-gray-600 hover:text-brand-600'
            }`}
          >
            Stake Fan Token
          </button>
          <button
            onClick={() => setActiveAction('unstake')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeAction === 'unstake'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-gray-600 hover:text-brand-600'
            }`}
          >
            Unstake Fan Token
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center mt-1">
              <span className="text-brand-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Stake Fan Token</h4>
              <p className="text-gray-600 text-sm">Lock your team's tokens until season ends</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center mt-1">
              <Gift className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Get +50% Bonus</h4>
              <p className="text-gray-600 text-sm">Receive extra $HYPE for your loyalty</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center mt-1">
              <Star className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">1.800 HYPE Base + 50% Bonus</h4>
              <p className="text-gray-600 text-sm">Total: 2.700 HYPE per Fan Token</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center mt-1">
              <Star className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Bet on Your Team</h4>
              <p className="text-gray-600 text-sm">Only bet on your team's victories</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center mt-1">
              <Award className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Season Rewards</h4>
              <p className="text-gray-600 text-sm">Earn yield based on team performance</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Lock className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-700">Season Lock Benefits</span>
          </div>
          <div className="space-y-1 text-sm text-green-600">
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>1.800 HYPE base + 50% bonus</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Yield rewards from team wins</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Unstake in USD value + rewards</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-blue-700">No Fan Tokens?</span>
          </div>
          <div className="text-sm text-blue-600 mb-3">
            Buy PSG fan tokens to participate in season staking and earn rewards.
          </div>
          <a 
            href="https://socios.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <span>Buy at socios.com</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Fan Token Staking Interface */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {activeAction === 'stake' ? 'Stake Your Fan Token' : 'Unstake Your Fan Token'}
        </h3>

        {/* Progress Steps - Only show for staking */}
        {activeAction === 'stake' && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStepIcon('select')}
                <span className={`text-sm font-medium ${step === 'select' ? 'text-brand-600' : 'text-gray-600'}`}>
                  Choose Team
                </span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>
              
              <div className="flex items-center space-x-2">
                {getStepIcon('amount')}
                <span className={`text-sm font-medium ${step === 'amount' ? 'text-brand-600' : 'text-gray-600'}`}>
                  Set Amount
                </span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>
              
              <div className="flex items-center space-x-2">
                {getStepIcon('approve')}
                <span className={`text-sm font-medium ${step === 'approve' ? 'text-brand-600' : 'text-gray-600'}`}>
                  Approve
                </span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>
              
              <div className="flex items-center space-x-2">
                {getStepIcon('confirm')}
                <span className={`text-sm font-medium ${step === 'confirm' ? 'text-brand-600' : 'text-gray-600'}`}>
                  Confirm
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Team Selection */}
        {activeAction === 'stake' && step === 'select' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 text-center">Choose your team to stake</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {availableTeams.map(team => (
                <button
                  key={team.symbol}
                  onClick={() => {
                    setCurrentSelectedTeam(team.symbol);
                    setStep('amount');
                  }}
                  className="group bg-gradient-to-r from-brand-50 to-pink-50 border-2 border-brand-200 hover:border-brand-400 rounded-xl p-6 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{team.logo}</div>
                    <div className="font-bold text-gray-900 text-lg mb-2">{team.symbol}</div>
                    <div className="text-sm text-gray-600">Available: {team.balance}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Amount Input */}
        {activeAction === 'stake' && step === 'amount' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Staking {currentSelectedTeam} tokens
              </h3>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">{selectedTeamData?.logo}</span>
                <span className="text-xl font-bold text-gray-900">{currentSelectedTeam}</span>
              </div>
            </div>

            {/* Balance Display */}
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-brand-700 font-medium">Available {currentSelectedTeam}:</span>
                <span className="text-brand-900 font-bold text-lg">
                  {selectedTeamData?.balance} {currentSelectedTeam}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">How much {currentSelectedTeam} do you want to stake?</label>
              <input
                type="number"
                min="0"
                placeholder="Enter amount"
                value={fanTokenAmount}
                onChange={e => setFanTokenAmount(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-300 text-xl font-bold text-center"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map(percentage => (
                <Button
                  key={percentage}
                  variant="outline"
                  size="sm"
                  onClick={() => setPercentage(percentage, 'stake')}
                  className="border-gray-200 hover:bg-gray-50"
                >
                  {percentage === 100 ? 'Max' : `${percentage}%`}
                </Button>
              ))}
            </div>

            {/* Conversion Preview */}
            {isAmountValid && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-sm text-green-700 mb-1">You'll receive:</div>
                  <div className="text-2xl font-bold text-green-600">
                    {fanTokenToHype(fanTokenAmount)} HYPE
                  </div>
                  <div className="text-sm text-green-600">
                    Base: {(parseFloat(fanTokenAmount || '0') * 1800).toFixed(0)} + Bonus: +{(parseFloat(fanTokenAmount || '0') * 900).toFixed(0)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep('select')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleAmountNext}
                disabled={!isAmountValid}
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Approve (only if needed) */}
        {activeAction === 'stake' && step === 'approve' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-800 mb-2">Approve {currentSelectedTeam} Tokens</h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Before staking, you need to give permission for the smart contract to use your {currentSelectedTeam} tokens. 
                    This is a one-time approval for security.
                  </p>
                  
                  <div className="bg-white rounded-lg p-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available {currentSelectedTeam}:</span>
                      <span className="font-bold text-gray-900">{selectedTeamData?.balance} {currentSelectedTeam}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Will stake:</span>
                      <span className="font-bold text-blue-600">1 {currentSelectedTeam}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-200">
                      <span className="text-gray-600">You'll receive:</span>
                      <span className="text-green-600 font-bold">{fanTokenToHype('1')} HYPE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep('amount')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleApproveNext}
                disabled={loadingApprove}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loadingApprove ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Approving...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Approve {fanTokenAmount} {currentSelectedTeam}</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Final Confirmation */}
        {activeAction === 'stake' && step === 'confirm' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ready to stake your tokens!</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Staking:</span>
                    <div className="flex items-center space-x-2">
                      <span>{selectedTeamData?.logo}</span>
                      <span className="font-bold text-gray-900">{currentSelectedTeam}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-gray-900">{fanTokenAmount} {currentSelectedTeam}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">You'll receive:</span>
                    <span className="font-bold text-green-600">{fanTokenToHype(fanTokenAmount)} HYPE</span>
                  </div>
                  <div className="border-t border-green-300 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lock period:</span>
                      <span className="font-bold text-blue-600 text-lg">Until Season End</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep('amount')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleStake}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Staking...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Stake {currentSelectedTeam}</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Unstaking Interface (simpler flow) */}
        {activeAction === 'unstake' && (
          <>
            {/* Team Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Your Team</label>
              <div className="grid grid-cols-2 gap-2">
                {availableTeams.map(team => (
                  <button
                    key={team.symbol}
                    onClick={() => setCurrentSelectedTeam(team.symbol)}
                    className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                      currentSelectedTeam === team.symbol
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-gray-200 hover:border-brand-300'
                    }`}
                  >
                    <span className="text-2xl">{team.logo}</span>
                    <div className="text-left">
                      <div className="font-bold text-gray-900 text-sm">{team.symbol}</div>
                      <div className="text-xs text-gray-600">{stakedAmount}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Balance Display */}
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-brand-700 font-medium">Staked {currentSelectedTeam}:</span>
                <span className="text-brand-900 font-bold text-lg">
                  {stakedAmount} {currentSelectedTeam}
                </span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount to Unstake</label>
              <input
                type="number"
                min="0"
                placeholder={`Enter ${currentSelectedTeam} amount to unstake`}
                value={fanTokenUnstakeAmount}
                onChange={e => setFanTokenUnstakeAmount(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 text-lg font-bold"
              />
            </div>

            {/* Percentage Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[25, 50, 75, 100].map(percentage => (
                <Button
                  key={percentage}
                  variant="outline"
                  size="sm"
                  onClick={() => setPercentage(percentage, 'unstake')}
                  className="border-brand-200 text-brand-600 hover:bg-brand-50"
                >
                  {percentage === 100 ? 'Max' : `${percentage}%`}
                </Button>
              ))}
            </div>

            {/* Unstake Preview */}
            {fanTokenUnstakeAmount && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Calculator className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">Unstake Preview</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{currentSelectedTeam} to Unstake:</span>
                    <span className="font-bold text-gray-900">{fanTokenUnstakeAmount} {currentSelectedTeam}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">You'll Receive (USD):</span>
                    <span className="font-bold text-green-600">${(parseFloat(fanTokenUnstakeAmount || '0') * 2.5).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Season Rewards:</span>
                    <span className="font-bold text-yellow-600">+${(parseFloat(fanTokenUnstakeAmount || '0') * 0.3).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-900 font-medium">Total USD:</span>
                      <span className="font-bold text-brand-600">${(parseFloat(fanTokenUnstakeAmount || '0') * 2.8).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Season Lock Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-amber-800">Season Lock Notice</span>
              </div>
              <div className="space-y-1 text-sm text-amber-700">
                <div>• Unstaking ends your season participation</div>
                <div>• You'll receive current USD value + accumulated rewards</div>
                <div>• No more betting on {selectedTeamData?.name} this season</div>
                <div>• Consider waiting until season end for maximum rewards</div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleUnstake}
              disabled={unstakeLoading || !fanTokenUnstakeAmount || !account}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl"
            >
              {unstakeLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Unstaking...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Unstake {currentSelectedTeam} (End Season)</span>
                </div>
              )}
            </Button>
          </>
        )}

        {/* Feedback Messages */}
        {(error || success) && (
          <div className={`p-4 rounded-xl text-center font-medium ${
            error 
              ? 'bg-red-50 border border-red-200 text-red-700' 
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            <div className="flex items-center justify-center space-x-2">
              {error ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span>{error || success}</span>
            </div>
          </div>
        )}

        {/* Web3 Education */}
        {activeAction === 'stake' && step === 'approve' && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Why do I need to approve?</h4>
                <p className="text-gray-600 text-xs">
                  This is how blockchain works - you need to give permission before any app can move your tokens. 
                  It's like authorizing a payment method, but more secure because you control exactly how much can be used.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FanTokenStaking; 