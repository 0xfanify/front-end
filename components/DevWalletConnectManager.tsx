'use client';

import { useEffect } from 'react';

// This component only runs in development mode to help manage WalletConnect lifecycle
export const DevWalletConnectManager: React.FC = () => {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Clean up any existing WalletConnect sessions on page load
    const cleanupWalletConnect = () => {
      try {
        // Clear localStorage items that might cause conflicts
        const keysToRemove = [
          'wc_client',
          'wc_session',
          'wc_pairing',
          'wc_uri',
        ];
        
        keysToRemove.forEach(key => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
          }
        });

        // Clear any existing WalletConnect modal if it exists
        const wcModal = document.querySelector('[data-testid="walletconnect-modal"]');
        if (wcModal) {
          wcModal.remove();
        }
      } catch (error) {
        console.warn('WalletConnect cleanup warning:', error);
      }
    };

    // Run cleanup on mount
    cleanupWalletConnect();

    // Set up cleanup on page unload
    const handleBeforeUnload = () => {
      cleanupWalletConnect();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanupWalletConnect();
    };
  }, []);

  // This component doesn't render anything
  return null;
}; 