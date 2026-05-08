import fs from 'fs';

const et = {
    library: "Raamatukogu", searchPlaceholder: "Otsi raamatut...", sortByDate: "Lisatud", sortByTitle: "Pealkiri", sortByAuthor: "Autor", sortByRating: "Hinnang",
    tabShelf: "Riiul", tabToRead: "Lugeda", tabReading: "Loen", tabRead: "Loetud", tabStats: "Statistika",
    addBook: "Uus raamat", editBook: "Muuda", save: "Salvesta", title: "Pealkiri", titlePlaceholder: "Nt Sõrmuste Isand",
    author: "Autor", authorPlaceholder: "Nt J.R.R. Tolkien", pages: "Lehekülgi", status: "Olek", statusToRead: "Lugeda", statusReading: "Loen", statusRead: "Loetud",
    rating: "Hinnang", notes: "Märkmed", notesPlaceholder: "Mõtted...", coverOrBookmark: "Kaan", selectFromGallery: "Vali", removeCover: "Kustuta",
    settings: "Seaded", appearance: "Välimus", theme: "Kujundus", themeSystem: "Süsteem", themeLight: "Hele", themeDark: "Tume", accentColor: "Värv",
    language: "Keel", backup: "Andmed", exportData: "Ekspordi", importData: "Impordi", clearData: "Kustuta andmed", clearDataDesc: "Kustutab kõik",
    confirmClearData: "Oled sa kindel?", aboutApp: "Rakendusest", version: "Versioon", whatsNew: "Uudised", licenses: "Litsentsid", email: "E-post",
    sourceCode: "Lähtekood", createIssue: "Teata", thirdPartyLicenses: "Kolmandad", termsConditions: "Tingimused", privacyPolicy: "Privaatsus",
    close: "Sulge", emptyShelfTitle: "Raamatuid pole", emptyShelfDesc: "Lisa raamat.", deleteConfirm: "Kustutada?",
    statsTitle: "Statistika", thisYear: "Sel aastal", totalBooks: "Kokku raamatuid", booksRead: "Loetud", booksAdded: "Lisatud", pagesRead: "Lk", timeSpent: "Aeg",
    streakDays: "Päevi", readingProgress: "Progress", overview: "Ülevaade", books: "Raamatud", time: "Aeg", currentlyReading: "Loen", toRead: "Lugeda",
    averageRating: "Keskmine", quickView: "Kiire", updateProgress: "Uuenda", page: "Lk", of: "/", addNote: "Märge", startReading: "Alusta",
    stopReading: "Peata", readingSession: "Sessioon", pagesReadCount: "Lk loetud", saveSession: "Salvesta", cancel: "Tühista", added: "Lisatud", inThisMonth: "Kuus",
    activityMonths: "Aktiivsus", statusDistribution: "Olekud", emptyStatsTitle: "Tühi", emptyStatsDesc: "Lisa raamatuid.",
    selectBook: "Vali...", whatBookReading: "Mida loed?", whatPageFinished: "Lehekülg?", lastSavedPage: "Viimane:", saveProgress: "Salvesta",
    addBookFirst: "Lisa ennem raamat.", updateProgressMessage: "Tehtud", readingTimeTitle: "Aeg lugeda?",
    readingTimeDescReading: "Loe...", readingTimeDescIdle: "Loe rahulikult.", importSuccess: "Edu: ",
    importFormatError: "Vigane.", importError: "Viga.", onGithub: "Githubis", mitLicense: "MIT litsents"
};

