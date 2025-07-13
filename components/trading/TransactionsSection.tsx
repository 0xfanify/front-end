import React, { useState, useEffect } from 'react';
import { 
  ExternalLink,
  Copy,
  Filter,
  Search,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  Trophy,
  Gift,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Hash,
  Eye,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAccount } from 'wagmi';

interface Transaction {
  hash: string;
  type: 'stake' | 'unstake' | 'bet' | 'claim' | 'approve' | 'mint' | 'burn';
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: number;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  token: string;
  gasUsed: string;
  gasPrice: string;
  details: {
    team?: string;
    gameId?: string;
    amount?: string;
    bonus?: string;
    odds?: string;
  };
}

const TransactionsSection: React.FC = () => {
  const { address: account } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTxs, setFilteredTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Mock transactions data
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
        type: 'stake',
        status: 'confirmed',
        timestamp: Date.now() - 3600000, // 1 hour ago
        blockNumber: 15234567,
        from: account || '0x0000000000000000000000000000000000000000',
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e', // Staking contract
        value: '100.0',
        token: 'CHZ',
        gasUsed: '65432',
        gasPrice: '20.5',
        details: {
          amount: '100.0',
          bonus: '0%'
        }
      },
      {
        hash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
        type: 'mint',
        status: 'confirmed',
        timestamp: Date.now() - 3650000,
        blockNumber: 15234568,
        from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
        to: account || '0x0000000000000000000000000000000000000000',
        value: '100000.0',
        token: 'HYPE',
        gasUsed: '45123',
        gasPrice: '18.2',
        details: {
          amount: '100000.0'
        }
      },
      {
        hash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
        type: 'approve',
        status: 'confirmed',
        timestamp: Date.now() - 7200000, // 2 hours ago
        blockNumber: 15234550,
        from: account || '0x0000000000000000000000000000000000000000',
        to: '0x8B5D1A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A5A', // HYPE token
        value: '50000.0',
        token: 'HYPE',
        gasUsed: '46789',
        gasPrice: '22.1',
        details: {
          amount: '50000.0'
        }
      },
      {
        hash: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        type: 'bet',
        status: 'confirmed',
        timestamp: Date.now() - 10800000, // 3 hours ago
        blockNumber: 15234540,
        from: account || '0x0000000000000000000000000000000000000000',
        to: '0x9C6E2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A', // Betting contract
        value: '25000.0',
        token: 'HYPE',
        gasUsed: '78901',
        gasPrice: '25.3',
        details: {
          team: 'PSG',
          gameId: '0x123...abc',
          amount: '25000.0',
          odds: '1.85'
        }
      },
      {
        hash: '0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
        type: 'stake',
        status: 'confirmed',
        timestamp: Date.now() - 86400000, // 1 day ago
        blockNumber: 15230123,
        from: account || '0x0000000000000000000000000000000000000000',
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
        value: '75.5',
        token: 'FLA',
        gasUsed: '67890',
        gasPrice: '19.8',
        details: {
          team: 'Flamengo',
          amount: '75.5',
          bonus: '+50%'
        }
      },
      {
        hash: '0x6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
        type: 'claim',
        status: 'confirmed',
        timestamp: Date.now() - 172800000, // 2 days ago
        blockNumber: 15225678,
        from: '0x9C6E2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A',
        to: account || '0x0000000000000000000000000000000000000000',
        value: '46250.0',
        token: 'HYPE',
        gasUsed: '89012',
        gasPrice: '21.7',
        details: {
          team: 'PSG',
          gameId: '0x456...def',
          amount: '46250.0'
        }
      },
      {
        hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
        type: 'unstake',
        status: 'pending',
        timestamp: Date.now() - 300000, // 5 minutes ago
        blockNumber: 15234580,
        from: account || '0x0000000000000000000000000000000000000000',
        to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
        value: '50.0',
        token: 'CHZ',
        gasUsed: '0',
        gasPrice: '23.4',
        details: {
          amount: '50.0'
        }
      },
      {
        hash: '0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567',
        type: 'bet',
        status: 'failed',
        timestamp: Date.now() - 600000, // 10 minutes ago
        blockNumber: 15234575,
        from: account || '0x0000000000000000000000000000000000000000',
        to: '0x9C6E2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A2A',
        value: '15000.0',
        token: 'HYPE',
        gasUsed: '0',
        gasPrice: '24.1',
        details: {
          team: 'REAL',
          gameId: '0x789...ghi',
          amount: '15000.0',
          odds: '2.15'
        }
      }
    ];

    setLoading(true);
    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTxs(mockTransactions);
      setLoading(false);
    }, 1000);
  }, [account]);

  // Filter transactions
  useEffect(() => {
    let filtered = transactions;

    if (filter !== 'all') {
      filtered = filtered.filter(tx => tx.type === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.details.team?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTxs(filtered);
  }, [filter, searchTerm, transactions]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stake':
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'unstake':
        return <ArrowDownLeft className="w-4 h-4 text-blue-600" />;
      case 'bet':
        return <Trophy className="w-4 h-4 text-purple-600" />;
      case 'claim':
        return <Gift className="w-4 h-4 text-yellow-600" />;
      case 'approve':
        return <CheckCircle className="w-4 h-4 text-indigo-600" />;
      case 'mint':
        return <Zap className="w-4 h-4 text-brand-600" />;
      case 'burn':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Hash className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const formatValue = (value: string, token: string) => {
    const num = parseFloat(value);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M ${token}`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K ${token}`;
    } else {
      return `${num.toFixed(2)} ${token}`;
    }
  };

  const openInExplorer = (hash: string) => {
    // Mock explorer URL - replace with real Chiliz explorer
    window.open(`https://scan.chiliz.com/tx/${hash}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Transaction History
        </h2>
        <p className="text-gray-600">
          All your blockchain transactions on Chiliz Chain
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by hash, type, token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span className="capitalize">{filter === 'all' ? 'All Types' : filter}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="stake">Stake</SelectItem>
                <SelectItem value="unstake">Unstake</SelectItem>
                <SelectItem value="bet">Bet</SelectItem>
                <SelectItem value="claim">Claim</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="mint">Mint</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        ) : filteredTxs.length === 0 ? (
          <div className="p-8 text-center">
            <Hash className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTxs.map((tx) => (
              <div key={tx.hash} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  {/* Transaction Type & Status */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      {getTypeIcon(tx.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900 capitalize">{tx.type}</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(tx.status)}
                            <span className="capitalize">{tx.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">{formatTimestamp(tx.timestamp)}</div>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatValue(tx.value, tx.token)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Block #{tx.blockNumber.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">From:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-gray-900">{formatHash(tx.from)}</span>
                        <button
                          onClick={() => copyToClipboard(tx.from)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">To:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-gray-900">{formatHash(tx.to)}</span>
                        <button
                          onClick={() => copyToClipboard(tx.to)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gas Used:</span>
                      <span className="font-mono text-gray-900">{parseInt(tx.gasUsed).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gas Price:</span>
                      <span className="font-mono text-gray-900">{tx.gasPrice} Gwei</span>
                    </div>
                  </div>
                </div>

                {/* Specific Details */}
                {tx.details && Object.keys(tx.details).length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Transaction Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {tx.details.team && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Team:</span>
                          <span className="font-medium text-gray-900">{tx.details.team}</span>
                        </div>
                      )}
                      {tx.details.gameId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Game ID:</span>
                          <span className="font-mono text-gray-900">{formatHash(tx.details.gameId)}</span>
                        </div>
                      )}
                      {tx.details.odds && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Odds:</span>
                          <span className="font-medium text-gray-900">{tx.details.odds}x</span>
                        </div>
                      )}
                      {tx.details.bonus && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bonus:</span>
                          <span className="font-medium text-green-600">{tx.details.bonus}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Transaction Hash & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Hash:</span>
                    <span className="font-mono text-sm text-gray-900">{formatHash(tx.hash)}</span>
                    <button
                      onClick={() => copyToClipboard(tx.hash)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {copiedHash === tx.hash ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openInExplorer(tx.hash)}
                    className="text-brand-600 border-brand-200 hover:bg-brand-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View on Explorer
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl font-bold text-green-600">{transactions.filter(tx => tx.type === 'stake').length}</div>
          <div className="text-sm text-gray-600">Stakes</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl font-bold text-purple-600">{transactions.filter(tx => tx.type === 'bet').length}</div>
          <div className="text-sm text-gray-600">Bets</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl font-bold text-yellow-600">{transactions.filter(tx => tx.type === 'claim').length}</div>
          <div className="text-sm text-gray-600">Claims</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
          <div className="text-2xl font-bold text-gray-600">{transactions.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsSection;