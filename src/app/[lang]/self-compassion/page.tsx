"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Heart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { useI18n } from '@/contexts/i18n-context';
import { SelfCompassionScore } from '@/components/ui/self-compassion-score';

interface CalmScoreData {
  date: string;
  score: number;
}

export default function DashboardPage() {
  const { t } = useI18n();
  const [calmHistory, setCalmHistory] = useState<CalmScoreData[]>([]);

  useEffect(() => {
    // Load calm history from localStorage
    const storedHistory = localStorage.getItem('calmHistory');
    if (storedHistory) {
      setCalmHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleSaveCalmScore = (score: number) => {
    const newEntry: CalmScoreData = { date: new Date().toLocaleDateString(), score };
    const updatedHistory = [...calmHistory, newEntry].slice(-7); // Keep last 7 entries
    setCalmHistory(updatedHistory);
    localStorage.setItem('calmHistory', JSON.stringify(updatedHistory));
  };
  
  const chartData = calmHistory.map((entry, index) => ({ name: `Day ${index + 1}`, score: entry.score }));

  return (
    <div className="container mx-auto py-8 space-y-8 px-4">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">{t('selfCompassion.title')}</h1>
        </div>
        <p className="text-muted-foreground mb-6">{t('selfCompassion.subtitle')}</p>
        
        <SelfCompassionScore
          onScoreSave={handleSaveCalmScore}
          showPrompt={true}
          compact={false}
        />
      </div>

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