const lv = {
    library: "Bibliotēka", searchPlaceholder: "Meklēt...", sortByDate: "Pievienots", sortByTitle: "Nosaukums", sortByAuthor: "Autors", sortByRating: "Vērtējums",
    tabShelf: "Plaukts", tabToRead: "Izlasīt", tabReading: "Lasot", tabRead: "Izlasīts", tabStats: "Statistika",
    addBook: "Jauna grāmata", editBook: "Rediģēt", save: "Saglabāt", title: "Nosaukums", titlePlaceholder: "Piem. Gredzenu pavēlnieks",
    author: "Autors", authorPlaceholder: "Piem. J.R.R. Tolkien", pages: "Lapas", status: "Statuss", statusToRead: "Izlasīt", statusReading: "Lasot", statusRead: "Izlasīts",
    rating: "Vērtējums", notes: "Piezīmes", notesPlaceholder: "Domas...", coverOrBookmark: "Pārvalks", selectFromGallery: "Galerija", removeCover: "Nonemt",
    settings: "Iestatījumi", appearance: "Izskats", theme: "Tēma", themeSystem: "Sistēma", themeLight: "Gaišs", themeDark: "Tumšs", accentColor: "Krāsa",
    language: "Valoda", backup: "Dati", exportData: "Eksportēt", importData: "Importēt", clearData: "Notīrīt", clearDataDesc: "Dzēst visu",
    confirmClearData: "Tiešām dzēst?", aboutApp: "Par lietotni", version: "Versija", whatsNew: "Jaunumi", licenses: "Licences", email: "E-pasts",
    sourceCode: "Pirmkods", createIssue: "Ziņot", thirdPartyLicenses: "Trešo personu", termsConditions: "Noteikumi", privacyPolicy: "Privātums",
    close: "Aizvērt", emptyShelfTitle: "Nav grāmatu", emptyShelfDesc: "Pievienot.", deleteConfirm: "Dzēst?",
    statsTitle: "Statistika", thisYear: "Šogad", totalBooks: "Grāmatas", booksRead: "Izlasītās", booksAdded: "Pievienotās", pagesRead: "Lapas", timeSpent: "Laiks",
    streakDays: "Dienas", readingProgress: "Progress", overview: "Pārskats", books: "Grāmatas", time: "Laiks", currentlyReading: "Lasot", toRead: "Gaidot",
    averageRating: "Vidēji", quickView: "Pārskats", updateProgress: "Atjaunot", page: "Lp", of: "/", addNote: "Piezīme", startReading: "Lasīt",
    stopReading: "Stop", readingSession: "Sesija", pagesReadCount: "Lapas izl.", saveSession: "Saglabāt", cancel: "Atcelt", added: "Piev.", inThisMonth: "Šomēnes",
    activityMonths: "Aktivitāte", statusDistribution: "Statuss", emptyStatsTitle: "Nekas", emptyStatsDesc: "Pievieno.",
    selectBook: "Izvēlies...", whatBookReading: "Ko lasi?", whatPageFinished: "Lapa?", lastSavedPage: "Pēdējā:", saveProgress: "Saglabāt",
    addBookFirst: "Pievieno grāmatu.", updateProgressMessage: "Gatavs", readingTimeTitle: "Lasi?",
    readingTimeDescReading: "Lasi...", readingTimeDescIdle: "Lasi.", importSuccess: "Labi: ",
    importFormatError: "Kļūda.", importError: "Kļūda.", onGithub: "Github", mitLicense: "MIT licence"
};

