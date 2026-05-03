import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book } from '../types';
import { X, ChevronDown, Check } from 'lucide-react';

interface ReadingSessionModalProps {
  books: Book[];
  onClose: () => void;
  onSave: (bookId: string, page: number) => void;
}

export function ReadingSessionModal({ books, onClose, onSave }: ReadingSessionModalProps) {
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Ograniczamy listę do Będę czytać i Czytam
  const availableBooks = books.filter(b => b.status === 'TO_READ' || b.status === 'READING');

  const selectedBook = availableBooks.find(b => b.id === selectedBookId);

  useEffect(() => {
    if (selectedBookId) {
      const book = books.find(b => b.id === selectedBookId);
      if (book && book.currentPage !== undefined) {
        setPageNumber(book.currentPage.toString());
      } else {
        setPageNumber('');
      }
    }
  }, [selectedBookId]); // Only reset pageNumber when the selected book changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBookId && pageNumber) {
      onSave(selectedBookId, parseInt(pageNumber, 10));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm transition-all"
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl flex flex-col border border-outline-variant max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant">
           <h2 className="text-xl font-medium text-on-surface">Zakończono czytanie</h2>
           <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant">
             <X className="w-5 h-5"/>
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
          {availableBooks.length === 0 ? (
            <p className="text-on-surface-variant">Nie masz jeszcze żadnych dodanych książek o statusie "Będę czytać" lub "Czytam". Najpierw dodaj książkę.</p>
          ) : (
            <>
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm font-medium text-on-surface ml-1">Jaką książkę czytałeś?</label>
                
                {/* Custom Select */}
                <div 
                  className="relative"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="w-full bg-surface-variant border border-outline-variant text-on-surface px-4 py-3 rounded-2xl flex items-center justify-between cursor-pointer">
                    <span className={selectedBook ? "text-on-surface line-clamp-1" : "text-on-surface-variant"}>
                      {selectedBook ? `${selectedBook.title} - ${selectedBook.author}` : "Wybierz książkę..."}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-on-surface-variant transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 top-full mt-2 left-0 right-0 bg-surface border border-outline-variant rounded-2xl shadow-lg max-h-60 overflow-y-auto overflow-x-hidden p-2 flex flex-col gap-1"
                      >
                        {availableBooks.map(b => (
                          <div
                            key={b.id}
                            onClick={() => {
                              setSelectedBookId(b.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                              selectedBookId === b.id ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-variant text-on-surface'
                            }`}
                          >
                            {b.coverImage ? (
                              <img src={b.coverImage} alt="" className="w-8 h-12 object-cover rounded shadow-sm" />
                            ) : (
                              <div className="w-8 h-12 bg-surface-variant rounded flex shadow-sm shrink-0" />
                            )}
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="font-medium text-sm truncate">{b.title}</span>
                              <span className="text-xs opacity-80 truncate">{b.author}</span>
                            </div>
                            {selectedBookId === b.id && <Check className="w-5 h-5 mr-1" />}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface ml-1">Na której stronie skończyłeś?</label>
                <div className="flex flex-col gap-1">
                  <input 
                    type="number"
                    value={pageNumber}
                    onChange={(e) => setPageNumber(e.target.value)}
                    className="w-full bg-surface-variant border border-outline-variant text-on-surface px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    min="1"
                    placeholder="np. 42"
                  />
                  <AnimatePresence>
                    {selectedBook?.currentPage && (
                      <motion.span 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-on-surface-variant ml-2 mt-1"
                      >
                        Ostatnio zapisana strona: <strong className="text-primary">{selectedBook.currentPage}</strong>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant mt-auto">
            <button
               type="button"
               onClick={onClose}
               className="px-6 py-2 rounded-full font-medium text-on-surface hover:bg-surface-variant transition-colors"
             >
               Anuluj
            </button>
            <button
               type="submit"
               disabled={!selectedBookId || !pageNumber || availableBooks.length === 0}
               className="px-6 py-2 rounded-full font-medium bg-primary text-on-primary disabled:opacity-50 transition-colors"
             >
               Zapisz postęp
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
