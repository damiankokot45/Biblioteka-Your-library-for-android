import React, { useRef, useState } from "react";
import {
  X,
  Check,
  Download,
  Upload,
  Github,
  Palette,
  Globe,
  Trash2,
  Info,
  User,
  Code,
  Disc,
  ArrowLeft,
  Mail,
  Bug,
  AppWindow,
  FileText,
  ChevronRight,
  Monitor,
  Sun,
  Moon,
  BookOpen,
} from "lucide-react";
import {
  UserSettings,
  AppThemeMode,
  AppColorTheme,
  Book,
  Language,
} from "../types";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "../lib/i18n";

interface SettingsModalProps {
  settings: UserSettings;
  onChange: (settings: UserSettings) => void;
  onClose: () => void;
  books: Book[];
  onImport: (books: Book[]) => void;
  onClearAllData: () => void;
}

const COLOR_OPTIONS: { value: AppColorTheme; label: string }[] = [
  { value: "#10B981", label: "Szmaragdowy" },
  { value: "#3B82F6", label: "Niebieski" },
  { value: "#8B5CF6", label: "Fioletowy" },
  { value: "#EC4899", label: "Różowy" },
  { value: "#F59E0B", label: "Bursztynowy" },
  { value: "#84CC16", label: "Limonkowy" },
  { value: "#06B6D4", label: "Cyjan" },
  { value: "#64748B", label: "Łupek" },
  { value: "#795548", label: "Brązowy" },
  { value: "#EF4444", label: "Czerwony" },
  { value: "#F97316", label: "Pomarańczowy" },
  { value: "#14B8A6", label: "Morski" },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "pl", label: "Polski" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "es", label: "Español" },
  { value: "hu", label: "Magyar" },
  { value: "ro", label: "Română" },
  { value: "cs", label: "Čeština" },
  { value: "fi", label: "Suomi" },
  { value: "sv", label: "Svenska" },
  { value: "no", label: "Norsk" },
  { value: "da", label: "Dansk" },
  { value: "nl", label: "Nederlands" },
  { value: "lb", label: "Lëtzebuergesch" },
  { value: "pt", label: "Português" },
  { value: "it", label: "Italiano" },
  { value: "hr", label: "Hrvatski" },
  { value: "sk", label: "Slovenčina" },
  { value: "et", label: "Eesti" },
  { value: "lv", label: "Latviešu" },
  { value: "lt", label: "Lietuvių" },
  { value: "bg", label: "Български" },
  { value: "tr", label: "Türkçe" },
  { value: "ko", label: "한국어" },
  { value: "ja", label: "日本語" },
  { value: "is", label: "Íslenska" },
  { value: "kl", label: "Kalaallisut" },
  { value: "sl", label: "Slovenščina" },
  { value: "el", label: "Ελληνικά" }
];

function SettingItem({
  icon: Icon,
  title,
  subtitle,
  onClick,
  rightElement,
  className = "",
  textColor = "text-on-surface",
  iconColor = "text-primary",
  iconBg = "bg-primary/20",
  hideArrow = false,
}: any) {
  return (
    <div
      className={`flex items-center gap-4 py-3 px-2 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div
        className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center shrink-0`}
      >
        <Icon className={`w-[22px] h-[22px] ${iconColor}`} />
      </div>
      <div className="flex flex-col flex-1 pb-1">
        <span
          className={`${textColor} text-[1.1rem] font-medium leading-tight`}
        >
          {title}
        </span>
        {subtitle && (
          <span
            className={`${
              textColor === "text-error"
                ? "text-error/80"
                : "text-on-surface-variant"
            } text-[0.9rem] font-medium mt-0.5`}
          >
            {subtitle}
          </span>
        )}
      </div>
      {rightElement}
      {!rightElement && onClick && !hideArrow && (
        <ChevronRight className="w-5 h-5 text-on-surface-variant/50 group-hover:text-on-surface-variant transition-colors" />
      )}
    </div>
  );
}

type SettingsScreen =
  | "MAIN"
  | "APPEARANCE"
  | "LANGUAGE"
  | "BACKUP"
  | "ABOUT"
  | "THIRD_PARTY_LICENSES"
  | "TERMS_CONDITIONS"
  | "PRIVACY_POLICY";

const SCREEN_PARENT: Partial<Record<SettingsScreen, SettingsScreen>> = {
  APPEARANCE: "MAIN",
  LANGUAGE: "MAIN",
  BACKUP: "MAIN",
  ABOUT: "MAIN",
  THIRD_PARTY_LICENSES: "ABOUT",
  TERMS_CONDITIONS: "ABOUT",
  PRIVACY_POLICY: "ABOUT",
};

const LAST_UPDATED: Record<string, string> = {
  en: "Last updated: May 2026",
  pl: "Ostatnia aktualizacja: maj 2026",
  fr: "Dernière mise à jour : mai 2026",
  de: "Zuletzt aktualisiert: Mai 2026",
  es: "Última actualización: mayo 2026",
  hu: "Utolsó frissítés: 2026. május",
  ro: "Ultima actualizare: mai 2026",
  cs: "Poslední aktualizace: květen 2026",
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
  kl: "Kingullermik nutarterpoq: Maaji 2026",

  sl: "Nazadnje posodobljeno: maj 2026",
  el: "Τελευταία ενημέρωση: Μάιος 2026",

};

const PRIVACY_DISCLAIMER: Record<string, { title: string; body: string }> = {
  en: {
    title: "Your data stays on your device.",
    body: "Biblioteka does not collect, transmit, or sell any personal data.",
  },
  pl: {
    title: "Twoje dane pozostają na urządzeniu.",
    body: "Biblioteka nie zbiera, nie przesyła ani nie sprzedaje żadnych danych osobowych.",
  },
  fr: {
    title: "Vos données restent sur votre appareil.",
    body: "Biblioteka ne collecte, ne transmet et ne vend aucune donnée personnelle.",
  },
  de: {
    title: "Ihre Daten bleiben auf Ihrem Gerät.",
    body: "Biblioteka sammelt, überträgt oder verkauft keine persönlichen Daten.",
  },
  es: {
    title: "Tus datos se quedan en tu dispositivo.",
    body: "Biblioteka no recopila, transmite ni vende ningún dato personal.",
  },
  hu: {
    title: "Adataid az eszközödön maradnak.",
    body: "A Biblioteka nem gyűjt, nem továbbít és nem ad el semmilyen személyes adatot.",
  },
  ro: {
    title: "Datele tale rămân pe dispozitivul tău.",
    body: "Biblioteka nu colectează, nu transmite și nu vinde date personale.",
  },
  cs: {
    title: "Vaše data zůstávají ve vašem zařízení.",
    body: "Biblioteka neshromažďuje, nepřenáší ani neprodává žádné osobní údaje.",
  },
  fi: {"title":"Tietosi pysyvät laitteellasi.","body":"Biblioteka ei kerää, siirrä tai myy henkilökohtaisia ​​tietoja."},
  sv: {"title":"Dina data stannar på din enhet.","body":"Biblioteka samlar inte in, överför eller säljer några personuppgifter."},
  no: {"title":"Dataene dine forblir på enheten din.","body":"Biblioteka samler ikke inn, overfører eller selger noen personopplysninger."},
  da: {"title":"Dine data forbliver på din enhed.","body":"Biblioteka indsamler, overfører eller sælger ikke nogen personlige data."},
  nl: {"title":"Je gegevens blijven op je apparaat.","body":"Biblioteka verzamelt, verzendt of verkoopt geen persoonlijke gegevens."},
  lb: {"title":"Är Daten bleiwen op ärem Apparat.","body":"Biblioteka sammelt, iwwerdréit oder verkeeft keng perséinlech Daten."},
  pt: {"title":"Os seus dados permanecem no seu dispositivo.","body":"O Biblioteka não recolhe, transmite ou vende quaisquer dados pessoais."},
  it: {"title":"I tuoi dati rimangono sul tuo dispositivo.","body":"Biblioteka non raccoglie, trasmette o vende alcun dato personale."},
  hr: {"title":"Vaši podaci ostaju na vašem uređaju.","body":"Biblioteka ne prikuplja, prenosi ili prodaje bilo kakve osobne podatke."},
  sk: {"title":"Vaše údaje zostávajú na vašom zariadení.","body":"Biblioteka nezhromažďuje, neprenáša ani nepredáva žiadne osobné údaje."},
  et: {"title":"Teie andmed jäävad teie seadmesse.","body":"Biblioteka ei kogu, edasta ega müü isikuandmeid."},
  lv: {"title":"Jūsu dati paliek jūsu ierīcē.","body":"Biblioteka nevāc, nepārsūta un nepārdod nekādus personas datus."},
  lt: {"title":"Jūsų duomenys lieka jūsų įrenginyje.","body":"Biblioteka nerenka, neperduoda ir neparduoda jokių asmeninių duomenų."},
  bg: {"title":"Вашите данни остават на вашето устройство.","body":"Biblioteka не събира, не предава и не продава лични данни."},
  tr: {"title":"Verileriniz cihazınızda kalır.","body":"Biblioteka kişisel verileri toplamaz, iletmez veya satmaz."},
  ko: {"title":"데이터는 기기에 보관됩니다.","body":"Biblioteka는 개인 데이터를 수집, 전송 또는 판매하지 않습니다."},
  ja: {"title":"データはデバイスに保存されます。","body":"Bibliotekaは個人データを収集、送信、販売することはありません。"},
  is: {"title":"Gögnin þín eru áfram á tækinu þínu.","body":"Biblioteka safnar hvorki, sendir né selur persónuupplýsingar."},
  kl: {"title":"Paasissutissat qarasaasiarmiigaapput.","body":"Biblioteka inummut tunngasunik katersinngilaq, tunniussinngilaq imaluunniit tunisineranngilaq."},

  sl: {"title":"Vaši podatki ostanejo na vaši napravi.","body":"Biblioteka ne zbira, ne prenaša in ne prodaja nobenih osebnih podatkov."},
  el: {"title":"Τα δεδομένα παραμένουν στη συσκευή σας.","body":"Η Biblioteka δεν συλλέγει, δεν μεταδίδει και δεν πουλά προσωπικά δεδομένα."},

};

