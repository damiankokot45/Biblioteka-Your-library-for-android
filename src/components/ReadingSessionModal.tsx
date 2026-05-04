import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book } from '../types';
import { X, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

interface ReadingSessionModalProps {
  books: Book[];
  onClose: () => void;
  onSave: (bookId: string, page: number) => void;
}

export function ReadingSessionModal({ books, onClose, onSave }: ReadingSessionModalProps) {
  const { t } = useTranslation();
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
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
      setShowSuccess(true);
      setTimeout(() => {
        onSave(selectedBookId, parseInt(pageNumber, 10));
      }, 1500);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/70 backdrop-blur-sm transition-all"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="bg-[#1f1e1b] w-full max-w-sm rounded-[2rem] shadow-2xl flex flex-col relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors z-10 w-9 h-9 flex items-center justify-center">
          <X className="w-4 h-4"/>
        </button>

        <AnimatePresence mode="wait">
          {showSuccess ? (
             <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 flex flex-col items-center justify-center min-h-[400px] text-center"
             >
                <div className="relative mb-8 mt-4">
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ type: "spring", stiffness: 200, damping: 15 }}
                     className="w-24 h-24 bg-[#e09b69] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(224,155,105,0.3)]"
                   >
                     <Check className="w-12 h-12 text-[#2c1d11]" strokeWidth={3} />
                   </motion.div>
                </div>
                
                <h2 className="text-2xl font-medium text-white mb-2 tracking-wide">Reading logged!</h2>
                <p className="text-white/70 mb-10 text-sm">
                  Great job reading<br/> <span className="italic text-[#e09b69]">{selectedBook?.title}</span>
                </p>
             </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit} 
              className="p-8 flex flex-col gap-8 min-h-[400px] justify-center"
            >
              <div className="flex flex-col items-center text-center mt-2 mb-2">
                 <div className="w-20 h-20 bg-[#e09b69]/10 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-[#e09b69]" />
                 </div>
                 <h2 className="text-[1.35rem] font-medium text-white tracking-wide">{t('updateProgressMessage')}</h2>
              </div>

              {availableBooks.length === 0 ? (
                <p className="text-white/60 text-center">{t('addBookFirst')}</p>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2 relative">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider ml-1 px-1">{t('whatBookReading')}</label>
                    <div 
                      className="relative"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <div className="w-full bg-[#2a2925] border border-white/5 text-white px-5 py-4 rounded-[1.5rem] flex items-center justify-between cursor-pointer">
                        <span className={selectedBook ? "text-white line-clamp-1" : "text-white/40"}>
                          {selectedBook ? `${selectedBook.title}` : t('selectBook')}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>

                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 top-full mt-2 left-0 right-0 bg-[#35332f] border border-white/5 rounded-[1.5rem] shadow-xl max-h-60 overflow-y-auto overflow-x-hidden p-2 flex flex-col gap-1"
                          >
                            {availableBooks.map(b => (
                              <div
                                key={b.id}
                                onClick={() => {
                                  setSelectedBookId(b.id);
                                  setIsDropdownOpen(false);
                                }}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                                  selectedBookId === b.id ? 'bg-[#e09b69]/20 text-[#e09b69]' : 'hover:bg-white/5 text-white'
                                }`}
                              >
                                {b.coverImage ? (
                                  <img src={b.coverImage} alt="" className="w-8 h-12 object-cover rounded shadow-sm" />
                                ) : (
                                  <div className="w-8 h-12 bg-white/5 rounded flex shadow-sm shrink-0" />
                                )}
                                <div className="flex flex-col flex-1 min-w-0">
                                  <span className="font-medium text-sm truncate">{b.title}</span>
                                  <span className="text-xs opacity-60 truncate">{b.author}</span>
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
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider ml-1 px-1">{t('whatPageFinished')}</label>
                    <div className="flex flex-col gap-1">
                      <input 
                        type="number"
                        value={pageNumber}
                        onChange={(e) => setPageNumber(e.target.value)}
                        className="w-full bg-[#2a2925] border border-white/5 text-white px-5 py-4 rounded-[1.5rem] focus:outline-none focus:ring-1 focus:ring-[#e09b69]/50 placeholder:text-white/20"
                        placeholder="e.g. 150"
                        required
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-center mt-auto">
                <button
                   type="submit"
                   disabled={!selectedBookId || !pageNumber || availableBooks.length === 0}
                   className="w-full px-6 py-4 rounded-[1.5rem] font-medium bg-[#e09b69] text-[#2c1d11] disabled:opacity-50 disabled:grayscale transition-all hover:bg-[#e8a371] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#e09b69]/20 flex items-center justify-center gap-2"
                 >
                   Log Progress
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
