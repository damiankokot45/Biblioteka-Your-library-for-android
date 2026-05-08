import * as fs from 'fs';

const settingsModalPath = './src/components/SettingsModal.tsx';
let smContent = fs.readFileSync(settingsModalPath, 'utf8');

// The language array order
const langs = ['fi', 'sv', 'no', 'da', 'nl', 'lb', 'pt', 'it', 'hr', 'sk', 'et', 'lv', 'lt', 'bg', 'tr', 'ko', 'ja', 'is', 'kl'];

const lastUpdated = {
  fi: "Viimeksi päivitetty: Toukokuu 2026",
  sv: "Senast uppdaterad: Maj 2026",
  no: "Sist oppdatert: Mai 2026",
  da: "Sidst opdateret: Maj 2026",
  nl: "Laatst bijgewerkt: Mei 2026",
  lb: "Lescht aktualiséiert: Mee 2026",
  pt: "Última atualização: Maio de 2026",
  it: "Ultimo aggiornamento: Maggio 2026",
  hr: "Posljednje ažuriranje: Svibanj 2026",
  sk: "Posledná aktualizácia: Máj 2026",
  et: "Viimati uuendatud: Mai 2026",
  lv: "Pēdējo reizi atjaunināts: Maijs 2026",
  lt: "Paskutinį kartą atnaujinta: Gegužė 2026",
  bg: "Последна актуализация: Май 2026",
  tr: "Son güncelleme: Mayıs 2026",
  ko: "마지막 업데이트: 2026년 5월",
  ja: "最終更新日: 2026年5月",
  is: "Síðast uppfært: Maí 2026",
  kl: "Kingullermik nutarterpoq: Maaji 2026"
};

const privacyDisclaimer = {
  fi: { title: 'Tietosi pysyvät laitteellasi.', body: 'Biblioteka ei kerää, siirrä tai myy henkilökohtaisia ​​tietoja.' },
  sv: { title: 'Dina data stannar på din enhet.', body: 'Biblioteka samlar inte in, överför eller säljer några personuppgifter.' },
  no: { title: 'Dataene dine forblir på enheten din.', body: 'Biblioteka samler ikke inn, overfører eller selger noen personopplysninger.' },
  da: { title: 'Dine data forbliver på din enhed.', body: 'Biblioteka indsamler, overfører eller sælger ikke nogen personlige data.' },
  nl: { title: 'Je gegevens blijven op je apparaat.', body: 'Biblioteka verzamelt, verzendt of verkoopt geen persoonlijke gegevens.' },
  lb: { title: 'Är Daten bleiwen op ärem Apparat.', body: 'Biblioteka sammelt, iwwerdréit oder verkeeft keng perséinlech Daten.' },
  pt: { title: 'Os seus dados permanecem no seu dispositivo.', body: 'O Biblioteka não recolhe, transmite ou vende quaisquer dados pessoais.' },
  it: { title: 'I tuoi dati rimangono sul tuo dispositivo.', body: 'Biblioteka non raccoglie, trasmette o vende alcun dato personale.' },
  hr: { title: 'Vaši podaci ostaju na vašem uređaju.', body: 'Biblioteka ne prikuplja, prenosi ili prodaje bilo kakve osobne podatke.' },
  sk: { title: 'Vaše údaje zostávajú na vašom zariadení.', body: 'Biblioteka nezhromažďuje, neprenáša ani nepredáva žiadne osobné údaje.' },
  et: { title: 'Teie andmed jäävad teie seadmesse.', body: 'Biblioteka ei kogu, edasta ega müü isikuandmeid.' },
  lv: { title: 'Jūsu dati paliek jūsu ierīcē.', body: 'Biblioteka nevāc, nepārsūta un nepārdod nekādus personas datus.' },
  lt: { title: 'Jūsų duomenys lieka jūsų įrenginyje.', body: 'Biblioteka nerenka, neperduoda ir neparduoda jokių asmeninių duomenų.' },
  bg: { title: 'Вашите данни остават на вашето устройство.', body: 'Biblioteka не събира, не предава и не продава лични данни.' },
  tr: { title: 'Verileriniz cihazınızda kalır.', body: 'Biblioteka kişisel verileri toplamaz, iletmez veya satmaz.' },
  ko: { title: '데이터는 기기에 보관됩니다.', body: 'Biblioteka는 개인 데이터를 수집, 전송 또는 판매하지 않습니다.' },
  ja: { title: 'データはデバイスに保存されます。', body: 'Bibliotekaは個人データを収集、送信、販売することはありません。' },
  is: { title: 'Gögnin þín eru áfram á tækinu þínu.', body: 'Biblioteka safnar hvorki, sendir né selur persónuupplýsingar.' },
  kl: { title: 'Paasissutissat qarasaasiarmiigaapput.', body: 'Biblioteka inummut tunngasunik katersinngilaq, tunniussinngilaq imaluunniit tunisineranngilaq.' }
};

