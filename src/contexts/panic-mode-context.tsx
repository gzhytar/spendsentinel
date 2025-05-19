"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

interface PanicModeContextType {
  isPanicActive: boolean;
  togglePanicMode: () => void;
  activatePanicMode: () => void;
  deactivatePanicMode: () => void;
}

const PanicModeContext = createContext<PanicModeContextType | undefined>(undefined);

export function PanicModeProvider({ children }: { children: ReactNode }) {
  const [isPanicActive, setIsPanicActive] = useState(false);

  const togglePanicMode = useCallback(() => {
    setIsPanicActive(prev => !prev);
  }, []);

  const activatePanicMode = useCallback(() => {
    setIsPanicActive(true);
  }, []);

  const deactivatePanicMode = useCallback(() => {
    setIsPanicActive(false);
  }, []);

  return (
    <PanicModeContext.Provider value={{ isPanicActive, togglePanicMode, activatePanicMode, deactivatePanicMode }}>
      {children}
    </PanicModeContext.Provider>
  );
}

export function usePanicMode() {
  const context = useContext(PanicModeContext);
  if (context === undefined) {
    throw new Error('usePanicMode must be used within a PanicModeProvider');
  }
  return context;
}