const lt = {
    library: "Biblioteka", searchPlaceholder: "Ieškoti...", sortByDate: "Pridėta", sortByTitle: "Pavadinimas", sortByAuthor: "Autorius", sortByRating: "Įvertinimas",
    tabShelf: "Lentyna", tabToRead: "Skaityti", tabReading: "Skaitoma", tabRead: "Perskaityta", tabStats: "Statistika",
    addBook: "Nauja knyga", editBook: "Redaguoti", save: "Išsaugoti", title: "Pavadinimas", titlePlaceholder: "Pvz. Žiedų valdovas",
    author: "Autorius", authorPlaceholder: "Pvz. J.R.R. Tolkien", pages: "Puslapiai", status: "Būsena", statusToRead: "Skaityti", statusReading: "Skaitoma", statusRead: "Perskaityta",
    rating: "Įvertinimas", notes: "Pastabos", notesPlaceholder: "Mintys...", coverOrBookmark: "Viršelis", selectFromGallery: "Galerija", removeCover: "Pašalinti",
    settings: "Nustatymai", appearance: "Išvaizda", theme: "Tema", themeSystem: "Sistema", themeLight: "Šviesi", themeDark: "Tamsi", accentColor: "Spalva",
    language: "Kalba", backup: "Atsarginė", exportData: "Eksportuoti", importData: "Importuoti", clearData: "Išvalyti", clearDataDesc: "Trinti",
    confirmClearData: "Ar tikrai?", aboutApp: "Apie", version: "Versija", whatsNew: "Naujienos", licenses: "Licencijos", email: "El. paštas",
    sourceCode: "Kodas", createIssue: "Pranešti", thirdPartyLicenses: "Kitos", termsConditions: "Sąlygos", privacyPolicy: "Privatumas",
    close: "Uždaryti", emptyShelfTitle: "Nėra", emptyShelfDesc: "Pridėti knygą.", deleteConfirm: "Ištrinti?",
    statsTitle: "Statistika", thisYear: "Šiemet", totalBooks: "Knygos", booksRead: "Perskaityta", booksAdded: "Pridėta", pagesRead: "Puslapiai", timeSpent: "Laikas",
    streakDays: "Dienos", readingProgress: "Progresas", overview: "Apžvalga", books: "Knygos", time: "Laikas", currentlyReading: "Skaitoma", toRead: "Skaityti",
    averageRating: "Vidurkis", quickView: "Greitai", updateProgress: "Atnaujinti", page: "Pusl", of: "/", addNote: "Pastaba", startReading: "Pradėti",
    stopReading: "Sustabdyti", readingSession: "Sesija", pagesReadCount: "Puslapiai", saveSession: "Išsaugoti", cancel: "Atšaukti", added: "Pridėta", inThisMonth: "Šį mėnesį",
    activityMonths: "Aktyvumas", statusDistribution: "Būsena", emptyStatsTitle: "Tuščia", emptyStatsDesc: "Pridėk knygą.",
    selectBook: "Pasirinkti...", whatBookReading: "Ką skaitai?", whatPageFinished: "Puslapis?", lastSavedPage: "Paskutinis:", saveProgress: "Išsaugoti",
    addBookFirst: "Pridėti.", updateProgressMessage: "Baigta", readingTimeTitle: "Skaityti?",
    readingTimeDescReading: "Skaityk...", readingTimeDescIdle: "Laisvalaikis.", importSuccess: "Puiku: ",
    importFormatError: "Klaida.", importError: "Klaida.", onGithub: "Github", mitLicense: "MIT"
};

const bg = {
    library: "Библиотека", searchPlaceholder: "Търсене...", sortByDate: "Добавено", sortByTitle: "Заглавие", sortByAuthor: "Автор", sortByRating: "Рейтинг",
    tabShelf: "Рафт", tabToRead: "За четене", tabReading: "Чета", tabRead: "Прочетено", tabStats: "Статистика",
    addBook: "Нова книга", editBook: "Редакция", save: "Запис", title: "Заглавие", titlePlaceholder: "Напр. Властелинът",
    author: "Автор", authorPlaceholder: "Напр. Толкин", pages: "Страници", status: "Статус", statusToRead: "За четене", statusReading: "Чета", statusRead: "Прочетено",
    rating: "Рейтинг", notes: "Бележки", notesPlaceholder: "Мисли...", coverOrBookmark: "Корица", selectFromGallery: "Галерия", removeCover: "Изтриване",
    settings: "Настройки", appearance: "Изглед", theme: "Тема", themeSystem: "Система", themeLight: "Светла", themeDark: "Тъмна", accentColor: "Цвят",
    language: "Език", backup: "Данни", exportData: "Експорт", importData: "Импорт", clearData: "Изчисти", clearDataDesc: "Изтрий всичко",
    confirmClearData: "Сигурни ли сте?", aboutApp: "За приложението", version: "Версия", whatsNew: "Ново", licenses: "Лицензи", email: "Имейл",
    sourceCode: "Код", createIssue: "Сигнал", thirdPartyLicenses: "Трети", termsConditions: "Условия", privacyPolicy: "Поверителност",
    close: "Затвори", emptyShelfTitle: "Няма", emptyShelfDesc: "Добави.", deleteConfirm: "Изтриване?",
    statsTitle: "Статистика", thisYear: "Тази година", totalBooks: "Книги", booksRead: "Прочетени", booksAdded: "Добавени", pagesRead: "Страници", timeSpent: "Време",
    streakDays: "Дни", readingProgress: "Прогрес", overview: "Преглед", books: "Книги", time: "Време", currentlyReading: "Чета", toRead: "Предстоят",
    averageRating: "Средно", quickView: "Бързо", updateProgress: "Обнови", page: "Стр", of: "/", addNote: "Бележка", startReading: "Старт",
    stopReading: "Стоп", readingSession: "Сесия", pagesReadCount: "Стр", saveSession: "Запис", cancel: "Отказ", added: "Добавено", inThisMonth: "Този месец",
    activityMonths: "Активност", statusDistribution: "Разпределение", emptyStatsTitle: "Няма", emptyStatsDesc: "Добави книги.",
    selectBook: "Избери...", whatBookReading: "Какво четеш?", whatPageFinished: "Страница?", lastSavedPage: "Последна:", saveProgress: "Запази",
    addBookFirst: "Добави първо.", updateProgressMessage: "Готово", readingTimeTitle: "Време?",
    readingTimeDescReading: "Чети...", readingTimeDescIdle: "Релакс.", importSuccess: "Успех: ",
    importFormatError: "Грешка.", importError: "Грешка.", onGithub: "В Github", mitLicense: "MIT"
};

