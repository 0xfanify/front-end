'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Target, 
  Trophy, 
  Brain, 
  Coins, 
  Zap, 
  ArrowRight, 
  CheckCircle,
  Shield,
  TrendingUp,
  Users,
  Star,
  Timer,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const HowFanifyWorks = () => {
  const [selectedTab, setSelectedTab] = useState<'chz' | 'fantoken'>('chz');

  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-brand-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-brand-50 border border-brand-200 rounded-full mb-8">
            <span className="text-brand-600 text-sm font-semibold ml-2">HOW FOOTBALL WORKS ON FANIFY</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
            Transform your football passion into <span className="text-brand-600">real profit</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bet on your favorite team and win when they win. It's football + blockchain + your fan tokens.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 inline-flex">
            <button
              onClick={() => setSelectedTab('chz')}
              className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                selectedTab === 'chz'
                  ? 'bg-brand-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="text-left">
                <div className="font-bold ml-2">Bet with CHZ</div>
                <div className="text-sm opacity-90 ml-2">Any team, any game</div>
              </div>
            </button>
            <button
              onClick={() => setSelectedTab('fantoken')}
              className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                selectedTab === 'fantoken'
                  ? 'bg-brand-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="text-left">
                <div className="font-bold ml-2">Bet with Fan Tokens</div>
                <div className="text-sm opacity-90 ml-2">Loyal fans win more</div>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {selectedTab === 'chz' ? (
            <div className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-2xl">💰</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">Bet with CHZ</h3>
                        <p className="text-brand-600 font-semibold">Total freedom: any team, any championship</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Deposit CHZ and receive $HYPE</h4>
                        <p className="text-gray-600">Our betting token to use in any football game.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-brand-600 font-bold text-sm">🎯</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Bet on any match</h4>
                        <p className="text-gray-600">Brazilian League, Champions League, World Cup - you choose!</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-brand-600 font-bold text-sm">💰</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Won? Withdraw your CHZ + profit</h4>
                        <p className="text-gray-600">Got the bet right? Cash out everything with your winnings!</p>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-red-500 text-lg">⚠️</span>
                        <span className="font-bold text-red-700">Warning</span>
                      </div>
                      <p className="text-red-600 text-sm">
                        Lost the bet? Your $HYPE is burned and you don't recover the CHZ. <strong>Bet responsibly! ⚽</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Visual */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💰</span>
                        <span className="font-bold">CHZ Deposit</span>
                      </div>
                      <div className="text-sm bg-white/20 px-2 py-1 rounded">Flexible</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Deposited Value:</span>
                        <span className="font-bold">1,000 CHZ</span>
                      </div>
                      <div className="flex justify-between">
                        <span>$HYPE Received:</span>
                        <span className="font-bold">1,000 HYPE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bonus:</span>
                        <span className="font-bold">0%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                      <div className="font-bold text-green-700">Any Team</div>
                      <div className="text-sm text-green-600">Flamengo, Palmeiras, Real Madrid...</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                      <div className="font-bold text-blue-700">Any Game</div>
                      <div className="text-sm text-blue-600">Brazilian League, Champions, World Cup...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center">
                        <span className="text-white text-2xl">⚽</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">Bet with Fan Token</h3>
                        <p className="text-brand-600 font-semibold">For loyal fans who live with their team throughout the season</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-brand-600 font-bold text-sm">⚽</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Deposit your team's Fan Token</h4>
                        <p className="text-gray-600">Flamengo, Corinthians, Santos... commit to your team!</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-brand-600 font-bold text-sm">🎁</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Get +50% bonus in $HYPE</h4>
                        <p className="text-gray-600">Loyal fans deserve more! Receive 50% extra to bet.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-brand-600 font-bold text-sm">🏆</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Bet only on your team's victories</h4>
                        <p className="text-gray-600">Every game is a chance to win together with your team!</p>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-green-600 text-lg">🏆</span>
                        <span className="font-bold text-green-700">Season Rewards</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600">⚽</span>
                          <span className="text-green-700">Your fan tokens back (USD value)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600">💰</span>
                          <span className="text-green-700">Profit from each of your team's victories</span>
                        </div>
                      </div>
                      <p className="text-green-600 text-sm mt-3 font-semibold">
                        Loyal fans are truly rewarded! ⚽🏆
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Visual */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">⚽</span>
                        <span className="font-bold">Flamengo Fan Token</span>
                      </div>
                      <div className="text-sm bg-white/20 px-2 py-1 rounded">Season</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Deposited Value:</span>
                        <span className="font-bold">100 FLA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>$HYPE Received:</span>
                        <span className="font-bold">1,500 HYPE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bonus:</span>
                        <span className="font-bold text-yellow-300">+50%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                      <span className="text-2xl">❤️</span>
                      <div className="font-bold text-red-700">Your Team</div>
                      <div className="text-sm text-red-600">True passion</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                      <span className="text-2xl">📈</span>
                      <div className="font-bold text-yellow-700">More Yield</div>
                      <div className="text-sm text-yellow-600">+50% bonus</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section - Blockchain */}
        <div className="mt-16 bg-gray-900 rounded-3xl p-8 lg:p-12 text-white">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <h3 className="text-2xl font-black">Football + Blockchain = Total Transparency</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl">📱</span>
              </div>
              <h4 className="font-bold mb-2">Real Fan Hype Odds</h4>
              <p className="text-gray-300 text-sm">
                Odds change based on what fans are saying on Twitter, in real time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl">🛡️</span>
              </div>
              <h4 className="font-bold mb-2">Fully Auditable</h4>
              <p className="text-gray-300 text-sm">
                Every bet, every result, everything is recorded on the blockchain forever.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl">⚡</span>
              </div>
              <h4 className="font-bold mb-2">Smart Contracts</h4>
              <p className="text-gray-300 text-sm">
                Automatic payments when your team wins. No intermediaries, no hassle.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button
            size="lg"
            className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Betting on My Team
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowFanifyWorks;