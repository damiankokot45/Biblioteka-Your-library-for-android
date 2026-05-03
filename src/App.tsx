import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { argbFromHex, themeFromSourceColor, applyTheme } from "@material/material-color-utilities";
import { Book, BookStatus, UserSettings } from './types';
import { BookCard } from './components/BookCard';
import { BookForm } from './components/BookForm';
import { SettingsModal } from './components/SettingsModal';
import { BookShelf } from './components/BookShelf';
import { Plus, BookOpen, ArrowUpDown, Settings, Bookmark, Library, BookCheck } from 'lucide-react';

type AppTab = BookStatus | 'SHELF';

const TABS: { id: AppTab; label: string; icon: React.ElementType }[] = [
  { id: 'SHELF', label: 'Półka', icon: Library },
  { id: 'TO_READ', label: 'Będę czytać', icon: Bookmark },
  { id: 'READING', label: 'Czytam', icon: BookOpen },
  { id: 'READ', label: 'Przeczytane', icon: BookCheck },
];

type SortOption = 'date' | 'title' | 'author' | 'rating';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>('SHELF');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('biblioteka_settings');
    // For backwards compatibility, handle old values
    let parsedSettings = saved ? JSON.parse(saved) : { themeMode: 'system', colorTheme: '#10b981' };
    if (!parsedSettings.colorTheme.startsWith('#')) {
      parsedSettings.colorTheme = '#10b981';
    }
    return parsedSettings;
  });

  useEffect(() => {
    const saved = localStorage.getItem('biblioteka_books');
    if (saved) {
      try {
        setBooks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse books from local storage', e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('biblioteka_books', JSON.stringify(books));
    }
  }, [books, isLoading]);

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

  const openForm = (book?: Book) => {
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
      
      const book = { ...prev[bookIndex], status: newStatus };
      
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

  const filteredBooks = books
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

  return (
    <div className="min-h-screen bg-background text-on-background font-sans selection:bg-primary-container selection:text-on-primary-container transition-colors duration-300">
      
      {/* App Bar */}
      <header className="bg-surface/90 backdrop-blur-md pt-12 pb-4 px-6 sticky top-0 z-50 flex items-center justify-between transition-colors duration-300 border-b border-outline-variant/30">
        <h1 className="text-3xl font-normal tracking-tight text-on-surface flex items-center gap-3">
          <div className="bg-primary-container p-2 rounded-2xl">
            <BookOpen className="w-6 h-6 text-on-primary-container" />
          </div>
          Biblioteka
        </h1>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 bg-surface-variant border border-outline-variant rounded-full hover:opacity-80 transition-colors shadow-sm"
        >
          <Settings className="w-6 h-6 text-on-surface-variant" />
        </button>
      </header>

      {/* Tabs removed, will be added at bottom */}

      {/* Main Content */}
      <main className="px-4 pb-36 max-w-4xl mx-auto">
        {activeTab === 'SHELF' ? (
          <BookShelf books={books} onBookClick={openForm} onMoveBook={handleMoveBook} />
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
                  <option value="date">Data dodania</option>
                  <option value="title">Tytuł (A-Z)</option>
                  <option value="author">Autor (A-Z)</option>
                  {activeTab === 'READ' && <option value="rating">Ocena (Malejąco)</option>}
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
                 <h2 className="text-lg font-medium text-on-surface mb-2">Brak książek</h2>
                 <p className="text-on-surface-variant max-w-xs">
                   Kliknij przycisk poniżej, aby dodać swoją pierwszą książkę na tę listę.
                 </p>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                <AnimatePresence>
                  {filteredBooks.map(book => (
                    <motion.div
                      key={book.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <BookCard 
                        book={book} 
                        onClick={() => openForm(book)} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* FAB - Material You Style */}
      <button
        onClick={() => openForm()}
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
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 group"
              >
                <div 
                  className={`px-5 py-1 rounded-full transition-colors ${
                    isActive 
                      ? 'bg-secondary-container text-on-secondary-container' 
                      : 'text-on-surface-variant group-hover:bg-surface-variant'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto" />
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modals */}
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
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
