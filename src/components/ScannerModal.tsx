import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, X } from 'lucide-react';
import { motion } from 'motion/react';

interface ScannerModalProps {
  onScan: (isbn: string) => void;
  onClose: () => void;
}

export function ScannerModal({ onScan, onClose }: ScannerModalProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Needs to run after render
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 150 }, formatsToSupport: [ 0, 1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 14 ] }, // EAN_13 is usually 8 or supported by default
      false
    );
    
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        // Success
        onScan(decodedText);
        scanner.clear();
      },
      (error) => {
        // Failure (ignored to avoid spam)
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScan]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
        className="bg-surface w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden flex flex-col justify-center"
      >
        <div className="p-4 flex justify-between items-center border-b border-outline-variant bg-surface-container-low">
          <h2 className="text-xl font-medium text-on-surface flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Skanuj kod paskowy
          </h2>
          <button 
            onClick={onClose}
            className="p-2 bg-surface-variant hover:opacity-80 rounded-full transition-all"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
        <div className="p-2 bg-black">
          <div id="reader" className="w-full text-white"></div>
        </div>
        <div className="p-4 text-center text-sm text-on-surface-variant bg-surface-container-lowest">
          Skieruj kamerę na kod kreskowy ISBN (z tyłu okładki).
        </div>
      </motion.div>
    </motion.div>
  );
}
