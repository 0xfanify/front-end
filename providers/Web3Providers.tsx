"use client";

import '@rainbow-me/rainbowkit/styles.css';
import {
  connectorsForWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  walletConnectWallet,
  metaMaskWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { http } from 'viem';
import { spicy } from 'viem/chains';
import React, { useEffect, useState } from "react";
import { useWalletConnect } from '@/hooks/useWalletConnect';

// Singleton pattern to prevent multiple initializations
let configInstance: ReturnType<typeof createConfig> | null = null;
let queryClientInstance: QueryClient | null = null;

const getConfig = () => {
  if (!configInstance) {
    const connectors = connectorsForWallets(
      [
        {
          groupName: 'Recomendado',
          wallets: [
            metaMaskWallet,
            injectedWallet,
            walletConnectWallet,
          ],
        },
      ],
      {
        appName: 'FanifyChiliz',
        projectId: '3ac832407e6d725a1f6d2bdae6c1d049',
      }
    );

    configInstance = createConfig({
      connectors,
      chains: [spicy],
      transports: {
        [spicy.id]: http('https://spicy-rpc.chiliz.com'),
      },
    });
  }
  return configInstance;
};

const getQueryClient = () => {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          gcTime: 10 * 60 * 1000, // 10 minutes
        },
      },
    });
  }
  return queryClientInstance;
};

export default function Web3Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { isInitialized } = useWalletConnect();

  useEffect(() => {
    setMounted(true);
    
    // Cleanup function to handle component unmounting
    return () => {
      // This will help with cleanup during development hot reloads
      if (process.env.NODE_ENV === 'development') {
        // Small delay to allow for cleanup
        setTimeout(() => {
          // Reset instances on unmount in development
          configInstance = null;
          queryClientInstance = null;
        }, 100);
      }
    };
  }, []);

  // Prevent hydration issues and wait for WalletConnect initialization
  if (!mounted || !isInitialized) {
    return null;
  }

  const config = getConfig();
  const queryClient = getQueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 