import fs from 'fs';

let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// The duplicate fi block to the end of the second kl block.
// Wait, instead of manually string parsing, let's just re-generate the i18n file or run a script to remove the second insertion.

const firstFiIndex = content.indexOf('  fi: {\n');
const secondFiIndex = content.lastIndexOf('  fi: {\n');

if (firstFiIndex !== -1 && secondFiIndex !== -1 && firstFiIndex !== secondFiIndex) {
  content = content.substring(0, secondFiIndex);
  // ensure it ends properly
  content += '};\n\nexport const getTranslation = (lang: Language, key: string): string => {\n  return translations[lang]?.[key] || translations[\'en\']?.[key] || key;\n};\n\nexport const LanguageContext = createContext<Language>(\'en\');\n\nexport const useLanguage = () => useContext(LanguageContext);\n\nexport const useTranslation = () => {\n  const lang = useLanguage();\n  return {\n    t: (key: string) => getTranslation(lang, key),\n    lang\n  };\n};\n';
}

// Ensure Language type exports all languages
content = content.replace(
  /export type Language = .*/,
  "import { Language } from '../types';\n"
);
content = content.replace(
  /type Translations = {/,
  "type Translations = {\n  [key in Language]?: {\n    [key: string]: string;\n  };\n}; // Remove old Language type \n//"
);

fs.writeFileSync('src/lib/i18n.ts', content);

