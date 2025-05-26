import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, BrainCircuit, PenLine, Sparkles, CalendarCheck } from 'lucide-react';
import { NavItem } from '../types/nav';

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'navigation.overview', icon: LayoutDashboard, tooltip: 'navigation.overview' },
  { href: '/self-assessment', label: 'navigation.selfAssessment', icon: BrainCircuit, tooltip: 'navigation.selfAssessment' },
  { href: '/daily-checkin', label: 'navigation.dailyCheckIn', icon: CalendarCheck, tooltip: 'navigation.dailyCheckIn' },
  { href: '/expense-highlighter', label: 'navigation.myFinancialDecisions', icon: PenLine, tooltip: 'navigation.myFinancialDecisions' },
];

export const APP_NAME = "common.appName";