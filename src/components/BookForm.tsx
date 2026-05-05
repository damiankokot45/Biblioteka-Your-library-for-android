import React, { useState, useRef } from 'react';
import { Book, BookStatus } from '../types';
import { X, Save, Trash2, Star, Image as ImageIcon, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../lib/i18n';

interface BookFormProps {
  book?: Book;
  onSave: (book: Omit<Book, 'id' | 'addedAt'>) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
  enableGenres?: boolean;
}

export function BookForm({ book, onSave, onDelete, onClose, enableGenres }: BookFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [genre, setGenre] = useState(book?.genre || '');
  const [status, setStatus] = useState<BookStatus>(book?.status || 'TO_READ');
  const [rating, setRating] = useState<number>(book?.rating || 0);
  const [notes, setNotes] = useState(book?.notes || '');
  const [coverImage, setCoverImage] = useState(book?.coverImage || '');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    
    onSave({
      title: title.trim(),
      author: author.trim(),
      status,
      rating: status === 'READ' ? rating : undefined,
      notes: notes.trim(),
      isbn: book?.isbn || '',
      coverImage,
      ...(enableGenres && { genre }) // only include genre if it's enabled
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm transition-all text-left"
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden border border-outline-variant"
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant bg-surface">
          <h2 className="text-xl font-medium text-on-surface">
            {book ? t('editBook') : t('addBook')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 bg-surface-variant hover:opacity-80 rounded-full transition-all"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 bg-surface">
          <form id="book-form" onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Cover Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface ml-1">{t('coverOrBookmark')}</label>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="flex gap-4 items-center">
                <div 
                  className="w-24 h-32 bg-surface-variant border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center overflow-hidden shrink-0"
                >
                  {coverImage ? (
                    <img src={coverImage} alt="Okładka" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-on-surface-variant opacity-50" />
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2 px-4 bg-surface-variant hover:bg-surface-container-high rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-outline-variant"
                  >
                    <Upload className="w-4 h-4" />
                    {t('selectFromGallery')}
                  </button>
                  {coverImage && (
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="py-2 px-4 text-error text-sm font-medium hover:bg-error-container/20 rounded-xl transition-colors"
                    >
                      {t('removeCover')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface ml-1">{t('title')}</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('titlePlaceholder')}
                className="w-full bg-surface-variant border border-outline-variant rounded-2xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface ml-1">{t('author')}</label>
              <input 
                type="text" 
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={t('authorPlaceholder')}
                className="w-full bg-surface-variant border border-outline-variant rounded-2xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            {enableGenres && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface ml-1">Genre</label>
                <div className="relative">
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-surface-variant border border-outline-variant rounded-2xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                  >
                    <option value="">Select genre</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science">Science</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Biography">Biography</option>
                    <option value="History">History</option>
                    <option value="Poetry">Poetry</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface ml-1">{t('status')}</label>
              <div className="flex flex-col gap-2 bg-surface-variant p-2 rounded-2xl border border-outline-variant">
                <StatusOption 
                  label={t('statusToRead')} 
                  selected={status === 'TO_READ'} 
                  onClick={() => setStatus('TO_READ')} 
                />
                <StatusOption 
                  label={t('statusReading')} 
                  selected={status === 'READING'} 
                  onClick={() => setStatus('READING')} 
                />
                <StatusOption 
                  label={t('statusRead')} 
                  selected={status === 'READ'} 
                  onClick={() => setStatus('READ')} 
                />
              </div>
            </div>

            {status === 'READ' && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface ml-1">{t('rating')}</label>
                <div className="flex items-center gap-2 bg-surface-variant p-3 rounded-2xl border border-outline-variant justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-outline-variant'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface ml-1">{t('notes')}</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('notesPlaceholder')}
                rows={4}
                className="w-full bg-surface-variant border border-outline-variant rounded-2xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              />
            </div>

          </form>
        </div>

        <div className="p-4 bg-surface border-t border-outline-variant flex gap-3">
           {book && onDelete && (
             <button 
               type="button"
               onClick={() => onDelete(book.id)}
               className="px-4 py-3 bg-error-container text-on-error-container rounded-2xl md:rounded-full font-medium hover:opacity-80 flex items-center justify-center transition-opacity"
             >
               <Trash2 className="w-5 h-5" />
             </button>
           )}
           <button 
             type="submit"
             form="book-form"
             className="flex-1 py-3 px-6 bg-primary text-on-primary rounded-2xl md:rounded-full font-medium hover:bg-opacity-90 flex items-center justify-center gap-2 transition-colors border border-transparent"
           >
             <Save className="w-5 h-5" />
             {t('save')}
           </button>
        </div>
      </motion.div>
      
    </motion.div>
  );
}

function StatusOption({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 rounded-xl text-left font-medium transition-colors border border-transparent ${
        selected ? 'bg-secondary-container text-on-secondary-container shadow-sm border-outline-variant' : 'bg-transparent text-on-surface-variant hover:bg-surface'
      }`}
    >
      {label}
    </button>
  );
}
