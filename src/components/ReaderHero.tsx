import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Square, Clock } from 'lucide-react';

interface ReaderHeroProps {
  onStopReading: (durationDetails: { durationInSeconds: number }) => void;
}

export function ReaderHero({ onStopReading }: ReaderHeroProps) {
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
        localStorage.setItem('biblioteka_readingStartTime', Date.now().toString());
      }
      localStorage.setItem('biblioteka_isReading', 'true');
    } else {
      localStorage.removeItem('biblioteka_readingStartTime');
      localStorage.setItem('biblioteka_isReading', 'false');
    }
  }, [isReading]);

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

  useEffect(() => {
    const handleWidget = (e: any) => {
      if (e.detail === 'start') {
        setIsReading(true);
        if (localStorage.getItem('biblioteka_isReading') !== 'true') {
           setSeconds(0);
        }
      } else if (e.detail === 'stop') {
        if (localStorage.getItem('biblioteka_isReading') === 'true') {
            handleStop();
        } else {
            // just open modal if not reading
            onStopReading({ durationInSeconds: 0 });
        }
      }
    };
    window.addEventListener('widget-action', handleWidget);
    return () => window.removeEventListener('widget-action', handleWidget);
  }, [seconds, onStopReading]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="bg-surface-variant/30 rounded-3xl p-6 md:p-8 flex flex-col-reverse md:flex-row items-center gap-8 mb-8 border border-outline-variant shadow-sm relative overflow-hidden">
      {/* Background ambient light if reading */}
      <motion.div 
        animate={{ opacity: isReading ? 1 : 0 }}
        className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl -top-20 -right-20 pointer-events-none transition-opacity duration-1000"
      />

      <div className="flex-1 z-10 w-full md:text-left text-center">
        <h2 className="text-2xl font-bold text-on-surface mb-2">Czas na lekturę?</h2>
        <p className="text-on-surface-variant mb-6 text-sm">
          {isReading ? 'Zanurz się w opowieści...' : 'Zrelaksuj się i rozpocznij czytanie. Zmierz swój czas i śledź postępy.'}
        </p>

        <div className="flex items-center justify-center md:justify-start gap-4">
          {!isReading ? (
            <button
              onClick={handleStart}
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              Zacznij czytać
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={handleStop}
                className="bg-error text-on-error px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Square className="w-5 h-5 fill-current" />
                Skończ czytać
              </button>
              <div className="flex items-center gap-2 text-primary font-mono bg-primary/10 px-4 py-2 rounded-2xl w-[100px] justify-center">
                <Clock className="w-4 h-4" />
                <span className="text-base font-bold">{formatTime(seconds)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Graphical element: Empty Armchair and Lamp */}
      <div className="w-48 h-48 relative shrink-0 z-10 flex items-end justify-center">
        {/* Lamp */}
        <div className="absolute right-2 bottom-0 flex flex-col items-center">
          {/* Lamp head angled slightly left */}
          <motion.div 
            initial={false}
            animate={{ 
              rotate: isReading ? -30 : -5,
              y: isReading ? 2 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-14 h-8 bg-tertiary rounded-t-full relative z-20 origin-bottom transform translate-y-1"
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
              style={{ clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0 100%)' }}
              className="absolute top-6 left-1/2 -translate-x-1/2 w-[180px] h-[240px] bg-gradient-to-b from-yellow-300/80 to-transparent -z-10 origin-top pointer-events-none"
            />
          </motion.div>
          {/* Lamp stick */}
          <div className="w-2 h-36 bg-outline-variant relative z-10"></div>
          {/* Lamp base */}
          <div className="w-14 h-3 bg-tertiary rounded-t-full relative z-10"></div>
        </div>

        {/* Empty Armchair */}
        <div className="absolute left-4 bottom-0 w-32 h-32 flex flex-col items-start justify-end rounded-lg">
          {/* Backrest */}
          <div className="w-24 h-24 bg-secondary rounded-t-[2.5rem] border-[6px] border-secondary-container z-0 relative ml-4"></div>
          {/* Seat */}
          <div className="w-32 h-10 bg-secondary rounded-full border-[6px] border-secondary-container -mt-4 z-10 relative"></div>
          {/* Legs */}
          <div className="flex gap-16 -mt-2 self-center">
            <div className="w-3 h-5 bg-outline-variant border border-outline rounded-b-sm"></div>
            <div className="w-3 h-5 bg-outline-variant border border-outline rounded-b-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
