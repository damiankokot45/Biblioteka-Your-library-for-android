import fs from 'fs';

const ko = {
    library: "라이브러리", searchPlaceholder: "책 검색...", sortByDate: "추가된 날짜", sortByTitle: "제목", sortByAuthor: "저자", sortByRating: "평점",
    tabShelf: "책장", tabToRead: "읽을 책", tabReading: "읽는 중", tabRead: "읽음", tabStats: "통계",
    addBook: "새 책", editBook: "수정", save: "저장", title: "제목", titlePlaceholder: "예: 반지의 제왕",
    author: "저자", authorPlaceholder: "예: J.R.R. 톨킨", pages: "페이지 수", status: "상태", statusToRead: "읽을 책", statusReading: "읽는 중", statusRead: "읽음",
    rating: "평점", notes: "메모", notesPlaceholder: "당신의 생각...", coverOrBookmark: "표지", selectFromGallery: "갤러리에서 선택", removeCover: "삭제",
    settings: "설정", appearance: "외관", theme: "테마", themeSystem: "시스템", themeLight: "라이트", themeDark: "다크", accentColor: "포인트 색상",
    language: "언어", backup: "데이터 및 백업", exportData: "데이터 내보내기", importData: "데이터 가져오기", clearData: "데이터 지우기", clearDataDesc: "모두 지우기",
    confirmClearData: "정말 지우시겠습니까? 되돌릴 수 없습니다!", aboutApp: "앱 정보", version: "버전", whatsNew: "새로운 소식", licenses: "라이선스", email: "이메일",
    sourceCode: "소스 코드", createIssue: "문제 보고", thirdPartyLicenses: "타사 라이선스", termsConditions: "이용 약관", privacyPolicy: "개인정보처리방침",
    close: "닫기", emptyShelfTitle: "책이 없습니다", emptyShelfDesc: "책을 추가하세요.", deleteConfirm: "이 책을 삭제하시겠습니까?",
    statsTitle: "통계", thisYear: "올해", totalBooks: "총 책 수", booksRead: "읽은 책", booksAdded: "추가된 책", pagesRead: "읽은 페이지", timeSpent: "보낸 시간",
    streakDays: "연속(일)", readingProgress: "진행 상황", overview: "개요", books: "책", time: "시간", currentlyReading: "읽고 있는 책", toRead: "읽을 책",
    averageRating: "평균 평점", quickView: "빠른 보기", updateProgress: "진행률 업데이트", page: "페이지", of: "/", addNote: "메모 추가", startReading: "읽기 시작",
    stopReading: "타이머 중지", readingSession: "읽기 세션", pagesReadCount: "읽은 페이지 수", saveSession: "세션 저장", cancel: "취소", added: "추가됨", inThisMonth: "이번 달",
    activityMonths: "최근 활성", statusDistribution: "상태 분포", emptyStatsTitle: "데이터 없음", emptyStatsDesc: "책을 추가해 통계를 확인하세요.",
    selectBook: "책 선택...", whatBookReading: "어떤 책을 읽었나요?", whatPageFinished: "어느 페이지까지?", lastSavedPage: "마지막:", saveProgress: "저장",
    addBookFirst: "책을 먼저 추가하세요.", updateProgressMessage: "완료됨", readingTimeTitle: "읽을 시간?",
    readingTimeDescReading: "이야기에 빠져보세요...", readingTimeDescIdle: "책을 읽어보세요.", importSuccess: "불러오기 성공: ",
    importFormatError: "잘못된 형식입니다.", importError: "오류 발생.", onGithub: "Github", mitLicense: "MIT 라이선스"
};

