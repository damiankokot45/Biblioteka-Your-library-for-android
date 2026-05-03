import React, { useState, useRef } from 'react';
import { Book, BookStatus } from '../types';
import { X, Save, Trash2, Star, Camera, Search, Image as ImageIcon, Upload } from 'lucide-react';
import { ScannerModal } from './ScannerModal';
import { motion } from 'motion/react';

interface BookFormProps {
  book?: Book;
  onSave: (book: Omit<Book, 'id' | 'addedAt'>) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export function BookForm({ book, onSave, onDelete, onClose }: BookFormProps) {
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [status, setStatus] = useState<BookStatus>(book?.status || 'TO_READ');
  const [rating, setRating] = useState<number>(book?.rating || 0);
  const [notes, setNotes] = useState(book?.notes || '');
  const [isbn, setIsbn] = useState(book?.isbn || '');
  const [coverImage, setCoverImage] = useState(book?.coverImage || '');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBookInfo = async (isbnToSearch: string) => {
    if (!isbnToSearch) return;
    setIsLoadingInfo(true);
    try {
      let found = false;
      let coverFound = false;

      // 1. Google Books API
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnToSearch}`);
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            found = true;
            const bookData = data.items[0].volumeInfo;
            if (bookData.title) setTitle(bookData.title);
            if (bookData.authors?.length > 0) setAuthor(bookData.authors.join(', '));
            
            if (bookData.imageLinks?.thumbnail) {
              setCoverImage(bookData.imageLinks.thumbnail.replace('http:', 'https:'));
              coverFound = true;
            }
          }
        }
      } catch (e) {
        console.warn("Google Books API fail", e);
      }
      
      // 2. Biblioteka Narodowa API (Polish books)
      if (!found) {
        try {
          const bnRes = await fetch(`https://data.bn.org.pl/api/bibs.json?isbn=${isbnToSearch}`);
          if (bnRes.ok) {
            const bnData = await bnRes.json();
            if (bnData.bibs && bnData.bibs.length > 0) {
              found = true;
              const bib = bnData.bibs[0];
              if (bib.title) setTitle(bib.title);
              if (bib.author) {
                const cleanAuthor = bib.author.replace(/\(.*?\)/g, '').replace(/\.$/, '').trim().split(',').reverse().join(' ').trim();
                setAuthor(cleanAuthor || bib.author);
              }
            }
          }
        } catch (e) {
          console.warn("BN API fail", e);
        }
      }

      // 3. Open Library API
      if (!found || !coverFound) {
        try {
          const olRes = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbnToSearch}&format=json&jscmd=data`);
          if (olRes.ok) {
            const olData = await olRes.json();
            const bookKey = `ISBN:${isbnToSearch}`;
            if (olData[bookKey]) {
              const bookData = olData[bookKey];
              if (!found) {
                found = true;
                if (bookData.title) setTitle(bookData.title);
                if (bookData.authors?.length > 0) setAuthor(bookData.authors.map((a: any) => a.name).join(', '));
              }
              if (!coverFound && bookData.cover?.large) {
                setCoverImage(bookData.cover.large);
                coverFound = true;
              }
            }
          }
        } catch (e) {
          console.warn("Open Library fail", e);
        }
      }
      
      if (!found) {
        alert("Nie znaleziono książki o podanym numerze ISBN. Możesz wpisać dane ręcznie lub zrobić zdjęcie samodzielnie.");
      } else if (!coverFound) {
        alert("Pobrano dane książki, ale nie znaleziono okładki. Dodaj ją ręcznie, zrób zdjęcie książki.");
      }
    } catch (err) {
      alert("Błąd podczas pobierania danych o książce.");
    } finally {
      setIsLoadingInfo(false);
    }
  };

  const handleScan = (scannedIsbn: string) => {
    setIsbn(scannedIsbn);
    setIsScannerOpen(false);
    fetchBookInfo(scannedIsbn);
  };

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
      isbn: isbn.trim(),
      coverImage
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
            {book ? 'Edytuj książkę' : 'Nowa książka'}
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
            
            {/* ISBN and Scanning */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface ml-1">ISBN (Skanowania ułatwia dodanie)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  placeholder="ISBN"
                  className="w-full bg-surface-variant border border-outline-variant rounded-2xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => fetchBookInfo(isbn)}
                  disabled={!isbn || isLoadingInfo}
                  className="p-3 bg-secondary-container text-on-secondary-container rounded-2xl hover:opacity-80 transition-opacity disabled:opacity-50"
                  title="Pobierz dane na podstawie ISBN"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="p-3 bg-primary-container text-on-primary-container rounded-2xl hover:opacity-80 transition-opacity whitespace-nowrap flex items-center justify-center"
                  title="Skanuj kod aparatem"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              {isLoadingInfo && <span className="text-xs text-on-surface-variant ml-1 animate-pulse">Pobieranie danych...</span>}
            </div>

            {/* Cover Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface ml-1">Okładka / Zakładka</label>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
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
                    Wgraj lub zrób zdjęcie
                  </button>
                  {coverImage && (
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="py-2 px-4 text-error text-sm font-medium hover:bg-error-container/20 rounded-xl transition-colors"
                    >
                      Usuń zdjęcie
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface ml-1">Tytuł</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Np. Władca Pierścieni"
                className="w-full bg-surface-variant border border-outline-variant rounded-2xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface ml-1">Autor</label>
              <input 
                type="text" 
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Np. J.R.R. Tolkien"
                className="w-full bg-surface-variant border border-outline-variant rounded-2xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface ml-1">Status</label>
              <div className="flex flex-col gap-2 bg-surface-variant p-2 rounded-2xl border border-outline-variant">
                <StatusOption 
                  label="Będę czytać" 
                  selected={status === 'TO_READ'} 
                  onClick={() => setStatus('TO_READ')} 
                />
                <StatusOption 
                  label="Czytam" 
                  selected={status === 'READING'} 
                  onClick={() => setStatus('READING')} 
                />
                <StatusOption 
                  label="Przeczytane" 
                  selected={status === 'READ'} 
                  onClick={() => setStatus('READ')} 
                />
              </div>
            </div>

            {status === 'READ' && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface ml-1">Ocena</label>
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
              <label className="text-sm font-medium text-on-surface ml-1">Notatki (opcjonalnie)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Twoje przemyślenia..."
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
             Zapisz
           </button>
        </div>
      </motion.div>
      
      {isScannerOpen && (
        <ScannerModal 
          onScan={handleScan} 
          onClose={() => setIsScannerOpen(false)} 
        />
      )}
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
