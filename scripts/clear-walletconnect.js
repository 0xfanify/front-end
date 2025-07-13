#!/usr/bin/env node

/**
 * Utility script to clear WalletConnect data from localStorage
 * Run this in the browser console or as a bookmarklet during development
 */

const clearWalletConnectData = () => {
  const keysToRemove = [
    'wc_client',
    'wc_session',
    'wc_pairing',
    'wc_uri',
    'wc_peerId',
    'wc_peerMeta',
    'wc_chainId',
    'wc_accounts',
    'wc_connected',
  ];

  let clearedCount = 0;
  
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      clearedCount++;
      console.log(`Cleared: ${key}`);
    }
  });

  // Clear sessionStorage as well
  keysToRemove.forEach(key => {
    if (sessionStorage.getItem(key)) {
      sessionStorage.removeItem(key);
      clearedCount++;
      console.log(`Cleared from sessionStorage: ${key}`);
    }
  });

  console.log(`WalletConnect cleanup complete. Cleared ${clearedCount} items.`);
  
  // Reload the page to ensure clean state
  if (clearedCount > 0) {
    console.log('Reloading page for clean state...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
};

// If running in browser console
if (typeof window !== 'undefined') {
  clearWalletConnectData();
} else {
  console.log('This script should be run in the browser console.');
  console.log('Copy and paste the clearWalletConnectData function into your browser console.');
} 