const ja = {
    library: "ライブラリ", searchPlaceholder: "検索...", sortByDate: "追加日", sortByTitle: "タイトル", sortByAuthor: "著者", sortByRating: "評価",
    tabShelf: "本棚", tabToRead: "読みたい", tabReading: "読書中", tabRead: "読了", tabStats: "統計",
    addBook: "新しい本", editBook: "編集", save: "保存", title: "タイトル", titlePlaceholder: "例: ロード・オブ・ザ・リング",
    author: "著者", authorPlaceholder: "例: J.R.R. トールキン", pages: "ページ", status: "ステータス", statusToRead: "読みたい", statusReading: "読書中", statusRead: "読了",
    rating: "評価", notes: "メモ", notesPlaceholder: "あなたの考え...", coverOrBookmark: "カバー", selectFromGallery: "画像を選択", removeCover: "削除",
    settings: "設定", appearance: "外観", theme: "テーマ", themeSystem: "システム", themeLight: "ライト", themeDark: "ダーク", accentColor: "アクセントカラー",
    language: "言語", backup: "データ", exportData: "エクスポート", importData: "インポート", clearData: "データを消去", clearDataDesc: "すべて削除",
    confirmClearData: "本当に削除しますか？", aboutApp: "アプリについて", version: "バージョン", whatsNew: "更新情報", licenses: "ライセンス", email: "メール",
    sourceCode: "ソースコード", createIssue: "問題を報告", thirdPartyLicenses: "サードパーティ", termsConditions: "利用規約", privacyPolicy: "プライバシー",
    close: "閉じる", emptyShelfTitle: "本がありません", emptyShelfDesc: "本を追加してください。", deleteConfirm: "削除しますか？",
    statsTitle: "統計", thisYear: "今年", totalBooks: "合計", booksRead: "読んだ本", booksAdded: "追加した本", pagesRead: "読んだページ", timeSpent: "時間",
    streakDays: "連続(日)", readingProgress: "進行状況", overview: "概要", books: "本", time: "時間", currentlyReading: "読書中", toRead: "読みたい本",
    averageRating: "平均評価", quickView: "クイックビュー", updateProgress: "進捗を更新", page: "ページ", of: "/", addNote: "メモ", startReading: "読む",
    stopReading: "停止", readingSession: "読書セッション", pagesReadCount: "読んだページ数", saveSession: "保存", cancel: "キャンセル", added: "追加済み", inThisMonth: "今月",
    activityMonths: "最近のアクティビティ", statusDistribution: "ステータス割合", emptyStatsTitle: "データなし", emptyStatsDesc: "本を追加してください。",
    selectBook: "本を選択...", whatBookReading: "どの本を読みましたか？", whatPageFinished: "どのページで終わりましたか？", lastSavedPage: "最後:", saveProgress: "保存",
    addBookFirst: "まずは本を追加してください。", updateProgressMessage: "更新完了", readingTimeTitle: "読書時間？",
    readingTimeDescReading: "物語へ...", readingTimeDescIdle: "読書を始めましょう。", importSuccess: "インポート完了：",
    importFormatError: "フォーマットエラー。", importError: "エラーです。", onGithub: "Github", mitLicense: "MITライセンス"
};

const is = {
    library: "Bókasafn", searchPlaceholder: "Leita...", sortByDate: "Dagsetning", sortByTitle: "Titill", sortByAuthor: "Höfundur", sortByRating: "Einkunn",
    tabShelf: "Hilla", tabToRead: "Að lesa", tabReading: "Les", tabRead: "Lesið", tabStats: "Tölfræði",
    addBook: "Ný bók", editBook: "Breyta", save: "Vista", title: "Titill", titlePlaceholder: "Hringadróttinssaga",
    author: "Höfundur", authorPlaceholder: "J.R.R. Tolkien", pages: "Síður", status: "Staða", statusToRead: "Að lesa", statusReading: "Les", statusRead: "Lesið",
    rating: "Einkunn", notes: "Glósur", notesPlaceholder: "Þínar hugsanir...", coverOrBookmark: "Kápa", selectFromGallery: "Veldu mynd", removeCover: "Eyða",
    settings: "Stillingar", appearance: "Útlit", theme: "Þema", themeSystem: "Kerfi", themeLight: "Ljóst", themeDark: "Dökkt", accentColor: "Litur",
    language: "Tungumál", backup: "Gögn", exportData: "Flytja út", importData: "Flytja inn", clearData: "Hreinsa", clearDataDesc: "Eyða öllu",
    confirmClearData: "Ertu viss?", aboutApp: "Um appið", version: "Útgáfa", whatsNew: "Nýtt", licenses: "Leyfi", email: "Netfang",
    sourceCode: "Kóði", createIssue: "Senda", thirdPartyLicenses: "Þriðja aðila", termsConditions: "Skilmálar", privacyPolicy: "Persónuvernd",
    close: "Loka", emptyShelfTitle: "Engar bækur", emptyShelfDesc: "Bæta við bók.", deleteConfirm: "Eyða bók?",
    statsTitle: "Tölfræði", thisYear: "Í ár", totalBooks: "Samanlagt", booksRead: "Lesnar", booksAdded: "Bætt við", pagesRead: "Hl. síður", timeSpent: "Tími",
    streakDays: "Dagar", readingProgress: "Árangur", overview: "Yfirlit", books: "Bækur", time: "Tími", currentlyReading: "Ert að lesa", toRead: "Að lesa",
    averageRating: "Meðaltal", quickView: "Yfirlit", updateProgress: "Uppfæra", page: "Bls", of: "/", addNote: "Glósa", startReading: "Byrja",
    stopReading: "Stopp", readingSession: "Lotur", pagesReadCount: "Bls. lesnar", saveSession: "Vista", cancel: "Hætta", added: "Bætt við", inThisMonth: "Mánuði",
    activityMonths: "Virkni", statusDistribution: "Staða", emptyStatsTitle: "Ekkert", emptyStatsDesc: "Bættu við bókum.",
    selectBook: "Veldu...", whatBookReading: "Hvað?", whatPageFinished: "Á hvaða bls?", lastSavedPage: "Síðast:", saveProgress: "Vista",
    addBookFirst: "Bættu fyrst við.", updateProgressMessage: "Sýnir", readingTimeTitle: "Lestur?",
    readingTimeDescReading: "Lestu...", readingTimeDescIdle: "Lestu.", importSuccess: "Tókst: ",
    importFormatError: "Villa.", importError: "Villa.", onGithub: "Github", mitLicense: "MIT"
};

