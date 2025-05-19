"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Brain, Shield, Heart, ArrowRight, Lightbulb, TrendingUp, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Transform Your Relationship with Money
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover how understanding your emotional patterns can lead to better financial decisions and lasting change.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button size="lg" asChild>
            <Link href="/ifs-dialogue">
              Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Theory Section */}
      <section className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">The Financial Firefighters Model</CardTitle>
            </div>
            <CardDescription>Understanding the emotional landscape of financial decisions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Financial decisions are rarely just about numbers. They're deeply intertwined with our emotions, past experiences, and psychological patterns. The Financial Firefighters model helps you understand and transform these patterns.
            </p>
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Why Emotions Matter</h3>
                <p className="text-muted-foreground">
                  Traditional financial advice often focuses on knowledge and discipline, but ignores the emotional factors that drive our decisions. Understanding these emotional patterns is key to lasting change.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">The IFS Connection</h3>
                <p className="text-muted-foreground">
                  Based on Internal Family Systems (IFS) therapy, this model helps you identify and work with the different "parts" of yourself that influence your financial behaviors.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Firefighter Types Section */}
      <section className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Flame className="w-8 h-8 text-destructive" />
              <CardTitle className="text-2xl">Types of Financial Firefighters</CardTitle>
            </div>
            <CardDescription>Recognize your patterns and understand their purpose</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">The Spender</h3>
                <p className="text-muted-foreground">
                  Uses shopping and spending to cope with stress, seeking immediate comfort through purchases.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">The Hoarder</h3>
                <p className="text-muted-foreground">
                  Saves excessively, often driven by fear and anxiety about future security.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">The Avoider</h3>
                <p className="text-muted-foreground">
                  Avoids dealing with finances altogether, often due to past negative experiences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Core Features</CardTitle>
            </div>
            <CardDescription>Tools designed to help you transform your financial relationship</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Lightbulb className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Expense Highlighter</h3>
                    <p className="text-muted-foreground">
                      Categorize expenses as 'Living' vs. 'Lifestyle' to promote mindful spending decisions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <TrendingUp className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Financial GPS</h3>
                    <p className="text-muted-foreground">
                      Track your financial journey with a clear view of past decisions and future goals.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MessageSquare className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">IFS Dialogue</h3>
                    <p className="text-muted-foreground">
                      Engage in guided conversations with your financial parts to understand their needs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Heart className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Self-Compassion Practice</h3>
                    <p className="text-muted-foreground">
                      Develop a kinder relationship with yourself and your financial journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
} 