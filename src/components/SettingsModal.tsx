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

type SettingsScreen = 'MAIN' | 'APPEARANCE' | 'LANGUAGE' | 'BACKUP' | 'ABOUT' | 'THIRD_PARTY_LICENSES' | 'TERMS_CONDITIONS' | 'PRIVACY_POLICY';

const SCREEN_PARENT: Partial<Record<SettingsScreen, SettingsScreen>> = {
  APPEARANCE: 'MAIN',
  LANGUAGE: 'MAIN',
  BACKUP: 'MAIN',
  ABOUT: 'MAIN',
  THIRD_PARTY_LICENSES: 'ABOUT',
  TERMS_CONDITIONS: 'ABOUT',
  PRIVACY_POLICY: 'ABOUT',
};

interface LicenseEntry {
  name: string;
  license: string;
  copyright: string;
  url: string;
}

const THIRD_PARTY_LIBS: LicenseEntry[] = [
  { name: 'React & React DOM', license: 'MIT', copyright: '© Meta Platforms, Inc. and affiliates', url: 'https://react.dev' },
  { name: 'Vite', license: 'MIT', copyright: '© Evan You & Vite Contributors', url: 'https://vitejs.dev' },
  { name: 'Tailwind CSS', license: 'MIT', copyright: '© Tailwind Labs, Inc.', url: 'https://tailwindcss.com' },
  { name: 'Capacitor (Core, Android, App, Filesystem, Share)', license: 'MIT', copyright: '© Ionic', url: 'https://capacitorjs.com' },
  { name: '@google/genai', license: 'Apache 2.0', copyright: '© Google LLC', url: 'https://github.com/googleapis/js-genai' },
  { name: '@hello-pangea/dnd', license: 'Apache 2.0', copyright: '© hello-pangea', url: 'https://github.com/hello-pangea/dnd' },
  { name: '@material/material-color-utilities', license: 'Apache 2.0', copyright: '© Google LLC', url: 'https://github.com/material-foundation/material-color-utilities' },
  { name: 'lucide-react', license: 'ISC', copyright: '© Lucide Contributors', url: 'https://lucide.dev' },
  { name: 'Motion (Framer Motion)', license: 'MIT', copyright: '© Framer B.V.', url: 'https://motion.dev' },
  { name: 'Recharts', license: 'MIT', copyright: '© recharts group', url: 'https://recharts.org' },
  { name: 'html5-qrcode', license: 'Apache 2.0', copyright: '© Minhaz', url: 'https://github.com/mebjas/html5-qrcode' },
  { name: 'dotenv', license: 'BSD-2-Clause', copyright: '© Scott Motte', url: 'https://github.com/motdotla/dotenv' },
  { name: 'Express', license: 'MIT', copyright: '© TJ Holowaychuk', url: 'https://expressjs.com' },
];

