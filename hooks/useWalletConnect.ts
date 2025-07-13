import { useEffect, useRef } from 'react';

// Global flag to track if WalletConnect has been initialized
let isWalletConnectInitialized = false;

export const useWalletConnect = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    // Only initialize once per component lifecycle
    if (!initializedRef.current && !isWalletConnectInitialized) {
      isWalletConnectInitialized = true;
      initializedRef.current = true;
    }

    // Cleanup function
    return () => {
      if (process.env.NODE_ENV === 'development') {
        // In development, reset the flag on unmount to allow for hot reloads
        setTimeout(() => {
          isWalletConnectInitialized = false;
        }, 100);
      }
    };
  }, []);

  return {
    isInitialized: isWalletConnectInitialized,
  };
}; 