const PRIVACY_ITEMS: Record<string, { title: string; body: string }[]> = {
  en: [
    {
      title: "Data Storage",
      body: "All your books, notes, and settings are stored exclusively on your device using local storage or the device's local filesystem. No account is required.",
    },
    {
      title: "No Analytics or Tracking",
      body: "We do not use any analytics services, crash reporters, or advertising SDKs.",
    },
    {
      title: "Permissions",
      body: "Biblioteka does not request any runtime Android permission. Backups are written to the app's private cache and shared only when you explicitly tap Share.",
    },
    {
      title: "Open Source",
      body: "Biblioteka is fully open source. You can inspect all code on GitHub to verify these claims.",
    },
    {
      title: "Contact",
      body: "Privacy questions? Open an issue on GitHub or contact the developer directly at biblioteka@damiankokot.eu.",
    },
  ],
  pl: [
    {
      title: "Przechowywanie danych",
      body: "Wszystkie Twoje książki, notatki i ustawienia są przechowywane wyłącznie na Twoim urządzeniu. Konto nie jest wymagane.",
    },
    {
      title: "Brak analityki i śledzenia",
      body: "Nie korzystamy z żadnych usług analitycznych, raportowania błędów ani pakietów reklamowych.",
    },
    {
      title: "Uprawnienia",
      body: "Biblioteka nie wymaga żadnych uprawnień systemowych w czasie działania. Kopie zapasowe są zapisywane w prywatnej pamięci podręcznej aplikacji i udostępniane tylko po wyraźnym naciśnięciu przycisku Udostępnij.",
    },
    {
      title: "Open Source",
      body: "Biblioteka jest w pełni oprogramowaniem open source. Możesz sprawdzić kod źródłowy na GitHubie, aby zweryfikować te informacje.",
    },
    {
      title: "Kontakt",
      body: "Masz pytania o prywatność? Zgłoś problem w serwisie GitHub lub skontaktuj się bezpośrednio z twórcą pod adresem biblioteka@damiankokot.eu.",
    },
  ],
  fr: [
    {
      title: "Stockage des données",
      body: "Tous vos livres, notes et paramètres sont stockés exclusivement sur votre appareil. Aucun compte n'est requis.",
    },
    {
      title: "Aucune analyse ni suivi",
      body: "Nous n'utilisons aucun service d'analyse, rapporteur de plantage ou SDK publicitaire.",
    },
    {
      title: "Autorisations",
      body: "Biblioteka ne demande aucune autorisation Android à l'exécution. Les sauvegardes sont écrites dans le cache privé de l'application et partagées uniquement lorsque vous appuyez explicitement sur Partager.",
    },
    {
      title: "Open Source",
      body: "Biblioteka est entièrement open source. Vous pouvez inspecter tout le code sur GitHub pour vérifier ces affirmations.",
    },
    {
      title: "Contact",
      body: "Des questions sur la confidentialité ? Signalez un problème sur GitHub ou contactez directement le développeur à l'adresse biblioteka@damiankokot.eu.",
    },
  ],
  de: [
    {
      title: "Datenspeicherung",
      body: "Alle Ihre Bücher, Notizen und Einstellungen werden ausschließlich auf Ihrem Gerät gespeichert. Es ist kein Konto erforderlich.",
    },
    {
      title: "Keine Analysen oder Tracking",
      body: "Wir verwenden keine Analysedienste, Absturzmelder oder Werbe-SDKs.",
    },
    {
      title: "Berechtigungen",
      body: "Biblioteka fordert keine Android-Laufzeitberechtigung an. Sicherungen werden in den privaten Cache der App geschrieben und nur geteilt, wenn Sie explizit auf Teilen tippen.",
    },
    {
      title: "Open Source",
      body: "Biblioteka ist vollständig quelloffen. Sie können den gesamten Code auf GitHub überprüfen, um diese Angaben zu verifizieren.",
    },
    {
      title: "Kontakt",
      body: "Fragen zum Datenschutz? Melden Sie ein Problem auf GitHub oder kontaktieren Sie den Entwickler direkt unter biblioteka@damiankokot.eu.",
    },
  ],
  es: [
    {
      title: "Almacenamiento de datos",
      body: "Todos tus libros, notas y configuraciones se almacenan exclusivamente en tu dispositivo. No se requiere ninguna cuenta.",
    },
    {
      title: "Sin análisis ni seguimiento",
      body: "No utilizamos ningún servicio de análisis, informes de errores ni SDKs de publicidad.",
    },
    {
      title: "Permisos",
      body: "Biblioteka no solicita ningún permiso de Android en tiempo de ejecución. Las copias de seguridad se escriben en la caché privada de la aplicación y se comparten solo cuando tocas Compartir explícitamente.",
    },
    {
      title: "Código abierto",
      body: "Biblioteka es completamente de código abierto. Puedes inspeccionar todo el código en GitHub para verificar estas afirmaciones.",
    },
    {
      title: "Contacto",
      body: "¿Preguntas sobre privacidad? Abre un issue en GitHub o contacta al desarrollador directamente en biblioteka@damiankokot.eu.",
    },
  ],
  hu: [
    {
      title: "Adattárolás",
      body: "Minden könyv, jegyzet és beállítás kizárólag az Ön eszközén tárolódik. Fiók létrehozása nem szükséges.",
    },
    {
      title: "Nincs analitika vagy nyomon követés",
      body: "Nem használunk analitikai szolgáltatásokat, hibajelentőket vagy reklám SDK-kat.",
    },
    {
      title: "Engedélyek",
      body: "A Biblioteka nem kér futásidejű Android-engedélyeket. A biztonsági másolatok az alkalmazás privát gyorsítótárába kerülnek, és csak a Megosztás gomb explicit megérintésekor kerülnek megosztásra.",
    },
    {
      title: "Nyílt forráskód",
      body: "A Biblioteka teljesen nyílt forráskódú. Bármikor átvizsgálhatja a kódot a GitHubon ezen állítások ellenőrzéséhez.",
    },
    {
      title: "Kapcsolat",
      body: "Kérdése van az adatvédelemmel kapcsolatban? Nyisson egy hibajegyet a GitHubon, vagy lépjen kapcsolatba közvetlenül a fejlesztővel: biblioteka@damiankokot.eu.",
    },
  ],
  ro: [
    {
      title: "Stocarea datelor",
      body: "Toate cărțile, notițele și setările tale sunt stocate exclusiv pe dispozitivul tău. Nu este necesar un cont.",
    },
    {
      title: "Fără analitice sau urmărire",
      body: "Nu folosim servicii de analiză, raportoare de blocaje sau SDK-uri de publicitate.",
    },
    {
      title: "Permisiuni",
      body: "Biblioteka nu solicită nicio permisiune Android în timp de rulare. Copiile de rezervă sunt scrise în memoria cache privată a aplicației și partajate doar când atingeți explicit Partajare.",
    },
    {
      title: "Sursă deschisă",
      body: "Biblioteka este complet open source. Poți inspecta tot codul pe GitHub pentru a verifica aceste afirmații.",
    },
    {
      title: "Contact",
      body: "Întrebări despre confidențialitate? Deschide o problemă pe GitHub sau contactează direct dezvoltatorul la biblioteka@damiankokot.eu.",
    },
  ],
  cs: [
    {
      title: "Ukládání dat",
      body: "Všechny vaše knihy, poznámky a nastavení jsou uloženy výhradně ve vašem zařízení. Není vyžadován žádný účet.",
    },
    {
      title: "Žádná analytika ani sledování",
      body: "Nepoužíváme žádné analytické služby, hlášení pádů ani reklamní sady SDK.",
    },
    {
      title: "Oprávnění",
      body: "Biblioteka nevyžaduje žádná oprávnění Android za běhu. Zálohy jsou zapsány do soukromé mezipaměti aplikace a sdíleny pouze tehdy, když explicitně klepnete na Sdílet.",
    },
    {
      title: "Otevřený zdrojový kód",
      body: "Biblioteka je plně open source. Veškerý kód můžete zkontrolovat na GitHubu.",
    },
    {
      title: "Kontakt",
      body: "Máte dotazy ohledně ochrany osobních údajů? Otevřete problém na GitHubu nebo kontaktujte přímo vývojáře na biblioteka@damiankokot.eu.",
    },
  ],
  fi: [{"title":"Tietojen varastointi","body":"Kaikki kirjasi, muistiinpanosi ja asetuksesi tallennetaan yksinomaan laitteellesi. Tiliä ei tarvita."},{"title":"Ei analytiikkaa tai seurantaa","body":"Emme käytä mitään analytiikkapalveluita, kaatumisraportoijia tai mainos-SDK:ita."},{"title":"Käyttöoikeudet","body":"Biblioteka ei pyydä Android-suoritusaikaisia käyttöoikeuksia. Varmuuskopiot kirjoitetaan sovelluksen yksityiseen välimuistiin ja jaetaan vain kun napautat Jaa-painiketta."},{"title":"Avoin lähdekoodi","body":"Biblioteka on täysin avoimen lähdekoodin. Voit tarkastaa kaiken koodin GitHubissa näiden väitteiden vahvistamiseksi."},{"title":"Ota yhteyttä","body":"Tietosuojaa koskevia kysymyksiä? Avaa ongelma GitHubissa tai ota yhteyttä suoraan kehittäjään osoitteessa biblioteka@damiankokot.eu."}],
  sv: [{"title":"Datalagring","body":"Alla dina böcker, anteckningar och inställningar sparas exklusivt på din enhet. Inget konto krävs."},{"title":"Ingen analys eller spårning","body":"Vi använder inga analystjänster, kraschrapporterare eller annons-SDK:er."},{"title":"Behörigheter","body":"Biblioteka begär inga Android-körtidsbehörigheter. Säkerhetskopior skrivs till appens privata cache och delas bara när du uttryckligen trycker på Dela."},{"title":"Öppen källkod","body":"Biblioteka är helt öppen källkod. Du kan granska all kod på GitHub för att bekräfta dessa påståenden."},{"title":"Kontakt","body":"Frågor om integritet? Öppna ett ärende på GitHub eller kontakta utvecklaren direkt på biblioteka@damiankokot.eu."}],
  no: [{"title":"Datalagring","body":"Alle bøkene, notatene og innstillingene dine lagres utelukkende på enheten din. Ingen konto kreves."},{"title":"Ingen analyse eller sporing","body":"Vi bruker ikke  analysetjenester, krasjrapporterere eller annonse-SDK-er."},{"title":"Tillatelser","body":"Biblioteka ber ikke om noen Android-kjøretidstillatelser. Sikkerhetskopier skrives til appens private cache og deles kun når du eksplisitt trykker Del."},{"title":"Åpen kildekode","body":"Biblioteka er fullstendig åpen kildekode. Du kan inspisere all kode på GitHub for å bekrefte disse påstandene."},{"title":"Kontakt","body":"Personvernspørsmål? Åpne et problem på GitHub eller kontakt utvikleren direkte på biblioteka@damiankokot.eu."}],
  da: [{"title":"Datalagring","body":"Alle dine bøger, noter og indstillinger gemmes udelukkende på din enhed. Ingen konto er påkrævet."},{"title":"Ingen analyse eller sporing","body":"Vi bruger ingen analysetjenester, crashrapporterere eller annonce-SDK'er."},{"title":"Tilladelser","body":"Biblioteka anmoder ikke om nogen Android-køretidstilladelser. Sikkerhedskopier skrives til appens private cache og deles kun, når du eksplicit trykker på Del."},{"title":"Open Source","body":"Biblioteka er fuldstændig open source. Du kan inspicere al kode på GitHub for at bekræfte disse påstande."},{"title":"Kontakt","body":"Har du spørgsmål om privatliv? Åbn et problem på GitHub eller kontakt udvikleren direkte på biblioteka@damiankokot.eu."}],
  nl: [{"title":"Gegevensopslag","body":"Al je boeken, notities en instellingen worden exclusief op je apparaat opgeslagen. Geen account vereist."},{"title":"Geen analytics of tracking","body":"We gebruiken geen analysediensten, crashrapporteurs of advertentie-SDK's."},{"title":"Machtigingen","body":"Biblioteka vraagt geen Android-runtime-rechten. Back-ups worden naar de privécache van de app geschreven en alleen gedeeld als u expliciet op Delen tikt."},{"title":"Open Source","body":"Biblioteka is volledig open source. Je kunt alle code inspecteren op GitHub om deze claims te verifiëren."},{"title":"Contact","body":"Vragen over privacy? Open een probleem op GitHub of neem rechtstreeks contact op met de ontwikkelaar via biblioteka@damiankokot.eu."}],
  lb: [{"title":"Datespäicherung","body":"All ärt Bicher, Notizen, ans Astellungen sinn just op ärem Apparat respektiv gespäichert. Et ass keen Kont néideg."},{"title":"Keng Analyse oder Tracking","body":"Mir benotze keng Analyseservicer, Crash Reporter oder Reklammen SDK'en."},{"title":"Berechtegungen","body":"Op Android freet d'App vläicht no Späicherrechter fir Backups. Déi ginn just fir den ugekënnegten Zweck benotzt."},{"title":"Open Source","body":"Biblioteka ass komplett Open Source. Dir kënnt de ganze Code op GitHub nokucken, fir dëst ze verifièren."},{"title":"Kontakt","body":"Privatsphär Froen? Erstellt en Issue am GitHub oder kontaktéiert den Entwéckler direk op biblioteka@damiankokot.eu."}],
  pt: [{"title":"Armazenamento de Dados","body":"Todos os seus livros, notas e configurações são armazenados exclusivamente no seu dispositivo. Nenhuma conta é exigida."},{"title":"Sem Análise ou Rastreamento","body":"Não usamos serviços de análise, repórteres de falhas ou SDKs de publicidade."},{"title":"Permissões","body":"O Biblioteka não solicita permissões de tempo de execução no Android. As cópias de segurança são escritas na cache privada da aplicação e partilhadas apenas quando toca explicitamente em Partilhar."},{"title":"Código aberto","body":"O Biblioteka é totalmente de código aberto. Pode inspecionar todo o código no GitHub para verificar essas informações."},{"title":"Contacto","body":"Dúvidas sobre privacidade? Abra um problema no GitHub ou contacte o programador diretamente em biblioteka@damiankokot.eu."}],
  it: [{"title":"Archiviazione dati","body":"Tutti i tuoi libri, appunti e le impostazioni sono archiviati esclusivamente sul tuo dispositivo. Nessun account richiesto."},{"title":"Nessuna analisi o tracciamento","body":"Non utilizziamo servizi di analisi, report degli arresti anomali o SDK pubblicitari."},{"title":"Autorizzazioni","body":"Biblioteka non richiede alcuna autorizzazione Android in fase di esecuzione. I backup vengono scritti nella cache privata dell'app e condivisi solo quando si tocca esplicitamente Condividi."},{"title":"Open Source","body":"Biblioteka è completamente open source. Puoi ispezionare tutto il codice su GitHub per verificare."},{"title":"Contatto","body":"Domande sulla privacy? Apri un problema su GitHub o contatta direttamente lo sviluppatore all'indirizzo biblioteka@damiankokot.eu."}],
  hr: [{"title":"Skladištenje podataka","body":"Sve tvoje knjige, bilješke i postavke spremaju se isključivo na uređaj. Nema potrebe za otvaranjem računa."},{"title":"Bez praćenja i analitike","body":"Ne koristimo nikakve usluge dubinske analize, sustave prijave problema ili SDK-ove za oglase."},{"title":"Dozvol","body":"Biblioteka ne traži nikakve Android dozvole za izvođenje. Sigurnosne kopije se zapisuju u privatnu predmemoriju aplikacije i dijele se samo kada izričito dodirnete Dijeli."},{"title":"Softver otvorenog koda","body":"Biblioteka je aplikacija otvorenog koda. Sav je kôd objavljen na GitHubu radi potpune transparentnosti."},{"title":"Kontakt","body":"Pitanja o privatnosti? Prijavite ih na GitHubu ili kontaktirajte autora na biblioteka@damiankokot.eu."}],
  sk: [{"title":"Úložisko Dát","body":"Všetky Vaše knihy, poznámky a nastavenia sú uložené len vo Vašom zariadení. Nevyžaduje sa vytvorenie účtu."},{"title":"Žiadna Analytika Bez Zberu Dát","body":"Nevyužívame nijaké analytické služby, programy hlásenia pádov ani inzerujúce platformy."},{"title":"Prístupové práva","body":"Biblioteka nevyžaduje žiadne Android oprávnenia za behu. Zálohy sú zapísané do súkromnej vyrovnávacej pamäte aplikácie a zdieľané len keď explicitne klepnete na Zdieľať."},{"title":"Open Source","body":"Biblioteka je kompletne open-source systém. Všetky detaily si môžete otestovať priamo na GitHub-e a preveriť si tak spoľahlivosť."},{"title":"Kontakt","body":"Máte neikaké otázky týkajúce sa súkromia? Otvorte diskusiu na platforme GitHub alebo kontaktujte autora priamo na biblioteka@damiankokot.eu."}],
  et: [{"title":"Andmesalvestus","body":"Kõiki teie raamatuid, märkmeid ja eelistusi säilitatakse vaid seadme mälus. Mingit kontot pole vaja."},{"title":"Jälgimine ega analüüsid puuduvad","body":"Meie ei kasuta analüüsivahendeid, krahhi raporteerimist ega ka reklaamide tarkvaraarenduskomplekti."},{"title":"Load","body":"Biblioteka ei nõua ühtegi Android käitusaegsete õiguste. Varukoopiad kirjutatakse rakenduse privaatsesse vahemällu ja jagatakse ainult siis, kui puudutate selgesõnaliselt Jaga."},{"title":"Avatud Lähtekood","body":"Biblioteka kasutab läbinisti avatud lähtekoodiga lahendusi. Kõike on võimalik Github keskkonnast üle kaeda ning meie aususes veenduda."},{"title":"Kontakt","body":"Tekkis küsimusi isikuandmete ja privaatsuse kohta? Jätke küsimus Github keskkonda või kontakteeruge loojaga aadressil biblioteka@damiankokot.eu."}],
  lv: [{"title":"Datu Glabāšana","body":"Visām jūsu grāmatām, piezīmēm un iestatījumiem jāglabājas vienīgi jūsu iekārtā. Lietotāja profila nav."},{"title":"Nekādas Analītikas Un Izsekošanas","body":"Mēs neizmantojam analītiskos pakalpojumus, defektu identificēšanas sistēmas vai mārketinga rīkus."},{"title":"Piekļuves Cēloņi","body":"Biblioteka nepieprasa nekādas Android izpildlaika atļaujas. Dublējumi tiek rakstīti lietotnes privātajā kešatmiņā un kopīgoti tikai tad, kad skaidri pieskaraties Kopīgot."},{"title":"Atvērtā koda programma","body":"Biblioteka programmēšanai izmantots vien atvērtais kods. Dodieties uz GitHub resursu, lai patiesi pārliecinātos par doto faktu."},{"title":"Kontaktinformācija","body":"Jums rodas kādi jautājumus saistībā par doto drošību? Atverat tiketu portālā GitHub vai sazinieties tieši ar pārvaldītāju epastā: biblioteka@damiankokot.eu."}],
  lt: [{"title":"DuomenųSaugykla","body":"Visos knygos, užrašai ir kiti sistemos nustatymai saugomi tiesiog jūsų naudojamame prietaise. Papildoma paskyra tikrai nėra būtina."},{"title":"SekimoIr Analizės Negalimumas","body":"Mes neužsiimame analitika paremta veikla ir nenaudojame tam skirtų programų asmeninio naudojimo labui."},{"title":"Leidimai","body":"Biblioteka nereikalauja jokių Android vykdymo laiko leidimų. Atsarginės kopijos rašomos į privačią programėlės talpyklą ir dalijamasi tik tada, kai aiškiai paliečiate Dalintis."},{"title":"Atviras Kodas","body":"Biblioteka – tai tik atvirojo kodo pagrindu sukurtas produktas. Visi originalus sistemos parametrai egzistuoja atvira prieiga prieinamoje sistemoje, vadinamoje GitHub."},{"title":"Susisiekti","body":"Iškilus skubiems pranešimams apsilankykite GitHub ar išsiuskite informacinį laišką per paštą biblioteka@damiankokot.eu."}],
  bg: [{"title":"Съхранение на информация","body":"Всички книги, бележки и допълнителни настройки са архивирани във вашето устройство. Не е необходима допълнителна регистрация."},{"title":"Липса на следене или аналитика","body":"Приложението е освободено от спомагателни програми с анализаторски и други подобни функции."},{"title":"Достъп","body":"Biblioteka не изисква никакви Android разрешения по време на изпълнение. Резервните копия се записват в частния кеш на приложението и се споделят само когато изрично натиснете Споделяне."},{"title":"Разработен с отворен код","body":"Biblioteka функционира главно чрез отворен код. Можете да прегледате файловете в GitHub."},{"title":"Контакти","body":"Намерете отговор на вашите въпроси или ни потърсете директно на: biblioteka@damiankokot.eu."}],
  tr: [{"title":"Veri Depolama","body":"Tüm kitaplarınız, notlarınız ve ayarlarınız izne bağlı biçimde yalnızca cihazınızda tutulur. Kullanıcı profili gereksinimi tamamen yok."},{"title":"Abonelik ve Analiz Yapılmamaktadır","body":"Harici sistemlerin sunduğu izleme ağlardan yardım veya benzeri verilerle bağlantımız olmayıp üçüncü kopyalara dahil edilmemiştir."},{"title":"İzinler","body":"Biblioteka, Android çalışma zamanı izni talep etmez. Yedekler uygulamanın özel önbelleğine yazılır ve yalnızca Paylaş'a açıkça dokunduğunuzda paylaşılır."},{"title":"Açık Kaynak Kod","body":"Sistemin altyapısı olduğu üzere açık kaynak koduna yönelik tasarımlardan GitHub sekmesinden erişerek yararlanıp öğrenebilir."},{"title":"İletişim","body":"Sizi desteklemek için uyarımıza ilişkin iletileri GitHub bildirimden veyahut yöneticimiz biblioteka@damiankokot.eu bağlantısından sağlayabilirsiniz."}],
  ko: [{"title":"데이터 저장","body":"귀하의 모든 책, 메모 및 설정은 기기에 독점적으로 보관되며 로그인 계정이 필요치 않습니다."},{"title":"분석 혹은 개인 데이터 추적 없음","body":"당사는 사용자 트래킹에 연관된 소프트웨어 또는 외부 광고 툴을 포함하지 않습니다."},{"title":"권한 설정","body":"Biblioteka는 Android 런타임 권한을 요청하지 않습니다. 백업은 앱의 비공개 캐시에 기록되며 공유를 명시적으로 탭할 때만 공유됩니다."},{"title":"오픈 소스 정보","body":"Biblioteka 서비스는 누구나 GitHub를 통해 개발 코드 내역을 확인할 오픈 기반 기능을 공유합니다."},{"title":"추가 연락 사항","body":"모든 시스템이나 이슈 관련 추가 설명이 있으신 경우 GitHub나 관리 파트너 이메일 biblioteka@damiankokot.eu를 방문해 주시기 바랍니다."}],
  ja: [{"title":"データ保存のしくみ","body":"登録された読書データおよび設定等の詳細は常にユーザー個人のツール上に留められアカウントの保有も必要としません。"},{"title":"情報の追跡は行われません","body":"利用状況監視とデータ流しに関連する特定のサービス等を共有せずに本質的な動作のみの管理を行っています。"},{"title":"アクセス許可について","body":"BibliotekはAndroidの実行時権限を要求しません。バックアップはアプリのプライベートキャッシュに書き込まれ、「共有」を明示的にタップした場合のみ共有されます。"},{"title":"完全なるオープンソース","body":"Bibliotekaのソース構成はコードを含めて外部ソフトウェアのGitHubで全面的な閲覧が随時可能となっております。"},{"title":"連絡先一覧","body":"もし不明なご指摘またはその他不具合がありましたらGitHubでの通知、およびbiblioteka@damiankokot.euへ直接お問い合わせ願います。"}],
  is: [{"title":"Gagnageymsla","body":"Allar bækurnar þínar og stillingar verða einungis varðveittar innan staðbundins búnaðar."},{"title":"Engin ytri vefgreining","body":"Öll þjónusta sem tengist aukaauglýsingum eða annarskonar tölfræðigreiningar hugbúnaði eru undanskilin."},{"title":"Aðgangsheimildir","body":"Biblioteka biður ekki um neinar Android keyrsluleyfi. Öryggisafrit eru skrifuð í einkabiðminni forritsins og deilt aðeins þegar þú ýtir sérstaklega á Deila."},{"title":"Frjáls Opinn Kóði","body":"Biblioteka styðst einvörðungu á opinn grunnkóða sem nálgast má eftir vild á GitHub þjónustunni."},{"title":"Nánari aðstoð","body":"Vinsamlegast nálgist nánari fyrirspurnir í gegnum GitHub vettvanginn eða hafið samband beint á netfangið biblioteka@damiankokot.eu."}],
  kl: [{"title":"Paasissutissat Tassa","body":"Allat atuakkatit isertuussatit piumasaqaatikkut nammineq pigaarniarlugit toqqorneqarput."},{"title":"Misissuinera Nangeqqaarneq","body":"Internet atorlugu pisartagarnut avatangiisimik ajornartorsiutillu suliaralugillu isumannaatsumut immikkoortiterput."},{"title":"Pisortatigut Aaqqissu","body":"Biblioteka Android-ip inatsisitigut atugassarsiorsimanngikkaluarluni. Backup-it programip eqqortumik imminnut pigineqartariaqarpoq cache-imminni allatigoorneqassanngikkaluarlutik isikkusimapallaarsimanngikkaluarluni Nalunaarsuiffigeqqinneq touarneqarsinnaasinnaalersitsisariaqarpoq."},{"title":"Oqaatsit Aaqqissuussaq","body":"Biblioteka siammasissumik piviusunngorluni iluaqutissiivoq, GitHub saqqumsillugu."},{"title":"Saaffiginnissut","body":"Sammisat unammillernartut uaniinnaq naatsorsuunneqarlutik paasissutissiip GitHub-imi imaluunniit biblioteka@damiankokot.eu"}],

  sl: [{"title":"Shranjevanje podatkov","body":"Vse vaše knjige, opombe in nastavitve so shranjene izključno na vaši napravi. Ne potrebujete nobenega računa."},{"title":"Brez analitike in sledenja","body":"Ne uporabljamo nobenih analitičnih storitev, orodij za prijavo napak in oglaševalskih komponent."},{"title":"Dovoljenja","body":"Biblioteka ne zahteva nobenih Android dovoljenj med izvajanjem. Varnostne kopije so zapisane v zasebni predpomnilnik aplikacije in deljene samo, ko izrecno pritisnete Deli."},{"title":"Odprta koda","body":"Biblioteka je aplikacija s popolnoma odprto kodo. S kodo se lahko seznanite na GitHubu in vse trditve neodvisno preverite."},{"title":"Kontakt","body":"Imate vprašanja glede zasebnosti? Odprite zahtevek na GitHubu, ali pa nas kontaktirajte prek elektronske pošte: biblioteka@damiankokot.eu."}],
  el: [{"title":"Αποθήκευση Δεδομένων","body":"Όλα τα βιβλία, οι σημειώσεις και οι ρυθμίσεις σας εξυπηρετούνται αποκλειστικά από την συσκευή σας. Κανένας λογαριασμός μέλους δεν απαιτείται."},{"title":"Καθόλου Analytics/Tracing","body":"Μείνετε ήσυχοι χωρίς προγράμματα λογισμικής ανάλυσης δεδομένων για εμπορικό κοινό και διαφημίσεις."},{"title":"Αδειοδότηση Επαφών","body":"Η Biblioteka δεν ζητά δικαιώματα εκτέλεσης Android. Τα αντίγραφα ασφαλείας γράφονται στην ιδιωτική κρυφή μνήμη της εφαρμογής και κοινοποιούνται μόνο όταν πατάτε ρητά Κοινοποίηση."},{"title":"Ανοικτός Κώδικας","body":"Όλα τα στάδια διέπονται από λογισμικό ανοιχτού κώδικα προσβάσιμο προς εξακρίβωση στο GitHub για παρατήρηση των δηλώσεων."},{"title":"E-mail Επικοινωνίας","body":"Απαντήσεις ή άμεση μεταφορά παραπόνων/αιτημάτων αποστείλετε στο biblioteka@damiankokot.eu."}],

};

