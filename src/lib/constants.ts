import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, BrainCircuit, MapPinned, PenLine, Sparkles } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/expense-highlighter', label: 'Expense Highlighter', icon: PenLine, tooltip: 'Expense Highlighter' },
  { href: '/financial-gps', label: 'Financial GPS', icon: MapPinned, tooltip: 'Financial GPS' },
  { href: '/', label: 'Self-Compassion', icon: LayoutDashboard, tooltip: 'Self-Compassion' },
  { href: '/ifs-dialogue', label: 'IFS Dialogue', icon: BrainCircuit, tooltip: 'IFS Dialogue' },
];

export const APP_NAME = "InnerBalance";

export const SELF_COMPASSION_PROMPTS: string[] = [
  "Today, I will treat myself with the same kindness I would offer a good friend.",
  "Mistakes are a part of learning. I forgive myself for any financial missteps.",
  "I am doing my best with what I have, and that is enough.",
  "I acknowledge my financial fears without judgment and offer myself comfort.",
  "I choose to focus on progress, not perfection, in my financial journey."
];
