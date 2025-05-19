export interface TimelineEvent {
  id: string;
  type: 'past' | 'present' | 'future';
  title: string;
  date: string; // Store as YYYY-MM-DD for easier sorting/date object creation
  description: string;
}

export interface VisionBoardItem {
  id: string;
  type: 'text' | 'image';
  content: string; // URL for image (or keywords for placeholder), text for text
  description?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // Store as YYYY-MM-DD
  category: 'living' | 'lifestyle' | 'unassigned';
}

export interface CalmScoreEntry {
  date: string; // Full date string or ISO
  score: number; // 1-10
}
