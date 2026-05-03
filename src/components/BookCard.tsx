import React from 'react';
import { Book } from '../types';
import { Star, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
  key?: string | number;
}

export function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div 
      onClick={() => onClick(book)}
      className="bg-surface p-4 rounded-3xl shadow-sm border border-outline-variant flex flex-col gap-2 cursor-pointer active:scale-95 transition-all hover:shadow-md hover:bg-surface-variant overflow-hidden relative group"
    >
      {book.coverImage && (
        <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
          <img src={book.coverImage} className="w-full h-full object-cover blur-sm block" alt="" />
        </div>
      )}
      <div className="relative z-10 flex gap-4 items-start">
        {book.coverImage && (
          <div className="w-16 h-24 shrink-0 rounded-lg overflow-hidden border border-outline-variant shadow-sm">
            <img src={book.coverImage} className="w-full h-full object-cover" alt="Okładka" />
          </div>
        )}
        <div className="flex flex-col gap-1 items-start">
          <h3 className="text-lg font-medium text-on-surface leading-tight line-clamp-2">{book.title}</h3>
          <p className="text-sm text-on-surface-variant line-clamp-1">{book.author}</p>
        </div>
      </div>
      
      {/* Footer info: Rating or Notes or Session indicator */}
      <div className="flex items-center gap-2 mt-2 transition-colors relative z-10 flex-wrap">
        {book.status === 'READ' && typeof book.rating === 'number' && book.rating > 0 && (
          <div className="flex items-center gap-1 text-xs font-medium text-on-secondary-container bg-secondary-container px-2 py-1 rounded-full">
            <Star className="w-3 h-3 fill-current" />
            {book.rating}/5
          </div>
        )}
        {book.status === 'READING' && book.currentPage !== undefined && (
          <div className="flex items-center gap-1 text-xs font-medium text-tertiary bg-tertiary-container/30 px-2 py-1 rounded-full border border-tertiary/20">
            <BookOpen className="w-3 h-3" /> Str. {book.currentPage}
          </div>
        )}
        {book.notes && (
          <div className="text-xs text-on-surface-variant flex items-center gap-1 bg-surface-variant border border-outline-variant px-2 py-1 rounded-full">
            <BookOpen className="w-3 h-3" /> Note
          </div>
        )}
      </div>
    </div>
  );
}
