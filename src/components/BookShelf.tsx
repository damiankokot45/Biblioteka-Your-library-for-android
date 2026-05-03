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
    
    return (
      <div className="relative pt-4 pb-2 mb-6" key={status}>
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
              className={`flex gap-4 overflow-x-auto no-scrollbar pb-1 px-4 items-end min-h-[160px] relative z-10 transition-colors ${
                snapshot.isDraggingOver ? 'bg-surface-variant/50 rounded-xl' : ''
              }`}
            >
              {shelfBooks.length > 0 ? (
                shelfBooks.map((book, index) => {
                  const heightMap = ['h-32', 'h-36', 'h-40', 'h-34', 'h-38'];
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
                          className={`w-28 shrink-0 cursor-pointer origin-bottom relative group ${heightClass} ${
                            snapshot.isDragging ? 'z-50 opacity-90 scale-105 shadow-2xl' : 'hover:-translate-y-4 transition-transform'
                          }`}
                        >
                           <div className={`w-full h-full rounded-r-md rounded-l-sm border-l-8 flex flex-col justify-between p-3 shadow-md relative overflow-hidden group-hover:shadow-lg transition-all ${colorClass}`}>
                             {book.coverImage ? (
                               <img src={book.coverImage} alt={book.title} className="absolute inset-0 w-full h-full object-cover z-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                             ) : (
                               <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent w-full h-full pointer-events-none" />
                             )}
                             <div className="absolute inset-0 bg-black/40 z-0 hidden group-hover:block transition-all" />
                             {/* Book Details */}
                             <span className={`text-xs font-bold leading-tight line-clamp-4 relative z-10 ${book.coverImage ? 'drop-shadow-md text-white' : ''}`}>{book.title}</span>
                             <span className={`text-[10px] truncate relative z-10 mt-2 ${book.coverImage ? 'drop-shadow-md text-white opacity-90' : 'opacity-80'}`}>{book.author}</span>
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
      <div className="flex flex-col gap-2 pt-2 pb-8 max-w-4xl mx-auto">
        {renderShelf('TO_READ', 'Będę czytać')}
        {renderShelf('READING', 'Czytam')}
        {renderShelf('READ', 'Przeczytane')}
      </div>
    </DragDropContext>
  );
}