const privacyItems = {
  fi: [
    { title: 'Tietojen varastointi', body: 'Kaikki kirjasi, muistiinpanosi ja asetuksesi tallennetaan yksinomaan laitteellesi. Tiliä ei tarvita.' },
    { title: 'Ei analytiikkaa tai seurantaa', body: 'Emme käytä mitään analytiikkapalveluita, kaatumisraportoijia tai mainos-SDK:ita.' },
    { title: 'Käyttöoikeudet', body: 'Androidissa sovellus saattaa pyytää tallennustilan käyttöoikeutta varmuuskopioita varten. Näitä käytetään vain mainittuihin tarkoituksiin.' },
    { title: 'Avoin lähdekoodi', body: 'Biblioteka on täysin avoimen lähdekoodin. Voit tarkastaa kaiken koodin GitHubissa näiden väitteiden vahvistamiseksi.' },
    { title: 'Ota yhteyttä', body: 'Tietosuojaa koskevia kysymyksiä? Avaa ongelma GitHubissa tai ota yhteyttä suoraan kehittäjään osoitteessa biblioteka@damiankokot.eu.' }
  ],
  sv: [
    { title: 'Datalagring', body: 'Alla dina böcker, anteckningar och inställningar sparas exklusivt på din enhet. Inget konto krävs.' },
    { title: 'Ingen analys eller spårning', body: 'Vi använder inga analystjänster, kraschrapporterare eller annons-SDK:er.' },
    { title: 'Behörigheter', body: 'På Android kan appen begära lagringsbehörigheter för säkerhetskopior. Dessa används endast för de angivna syftena.' },
    { title: 'Öppen källkod', body: 'Biblioteka är helt öppen källkod. Du kan granska all kod på GitHub för att bekräfta dessa påståenden.' },
    { title: 'Kontakt', body: 'Frågor om integritet? Öppna ett ärende på GitHub eller kontakta utvecklaren direkt på biblioteka@damiankokot.eu.' }
  ],
  no: [
    { title: 'Datalagring', body: 'Alle bøkene, notatene og innstillingene dine lagres utelukkende på enheten din. Ingen konto kreves.' },
    { title: 'Ingen analyse eller sporing', body: 'Vi bruker ikke  analysetjenester, krasjrapporterere eller annonse-SDK-er.' },
    { title: 'Tillatelser', body: 'På Android kan appen be om lagringstillatelser for sikkerhetskopiering. Disse brukes kun til de oppgitte formålene.' },
    { title: 'Åpen kildekode', body: 'Biblioteka er fullstendig åpen kildekode. Du kan inspisere all kode på GitHub for å bekrefte disse påstandene.' },
    { title: 'Kontakt', body: 'Personvernspørsmål? Åpne et problem på GitHub eller kontakt utvikleren direkte på biblioteka@damiankokot.eu.' }
  ],
  da: [
    { title: 'Datalagring', body: 'Alle dine bøger, noter og indstillinger gemmes udelukkende på din enhed. Ingen konto er påkrævet.' },
    { title: 'Ingen analyse eller sporing', body: 'Vi bruger ingen analysetjenester, crashrapporterere eller annonce-SDK\'er.' },
    { title: 'Tilladelser', body: 'På Android anmoder appen muligvis om lageradgang til sikkerhedskopiering. Disse bruges kun til de angivne formål.' },
    { title: 'Open Source', body: 'Biblioteka er fuldstændig open source. Du kan inspicere al kode på GitHub for at bekræfte disse påstande.' },
    { title: 'Kontakt', body: 'Har du spørgsmål om privatliv? Åbn et problem på GitHub eller kontakt udvikleren direkte på biblioteka@damiankokot.eu.' }
  ],
  nl: [
    { title: 'Gegevensopslag', body: 'Al je boeken, notities en instellingen worden exclusief op je apparaat opgeslagen. Geen account vereist.' },
    { title: 'Geen analytics of tracking', body: 'We gebruiken geen analysediensten, crashrapporteurs of advertentie-SDK\'s.' },
    { title: 'Machtigingen', body: 'Op Android kan de app opslagrechten voor back-ups vragen. Deze worden alleen voor de vermelde doeleinden gebruikt.' },
    { title: 'Open Source', body: 'Biblioteka is volledig open source. Je kunt alle code inspecteren op GitHub om deze claims te verifiëren.' },
    { title: 'Contact', body: 'Vragen over privacy? Open een probleem op GitHub of neem rechtstreeks contact op met de ontwikkelaar via biblioteka@damiankokot.eu.' }
  ],
  lb: [
    { title: 'Datespäicherung', body: 'All ärt Bicher, Notizen, ans Astellungen sinn just op ärem Apparat respektiv gespäichert. Et ass keen Kont néideg.' },
    { title: 'Keng Analyse oder Tracking', body: 'Mir benotze keng Analyseservicer, Crash Reporter oder Reklammen SDK\'en.' },
    { title: 'Berechtegungen', body: 'Op Android freet d\'App vläicht no Späicherrechter fir Backups. Déi ginn just fir den ugekënnegten Zweck benotzt.' },
    { title: 'Open Source', body: 'Biblioteka ass komplett Open Source. Dir kënnt de ganze Code op GitHub nokucken, fir dëst ze verifièren.' },
    { title: 'Kontakt', body: 'Privatsphär Froen? Erstellt en Issue am GitHub oder kontaktéiert den Entwéckler direk op biblioteka@damiankokot.eu.' }
  ],
  pt: [
    { title: 'Armazenamento de Dados', body: 'Todos os seus livros, notas e configurações são armazenados exclusivamente no seu dispositivo. Nenhuma conta é exigida.' },
    { title: 'Sem Análise ou Rastreamento', body: 'Não usamos serviços de análise, repórteres de falhas ou SDKs de publicidade.' },
    { title: 'Permissões', body: 'No Android, a app pode solicitar permissões de armazenamento para backups. Elas são usadas apenas para as finalidades indicadas.' },
    { title: 'Código aberto', body: 'O Biblioteka é totalmente de código aberto. Pode inspecionar todo o código no GitHub para verificar essas informações.' },
    { title: 'Contacto', body: 'Dúvidas sobre privacidade? Abra um problema no GitHub ou contacte o programador diretamente em biblioteka@damiankokot.eu.' }
  ],
  it: [
    { title: 'Archiviazione dati', body: 'Tutti i tuoi libri, appunti e le impostazioni sono archiviati esclusivamente sul tuo dispositivo. Nessun account richiesto.' },
    { title: 'Nessuna analisi o tracciamento', body: 'Non utilizziamo servizi di analisi, report degli arresti anomali o SDK pubblicitari.' },
    { title: 'Autorizzazioni', body: 'Su Android l\'app può richiedere le autorizzazioni per l\'archiviazione per il backup. Vengono utilizzate solo per gli scopi dichiarati.' },
    { title: 'Open Source', body: 'Biblioteka è completamente open source. Puoi ispezionare tutto il codice su GitHub per verificare.' },
    { title: 'Contatto', body: 'Domande sulla privacy? Apri un problema su GitHub o contatta direttamente lo sviluppatore all\'indirizzo biblioteka@damiankokot.eu.' }
  ],
  hr: [
    { title: 'Skladištenje podataka', body: 'Sve tvoje knjige, bilješke i postavke spremaju se isključivo na uređaj. Nema potrebe za otvaranjem računa.' },
    { title: 'Bez praćenja i analitike', body: 'Ne koristimo nikakve usluge dubinske analize, sustave prijave problema ili SDK-ove za oglase.' },
    { title: 'Dozvol', body: 'Na Androidu aplikacija može zatražiti dozvole za pohranu za sigurnosne kopije. To se koristi isključivo za navedene svrhe.' },
    { title: 'Softver otvorenog koda', body: 'Biblioteka je aplikacija otvorenog koda. Sav je kôd objavljen na GitHubu radi potpune transparentnosti.' },
    { title: 'Kontakt', body: 'Pitanja o privatnosti? Prijavite ih na GitHubu ili kontaktirajte autora na biblioteka@damiankokot.eu.' }
  ],
  sk: [
    { title: 'Úložisko Dát', body: 'Všetky Vaše knihy, poznámky a nastavenia sú uložené len vo Vašom zariadení. Nevyžaduje sa vytvorenie účtu.' },
    { title: 'Žiadna Analytika Bez Zberu Dát', body: 'Nevyužívame nijaké analytické služby, programy hlásenia pádov ani inzerujúce platformy.' },
    { title: 'Prístupové práva', body: 'Zariadenia s operačným systémom Android môžu byť podrobené žiadosti na prístupové úložiská. Tento prístup je pre zálohovanie dát a nič iné.' },
    { title: 'Open Source', body: 'Biblioteka je kompletne open-source systém. Všetky detaily si môžete otestovať priamo na GitHub-e a preveriť si tak spoľahlivosť.' },
    { title: 'Kontakt', body: 'Máte neikaké otázky týkajúce sa súkromia? Otvorte diskusiu na platforme GitHub alebo kontaktujte autora priamo na biblioteka@damiankokot.eu.' }
  ],
  et: [
    { title: 'Andmesalvestus', body: 'Kõiki teie raamatuid, märkmeid ja eelistusi säilitatakse vaid seadme mälus. Mingit kontot pole vaja.' },
    { title: 'Jälgimine ega analüüsid puuduvad', body: 'Meie ei kasuta analüüsivahendeid, krahhi raporteerimist ega ka reklaamide tarkvaraarenduskomplekti.' },
    { title: 'Load', body: 'Android-süsteemidel võib rakendus tarvitada varukoopiate tegemiseks mälukasutuse valikuid ja lube. Neid õiguseid tarbitakse vaid mainitud tegevuste raames.' },
    { title: 'Avatud Lähtekood', body: 'Biblioteka kasutab läbinisti avatud lähtekoodiga lahendusi. Kõike on võimalik Github keskkonnast üle kaeda ning meie aususes veenduda.' },
    { title: 'Kontakt', body: 'Tekkis küsimusi isikuandmete ja privaatsuse kohta? Jätke küsimus Github keskkonda või kontakteeruge loojaga aadressil biblioteka@damiankokot.eu.' }
  ],
  lv: [
    { title: 'Datu Glabāšana', body: 'Visām jūsu grāmatām, piezīmēm un iestatījumiem jāglabājas vienīgi jūsu iekārtā. Lietotāja profila nav.' },
    { title: 'Nekādas Analītikas Un Izsekošanas', body: 'Mēs neizmantojam analītiskos pakalpojumus, defektu identificēšanas sistēmas vai mārketinga rīkus.' },
    { title: 'Piekļuves Cēloņi', body: 'Android operētājsistēmā lietojumprogrammai var būt nepieciešamas krātuves paplašinājumu tiesības rezerves kopiju izveidei. Citu vajadzību nolūkos šī atļauja netiks izmantota.' },
    { title: 'Atvērtā koda programma', body: 'Biblioteka programmēšanai izmantots vien atvērtais kods. Dodieties uz GitHub resursu, lai patiesi pārliecinātos par doto faktu.' },
    { title: 'Kontaktinformācija', body: 'Jums rodas kādi jautājumus saistībā par doto drošību? Atverat tiketu portālā GitHub vai sazinieties tieši ar pārvaldītāju epastā: biblioteka@damiankokot.eu.' }
  ],
  lt: [
    { title: 'DuomenųSaugykla', body: 'Visos knygos, užrašai ir kiti sistemos nustatymai saugomi tiesiog jūsų naudojamame prietaise. Papildoma paskyra tikrai nėra būtina.' },
    { title: 'SekimoIr Analizės Negalimumas', body: 'Mes neužsiimame analitika paremta veikla ir nenaudojame tam skirtų programų asmeninio naudojimo labui.' },
    { title: 'Leidimai', body: 'Kopijavimo tikslais operacinėse sistemose kaip Android gali atsirasti prašymų atitinkamų talpinimo ir prisijungimo teisių klausimams.' },
    { title: 'Atviras Kodas', body: 'Biblioteka – tai tik atvirojo kodo pagrindu sukurtas produktas. Visi originalus sistemos parametrai egzistuoja atvira prieiga prieinamoje sistemoje, vadinamoje GitHub.' },
    { title: 'Susisiekti', body: 'Iškilus skubiems pranešimams apsilankykite GitHub ar išsiuskite informacinį laišką per paštą biblioteka@damiankokot.eu.' }
  ],
  bg: [
    { title: 'Съхранение на информация', body: 'Всички книги, бележки и допълнителни настройки са архивирани във вашето устройство. Не е необходима допълнителна регистрация.' },
    { title: 'Липса на следене или аналитика', body: 'Приложението е освободено от спомагателни програми с анализаторски и други подобни функции.' },
    { title: 'Достъп', body: 'Достъп до личното ви хранилище в Android се запазва само с цел създаване на резервно копие и не се употребява за допълнителни каузи.' },
    { title: 'Разработен с отворен код', body: 'Biblioteka функционира главно чрез отворен код. Можете да прегледате файловете в GitHub.' },
    { title: 'Контакти', body: 'Намерете отговор на вашите въпроси или ни потърсете директно на: biblioteka@damiankokot.eu.' }
  ],
  tr: [
    { title: 'Veri Depolama', body: 'Tüm kitaplarınız, notlarınız ve ayarlarınız izne bağlı biçimde yalnızca cihazınızda tutulur. Kullanıcı profili gereksinimi tamamen yok.' },
    { title: 'Abonelik ve Analiz Yapılmamaktadır', body: 'Harici sistemlerin sunduğu izleme ağlardan yardım veya benzeri verilerle bağlantımız olmayıp üçüncü kopyalara dahil edilmemiştir.' },
    { title: 'İzinler', body: 'Mevcut veriler üzerindeki güncellemiş depolama istekleri kopyalama adımları Android kapsamında belirtilmektedir.' },
    { title: 'Açık Kaynak Kod', body: 'Sistemin altyapısı olduğu üzere açık kaynak koduna yönelik tasarımlardan GitHub sekmesinden erişerek yararlanıp öğrenebilir.' },
    { title: 'İletişim', body: 'Sizi desteklemek için uyarımıza ilişkin iletileri GitHub bildirimden veyahut yöneticimiz biblioteka@damiankokot.eu bağlantısından sağlayabilirsiniz.' }
  ],
  ko: [
    { title: '데이터 저장', body: '귀하의 모든 책, 메모 및 설정은 기기에 독점적으로 보관되며 로그인 계정이 필요치 않습니다.' },
    { title: '분석 혹은 개인 데이터 추적 없음', body: '당사는 사용자 트래킹에 연관된 소프트웨어 또는 외부 광고 툴을 포함하지 않습니다.' },
    { title: '권한 설정', body: '본 데이터 백업 시스템 절차에서 안드로이드에 대한 정보 조회 승인을 별도 부여해 주셔야 합니다.' },
    { title: '오픈 소스 정보', body: 'Biblioteka 서비스는 누구나 GitHub를 통해 개발 코드 내역을 확인할 오픈 기반 기능을 공유합니다.' },
    { title: '추가 연락 사항', body: '모든 시스템이나 이슈 관련 추가 설명이 있으신 경우 GitHub나 관리 파트너 이메일 biblioteka@damiankokot.eu를 방문해 주시기 바랍니다.' }
  ],
  ja: [
    { title: 'データ保存のしくみ', body: '登録された読書データおよび設定等の詳細は常にユーザー個人のツール上に留められアカウントの保有も必要としません。' },
    { title: '情報の追跡は行われません', body: '利用状況監視とデータ流しに関連する特定のサービス等を共有せずに本質的な動作のみの管理を行っています。' },
    { title: 'アクセス許可について', body: '各種アプリ機能と連携したAndroidデータバックアップ実行環境に対して一部利用許可のお願いをしております。' },
    { title: '完全なるオープンソース', body: 'Bibliotekaのソース構成はコードを含めて外部ソフトウェアのGitHubで全面的な閲覧が随時可能となっております。' },
    { title: '連絡先一覧', body: 'もし不明なご指摘またはその他不具合がありましたらGitHubでの通知、およびbiblioteka@damiankokot.euへ直接お問い合わせ願います。' }
  ],
  is: [
    { title: 'Gagnageymsla', body: 'Allar bækurnar þínar og stillingar verða einungis varðveittar innan staðbundins búnaðar.' },
    { title: 'Engin ytri vefgreining', body: 'Öll þjónusta sem tengist aukaauglýsingum eða annarskonar tölfræðigreiningar hugbúnaði eru undanskilin.' },
    { title: 'Aðgangsheimildir', body: 'Á Android stýrikerfinu verður öryggisafrit af upplýsingum til reiðu svo lengi sem aðgangur á hlaðrásum sé opinn.' },
    { title: 'Frjáls Opinn Kóði', body: 'Biblioteka styðst einvörðungu á opinn grunnkóða sem nálgast má eftir vild á GitHub þjónustunni.' },
    { title: 'Nánari aðstoð', body: 'Vinsamlegast nálgist nánari fyrirspurnir í gegnum GitHub vettvanginn eða hafið samband beint á netfangið biblioteka@damiankokot.eu.' }
  ],
  kl: [
    { title: 'Paasissutissat Tassa', body: 'Allat atuakkatit isertuussatit piumasaqaatikkut nammineq pigaarniarlugit toqqorneqarput.' },
    { title: 'Misissuinera Nangeqqaarneq', body: 'Internet atorlugu pisartagarnut avatangiisimik ajornartorsiutillu suliaralugillu isumannaatsumut immikkoortiterput.' },
    { title: 'Pisortatigut Aaqqissu', body: 'Android ilanngullugit toqqorsivik peqquteqarniarlugu isumannaallisaalluni imminut sillimaffigivoq.' },
    { title: 'Oqaatsit Aaqqissuussaq', body: 'Biblioteka siammasissumik piviusunngorluni iluaqutissiivoq, GitHub saqqumsillugu.' },
    { title: 'Saaffiginnissut', body: 'Sammisat unammillernartut uaniinnaq naatsorsuunneqarlutik paasissutissiip GitHub-imi imaluunniit biblioteka@damiankokot.eu' }
  ]
};

