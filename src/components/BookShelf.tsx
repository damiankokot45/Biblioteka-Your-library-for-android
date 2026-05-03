import React from 'react';
import { Book, BookStatus } from '../types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface BookShelfProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  onMoveBook: (bookId: string, newStatus: BookStatus, newIndex: number) => void;
}

export function BookShelf({ books, onBookClick, onMoveBook }: BookShelfProps) {
  
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    onMoveBook(draggableId, destination.droppableId as BookStatus, destination.index);
  };

  const renderShelf = (status: BookStatus, label: string) => {
    const shelfBooks = books.filter(b => b.status === status);
    
    let widthClass = "w-28";
    let borderClass = "border-l-8";
    let paddingClass = "p-3";
    let titleClass = "text-xs font-bold leading-tight line-clamp-4";
    let authorClass = "text-[10px] truncate mt-2";
    let heightMap = ['h-32', 'h-36', 'h-40', 'h-34', 'h-38'];
    
    if (shelfBooks.length > 15) {
      widthClass = "w-16";
      borderClass = "border-l-[3px] rounded-l-[1px]";
      paddingClass = "p-1";
      titleClass = "text-[8px] font-bold leading-[1.1] line-clamp-2";
      authorClass = "hidden";
      heightMap = ['h-20', 'h-24', 'h-28', 'h-20', 'h-24'];
    } else if (shelfBooks.length > 10) {
      widthClass = "w-20";
      borderClass = "border-l-[4px] rounded-l-[2px]";
      paddingClass = "p-1.5";
      titleClass = "text-[10px] font-bold leading-tight line-clamp-3";
      authorClass = "text-[8px] truncate mt-1 opacity-80 hidden sm:block";
      heightMap = ['h-24', 'h-28', 'h-32', 'h-24', 'h-28'];
    } else if (shelfBooks.length > 5) {
      widthClass = "w-24";
      borderClass = "border-l-[6px] rounded-l-sm";
      paddingClass = "p-2";
      titleClass = "text-[11px] font-bold leading-tight line-clamp-3";
      authorClass = "text-[9px] truncate mt-1";
      heightMap = ['h-28', 'h-32', 'h-36', 'h-28', 'h-32'];
    }

    return (
      <div className="relative pt-4 pb-2 mb-6 w-full max-w-full" key={status}>
        {/* Shelf Header */}
        <div className="flex justify-between items-end mb-4 px-2 relative z-10">
          <h3 className="font-medium text-on-surface flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-full"></div>
            {label}
          </h3>
          <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {shelfBooks.length}
          </span>
        </div>
        
        {/* Books Container */}
        <Droppable droppableId={status} direction="horizontal">
          {(provided, snapshot) => (
            <div 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 px-4 after:content-[''] after:w-8 after:shrink-0 items-end min-h-[160px] w-full max-w-full relative z-10 transition-colors ${
                snapshot.isDraggingOver ? 'bg-surface-variant/50 rounded-xl' : ''
              }`}
            >
              {shelfBooks.length > 0 ? (
                shelfBooks.map((book, index) => {
                  const heightClass = heightMap[book.id.charCodeAt(0) % heightMap.length];
                  
                  const colorMap = [
                    'bg-primary-container text-on-primary-container border-primary',
                    'bg-secondary-container text-on-secondary-container border-secondary',
                    'bg-tertiary-container text-on-tertiary-container border-tertiary',
                    'bg-surface-variant text-on-surface-variant border-outline'
                  ];
                  const colorClass = colorMap[book.id.charCodeAt(book.id.length - 1) % colorMap.length];

                  return (
                    // @ts-ignore - React expects key, but types from library might be incomplete
                    <Draggable key={book.id} draggableId={book.id} index={index}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={(e) => {
                            if (!snapshot.isDragging) {
                              onBookClick(book);
                            }
                          }}
                          style={{
                            ...provided.draggableProps.style,
                            // Ensure the style transformations don't break flex layout during drag
                          }}
                          className={`${widthClass} shrink-0 cursor-pointer origin-bottom relative group ${heightClass} ${
                            snapshot.isDragging ? 'z-50 opacity-90 scale-105 shadow-2xl' : 'hover:-translate-y-4 transition-transform'
                          }`}
                        >
                           <div className={`w-full h-full rounded-r-md ${borderClass} flex flex-col justify-between ${paddingClass} shadow-md relative overflow-hidden group-hover:shadow-lg transition-all ${colorClass}`}>
                             {book.coverImage ? (
                               <img src={book.coverImage} alt={book.title} className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                             ) : (
                               <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent w-full h-full pointer-events-none" />
                             )}
                             <div className="absolute inset-0 bg-black/40 z-0 hidden group-hover:block transition-all" />
                             {/* Book Details */}
                             <span className={`${titleClass} relative z-10 ${book.coverImage ? 'drop-shadow-md text-white' : ''}`}>{book.title}</span>
                             <span className={`${authorClass} relative z-10 ${book.coverImage ? 'drop-shadow-md text-white opacity-90' : 'opacity-80'}`}>{book.author}</span>
                           </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })
              ) : (
                <div className="w-full flex items-center justify-center pb-6 text-on-surface-variant text-sm opacity-60 min-w-[100px]">
                  Pusta półka
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        
        {/* Shelf structure (wooden/material look) */}
        <div className="w-full h-4 bg-surface-variant relative z-0 shadow-[0_-2px_4px_rgba(0,0,0,0.05)] border-t border-outline-variant/30"></div>
        <div className="w-[98%] mx-auto h-2 bg-surface-variant/60 rounded-b-md shadow-inner"></div>
      </div>
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-2 pt-2 pb-8 max-w-4xl mx-auto w-full overflow-hidden">
        {renderShelf('TO_READ', 'Będę czytać')}
        {renderShelf('READING', 'Czytam')}
        {renderShelf('READ', 'Przeczytane')}
      </div>
    </DragDropContext>
  );
}
