import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FanToken {
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change24h: number;
  category: 'football' | 'esports';
  league: string;
  country: string;
}

const FanTokensSection: React.FC = () => {
  const [fanTokens, setFanTokens] = useState<FanToken[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<FanToken[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data for Fan Tokens
  useEffect(() => {
    const mockFanTokens: FanToken[] = [
      {
        symbol: 'MENGO',
        name: 'Flamengo',
        logo: '🔴',
        price: 2.45,
        change24h: 5.2,
        category: 'football',
        league: 'Brasileirão',
        country: 'Brazil'
      },
      {
        symbol: 'SPURS',
        name: 'Tottenham Hotspur',
        logo: '⚪',
        price: 1.85,
        change24h: -2.1,
        category: 'football',
        league: 'Premier League',
        country: 'England'
      },
      {
        symbol: 'AFC',
        name: 'Arsenal',
        logo: '🔴',
        price: 3.20,
        change24h: 8.7,
        category: 'football',
        league: 'Premier League',
        country: 'England'
      },
      {
        symbol: 'ASR',
        name: 'AS Roma',
        logo: '🟡',
        price: 1.95,
        change24h: 3.4,
        category: 'football',
        league: 'Serie A',
        country: 'Italy'
      },
      {
        symbol: 'OG',
        name: 'OG Esports',
        logo: '🟢',
        price: 0.85,
        change24h: 12.3,
        category: 'esports',
        league: 'Dota 2 Pro Circuit',
        country: 'Europe'
      },
      {
        symbol: 'PSG',
        name: 'Paris Saint-Germain',
        logo: '🔵',
        price: 4.15,
        change24h: 6.8,
        category: 'football',
        league: 'Ligue 1',
        country: 'France'
      },
      {
        symbol: 'BAR',
        name: 'FC Barcelona',
        logo: '🔵',
        price: 3.85,
        change24h: -1.2,
        category: 'football',
        league: 'La Liga',
        country: 'Spain'
      },
      {
        symbol: 'GAL',
        name: 'Galatasaray',
        logo: '🟡',
        price: 1.65,
        change24h: 4.1,
        category: 'football',
        league: 'Süper Lig',
        country: 'Turkey'
      },
      {
        symbol: 'JUV',
        name: 'Juventus',
        logo: '⚫',
        price: 2.75,
        change24h: 1.8,
        category: 'football',
        league: 'Serie A',
        country: 'Italy'
      },
      {
        symbol: 'CITY',
        name: 'Manchester City',
        logo: '🔵',
        price: 3.95,
        change24h: 7.2,
        category: 'football',
        league: 'Premier League',
        country: 'England'
      },
      {
        symbol: 'ATM',
        name: 'Atlético de Madrid',
        logo: '🔴',
        price: 2.35,
        change24h: -0.8,
        category: 'football',
        league: 'La Liga',
        country: 'Spain'
      },
      {
        symbol: 'ACM',
        name: 'AC Milan',
        logo: '🔴',
        price: 2.95,
        change24h: 5.6,
        category: 'football',
        league: 'Serie A',
        country: 'Italy'
      }
    ];

    setLoading(true);
    setTimeout(() => {
      setFanTokens(mockFanTokens);
      setFilteredTokens(mockFanTokens);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter tokens
  useEffect(() => {
    let filtered = fanTokens;

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(token => token.category === categoryFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(token => 
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.league.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTokens(filtered);
  }, [fanTokens, categoryFilter, searchTerm]);

  const TokenCard = ({ token }: { token: FanToken }) => (
    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-xl">
            {token.logo}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{token.name}</h3>
            <span className="text-sm text-gray-600">{token.symbol}</span>
          </div>
        </div>
      </div>

      {/* Price and Change */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">${token.price.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Current Price</div>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-bold ${
          token.change24h >= 0 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {token.change24h >= 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Chiliz Fan Tokens
        </h2>
        <p className="text-gray-600">
          Current prices and 24h changes
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span className="capitalize">{categoryFilter === 'all' ? 'All Sports' : categoryFilter}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="esports">Esports</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tokens Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTokens.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tokens found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTokens.map((token) => (
            <TokenCard key={token.symbol} token={token} />
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-brand-600">{fanTokens.length}</div>
            <div className="text-sm text-gray-600">Total Tokens</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {fanTokens.filter(t => t.change24h > 0).length}
            </div>
            <div className="text-sm text-gray-600">Gaining</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {fanTokens.filter(t => t.change24h < 0).length}
            </div>
            <div className="text-sm text-gray-600">Losing</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {(fanTokens.reduce((sum, token) => sum + token.change24h, 0) / fanTokens.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg Change</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FanTokensSection;