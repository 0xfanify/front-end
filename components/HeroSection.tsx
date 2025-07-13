'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Play, TrendingUp, Users, Zap, Globe, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-50"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-brand-400/8 to-brand-500/4 rounded-full blur-3xl"></div>
        
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e9316b' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-brand-50 border border-brand-200 rounded-full">
              <div className="w-2 h-2 bg-brand-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-brand-600 text-sm font-semibold">POWERED BY CHILIZ CHAIN</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-black leading-tight text-gray-900">
                <div className="mb-2">Bet on Your Team.</div>
                <div className="text-brand-600 mb-2">Win with Every Victory.</div>
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
             Tired of bets that don't engage you? Where odds are a mystery and your team passion is worthless? At Fanify, social media hype shapes the odds, your fan tokens generate real income <span className="font-semibold text-brand-600">and when your team wins, you win too!</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/trading">
                <Button
                  size="lg"
                  className="group bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                >
                  Launch the App
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="https://0xfanify.github.io/documentation/" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="lg"
                  className="group border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300"
                >
                  Read Docs
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100">
              <div>
                <div className="text-3xl font-black text-gray-900">270M+</div>
                <div className="text-sm text-gray-500 font-medium">Fans in Brazil</div>
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900">85%</div>
                <div className="text-sm text-gray-500 font-medium">Want to bet on their team</div>
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900">$2B+</div>
                <div className="text-sm text-gray-500 font-medium">Fan Token Market</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative w-full h-[600px] lg:h-[700px]">

              {/* Floating Cards - Football Style */}
              {/* Tweet Card */}
              <div className="absolute top-20 right-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 animate-float z-20 max-w-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">🐦</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-gray-900 text-sm">@mengao_eterno</span>
                      <span className="text-blue-500 text-xs">✓</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      "TODAY IS MENGÃO DAY! 🔴⚫ Let's go all out, victory is ours! #VamosFla"
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>❤️ 2.3K</span>
                      <span>🔄 856</span>
                      <span>2min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discord Message Card */}
              <div className="absolute bottom-32 left-8 bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-700 animate-float z-20 max-w-xs" style={{animationDelay: '1s'}}>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">CR</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-white text-sm">CorinthianoRaiz</span>
                      <span className="text-xs text-gray-400">today at 14:23</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Guys, I bet 500 CHZ on Timão today! 🖤🤍 Go Corinthians! 
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-400">💬 #football-betting</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tweet Card 2 */}
              <div className="absolute top-40 left-12 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 animate-float z-20 max-w-xs" style={{animationDelay: '2s'}}>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">🐦</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-gray-900 text-sm">@palmeirense_sp</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      "Just bet on Verdão! 💚 Total confidence in Abel! #AvantiPalestra"
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>❤️ 1.8K</span>
                      <span>🔄 432</span>
                      <span>5min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discord Message Card 2 */}
              <div className="absolute bottom-20 right-16 bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-700 animate-float z-20 max-w-xs" style={{animationDelay: '0.5s'}}>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">FL</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-white text-sm">FlaTorcedor</span>
                      <span className="text-xs text-gray-400">now</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      GOOOAL! 🔴⚫ Just won 150 CHZ! Fanify is amazing! ⚽💰
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-400">💬 #celebration</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-32 right-32 w-4 h-4 bg-brand-600 rounded-full opacity-20 animate-pulse z-20"></div>
              <div className="absolute bottom-40 left-32 w-3 h-3 bg-brand-500 rounded-full opacity-30 animate-pulse z-20" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 right-20 w-2 h-2 bg-brand-400 rounded-full opacity-40 animate-pulse z-20" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}