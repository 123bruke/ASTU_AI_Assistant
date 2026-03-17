
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
}
