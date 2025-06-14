import { LayoutDashboard, BrainCircuit, PenLine, CalendarCheck, MessageSquare, BookOpen } from 'lucide-react';
import { NavItem } from '../types/nav';

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'navigation.overview', icon: LayoutDashboard, tooltip: 'navigation.overview' },
  { href: '/self-assessment', label: 'navigation.selfAssessment', icon: BrainCircuit, tooltip: 'navigation.selfAssessment' },
  { href: '/daily-checkin', label: 'navigation.myJourney', icon: CalendarCheck, tooltip: 'navigation.myJourney' },
  { href: '/expense-highlighter', label: 'navigation.myFinances', icon: PenLine, tooltip: 'navigation.myFinances' },
  { href: '/blog', label: 'navigation.blog', icon: BookOpen, tooltip: 'navigation.blog' },
  { href: '/feedback', label: 'navigation.feedback', icon: MessageSquare, tooltip: 'navigation.feedback' },
];

export const APP_NAME = 'SpendSentinel';