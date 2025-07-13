'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Coins, 
  AlertTriangle,
  Calculator,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Target
} from 'lucide-react';
import { parseEther, getContract } from 'viem';
import deployedContracts from '@/lib/deployedContracts';
import { useToast } from '@/hooks/use-toast';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { useWalletBalance } from '@/hooks/useWalletBalance';

interface ChzStakingProps {
  account?: string | undefined;
  chzBalance?: string;
  stakedAmount?: string;
  onStake?: (amount: string) => Promise<void>;
  onUnstake?: (amount: string) => Promise<void>;
  loading?: boolean;
  unstakeLoading?: boolean;
}

const ChzStaking: React.FC<ChzStakingProps> = ({
  account,
  chzBalance,
  stakedAmount,
  onStake,
  onUnstake,
  loading,
  unstakeLoading
}) => {
  const [activeAction, setActiveAction] = useState<'stake' | 'unstake'>('stake');
  const [chzAmount, setChzAmount] = useState('');
  const [chzUnstakeAmount, setChzUnstakeAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { toast } = useToast();
  
  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  
  // Dados reais do usuário
  const { balance, hypeBalance, isLoading: balanceLoading, refetch } = useWalletBalance();

  // Formatar valores para exibição
  const formatBalance = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00';
    return num.toFixed(2);
  };

  // Dados de staking reais (baseados no saldo de HYPE)
  const stakingData = {
    totalStaked: parseFloat(hypeBalance) / 1000 || 0, // CHZ staked (1 CHZ = 1000 HYPE)
    totalHype: parseFloat(hypeBalance) || 0, // HYPE tokens received
    pendingRewards: 0, // Por enquanto 0, pode ser implementado depois
    stakingAPY: 18.5, // Annual percentage yield
    timeStaked: '15 days' // Mock data
  };

  // Conversion calculations
  const chzToHype = (chz: string) => {
    const amount = parseFloat(chz || '0');
    return (amount * 1000).toFixed(0); // 1 CHZ = 1000 HYPE
  };



  // Percentage buttons handler
  const setPercentage = (percentage: number, action: 'stake' | 'unstake') => {
    if (action === 'stake') {
      const amount = (parseFloat(balance) * percentage / 100).toFixed(6);
      setChzAmount(amount);
    } else {
      const amount = (parseFloat(hypeBalance) * percentage / 100).toFixed(6);
      setChzUnstakeAmount(amount);
    }
  };

  // Função de stake real usando wagmi
  const handleStake = async () => {
    if (!isConnected || !address) {
      toast({
        title: '❌ Carteira não conectada',
        description: 'Conecte sua carteira primeiro',
        variant: 'destructive',
      });
      return;
    }

    if (!chzAmount || parseFloat(chzAmount) <= 0) {
      toast({
        title: '❌ Valor inválido',
        description: 'Insira um valor válido para stake',
        variant: 'destructive',
      });
      return;
    }

    if (!walletClient) {
      toast({
        title: '❌ Wallet não disponível',
        description: 'Wallet client não está disponível',
        variant: 'destructive',
      });
      return;
    }

    // Verificar se tem saldo suficiente
    const currentBalance = parseFloat(balance);
    const stakeValue = parseFloat(chzAmount);
    if (currentBalance < stakeValue) {
      toast({
        title: '❌ Saldo insuficiente',
        description: `Você tem ${formatBalance(balance)} CHZ, mas está tentando stakar ${chzAmount} CHZ`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Iniciando stake...', {
        address,
        amount: chzAmount,
        contractAddress: deployedContracts.HypeToken.address
      });

      const hypeTokenContract = getContract({
        address: deployedContracts.HypeToken.address as `0x${string}`,
        abi: deployedContracts.HypeToken.abi,
        client: walletClient,
      });

      console.log('Contrato criado, chamando stake...');

      const hash = await hypeTokenContract.write.stake({
        value: parseEther(chzAmount),
      });

      console.log('Stake realizado com sucesso!', hash);

      toast({
        title: '💰 Stake Realizado com Sucesso!',
        description: `${chzAmount} CHZ foram stakados e convertidos para ${chzToHype(chzAmount)} HYPE. Hash: ${hash.slice(0, 10)}...`,
      });
      
      setChzAmount('');
      
      // Mostrar feedback visual de sucesso
      setSuccessMessage(`✅ Stake realizado! ${chzAmount} CHZ → ${chzToHype(chzAmount)} HYPE`);
      setShowSuccess(true);
      
      // Esconder feedback após 5 segundos
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 5000);
      
      // Mostrar feedback adicional de sucesso
      setTimeout(() => {
        toast({
          title: '🔄 Atualizando Saldos...',
          description: 'Se os saldos não atualizarem automaticamente, recarregue a página para ver as mudanças.',
        });
      }, 1000);
      
      // Atualizar saldos após o stake
      setTimeout(() => {
        refetch();
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro no stake:', error);
      
      let errorMessage = 'Falha ao stakar tokens.';
      if (error?.message) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = 'Saldo insuficiente de CHZ.';
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transação cancelada pelo usuário.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Erro de rede. Verifique sua conexão.';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: '❌ Erro no Stake',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função de unstake real usando wagmi
  const handleUnstake = async () => {
    if (!isConnected || !address) {
      toast({
        title: '❌ Carteira não conectada',
        description: 'Conecte sua carteira primeiro',
        variant: 'destructive',
      });
      return;
    }

    if (!chzUnstakeAmount || parseFloat(chzUnstakeAmount) <= 0) {
      toast({
        title: '❌ Valor inválido',
        description: 'Insira um valor válido para unstake',
        variant: 'destructive',
      });
      return;
    }

    if (!walletClient) {
      toast({
        title: '❌ Wallet não disponível',
        description: 'Wallet client não está disponível',
        variant: 'destructive',
      });
      return;
    }

    // Verificar se tem HYPE suficiente
    const currentHypeBalance = parseFloat(hypeBalance);
    const unstakeValue = parseFloat(chzUnstakeAmount);
    if (currentHypeBalance < unstakeValue) {
      toast({
        title: '❌ Saldo insuficiente',
        description: `Você tem ${formatBalance(hypeBalance)} HYPE, mas está tentando unstakar ${chzUnstakeAmount} HYPE`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Iniciando unstake...', {
        address,
        amount: chzUnstakeAmount,
        contractAddress: deployedContracts.HypeToken.address
      });

      const hypeTokenContract = getContract({
        address: deployedContracts.HypeToken.address as `0x${string}`,
        abi: deployedContracts.HypeToken.abi,
        client: walletClient,
      });

      console.log('Contrato criado, chamando unstake...');

      const hash = await hypeTokenContract.write.unstake([
        parseEther(chzUnstakeAmount)
      ]);

      console.log('Unstake realizado com sucesso!', hash);

      toast({
        title: '🔄 Unstake Realizado com Sucesso!',
        description: `${chzUnstakeAmount} HYPE foram unstakados e convertidos para ${(parseFloat(chzUnstakeAmount) / 1000).toFixed(6)} CHZ. Hash: ${hash.slice(0, 10)}...`,
      });
      
      setChzUnstakeAmount('');
      
      // Mostrar feedback visual de sucesso
      setSuccessMessage(`✅ Unstake realizado! ${chzUnstakeAmount} HYPE → ${(parseFloat(chzUnstakeAmount) / 1000).toFixed(6)} CHZ`);
      setShowSuccess(true);
      
      // Esconder feedback após 5 segundos
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 5000);
      
      // Mostrar feedback adicional de sucesso
      setTimeout(() => {
        toast({
          title: '🔄 Atualizando Saldos...',
          description: 'Se os saldos não atualizarem automaticamente, recarregue a página para ver as mudanças.',
        });
      }, 1000);
      
      // Atualizar saldos após o unstake
      setTimeout(() => {
        refetch();
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro no unstake:', error);
      
      let errorMessage = 'Falha ao unstakar tokens.';
      if (error?.message) {
        if (error.message.includes('insufficient')) {
          errorMessage = 'Saldo insuficiente de HYPE stakado.';
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transação cancelada pelo usuário.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Erro de rede. Verifique sua conexão.';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: '❌ Erro no Unstake',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Feedback */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-green-800">{successMessage}</p>
                <p className="text-sm text-green-600">Transação confirmada no blockchain!</p>
              </div>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-green-500 hover:text-green-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
      {/* CHZ Staking Info */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">CHZ Staking</h3>
            <p className="text-purple-600 font-semibold">Simple & Flexible Betting</p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveAction('stake')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeAction === 'stake'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Stake CHZ
          </button>
          <button
            onClick={() => setActiveAction('unstake')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeAction === 'unstake'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Unstake CHZ
          </button>
        </div>

        {/* Current Staked Amount */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-purple-700 font-medium">Currently Staked:</span>
            <span className="text-purple-900 font-bold text-lg">{formatBalance(stakingData.totalStaked.toString())} CHZ</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-purple-700 font-medium">HYPE Received:</span>
            <span className="text-purple-900 font-bold text-lg">{formatBalance(stakingData.totalHype.toString())} HYPE</span>
          </div>
        </div>



        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
              <span className="text-purple-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Stake CHZ</h4>
              <p className="text-gray-600 text-sm">Deposit your CHZ tokens to receive $HYPE</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
              <span className="text-purple-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Bet Freely</h4>
              <p className="text-gray-600 text-sm">Use $HYPE to bet on any team, any game</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
              <span className="text-purple-600 font-bold text-sm">3</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Unstake Anytime</h4>
              <p className="text-gray-600 text-sm">Withdraw your CHZ after games end</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="font-bold text-red-700">Important Warning</span>
          </div>
          <p className="text-red-600 text-sm">
            If you lose all your $HYPE in bets, you won't be able to unstake your CHZ. Bet responsibly!
          </p>
        </div>
      </div>

      {/* CHZ Staking Interface */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {activeAction === 'stake' ? 'Stake Your CHZ' : 'Unstake Your CHZ'}
        </h3>
        
        {/* Balance Display */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-purple-700 font-medium">
              {activeAction === 'stake' ? 'Available CHZ:' : 'Staked HYPE:'}
            </span>
            <span className="text-purple-900 font-bold text-lg">
              {activeAction === 'stake' 
                ? `${formatBalance(balance)} CHZ`
                : `${formatBalance(hypeBalance)} HYPE`
              }
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amount to {activeAction === 'stake' ? 'Stake' : 'Unstake'}
          </label>
          <Input
            type="number"
            min="0"
            placeholder={`Enter ${activeAction === 'stake' ? 'CHZ' : 'HYPE'} amount to ${activeAction}`}
            value={activeAction === 'stake' ? chzAmount : chzUnstakeAmount}
            onChange={e => activeAction === 'stake' ? setChzAmount(e.target.value) : setChzUnstakeAmount(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-lg font-bold"
          />
        </div>

        {/* Percentage Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[25, 50, 75, 100].map(percentage => (
            <Button
              key={percentage}
              variant="outline"
              size="sm"
              onClick={() => setPercentage(percentage, activeAction)}
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              {percentage === 100 ? 'Max' : `${percentage}%`}
            </Button>
          ))}
        </div>

        {/* Conversion Preview */}
        {(activeAction === 'stake' ? chzAmount : chzUnstakeAmount) && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Calculator className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">
                {activeAction === 'stake' ? 'Conversion Preview' : 'Unstake Preview'}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              {activeAction === 'stake' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CHZ to Stake:</span>
                    <span className="font-bold text-gray-900">{chzAmount} CHZ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">$HYPE to Receive:</span>
                    <span className="font-bold text-purple-600">{chzToHype(chzAmount)} HYPE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion Rate:</span>
                    <span className="font-bold text-gray-900">1 CHZ = 1,000 HYPE</span>
                  </div>

                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HYPE to Unstake:</span>
                    <span className="font-bold text-gray-900">{chzUnstakeAmount} HYPE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CHZ to Receive:</span>
                    <span className="font-bold text-purple-600">{(parseFloat(chzUnstakeAmount || '0') / 1000).toFixed(6)} CHZ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining Staked:</span>
                    <span className="font-bold text-gray-900">
                      {(parseFloat(hypeBalance) - parseFloat(chzUnstakeAmount || '0')).toFixed(2)} HYPE
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={activeAction === 'stake' ? handleStake : handleUnstake}
          disabled={
            isLoading || 
            !(activeAction === 'stake' ? chzAmount : chzUnstakeAmount) || 
            !isConnected
          }
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{activeAction === 'stake' ? 'Staking...' : 'Unstaking...'}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5" />
              <span>{activeAction === 'stake' ? 'Stake CHZ' : 'Unstake CHZ'}</span>
            </div>
          )}
        </Button>
      </div>
    </div>
    </div>
  );
};

export default ChzStaking; 