import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, BrainCircuit, MapPinned, PenLine, Sparkles } from 'lucide-react';
import { NavItem } from '../types/nav';

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'navigation.overview', icon: LayoutDashboard, tooltip: 'navigation.overview' },
  { href: '/self-assessment', label: 'navigation.selfAssessment', icon: BrainCircuit, tooltip: 'navigation.selfAssessment' },
  { href: '/financial-gps', label: 'navigation.financialGPS', icon: MapPinned, tooltip: 'navigation.financialGPS' },
  { href: '/expense-highlighter', label: 'navigation.expenseHighlighter', icon: PenLine, tooltip: 'navigation.expenseHighlighter' },
  { href: '/self-compassion', label: 'navigation.selfCompassion', icon: LayoutDashboard, tooltip: 'navigation.selfCompassion' },
];

export const APP_NAME = "common.appName";