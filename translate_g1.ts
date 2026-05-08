import fs from 'fs';

const g1 = {
  fr: { clearDataDesc: "Supprimer tous les livres et réinitialiser", booksAdded: "Livres ajoutés" },
  de: { clearDataDesc: "Alle Bücher löschen und zurücksetzen", booksAdded: "Hinzugefügte Bücher" },
  es: { clearDataDesc: "Eliminar todos los libros y restablecer", booksAdded: "Libros añadidos" },
  hu: { clearDataDesc: "Összes könyv törlése és visszaállítás", booksAdded: "Hozzáadott könyvek" },
  ro: { clearDataDesc: "Ștergeți toate cărțile și resetați", booksAdded: "Cărți adăugate" },
  cs: { clearDataDesc: "Smazat všechny knihy a resetovat", booksAdded: "Přidané knihy" }
};

let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

for (const [lang, keys] of Object.entries(g1)) {
  const match = new RegExp(`\\s+${lang}: \\{([\\s\\S]*?)\\},\\n\\s+[a-z]{2}: \\{`);
  const m = content.match(match);
  if (m) {
    let block = m[1];
    if (!block.includes('clearDataDesc')) block += `\n    clearDataDesc: "${keys.clearDataDesc}",`;
    if (!block.includes('booksAdded')) block += `\n    booksAdded: "${keys.booksAdded}",`;
    content = content.replace(m[1], block);
  }
}
fs.writeFileSync('src/lib/i18n.ts', content);
