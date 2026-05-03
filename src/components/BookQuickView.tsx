import React from 'react';
import { Book } from '../types';
import { X, Edit2, Star, BookOpen, Bookmark, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface BookQuickViewProps {
  book: Book;
  onClose: () => void;
  onEdit: () => void;
}

const statusConfig = {
  TO_READ: { label: 'Będę czytać', icon: Bookmark, color: 'text-primary' },
  READING: { label: 'Czytam', icon: BookOpen, color: 'text-tertiary' },
  READ: { label: 'Przeczytane', icon: CheckCircle2, color: 'text-secondary' },
};

export function BookQuickView({ book, onClose, onEdit }: BookQuickViewProps) {
  const StatusIcon = statusConfig[book.status].icon;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm transition-all text-left"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl flex flex-col overflow-hidden border border-outline-variant"
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant bg-surface sticky top-0 z-10">
          <div className={`flex items-center gap-2 ${statusConfig[book.status].color} font-medium px-3 py-1.5 bg-surface-variant rounded-full text-sm`}>
            <StatusIcon className="w-4 h-4" />
            {statusConfig[book.status].label}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onEdit}
              className="p-2 hover:bg-surface-variant rounded-full text-on-surface transition-colors"
              title="Edytuj"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[80vh]">
          <div className="flex gap-6 items-start">
            {book.coverImage ? (
              <div className="w-32 shrink-0 rounded-lg overflow-hidden border border-outline-variant shadow-lg h-48">
                <img src={book.coverImage} className="w-full h-full object-cover" alt="Okładka" />
              </div>
            ) : (
              <div className="w-32 shrink-0 rounded-lg overflow-hidden border border-outline-variant shadow-lg h-48 bg-surface-variant flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-on-surface-variant opacity-50" />
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-on-surface leading-tight">{book.title}</h2>
              <p className="text-lg text-on-surface-variant">{book.author}</p>
              
              {book.isbn && (
                <p className="text-xs text-on-surface-variant/70 mt-2 font-mono">ISBN: {book.isbn}</p>
              )}

              {book.currentPage !== undefined && book.status === 'READING' && (
                <div className="flex items-center gap-2 mt-2 font-medium text-tertiary">
                  <BookOpen className="w-4 h-4" />
                  <span>Obecnie na stronie {book.currentPage}</span>
                </div>
              )}

              {book.status === 'READ' && book.rating && (
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < book.rating! ? 'fill-primary text-primary' : 'text-surface-variant'}`} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {book.notes && (
            <div className="bg-surface-variant/50 p-4 rounded-2xl border border-outline-variant/50">
              <h4 className="text-sm font-medium text-on-surface mb-2">Notatki</h4>
              <p className="text-on-surface-variant text-sm whitespace-pre-wrap">{book.notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
