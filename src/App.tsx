import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { argbFromHex, themeFromSourceColor, applyTheme } from "@material/material-color-utilities";
import { Book, BookStatus, UserSettings } from './types';
import { BookCard } from './components/BookCard';
import { BookForm } from './components/BookForm';
import { BookQuickView } from './components/BookQuickView';
import { SettingsModal } from './components/SettingsModal';
import { BookShelf } from './components/BookShelf';
import { ReaderHero } from './components/ReaderHero';

import { ReadingSessionModal } from './components/ReadingSessionModal';
import { StatsDashboard } from './components/StatsDashboard';
import { Plus, BookOpen, ArrowUpDown, Settings, Bookmark, Library, BookCheck, Search, X, BarChart2 } from 'lucide-react';
import { LanguageContext, getTranslation } from './lib/i18n';

type AppTab = BookStatus | 'SHELF' | 'STATS';

const TABS: { id: AppTab; labelKey: string; icon: React.ElementType }[] = [
  { id: 'SHELF', labelKey: 'tabShelf', icon: Library },
  { id: 'TO_READ', labelKey: 'tabToRead', icon: Bookmark },
  { id: 'READING', labelKey: 'tabReading', icon: BookOpen },
  { id: 'READ', labelKey: 'tabRead', icon: BookCheck },
  { id: 'STATS', labelKey: 'tabStats', icon: BarChart2 },
];

type SortOption = 'date' | 'title' | 'author' | 'rating';