const TERMS_ITEMS: Record<string, { title: string; body: string }[]> = {
  en: [
    {
      title: "1. Acceptance of Terms",
      body: "By downloading or using the Biblioteka app, you agree to these Terms and Conditions. If you do not agree, please uninstall the app.",
    },
    {
      title: "2. License",
      body: "Biblioteka is free, open-source software distributed under the MIT License. You are free to use, copy, modify, and distribute it in accordance with that license.",
    },
    {
      title: "3. Use of the App",
      body: "The app is provided for personal, non-commercial use to help you track your reading. You agree not to misuse the app or attempt to compromise its integrity.",
    },
    {
      title: "4. No Warranty",
      body: 'The app is provided "as is", without warranty of any kind. The developer is not responsible for any data loss or damages arising from use of the app.',
    },
    {
      title: "5. Changes",
      body: "These terms may be updated at any time. Continued use of the app after changes constitutes your acceptance of the new terms.",
    },
    {
      title: "6. Contact",
      body: "For questions or concerns, please open an issue on the GitHub repository or contact the developer directly at biblioteka@damiankokot.eu.",
    },
  ],
  pl: [
    {
      title: "1. Akceptacja Warunków",
      body: "Pobierając lub korzystając z aplikacji Biblioteka, wyrażasz zgodę na niniejsze Warunki. Jeśli się z nimi nie zgadzasz, odinstaluj aplikację.",
    },
    {
      title: "2. Licencja",
      body: "Biblioteka to oprogramowanie open source na licencji MIT. Możesz z niego korzystać, kopiować, modyfikować i rozpowszechniać zgodnie z licencją.",
    },
    {
      title: "3. Korzystanie z aplikacji",
      body: "Aplikacja służy do użytku osobistego. Zgadzasz się nie nadużywać aplikacji ani nie naruszać jej kodu.",
    },
    {
      title: "4. Brak Gwarancji",
      body: 'Aplikacja jest dostarczana "tak jak jest", bez jakiejkolwiek gwarancji. Twórca nie odpowiada za ewentualną utratę Twoich danych.',
    },
    {
      title: "5. Zmiany",
      body: "Warunki mogą być aktualizowane. Dalsze korzystanie z aplikacji oznacza akceptację nowych warunków.",
    },
    {
      title: "6. Kontakt",
      body: "W razie pytań zgłoś usterkę na GitHubie lub skontaktuj się z twórcą pod adresem biblioteka@damiankokot.eu.",
    },
  ],
  fr: [
    {
      title: "1. Acceptation des termes",
      body: "En utilisant Biblioteka, vous acceptez ces Termes et Conditions. Si vous n'êtes pas d'accord, veuillez désinstaller l'application.",
    },
    {
      title: "2. Licence",
      body: "Biblioteka est fourni sous licence MIT. Vous pouvez l'utiliser, le modifier et le distribuer conformément à cette licence.",
    },
    {
      title: "3. Utilisation",
      body: "L'application est fournie pour un usage personnel. Vous acceptez de ne pas en faire un usage abusif.",
    },
    {
      title: "4. Aucune garantie",
      body: "L'application est fournie \"telle quelle\". Le développeur n'est pas responsable de la perte de données.",
    },
    {
      title: "5. Modifications",
      body: "Ces termes peuvent être mis à jour. Continuer à utiliser l'application implique votre acceptation.",
    },
    {
      title: "6. Contact",
      body: "Pour toute question, signalez un problème sur GitHub ou contactez le développeur à biblioteka@damiankokot.eu.",
    },
  ],
  de: [
    {
      title: "1. Annahme der Bedingungen",
      body: "Durch die Nutzung von Biblioteka stimmen Sie diesen Bedingungen zu. Andernfalls deinstallieren Sie die App.",
    },
    {
      title: "2. Lizenz",
      body: "Biblioteka ist unter der MIT-Lizenz verfügbar. Sie können es gemäß dieser Lizenz nutzen, kopieren und verteilen.",
    },
    {
      title: "3. Nutzung",
      body: "Die App ist für den persönlichen Gebrauch bestimmt. Sie stimmen zu, die App nicht missbräuchlich zu verwenden.",
    },
    {
      title: "4. Keine Garantie",
      body: 'Die App wird "wie besehen" bereitgestellt. Der Entwickler haftet nicht für Datenverluste.',
    },
    {
      title: "5. Änderungen",
      body: "Diese Bedingungen können jederzeit aktualisiert werden. Die weitere Nutzung gilt als Zustimmung.",
    },
    {
      title: "6. Kontakt",
      body: "Bei Fragen melden Sie bitte ein Problem auf GitHub oder kontaktieren Sie den Entwickler unter biblioteka@damiankokot.eu.",
    },
  ],
  es: [
    {
      title: "1. Aceptación de los términos",
      body: "Al usar Biblioteka, aceptas estos Términos y Condiciones. Si no estás de acuerdo, desinstala la aplicación.",
    },
    {
      title: "2. Licencia",
      body: "Biblioteka es software bajo licencia MIT. Eres libre de usarlo, modificarlo y distribuirlo según dicha licencia.",
    },
    {
      title: "3. Uso de la App",
      body: "La aplicación es de uso personal. Aceptas no hacer un uso indebido de la aplicación.",
    },
    {
      title: "4. Sin garantía",
      body: 'La app se proporciona "tal cual". El desarrollador no es responsable de la pérdida de datos.',
    },
    {
      title: "5. Cambios",
      body: "Estos términos pueden actualizarse. El uso continuo implica la aceptación.",
    },
    {
      title: "6. Contacto",
      body: "Para consultas, abre un issue en GitHub o contacta a biblioteka@damiankokot.eu.",
    },
  ],
  hu: [
    {
      title: "1. Feltételek elfogadása",
      body: "A Biblioteka használatával elfogadja ezeket a Feltételeket. Ha nem ért egyet, kérjük, távolítsa el az alkalmazást.",
    },
    {
      title: "2. Licenc",
      body: "A Biblioteka MIT licenc alatt áll. A licencnek megfelelően használhatja, módosíthatja és terjesztheti.",
    },
    {
      title: "3. Használat",
      body: "Az alkalmazás személyes használatra szolgál. Ön vállalja, hogy nem él vissza az alkalmazással.",
    },
    {
      title: "4. Garancia kizárása",
      body: 'Az alkalmazást "ahogy van" biztosítjuk. A fejlesztő nem felelős az adatvesztésért.',
    },
    {
      title: "5. Módosítások",
      body: "Ezek a feltételek módosulhatnak. A további használat elfogadást jelent.",
    },
    {
      title: "6. Kapcsolat",
      body: "Kérdés esetén nyisson egy jegyet a GitHubon vagy írjon a biblioteka@damiankokot.eu címre.",
    },
  ],
  ro: [
    {
      title: "1. Acceptarea Termenilor",
      body: "Utilizând Biblioteka, accepți acești Termeni. Dacă nu ești de acord, te rugăm să dezinstalezi aplicația.",
    },
    {
      title: "2. Licență",
      body: "Biblioteka este sub licența MIT. Ești liber să o utilizezi, modifici și distribui conform acelei licențe.",
    },
    {
      title: "3. Utilizare",
      body: "Aplicația este pentru uz personal. Ești de acord să nu folosești greșit aplicația.",
    },
    {
      title: "4. Fără Garanție",
      body: 'Aplicația este "așa cum este". Dezvoltatorul nu e responsabil pentru pierderea datelor.',
    },
    {
      title: "5. Modificări",
      body: "Aplicația se actualizează. Utilizarea continuă înseamnă acceptarea termenilor.",
    },
    {
      title: "6. Contact",
      body: "Pentru întrebări, deschide o problemă pe GitHub sau contactează biblioteka@damiankokot.eu.",
    },
  ],
  cs: [
    {
      title: "1. Přijetí podmínek",
      body: "Používáním aplikace Biblioteka souhlasíte s těmito podmínkami. Pokud nesouhlasíte, odinstalujte ji.",
    },
    {
      title: "2. Licence",
      body: "Biblioteka je software pod licencí MIT. Můžete ji volně používat, upravovat a šířit podle této licence.",
    },
    {
      title: "3. Použití aplikace",
      body: "Aplikace je určena pro osobní použití. Souhlasíte s tím, že ji nebudete zneužívat.",
    },
    {
      title: "4. Žádná záruka",
      body: 'Aplikace je poskytována "jak je". Vývojář nenese odpovědnost za ztrátu dat.',
    },
    {
      title: "5. Změny",
      body: "Tyto podmínky se mohou změnit. Další používání znamená jejich přijetí.",
    },
    {
      title: "6. Kontakt",
      body: "Případné dotazy směřujte na GitHub nebo na biblioteka@damiankokot.eu.",
    },
  ],
  fi: [{"title":"1. Käyttöehtojen hyväksyminen","body":"Lataamalla tai käyttämällä Biblioteka-sovellusta hyväksyt nämä käyttöehdot. Jos et hyväksy, poista sovellus."},{"title":"2. Lisenssi","body":"Biblioteka on ilmainen, avoimen lähdekoodin ohjelmisto, jota jaetaan MIT-lisenssillä."},{"title":"3. Sovelluksen käyttö","body":"Sovellus on tarkoitettu henkilökohtaiseen käyttöön. Sitoudut olemaan väärinkäyttämättä sovellusta."},{"title":"4. Ei takuuta","body":"Sovellus tarjotaan \"sellaisenaan\" ilman minkäänlaista takuuta. Kehittäjä ei ole vastuussa mistään tietojen menetyksestä."},{"title":"5. Muutokset","body":"Näitä ehtoja voidaan päivittää milloin tahansa. Sovelluksen jatkuva käyttö tarkoittaa hyväksyntää."},{"title":"6. Ota yhteyttä","body":"Kysymyksiä tai huolenaiheita varten avaa ongelma GitHubissa tai ota suoraan yhteyttä osoitteeseen biblioteka@damiankokot.eu."}],
  sv: [{"title":"1. Godkännande av villkor","body":"Genom att ladda ner eller använda Biblioteka-appen godkänner du dessa villkor. Om du inte godkänner, vänligen avinstallera appen."},{"title":"2. Licens","body":"Biblioteka är gratis programvara med öppen källkod distribuerad under MIT-licensen."},{"title":"3. Användning av appen","body":"Appen tillhandahålls för personligt bruk. Du förbinder dig att inte missbruka appen."},{"title":"4. Ingen garanti","body":"Appen tillhandahålls \"i befintligt skick\" utan några som helst garantier. Utvecklaren ansvarar inte för eventuell dataförlust."},{"title":"5. Ändringar","body":"Dessa villkor kan uppdateras när som helst. Din fortsatta användning av appen efter ändringar utgör ditt godkännande."},{"title":"6. Kontakt","body":"För frågor, vänligen öppna ett ärende på GitHub eller kontakta utvecklaren direkt på biblioteka@damiankokot.eu."}],
  no: [{"title":"1. Aksept av vilkår","body":"Ved å laste ned eller bruke Biblioteka-appen, godtar du disse vilkårene. Hvis du ikke er enig, vennligst avinstaller appen."},{"title":"2. Lisens","body":"Biblioteka er gratis åpen kildekode programvare distribuert under MIT-lisensen."},{"title":"3. Bruk av appen","body":"Appen er for personlig bruk. Du samtykker i å ikke misbruke appen."},{"title":"4. Ingen garanti","body":"Appen leveres \"som den er\" uten noen form for garanti. Utvikleren er ikke ansvarlig for tap av data."},{"title":"5. Endringer","body":"Disse vilkårene kan oppdateres når som helst. Fortsatt bruk forutsetter at vilkårene aksepteres."},{"title":"6. Kontakt","body":"For spørsmål eller bekymringer, vennligst åpne et problem på GitHub eller kontakt biblioteka@damiankokot.eu."}],
  da: [{"title":"1. Accept af vilkår","body":"Ved at downloade eller bruge Biblioteka-appen accepterer du disse vilkår. Hvis du ikke er enig, skal du afinstallere appen."},{"title":"2. Licens","body":"Biblioteka er gratis open source-software distribueret under MIT-licensen."},{"title":"3. Brug af appen","body":"Appen stilles til rådighed til personlig brug. Du accepterer ikke at misbruge appen."},{"title":"4. Ingen garanti","body":"Appen leveres \"som den er\" uden nogen form for garanti. Udvikleren er ikke ansvarlig for datatab."},{"title":"5. Ændringer","body":"Disse vilkår kan blive opdateret. Fortsat brug indebærer accept."},{"title":"6. Kontakt","body":"For spørgsmål, åbn venligst et problem på GitHub eller kontakt på biblioteka@damiankokot.eu."}],
  nl: [{"title":"1. Acceptatie van Voorwaarden","body":"Door Biblioteka te openen, ga je akkoord met deze voorwaarden. Verwijder de app als je niet akkoord gaat."},{"title":"2. Licentie","body":"Biblioteka is gratis open-sourcesoftware onder de MIT-licentie."},{"title":"3. Gebruik van de App","body":"Je mag deze software voor persoonlijke doeleinden gebruiken zonder proberen misbruik te maken."},{"title":"4. Geen Garantie","body":"Biblioteka wordt verstrekt \"zoals deze is\" zonder enige garanties ten aanzien van gegevensbescherming."},{"title":"5. Wijzigingen","body":"De voorwaarden kunnen worden herzien waardoor deze nieuwe regels overnemen."},{"title":"6. Contact","body":"Voor resterende onduidelijkheden stuur een verzoek via GitHub en/of biblioteka@damiankokot.eu."}],
  lb: [{"title":"1. Zoustëmmung vun de Konditiounen","body":"Wann dir de Gebrauch vun däer Biblioteka App start, zitt dir iech déi festgeleet Regelen zou. Soss kënnt dir d'App erofhuelen."},{"title":"2. Lizenz","body":"All Code ënnerläit der ëffentlecher MIT Lizenz."},{"title":"3. Den Zweck vun der App","body":"D'Installatioun baséiert um richtege Gebrauch ouni eventuell de System unzegräifen."},{"title":"4. Keng Garantienëffentlechkeet","body":"Et kann allzäit onvirgesi Feeler optrieden dofir garantéiert keen eng 100% Dateversëcherung."},{"title":"5. Verännerungen","body":"All Ännerunge wäerten reegelméisseg iwwerschriwwe ginn."},{"title":"6. Kontaktinfo","body":"Bei alle Froen an eventuelle Proposéierungen benoriichtegt de betraffene Kontakt biblioteka@damiankokot.eu."}],
  pt: [{"title":"1. Aceitação dos Termos","body":"Ao utilizar o Biblioteka, concorda com estes termos. Se não concordar, desinstale o aplicativo."},{"title":"2. Licença","body":"O Biblioteka é um software de código aberto licenciado sobre as diretrizes do MIT."},{"title":"3. Utilização","body":"Este software existe a penas destinado a tarefas e fins primariamente de característicos pessoais."},{"title":"4. Isenção de Garantia","body":"Nós expressamente excluímos toda ou qualquer outra perda indevida de eventuais corrupções no código e sistemas."},{"title":"5. Modificações Adicionais","body":"O uso estendido reafirma o acordo completo as modificáveis e correntes cláusulas."},{"title":"6. Suporte Direto","body":"Contactos devem prosseguir através do GitHub, ou correios eletrónicos alternativos: biblioteka@damiankokot.eu"}],
  it: [{"title":"1. Accettazione Termini","body":"Tramite l'avvio dell'app Biblioteka sei propenso ad approvare totalmente le procedure e normative."},{"title":"2. Licenza","body":"La piattaforma open-source e gratuita Biblioteka rispetta ed è autorizzata via MIT."},{"title":"3. Linee Guida Operative","body":"Ogni consumatore s'incarica di agire adeguatamente usando il sistema con coerenza."},{"title":"4. Mancanza di Garanzie","body":"La salvaguardia ed esistenza dati si trova completamente sotto la supervisione per ogni utilizzo utente remoto."},{"title":"5. Avvisi Ed Esecuzioni","body":"Per via della continuità applicata ne seguirà un nuovo regolamento che verrà tacitamente esteso."},{"title":"6. Contatto","body":"Rivolgiti immediatamente allo staff tramite l'assistenza al biblioteka@damiankokot.eu."}],
  hr: [{"title":"1. Prihvaćanje Uvjeta","body":"Pri uporabi Biblioteka pristajete se i obvezujete pred trenutnim naputcima poslovanja."},{"title":"2. Licenciranje","body":"Aplikacija Biblioteka prilaže open-source prava propisanim putem MIT licence."},{"title":"3. Sigurnost","body":"Preuzimate opću pažnju za osobne operacije tako te spriječavamo daljnju provalu sistema."},{"title":"4. Odbrobljena Zaštita","body":"Nema nikakvih čvrstih garancija ukoliko neočekivane pogreške rezultiraju gubitkom podataka aplikacije."},{"title":"5. Novi Dodaci","body":"Na vrijeme promjene politike smatrajte kako je prihvaćeno novo i nadopunjeno izdanje pravila."},{"title":"6. Kontakti","body":"Sve prijedloge isporučite put portala GitHub ili email dopisima direktnom proizvođaču."}],
  sk: [{"title":"1. Akceptovanie Ustanovení","body":"Otvorením alebo využitím služby Biblioteka plne súhlasíte s predchádzajúcimi dohodami a postupmi."},{"title":"2. Dostupná Licencia","body":"Každá forma obsahu využíva otvorenú doménu v nadeľovanej MIT schéme bez zásadných blokád."},{"title":"3. Sústredenie Cielov","body":"Vyjadruje osobné sústredenie snáh o zaznamenávania bez úmyselných zneuzivaní zložiek."},{"title":"4. Výlučenie Záruk","body":"Spoločnosť je poistená voči strate i iných chybám bez predpisovania nápravných úkonov majiteľa."},{"title":"5. Zmene","body":"Nepretržitosť práce automaticky prizvukuje stála prijímanie zmeneného kódu správania."},{"title":"6. Zastihnuteľnosť","body":"Napíšete pre bližšie oboznámenie sa priamo email majiteľovi prostredníctvom biblioteka@damiankokot.eu."}],
  et: [{"title":"1. Reeglistiku Järgimine","body":"Allalahendusel nõustute sätestatud ja ametlikult heaks kiidetud regulatsioonidega."},{"title":"2. Litsents","body":"Toimub pidev vabavaraline avalikustamine tunnustatud avara režiimi – MIT litsentsi aluspinnal."},{"title":"3. Otstarve","body":"Programm pakutakse individuaalses perspektiivis lugemisaastate kaardistamise kergendamiseks."},{"title":"4. Hüvitamisest Loobumine","body":"Keeldume kõikidest preitentsioonidest andmebaasi kadude puhuks mis ilmnevad iseseisvalt."},{"title":"5. Pidevad Täiendused","body":"Soosime kõiki arenguid aga edasise sisselogimisega kehtestuvad ka potentsiaalselt uuned."},{"title":"6. Andmed Kujunemiseks","body":"Edasiste lahenduste suunamiseks viige asjalugusid isiklikult arendajale biblioteka@damiankokot.eu."}],
  lv: [{"title":"1. Līguma Ievērošana","body":"Lejupielādējot tiešsaistes lietotnē, atkrīt citas šaubas atzīt platformas noteikto regulējumu."},{"title":"2. Licence","body":"Visu pieejamo avota kodu apliecina autoritatīvā organizācija MIT saskaņā ar licensijas sistēmu."},{"title":"3. Lietotnes Funkcijas","body":"Atbrīvo un ļauj pilnvērtīgi funkcionēt vienkāršos lietotāja un personas pieprasījumos."},{"title":"4. Zaudējumu Atsaukšana","body":"Ja rodas tehnoloģiski neatgriezeniski bojājumi mēs neuzņemamies tālāku garantējošu rīcību dēļ klienta."},{"title":"5. Pilnveide","body":"Veikti jebkādu jaunu korekciju virkne dod mājienu to spēka uzturēšanai bez jebkādiem izṇēmumiem."},{"title":"6. Tālāka Uzziņa","body":"Visinteresējošiem uzaicinājumiem un neskaidrībām lūdzu raktīt tiešā veidā adresei e pastā biblioteka@damiankokot.eu."}],
  lt: [{"title":"1. Naudojimosi Apibrėžtumas","body":"Kai prisiimate laisvą produkto atisiuntimą taip prisiimate atitinkamus programinės įrangos standartus ir susitarimus."},{"title":"2. Laisva Apimtis","body":"Teisiškai sureguliuotų reikalavimų sistemoje yra prieinamo naudojimo bazinė licenziją (MIT leidimas)."},{"title":"3. Kasdieninis Naudojimas","body":"Visa ši bazė kurta pačių jūsų paprasčiausių reikalavimų patenkinimams nepažeidžiant vientisumo ar sistemos pagrindų."},{"title":"4. Jokhio Padengties Suteikimo","body":"Tokios apraškos neužtikrina visiško saugumo dingus pagrindinei duomienu atsarginei laikmenai."},{"title":"5. Adaptabilumas","body":"Regimieji atnaujinimai laikomi sutartyje nebent naudotojas toliam išvengia jų esamos įgyvendinimo apimties."},{"title":"6. Kontaktinė Prieiga","body":"Kiti teikti pasiūlymai GitHub domenyje arba susisiekite nurodytu adresu biblioteka@damiankokot.eu."}],
  bg: [{"title":"1. Приемане на условията","body":"Чрез използването на този софтуер се съгласявате да оперирате адекватно с данните."},{"title":"2. Лиценз","body":"Платформата има изцяло отворен код споделян основно чрез придобития MIT стандарт."},{"title":"3. Управление","body":"Всеки профил служи персонално в насока защита на основни потребителски търсения."},{"title":"4. Непокрити Задължения","body":"Абсолютно никой съдружник не понася вина за понесени необратими кражби на архивни системи."},{"title":"5. Последващи Промени","body":"Отбелязаният съгласител спомага за бързият преход при допълвания на тези точки занапред."},{"title":"6. Обратна Връзка","body":"За коментари и попреправки разпратете вашите мнения до администраторите към GitHub и biblioteka@damiankokot.eu."}],
  tr: [{"title":"1. Kullanım Sözleşmesi","body":"Bu platform erişimi başlatan tüm bireyler belirtilen kuralı tüm hatlarıyla desteklemekten kendileri onaylı sayılacaktır."},{"title":"2. Lisans Durumu","body":"Yalnız ve bütünüyle tam manasıyla MIT formatında yetkilendirilmesi bulunup o yolla ücretsiz şekillenir."},{"title":"3. Kullanım Amacı","body":"Program genel itibarıyla kimsenin sistemi suistimal ve sömürü gerçekleştirmemesini gözetip denetlenmiştir."},{"title":"4. Veri Sorumluluk","body":"Sunucudaki herhangi kalıcı hata ihtimalinde uygulamanın garantörü kesin surette mesul tutulamayacaktır."},{"title":"5. Ek Düzenlemeler","body":"Var olduklarına ilaveten ekli kısımlara yönelik kullanımlara istinaden kurallar güncellemesi sürece uyarlanmış addedilir."},{"title":"6. Bağlantı Merkezi","body":"Karşılaştığınız engeller olursa direkt yazar konumunda varılan e-postaya (biblioteka@damiankokot.eu) ya da GitHub sayfamızı deneyiniz."}],
  ko: [{"title":"1. 기본 약관 준수","body":"이 프로그램을 활성화하여 이용할 시 위 서술한 정책을 바탕으로 일체의 합법적 조항에 동의함으로 처리됩니다."},{"title":"2. 소스 라이선스","body":"저희 프로젝트는 개방된 형태의 코드를 준수하는 MIT 라이선스 환경 내 제공이 인증된 결과물입니다."},{"title":"3. 정상적 활용 방향","body":"오픈 네트워크 기반인 만큼 개인 용도를 제외하고 시스템 남용 방지 체계 아래 서비스를 운영에 전하게 됩니다."},{"title":"4. 사고 및 피해 면책","body":"과실 및 서버 데이터 훼손 상태 시 관리자는 정보 보호 책임에서 일부 제외됨을 주의하세요."},{"title":"5. 최신화 정책","body":"미래 사용 시 자동으로 수정된 사안이 있을 경우 역시 해당 조율안이 반영됨을 기재합니다."},{"title":"6. 담당자 연락","body":"기타 여러 의문사항들을 풀기 위해서 즉각 GitHub 레포지토리를 참조하거나 이메일 메세지로 biblioteka@damiankokot.eu에 질문을 보내시기 바랍니다."}],
  ja: [{"title":"1. 利用諸条件の受諾","body":"この機能を利用する場合は以下に基づく要件に対して完全に承諾したものとみなさせていただきます。"},{"title":"2. コードのライセンス","body":"Bibliotekaの全ては正規のMITライセンス仕様により完全に無料で提供公開されているシステムです。"},{"title":"3. アプリケーション用途","body":"個人的な範囲内の活動としての提供である故システムを不正に利用したり制限を改竄する行為は禁じられています。"},{"title":"4. 責任無制限の表記","body":"本プログラムは現在の仕様にて随時稼働しますがユーザーが不意のデータ喪失被害に遭った場合でも製作者負担は免除されます。"},{"title":"5. 追加更新","body":"システムに準じて規約自体も都度対応修正されるため常に新しいバージョンを使用することで全内容遵守としています。"},{"title":"6. お客様窓口","body":"ご不満の意見あるいは追加のご希望に関してはGitHubの課題発行ページか直接のメール連絡biblioteka@damiankokot.euをご利用ください。"}],
  is: [{"title":"1. Samþykki skilmála","body":"Notkun okkar upplýsingakerfis gengur því í augu að nýta og virkja framantalin grundvallaratriði staðalsins."},{"title":"2. Hugbúnaðarleyfi","body":"Alþjóðlegt dreifingarkerfi byggt undir skilyrðum frá samspila opnum kerfum (MIT leyfinu)."},{"title":"3. Meðhöndlun Hugbúnaðarins","body":"Þjónustan snertir af stærstu leyti þegna einstakra hluta notendasvæðis í samvinnu með að koma í veg fyrir skemmdir eða svik."},{"title":"4. Undanskilið ábyrgð","body":"Með öllu undanskilum framleiðanda á öllum og hvaða skaða á týndum tölvugögnum sem er af orsök notands hugbúnaðarins."},{"title":"5. Breytingar","body":"Þeir sem nota appið án viðbragða við seinni breytingar á uppfærslum af regluverkum skulu lítið á vera samþykkjendur þess sama."},{"title":"6. Tölvupóstur Framleiðanda","body":"Aðrir vafalítil málefnin sendist áfram í snertingu til biblioteka@damiankokot.eu eða sjá tæknisvið Github."}],
  kl: [{"title":"1. Piumasaqaatit","body":"Atortussat ilanngullugit pilerinnaq namminersorlutit tapersersornartippat qaqutigooraluarit tulluarpoq."},{"title":"2. Akuersissut","body":"Ilasoq Biblioteka ilisimasat najoqqutassat ilisimasat MIT akuersissummik ilanngunneqarpoq."},{"title":"3. Atuinera","body":"Utoqqat malittarisaliortaat sulisoq unioqqutinngillat nalinginnaasumi atorneqassasoq isumaqatigiiffeqarpugut."},{"title":"4. Pitsaanngitsut","body":"Applikationimit naggataatigut akisussaassuseqanngilagut datanut ilisimatitsilluni ajornartorsiutinut."},{"title":"5. Allortariikkut","body":"Malittarisassat immikkoortut allannguuteqarnerit atuuttuumatillugit atornera pisarsimasumut atuaqqullugu neriorsugaq."},{"title":"6. Allattoqarfik","body":"Immikkoortitsinermut tunngasut Github atorneqassappata iserluaruk imaluunniit nalilersukkat biblioteka@damiankokot.eu atorlugu ujartuisi."}],

  sl: [{"title":"1. Sprejem pogojev","body":"Z namestitvijo ali uporabo te aplikacije se strinjate s temi navedenimi pogoji uporabe. V kolikor se z njimi ne strinjate, prosimo odstranite aplikacijo."},{"title":"2. Licenca","body":"Aplikacija je odprta koda na voljo kot brezplačna po MIT licenci."},{"title":"3. Nameni uporabe","body":"Predpisani nameni obljubljeno zagotavljajo storitev brez tveganj zlonamerne uporabe. Obljubljamo, da je ne bomo zlorabili."},{"title":"4. Odsotnost garancije","body":"Biblioteka je uporabnikom zagotovljena brez vsakršnih prevzetih jamstev do povrnjenih stroškov ali posledične izgube baze podatkov."},{"title":"5. Nadaljnje spremembe","body":"Naslednje posodobitve preteklim odsekom se avtomatsko uveljavljajo dokler so v skladu s tem."},{"title":"6. Pritožbe & podpora","body":"Vedno podpiramo pobude zato nas v primeru odkritih problemov ali nasveta kontaktirajte preko biblioteka@damiankokot.eu"}],
  el: [{"title":"1. Γενικοί Όροι Αποδοχής","body":"Υιοθετώντας το τρέχον λογισμικό συμφωνείτε υπεύθυνα στις προαναφερθείσες διατάξεις από την πλευρά σας."},{"title":"2. Σύστημα Άδειας","body":"Είστε πλέον αποδέκτης δωρεάν ανοιχτού κώδικα του διεθνούς επιπέδου MIT."},{"title":"3. Ορθή Χρήση","body":"Δικαίωμα ατομικής επιδίωξης και απόσυρση σε περιπτώσεις βλαβερών παρεμβολών διασφαλίζονται από την πλευρά μας."},{"title":"4. Απουσία Εγγυήσεων","body":"Ο διαχειριστής αποποιείται απόζημιώσεις που παρατηρηθούν μετά από ολικές καταστροφές ή χαμένα ηλεκτρονικά αρχεία."},{"title":"5. Ενσωματώσεις Προσθηκών","body":"Με την πάροδο χρόνου όλοι οι μετέπειτα βελτιωμένοι κανόνες παραμένουν δεσμευτικοί εντός ορίων σε περιβάλλον σεβασμού."},{"title":"6. Περαιτέρω Υποστήριξη","body":"Μιλήστε μας δίχως δισταγμό για τεχνικά/λειτουργικά θέματα στέλνοντας μήνυμα στην ίδια την σελίδα ή απευθείας στο biblioteka@damiankokot.eu."}],

};

