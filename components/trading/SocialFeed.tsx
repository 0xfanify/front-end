import React, { useState, useEffect } from 'react';
import { Twitter, Hash, Heart, Repeat, Share, Clock, TrendingUp, MessageCircle } from 'lucide-react';

import twitterMessages from '@/app/data/twitter_messages.json';
import discordMessages from '@/app/data/discord_messages.json';

interface Game {
  homeTeam: { name: string; logo: string };
  awayTeam: { name: string; logo: string };
}

interface SocialFeedProps {
  currentGame: Game;
}

interface SocialPost {
  id: string;
  platform: 'twitter' | 'discord';
  author: string;
  content: string;
  timestamp: string;
  engagement: {
    likes: number;
    retweets?: number;
    replies: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
  team: 'home' | 'away' | 'neutral';
}

  // Interface para os dados JSON
  interface JsonMessage {
    data: string;
    usuario: string;
    mensagem: string;
    placar: string | null;
    platform: string;
    hora?: string;
  }

const SocialFeed: React.FC<SocialFeedProps> = ({ currentGame }) => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'twitter' | 'discord'>('all');

  // Função para determinar o sentimento baseado no conteúdo da mensagem
  const analyzeSentiment = (message: string, score: string | null): 'positive' | 'negative' | 'neutral' => {
    const lowerMessage = message.toLowerCase();
    
    // Palavras positivas
    const positiveWords = ['vence', 'ganha', 'vitória', 'fácil', 'certeza', 'forte', 'bom', 'ótimo', 'excelente', 'incrível', 'fantástico', 'perfeito'];
    // Palavras negativas
    const negativeWords = ['perde', 'derrota', 'ruim', 'péssimo', 'horrível', 'fracasso', 'desastre'];
    
    // Se tem placar, analisar baseado no resultado
    if (score) {
      if (score.toLowerCase().includes('psg') && score.toLowerCase().includes('vence')) {
        return 'positive';
      } else if (score.toLowerCase().includes('chelsea') && score.toLowerCase().includes('vence')) {
        return 'positive';
      }
    }
    
    // Contar palavras positivas e negativas
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  // Função para determinar o time baseado no conteúdo
  const determineTeam = (message: string, score: string | null): 'home' | 'away' | 'neutral' => {
    const lowerMessage = message.toLowerCase();
    
    if (score) {
      if (score.toLowerCase().includes('psg')) return 'home';
      if (score.toLowerCase().includes('chelsea')) return 'away';
    }
    
    if (lowerMessage.includes('psg')) return 'home';
    if (lowerMessage.includes('chelsea')) return 'away';
    
    return 'neutral';
  };

  // Função para gerar engajamento baseado no conteúdo
  const generateEngagement = (message: string, platform: string) => {
    const baseLikes = platform === 'twitter' ? 50 : 20;
    const baseReplies = platform === 'twitter' ? 10 : 5;
    
    // Engajamento baseado no tamanho da mensagem e palavras-chave
    const lengthMultiplier = Math.min(message.length / 50, 3);
    const hasEmojis = message.includes('🔥') || message.includes('⚽') || message.includes('🏆') || message.includes('💪') || message.includes('🎉');
    const hasHashtags = message.includes('#');
    
    const likes = Math.floor(baseLikes * lengthMultiplier * (hasEmojis ? 1.5 : 1) * (hasHashtags ? 1.3 : 1));
    const replies = Math.floor(baseReplies * lengthMultiplier);
    
    return {
      likes: Math.max(likes, 1),
      retweets: platform === 'twitter' ? Math.floor(likes * 0.3) : undefined,
      replies: Math.max(replies, 1)
    };
  };

  // Processar dados JSON
  useEffect(() => {
    const processJsonData = () => {
      const allPosts: SocialPost[] = [];
      
      // Processar mensagens do Twitter
      twitterMessages.forEach((msg: JsonMessage, index) => {
        const sentiment = analyzeSentiment(msg.mensagem, msg.placar);
        const team = determineTeam(msg.mensagem, msg.placar);
        const engagement = generateEngagement(msg.mensagem, 'twitter');
        
        allPosts.push({
          id: `twitter-${index}`,
          platform: 'twitter',
          author: msg.usuario,
          content: msg.mensagem,
          timestamp: msg.data, // Usar a data como timestamp
          engagement,
          sentiment,
          team
        });
      });
      
      // Processar mensagens do Discord
      discordMessages.forEach((msg: JsonMessage, index) => {
        const sentiment = analyzeSentiment(msg.mensagem, msg.placar);
        const team = determineTeam(msg.mensagem, msg.placar);
        const engagement = generateEngagement(msg.mensagem, 'discord');
        
        allPosts.push({
          id: `discord-${index}`,
          platform: 'discord',
          author: msg.usuario,
          content: msg.mensagem,
          timestamp: msg.hora || msg.data, // Usar hora se disponível, senão data
          engagement,
          sentiment,
          team
        });
      });
      
      // Ordenar por data/hora (mais recentes primeiro)
      return allPosts.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });
    };

    setPosts(processJsonData());
    
    // Atualizar posts a cada 10 segundos para simular feed ao vivo
    const interval = setInterval(() => {
      setPosts(prev => {
        const newPosts = processJsonData();
        // Manter apenas os posts mais recentes
        return newPosts.slice(0, 30);
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, [currentGame]);

  const filteredPosts = filter === 'all' ? posts : posts.filter(post => post.platform === filter);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-4 h-4 text-blue-500" />;
      case 'discord':
        return <Hash className="w-4 h-4 text-indigo-500" />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'border-blue-200 bg-blue-50';
      case 'discord':
        return 'border-indigo-200 bg-indigo-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Live Social Feed</h3>
          <p className="text-gray-600">Real-time fan reactions</p>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600 font-medium">Live</span>
        </div>
      </div>

      {/* Platform Filter */}
      <div className="flex space-x-2 mb-6">
        {['all', 'twitter', 'discord'].map((platform) => (
          <button
            key={platform}
            onClick={() => setFilter(platform as any)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === platform
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              {platform !== 'all' && getPlatformIcon(platform)}
              <span className="capitalize">{platform}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${getPlatformColor(post.platform)}`}
          >
            {/* Post Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getPlatformIcon(post.platform)}
                <span className="font-semibold text-gray-900 text-sm">{post.author}</span>
                {post.platform === 'twitter' && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{post.timestamp}</span>
              </div>
            </div>

            {/* Post Content */}
            <p className={`text-gray-800 text-sm leading-relaxed mb-3 ${getSentimentColor(post.sentiment)}`}>
              {post.content}
            </p>

            {/* Post Engagement */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{post.engagement.likes}</span>
              </div>
              {post.engagement.retweets && (
                <div className="flex items-center space-x-1">
                  <Repeat className="w-3 h-3" />
                  <span>{post.engagement.retweets}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{post.engagement.replies}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Share className="w-3 h-3" />
                <span>Share</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feed Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">{posts.filter(p => p.platform === 'twitter').length}</div>
            <div className="text-xs text-gray-500">Twitter Posts</div>
          </div>
          <div>
            <div className="text-lg font-bold text-indigo-600">{posts.filter(p => p.platform === 'discord').length}</div>
            <div className="text-xs text-gray-500">Discord Messages</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;