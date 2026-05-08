import fs from 'fs';

const fi = {
    library: "Kirjasto", searchPlaceholder: "Etsi kirjaa...", sortByDate: "Lisäyspäivä", sortByTitle: "Otsikko", sortByAuthor: "Tekijä", sortByRating: "Arvio",
    tabShelf: "Hylly", tabToRead: "Luettavat", tabReading: "Luen", tabRead: "Luettu", tabStats: "Tilastot",
    addBook: "Uusi kirja", editBook: "Muokkaa", save: "Tallenna", title: "Otsikko", titlePlaceholder: "Esim. Taru Sormusten Herrasta",
    author: "Tekijä", authorPlaceholder: "Esim. J.R.R. Tolkien", pages: "Sivut", status: "Tila", statusToRead: "Luettavat", statusReading: "Luen", statusRead: "Luettu",
    rating: "Arvio", notes: "Muistiinpanot", notesPlaceholder: "Ajatuksesi, lainaukset...", coverOrBookmark: "Kansi / Kirjanmerkki", selectFromGallery: "Valitse galleriasta", removeCover: "Poista",
    settings: "Asetukset", appearance: "Ulkonäkö", theme: "Teema", themeSystem: "Järjestelmä", themeLight: "Vaalea", themeDark: "Tumma", accentColor: "Korostusväri",
    language: "Kieli", backup: "Tiedot ja varmuuskopio", exportData: "Vie tiedot", importData: "Tuo tiedot", clearData: "Tyhjennä tiedot", clearDataDesc: "Poista kaikki kirjat ja nollaa",
    confirmClearData: "Haluatko varmasti poistaa KAIKKI tiedot? Tätä ei voi perua!", aboutApp: "Tietoja sovelluksesta", version: "Versio", whatsNew: "Uutta", licenses: "Lisenssit", email: "Sähköposti",
    sourceCode: "Lähdekoodi", createIssue: "Luo ilmoitus", thirdPartyLicenses: "Kolmannen osapuolen lisenssit", termsConditions: "Käyttöehdot", privacyPolicy: "Tietosuojakäytäntö",
    close: "Sulje", emptyShelfTitle: "Ei kirjoja", emptyShelfDesc: "Klikkaa painiketta lisätäksesi ensimmäisen kirjasi.", deleteConfirm: "Haluatko varmasti poistaa tämän kirjan?",
    statsTitle: "Lukutilastot", thisYear: "Tänä vuonna", totalBooks: "Kirjoja yhteensä", booksRead: "Luetut kirjat", booksAdded: "Lisätyt kirjat", pagesRead: "Luetut sivut", timeSpent: "Käytetty aika",
    streakDays: "Putki (päivää)", readingProgress: "Lukemisen edistyminen", overview: "Yleiskatsaus", books: "Kirjat", time: "Aika", currentlyReading: "Luen tällä hetkellä", toRead: "Luettavat",
    averageRating: "Keskimääräinen arvio", quickView: "Pikanäkymä", updateProgress: "Päivitä edistyminen", page: "Sivu", of: "/", addNote: "Lisää muistiinpano", startReading: "Aloita lukeminen",
    stopReading: "Lopeta ajastin", readingSession: "Lukusessio", pagesReadCount: "Luetut sivut", saveSession: "Tallenna sessio", cancel: "Peruuta", added: "Lisätty", inThisMonth: "Tässä kuussa",
    activityMonths: "Aktiivisuus viime kuukausina", statusDistribution: "Tilan jakauma", emptyStatsTitle: "Ei tietoja", emptyStatsDesc: "Lisää kirjoja nähdäksesi kirjastosi tilastot.",
    selectBook: "Valitse kirja...", whatBookReading: "Mitä kirjaa luit?", whatPageFinished: "Mille sivulle lopetit?", lastSavedPage: "Viimeksi tallennettu sivu:", saveProgress: "Tallenna edistyminen",
    addBookFirst: "Sinulla ei ole kirjoja 'Luettavat'- tai 'Luen'-tilassa. Lisää kirja ensin.", updateProgressMessage: "Lukeminen suoritettu", readingTimeTitle: "Aikaa lukea?",
    readingTimeDescReading: "Sukella tarinaan...", readingTimeDescIdle: "Rentoudu ja aloita lukeminen. Mittaa aikaasi ja seuraa edistymistäsi.", importSuccess: "Ladataan kirjat: ",
    importFormatError: "Virheellinen varmuuskopion tiedostomuoto.", importError: "Tiedoston luku epäonnistui. Varmista, että se on kelvollinen varmuuskopio-JSON.", onGithub: "Githubissa", mitLicense: "MIT-lisenssi"
};

