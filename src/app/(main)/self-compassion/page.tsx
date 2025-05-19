"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { SELF_COMPASSION_PROMPTS } from "@/lib/constants";
import { Lightbulb, TrendingUp, Heart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';


interface CalmScoreData {
  date: string;
  score: number;
}

export default function DashboardPage() {
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [calmScore, setCalmScore] = useState<number>(5);
  const [calmHistory, setCalmHistory] = useState<CalmScoreData[]>([]);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    // Load a random prompt on initial mount and when showPrompt becomes true
    if (showPrompt) {
      const randomIndex = Math.floor(Math.random() * SELF_COMPASSION_PROMPTS.length);
      setCurrentPrompt(SELF_COMPASSION_PROMPTS[randomIndex]);
    }
  }, [showPrompt]);

  useEffect(() => {
    // Load calm history from localStorage
    const storedHistory = localStorage.getItem('calmHistory');
    if (storedHistory) {
      setCalmHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleSaveCalmScore = () => {
    const newEntry: CalmScoreData = { date: new Date().toLocaleDateString(), score: calmScore };
    const updatedHistory = [...calmHistory, newEntry].slice(-7); // Keep last 7 entries
    setCalmHistory(updatedHistory);
    localStorage.setItem('calmHistory', JSON.stringify(updatedHistory));
    setShowPrompt(false); // Hide prompt after saving score
  };

  const handleNewPrompt = () => {
    setShowPrompt(true); // This will trigger the useEffect to pick a new prompt
  };
  
  const chartData = calmHistory.map((entry, index) => ({ name: `Day ${index + 1}`, score: entry.score }));

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl">Daily Self-Compassion</CardTitle>
          </div>
          <CardDescription>A moment for kindness and reflection.</CardDescription>
        </CardHeader>
        {showPrompt && currentPrompt && (
          <CardContent>
            <div className="p-6 bg-primary/10 rounded-lg flex items-start space-x-3">
              <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <p className="text-lg text-primary-foreground leading-relaxed">{currentPrompt}</p>
            </div>
          </CardContent>
        )}
        <CardFooter className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          {showPrompt && currentPrompt ? (
            <>
              <div className="flex-1 w-full sm:w-auto">
                <label htmlFor="calm-score" className="block text-sm font-medium text-muted-foreground mb-2">
                  How calm do you feel right now? (1-10)
                </label>
                <div className="flex items-center space-x-3">
                  <Slider
                    id="calm-score"
                    min={1}
                    max={10}
                    step={1}
                    value={[calmScore]}
                    onValueChange={(value) => setCalmScore(value[0])}
                    className="flex-grow"
                  />
                  <span className="font-semibold text-primary w-8 text-center">{calmScore}</span>
                </div>
              </div>
              <Button onClick={handleSaveCalmScore} size="lg">
                Save Score & Reflect
              </Button>
            </>
          ) : (
            <Button onClick={handleNewPrompt} size="lg" variant="outline" className="w-full">
              Get a New Self-Compassion Prompt
            </Button>
          )}
        </CardFooter>
      </Card>

      {calmHistory.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-accent" />
              <CardTitle className="text-2xl">Your Calm Journey</CardTitle>
            </div>
            <CardDescription>Track your self-reported calm scores over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40}>
                     <LabelList dataKey="score" position="top" fill="hsl(var(--primary-foreground))" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
             <Progress value={ (calmHistory[calmHistory.length-1]?.score || 0) * 10} className="mt-4 h-3" />
             <p className="text-sm text-muted-foreground text-center mt-2">
                Current average calm: { (chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length).toFixed(1) }
             </p>
          </CardContent>
        </Card>
      )}
       <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Ratio of Self-Critical Statements</CardTitle>
            <CardDescription>Monitor your inner dialogue. (Placeholder for tracking)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Feature coming soon. This section will help you track and understand patterns in self-critical thoughts, promoting a more compassionate inner voice.</p>
          </CardContent>
        </Card>
    </div>
  );
} 