interface LicenseEntry {
  name: string;
  license: string;
  copyright: string;
  url: string;
}

const THIRD_PARTY_LIBS: LicenseEntry[] = [
  {
    name: "React & React DOM",
    license: "MIT",
    copyright: "© Meta Platforms, Inc.",
    url: "https://react.dev",
  },
  {
    name: "Vite",
    license: "MIT",
    copyright: "© Evan You & Vite Contributors",
    url: "https://vitejs.dev",
  },
  {
    name: "Tailwind CSS",
    license: "MIT",
    copyright: "© Tailwind Labs, Inc.",
    url: "https://tailwindcss.com",
  },
  {
    name: "Capacitor (Core, Android, App, Filesystem, Share)",
    license: "MIT",
    copyright: "© Ionic",
    url: "https://capacitorjs.com",
  },
  {
    name: "@google/genai",
    license: "Apache 2.0",
    copyright: "© Google LLC",
    url: "https://github.com/googleapis/js-genai",
  },
  {
    name: "@hello-pangea/dnd",
    license: "Apache 2.0",
    copyright: "© hello-pangea",
    url: "https://github.com/hello-pangea/dnd",
  },
  {
    name: "@material/material-color-utilities",
    license: "Apache 2.0",
    copyright: "© Google LLC",
    url: "https://github.com/material-foundation/material-color-utilities",
  },
  {
    name: "lucide-react",
    license: "ISC",
    copyright: "© Lucide Contributors",
    url: "https://lucide.dev",
  },
  {
    name: "Motion (Framer Motion)",
    license: "MIT",
    copyright: "© Framer B.V.",
    url: "https://motion.dev",
  },
  {
    name: "Recharts",
    license: "MIT",
    copyright: "© recharts group",
    url: "https://recharts.org",
  },
  {
    name: "html5-qrcode",
    license: "Apache 2.0",
    copyright: "© Minhaz",
    url: "https://github.com/mebjas/html5-qrcode",
  },
  {
    name: "dotenv",
    license: "BSD-2-Clause",
    copyright: "© Scott Motte",
    url: "https://github.com/motdotla/dotenv",
  },
  {
    name: "Express",
    license: "MIT",
    copyright: "© TJ Holowaychuk",
    url: "https://expressjs.com",
  },
];