const sv = {
    library: "Bibliotek", searchPlaceholder: "Sök efter en bok...", sortByDate: "Tillagd", sortByTitle: "Titel", sortByAuthor: "Författare", sortByRating: "Betyg",
    tabShelf: "Hylla", tabToRead: "Att läsa", tabReading: "Läser", tabRead: "Läst", tabStats: "Statistik",
    addBook: "Ny bok", editBook: "Redigera", save: "Spara", title: "Titel", titlePlaceholder: "T.ex. Sagan om Ringen",
    author: "Författare", authorPlaceholder: "T.ex. J.R.R. Tolkien", pages: "Sidor", status: "Status", statusToRead: "Att läsa", statusReading: "Läser", statusRead: "Läst",
    rating: "Betyg", notes: "Anteckningar", notesPlaceholder: "Dina tankar, citat...", coverOrBookmark: "Omslag / Bokmärke", selectFromGallery: "Välj från galleriet", removeCover: "Ta bort",
    settings: "Inställningar", appearance: "Utseende", theme: "Tema", themeSystem: "System", themeLight: "Ljust", themeDark: "Mörkt", accentColor: "Accentfärg",
    language: "Språk", backup: "Data & säkerhetskopiering", exportData: "Exportera data", importData: "Importera data", clearData: "Rensa data", clearDataDesc: "Radera alla böcker och återställ",
    confirmClearData: "Är du säker på att du vill radera ALL data? Detta kan inte ångras!", aboutApp: "Om appen", version: "Version", whatsNew: "Nyheter", licenses: "Licenser", email: "E-post",
    sourceCode: "Källkod", createIssue: "Skapa ett ärende", thirdPartyLicenses: "Tredjepartslicenser", termsConditions: "Användarvillkor", privacyPolicy: "Integritetspolicy",
    close: "Stäng", emptyShelfTitle: "Inga böcker", emptyShelfDesc: "Klicka på knappen nedan för att lägga till din första bok.", deleteConfirm: "Är du säker på att du vill radera denna bok?",
    statsTitle: "Lässtatistik", thisYear: "I år", totalBooks: "Totalt böcker", booksRead: "Lästa böcker", booksAdded: "Tillagda böcker", pagesRead: "Lästa sidor", timeSpent: "Tid spenderad",
    streakDays: "Dagar i rad", readingProgress: "Läsutveckling", overview: "Översikt", books: "Böcker", time: "Tid", currentlyReading: "Läser just nu", toRead: "Att läsa",
    averageRating: "Snittbetyg", quickView: "Snabbvy", updateProgress: "Uppdatera framsteg", page: "Sida", of: "av", addNote: "Ny anteckning", startReading: "Börja läsa",
    stopReading: "Stoppa timer", readingSession: "Lässession", pagesReadCount: "Lästa sidor", saveSession: "Spara session", cancel: "Avbryt", added: "Tillagd", inThisMonth: "Denna månad",
    activityMonths: "Aktivitet senaste månaderna", statusDistribution: "Statusfördelning", emptyStatsTitle: "Ingen data", emptyStatsDesc: "Lägg till böcker för att se statistik.",
    selectBook: "Välj en bok...", whatBookReading: "Vilken bok läste du?", whatPageFinished: "På vilken sida slutade du?", lastSavedPage: "Senast sparade sida:", saveProgress: "Spara framsteg",
    addBookFirst: "Du har inga böcker med status 'Att läsa' eller 'Läser'. Lägg till en bok först.", updateProgressMessage: "Läsning slutförd", readingTimeTitle: "Dags att läsa?",
    readingTimeDescReading: "Dyk in i berättelsen...", readingTimeDescIdle: "Koppla av och börja läsa. Mät din tid och följ din utveckling.", importSuccess: "Fullfört: ",
    importFormatError: "Ogiltigt format på säkerhetskopian.", importError: "Fel vid läsning av filen. Kontrollera att det är en giltig JSON.", onGithub: "På Github", mitLicense: "MIT Licens"
};