const termsItems = {
  fi: [
    { title: '1. Käyttöehtojen hyväksyminen', body: 'Lataamalla tai käyttämällä Biblioteka-sovellusta hyväksyt nämä käyttöehdot. Jos et hyväksy, poista sovellus.' },
    { title: '2. Lisenssi', body: 'Biblioteka on ilmainen, avoimen lähdekoodin ohjelmisto, jota jaetaan MIT-lisenssillä.' },
    { title: '3. Sovelluksen käyttö', body: 'Sovellus on tarkoitettu henkilökohtaiseen käyttöön. Sitoudut olemaan väärinkäyttämättä sovellusta.' },
    { title: '4. Ei takuuta', body: 'Sovellus tarjotaan "sellaisenaan" ilman minkäänlaista takuuta. Kehittäjä ei ole vastuussa mistään tietojen menetyksestä.' },
    { title: '5. Muutokset', body: 'Näitä ehtoja voidaan päivittää milloin tahansa. Sovelluksen jatkuva käyttö tarkoittaa hyväksyntää.' },
    { title: '6. Ota yhteyttä', body: 'Kysymyksiä tai huolenaiheita varten avaa ongelma GitHubissa tai ota suoraan yhteyttä osoitteeseen biblioteka@damiankokot.eu.' }
  ],
  sv: [
    { title: '1. Godkännande av villkor', body: 'Genom att ladda ner eller använda Biblioteka-appen godkänner du dessa villkor. Om du inte godkänner, vänligen avinstallera appen.' },
    { title: '2. Licens', body: 'Biblioteka är gratis programvara med öppen källkod distribuerad under MIT-licensen.' },
    { title: '3. Användning av appen', body: 'Appen tillhandahålls för personligt bruk. Du förbinder dig att inte missbruka appen.' },
    { title: '4. Ingen garanti', body: 'Appen tillhandahålls "i befintligt skick" utan några som helst garantier. Utvecklaren ansvarar inte för eventuell dataförlust.' },
    { title: '5. Ändringar', body: 'Dessa villkor kan uppdateras när som helst. Din fortsatta användning av appen efter ändringar utgör ditt godkännande.' },
    { title: '6. Kontakt', body: 'För frågor, vänligen öppna ett ärende på GitHub eller kontakta utvecklaren direkt på biblioteka@damiankokot.eu.' }
  ],
  no: [
    { title: '1. Aksept av vilkår', body: 'Ved å laste ned eller bruke Biblioteka-appen, godtar du disse vilkårene. Hvis du ikke er enig, vennligst avinstaller appen.' },
    { title: '2. Lisens', body: 'Biblioteka er gratis åpen kildekode programvare distribuert under MIT-lisensen.' },
    { title: '3. Bruk av appen', body: 'Appen er for personlig bruk. Du samtykker i å ikke misbruke appen.' },
    { title: '4. Ingen garanti', body: 'Appen leveres "som den er" uten noen form for garanti. Utvikleren er ikke ansvarlig for tap av data.' },
    { title: '5. Endringer', body: 'Disse vilkårene kan oppdateres når som helst. Fortsatt bruk forutsetter at vilkårene aksepteres.' },
    { title: '6. Kontakt', body: 'For spørsmål eller bekymringer, vennligst åpne et problem på GitHub eller kontakt biblioteka@damiankokot.eu.' }
  ],
  da: [
    { title: '1. Accept af vilkår', body: 'Ved at downloade eller bruge Biblioteka-appen accepterer du disse vilkår. Hvis du ikke er enig, skal du afinstallere appen.' },
    { title: '2. Licens', body: 'Biblioteka er gratis open source-software distribueret under MIT-licensen.' },
    { title: '3. Brug af appen', body: 'Appen stilles til rådighed til personlig brug. Du accepterer ikke at misbruge appen.' },
    { title: '4. Ingen garanti', body: 'Appen leveres "som den er" uden nogen form for garanti. Udvikleren er ikke ansvarlig for datatab.' },
    { title: '5. Ændringer', body: 'Disse vilkår kan blive opdateret. Fortsat brug indebærer accept.' },
    { title: '6. Kontakt', body: 'For spørgsmål, åbn venligst et problem på GitHub eller kontakt på biblioteka@damiankokot.eu.' }
  ],
  nl: [
    { title: '1. Acceptatie van Voorwaarden', body: 'Door Biblioteka te openen, ga je akkoord met deze voorwaarden. Verwijder de app als je niet akkoord gaat.' },
    { title: '2. Licentie', body: 'Biblioteka is gratis open-sourcesoftware onder de MIT-licentie.' },
    { title: '3. Gebruik van de App', body: 'Je mag deze software voor persoonlijke doeleinden gebruiken zonder proberen misbruik te maken.' },
    { title: '4. Geen Garantie', body: 'Biblioteka wordt verstrekt "zoals deze is" zonder enige garanties ten aanzien van gegevensbescherming.' },
    { title: '5. Wijzigingen', body: 'De voorwaarden kunnen worden herzien waardoor deze nieuwe regels overnemen.' },
    { title: '6. Contact', body: 'Voor resterende onduidelijkheden stuur een verzoek via GitHub en/of biblioteka@damiankokot.eu.' }
  ],
  lb: [
    { title: '1. Zoustëmmung vun de Konditiounen', body: 'Wann dir de Gebrauch vun däer Biblioteka App start, zitt dir iech déi festgeleet Regelen zou. Soss kënnt dir d\'App erofhuelen.' },
    { title: '2. Lizenz', body: 'All Code ënnerläit der ëffentlecher MIT Lizenz.' },
    { title: '3. Den Zweck vun der App', body: 'D\'Installatioun baséiert um richtege Gebrauch ouni eventuell de System unzegräifen.' },
    { title: '4. Keng Garantienëffentlechkeet', body: 'Et kann allzäit onvirgesi Feeler optrieden dofir garantéiert keen eng 100% Dateversëcherung.' },
    { title: '5. Verännerungen', body: 'All Ännerunge wäerten reegelméisseg iwwerschriwwe ginn.' },
    { title: '6. Kontaktinfo', body: 'Bei alle Froen an eventuelle Proposéierungen benoriichtegt de betraffene Kontakt biblioteka@damiankokot.eu.' }
  ],
  pt: [
    { title: '1. Aceitação dos Termos', body: 'Ao utilizar o Biblioteka, concorda com estes termos. Se não concordar, desinstale o aplicativo.' },
    { title: '2. Licença', body: 'O Biblioteka é um software de código aberto licenciado sobre as diretrizes do MIT.' },
    { title: '3. Utilização', body: 'Este software existe a penas destinado a tarefas e fins primariamente de característicos pessoais.' },
    { title: '4. Isenção de Garantia', body: 'Nós expressamente excluímos toda ou qualquer outra perda indevida de eventuais corrupções no código e sistemas.' },
    { title: '5. Modificações Adicionais', body: 'O uso estendido reafirma o acordo completo as modificáveis e correntes cláusulas.' },
    { title: '6. Suporte Direto', body: 'Contactos devem prosseguir através do GitHub, ou correios eletrónicos alternativos: biblioteka@damiankokot.eu' }
  ],
  it: [
    { title: '1. Accettazione Termini', body: 'Tramite l\'avvio dell\'app Biblioteka sei propenso ad approvare totalmente le procedure e normative.' },
    { title: '2. Licenza', body: 'La piattaforma open-source e gratuita Biblioteka rispetta ed è autorizzata via MIT.' },
    { title: '3. Linee Guida Operative', body: 'Ogni consumatore s\'incarica di agire adeguatamente usando il sistema con coerenza.' },
    { title: '4. Mancanza di Garanzie', body: 'La salvaguardia ed esistenza dati si trova completamente sotto la supervisione per ogni utilizzo utente remoto.' },
    { title: '5. Avvisi Ed Esecuzioni', body: 'Per via della continuità applicata ne seguirà un nuovo regolamento che verrà tacitamente esteso.' },
    { title: '6. Contatto', body: 'Rivolgiti immediatamente allo staff tramite l\'assistenza al biblioteka@damiankokot.eu.' }
  ],
  hr: [
    { title: '1. Prihvaćanje Uvjeta', body: 'Pri uporabi Biblioteka pristajete se i obvezujete pred trenutnim naputcima poslovanja.' },
    { title: '2. Licenciranje', body: 'Aplikacija Biblioteka prilaže open-source prava propisanim putem MIT licence.' },
    { title: '3. Sigurnost', body: 'Preuzimate opću pažnju za osobne operacije tako te spriječavamo daljnju provalu sistema.' },
    { title: '4. Odbrobljena Zaštita', body: 'Nema nikakvih čvrstih garancija ukoliko neočekivane pogreške rezultiraju gubitkom podataka aplikacije.' },
    { title: '5. Novi Dodaci', body: 'Na vrijeme promjene politike smatrajte kako je prihvaćeno novo i nadopunjeno izdanje pravila.' },
    { title: '6. Kontakti', body: 'Sve prijedloge isporučite put portala GitHub ili email dopisima direktnom proizvođaču.' }
  ],
  sk: [
    { title: '1. Akceptovanie Ustanovení', body: 'Otvorením alebo využitím služby Biblioteka plne súhlasíte s predchádzajúcimi dohodami a postupmi.' },
    { title: '2. Dostupná Licencia', body: 'Každá forma obsahu využíva otvorenú doménu v nadeľovanej MIT schéme bez zásadných blokád.' },
    { title: '3. Sústredenie Cielov', body: 'Vyjadruje osobné sústredenie snáh o zaznamenávania bez úmyselných zneuzivaní zložiek.' },
    { title: '4. Výlučenie Záruk', body: 'Spoločnosť je poistená voči strate i iných chybám bez predpisovania nápravných úkonov majiteľa.' },
    { title: '5. Zmene', body: 'Nepretržitosť práce automaticky prizvukuje stála prijímanie zmeneného kódu správania.' },
    { title: '6. Zastihnuteľnosť', body: 'Napíšete pre bližšie oboznámenie sa priamo email majiteľovi prostredníctvom biblioteka@damiankokot.eu.' }
  ],
  et: [
    { title: '1. Reeglistiku Järgimine', body: 'Allalahendusel nõustute sätestatud ja ametlikult heaks kiidetud regulatsioonidega.' },
    { title: '2. Litsents', body: 'Toimub pidev vabavaraline avalikustamine tunnustatud avara režiimi – MIT litsentsi aluspinnal.' },
    { title: '3. Otstarve', body: 'Programm pakutakse individuaalses perspektiivis lugemisaastate kaardistamise kergendamiseks.' },
    { title: '4. Hüvitamisest Loobumine', body: 'Keeldume kõikidest preitentsioonidest andmebaasi kadude puhuks mis ilmnevad iseseisvalt.' },
    { title: '5. Pidevad Täiendused', body: 'Soosime kõiki arenguid aga edasise sisselogimisega kehtestuvad ka potentsiaalselt uuned.' },
    { title: '6. Andmed Kujunemiseks', body: 'Edasiste lahenduste suunamiseks viige asjalugusid isiklikult arendajale biblioteka@damiankokot.eu.' }
  ],
  lv: [
    { title: '1. Līguma Ievērošana', body: 'Lejupielādējot tiešsaistes lietotnē, atkrīt citas šaubas atzīt platformas noteikto regulējumu.' },
    { title: '2. Licence', body: 'Visu pieejamo avota kodu apliecina autoritatīvā organizācija MIT saskaņā ar licensijas sistēmu.' },
    { title: '3. Lietotnes Funkcijas', body: 'Atbrīvo un ļauj pilnvērtīgi funkcionēt vienkāršos lietotāja un personas pieprasījumos.' },
    { title: '4. Zaudējumu Atsaukšana', body: 'Ja rodas tehnoloģiski neatgriezeniski bojājumi mēs neuzņemamies tālāku garantējošu rīcību dēļ klienta.' },
    { title: '5. Pilnveide', body: 'Veikti jebkādu jaunu korekciju virkne dod mājienu to spēka uzturēšanai bez jebkādiem izṇēmumiem.' },
    { title: '6. Tālāka Uzziņa', body: 'Visinteresējošiem uzaicinājumiem un neskaidrībām lūdzu raktīt tiešā veidā adresei e pastā biblioteka@damiankokot.eu.' }
  ],
  lt: [
    { title: '1. Naudojimosi Apibrėžtumas', body: 'Kai prisiimate laisvą produkto atisiuntimą taip prisiimate atitinkamus programinės įrangos standartus ir susitarimus.' },
    { title: '2. Laisva Apimtis', body: 'Teisiškai sureguliuotų reikalavimų sistemoje yra prieinamo naudojimo bazinė licenziją (MIT leidimas).' },
    { title: '3. Kasdieninis Naudojimas', body: 'Visa ši bazė kurta pačių jūsų paprasčiausių reikalavimų patenkinimams nepažeidžiant vientisumo ar sistemos pagrindų.' },
    { title: '4. Jokhio Padengties Suteikimo', body: 'Tokios apraškos neužtikrina visiško saugumo dingus pagrindinei duomienu atsarginei laikmenai.' },
    { title: '5. Adaptabilumas', body: 'Regimieji atnaujinimai laikomi sutartyje nebent naudotojas toliam išvengia jų esamos įgyvendinimo apimties.' },
    { title: '6. Kontaktinė Prieiga', body: 'Kiti teikti pasiūlymai GitHub domenyje arba susisiekite nurodytu adresu biblioteka@damiankokot.eu.' }
  ],
  bg: [
    { title: '1. Приемане на условията', body: 'Чрез използването на този софтуер се съгласявате да оперирате адекватно с данните.' },
    { title: '2. Лиценз', body: 'Платформата има изцяло отворен код споделян основно чрез придобития MIT стандарт.' },
    { title: '3. Управление', body: 'Всеки профил служи персонално в насока защита на основни потребителски търсения.' },
    { title: '4. Непокрити Задължения', body: 'Абсолютно никой съдружник не понася вина за понесени необратими кражби на архивни системи.' },
    { title: '5. Последващи Промени', body: 'Отбелязаният съгласител спомага за бързият преход при допълвания на тези точки занапред.' },
    { title: '6. Обратна Връзка', body: 'За коментари и попреправки разпратете вашите мнения до администраторите към GitHub и biblioteka@damiankokot.eu.' }
  ],
  tr: [
    { title: '1. Kullanım Sözleşmesi', body: 'Bu platform erişimi başlatan tüm bireyler belirtilen kuralı tüm hatlarıyla desteklemekten kendileri onaylı sayılacaktır.' },
    { title: '2. Lisans Durumu', body: 'Yalnız ve bütünüyle tam manasıyla MIT formatında yetkilendirilmesi bulunup o yolla ücretsiz şekillenir.' },
    { title: '3. Kullanım Amacı', body: 'Program genel itibarıyla kimsenin sistemi suistimal ve sömürü gerçekleştirmemesini gözetip denetlenmiştir.' },
    { title: '4. Veri Sorumluluk', body: 'Sunucudaki herhangi kalıcı hata ihtimalinde uygulamanın garantörü kesin surette mesul tutulamayacaktır.' },
    { title: '5. Ek Düzenlemeler', body: 'Var olduklarına ilaveten ekli kısımlara yönelik kullanımlara istinaden kurallar güncellemesi sürece uyarlanmış addedilir.' },
    { title: '6. Bağlantı Merkezi', body: 'Karşılaştığınız engeller olursa direkt yazar konumunda varılan e-postaya (biblioteka@damiankokot.eu) ya da GitHub sayfamızı deneyiniz.' }
  ],
  ko: [
    { title: '1. 기본 약관 준수', body: '이 프로그램을 활성화하여 이용할 시 위 서술한 정책을 바탕으로 일체의 합법적 조항에 동의함으로 처리됩니다.' },
    { title: '2. 소스 라이선스', body: '저희 프로젝트는 개방된 형태의 코드를 준수하는 MIT 라이선스 환경 내 제공이 인증된 결과물입니다.' },
    { title: '3. 정상적 활용 방향', body: '오픈 네트워크 기반인 만큼 개인 용도를 제외하고 시스템 남용 방지 체계 아래 서비스를 운영에 전하게 됩니다.' },
    { title: '4. 사고 및 피해 면책', body: '과실 및 서버 데이터 훼손 상태 시 관리자는 정보 보호 책임에서 일부 제외됨을 주의하세요.' },
    { title: '5. 최신화 정책', body: '미래 사용 시 자동으로 수정된 사안이 있을 경우 역시 해당 조율안이 반영됨을 기재합니다.' },
    { title: '6. 담당자 연락', body: '기타 여러 의문사항들을 풀기 위해서 즉각 GitHub 레포지토리를 참조하거나 이메일 메세지로 biblioteka@damiankokot.eu에 질문을 보내시기 바랍니다.' }
  ],
  ja: [
    { title: '1. 利用諸条件の受諾', body: 'この機能を利用する場合は以下に基づく要件に対して完全に承諾したものとみなさせていただきます。' },
    { title: '2. コードのライセンス', body: 'Bibliotekaの全ては正規のMITライセンス仕様により完全に無料で提供公開されているシステムです。' },
    { title: '3. アプリケーション用途', body: '個人的な範囲内の活動としての提供である故システムを不正に利用したり制限を改竄する行為は禁じられています。' },
    { title: '4. 責任無制限の表記', body: '本プログラムは現在の仕様にて随時稼働しますがユーザーが不意のデータ喪失被害に遭った場合でも製作者負担は免除されます。' },
    { title: '5. 追加更新', body: 'システムに準じて規約自体も都度対応修正されるため常に新しいバージョンを使用することで全内容遵守としています。' },
    { title: '6. お客様窓口', body: 'ご不満の意見あるいは追加のご希望に関してはGitHubの課題発行ページか直接のメール連絡biblioteka@damiankokot.euをご利用ください。' }
  ],
  is: [
    { title: '1. Samþykki skilmála', body: 'Notkun okkar upplýsingakerfis gengur því í augu að nýta og virkja framantalin grundvallaratriði staðalsins.' },
    { title: '2. Hugbúnaðarleyfi', body: 'Alþjóðlegt dreifingarkerfi byggt undir skilyrðum frá samspila opnum kerfum (MIT leyfinu).' },
    { title: '3. Meðhöndlun Hugbúnaðarins', body: 'Þjónustan snertir af stærstu leyti þegna einstakra hluta notendasvæðis í samvinnu með að koma í veg fyrir skemmdir eða svik.' },
    { title: '4. Undanskilið ábyrgð', body: 'Með öllu undanskilum framleiðanda á öllum og hvaða skaða á týndum tölvugögnum sem er af orsök notands hugbúnaðarins.' },
    { title: '5. Breytingar', body: 'Þeir sem nota appið án viðbragða við seinni breytingar á uppfærslum af regluverkum skulu lítið á vera samþykkjendur þess sama.' },
    { title: '6. Tölvupóstur Framleiðanda', body: 'Aðrir vafalítil málefnin sendist áfram í snertingu til biblioteka@damiankokot.eu eða sjá tæknisvið Github.' }
  ],
  kl: [
    { title: '1. Piumasaqaatit', body: 'Atortussat ilanngullugit pilerinnaq namminersorlutit tapersersornartippat qaqutigooraluarit tulluarpoq.' },
    { title: '2. Akuersissut', body: 'Ilasoq Biblioteka ilisimasat najoqqutassat ilisimasat MIT akuersissummik ilanngunneqarpoq.' },
    { title: '3. Atuinera', body: 'Utoqqat malittarisaliortaat sulisoq unioqqutinngillat nalinginnaasumi atorneqassasoq isumaqatigiiffeqarpugut.' },
    { title: '4. Pitsaanngitsut', body: 'Applikationimit naggataatigut akisussaassuseqanngilagut datanut ilisimatitsilluni ajornartorsiutinut.' },
    { title: '5. Allortariikkut', body: 'Malittarisassat immikkoortut allannguuteqarnerit atuuttuumatillugit atornera pisarsimasumut atuaqqullugu neriorsugaq.' },
    { title: '6. Allattoqarfik', body: 'Immikkoortitsinermut tunngasut Github atorneqassappata iserluaruk imaluunniit nalilersukkat biblioteka@damiankokot.eu atorlugu ujartuisi.' }
  ]
};