export function SettingsModal({
  settings,
  onChange,
  onClose,
  books,
  onImport,
  onClearAllData,
}: SettingsModalProps) {
  const { t } = useTranslation();
  const [activeScreen, setActiveScreen] = useState<SettingsScreen>("MAIN");
  const isCustomColor = !COLOR_OPTIONS.find(
    (c) => c.value.toLowerCase() === settings.colorTheme.toLowerCase()
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goBack = () => {
    setActiveScreen(SCREEN_PARENT[activeScreen] ?? "MAIN");
  };

  const THEME_OPTIONS: { value: AppThemeMode; label: string; icon: any }[] = [
    { value: "system", label: t("themeSystem"), icon: Monitor },
    { value: "light", label: t("themeLight"), icon: Sun },
    { value: "dark", label: t("themeDark"), icon: Moon },
  ];

  const handleExport = async () => {
    const dataStr = JSON.stringify(books, null, 2);
    const exportFileDefaultName = `biblioteka_backup_${
      new Date().toISOString().split("T")[0]
    }.json`;

    try {
      const { Share } = await import("@capacitor/share");
      const { Filesystem, Directory, Encoding } = await import(
        "@capacitor/filesystem"
      );

      const result = await Filesystem.writeFile({
        path: exportFileDefaultName,
        data: dataStr,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });

      await Share.share({
        title: "Eksport biblioteki",
        text: "Plik z kopią zapasową Twojej biblioteki.",
        url: result.uri,
        dialogTitle: "Zapisz lub udostępnij kopię",
      });
      return;
    } catch (err) {
      console.warn(
        "Capacitor share/filesystem failed, falling back to web",
        err
      );
    }

    // Web fallback
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement("a");
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
        if (!Array.isArray(parsed)) {
          window.alert(t("importFormatError"));
          return;
        }

        const VALID_STATUSES = new Set(["TO_READ", "READING", "READ"]);
        const MAX_COVER_BYTES = 2 * 1024 * 1024; // 2 MB

        const validated: Book[] = [];
        let skipped = 0;

        for (const item of parsed) {
          // Must be a plain object
          if (!item || typeof item !== "object" || Array.isArray(item)) { skipped++; continue; }
          // Required string fields
          if (typeof item.id !== "string" || !item.id.trim()) { skipped++; continue; }
          if (typeof item.title !== "string" || !item.title.trim()) { skipped++; continue; }
          if (typeof item.author !== "string") { skipped++; continue; }
          // Required status
          if (!VALID_STATUSES.has(item.status)) { skipped++; continue; }
          // Required timestamp
          if (typeof item.addedAt !== "number") { skipped++; continue; }

          // Build a clean Book with only known fields — no unknown keys
          const clean: Book = {
            id: String(item.id).trim(),
            title: String(item.title).trim(),
            author: String(item.author).trim(),
            status: item.status as Book["status"],
            addedAt: Number(item.addedAt),
          };

          if (typeof item.rating === "number" && item.rating >= 1 && item.rating <= 5) {
            clean.rating = item.rating;
          }
          if (typeof item.notes === "string") {
            clean.notes = item.notes;
          }
          if (typeof item.finishedAt === "number") {
            clean.finishedAt = item.finishedAt;
          }
          if (typeof item.isbn === "string") {
            clean.isbn = item.isbn;
          }
          if (typeof item.currentPage === "number" && item.currentPage >= 0) {
            clean.currentPage = item.currentPage;
          }
          if (typeof item.coverImage === "string") {
            if (item.coverImage.length <= MAX_COVER_BYTES) {
              clean.coverImage = item.coverImage;
            }
            // silently drop oversized cover images
          }

          validated.push(clean);
        }

        if (validated.length === 0) {
          window.alert(t("importFormatError"));
          return;
        }

        onImport(validated);
        const msg = skipped > 0
          ? `${t("importSuccess")}${validated.length} (${skipped} skipped)`
          : `${t("importSuccess")}${validated.length}`;
        window.alert(msg);
      } catch (error) {
        console.error("Failed to parse the imported file:", error);
        window.alert(t("importError"));
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const screenVariants = {
    initial: { x: "20%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-20%", opacity: 0 },
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
            {activeScreen !== "MAIN" && (
              <button
                onClick={goBack}
                className="p-2 -ml-2 bg-surface-variant hover:opacity-80 rounded-full transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
              </button>
            )}
            <h2 className="text-xl font-medium text-on-surface">
              {activeScreen === "MAIN"
                ? t("settings")
                : activeScreen === "APPEARANCE"
                ? t("appearance")
                : activeScreen === "LANGUAGE"
                ? t("language")
                : activeScreen === "BACKUP"
                ? t("backup")
                : activeScreen === "ABOUT"
                ? t("aboutApp")
                : activeScreen === "THIRD_PARTY_LICENSES"
                ? t("thirdPartyLicenses")
                : activeScreen === "TERMS_CONDITIONS"
                ? t("termsConditions")
                : activeScreen === "PRIVACY_POLICY"
                ? t("privacyPolicy")
                : t("aboutApp")}
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
            {activeScreen === "MAIN" && (
              <motion.div
                key="MAIN"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col space-y-2 absolute inset-0 h-max"
              >
                <div className="flex flex-col">
                  <SettingItem
                    icon={Palette}
                    title={t("appearance")}
                    subtitle={`${t("theme")}, ${t("accentColor")}`}
                    onClick={() => setActiveScreen("APPEARANCE")}
                    iconBg="bg-[#e09b69]/20"
                    iconColor="text-[#e09b69]"
                  />
                  <SettingItem
                    icon={Globe}
                    title={t("language")}
                    subtitle={
                      LANGUAGES.find((l) => l.value === settings.language)
                        ?.label || "English"
                    }
                    onClick={() => setActiveScreen("LANGUAGE")}
                    iconBg="bg-[#6b8c96]/20"
                    iconColor="text-[#6b8c96]"
                  />
                  <SettingItem
                    icon={Disc}
                    title={t("backup")}
                    subtitle={`${t("exportData")}, ${t("importData")}`}
                    onClick={() => setActiveScreen("BACKUP")}
                    iconBg="bg-[#a37c82]/20"
                    iconColor="text-[#a37c82]"
                  />
                </div>

                <div className="h-px bg-outline-variant/30 w-full my-2" />

                <div className="flex flex-col">
                  <SettingItem
                    icon={Info}
                    title={t("aboutApp")}
                    subtitle={`${t("version")}, ${t("sourceCode")}, ${t(
                      "licenses"
                    )}`}
                    onClick={() => setActiveScreen("ABOUT")}
                    iconBg="bg-[#7d8a6c]/20"
                    iconColor="text-[#7d8a6c]"
                  />
                </div>
              </motion.div>
            )}

            {activeScreen === "APPEARANCE" && (
              <motion.div
                key="APPEARANCE"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col space-y-6 absolute inset-0 h-max"
              >
                <div className="flex flex-col gap-2">
                  <div className="px-2 pb-2">
                    <span className="text-[0.85rem] font-semibold text-primary uppercase tracking-wider">
                      {t("theme")}
                    </span>
                  </div>
                  {THEME_OPTIONS.map((mod) => (
                    <SettingItem
                      key={mod.value}
                      icon={mod.icon}
                      title={mod.label}
                      onClick={() =>
                        onChange({ ...settings, themeMode: mod.value })
                      }
                      hideArrow
                      iconBg={
                        settings.themeMode === mod.value
                          ? "bg-primary/20"
                          : "bg-surface-variant"
                      }
                      iconColor={
                        settings.themeMode === mod.value
                          ? "text-primary"
                          : "text-on-surface-variant"
                      }
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
                    <span className="text-[0.85rem] font-semibold text-primary uppercase tracking-wider">
                      {t("accentColor")}
                    </span>
                  </div>
                  <div className="px-4 flex flex-wrap gap-4">
                    {COLOR_OPTIONS.map((col) => (
                      <button
                        key={col.value}
                        onClick={() =>
                          onChange({ ...settings, colorTheme: col.value })
                        }
                        className={`w-10 h-10 rounded-full transition-transform hover:scale-110 overflow-hidden ${
                          settings.colorTheme.toLowerCase() ===
                          col.value.toLowerCase()
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-surface"
                            : ""
                        }`}
                        style={{ backgroundColor: col.value }}
                        title={col.label}
                      />
                    ))}
                    <div
                      className="relative w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 overflow-hidden"
                      title={t("customColor")}
                    >
                      <input
                        type="color"
                        value={settings.colorTheme}
                        onChange={(e) =>
                          onChange({ ...settings, colorTheme: e.target.value })
                        }
                        className="absolute inset-[-10px] w-20 h-20 cursor-pointer p-0 border-0 opacity-0"
                      />
                      <div
                        className="w-full h-full pointer-events-none rounded-full border-2 border-dashed flex items-center justify-center"
                        style={{
                          backgroundColor: isCustomColor
                            ? settings.colorTheme
                            : "transparent",
                          borderColor: "var(--md-sys-color-outline)",
                        }}
                      >
                        {isCustomColor && (
                          <span className="w-3 h-3 rounded-full bg-white/90 mix-blend-overlay" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeScreen === "LANGUAGE" && (
              <motion.div
                key="LANGUAGE"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col space-y-2 absolute inset-0 h-max"
              >
                {LANGUAGES.map((lang) => (
                  <SettingItem
                    key={lang.value}
                    icon={Globe}
                    title={lang.label}
                    onClick={() =>
                      onChange({ ...settings, language: lang.value })
                    }
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

            {activeScreen === "BACKUP" && (
              <motion.div
                key="BACKUP"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col space-y-2 absolute inset-0 h-max"
              >
                <SettingItem
                  icon={Download}
                  title={t("exportData")}
                  subtitle={t("exportData")}
                  onClick={handleExport}
                  hideArrow
                  iconBg="bg-[#6b8c96]/20"
                  iconColor="text-[#6b8c96]"
                />

                <SettingItem
                  icon={Upload}
                  title={t("importData")}
                  subtitle={t("importData")}
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
                  title={t("clearData")}
                  subtitle={t("clearDataDesc")}
                  textColor="text-error"
                  onClick={onClearAllData}
                  hideArrow
                  iconBg="bg-error/10"
                  iconColor="text-error"
                />
              </motion.div>
            )}

            {activeScreen === "ABOUT" && (
              <motion.div
                key="ABOUT"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col space-y-2 absolute inset-0 h-max"
              >
                <div className="flex flex-col items-center justify-center py-6 pb-8 gap-3">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                    <BookOpen className="w-10 h-10 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-on-surface">
                    Biblioteka
                  </h1>
                  <div className="flex gap-2 items-center">
                    <span className="bg-surface-variant/80 text-on-surface-variant border border-outline-variant px-3 py-1 rounded-full text-xs font-bold tracking-widest">
                      {t("version")} 1.0.0
                    </span>
                  </div>
                </div>

                <SettingItem
                  icon={Info}
                  title={t("licenses")}
                  subtitle={t("mitLicense")}
                  hideArrow
                  iconBg="bg-[#bda17e]/20"
                  iconColor="text-[#bda17e]"
                />

                <SettingItem
                  icon={Mail}
                  title={t("email")}
                  subtitle="biblioteka@damiankokot.eu"
                  onClick={() =>
                    (window.location.href = "mailto:biblioteka@damiankokot.eu")
                  }
                  hideArrow
                  iconBg="bg-[#d18471]/20"
                  iconColor="text-[#d18471]"
                />

                <SettingItem
                  icon={Code}
                  title={t("sourceCode")}
                  subtitle={t("onGithub")}
                  onClick={() =>
                    window.open(
                      "https://github.com/damiankokot45/Biblioteka-Your-library-for-android",
                      "_blank"
                    )
                  }
                  hideArrow
                  iconBg="bg-[#996e51]/20"
                  iconColor="text-[#996e51]"
                />

                <SettingItem
                  icon={Bug}
                  title={t("createIssue")}
                  subtitle={t("onGithub")}
                  onClick={() =>
                    window.open(
                      "https://github.com/damiankokot45/Biblioteka-Your-library-for-android/issues",
                      "_blank"
                    )
                  }
                  hideArrow
                  iconBg="bg-[#a68c67]/20"
                  iconColor="text-[#a68c67]"
                />

                <div className="bg-surface-variant/50 rounded-2xl p-1 mt-6 border border-outline-variant/30 overflow-hidden flex flex-col">
                  <SettingItem
                    icon={FileText}
                    title={t("thirdPartyLicenses")}
                    onClick={() => setActiveScreen("THIRD_PARTY_LICENSES")}
                    iconBg="bg-transparent"
                    iconColor="text-on-surface-variant"
                  />
                  <div className="h-px bg-outline-variant/30 w-full" />
                  <SettingItem
                    icon={FileText}
                    title={t("termsConditions")}
                    onClick={() => setActiveScreen("TERMS_CONDITIONS")}
                    iconBg="bg-transparent"
                    iconColor="text-on-surface-variant"
                  />
                  <div className="h-px bg-outline-variant/30 w-full" />
                  <SettingItem
                    icon={FileText}
                    title={t("privacyPolicy")}
                    onClick={() => setActiveScreen("PRIVACY_POLICY")}
                    iconBg="bg-transparent"
                    iconColor="text-on-surface-variant"
                  />
                </div>

                <div className="h-8 w-full shrink-0"></div>
              </motion.div>
            )}

            {activeScreen === "THIRD_PARTY_LICENSES" && (
              <motion.div
                key="THIRD_PARTY_LICENSES"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
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
                    onClick={() => window.open(lib.url, "_blank")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-on-surface font-semibold text-[0.95rem] leading-snug flex-1">
                        {lib.name}
                      </span>
                      <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                        {lib.license}
                      </span>
                    </div>
                    <span className="text-on-surface-variant text-xs">
                      {lib.copyright}
                    </span>
                  </div>
                ))}
                <div className="h-10 w-full shrink-0" />
              </motion.div>
            )}

            {activeScreen === "TERMS_CONDITIONS" && (
              <motion.div
                key="TERMS_CONDITIONS"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="p-4 px-5 flex flex-col gap-4 absolute inset-0 h-max"
              >
                {(TERMS_ITEMS[settings.language] || TERMS_ITEMS["en"]).map(
                  (s) => (
                    <div key={s.title} className="flex flex-col gap-1">
                      <span className="text-on-surface font-semibold text-[0.95rem]">
                        {s.title}
                      </span>
                      <span className="text-on-surface-variant text-[0.88rem] leading-relaxed">
                        {s.body}
                      </span>
                    </div>
                  )
                )}
                <p className="text-on-surface-variant/50 text-xs pt-2">
                  {LAST_UPDATED[settings.language] || LAST_UPDATED["en"]}
                </p>
                <div className="h-10 w-full shrink-0" />
              </motion.div>
            )}

            {activeScreen === "PRIVACY_POLICY" &&
              (() => {
                const privacyDisclaimer =
                  PRIVACY_DISCLAIMER[settings.language] ||
                  PRIVACY_DISCLAIMER["en"];
                return (
                  <motion.div
                    key="PRIVACY_POLICY"
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="p-4 px-5 flex flex-col gap-4 absolute inset-0 h-max"
                  >
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
                      <p className="text-primary font-semibold text-sm">
                        {privacyDisclaimer.title}
                      </p>
                      <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">
                        {privacyDisclaimer.body}
                      </p>
                    </div>
                    {(
                      PRIVACY_ITEMS[settings.language] || PRIVACY_ITEMS["en"]
                    ).map((s) => (
                      <div key={s.title} className="flex flex-col gap-1">
                        <span className="text-on-surface font-semibold text-[0.95rem]">
                          {s.title}
                        </span>
                        <span className="text-on-surface-variant text-[0.88rem] leading-relaxed">
                          {s.body}
                        </span>
                      </div>
                    ))}
                    <p className="text-on-surface-variant/50 text-xs pt-2">
                      {LAST_UPDATED[settings.language] || LAST_UPDATED["en"]}
                    </p>
                    <div className="h-10 w-full shrink-0" />
                  </motion.div>
                );
              })()}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
