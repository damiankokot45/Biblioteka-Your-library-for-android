import React, { useRef } from 'react';
import { X, Check, Download, Upload, Github } from 'lucide-react';
import { UserSettings, AppThemeMode, AppColorTheme, Book, Language } from '../types';
import { motion } from 'motion/react';
import { useTranslation } from '../lib/i18n';

interface SettingsModalProps {
  settings: UserSettings;
  onChange: (settings: UserSettings) => void;
  onClose: () => void;
  books: Book[];
  onImport: (books: Book[]) => void;
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

export function SettingsModal({ settings, onChange, onClose, books, onImport }: SettingsModalProps) {
  const { t } = useTranslation();
  const isCustomColor = !COLOR_OPTIONS.find(c => c.value.toLowerCase() === settings.colorTheme.toLowerCase());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const THEME_OPTIONS: { value: AppThemeMode, label: string }[] = [
    { value: 'system', label: t('themeSystem') },
    { value: 'light', label: t('themeLight') },
    { value: 'dark', label: t('themeDark') },
  ];

  const handleExport = async () => {
    const dataStr = JSON.stringify(books, null, 2);
    const exportFileDefaultName = `biblioteka_backup_${new Date().toISOString().split('T')[0]}.json`;

    try {
      const { Share } = await import('@capacitor/share');
      const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
      
      const result = await Filesystem.writeFile({
        path: exportFileDefaultName,
        data: dataStr,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });
      
      await Share.share({
        title: 'Eksport biblioteki',
        text: 'Plik z kopią zapasową Twojej biblioteki.',
        url: result.uri,
        dialogTitle: 'Zapisz lub udostępnij kopię',
      });
      return;
    } catch (err) {
      console.warn("Capacitor share/filesystem failed, falling back to web", err);
    }

    // Web fallback
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.download = exportFileDefaultName;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          onImport(parsed);
          window.alert(t('importSuccess') + parsed.length);
        } else {
          window.alert(t('importFormatError'));
        }
      } catch (error) {
        console.error("Failed to parse the imported file:", error);
         window.alert(t('importError'));
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

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
            {t('settings')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 bg-surface-variant hover:opacity-80 rounded-full transition-all"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="p-4 flex flex-col overflow-y-auto bg-surface space-y-6">
          
          {/* Appearance Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[0.9rem] text-primary font-medium tracking-wide">Appearance</h3>
            
            <div className="flex flex-col gap-4 px-2">
              <div className="flex items-center justify-between">
                <span className="text-on-surface">Theme</span>
                <div className="flex bg-surface-variant/50 rounded-full p-1 border border-outline-variant/30">
                  {THEME_OPTIONS.map(mod => (
                    <button
                      key={mod.value}
                      onClick={() => onChange({ ...settings, themeMode: mod.value })}
                      className={`py-1.5 px-4 text-sm rounded-full font-medium transition-all ${
                        settings.themeMode === mod.value
                          ? 'bg-surface text-on-surface shadow-sm border border-outline-variant/20'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {mod.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-on-surface">Accent color</span>
                <div className="flex items-center gap-3 flex-wrap">
                  {COLOR_OPTIONS.map(col => (
                    <button
                      key={col.value}
                      onClick={() => onChange({ ...settings, colorTheme: col.value })}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 overflow-hidden"
                      style={{ backgroundColor: col.value }}
                      title={col.label}
                    >
                      {settings.colorTheme.toLowerCase() === col.value.toLowerCase() && (
                        <Check className="w-5 h-5 text-white/90 drop-shadow-sm mix-blend-overlay" />
                      )}
                    </button>
                  ))}
                  
                  <div className="relative w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 overflow-hidden" title={t('customColor')}>
                    <input
                      type="color"
                      value={settings.colorTheme}
                      onChange={(e) => onChange({ ...settings, colorTheme: e.target.value })}
                      className="absolute inset-[-10px] w-20 h-20 cursor-pointer p-0 border-0 opacity-0"
                    />
                    <div 
                      className="w-full h-full pointer-events-none rounded-full border border-dashed flex items-center justify-center"
                      style={{ backgroundColor: isCustomColor ? settings.colorTheme : 'transparent', borderColor: 'var(--md-sys-color-outline)' }}
                    >
                       {isCustomColor ? (
                         <Check className="w-5 h-5 text-white/90 drop-shadow-sm mix-blend-overlay" />
                       ) : (
                         <span className="text-xl font-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>+</span>
                       )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 cursor-pointer group">
                <span className="text-on-surface">Language</span>
                <div className="flex items-center gap-2 text-on-surface-variant group-hover:text-on-surface transition-colors">
                  <select
                    value={settings.language}
                    onChange={(e) => onChange({ ...settings, language: e.target.value as Language })}
                    className="bg-transparent text-sm focus:outline-none cursor-pointer text-right appearance-none font-medium pr-1"
                  >
                    <option value="en">English</option>
                    <option value="pl">Polski</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="es">Español</option>
                    <option value="hu">Magyar</option>
                    <option value="ro">Română</option>
                    <option value="cs">Čeština</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-on-surface hover:opacity-80 cursor-pointer" onClick={() => onChange({ ...settings, enableGenres: !settings.enableGenres })}>Enable genres</span>
                <div 
                  className={`w-12 h-6 rounded-full p-1 flex items-center cursor-pointer transition-colors ${settings.enableGenres ? 'bg-primary justify-end' : 'bg-surface-variant border border-outline-variant/30 justify-start'}`}
                  onClick={() => onChange({ ...settings, enableGenres: !settings.enableGenres })}
                >
                  <div className={`w-4 h-4 rounded-full ${settings.enableGenres ? 'bg-on-primary' : 'bg-on-surface-variant opacity-50'}`}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-px bg-outline-variant/30 w-full" />
          
          {/* Data Backup */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[0.9rem] text-primary font-medium tracking-wide">Data & backup</h3>
            
            <div className="flex flex-col px-2 gap-4">
              <button
                onClick={handleExport}
                className="flex items-center justify-between text-on-surface hover:text-on-surface-variant transition-colors group"
              >
                <span>Export data</span>
                <span className="text-sm font-mono">&gt;</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-between text-on-surface hover:text-on-surface-variant transition-colors group"
              >
                <span>Import data</span>
                <span className="text-sm font-mono">&gt;</span>
              </button>
              
              <button
                onClick={() => {
                  if(window.confirm(t('confirmClearData'))) {
                    localStorage.removeItem('biblioteka_books');
                    window.location.reload();
                  }
                }}
                className="flex items-center justify-between text-error hover:text-error/80 transition-colors mt-2"
              >
                <span>{t('clearData')}</span>
              </button>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                accept=".json" 
                className="hidden" 
              />
            </div>
          </div>

          <div className="h-px bg-outline-variant/30 w-full" />

          {/* About */}
          <div className="flex flex-col gap-4 pb-10">
            <h3 className="text-[0.9rem] text-primary font-medium tracking-wide">About the app</h3>
            
            <div className="flex flex-col px-2 gap-4 text-sm text-on-surface-variant">
              <div className="flex items-center justify-between">
                <span>Version</span>
                <span className="font-mono">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Author</span>
                <span>Damian Kokot</span>
              </div>
              <div className="flex items-center justify-center pt-2">
                <a 
                  href="https://github.com/damiankokot/biblioteka" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-surface-variant/50 hover:bg-surface-variant rounded-full transition-colors text-on-surface"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