const no = {
    library: "Bibliotek", searchPlaceholder: "Søk etter en bok...", sortByDate: "Dato lagt til", sortByTitle: "Tittel", sortByAuthor: "Forfatter", sortByRating: "Vurdering",
    tabShelf: "Hylle", tabToRead: "Å lese", tabReading: "Leser", tabRead: "Lest", tabStats: "Statistikk",
    addBook: "Ny bok", editBook: "Rediger", save: "Lagre", title: "Tittel", titlePlaceholder: "F.eks. Ringenes Herre",
    author: "Forfatter", authorPlaceholder: "F.eks. J.R.R. Tolkien", pages: "Sider", status: "Status", statusToRead: "Å lese", statusReading: "Leser", statusRead: "Lest",
    rating: "Vurdering", notes: "Notater", notesPlaceholder: "Dine tanker, sitater...", coverOrBookmark: "Omslag / Bokmerke", selectFromGallery: "Velg fra galleriet", removeCover: "Fjern",
    settings: "Innstillinger", appearance: "Utseende", theme: "Tema", themeSystem: "System", themeLight: "Lyse", themeDark: "Mørkt", accentColor: "Aksentfarge",
    language: "Språk", backup: "Data og sikkerhetskopiering", exportData: "Eksporter data", importData: "Importer data", clearData: "Tøm data", clearDataDesc: "Slett alle bøker",
    confirmClearData: "Er du sikker på at du vil slette ALL data? Dette kan ikke angres!", aboutApp: "Om appen", version: "Versjon", whatsNew: "Hva er nytt", licenses: "Lisenser", email: "E-post",
    sourceCode: "Kildekode", createIssue: "Opprett sak", thirdPartyLicenses: "Tredjepartslisenser", termsConditions: "Vilkår for bruk", privacyPolicy: "Personvernerklæring",
    close: "Lukk", emptyShelfTitle: "Ingen bøker", emptyShelfDesc: "Klikk på knappen nedenfor for å legge til din første bok.", deleteConfirm: "Er du sikker på at du vil slette denne boken?",
    statsTitle: "Lesestatistikk", thisYear: "I år", totalBooks: "Totalt antall bøker", booksRead: "Bøker lest", booksAdded: "Bøker lagt til", pagesRead: "Sider lest", timeSpent: "Tid brukt",
    streakDays: "Dager på rad", readingProgress: "Lesefremgang", overview: "Oversikt", books: "Bøker", time: "Tid", currentlyReading: "Leser nå", toRead: "Å lese",
    averageRating: "Gjennomsnittlig vurdering", quickView: "Hurtigvisning", updateProgress: "Oppdater fremdrift", page: "Side", of: "av", addNote: "Legg til notat", startReading: "Begynn å lese",
    stopReading: "Stopp timer", readingSession: "Leseøkt", pagesReadCount: "Sider lest", saveSession: "Lagre økt", cancel: "Avbryt", added: "Lagt til", inThisMonth: "Denne måneden",
    activityMonths: "Aktivitet i nyere måneder", statusDistribution: "Statusfordeling", emptyStatsTitle: "Ingen data", emptyStatsDesc: "Legg til bøker for å se stats.",
    selectBook: "Velg en bok...", whatBookReading: "Hvilken bok leste du?", whatPageFinished: "På hvilken side sluttet du?", lastSavedPage: "Sist lagrede side:", saveProgress: "Lagre fremdrift",
    addBookFirst: "Du har ingen bøker med status 'Å lese' eller 'Leser'. Legg til en bok først.", updateProgressMessage: "Lesing fullført", readingTimeTitle: "Tid for å lese?",
    readingTimeDescReading: "Dykk inn i historien...", readingTimeDescIdle: "Slapp av og begynn å lese. Ta tiden og spor fremdriften din.", importSuccess: "Fullført: ",
    importFormatError: "Ugyldig sikkerhetskopi-format.", importError: "Fant ikke gyldig JSON.", onGithub: "På Github", mitLicense: "MIT-lisens"
};

const da = {
    library: "Bibliotek", searchPlaceholder: "Søg efter en bog...", sortByDate: "Dato tilføjet", sortByTitle: "Titel", sortByAuthor: "Forfatter", sortByRating: "Bedømmelse",
    tabShelf: "Hylde", tabToRead: "Skal læses", tabReading: "Læser", tabRead: "Læst", tabStats: "Statistik",
    addBook: "Ny bog", editBook: "Rediger", save: "Gem", title: "Titel", titlePlaceholder: "F.eks. Ringenes Herre",
    author: "Forfatter", authorPlaceholder: "F.eks. J.R.R. Tolkien", pages: "Sider", status: "Status", statusToRead: "Skal læses", statusReading: "Læser", statusRead: "Læst",
    rating: "Bedømmelse", notes: "Noter", notesPlaceholder: "Dine tanker, citater...", coverOrBookmark: "Omslag / Bogmærke", selectFromGallery: "Vælg fra galleri", removeCover: "Fjern",
    settings: "Indstillinger", appearance: "Udseende", theme: "Tema", themeSystem: "System", themeLight: "Lys", themeDark: "Mørk", accentColor: "Accentfarve",
    language: "Sprog", backup: "Data og sikkerhedskopiering", exportData: "Eksporter data", importData: "Importer data", clearData: "Ryd data", clearDataDesc: "Slet alle bøger",
    confirmClearData: "Er du sikker på, at du vil slette ALLE data? Dette kan ikke fortrydes!", aboutApp: "Om appen", version: "Version", whatsNew: "Hvad er nyt", licenses: "Licenser", email: "E-mail",
    sourceCode: "Kildekode", createIssue: "Opret sag", thirdPartyLicenses: "Tredjepartslicenser", termsConditions: "Vilkår for brug", privacyPolicy: "Privatlivspolitik",
    close: "Luk", emptyShelfTitle: "Ingen bøger", emptyShelfDesc: "Klik på knappen for at tilføje din første bog.", deleteConfirm: "Er du sikker på, at du vil slette bogen?",
    statsTitle: "Læsestatistik", thisYear: "I år", totalBooks: "Bøger i alt", booksRead: "Bøger læst", booksAdded: "Bøger tilføjet", pagesRead: "Sider læst", timeSpent: "Tid brugt",
    streakDays: "Dage i træk", readingProgress: "Læsefremskridt", overview: "Oversigt", books: "Bøker", time: "Tid", currentlyReading: "Læser nu", toRead: "Skal læses",
    averageRating: "Gennemsnitlig bedømmelse", quickView: "Hurtig visning", updateProgress: "Opdater fremskridt", page: "Side", of: "af", addNote: "Tilføj note", startReading: "Begynd at læse",
    stopReading: "Stop timer", readingSession: "Læsesession", pagesReadCount: "Sider læst", saveSession: "Gem session", cancel: "Annuller", added: "Tilføjet", inThisMonth: "Denne måned",
    activityMonths: "Aktivitet de seneste måneder", statusDistribution: "Statusfordeling", emptyStatsTitle: "Ingen data", emptyStatsDesc: "Tilføj bøger for at se din statistik.",
    selectBook: "Vælg en bog...", whatBookReading: "Hvilken bog læste du?", whatPageFinished: "På hvilken side sluttede du?", lastSavedPage: "Sidst gemte side:", saveProgress: "Gem fremskridt",
    addBookFirst: "Du har ingen bøger på nuværende tidspunkt.", updateProgressMessage: "Læsning afsluttet", readingTimeTitle: "Tid til at læse?",
    readingTimeDescReading: "Dyk ned i historien...", readingTimeDescIdle: "Start din læsning og følg dit fremskridt.", importSuccess: "Bøger blev indlæst: ",
    importFormatError: "Ugyldigt format for sikkerhedskopiering.", importError: "JSON er ikke gyldig.", onGithub: "På Github", mitLicense: "MIT-licens"
};

