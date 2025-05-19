"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, TrendingUp, Heart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { useI18n } from '@/contexts/i18n-context';

interface CalmScoreData {
  date: string;
  score: number;
}

export default function DashboardPage() {
  const { t } = useI18n();
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [calmScore, setCalmScore] = useState<number>(5);
  const [calmHistory, setCalmHistory] = useState<CalmScoreData[]>([]);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    if (showPrompt) {
      const prompts = t("selfCompassion.prompts") as unknown as string[];
      const randomIndex = Math.floor(Math.random() * prompts.length);
      setCurrentPrompt(prompts[randomIndex]);
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
    setShowPrompt(true)
    };
  
  const chartData = calmHistory.map((entry, index) => ({ name: `Day ${index + 1}`, score: entry.score }));

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl">{t('selfCompassion.title')}</CardTitle>
          </div>
          <CardDescription>{t('selfCompassion.subtitle')}</CardDescription>
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
                  {t('selfCompassion.calmScore.label')}
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
                {t('selfCompassion.calmScore.saveButton')}
              </Button>
            </>
          ) : (
            <Button onClick={handleNewPrompt} size="lg" variant="outline" className="w-full">
              {t('selfCompassion.calmScore.newPromptButton')}
            </Button>
          )}
        </CardFooter>
      </Card>

      {calmHistory.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-accent" />
              <CardTitle className="text-2xl">{t('selfCompassion.journey.title')}</CardTitle>
            </div>
            <CardDescription>{t('selfCompassion.journey.subtitle')}</CardDescription>
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
                {t('selfCompassion.journey.currentAverage')} { (chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length).toFixed(1) }
             </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 