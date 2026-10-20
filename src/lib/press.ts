/**
 * Media appearances of Βάσω Πανταζή (TV, radio, press, social).
 * Add new entries at the top. `url` should point to the original source
 * (YouTube, Facebook, a news site). Entries marked `archive` still link to
 * a post on the old vasopantazi.gr site — replace those links before that
 * site is taken down.
 */

export type PressKind = "video" | "article" | "audio";

export type PressItem = {
  date: string; // YYYY-MM-DD
  title: string;
  source: string; // shown as the outlet / platform
  kind: PressKind;
  url: string;
  archive?: boolean;
};

const OLD = "https://vasopantazi.gr";

export const pressItems: PressItem[] = [
  {
    date: "2026-10-07",
    title: "Υπόθεση Άλεξ: «Δεν δολοφονήθηκε, απήχθη»",
    source: "Pronews · Instagram",
    kind: "video",
    url: "https://www.instagram.com/reel/DeLtmypR86G/",
  },
  {
    date: "2026-09-07",
    title: "Συνήγορος υπεράσπισης στην υπόθεση Λυγγερίδη",
    source: "Ανακοίνωση γραφείου",
    kind: "article",
    url: `${OLD}/συνήγορος-υπεράσπισης-στην-υπόθεση-λ/`,
    archive: true,
  },
  {
    date: "2026-09-07",
    title: "Δολοφόνησε τον βιαστή του και το δικαστήριο επέβαλε την ελάχιστη των ποινών",
    source: "Ανακοίνωση γραφείου",
    kind: "article",
    url: `${OLD}/δολοφόνησε-το-βιαστή-του-και-το-δικαστ/`,
    archive: true,
  },
  {
    date: "2026-08-07",
    title: "Σύγκρουση ελικοπτέρων στην Ψάθα",
    source: "Αρχείο γραφείου",
    kind: "video",
    url: `${OLD}/σύγκρουση-ελικοπτέρων-στην-ψάθα/`,
    archive: true,
  },
  {
    date: "2026-04-06",
    title: "Συνεχίζεται η δίκη για τα Τέμπη: Βάσω Πανταζή, δικηγόρος συγγενών",
    source: "YouTube",
    kind: "video",
    url: "https://www.youtube.com/watch?v=rY3tKdt6oy4",
  },
  {
    date: "2026-02-28",
    title: "Τέμπη: 3 χρόνια μετά το έγκλημα, λίγες μέρες πριν τη δίκη",
    source: "ΣΚΑΪ 100,3",
    kind: "audio",
    url: "https://www.skairadio.gr/imerologio/episode-2026-02-27",
  },
  {
    date: "2026-02-27",
    title: "Η αναπηρία της Ρούλας Πισπιρίγκου πιθανόν να την οδηγήσει σε αποφυλάκιση",
    source: "YouTube",
    kind: "video",
    url: "https://www.youtube.com/watch?v=qLzv21PUFTQ",
  },
  {
    date: "2026-01-20",
    title: "Σκληρή κόντρα Πανταζή – Κωνσταντοπούλου για το ελαφρυντικό του Κορκονέα",
    source: "YouTube",
    kind: "video",
    url: "https://www.youtube.com/watch?v=O-O3EvGiMbI",
  },
  {
    date: "2025-12-16",
    title: "Ολική ανατροπή στην υπόθεση Πλατανιά Κρήτης",
    source: "Facebook",
    kind: "video",
    url: "https://www.facebook.com/reel/2053675258801269/",
  },
  {
    date: "2025-06-30",
    title: "Πατέρας φυλακίστηκε και αθωώθηκε στο Εφετείο μετά από 14 χρόνια για ασέλγεια στα δύο κορίτσια του",
    source: "Ανακοίνωση γραφείου",
    kind: "article",
    url: `${OLD}/πατέρας-φυλακίστηκε-και-αθωώθηκε-στο/`,
    archive: true,
  },
  {
    date: "2025-05-01",
    title:
      "Η πρώτη δικαστική απόφαση αποζημίωσης από το Ελληνικό Δημόσιο σε Έλληνα πολίτη μετά από παρενέργειες του εμβολίου AstraZeneca για τον COVID-19",
    source: "YouTube",
    kind: "video",
    url: "https://www.youtube.com/watch?v=Wqs2Y68y2xs",
  },
  {
    date: "2025-04-19",
    title: "Υπόθεση δολοφονίας 28χρονου στην Κυψέλη",
    source: "Ανακοίνωση γραφείου",
    kind: "article",
    url: `${OLD}/υπόθεση-δολοφονίας-28-χρονου-στήν-κυψέλ/`,
    archive: true,
  },
  {
    date: "2025-04-04",
    title: "Νέα διακοπή στη δίκη Κορκονέα στο Μικτό Ορκωτό Εφετείο Λαμίας",
    source: "Lamia Report",
    kind: "article",
    url: "https://www.lamiareport.gr/topika/topikanea/item/lamia-diakopi-sti-diki-korkonea-paraitithike-i-synigoros-tou-meta-apo-entoni-antiparathesi-me-konstantopoulou/",
  },
  {
    date: "2025-03-19",
    title: "Η Βάσω Πανταζή αναλαμβάνει την υπεράσπιση της Ρούλας Πισπιρίγκου",
    source: "YouTube",
    kind: "video",
    url: "https://www.youtube.com/watch?v=kzoHfXn0Mwc",
  },
  {
    date: "2025-02-12",
    title: "Βάσω Πανταζή για τα Τέμπη και τη γνησιότητα του βίντεο που δόθηκε στη δημοσιότητα",
    source: "Αρχείο γραφείου",
    kind: "video",
    url: `${OLD}/βάσω-πανταζή-για-τέμπη-και-γνησιότητα/`,
    archive: true,
  },
  {
    date: "2025-01-29",
    title: "Γιατί καθυστερεί η δίκη των Τεμπών;",
    source: "Μανιφέστο · Facebook",
    kind: "video",
    url: "https://www.facebook.com/share/jaDPkusWh9HWy4HT/",
  },
  {
    date: "2024-10-17",
    title: "Ισόβια κάθειρξη για την ανθρωποκτονία και 13 έτη για τον βιασμό, πρωτοδίκως",
    source: "Facebook",
    kind: "article",
    url: `${OLD}/ισοβια-καθειρξη-για-την-ανθρωποκτονι/`,
    archive: true,
  },
  {
    date: "2024-10-09",
    title: "Λεπενού: Τον δρόμο της δικαιοσύνης πήρε η υπόθεση του τραγικού θανάτου του Άγγελου Κανιώτη",
    source: "Τύπος",
    kind: "article",
    url: `${OLD}/υπόθεση-του-τραγικού-θανάτου-του-άγγε/`,
    archive: true,
  },
  {
    date: "2024-05-09",
    title:
      "Συνήγορος Κασιδιάρη: «Οι Έλληνες δικαστές γνωρίζουν το καθήκον τους και δεν χρειάζονται υπομνήσεις από κανένα δήθεν ευαισθητοποιημένο δημοκράτη»",
    source: "Δήλωση",
    kind: "article",
    url: `${OLD}/συνήγορος-κασιδιάρη-οι-έλληνες-δικα/`,
    archive: true,
  },
  {
    date: "2024-04-25",
    title: "Υπόθεση Κωνσταντίνου Φλώρου (τηλεφωνική επικοινωνία)",
    source: "OPEN",
    kind: "video",
    url: "https://www.youtube.com/watch?v=uIifwGxPWuA",
  },
  {
    date: "2024-04-24",
    title: "Υπόθεση 12χρονης από τον Κολωνό",
    source: "ANT1",
    kind: "video",
    url: "https://www.youtube.com/watch?v=ivd8VcQm5ws",
  },
  {
    date: "2023-12-12",
    title: "Κύκλος νομικών διαλέξεων ποινικού δικαίου",
    source: "Εκδήλωση",
    kind: "article",
    url: `${OLD}/κύκλος-νομικών-διαλέξεων-ποινικού-δι/`,
    archive: true,
  },
  {
    date: "2023-11-09",
    title: "Αθώοι αλλά καταδικασμένοι",
    source: "ΕΡΤ",
    kind: "video",
    url: "https://www.ert.gr/webtv/live-uni/vod/dt-uni-vod.php?f=2023/tv/news-themata-noemvrios/20231108-DELTIO18-ADIKA-FYLAKH.mp4",
  },
  {
    date: "2023-10-24",
    title: "Η πρώτη άδεια του Ηλία Κασιδιάρη",
    source: "YouTube",
    kind: "video",
    url: "https://www.youtube.com/watch?v=ioGIiwc561w",
  },
  {
    date: "2023-05-07",
    title: "Βάσω Πανταζή στην Τασούλα Παπανικολάου",
    source: "Ραδιόφωνο",
    kind: "audio",
    url: `${OLD}/quisque-nec-aculis-endise-the-moss-incele-tempus-enim-maximus/`,
    archive: true,
  },
  {
    date: "2023-05-05",
    title: "57 ψυχές ζητούν δικαίωση",
    source: "Facebook",
    kind: "article",
    url: `${OLD}/57-ψυχές-ζητούν-δικαίωση/`,
    archive: true,
  },
  {
    date: "2022-12-06",
    title: "Υπεράσπιση 72χρονου ιερέα",
    source: "YouTube",
    kind: "video",
    url: "https://www.youtube.com/watch?v=zyEN1LwYPBA",
  },
  {
    date: "2020-10-13",
    title: "Υπόθεση Suzanne Eaton",
    source: "YouTube",
    kind: "video",
    url: "https://www.youtube.com/watch?v=FEpWlZBJoeQ",
  },
];

/** YouTube video id for thumbnails, if the link is a YouTube video. */
export function youtubeVideoId(url: string) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

export const pressKinds: { id: PressKind; label: string }[] = [
  { id: "video", label: "Τηλεόραση & βίντεο" },
  { id: "article", label: "Τύπος & ανακοινώσεις" },
  { id: "audio", label: "Ραδιόφωνο" },
];
