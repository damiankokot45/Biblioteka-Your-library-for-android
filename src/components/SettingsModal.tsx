import React from 'react';
import { X, Check } from 'lucide-react';
import { UserSettings, AppThemeMode, AppColorTheme } from '../types';
import { motion } from 'motion/react';

interface SettingsModalProps {
  settings: UserSettings;
  onChange: (settings: UserSettings) => void;
  onClose: () => void;
}

const THEME_OPTIONS: { value: AppThemeMode, label: string }[] = [
  { value: 'system', label: 'Systemowy' },
  { value: 'light', label: 'Jasny' },
  { value: 'dark', label: 'Ciemny' },
];

const COLOR_OPTIONS: { value: AppColorTheme, label: string }[] = [
  { value: '#10B981', label: 'Szmaragdowy' },
  { value: '#3B82F6', label: 'Niebieski' },
  { value: '#8B5CF6', label: 'Fioletowy' },
  { value: '#EC4899', label: 'Różowy' },
  { value: '#F59E0B', label: 'Bursztynowy' },
  { value: '#84CC16', label: 'Limonkowy' },
  { value: '#06B6D4', label: 'Cyjan' },
  { value: '#64748B', label: 'Łupek' },
  { value: '#795548', label: 'Brązowy' },
  { value: '#EF4444', label: 'Czerwony' },
  { value: '#F97316', label: 'Pomarańczowy' },
  { value: '#14B8A6', label: 'Morski' },
];

export function SettingsModal({ settings, onChange, onClose }: SettingsModalProps) {
  const isCustomColor = !COLOR_OPTIONS.find(c => c.value.toLowerCase() === settings.colorTheme.toLowerCase());

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm transition-all text-left"
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
            Ustawienia
          </h2>
          <button 
            onClick={onClose}
            className="p-2 bg-surface-variant hover:opacity-80 rounded-full transition-all"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-8 overflow-y-auto bg-surface">
          
          {/* Theme Mode */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Motyw aplikacji</h3>
            <div className="grid grid-cols-3 gap-2 bg-surface-variant p-2 rounded-2xl border border-outline-variant">
              {THEME_OPTIONS.map(mod => (
                <button
                  key={mod.value}
                  onClick={() => onChange({ ...settings, themeMode: mod.value })}
                  className={`py-2 px-1 text-sm rounded-xl font-medium transition-colors border ${
                    settings.themeMode === mod.value
                      ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] shadow-sm border-[var(--md-sys-color-outline-variant)]'
                      : 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface)] border-transparent'
                  }`}
                >
                  {mod.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Theme */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Kolor główny (Dynamic Color)</h3>
            <div className="flex items-center justify-center gap-4 bg-surface-variant p-4 rounded-2xl border border-outline-variant flex-wrap">
              {COLOR_OPTIONS.map(col => (
                <button
                  key={col.value}
                  onClick={() => onChange({ ...settings, colorTheme: col.value })}
                  className="relative w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-4 ring-offset-2 dark:ring-offset-stone-900 overflow-hidden"
                  style={{ backgroundColor: col.value, borderColor: 'var(--md-sys-color-outline-variant)' }}
                  title={col.label}
                >
                  {settings.colorTheme.toLowerCase() === col.value.toLowerCase() && (
                    <Check className="w-6 h-6 text-white drop-shadow-md mix-blend-difference" />
                  )}
                </button>
              ))}
              
              <div className="relative w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus-within:ring-4 ring-offset-2 dark:ring-offset-stone-900 overflow-hidden" title="Własny kolor">
                <input
                  type="color"
                  value={settings.colorTheme}
                  onChange={(e) => onChange({ ...settings, colorTheme: e.target.value })}
                  className="absolute inset-[-10px] w-20 h-20 cursor-pointer p-0 border-0 opacity-0"
                />
                <div 
                  className="w-full h-full pointer-events-none rounded-full border-2 border-dashed flex items-center justify-center"
                  style={{ backgroundColor: isCustomColor ? settings.colorTheme : 'transparent', borderColor: 'var(--md-sys-color-outline)' }}
                >
                   {isCustomColor ? (
                     <Check className="w-6 h-6 text-white drop-shadow-md mix-blend-difference" />
                   ) : (
                     <span className="text-xl font-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>+</span>
                   )}
                </div>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant">
              Wybierz gotowy kolor lub użyj próbnika, aby wygenerować pełną paletę Material You (Tonal Palettes) na podstawie wybranego koloru.
            </p>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
