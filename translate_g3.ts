import fs from 'fs';

const lb = {
    library: "Bibliothéik", searchPlaceholder: "Sich no engem Buch...", sortByDate: "Datum derbäigesat", sortByTitle: "Titel", sortByAuthor: "Auteur", sortByRating: "Bewäertung",
    tabShelf: "Regal", tabToRead: "Fir ze liesen", tabReading: "Am liesen", tabRead: "Gelies", tabStats: "Statistiken",
    addBook: "Neit Buch", editBook: "Änneren", save: "Späicheren", title: "Titel", titlePlaceholder: "Z.B. Herr der Ringe",
    author: "Auteur", authorPlaceholder: "Z.B. J.R.R. Tolkien", pages: "Säiten", status: "Status", statusToRead: "Fir ze liesen", statusReading: "Liesen", statusRead: "Gelies",
    rating: "Bewäertung", notes: "Notizen", notesPlaceholder: "Deng Gedanken, Zitater...", coverOrBookmark: "Cover / Lieszeechen", selectFromGallery: "Aus der Galerie wielen", removeCover: "Läschen",
    settings: "Astellungen", appearance: "Ausgesinn", theme: "Thema", themeSystem: "System", themeLight: "Hell", themeDark: "Däischter", accentColor: "Akzentfaarf",
    language: "Sprooch", backup: "Daten & Backup", exportData: "Daten exportéieren", importData: "Daten importéieren", clearData: "Datten zrécksetzen", clearDataDesc: "All Bicher läschen",
    confirmClearData: "Bass du sécher dat selwer geläscht soll ginn? Dëst kann een net ongedoen maachen!", aboutApp: "Iwwert d'App", version: "Versioun", whatsNew: "Wat ass nei", licenses: "Lizenzen", email: "E-Mail",
    sourceCode: "Quellcode", createIssue: "E Problem mellen", thirdPartyLicenses: "Drëtt Partei Lizenzen", termsConditions: "Benotzungsbedingunge", privacyPolicy: "Dateschutzrichtlinnen",
    close: "Zoumaachen", emptyShelfTitle: "Keng Bicher", emptyShelfDesc: "Klickt de Knäppche fir Äert éischt Buch derbäizesetzen.", deleteConfirm: "Bass du sécher?",
    statsTitle: "Liesstatistiken", thisYear: "Dëst Joer", totalBooks: "All Bicher", booksRead: "Gelies Bicher", booksAdded: "Bicher derbäigesat", pagesRead: "Gelies Säiten", timeSpent: "Zäit verbruecht",
    streakDays: "Deeg a Serie", readingProgress: "Liesfortschrëtt", overview: "Iwwersiicht", books: "Bicher", time: "Zäit", currentlyReading: "Am liesen", toRead: "Fir ze liesen",
    averageRating: "Duerchschnëttsbewäertung", quickView: "Séier kucken", updateProgress: "Fortschrëtt aktualiséieren", page: "Säit", of: "vun", addNote: "Notiz derbäisetzen", startReading: "Fänkt un ze liesen",
    stopReading: "Stopp den Timer", readingSession: "Lies Sessioun", pagesReadCount: "Gelies Säiten", saveSession: "Sessioun späicheren", cancel: "Ofbriechen", added: "Derbäigesat", inThisMonth: "Dëse Mount",
    activityMonths: "Aktivitéit an de leschte Méint", statusDistribution: "Status Verdeelung", emptyStatsTitle: "Keng Datten", emptyStatsDesc: "Setzt Bicher derbäi fir Statistiken ze gesinn.",
    selectBook: "Wielt e Buch...", whatBookReading: "Wat lies du?", whatPageFinished: "Op wéi enger Säit hues du opgehalen?", lastSavedPage: "Lëscht gespäichert Säit:", saveProgress: "Fortschrëtt späicheren",
    addBookFirst: "Du hues nach keng Bicher.", updateProgressMessage: "Liesen fäerdeg", readingTimeTitle: "Zäit fir ze liesen?",
    readingTimeDescReading: "Dauch an d'Geschicht an...", readingTimeDescIdle: "Lies a genéis. Mooss deng Zäit.", importSuccess: "Gelueden Bicher: ",
    importFormatError: "Pandatioun Feeler.", importError: "Feeler bei der Datei.", onGithub: "Op Github", mitLicense: "MIT Lizenz"
};