export default function App() {
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('biblioteka_books');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse books from local storage', e);
      }
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<AppTab>('SHELF');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [viewingBook, setViewingBook] = useState<Book | undefined>(undefined);

  // Session state
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('biblioteka_settings');
    
    let defaultSettings: UserSettings = {
      themeMode: 'dark', 
      colorTheme: '#e09b69', 
      language: 'en'
    };
    
    // For backwards compatibility, handle old values
    let parsedSettings = saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    
    if (!parsedSettings.colorTheme || !parsedSettings.colorTheme.startsWith('#')) {
      parsedSettings.colorTheme = '#e09b69';
    }
    if (!parsedSettings.language) {
      parsedSettings.language = 'en';
    }
    
    return parsedSettings;
  });



  useEffect(() => {
    localStorage.setItem('biblioteka_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('biblioteka_settings', JSON.stringify(settings));

    const applyAppTheme = () => {
      const isDark = settings.themeMode === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : settings.themeMode === 'dark';
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Material You color generation
      try {
        const sourceColor = argbFromHex(settings.colorTheme);
        const theme = themeFromSourceColor(sourceColor);
        applyTheme(theme, { target: document.documentElement, dark: isDark });
      } catch (e) {
        console.error("Invalid color applied", e);
      }
    };

    applyAppTheme();
    
    if (settings.themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyAppTheme);
      return () => mediaQuery.removeEventListener('change', applyAppTheme);
    }
  }, [settings]);

  const handleSaveBook = (bookData: Omit<Book, 'id' | 'addedAt'>) => {
    if (editingBook) {
      setBooks(prev => prev.map(b => b.id === editingBook.id ? { ...b, ...bookData } : b));
    } else {
      const newBook: Book = {
        ...bookData,
        id: crypto.randomUUID(),
        addedAt: Date.now()
      };
      setBooks(prev => [...prev, newBook]);
    }
    closeForm();
  };

  const handleDeleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    closeForm();
  };

  const openBookView = (book: Book) => {
    setViewingBook(book);
  };

  const openNewForm = () => {
    setEditingBook(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (book: Book) => {
    setViewingBook(undefined);
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingBook(undefined);
    setIsFormOpen(false);
  };

  const handleMoveBook = (bookId: string, newStatus: BookStatus, newIndex: number) => {
    setBooks(prev => {
      // Find the book and its current array
      const bookIndex = prev.findIndex(b => b.id === bookId);
      if (bookIndex === -1) return prev;
      
      const oldStatus = prev[bookIndex].status;
      let finishedAt = prev[bookIndex].finishedAt;
      
      if (newStatus === 'READ' && oldStatus !== 'READ') {
        finishedAt = Date.now();
      } else if (newStatus !== 'READ') {
        finishedAt = undefined;
      }

      const book = { ...prev[bookIndex], status: newStatus, finishedAt };
      
      // Remove the book from previous array
      const newBooks = [...prev];
      newBooks.splice(bookIndex, 1);
      
      // We need to insert it into the correct position relative to OTHER books in the target status
      // Because 'prev' contains all books, not just the ones in this shelf
      // Let's find where to insert it in the whole array by looking at the books in the target status
      const targetStatusBooks = newBooks.filter(b => b.status === newStatus);
      
      if (newIndex >= targetStatusBooks.length) {
        // Just push to the end
        newBooks.push(book);
      } else {
        // Find the global index of the item that currently occupies newIndex in targetStatusBooks
        const itemBeforeNewIndex = targetStatusBooks[newIndex];
        const globalInsertIndex = newBooks.findIndex(b => b.id === itemBeforeNewIndex.id);
        newBooks.splice(globalInsertIndex, 0, book);
      }
      
      return newBooks;
    });
  };

  const handleStopReading = (details: { durationInSeconds: number }) => {
    setIsSessionModalOpen(true);
  };

  const handleSaveReadingSession = (bookId: string, page: number) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          status: 'READING',
          currentPage: page
        };
      }
      return b;
    }));
    setIsSessionModalOpen(false);
  };

  const searchedBooks = books.filter(book => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.isbn?.toLowerCase().includes(q)
    );
  });

  const filteredBooks = searchedBooks
    .filter(b => b.status === activeTab)
    .sort((a, b) => {
      switch (sortBy) {
        case 'title': return a.title.localeCompare(b.title);
        case 'author': return a.author.localeCompare(b.author);
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'date':
        default: return b.addedAt - a.addedAt;
      }
    });

  const t = (key: string) => getTranslation(settings.language, key);

  const handleClearAllData = () => {
    if (confirm(t('confirmClearData'))) {
      localStorage.removeItem('biblioteka_books');
      localStorage.removeItem('biblioteka_isReading');
      localStorage.removeItem('biblioteka_readingStartTime');
      // We keep settings (language/theme) for better UX unless they specifically want a factory reset
      // but if we want to be thorough:
      // localStorage.clear();
      
      window.location.reload();
    }
  };

  return (
    <LanguageContext.Provider value={settings.language}>
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-on-background font-sans selection:bg-primary-container selection:text-on-primary-container transition-colors duration-300">
      
      <header className="pt-12 pb-2 px-6 sticky top-0 z-50 flex items-center justify-between transition-colors duration-300">
        <h1 className="text-3xl font-medium tracking-tight text-on-surface flex items-center gap-3">
          <div className="bg-primary/20 p-2.5 rounded-2xl">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          {t('library')}
        </h1>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 bg-surface-variant/40 rounded-full hover:bg-surface-variant transition-colors"
        >
          <Settings className="w-5 h-5 text-on-surface" />
        </button>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-4 pb-36 w-full max-w-4xl mx-auto">
        {activeTab === 'SHELF' ? (
          <motion.div 
            key="SHELF"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Search Bar */}
            <div className="px-2 mt-2 max-w-4xl mx-auto w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-variant/50 text-on-surface placeholder:text-on-surface-variant pl-12 pr-12 py-3.5 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-variant transition-all shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <BookShelf books={searchedBooks} onBookClick={openBookView} onMoveBook={handleMoveBook} />

            <ReaderHero onStopReading={handleStopReading} books={books} />
          </motion.div>
        ) : activeTab === 'STATS' ? (
          <motion.div 
            key="STATS"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <StatsDashboard books={books} />
          </motion.div>
        ) : (
          <>
            {/* Sorting Control */}
            <div className="mb-6 flex justify-end">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant bg-surface-variant border border-outline-variant py-2 px-3 rounded-xl shadow-sm transition-colors">
                <ArrowUpDown className="w-4 h-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent border-none focus:outline-none cursor-pointer text-on-surface font-medium font-sans w-full max-w-[150px] appearance-none"
                >
                  <option value="date">{t('sortByDate')}</option>
                  <option value="title">{t('sortByTitle')} (A-Z)</option>
                  <option value="author">{t('sortByAuthor')} (A-Z)</option>
                  {activeTab === 'READ' && <option value="rating">{t('sortByRating')} (Desc)</option>}
                </select>
              </div>
            </div>

            {filteredBooks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center px-4"
              >
                 <div className="w-24 h-24 bg-surface-variant rounded-[2rem] flex items-center justify-center mb-6">
                    <BookOpen className="w-8 h-8 text-on-surface-variant" />
                 </div>
                 <h2 className="text-lg font-medium text-on-surface mb-2">{t('emptyShelfTitle')}</h2>
                 <p className="text-on-surface-variant max-w-xs">
                   {t('emptyShelfDesc')}
                 </p>
              </motion.div>
            ) : (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {filteredBooks.map((book, index) => (
                    <BookCard 
                      key={book.id}
                      book={book} 
                      onClick={() => openBookView(book)} 
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* FAB - Material You Style */}
      <button
        onClick={() => openNewForm()}
        className="fixed right-6 bottom-24 md:right-10 md:bottom-28 bg-primary-container text-on-primary-container p-4 rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-primary active:scale-95 z-20"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Navigation Bar (Bottom) - Material 3 Style */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-outline-variant px-2 transition-colors duration-300">
        <div className="flex justify-around items-center h-20 max-w-md mx-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 group relative focus:outline-none"
              >
                <div 
                  className={`px-5 py-1 rounded-full transition-colors relative z-10 ${
                    isActive 
                      ? 'text-on-secondary-container' 
                      : 'text-on-surface-variant group-hover:bg-surface-variant'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-secondary-container rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isActive ? [1, 0.8, 1.15, 1] : 1,
                      y: isActive ? [0, -2, 0] : 0,
                      rotate: isActive ? [0, -10, 10, 0] : 0,
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <Icon className={`w-6 h-6 mx-auto ${isActive ? 'fill-current opacity-20 relative' : ''}`} />
                    {isActive && (
                      <Icon className="w-6 h-6 mx-auto absolute inset-0" />
                    )}
                  </motion.div>
                </div>
                <motion.span 
                  initial={false}
                  animate={{
                     scale: isActive ? 1.05 : 1,
                     fontWeight: isActive ? 600 : 500,
                  }}
                  className={`text-xs ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}
                >
                  {t(tab.labelKey)}
                </motion.span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {isSessionModalOpen && (
          <ReadingSessionModal
            books={books}
            onClose={() => setIsSessionModalOpen(false)}
            onSave={handleSaveReadingSession}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingBook && (
          <BookQuickView 
            book={viewingBook} 
            onClose={() => setViewingBook(undefined)}
            onEdit={() => openEditForm(viewingBook)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFormOpen && (
          <BookForm 
            book={editingBook} 
            onSave={handleSaveBook} 
            onDelete={editingBook ? handleDeleteBook : undefined}
            onClose={closeForm}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            settings={settings}
            onChange={setSettings}
            books={books}
            onImport={setBooks}
            onClearAllData={handleClearAllData}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
    </LanguageContext.Provider>
  );
}
