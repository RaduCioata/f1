'use client';

import { useEffect } from 'react';
import { initNetworkStatusListeners } from '../utils/networkStatus';
import NetworkStatus from './NetworkStatus';

export default function NetworkStatusWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Initialize network status listeners on mount
  useEffect(() => {
    initNetworkStatusListeners();
  }, []);

  return (
    <>
      {children}
      <NetworkStatus />
    </>
  );
} 