const nl = {
    library: "Bibliotheek", searchPlaceholder: "Zoek een boek...", sortByDate: "Toevoegdatum", sortByTitle: "Titel", sortByAuthor: "Auteur", sortByRating: "Beoordeling",
    tabShelf: "Plank", tabToRead: "Nog lezen", tabReading: "Aan het lezen", tabRead: "Gelezen", tabStats: "Statistieken",
    addBook: "Nieuw boek", editBook: "Bewerken", save: "Opslaan", title: "Titel", titlePlaceholder: "Bijv. In de Ban van de Ring",
    author: "Auteur", authorPlaceholder: "Bijv. J.R.R. Tolkien", pages: "Pagina's", status: "Status", statusToRead: "Nog lezen", statusReading: "Lezen", statusRead: "Gelezen",
    rating: "Beoordeling", notes: "Notities", notesPlaceholder: "Jouw gedachten, citaten...", coverOrBookmark: "Omslag", selectFromGallery: "Kies uit galerij", removeCover: "Verwijder",
    settings: "Instellingen", appearance: "Weergave", theme: "Thema", themeSystem: "Systeem", themeLight: "Licht", themeDark: "Donker", accentColor: "Accentkleur",
    language: "Taal", backup: "Data & backup", exportData: "Exporteer data", importData: "Importeer data", clearData: "Data wissen", clearDataDesc: "Wis alle boeken en reset",
    confirmClearData: "Weet je zeker dat je ALLE data wilt wissen? Dit kan niet ongedaan worden gemaakt!", aboutApp: "Over de app", version: "Versie", whatsNew: "Wat is er nieuw", licenses: "Licenties", email: "E-mail",
    sourceCode: "Broncode", createIssue: "Meld een probleem", thirdPartyLicenses: "Licenties van derden", termsConditions: "Algemene voorwaarden", privacyPolicy: "Privacybeleid",
    close: "Sluiten", emptyShelfTitle: "Geen boeken", emptyShelfDesc: "Klik op de knop hieronder om je eerste boek toe te voegen.", deleteConfirm: "Weet je zeker dat je dit boek wilt verwijderen?",
    statsTitle: "Leesstatistieken", thisYear: "Dit jaar", totalBooks: "Totaal aantal boeken", booksRead: "Boeken gelezen", booksAdded: "Boeken toegevoegd", pagesRead: "Pagina's gelezen", timeSpent: "Tijd besteed",
    streakDays: "Reeks (dagen)", readingProgress: "Leesvoortgang", overview: "Overzicht", books: "Boeken", time: "Tijd", currentlyReading: "Nu aan het lezen", toRead: "Nog lezen",
    averageRating: "Gemiddelde beoordeling", quickView: "Snelle weergave", updateProgress: "Voortgang bijwerken", page: "Pagina", of: "van", addNote: "Voeg notitie toe", startReading: "Begin met lezen",
    stopReading: "Stop timer", readingSession: "Leessessie", pagesReadCount: "Aantal pagina's", saveSession: "Sessie opslaan", cancel: "Annuleren", added: "Toegevoegd", inThisMonth: "Deze maand",
    activityMonths: "Activiteit afgelopen maanden", statusDistribution: "Statusverdeling", emptyStatsTitle: "Geen data", emptyStatsDesc: "Voeg boeken toe om statistieken te zien.",
    selectBook: "Selecteer een boek...", whatBookReading: "Welk boek was je aan het lezen?", whatPageFinished: "Op welke pagina ben je gestopt?", lastSavedPage: "Laatst opgeslagen pagina:", saveProgress: "Voortgang opslaan",
    addBookFirst: "Je hebt nog geen boeken. Voeg er eerst een toe.", updateProgressMessage: "Voortgang bijgewerkt", readingTimeTitle: "Tijd om te lezen?",
    readingTimeDescReading: "Duik in het verhaal...", readingTimeDescIdle: "Ontspan en begin met lezen. Houd je voortgang bij.", importSuccess: "Boeken succesvol geladen: ",
    importFormatError: "Ongeldig formaat.", importError: "Lezen mislukt. Zorg dat het een geldige JSON is.", onGithub: "Op Github", mitLicense: "MIT Licentie"
};

const map = { fi, sv, no, da, nl };

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
            if (content[endIndex + 1] === ',') {
                endIndex++; 
            }
            content = content.substring(0, startIndex) + `\n  ${lang}: ${jsonStr},` + content.substring(endIndex + 1);
        }
    }
}

for (const lang of Object.keys(map)) {
    replaceLang(lang, map[lang]);
}

fs.writeFileSync('src/lib/i18n.ts', content);
