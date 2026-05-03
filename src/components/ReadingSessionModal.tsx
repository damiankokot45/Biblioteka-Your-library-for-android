import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Book } from '../types';
import { X } from 'lucide-react';

interface ReadingSessionModalProps {
  books: Book[];
  onClose: () => void;
  onSave: (bookId: string, page: number) => void;
}

export function ReadingSessionModal({ books, onClose, onSave }: ReadingSessionModalProps) {
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<string>('');
  
  // Ograniczamy listę do Będę czytać i Czytam
  const availableBooks = books.filter(b => b.status === 'TO_READ' || b.status === 'READING');

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
        className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl flex flex-col border border-outline-variant"
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant">
           <h2 className="text-xl font-medium text-on-surface">Zakończono czytanie</h2>
           <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant">
             <X className="w-5 h-5"/>
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {availableBooks.length === 0 ? (
            <p className="text-on-surface-variant">Nie masz jeszcze żadnych dodanych książek o statusie "Będę czytać" lub "Czytam". Najpierw dodaj książkę.</p>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface ml-1">Jaką książkę czytałeś?</label>
                <select 
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full bg-surface-variant border border-outline-variant text-on-surface px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="" disabled>Wybierz książkę...</option>
                  {availableBooks.map(b => (
                    <option key={b.id} value={b.id}>{b.title} - {b.author}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface ml-1">Na której stronie skończyłeś?</label>
                <input 
                  type="number"
                  value={pageNumber}
                  onChange={(e) => setPageNumber(e.target.value)}
                  className="w-full bg-surface-variant border border-outline-variant text-on-surface px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  min="1"
                  placeholder="np. 42"
                />
              </div>
            </>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
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
