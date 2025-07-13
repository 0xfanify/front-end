'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Bell,
  Settings,
  Coins,
  Zap,
  Shield,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useAccount } from 'wagmi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TradingHeaderProps {
  selectedGame: string;
  onGameSelect: (gameId: string) => void;
}

const TradingHeader: React.FC<TradingHeaderProps> = ({
  }) => {
  // Usar dados reais do hook
  const { balance, hypeBalance, isLoading } = useWalletBalance();
  const { address, isConnected } = useAccount();
  
  // Estado para fan token selecionado
  const [selectedFanToken, setSelectedFanToken] = React.useState('PSG');
  
  // Mock data para fan tokens disponíveis
  const availableFanTokens = [
    { symbol: 'PSG', name: 'Paris Saint-Germain', logo: '🔵', balance: '5' },
  ];
  
  const currentFanToken = availableFanTokens.find(token => token.symbol === selectedFanToken);

  // Whitelist addresses (lowercase for comparison)
  const adminWhitelist = (process.env.NEXT_PUBLIC_ADMIN_WHITELIST ?? '')
    .split(',')
    .map(addr => addr.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin = address && adminWhitelist.includes(address.toLowerCase());

  // Formatar os valores para exibição
  const formatBalance = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00';
    return num.toFixed(2);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:ml-0 ml-16">
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="hidden lg:flex">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300 hidden lg:block"></div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-black text-gray-900">Fanify</span>
              <div className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">Trading</div>
            </div>
          </div>

          {/* Right Side - Token Balance */}
          <div className="flex items-center space-x-4">
            {/* CHZ Balance */}
            {isConnected && (
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-xl border border-purple-200">
                <Coins className="w-4 h-4 text-purple-600" />
                <div className="text-sm">
                  {isLoading ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse"></div>
                      <span className="text-purple-500">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-purple-600">{formatBalance(balance)}</span>
                      <span className="text-purple-500 ml-1">CHZ</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* HYPE Balance */}
            {isConnected && (
              <div className="flex items-center space-x-2 bg-brand-50 px-3 py-2 rounded-xl border border-brand-200">
                <Zap className="w-4 h-4 text-brand-600" />
                <div className="text-sm">
                  {isLoading ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-brand-300 rounded-full animate-pulse"></div>
                      <span className="text-brand-500">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-brand-600">{formatBalance(hypeBalance)}</span>
                      <span className="text-brand-500 ml-1">HYPE</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Fan Token Balance with Dropdown */}
            {isConnected && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-2 rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-200 group">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{currentFanToken?.logo}</span>
                      <div className="text-sm">
                        {isLoading ? (
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse"></div>
                            <span className="text-purple-500">Loading...</span>
                          </div>
                        ) : (
                          <>
                            <span className="font-semibold text-purple-600">{currentFanToken?.balance}</span>
                            <span className="text-purple-500 ml-1">{selectedFanToken}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronDown className="w-3 h-3 text-purple-500 group-hover:text-purple-600 transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-64 p-2" align="end">
                  <div className="px-3 py-2 border-b border-gray-100 mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">Fan Tokens</h3>
                    <p className="text-xs text-gray-500">Your fan token balances</p>
                  </div>
                  
                  {availableFanTokens.map((token) => (
                    <DropdownMenuItem
                      key={token.symbol}
                      onClick={() => setSelectedFanToken(token.symbol)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedFanToken === token.symbol 
                          ? 'bg-purple-50 border border-purple-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{token.logo}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{token.name}</div>
                        <div className="text-xs text-gray-500">{token.symbol}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600 text-sm">{token.balance}</div>
                        <div className="text-xs text-gray-500">{token.symbol}</div>
                      </div>
                      {selectedFanToken === token.symbol && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </DropdownMenuItem>
                  ))}
                  
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="px-3 py-2 text-center">
                      <div className="text-xs text-gray-400 mb-2">
                        No fan tokens? Buy them at
                      </div>
                      <a 
                        href="https://socios.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium underline"
                      >
                        socios.com
                      </a>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
            {isAdmin && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="w-full border-brand-200 text-brand-600 hover:bg-brand-50 hover:border-brand-300 font-semibold"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            )}

            {/* Apenas o botão oficial do RainbowKit */}
            <ConnectButton
              showBalance={false}
              accountStatus="avatar"
              chainStatus="icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingHeader;