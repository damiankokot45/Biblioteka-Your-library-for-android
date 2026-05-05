export type BookStatus = 'TO_READ' | 'READING' | 'READ';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  rating?: number; // 1-5
  notes?: string;
  addedAt: number;
  coverImage?: string; // URL or base64
  isbn?: string;
  currentPage?: number;
  genre?: string;
}

export type AppThemeMode = 'light' | 'dark' | 'system';
export type AppColorTheme = string; // Hex color string
export type Language = 'en' | 'pl' | 'fr' | 'de' | 'es' | 'hu' | 'ro' | 'cs';

export interface UserSettings {
  themeMode: AppThemeMode;
  colorTheme: AppColorTheme;
  language: Language;
  enableGenres?: boolean;
}