const pt = {
    library: "Biblioteca", searchPlaceholder: "Buscar um livro...", sortByDate: "Data de Adição", sortByTitle: "Título", sortByAuthor: "Autor", sortByRating: "Avaliação",
    tabShelf: "Estante", tabToRead: "Para Ler", tabReading: "Lendo", tabRead: "Lido", tabStats: "Estatísticas",
    addBook: "Novo Livro", editBook: "Editar", save: "Salvar", title: "Título", titlePlaceholder: "Ex. O Senhor dos Anéis",
    author: "Autor", authorPlaceholder: "Ex. J.R.R. Tolkien", pages: "Páginas", status: "Status", statusToRead: "Para Ler", statusReading: "Lendo", statusRead: "Lido",
    rating: "Avaliação", notes: "Notas", notesPlaceholder: "Seus pensamentos, citações...", coverOrBookmark: "Capa / Marcador", selectFromGallery: "Selecionar da galeria", removeCover: "Remover",
    settings: "Configurações", appearance: "Aparência", theme: "Tema", themeSystem: "Sistema", themeLight: "Claro", themeDark: "Escuro", accentColor: "Cor de Destaque",
    language: "Idioma", backup: "Dados & Backup", exportData: "Exportar dados", importData: "Importar dados", clearData: "Limpar dados", clearDataDesc: "Excluir todos os livros",
    confirmClearData: "Tem certeza de que deseja excluir TODOS os dados? Isso não pode ser desfeito!", aboutApp: "Sobre o app", version: "Versão", whatsNew: "Novidades", licenses: "Licenças", email: "E-mail",
    sourceCode: "Código-fonte", createIssue: "Reportar problema", thirdPartyLicenses: "Licenças de terceiros", termsConditions: "Termos e Condições", privacyPolicy: "Política de Privacidade",
    close: "Fechar", emptyShelfTitle: "Sem livros", emptyShelfDesc: "Clique no botão para adicionar seu primeiro livro.", deleteConfirm: "Tem certeza de que deseja excluir este livro?",
    statsTitle: "Estatísticas de Leitura", thisYear: "Este Ano", totalBooks: "Total de Livros", booksRead: "Livros Lidos", booksAdded: "Livros Adicionados", pagesRead: "Páginas Lidas", timeSpent: "Tempo Gasto",
    streakDays: "Sequência (dias)", readingProgress: "Progresso", overview: "Visão Geral", books: "Livros", time: "Tempo", currentlyReading: "Lendo Atualmente", toRead: "Para Ler",
    averageRating: "Avaliação Média", quickView: "Visão Rápida", updateProgress: "Atualizar Progresso", page: "Página", of: "de", addNote: "Adicionar Nota", startReading: "Começar a Ler",
    stopReading: "Parar Tempo", readingSession: "Sessão de Leitura", pagesReadCount: "Páginas Lidas", saveSession: "Salvar Sessão", cancel: "Cancelar", added: "Adicionado", inThisMonth: "Neste mês",
    activityMonths: "Atividade recente", statusDistribution: "Distribuição", emptyStatsTitle: "Sem dados", emptyStatsDesc: "Adicione livros para ver estatísticas.",
    selectBook: "Selecione um livro...", whatBookReading: "Que livro você estava lendo?", whatPageFinished: "Em que página você parou?", lastSavedPage: "Última página:", saveProgress: "Salvar progresso",
    addBookFirst: "Adicione um livro primeiro.", updateProgressMessage: "Leitura concluída", readingTimeTitle: "Hora de ler?",
    readingTimeDescReading: "Mergulhe na história...", readingTimeDescIdle: "Comece a ler e acompanhe seu tempo.", importSuccess: "Livros carregados: ",
    importFormatError: "Formato inválido de backup.", importError: "Erro ao ler. Certifique-se que o JSON é válido.", onGithub: "No Github", mitLicense: "Licença MIT"
};

const it = {
    library: "Libreria", searchPlaceholder: "Cerca un libro...", sortByDate: "Data di Aggiunta", sortByTitle: "Titolo", sortByAuthor: "Autore", sortByRating: "Valutazione",
    tabShelf: "Scaffale", tabToRead: "Da Leggere", tabReading: "In Lettura", tabRead: "Letti", tabStats: "Statistiche",
    addBook: "Nuovo Libro", editBook: "Modifica", save: "Salva", title: "Titolo", titlePlaceholder: "Es. Il Signore degli Anelli",
    author: "Autore", authorPlaceholder: "Es. J.R.R. Tolkien", pages: "Pagine", status: "Stato", statusToRead: "Da Leggere", statusReading: "In Lettura", statusRead: "Letti",
    rating: "Valutazione", notes: "Note", notesPlaceholder: "I tuoi pensieri, citazioni...", coverOrBookmark: "Copertina / Segnalibro", selectFromGallery: "Scegli dalla galleria", removeCover: "Rimuovi",
    settings: "Impostazioni", appearance: "Aspetto", theme: "Tema", themeSystem: "Sistema", themeLight: "Chiaro", themeDark: "Scuro", accentColor: "Colore accento",
    language: "Lingua", backup: "Dati e Backup", exportData: "Esporta dati", importData: "Importa dati", clearData: "Cancella dati", clearDataDesc: "Elimina tutti i libri e resetta",
    confirmClearData: "Sei sicuro di voler eliminare TUTTI i dati? L'azione è irreversibile!", aboutApp: "Info", version: "Versione", whatsNew: "Novità", licenses: "Licenze", email: "Email",
    sourceCode: "Codice sorgente", createIssue: "Segnala problema", thirdPartyLicenses: "Licenze di terze parti", termsConditions: "Termini e Condizioni", privacyPolicy: "Privacy Policy",
    close: "Chiudi", emptyShelfTitle: "Nessun libro", emptyShelfDesc: "Clicca per aggiungere il tuo primo libro.", deleteConfirm: "Sei sicuro di voler eliminare questo libro?",
    statsTitle: "Statistiche", thisYear: "Quest'anno", totalBooks: "Totale Libri", booksRead: "Libri Letti", booksAdded: "Libri Aggiunti", pagesRead: "Pagine Lette", timeSpent: "Tempo trascorso",
    streakDays: "Giorni di fila", readingProgress: "Progresso di Lettura", overview: "Panoramica", books: "Libri", time: "Tempo", currentlyReading: "In Lettura", toRead: "Da Leggere",
    averageRating: "Valutazione", quickView: "Vista rapida", updateProgress: "Aggiorna", page: "Pagina", of: "di", addNote: "Aggiungi Nota", startReading: "Inizia a leggere",
    stopReading: "Ferma il tempo", readingSession: "Sessione di Lettura", pagesReadCount: "Pagine Lette", saveSession: "Salva Sessione", cancel: "Annulla", added: "Aggiunto", inThisMonth: "Questo mese",
    activityMonths: "Attività negli ultimi mesi", statusDistribution: "Distribuzione", emptyStatsTitle: "Nessun dato", emptyStatsDesc: "Aggiungi libri per vedere le statistiche.",
    selectBook: "Seleziona un libro...", whatBookReading: "Quale libro stavi leggendo?", whatPageFinished: "A che pagina sei arrivato?", lastSavedPage: "Ultima pagina:", saveProgress: "Salva",
    addBookFirst: "Devi aggiungere prima un libro.", updateProgressMessage: "Aggiornato", readingTimeTitle: "È ora di leggere?",
    readingTimeDescReading: "Immergiti nella storia...", readingTimeDescIdle: "Inizia a leggere. Misura il tuo tempo e traccia i progressi.", importSuccess: "Importazione completata: ",
    importFormatError: "Formato non valido.", importError: "Errore json.", onGithub: "Su Github", mitLicense: "Licenza MIT"
};

const hr = {
    library: "Knjižnica", searchPlaceholder: "Pretraži...", sortByDate: "Datum dodavanja", sortByTitle: "Naslov", sortByAuthor: "Autor", sortByRating: "Ocjena",
    tabShelf: "Polica", tabToRead: "Za čitanje", tabReading: "Čitam", tabRead: "Pročitano", tabStats: "Statistika",
    addBook: "Nova knjiga", editBook: "Uredi", save: "Spremi", title: "Naslov", titlePlaceholder: "Npr. Gospodar prstenova",
    author: "Autor", authorPlaceholder: "Npr. J.R.R. Tolkien", pages: "Stranice", status: "Status", statusToRead: "Za čitanje", statusReading: "Trenutno čitam", statusRead: "Pročitano",
    rating: "Ocjena", notes: "Bilješke", notesPlaceholder: "Vaše misli...", coverOrBookmark: "Omot", selectFromGallery: "Odaberi", removeCover: "Ukloni",
    settings: "Postavke", appearance: "Izgled", theme: "Tema", themeSystem: "Sustav", themeLight: "Svijetlo", themeDark: "Tamno", accentColor: "Boja",
    language: "Jezik", backup: "Podaci", exportData: "Izvezi", importData: "Uvezi", clearData: "Izbriši podatke", clearDataDesc: "Briše sve",
    confirmClearData: "Jeste li sigurni? Ne može se vratiti!", aboutApp: "O aplikaciji", version: "Verzija", whatsNew: "Novo", licenses: "Licence", email: "E-pošta",
    sourceCode: "Izvorni kod", createIssue: "Prijavi grešku", thirdPartyLicenses: "Zakon", termsConditions: "Uvjeti", privacyPolicy: "Privatnost",
    close: "Zatvori", emptyShelfTitle: "Nema knjiga", emptyShelfDesc: "Dodajte knjigu.", deleteConfirm: "Obrisati knjigu?",
    statsTitle: "Statistika", thisYear: "Ove godine", totalBooks: "Ukupno knjiga", booksRead: "Pročitanih", booksAdded: "Dodanih", pagesRead: "Prok. stranica", timeSpent: "Vrijeme",
    streakDays: "Nizu (dani)", readingProgress: "Napredak", overview: "Pregled", books: "Knjige", time: "Vrijeme", currentlyReading: "Čitam", toRead: "Za čitanje",
    averageRating: "Prosjek", quickView: "Brzi pregled", updateProgress: "Ažuriraj", page: "Str.", of: "od", addNote: "Bilješka", startReading: "Počni",
    stopReading: "Stani", readingSession: "Čitanje", pagesReadCount: "Broj str.", saveSession: "Spremi", cancel: "Odustani", added: "Dodano", inThisMonth: "Ovaj mjesec",
    activityMonths: "Aktivnosti", statusDistribution: "Statusi", emptyStatsTitle: "Nema", emptyStatsDesc: "Daj knjige za stat.",
    selectBook: "Odaberi...", whatBookReading: "Što čitaš?", whatPageFinished: "Koja str?", lastSavedPage: "Zadnja:", saveProgress: "Spremi napr.",
    addBookFirst: "Dodaj prvo.", updateProgressMessage: "Gotovo.", readingTimeTitle: "Vrijeme za čitanje?",
    readingTimeDescReading: "Zakorači u priču...", readingTimeDescIdle: "Samo čitaj i prati.", importSuccess: "Uspjeh: ",
    importFormatError: "Krivi format.", importError: "Greška.", onGithub: "Na Githubu", mitLicense: "MIT licenca"
};

