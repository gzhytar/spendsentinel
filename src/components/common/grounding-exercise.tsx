"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePanicMode } from '@/contexts/panic-mode-context';
import { Zap } from 'lucide-react';

export function GroundingExercise() {
  const { deactivatePanicMode } = usePanicMode();

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center">
          <Zap className="w-12 h-12 text-primary mb-2" />
          <CardTitle className="text-2xl text-center">Take a Moment to Breathe</CardTitle>
          <CardDescription className="text-center">
            Focus on your breath. You are safe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg">Let's try a quick grounding exercise:</p>
          <ul className="list-none space-y-2 text-muted-foreground">
            <li><strong className="text-primary">Notice 5 things</strong> you can see around you.</li>
            <li><strong className="text-primary">Notice 4 things</strong> you can touch.</li>
            <li><strong className="text-primary">Notice 3 things</strong> you can hear.</li>
            <li><strong className="text-primary">Notice 2 things</strong> you can smell.</li>
            <li><strong className="text-primary">Notice 1 thing</strong> you can taste.</li>
          </ul>
          <p className="mt-4">Breathe in deeply... and exhale slowly.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={deactivatePanicMode} className="w-full" variant="secondary">
            I'm Ready to Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
