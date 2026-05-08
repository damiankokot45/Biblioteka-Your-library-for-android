import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, Clock } from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import { Book } from '../types';

interface ReaderHeroProps {
  onStopReading: (durationDetails: { durationInSeconds: number }) => void;
  books?: Book[];
}

export function ReaderHero({ onStopReading, books = [] }: ReaderHeroProps) {
  const { t } = useTranslation();
  const [isReading, setIsReading] = useState(() => localStorage.getItem('biblioteka_isReading') === 'true');
  const [seconds, setSeconds] = useState(() => {
    const start = localStorage.getItem('biblioteka_readingStartTime');
    if (start && localStorage.getItem('biblioteka_isReading') === 'true') {
      const startMs = parseInt(start, 10);
      if (!isNaN(startMs)) {
         return Math.floor((Date.now() - startMs) / 1000);
      }
    }
    return 0;
  });

  useEffect(() => {
    if (isReading) {
      if (!localStorage.getItem('biblioteka_readingStartTime')) {
        localStorage.setItem('biblioteka_readingStartTime', (Date.now() - (seconds * 1000)).toString());
      }
      localStorage.setItem('biblioteka_isReading', 'true');
    } else {
      localStorage.removeItem('biblioteka_readingStartTime');
      localStorage.setItem('biblioteka_isReading', 'false');
    }
  }, [isReading, seconds]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isReading) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  const handleStart = () => {
    setIsReading(true);
    setSeconds(0);
  };

  const handleStop = () => {
    setIsReading(false);
    onStopReading({ durationInSeconds: seconds });
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="bg-surface-variant/30 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-6 border border-outline-variant/30 shadow-sm relative overflow-hidden mt-6">
      {/* Background ambient light if reading */}
      <motion.div 
        animate={{ opacity: isReading ? 1 : 0 }}
        className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-1000"
      />

      {/* Graphical element: Empty Armchair and Lamp */}
      <div className="w-full flex items-end justify-center mt-4 relative h-56">
        
        {/* Floor line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-px bg-outline-variant/30 rounded-full z-0"></div>

        {/* Bookshelf Visualization Component */}
        <div className="absolute left-1/2 -translate-x-[140px] bottom-0 w-36 h-48 z-0 flex flex-col justify-end opacity-90 transition-all duration-500 rounded-sm overflow-hidden border-x-[6px] border-t-[6px] border-[#2d1b11] bg-[#3a271d]/50 shadow-[inset_0_4px_15px_rgba(0,0,0,0.6)]">
          {[0, 1, 2].map(shelfIdx => {
             const shelfBooks = books.slice(shelfIdx * 10, (shelfIdx + 1) * 10);
             return (
               <div key={shelfIdx} className="relative flex-1 flex flex-row items-end px-1 border-b-[6px] border-[#25150c] shadow-[0_2px_4px_rgba(0,0,0,0.4)] overflow-hidden">
                 {shelfBooks.map((book, idx) => {
                   const colors = ['#8c3c3c', '#3c5a8c', '#3c8c5a', '#c29232', '#724694', '#467294', '#944672', '#b34d4d', '#4d7eb3', '#56b377'];
                   const idNum = book.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                   const bgColor = colors[idNum % colors.length];
                   const height = 22 + (idNum % 16); // 22-38px
                   const width = 6 + (idNum % 4); // 6-9px
                   
                   return (
                     <motion.div 
                       key={book.id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: (shelfIdx * 10 + idx) * 0.02 }}
                       className="rounded-t-[2px] shadow-sm transform-gpu opacity-90 mx-[0.5px]"
                       style={{ 
                         backgroundColor: bgColor, 
                         height: `${height}px`, 
                         width: `${width}px`,
                         borderLeft: '1px solid rgba(255,255,255,0.1)',
                         borderRight: '1px solid rgba(0,0,0,0.3)',
                         borderTop: '1px solid rgba(255,255,255,0.2)'
                       }}
                       title={book.title}
                     />
                   )
                 })}
               </div>
             )
          })}
        </div>

        {/* Armchair Area */}
        <div className="w-48 h-48 relative shrink-0 z-10 flex items-center justify-center -ml-4">
          {/* Lamp */}
          <div className="absolute right-0 bottom-0 flex flex-col items-center h-full justify-end">
            {/* Lamp stick */}
            <div className="w-1.5 h-[90%] bg-outline-variant relative z-10 rounded-full origin-bottom -rotate-[10deg] translate-x-2">
               {/* Lamp head */}
              <motion.div 
                initial={false}
                animate={{ 
                  rotate: isReading ? 15 : 0,
                  y: isReading ? -2 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-16 h-10 bg-primary/90 rounded-t-full absolute -top-4 -left-7 z-20 origin-bottom transform translate-y-1 rotate-[45deg]"
              >
                {/* The Light Component - visible when reading */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isReading ? [0, 0.8, 0.3, 0.9, 0.5, 0.7] : 0,
                  }}
                  transition={{ 
                    duration: 0.5,
                    times: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
                  }}
                  style={{ clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)' }}
                  className="absolute top-8 left-1/2 -translate-x-1/2 w-[240px] h-[300px] bg-gradient-to-b from-yellow-300/40 to-transparent -z-10 origin-top pointer-events-none -rotate-12"
                />
              </motion.div>
            </div>
            {/* Lamp base */}
            <div className="w-12 h-2 bg-outline-variant rounded-t-[4px] z-0"></div>
          </div>

          {/* Chair */}
          <div className="absolute left-4 bottom-0 w-32 flex flex-col items-center justify-end">
            <div className="w-20 h-20 bg-[#c08670] rounded-t-[2.5rem] flex items-end justify-center z-0 relative shadow-inner">
              <div className="w-16 h-16 bg-[#a87460] rounded-t-[2rem] opacity-30"></div>
            </div>
            <div className="w-32 h-10 bg-[#e09e86] rounded-[1.5rem] -mt-2 z-10 relative shadow-[0_4px_10px_rgba(0,0,0,0.2)]"></div>
            {/* Chair Legs */}
            <div className="flex justify-between w-24 -mt-1 z-0">
              <div className="w-3 h-6 bg-[#6e5850] rounded-b-sm border-b-[2px] border-black/20 shadow-sm"></div>
              <div className="w-3 h-6 bg-[#6e5850] rounded-b-sm border-b-[2px] border-black/20 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center z-10 w-full text-center mt-2">
        <h2 className="text-[1.7rem] font-medium text-on-surface mb-1">{t('readingTimeTitle')}</h2>
        <p className="text-on-surface-variant mb-6 text-[0.95rem]">
          {isReading ? t('readingTimeDescReading') : t('readingTimeDescIdle')}
        </p>

        <div className="flex items-center justify-center gap-3 w-full min-h-[56px]">
          <AnimatePresence mode="wait">
            {!isReading ? (
              <motion.button
                key="start-btn"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                onClick={handleStart}
                className="bg-[#e09b69] text-[#2c1d11] px-8 py-3.5 rounded-full font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" />
                {t('startReading')}
              </motion.button>
            ) : (
              <motion.div 
                key="reading-controls"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="flex items-center justify-center gap-3 w-full flex-wrap"
              >
                <button
                  onClick={handleStop}
                  className="bg-primary/20 text-primary px-6 py-3.5 rounded-full font-medium shadow-sm hover:bg-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Square className="w-5 h-5 fill-current" />
                  {t('stopReading')}
                </button>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.02, 1],
                    borderColor: ['rgba(var(--md-sys-color-outline-variant), 0.5)', 'rgba(var(--md-sys-color-primary), 0.5)', 'rgba(var(--md-sys-color-outline-variant), 0.5)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2 text-on-surface font-mono border border-outline-variant/50 bg-surface/50 px-4 py-3.5 rounded-full justify-center shadow-sm"
                >
                  <Clock className="w-4 h-4 opacity-70" />
                  <span className="text-sm font-medium">{formatTime(seconds)}</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
