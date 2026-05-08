import fs from 'fs';
import { translations } from './src/lib/i18n';

const enKeys = Object.keys(translations.en || {});
console.log('English keys count:', enKeys.length);

const missing = {};
for (const [lang, trans] of Object.entries(translations)) {
  if (lang === 'en') continue;
  const langKeys = Object.keys(trans || {});
  const missingKeys = enKeys.filter(k => !langKeys.includes(k));
  if (missingKeys.length > 0) {
    missing[lang] = missingKeys;
  }
}

for (const [lang, keys] of Object.entries(missing)) {
  if (keys.length > 50) {
     console.log(`Language ${lang} HAS keys: ${Object.keys((translations as any)[lang]).join(', ')}`);
  }
}



