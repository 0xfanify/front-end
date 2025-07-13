import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, CheckCircle, Clock, Zap, Shield, AlertCircle, Info } from 'lucide-react';

interface Game {
  hypeId: string;
  homeTeam: { name: string; logo: string };
  awayTeam: { name: string; logo: string };
}

interface LiveData {
  psgOdds: number;
  realOdds: number;
}

interface BettingInterfaceProps {
  currentGame: Game;
  liveData: LiveData;
  odds: { oddsA: string; oddsB: string } | null;
  oddsLoading: boolean;
  betAmount: string;
  setBetAmount: (amount: string) => void;
  approveAmount: string;
  setApproveAmount: (amount: string) => void;
  allowance: string;
  loadingApprove: boolean;
  loadingBet: 'A' | 'B' | null;
  handleApprove: () => Promise<boolean>;
  handleBet: (teamA: boolean) => void;
  gameStarted: boolean;
  account: string | undefined;
  error: string | null;
  success: string | null;
}

const BettingInterface: React.FC<BettingInterfaceProps> = ({
  currentGame,
  liveData,
  odds,
  oddsLoading,
  betAmount,
  setBetAmount,
  approveAmount,
  setApproveAmount,
  allowance,
  loadingApprove,
  loadingBet,
  handleApprove,
  handleBet,
  gameStarted,
  account,
  error,
  success
}) => {
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B' | null>(null);
  const [step, setStep] = useState<'select' | 'amount' | 'approve' | 'confirm'>('select');
  
  const allowanceEnough = Number(allowance) >= Number(betAmount || 0);
  const isAmountValid = !!betAmount && !isNaN(Number(betAmount)) && Number(betAmount) > 0;

  // Reset flow only when game ID actually changes (not on every render)
  const [lastGameId, setLastGameId] = React.useState(currentGame?.hypeId);
  React.useEffect(() => {
    if (currentGame?.hypeId !== lastGameId) {
      setStep('select');
      setSelectedTeam(null);
      setBetAmount('');
      setLastGameId(currentGame?.hypeId);
    }
  }, [currentGame?.hypeId, lastGameId, setBetAmount]);

  const handleTeamSelect = (team: 'A' | 'B') => {
    setSelectedTeam(team);
    setStep('amount');
  };

  const handleAmountNext = () => {
    if (!isAmountValid) return;
    
    if (allowanceEnough) {
      setStep('confirm');
    } else {
      setStep('approve');
      setApproveAmount(betAmount); // Auto-fill approve amount
    }
  };

  const handleApproveNext = async () => {
    const success = await handleApprove();
    if (success) {
      // Force re-check allowance after successful approve
      setTimeout(() => {
        const newAllowanceEnough = Number(allowance) >= Number(betAmount || 0);
        if (newAllowanceEnough) {
          setStep('confirm');
        }
      }, 1000); // Wait 1 second for blockchain confirmation
    }
  };

  // Also check allowance changes in real-time
  React.useEffect(() => {
    if (step === 'approve' && allowanceEnough) {
      setStep('confirm');
    }
  }, [allowance, allowanceEnough, step]);

  const handleFinalBet = async () => {
    await handleBet(selectedTeam === 'A');
    // Reset flow after successful bet
    if (success) {
      setStep('select');
      setSelectedTeam(null);
      setBetAmount('');
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

  if (gameStarted) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Betting Closed</h3>
        <p className="text-gray-600">
          The game has started and betting is now closed. Good luck to all bettors!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-gray-50 rounded-xl p-4">
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
          
          {!allowanceEnough && (
            <>
              <div className="flex items-center space-x-2">
                {getStepIcon('approve')}
                <span className={`text-sm font-medium ${step === 'approve' ? 'text-brand-600' : 'text-gray-600'}`}>
                  Approve
                </span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>
            </>
          )}
          
          <div className="flex items-center space-x-2">
            {getStepIcon('confirm')}
            <span className={`text-sm font-medium ${step === 'confirm' ? 'text-brand-600' : 'text-gray-600'}`}>
              Confirm
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Team Selection */}
      {step === 'select' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 text-center">Choose your team to bet on</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleTeamSelect('A')}
              className="group bg-gradient-to-r from-brand-50 to-pink-50 border-2 border-brand-200 hover:border-brand-400 rounded-xl p-6 transition-all duration-200 hover:shadow-lg"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{currentGame.homeTeam.logo}</div>
                <div className="font-bold text-gray-900 text-lg mb-2">{currentGame.homeTeam.name}</div>
                <div className="text-2xl font-black text-brand-600">
                  {oddsLoading ? '...' : odds ? `${parseFloat(odds.oddsA).toFixed(2)}x` : 'Calculating...'}
                </div>
                <div className="text-sm text-gray-600">Potential multiplier</div>
              </div>
            </button>

            <button
              onClick={() => handleTeamSelect('B')}
              className="group bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-6 transition-all duration-200 hover:shadow-lg"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{currentGame.awayTeam.logo}</div>
                <div className="font-bold text-gray-900 text-lg mb-2">{currentGame.awayTeam.name}</div>
                <div className="text-2xl font-black text-blue-600">
                  {oddsLoading ? '...' : odds ? `${parseFloat(odds.oddsB).toFixed(2)}x` : 'Calculating...'}
                </div>
                <div className="text-sm text-gray-600">Potential multiplier</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Amount Input */}
      {step === 'amount' && selectedTeam && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Betting on {selectedTeam === 'A' ? currentGame.homeTeam.name : currentGame.awayTeam.name}
            </h3>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">{selectedTeam === 'A' ? currentGame.homeTeam.logo : currentGame.awayTeam.logo}</span>
              <span className="text-xl font-bold text-gray-900">
                {oddsLoading ? '...' : odds ? 
                  `${parseFloat(selectedTeam === 'A' ? odds.oddsA : odds.oddsB).toFixed(2)}x` : 
                  'Calculating...'
                }
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">How much HYPE do you want to bet?</label>
            <input
              type="number"
              min="0"
              placeholder="Enter amount"
              value={betAmount}
              onChange={e => setBetAmount(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-300 text-xl font-bold text-center"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 5000].map(amount => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setBetAmount(amount.toString())}
                className="border-gray-200 hover:bg-gray-50"
              >
                {amount}
              </Button>
            ))}
          </div>

          {/* Potential Winnings */}
          {isAmountValid && odds && !oddsLoading && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="text-center">
                <div className="text-sm text-green-700 mb-1">Potential winnings if you win:</div>
                <div className="text-2xl font-bold text-green-600">
                  {(Number(betAmount) * parseFloat(selectedTeam === 'A' ? odds.oddsA : odds.oddsB)).toFixed(0)} HYPE
                </div>
                <div className="text-sm text-green-600">
                  Profit: +{((Number(betAmount) * parseFloat(selectedTeam === 'A' ? odds.oddsA : odds.oddsB)) - Number(betAmount)).toFixed(0)} HYPE
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
      {step === 'approve' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-bold text-blue-800 mb-2">Approve HYPE Tokens</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Before betting, you need to give permission for the smart contract to use your HYPE tokens. 
                  This is a one-time approval for security.
                </p>
                
                <div className="bg-white rounded-lg p-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current allowance:</span>
                    <span className="font-bold text-gray-900">{Number(allowance).toFixed(0)} HYPE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Need to approve:</span>
                    <span className="font-bold text-blue-600">{betAmount} HYPE</span>
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
                  <span>Approve {betAmount} HYPE</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Final Confirmation */}
      {step === 'confirm' && selectedTeam && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ready to place your bet!</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Betting on:</span>
                  <div className="flex items-center space-x-2">
                    <span>{selectedTeam === 'A' ? currentGame.homeTeam.logo : currentGame.awayTeam.logo}</span>
                    <span className="font-bold text-gray-900">
                      {selectedTeam === 'A' ? currentGame.homeTeam.name : currentGame.awayTeam.name}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-gray-900">{betAmount} HYPE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Multiplier:</span>
                  <span className="font-bold text-purple-600">
                    {odds ? `${parseFloat(selectedTeam === 'A' ? odds.oddsA : odds.oddsB).toFixed(2)}x` : '...'}
                  </span>
                </div>
                <div className="border-t border-green-300 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Potential winnings:</span>
                    <span className="font-bold text-green-600 text-lg">
                      {odds ? (Number(betAmount) * parseFloat(selectedTeam === 'A' ? odds.oddsA : odds.oddsB)).toFixed(0) : '...'} HYPE
                    </span>
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
              onClick={handleFinalBet}
              disabled={loadingBet !== null}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold"
            >
              {loadingBet ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Placing Bet...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Place Bet</span>
                </div>
              )}
            </Button>
          </div>
        </div>
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
      {step === 'approve' && (
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
  );
};

export default BettingInterface;