export function SettingsModal({ settings, onChange, onClose, books, onImport, onClearAllData }: SettingsModalProps) {
  const { t } = useTranslation();
  const [activeScreen, setActiveScreen] = useState<SettingsScreen>('MAIN');
  const isCustomColor = !COLOR_OPTIONS.find(c => c.value.toLowerCase() === settings.colorTheme.toLowerCase());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goBack = () => {
    const parent = SCREEN_PARENT[activeScreen];
    setActiveScreen(parent ?? 'MAIN');
  };

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
              <button onClick={goBack} className="p-2 -ml-2 bg-surface-variant hover:opacity-80 rounded-full transition-all">
                <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
              </button>
            )}
            <h2 className="text-xl font-medium text-on-surface">
              {activeScreen === 'MAIN' ? t('settings') :
               activeScreen === 'APPEARANCE' ? t('appearance') :
               activeScreen === 'LANGUAGE' ? t('language') :
               activeScreen === 'BACKUP' ? t('backup') :
               activeScreen === 'ABOUT' ? t('aboutApp') :
               activeScreen === 'THIRD_PARTY_LICENSES' ? t('thirdPartyLicenses') :
               activeScreen === 'TERMS_CONDITIONS' ? t('termsConditions') :
               activeScreen === 'PRIVACY_POLICY' ? t('privacyPolicy') :
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
                    onClick={() => setActiveScreen('THIRD_PARTY_LICENSES')}
                    iconBg="bg-transparent"
                    iconColor="text-on-surface-variant"
                  />
                  <div className="h-px bg-outline-variant/30 w-full" />
                  <SettingItem
                    icon={FileText}
                    title={t('termsConditions')}
                    onClick={() => setActiveScreen('TERMS_CONDITIONS')}
                    iconBg="bg-transparent"
                    iconColor="text-on-surface-variant"
                  />
                  <div className="h-px bg-outline-variant/30 w-full" />
                  <SettingItem
                    icon={FileText}
                    title={t('privacyPolicy')}
                    onClick={() => setActiveScreen('PRIVACY_POLICY')}
                    iconBg="bg-transparent"
                    iconColor="text-on-surface-variant"
                  />
                </div>

                <div className="h-8 w-full shrink-0"></div>
              </motion.div>
            )}

            {activeScreen === 'THIRD_PARTY_LICENSES' && (
              <motion.div
                key="THIRD_PARTY_LICENSES"
                variants={screenVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col gap-3 absolute inset-0 h-max"
              >
                <p className="text-on-surface-variant text-sm px-1 pb-2">
                  This app uses the following open-source libraries:
                </p>
                {THIRD_PARTY_LIBS.map((lib) => (
                  <div
                    key={lib.name}
                    className="bg-surface-variant/40 rounded-2xl p-4 border border-outline-variant/30 flex flex-col gap-1 cursor-pointer hover:bg-surface-variant/60 transition-colors"
                    onClick={() => window.open(lib.url, '_blank')}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-on-surface font-semibold text-[0.95rem] leading-snug flex-1">{lib.name}</span>
                      <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-full shrink-0 mt-0.5">{lib.license}</span>
                    </div>
                    <span className="text-on-surface-variant text-xs">{lib.copyright}</span>
                  </div>
                ))}
                <div className="h-6 w-full shrink-0" />
              </motion.div>
            )}

            {activeScreen === 'TERMS_CONDITIONS' && (
              <motion.div
                key="TERMS_CONDITIONS"
                variants={screenVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col gap-4 absolute inset-0 h-max"
              >
                {[
                  {
                    title: '1. Acceptance of Terms',
                    body: 'By downloading or using the Biblioteka app, you agree to these Terms and Conditions. If you do not agree, please uninstall the app.',
                  },
                  {
                    title: '2. License',
                    body: 'Biblioteka is free, open-source software distributed under the MIT License. You are free to use, copy, modify, and distribute it in accordance with that license.',
                  },
                  {
                    title: '3. Use of the App',
                    body: 'The app is provided for personal, non-commercial use to help you track your reading. You agree not to misuse the app or attempt to compromise its integrity.',
                  },
                  {
                    title: '4. AI Features',
                    body: 'Biblioteka may use the Google Gemini API to provide AI-assisted features (e.g. book summaries or recommendations). By using these features, you agree to Google\'s Terms of Service for Generative AI.',
                  },
                  {
                    title: '5. No Warranty',
                    body: 'The app is provided "as is", without warranty of any kind. The developer is not responsible for any data loss, device issues, or other damages arising from use of the app.',
                  },
                  {
                    title: '6. Changes',
                    body: 'These terms may be updated at any time. Continued use of the app after changes constitutes your acceptance of the new terms.',
                  },
                  {
                    title: '7. Contact',
                    body: 'For questions or concerns, please open an issue on the GitHub repository or contact the developer directly.',
                  },
                ].map((section) => (
                  <div key={section.title} className="flex flex-col gap-1">
                    <span className="text-on-surface font-semibold text-[0.95rem]">{section.title}</span>
                    <span className="text-on-surface-variant text-[0.88rem] leading-relaxed">{section.body}</span>
                  </div>
                ))}
                <p className="text-on-surface-variant/50 text-xs pt-2">Last updated: May 2025</p>
                <div className="h-6 w-full shrink-0" />
              </motion.div>
            )}

            {activeScreen === 'PRIVACY_POLICY' && (
              <motion.div
                key="PRIVACY_POLICY"
                variants={screenVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col gap-4 absolute inset-0 h-max"
              >
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
                  <p className="text-primary font-semibold text-sm">Your data stays on your device.</p>
                  <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">Biblioteka does not collect, transmit, or sell any personal data.</p>
                </div>
                {[
                  {
                    title: 'Data Storage',
                    body: 'All your books, notes, and settings are stored exclusively on your device using the browser\'s local storage or the device\'s local filesystem. No account is required.',
                  },
                  {
                    title: 'No Analytics or Tracking',
                    body: 'We do not use any analytics services, crash reporters, or advertising SDKs. We do not track how you use the app.',
                  },
                  {
                    title: 'Google Gemini API (Optional AI Features)',
                    body: 'If you use AI-powered features, your book title, author, or notes may be sent to the Google Gemini API to generate a response. This data is processed by Google in accordance with their Privacy Policy. No personally identifying information is intentionally included.',
                  },
                  {
                    title: 'Camera / QR Code Scanner',
                    body: 'The QR/barcode scanner accesses your device camera only while the scanner is open. No images or video are stored or transmitted.',
                  },
                  {
                    title: 'Permissions',
                    body: 'On Android, the app may request permissions for storage (to export backups) and camera (for barcode scanning). These permissions are used only for the stated purposes.',
                  },
                  {
                    title: 'Open Source',
                    body: 'Biblioteka is fully open source. You can inspect all code on GitHub to verify these claims.',
                  },
                  {
                    title: 'Contact',
                    body: 'If you have any privacy-related questions, please open an issue on GitHub or contact the developer directly.',
                  },
                ].map((section) => (
                  <div key={section.title} className="flex flex-col gap-1">
                    <span className="text-on-surface font-semibold text-[0.95rem]">{section.title}</span>
                    <span className="text-on-surface-variant text-[0.88rem] leading-relaxed">{section.body}</span>
                  </div>
                ))}
                <p className="text-on-surface-variant/50 text-xs pt-2">Last updated: May 2025</p>
                <div className="h-6 w-full shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}