const tr = {
    library: "Kitaplık", searchPlaceholder: "Ara...", sortByDate: "Eklenme Tarihi", sortByTitle: "Başlık", sortByAuthor: "Yazar", sortByRating: "Değerlendirme",
    tabShelf: "Raf", tabToRead: "Okunacak", tabReading: "Okuyorum", tabRead: "Okundu", tabStats: "İstatistikler",
    addBook: "Yeni Kitap", editBook: "Düzenle", save: "Kaydet", title: "Başlık", titlePlaceholder: "Örn. Yüzüklerin Efendisi",
    author: "Yazar", authorPlaceholder: "Örn. J.R.R. Tolkien", pages: "Sayfalar", status: "Durum", statusToRead: "Okunacak", statusReading: "Okuyorum", statusRead: "Okundu",
    rating: "Puan", notes: "Notlar", notesPlaceholder: "Fikirlerin...", coverOrBookmark: "Kapak", selectFromGallery: "Galeriden seç", removeCover: "Kaldır",
    settings: "Ayarlar", appearance: "Görünüm", theme: "Tema", themeSystem: "Sistem", themeLight: "Açık", themeDark: "Koyu", accentColor: "Renk",
    language: "Dil", backup: "Veri", exportData: "Dışa Aktar", importData: "İçe Aktar", clearData: "Verileri Temizle", clearDataDesc: "Her şeyi sil",
    confirmClearData: "Emin misiniz?", aboutApp: "Hakkında", version: "Sürüm", whatsNew: "Yenilikler", licenses: "Lisanslar", email: "E-posta",
    sourceCode: "Kaynak Kod", createIssue: "Hata Bildir", thirdPartyLicenses: "3. Taraf", termsConditions: "Şartlar", privacyPolicy: "Gizlilik",
    close: "Kapat", emptyShelfTitle: "Kitap yok", emptyShelfDesc: "Kitap ekle.", deleteConfirm: "Silinsin mi?",
    statsTitle: "İstatistik", thisYear: "Bu Yıl", totalBooks: "Kitaplar", booksRead: "Okunan", booksAdded: "Eklenen", pagesRead: "Sayfa", timeSpent: "Zaman",
    streakDays: "Seri", readingProgress: "İlerleme", overview: "Genel", books: "Kitaplar", time: "Zaman", currentlyReading: "Okunuyor", toRead: "Okunacak",
    averageRating: "Ortalama", quickView: "Hızlı Bakış", updateProgress: "Güncelle", page: "Sayfa", of: "/", addNote: "Not", startReading: "Başla",
    stopReading: "Durdur", readingSession: "Oturum", pagesReadCount: "Sayfa sayısı", saveSession: "Kaydet", cancel: "İptal", added: "Eklendi", inThisMonth: "Bu ay",
    activityMonths: "Aktivite", statusDistribution: "Durum", emptyStatsTitle: "Veri yok", emptyStatsDesc: "Kitap ekleyin.",
    selectBook: "Seç...", whatBookReading: "Ne okudun?", whatPageFinished: "Hangi sayfa?", lastSavedPage: "Son:", saveProgress: "Kaydet",
    addBookFirst: "Önce kitap ekle.", updateProgressMessage: "Tamamlandı", readingTimeTitle: "Okuma zamanı?",
    readingTimeDescReading: "Hikayeye dalın...", readingTimeDescIdle: "Okumaya başla.", importSuccess: "Başarılı: ",
    importFormatError: "Hatalı format.", importError: "Hata.", onGithub: "Github'da", mitLicense: "MIT lisansı"
};

const map = { et, lv, lt, bg, tr };

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
