"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    type: 'spender' | 'hoarder' | 'avoider' | 'indulger';
  }[];
}

interface QuizProps {
  onComplete: (result: string) => void;
  onCancel: () => void;
}

export function FirefighterQuiz({ onComplete, onCancel }: QuizProps) {
  const { t } = useI18n();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedValue, setSelectedValue] = useState<string>('');

  const questions: QuizQuestion[] = [
    {
      id: 'stress-response',
      question: 'When you feel stressed about money, what\'s your first instinct?',
      options: [
        { value: 'shop', label: 'Browse online stores or go shopping', type: 'spender' },
        { value: 'save', label: 'Check my savings and move more money there', type: 'hoarder' },
        { value: 'ignore', label: 'Distract myself with something else', type: 'avoider' },
        { value: 'treat', label: 'Treat myself to something special', type: 'indulger' }
      ]
    },
    {
      id: 'unexpected-money',
      question: 'You receive an unexpected bonus. What do you do?',
      options: [
        { value: 'splurge', label: 'Immediately think of things to buy', type: 'spender' },
        { value: 'secure', label: 'Put it all in savings before I can spend it', type: 'hoarder' },
        { value: 'delay', label: 'Put off deciding what to do with it', type: 'avoider' },
        { value: 'celebrate', label: 'Plan a celebration or special experience', type: 'indulger' }
      ]
    },
    {
      id: 'financial-planning',
      question: 'How do you feel about budgeting and financial planning?',
      options: [
        { value: 'restrictive', label: 'It feels too restrictive and takes the fun out of life', type: 'spender' },
        { value: 'essential', label: 'It\'s essential - I track every penny', type: 'hoarder' },
        { value: 'overwhelming', label: 'It\'s overwhelming and I\'d rather not think about it', type: 'avoider' },
        { value: 'flexible', label: 'I prefer to keep things flexible for spontaneous enjoyment', type: 'indulger' }
      ]
    },
    {
      id: 'financial-regret',
      question: 'What type of financial decision do you most often regret?',
      options: [
        { value: 'impulse', label: 'Impulse purchases I didn\'t really need', type: 'spender' },
        { value: 'missing-out', label: 'Missing out on experiences because I was saving', type: 'hoarder' },
        { value: 'procrastination', label: 'Not dealing with financial issues sooner', type: 'avoider' },
        { value: 'overindulgence', label: 'Spending too much on luxury or entertainment', type: 'indulger' }
      ]
    }
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (selectedValue) {
      setAnswers({ ...answers, [questions[currentQuestion].id]: selectedValue });
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedValue(answers[questions[currentQuestion + 1].id] || '');
      } else {
        // Calculate result
        const typeScores: Record<string, number> = {
          spender: 0,
          hoarder: 0,
          avoider: 0,
          indulger: 0
        };

        Object.values(answers).forEach((answer) => {
          const question = questions.find(q => 
            q.options.some(opt => opt.value === answer)
          );
          if (question) {
            const option = question.options.find(opt => opt.value === answer);
            if (option) {
              typeScores[option.type]++;
            }
          }
        });

        // Add the current answer
        const currentOption = questions[currentQuestion].options.find(
          opt => opt.value === selectedValue
        );
        if (currentOption) {
          typeScores[currentOption.type]++;
        }

        // Find the type with the highest score
        const dominantType = Object.entries(typeScores).reduce((a, b) => 
          typeScores[a[0]] > typeScores[b[0]] ? a : b
        )[0];

        onComplete(dominantType);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedValue(answers[questions[currentQuestion - 1].id] || '');
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {questions[currentQuestion].question}
            </h3>

            <RadioGroup
              value={selectedValue}
              onValueChange={setSelectedValue}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-start space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={currentQuestion === 0 ? onCancel : handlePrevious}
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentQuestion === 0 ? 'Cancel' : 'Previous'}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selectedValue}
              size="sm"
            >
              {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 