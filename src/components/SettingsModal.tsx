import React, { useRef, useState } from 'react';
import { X, Check, Download, Upload, Github, Palette, Globe, Trash2, Info, User, Code, Disc, ArrowLeft, Mail, Bug, AppWindow, FileText, ChevronRight, Monitor, Sun, Moon } from 'lucide-react';
import { UserSettings, AppThemeMode, AppColorTheme, Book, Language } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../lib/i18n';

interface SettingsModalProps {
  settings: UserSettings;
  onChange: (settings: UserSettings) => void;
  onClose: () => void;
  books: Book[];
  onImport: (books: Book[]) => void;
  onClearAllData: () => void;
}

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

const LANGUAGES: { value: Language, label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'pl', label: 'Polski' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'hu', label: 'Magyar' },
  { value: 'ro', label: 'Română' },
  { value: 'cs', label: 'Čeština' },
];

function SettingItem({ icon: Icon, title, subtitle, onClick, rightElement, className = "", textColor = "text-on-surface", iconColor = "text-primary", iconBg = "bg-primary/20", hideArrow = false }: any) {
  return (
    <div className={`flex items-center gap-4 py-3 px-2 cursor-pointer group ${className}`} onClick={onClick}>
      <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-[22px] h-[22px] ${iconColor}`} />
      </div>
      <div className="flex flex-col flex-1 pb-1">
        <span className={`${textColor} text-[1.1rem] font-medium leading-tight`}>{title}</span>
        {subtitle && <span className={`${textColor === 'text-error' ? 'text-error/80' : 'text-on-surface-variant'} text-[0.9rem] font-medium mt-0.5`}>{subtitle}</span>}
      </div>
      {rightElement}
      {!rightElement && onClick && !hideArrow && (
        <ChevronRight className="w-5 h-5 text-on-surface-variant/50 group-hover:text-on-surface-variant transition-colors" />
      )}
    </div>
  );
}

type SettingsScreen = 'MAIN' | 'APPEARANCE' | 'LANGUAGE' | 'BACKUP' | 'ABOUT';

export function SettingsModal({ settings, onChange, onClose, books, onImport, onClearAllData }: SettingsModalProps) {
  const { t } = useTranslation();
  const [activeScreen, setActiveScreen] = useState<SettingsScreen>('MAIN');
  const isCustomColor = !COLOR_OPTIONS.find(c => c.value.toLowerCase() === settings.colorTheme.toLowerCase());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const THEME_OPTIONS: { value: AppThemeMode, label: string, icon: any }[] = [
    { value: 'system', label: t('themeSystem'), icon: Monitor },
    { value: 'light', label: t('themeLight'), icon: Sun },
    { value: 'dark', label: t('themeDark'), icon: Moon },
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

  const screenVariants = {
    initial: { x: "20%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-20%", opacity: 0 }
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
        className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl flex flex-col h-[90vh] overflow-hidden border border-outline-variant"
      >
        <div className="flex items-center justify-between p-4 px-5 border-b border-outline-variant bg-surface shrink-0 z-10">
          <div className="flex items-center gap-3">
            {activeScreen !== 'MAIN' && (
              <button onClick={() => setActiveScreen('MAIN')} className="p-2 -ml-2 bg-surface-variant hover:opacity-80 rounded-full transition-all">
                <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
              </button>
            )}
            <h2 className="text-xl font-medium text-on-surface">
              {activeScreen === 'MAIN' ? t('settings') : 
               activeScreen === 'APPEARANCE' ? t('appearance') :
               activeScreen === 'LANGUAGE' ? t('language') :
               activeScreen === 'BACKUP' ? t('backup') :
               t('aboutApp')}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-surface-variant hover:opacity-80 rounded-full transition-all"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="flex-1 overflow-x-hidden overflow-y-auto relative bg-surface">
          <AnimatePresence mode="wait">
            {activeScreen === 'MAIN' && (
              <motion.div 
                key="MAIN"
                variants={screenVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col space-y-2 absolute inset-0 h-max"
              >
                <div className="flex flex-col">
                  <SettingItem 
                    icon={Palette} 
                    title={t('appearance')} 
                    subtitle={`${t('theme')}, ${t('accentColor')}`} 
                    onClick={() => setActiveScreen('APPEARANCE')}
                    iconBg="bg-[#e09b69]/20"
                    iconColor="text-[#e09b69]"
                  />
                  <SettingItem 
                    icon={Globe} 
                    title={t('language')} 
                    subtitle={LANGUAGES.find(l => l.value === settings.language)?.label || 'English'} 
                    onClick={() => setActiveScreen('LANGUAGE')}
                    iconBg="bg-[#6b8c96]/20"
                    iconColor="text-[#6b8c96]"
                  />
                  <SettingItem 
                    icon={Disc} 
                    title={t('backup')} 
                    subtitle={`${t('exportData')}, ${t('importData')}`} 
                    onClick={() => setActiveScreen('BACKUP')}
                    iconBg="bg-[#a37c82]/20"
                    iconColor="text-[#a37c82]"
                  />
                </div>

                <div className="h-px bg-outline-variant/30 w-full my-2" />

                <div className="flex flex-col">
                  <SettingItem 
                    icon={Info} 
                    title={t('aboutApp')} 
                    subtitle={`${t('version')}, ${t('sourceCode')}, ${t('licenses')}`} 
                    onClick={() => setActiveScreen('ABOUT')}
                    iconBg="bg-[#7d8a6c]/20"
                    iconColor="text-[#7d8a6c]"
                  />
                </div>
              </motion.div>
            )}

            {activeScreen === 'APPEARANCE' && (
              <motion.div 
                key="APPEARANCE"
                variants={screenVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col space-y-6 absolute inset-0 h-max"
              >
                <div className="flex flex-col gap-2">
                  <div className="px-2 pb-2">
                    <span className="text-[0.85rem] font-semibold text-primary uppercase tracking-wider">{t('theme')}</span>
                  </div>
                  {THEME_OPTIONS.map(mod => (
                    <SettingItem 
                      key={mod.value}
                      icon={mod.icon} 
                      title={mod.label} 
                      onClick={() => onChange({ ...settings, themeMode: mod.value })}
                      hideArrow
                      iconBg={settings.themeMode === mod.value ? "bg-primary/20" : "bg-surface-variant"}
                      iconColor={settings.themeMode === mod.value ? "text-primary" : "text-on-surface-variant"}
                      rightElement={
                        settings.themeMode === mod.value && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-on-primary" />
                          </div>
                        )
                      }
                    />
                  ))}
                </div>

                <div className="h-px bg-outline-variant/30 w-full" />

                <div className="flex flex-col gap-2">
                  <div className="px-2 pb-2">
                    <span className="text-[0.85rem] font-semibold text-primary uppercase tracking-wider">{t('accentColor')}</span>
                  </div>
                  <div className="px-4 flex flex-wrap gap-4">
                    {COLOR_OPTIONS.map(col => (
                      <button
                        key={col.value}
                        onClick={() => onChange({ ...settings, colorTheme: col.value })}
                        className={`w-10 h-10 rounded-full transition-transform hover:scale-110 overflow-hidden ${settings.colorTheme.toLowerCase() === col.value.toLowerCase() ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''}`}
                        style={{ backgroundColor: col.value }}
                        title={col.label}
                      />
                    ))}
                    <div className="relative w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 overflow-hidden" title={t('customColor')}>
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
                          {isCustomColor && <span className="w-3 h-3 rounded-full bg-white/90 mix-blend-overlay" />}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeScreen === 'LANGUAGE' && (
              <motion.div 
                key="LANGUAGE"
                variants={screenVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col space-y-2 absolute inset-0 h-max"
              >
                {LANGUAGES.map(lang => (
                  <SettingItem 
                    key={lang.value}
                    icon={Globe} 
                    title={lang.label} 
                    onClick={() => onChange({ ...settings, language: lang.value })}
                    hideArrow
                    iconBg="bg-surface-variant"
                    iconColor="text-on-surface-variant"
                    rightElement={
                      settings.language === lang.value && (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                      )
                    }
                  />
                ))}
              </motion.div>
            )}

            {activeScreen === 'BACKUP' && (
              <motion.div 
                key="BACKUP"
                variants={screenVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col space-y-2 absolute inset-0 h-max"
              >
                <SettingItem 
                  icon={Download} 
                  title={t('exportData')} 
                  subtitle={t('exportData')} 
                  onClick={handleExport}
                  hideArrow
                  iconBg="bg-[#6b8c96]/20"
                  iconColor="text-[#6b8c96]"
                />
                
                <SettingItem 
                  icon={Upload} 
                  title={t('importData')} 
                  subtitle={t('importData')} 
                  onClick={() => fileInputRef.current?.click()}
                  hideArrow
                  iconBg="bg-[#a37c82]/20"
                  iconColor="text-[#a37c82]"
                />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImport} 
                  accept=".json" 
                  className="hidden" 
                />

                <div className="h-px bg-outline-variant/30 w-full my-2" />

                <SettingItem 
                  icon={Trash2} 
                  title={t('clearData')} 
                  subtitle={t('clearDataDesc')} 
                  textColor="text-error"
                  onClick={onClearAllData}
                  hideArrow
                  iconBg="bg-error/10"
                  iconColor="text-error"
                />
              </motion.div>
            )}

            {activeScreen === 'ABOUT' && (
              <motion.div 
                key="ABOUT"
                variants={screenVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col space-y-2 absolute inset-0 h-max"
              >
                <div className="flex flex-col items-center justify-center py-6 pb-8 gap-3">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                     <Info className="w-10 h-10 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-on-surface">{t('library')}</h1>
                  <div className="flex gap-2 items-center">
                    <span className="bg-surface-variant/80 text-on-surface-variant border border-outline-variant px-3 py-1 rounded-full text-xs font-bold tracking-widest">
                      {t('version')} 1.0.0
                    </span>
                    <button className="bg-surface-variant/80 text-on-surface-variant border border-outline-variant px-3 py-1 rounded-full text-xs font-bold tracking-widest hover:text-on-surface transition-colors">
                      {t('whatsNew')}
                    </button>
                  </div>
                </div>

                <SettingItem 
                  icon={Info} 
                  title={t('licenses')} 
                  subtitle={t('mitLicense')} 
                  hideArrow
                  iconBg="bg-[#bda17e]/20"
                  iconColor="text-[#bda17e]"
                />
                
                <SettingItem 
                  icon={Mail} 
                  title={t('email')} 
                  subtitle="damian@example.com" 
                  onClick={() => window.location.href = "mailto:damian@example.com"}
                  hideArrow
                  iconBg="bg-[#d18471]/20"
                  iconColor="text-[#d18471]"
                />

                <SettingItem 
                  icon={Code} 
                  title={t('sourceCode')} 
                  subtitle={t('onGithub')} 
                  onClick={() => window.open("https://github.com/damiankokot/biblioteka", "_blank")}
                  hideArrow
                  iconBg="bg-[#996e51]/20"
                  iconColor="text-[#996e51]"
                />

                <SettingItem 
                  icon={Bug} 
                  title={t('createIssue')} 
                  subtitle={t('onGithub')} 
                  onClick={() => window.open("https://github.com/damiankokot/biblioteka/issues", "_blank")}
                  hideArrow
                  iconBg="bg-[#a68c67]/20"
                  iconColor="text-[#a68c67]"
                />

                <div className="bg-surface-variant/50 rounded-2xl p-1 mt-6 border border-outline-variant/30 overflow-hidden flex flex-col">
                  <SettingItem 
                    icon={FileText} 
                    title={t('thirdPartyLicenses')} 
                    hideArrow
                    iconBg="bg-transparent"
                    iconColor="text-on-surface-variant"
                  />
                  <div className="h-px bg-outline-variant/30 w-full" />
                  <SettingItem 
                    icon={FileText} 
                    title={t('termsConditions')} 
                    hideArrow
                    iconBg="bg-transparent"
                    iconColor="text-on-surface-variant"
                  />
                  <div className="h-px bg-outline-variant/30 w-full" />
                  <SettingItem 
                    icon={FileText} 
                    title={t('privacyPolicy')} 
                    hideArrow
                    iconBg="bg-transparent"
                    iconColor="text-on-surface-variant"
                  />
                </div>
                
                <div className="h-8 w-full shrink-0"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}