const kl = {
    library: "Atuagaateqarfik", searchPlaceholder: "Ujarli...", sortByDate: "Ullut", sortByTitle: "Qulequtaq", sortByAuthor: "Atuakkiortoq", sortByRating: "Naliliineq",
    tabShelf: "Nerriveqarfik", tabToRead: "Atuarneqartussat", tabReading: "Atuarpara", tabRead: "Atuareerlugu", tabStats: "Kisitsisitigut",
    addBook: "Atuagaq", editBook: "Iluarsi", save: "Toqqoruk", title: "Qulequtaq", titlePlaceholder: "...",
    author: "Atuakkiortoq", authorPlaceholder: "...", pages: "Quppernerit", status: "Sumiiffik", statusToRead: "Atuarneqartussat", statusReading: "Atuarpara", statusRead: "Atuareerpoq",
    rating: "Naliliineq", notes: "Allattukkat", notesPlaceholder: "...", coverOrBookmark: "Saqqaa", selectFromGallery: "Toqqaagit", removeCover: "Piiaagit",
    settings: "Aaqqissuussinerit", appearance: "Isikkoq", theme: "Qitiusumik", themeSystem: "Aaqqissuussisartup", themeLight: "Qaamasoq", themeDark: "Taartoq", accentColor: "Qillertittoq",
    language: "Oqaatsit", backup: "Paasissutissat", exportData: "Nassiugit", importData: "Tigugit", clearData: "Nungukkit", clearDataDesc: "Tamaasa",
    confirmClearData: "Nunguppat?", aboutApp: "Pillugu", version: "Immikkoortitsineq", whatsNew: "Nutaat", licenses: "Akuersissutit", email: "Allat",
    sourceCode: "Suliat", createIssue: "Malugiaq", thirdPartyLicenses: "Allat", termsConditions: "Aalajangersakkat", privacyPolicy: "Isumannaallisaaneq",
    close: "Matuuk", emptyShelfTitle: "Soqangilaq", emptyShelfDesc: "Atuagaq ilannguguk.", deleteConfirm: "Piiaavit?",
    statsTitle: "Kisitsisitigut", thisYear: "Ukioq", totalBooks: "Tamaasa", booksRead: "Atuakkat", booksAdded: "Ilanngunneqartut", pagesRead: "Quppernerit", timeSpent: "Piffissaq",
    streakDays: "Ullut", readingProgress: "Atuarneq", overview: "Takussutissaq", books: "Atuakkat", time: "Piffissaq", currentlyReading: "Atuarpai", toRead: "Atuagassat",
    averageRating: "Agguaqatigiissillugu", quickView: "Takulaaruk", updateProgress: "Nutarteruk", page: "Qupp", of: "/", addNote: "Allattukkat", startReading: "Aallarti",
    stopReading: "Unitsiguk", readingSession: "Tamakkernera", pagesReadCount: "Qupp", saveSession: "Toqqoruk", cancel: "Asuu", added: "Ilanngunneqarpoq", inThisMonth: "Qaammat",
    activityMonths: "Suliaq", statusDistribution: "Agm", emptyStatsTitle: "Suunngilaq", emptyStatsDesc: "Atuakkat.",
    selectBook: "Toqqaagit...", whatBookReading: "Suna?", whatPageFinished: "Qupp?", lastSavedPage: "Naggataa:", saveProgress: "Toqqoruk",
    addBookFirst: "Atuagaqalerit.", updateProgressMessage: "Naammassivoq", readingTimeTitle: "Piffissaq?",
    readingTimeDescReading: "Atuarit...", readingTimeDescIdle: "Atuarit.", importSuccess: "Aaqqippoq: ",
    importFormatError: "Kukkuneq.", importError: "Kukkuneq.", onGithub: "Github", mitLicense: "MIT"
};

const map = { ko, ja, is, kl };

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