const sk = {
    library: "Knižnica", searchPlaceholder: "Hľadať...", sortByDate: "Pridané", sortByTitle: "Názov", sortByAuthor: "Autor", sortByRating: "Hodnotenie",
    tabShelf: "Polička", tabToRead: "Na prečítanie", tabReading: "Čítam", tabRead: "Prečítané", tabStats: "Štatistiky",
    addBook: "Nová kniha", editBook: "Upraviť", save: "Uložiť", title: "Názov", titlePlaceholder: "Napr. Pán prsteňov",
    author: "Autor", authorPlaceholder: "Napr. J.R.R. Tolkien", pages: "Strany", status: "Stav", statusToRead: "Na prečítanie", statusReading: "Čítam", statusRead: "Prečítané",
    rating: "Hodnotenie", notes: "Poznámky", notesPlaceholder: "Vaše myšlienky...", coverOrBookmark: "Obal", selectFromGallery: "Galéria", removeCover: "Odstrániť",
    settings: "Nastavenia", appearance: "Vzhľad", theme: "Téma", themeSystem: "Systém", themeLight: "Svetlá", themeDark: "Tmavá", accentColor: "Farba",
    language: "Jazyk", backup: "Dáta", exportData: "Export", importData: "Import", clearData: "Zmazať dáta", clearDataDesc: "Zmazať všetko",
    confirmClearData: "Naozaj? Krok späť nie je možný!", aboutApp: "O aplikácii", version: "Verzia", whatsNew: "Novinky", licenses: "Licencie", email: "Email",
    sourceCode: "Zdrojový kód", createIssue: "Nahlásiť chybu", thirdPartyLicenses: "Inštitúcia", termsConditions: "Podmienky", privacyPolicy: "Súkromie",
    close: "Zavrieť", emptyShelfTitle: "Žiadne knihy", emptyShelfDesc: "Pridať knihu.", deleteConfirm: "Vymazať?",
    statsTitle: "Štatistika", thisYear: "Tento rok", totalBooks: "Knihy", booksRead: "Prečítané", booksAdded: "Pridané", pagesRead: "Strán", timeSpent: "Čas",
    streakDays: "Dni po sebe", readingProgress: "Progres", overview: "Prehľad", books: "Knihy", time: "Čas", currentlyReading: "Čítam", toRead: "Na prečítanie",
    averageRating: "Priemer", quickView: "Rýchly prehľad", updateProgress: "Aktualizovať", page: "Str.", of: "z", addNote: "Poznámka", startReading: "Začať",
    stopReading: "Zastaviť", readingSession: "Čítanie", pagesReadCount: "Počet str.", saveSession: "Uložiť", cancel: "Zrušiť", added: "Pridané", inThisMonth: "Tento mesiac",
    activityMonths: "História", statusDistribution: "Rozloženie", emptyStatsTitle: "Prázdne", emptyStatsDesc: "Potrebuješ knihy.",
    selectBook: "Vybrať knihu...", whatBookReading: "Čo čítaš?", whatPageFinished: "Strana?", lastSavedPage: "Posledná:", saveProgress: "Uložiť",
    addBookFirst: "Pridaj knihu.", updateProgressMessage: "Dokončené", readingTimeTitle: "Čas čítať?",
    readingTimeDescReading: "Ponor sa...", readingTimeDescIdle: "Relax.", importSuccess: "USpešne: ",
    importFormatError: "Chybný format.", importError: "Chyba.", onGithub: "Na Github", mitLicense: "MIT licencie"
};

const map = { lb, pt, it, hr, sk };

let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

function replaceLang(lang, jsonObj) {
    let searchStr = `\n  ${lang}: {\n`;
    let startIndex = content.indexOf(searchStr);
    if (startIndex !== -1) {
        let depth = 0;
        let endIndex = -1;
        for (let i = startIndex + searchStr.length - 2; i < content.length; i++) {
            if (content[i] === '{') depth++;
            if (content[i] === '}') {
                depth--;
                if (depth === 0) {
                    endIndex = i;
                    break;
                }
            }
        }
        if (endIndex !== -1) {
            let jsonStr = JSON.stringify(jsonObj, null, 4).replace(/"([^"]+)":/g, '$1:');
            if (content[endIndex + 1] === ',') endIndex++; 
            content = content.substring(0, startIndex) + `\n  ${lang}: ${jsonStr},` + content.substring(endIndex + 1);
        }
    }
}
for (const lang of Object.keys(map)) replaceLang(lang, map[lang]);
fs.writeFileSync('src/lib/i18n.ts', content);