// Injection function
function injectObjectKV(name, srcObj, content) {
    const rx = new RegExp(`const ${name}: [^{]*{`);
    const match = content.match(rx);
    if (!match) return content;
    
    let lines = content.split('\n');
    let idx = -1;
    for (let i=0; i<lines.length; i++) {
        if (lines[i].includes(`const ${name}: `)) {
            idx = i;
            break;
        }
    }
    
    if (idx === -1) return content;
    
    // Find the end of this object definition
    let endIdx = idx;
    let braceCount = 0;
    let foundStart = false;
    for (let i = idx; i < lines.length; i++) {
        let l = lines[i];
        if (l.includes('{')) {
            braceCount += (l.match(/\{/g) || []).length;
            foundStart = true;
        }
        if (l.includes('}')) {
            braceCount -= (l.match(/\}/g) || []).length;
        }
        if (foundStart && braceCount === 0) {
            endIdx = i;
            break;
        }
    }
    // Now we can stringify srcObj and replace lines
    // Wait, the easiest way is to use regex replacement on the whole object if possible, but we don't want to mess up types.
    // The previous languages are already there in the file. We just need to add new ones.
    
    let endObjBlockLine = endIdx - 1; 
    let strToAdd = '';
    for (const [lang, val] of Object.entries(srcObj)) {
        strToAdd += `  ${lang}: ${JSON.stringify(val)},\n`;
    }
    
    lines.splice(endObjBlockLine + 1, 0, strToAdd);
    return lines.join('\n');
}

smContent = injectObjectKV('LAST_UPDATED', lastUpdated, smContent);
smContent = injectObjectKV('PRIVACY_DISCLAIMER', privacyDisclaimer, smContent);
smContent = injectObjectKV('PRIVACY_ITEMS', privacyItems, smContent);
smContent = injectObjectKV('TERMS_ITEMS', termsItems, smContent);

fs.writeFileSync(settingsModalPath, smContent);
