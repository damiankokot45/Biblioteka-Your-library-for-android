import React, { useRef } from 'react';
import { X, Check, Download, Upload } from 'lucide-react';
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

        <div className="p-6 flex flex-col gap-8 overflow-y-auto bg-surface">
          
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('language')}</h3>
            <div className="flex items-center gap-2 bg-surface-variant p-2 rounded-2xl border border-outline-variant">
              <select
                value={settings.language}
                onChange={(e) => onChange({ ...settings, language: e.target.value as Language })}
                className="w-full bg-surface border border-outline-variant text-on-surface p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
              >
                <option value="en">English (English)</option>
                <option value="pl">Polski (Polish)</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
                <option value="es">Español (Spanish)</option>
                <option value="hu">Magyar (Hungarian)</option>
                <option value="ro">Română (Romanian)</option>
                <option value="cs">Čeština (Czech)</option>
              </select>
            </div>
          </div>

          {/* Theme Mode */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('theme')}</h3>
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
            <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('primaryColorTitle')}</h3>
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
              
              <div className="relative w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus-within:ring-4 ring-offset-2 dark:ring-offset-stone-900 overflow-hidden" title={t('customColor')}>
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
              {t('primaryColorDesc')}
            </p>
          </div>

          {/* Data Backup */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('dataBackupTitle')}</h3>
            <div className="flex flex-col gap-3 bg-surface-variant p-4 rounded-2xl border border-outline-variant">
              <button
                onClick={handleExport}
                className="flex items-center gap-3 w-full p-3 bg-surface border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container transition-colors shadow-sm"
              >
                <div className="p-2 bg-primary-container text-on-primary-container rounded-lg">
                  <Download className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-medium">{t('exportData')}</span>
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 w-full p-3 bg-surface border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container transition-colors shadow-sm"
              >
                <div className="p-2 bg-secondary-container text-on-secondary-container rounded-lg">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-medium">{t('importData')}</span>
                </div>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                accept=".json" 
                className="hidden" 
              />
            </div>
            <p className="text-xs text-on-surface-variant">
              {t('dataBackupDesc')}
            </p>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
