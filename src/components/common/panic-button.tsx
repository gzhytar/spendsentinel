"use client";

import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePanicMode } from '@/contexts/panic-mode-context';
import { cn } from '@/lib/utils';

export function PanicButton() {
  const { togglePanicMode, isPanicActive } = usePanicMode();

  return (
    <Button
      variant="destructive"
      size="icon"
      className={cn(
        "fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-xl z-50 transition-opacity duration-300",
        isPanicActive && "opacity-50 pointer-events-none" // Dim if panic mode is already active from another source
      )}
      onClick={togglePanicMode}
      aria-label="Panic Button"
    >
      <ShieldAlert className="h-7 w-7" />
    </Button>
  );
}
