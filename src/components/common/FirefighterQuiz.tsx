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
    type: 'spender' | 'hoarder' | 'avoider' | 'indulger' | 'planner' | 'expenseController' | 'unsure';
  }[];
}

interface QuizProps {
  onComplete: (result: string) => void;
  onCancel: () => void;
  onSuggestDeepAssessment?: () => void;
}

export function FirefighterQuiz({ onComplete, onCancel, onSuggestDeepAssessment }: QuizProps) {
  const { t } = useI18n();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [unsureCount, setUnsureCount] = useState(0);

  const questions: QuizQuestion[] = [
    {
      id: 'stress-response',
      question: t('selfAssessment.quiz.questions.stressResponse.question'),
      options: [
        { value: 'shop', label: t('selfAssessment.quiz.questions.stressResponse.options.shop'), type: 'spender' },
        { value: 'save', label: t('selfAssessment.quiz.questions.stressResponse.options.save'), type: 'hoarder' },
        { value: 'ignore', label: t('selfAssessment.quiz.questions.stressResponse.options.ignore'), type: 'avoider' },
        { value: 'treat', label: t('selfAssessment.quiz.questions.stressResponse.options.treat'), type: 'indulger' },
        { value: 'plan', label: t('selfAssessment.quiz.questions.stressResponse.options.plan'), type: 'planner' },
        { value: 'control', label: t('selfAssessment.quiz.questions.stressResponse.options.control'), type: 'expenseController' },
        { value: 'unsure-1', label: t('selfAssessment.quiz.unsureOption'), type: 'unsure' }
      ]
    },
    {
      id: 'unexpected-money',
      question: t('selfAssessment.quiz.questions.unexpectedMoney.question'),
      options: [
        { value: 'splurge', label: t('selfAssessment.quiz.questions.unexpectedMoney.options.splurge'), type: 'spender' },
        { value: 'secure', label: t('selfAssessment.quiz.questions.unexpectedMoney.options.secure'), type: 'hoarder' },
        { value: 'delay', label: t('selfAssessment.quiz.questions.unexpectedMoney.options.delay'), type: 'avoider' },
        { value: 'celebrate', label: t('selfAssessment.quiz.questions.unexpectedMoney.options.celebrate'), type: 'indulger' },
        { value: 'research', label: t('selfAssessment.quiz.questions.unexpectedMoney.options.research'), type: 'planner' },
        { value: 'discuss', label: t('selfAssessment.quiz.questions.unexpectedMoney.options.discuss'), type: 'expenseController' },
        { value: 'unsure-2', label: t('selfAssessment.quiz.unsureOption'), type: 'unsure' }
      ]
    },
    {
      id: 'financial-planning',
      question: t('selfAssessment.quiz.questions.financialPlanning.question'),
      options: [
        { value: 'restrictive', label: t('selfAssessment.quiz.questions.financialPlanning.options.restrictive'), type: 'spender' },
        { value: 'essential', label: t('selfAssessment.quiz.questions.financialPlanning.options.essential'), type: 'hoarder' },
        { value: 'overwhelming', label: t('selfAssessment.quiz.questions.financialPlanning.options.overwhelming'), type: 'avoider' },
        { value: 'flexible', label: t('selfAssessment.quiz.questions.financialPlanning.options.flexible'), type: 'indulger' },
        { value: 'detailed', label: t('selfAssessment.quiz.questions.financialPlanning.options.detailed'), type: 'planner' },
        { value: 'monitoring', label: t('selfAssessment.quiz.questions.financialPlanning.options.monitoring'), type: 'expenseController' },
        { value: 'unsure-3', label: t('selfAssessment.quiz.unsureOption'), type: 'unsure' }
      ]
    },
    {
      id: 'financial-regret',
      question: t('selfAssessment.quiz.questions.financialRegret.question'),
      options: [
        { value: 'impulse', label: t('selfAssessment.quiz.questions.financialRegret.options.impulse'), type: 'spender' },
        { value: 'missing-out', label: t('selfAssessment.quiz.questions.financialRegret.options.missingOut'), type: 'hoarder' },
        { value: 'procrastination', label: t('selfAssessment.quiz.questions.financialRegret.options.procrastination'), type: 'avoider' },
        { value: 'overindulgence', label: t('selfAssessment.quiz.questions.financialRegret.options.overindulgence'), type: 'indulger' },
        { value: 'overPlanning', label: t('selfAssessment.quiz.questions.financialRegret.options.overPlanning'), type: 'planner' },
        { value: 'arguments', label: t('selfAssessment.quiz.questions.financialRegret.options.arguments'), type: 'expenseController' },
        { value: 'unsure-4', label: t('selfAssessment.quiz.unsureOption'), type: 'unsure' }
      ]
    },
    {
      id: 'money-anxiety',
      question: t('selfAssessment.quiz.questions.moneyAnxiety.question'),
      options: [
        { value: 'notEnough', label: t('selfAssessment.quiz.questions.moneyAnxiety.options.notEnough'), type: 'spender' },
        { value: 'running', label: t('selfAssessment.quiz.questions.moneyAnxiety.options.running'), type: 'hoarder' },
        { value: 'dealing', label: t('selfAssessment.quiz.questions.moneyAnxiety.options.dealing'), type: 'avoider' },
        { value: 'missing', label: t('selfAssessment.quiz.questions.moneyAnxiety.options.missing'), type: 'indulger' },
        { value: 'losing', label: t('selfAssessment.quiz.questions.moneyAnxiety.options.losing'), type: 'planner' },
        { value: 'others', label: t('selfAssessment.quiz.questions.moneyAnxiety.options.others'), type: 'expenseController' },
        { value: 'unsure-5', label: t('selfAssessment.quiz.unsureOption'), type: 'unsure' }
      ]
    },
    {
      id: 'daily-money',
      question: t('selfAssessment.quiz.questions.dailyMoney.question'),
      options: [
        { value: 'rarely', label: t('selfAssessment.quiz.questions.dailyMoney.options.rarely'), type: 'spender' },
        { value: 'crisis', label: t('selfAssessment.quiz.questions.dailyMoney.options.crisis'), type: 'hoarder' },
        { value: 'avoiding', label: t('selfAssessment.quiz.questions.dailyMoney.options.avoiding'), type: 'avoider' },
        { value: 'enjoying', label: t('selfAssessment.quiz.questions.dailyMoney.options.enjoying'), type: 'indulger' },
        { value: 'constantly', label: t('selfAssessment.quiz.questions.dailyMoney.options.constantly'), type: 'planner' },
        { value: 'monitoring', label: t('selfAssessment.quiz.questions.dailyMoney.options.monitoring'), type: 'expenseController' },
        { value: 'unsure-6', label: t('selfAssessment.quiz.unsureOption'), type: 'unsure' }
      ]
    }
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (selectedValue) {
      const currentOption = questions[currentQuestion].options.find(
        opt => opt.value === selectedValue
      );
      
      // Count unsure answers
      let newUnsureCount = unsureCount;
      if (currentOption?.type === 'unsure') {
        newUnsureCount = unsureCount + 1;
        setUnsureCount(newUnsureCount);
      }

      setAnswers({ ...answers, [questions[currentQuestion].id]: selectedValue });
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedValue(answers[questions[currentQuestion + 1].id] || '');
      } else {
        // Check if user answered "unsure" to too many questions (3 or more out of 6)
        if (newUnsureCount >= 3 && onSuggestDeepAssessment) {
          onSuggestDeepAssessment();
          return;
        }

        // Calculate result
        const typeScores: Record<string, number> = {
          spender: 0,
          hoarder: 0,
          avoider: 0,
          indulger: 0,
          planner: 0,
          expenseController: 0
        };

        // Count all answers except current one
        Object.values(answers).forEach((answer) => {
          const question = questions.find(q => 
            q.options.some(opt => opt.value === answer)
          );
          if (question) {
            const option = question.options.find(opt => opt.value === answer);
            if (option && option.type !== 'unsure') {
              typeScores[option.type]++;
            }
          }
        });

        // Add the current answer if it's not unsure
        if (currentOption && currentOption.type !== 'unsure') {
          typeScores[currentOption.type]++;
        }

        // Check if we have any non-unsure answers
        const totalNonUnsureAnswers = Object.values(typeScores).reduce((sum, score) => sum + score, 0);
        
        if (totalNonUnsureAnswers === 0) {
          // All answers were unsure, suggest deep assessment
          if (onSuggestDeepAssessment) {
            onSuggestDeepAssessment();
            return;
          }
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
      // If we're going back and the previous answer was "unsure", decrease the count
      const previousAnswer = answers[questions[currentQuestion - 1].id];
      if (previousAnswer) {
        const previousQuestion = questions[currentQuestion - 1];
        const previousOption = previousQuestion.options.find(opt => opt.value === previousAnswer);
        if (previousOption?.type === 'unsure' && unsureCount > 0) {
          setUnsureCount(unsureCount - 1);
        }
      }
      
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
              {t('selfAssessment.quiz.navigation.progress', { 
                current: currentQuestion + 1, 
                total: questions.length 
              })}
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
                    className={`text-sm font-normal cursor-pointer ${
                      option.type === 'unsure' ? 'text-muted-foreground italic' : ''
                    }`}
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
              {currentQuestion === 0 ? t('selfAssessment.quiz.navigation.cancel') : t('selfAssessment.quiz.navigation.previous')}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selectedValue}
              size="sm"
            >
              {currentQuestion === questions.length - 1 ? t('selfAssessment.quiz.navigation.seeResults') : t('selfAssessment.quiz.navigation.next')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 