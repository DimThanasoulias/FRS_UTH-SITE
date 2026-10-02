/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DayProgram, ShowDescription, ArchiveItem, StationEvent } from "../types";
import { SHOW_FILES } from "virtual:show-images";

export interface GalleryImage {
  id: string;
  name: string;
  category: string;
  path: string;
}

// Known curated names & categories for default images
const KNOWN_PRESETS: Record<string, { name: string; category: string }> = {
  "vinyl.jpg": { name: "Vinyl Player & LP", category: "Μουσική Ροή" },
  "studio.jpg": { name: "Radio Studio & Mic", category: "Broadcast" },
  "on-air.png": { name: "On Air Neon & Mixer", category: "Live Studio" },
  "concert.jpg": { name: "Concert & Party", category: "Live Stage" },
  "drink-and-roll.jpg": { name: "Drink N Roll", category: "Rock Show" },
  "girls-next-door.jpg": { name: "The Girls Next Door", category: "Talk & Pop" },
  "arlekin.jpg": { name: "Αρλεκίν", category: "Έντεχνο & Λαϊκό" },
  "masa-kai-arkoudios.jpg": { name: "Η Μάσα και ο Αρκούδιος", category: "Stories & Eclectic" },
  "oso-boreis-entechna.jpg": { name: "Όσο Μπορείς Έντεχνα", category: "Έντεχνο" }
};

function formatImageTitle(fileName: string): string {
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
  return nameWithoutExt
    .split(/[-_]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const fallbackFiles = ["vinyl.jpg", "studio.jpg", "on-air.png", "concert.jpg"];
const availableFiles = Array.isArray(SHOW_FILES) && SHOW_FILES.length > 0 ? SHOW_FILES : fallbackFiles;

export const SHOW_GALLERY_PRESETS: GalleryImage[] = availableFiles.map((file) => {
  const id = file.replace(/\.[^/.]+$/, "");
  const known = KNOWN_PRESETS[file.toLowerCase()];
  return {
    id,
    name: known ? known.name : formatImageTitle(file),
    category: known ? known.category : "Σταθμός",
    path: `/shows/${file}`
  };
});

export const WEEKLY_SCHEDULE_EN: DayProgram[] = [
  {
    day: "Mon",
    fullName: "Monday",
    shows: [
      {
        id: "show-arlekin",
        title: "Arlekin",
        time: "20:00 - 22:00",
        host: "Arlekin",
        tags: ["#Entechno", "#Laiko", "#Rebetiko"],
        description: "Beloved songs from Greek entechno, laiko, and rebetiko repertoire, paired with international tracks and melodies.",
        image: "/shows/arlekin.jpg"
      }
    ]
  },
  {
    day: "Tue",
    fullName: "Tuesday",
    shows: [
      {
        id: "show-girls-next-door",
        title: "The Girls Next Door",
        time: "18:00 - 20:00",
        host: "The Girls Next Door",
        tags: ["#GirlTalk", "#PopCulture", "#StudentLife"],
        description: "If student life was a song, it would play on The Girls Next Door — where girl talk goes on air! Join us as we discuss hot topics, student vibes, movies, books, celeb gossip, and games with listeners. Because in the end... the radio idea made it out of the group chat! 💬",
        image: "/shows/girls-next-door.jpg"
      }
    ]
  },
  {
    day: "Wed",
    fullName: "Wednesday",
    shows: [
      {
        id: "show-oso-boreis-entechna",
        title: "Oso Boreis Entechna",
        time: "19:00 - 21:00",
        host: "Entechno Crew",
        tags: ["#Entechno", "#StudentLife", "#LiveChat"],
        description: "A show rooted in Greek entechno music with romance and nostalgia, seasoned with student energy and diverse influences from rock to rap and rebetiko. The live chat is yours to request songs and shape tribute nights! Tune in with us!",
        image: "/shows/oso-boreis-entechna.jpg"
      }
    ]
  },
  {
    day: "Thu",
    fullName: "Thursday",
    shows: [
      {
        id: "show-masa-kai-arkoudios",
        title: "Masa & Arkoudios",
        time: "18:00 - 20:00",
        host: "Masa & Arkoudios",
        tags: ["#Stories", "#Eclectic", "#RadioCrew"],
        description: "Do you love everyday stories, spontaneous banter, and an eclectic mix of music? Then 'Masa and Arkoudios' is your show — a radio crew that never gets boring.",
        image: "/shows/masa-kai-arkoudios.jpg"
      }
    ]
  },
  {
    day: "Fri",
    fullName: "Friday",
    shows: [
      {
        id: "show-drink-n-roll",
        title: "Drink N Roll",
        time: "22:00 - 00:00",
        host: "Drink N Roll Crew",
        tags: ["#Rock", "#NightSession", "#Talk"],
        description: "A chaotic musical journey packed with rock energy, artist trivia, campus updates, and laid-back late-night conversations. Grab a beer, chill out, and tune in late at night.",
        image: "/shows/drink-and-roll.jpg"
      }
    ]
  },
  {
    day: "Sat",
    fullName: "Saturday",
    shows: []
  },
  {
    day: "Sun",
    fullName: "Sunday",
    shows: []
  }
];

export const WEEKLY_SCHEDULE_GR: DayProgram[] = [
  {
    day: "Δευ",
    fullName: "Δευτέρα",
    shows: [
      {
        id: "show-arlekin",
        title: "Αρλεκίν",
        time: "20:00 - 22:00",
        host: "Αρλεκίν",
        tags: ["#Entechno", "#Laiko", "#Rebetiko"],
        description: "Τραγούδια αγαπημένα από έντεχνο, λαϊκό, ρεμπέτικο ρεπερτόριο αλλά και με ξενόγλωσσο στίχο.",
        image: "/shows/arlekin.jpg"
      }
    ]
  },
  {
    day: "Τρι",
    fullName: "Τρίτη",
    shows: [
      {
        id: "show-girls-next-door",
        title: "The Girls Next Door",
        time: "18:00 - 20:00",
        host: "The Girls Next Door",
        tags: ["#GirlTalk", "#PopCulture", "#StudentLife"],
        description: "Αν η φοιτητική ζωή ήταν τραγούδι, σίγουρα θα έπαιζε στο The Girls Next Door — εκεί όπου το girl talk γίνεται… on air! 🎙️ Δεν είμαστε απλώς τα κορίτσια της διπλανής πόρτας, αλλά εκείνες που σχολιάζουν τα πιο hot topics, μοιράζονται random σκέψεις, όλα τα φοιτητικά feelings και φυσικά, σας κρατούν συντροφιά με την καλύτερη μουσική! 🎶 Από νέα ταινιών, σειρών και βιβλίων μέχρι celeb gossip, νέους δίσκους και διαδραστικά παιχνίδια με τους ακροατές — όλα έχουν θέση στην εκπομπή μας. Γιατί τελικά… η ιδέα για το ραδιόφωνο made it out of the group chat! 💬",
        image: "/shows/girls-next-door.jpg"
      }
    ]
  },
  {
    day: "Τετ",
    fullName: "Τετάρτη",
    shows: [
      {
        id: "show-oso-boreis-entechna",
        title: "Όσο Μπορείς Έντεχνα",
        time: "19:00 - 21:00",
        host: "Έντεχνη Παρέα",
        tags: ["#Entechno", "#StudentVibes", "#LiveChat"],
        description: "Μία εκπομπή βασισμένη στο έντεχνο, με διακριτά στοιχεία ρομαντισμού και πινελιές νοσταλγίας. Ωστόσο, ως γνήσιοι φοιτητές, το μιουσικ τειστ μας είναι πιο ακατάστατο και από τη ζωή μας. Από τη μία υπάρχουν μέρες που ξημερώνουμε στο Σαντάν και άλλες που το πρωί μας βρίσκει στα ρεμπετάδικα. Έτσι και η εκπομπή, χωρίς να παρεκκλίνει από το βασικό της πυρήνα, το έντεχνο, θα περιέχει επιρροές και άλλων ειδών μουσικής, βασισμένες στη θεματολογία της ημέρας, όπως ροκ, ραπ και οτιδήποτε άλλο νιώσεις πως πρέπει να ακουστεί (Γι' αυτό θυμήσου, το chat του ραδιοφώνου είναι για σένα.) Όπως προαναφέραμε λοιπόν, σε χιουμοριστικό τόνο, επιθυμούμε την ανάμιξή σας με την εκπομπή, ώστε να δημιουργήσουμε βραδιές-αφιέρωμα και να αναπτύξουμε θεματολογίες βασισμένες σε δικές σας ιδέες και προβληματισμούς. Συντονίσου στην παρέα μας!",
        image: "/shows/oso-boreis-entechna.jpg"
      }
    ]
  },
  {
    day: "Πεμ",
    fullName: "Πέμπτη",
    shows: [
      {
        id: "show-masa-kai-arkoudios",
        title: "Η Μάσα και ο Αρκούδιος",
        time: "18:00 - 20:00",
        host: "Μάσα & Αρκούδιος",
        tags: ["#Stories", "#Eclectic", "#RadioCrew"],
        description: "Σου αρέσουν οι καθημερινές ιστορίες, οι αυθόρμητες κουβέντες και πολλά διαφορετικά είδη μουσικής; Τότε η «Μάσα και ο Αρκούδιος» είναι η εκπομπή σου. Μια ραδιοφωνική παρέα που δεν βαριέται ποτέ.",
        image: "/shows/masa-kai-arkoudios.jpg"
      }
    ]
  },
  {
    day: "Παρ",
    fullName: "Παρασκευή",
    shows: [
      {
        id: "show-drink-n-roll",
        title: "Drink N Roll",
        time: "22:00 - 00:00",
        host: "Drink N Roll Crew",
        tags: ["#Rock", "#NightSession", "#Talk"],
        description: "Ένα μουσικό-χαοτικό ταξίδι γεμάτο rock ενέργεια, fun facts για καλλιτέχνες, ενημέρωση και χαλαρές συζητήσεις που δεν ξέρεις ποτέ πού θα καταλήξουν. Have a drink on me, όπως λένε και οι AC/DC πιάσε μια μπύρα, άραξε και έλα να τα πούμε αργά το βράδυ.",
        image: "/shows/drink-and-roll.jpg"
      }
    ]
  },
  {
    day: "Σαβ",
    fullName: "Σάββατο",
    shows: []
  },
  {
    day: "Κυρ",
    fullName: "Κυριακή",
    shows: []
  }
];

export const SHOWS_DESCRIPTIONS_EN: ShowDescription[] = [
  {
    id: "show-drink-n-roll",
    title: "Drink N Roll",
    host: "Drink N Roll Crew",
    description: "A chaotic musical journey packed with rock energy, artist trivia, campus updates, and laid-back late-night conversations. Grab a beer, chill out, and tune in late at night.",
    tags: ["#Rock", "#NightSession", "#Talk"],
    image: "/shows/drink-and-roll.jpg"
  },
  {
    id: "show-girls-next-door",
    title: "The Girls Next Door",
    host: "The Girls Next Door",
    description: "If student life was a song, it would play on The Girls Next Door — where girl talk goes on air! Join us as we discuss hot topics, student vibes, movies, books, celeb gossip, and games with listeners. Because in the end... the radio idea made it out of the group chat! 💬",
    tags: ["#GirlTalk", "#PopCulture", "#StudentLife"],
    image: "/shows/girls-next-door.jpg"
  },
  {
    id: "show-arlekin",
    title: "Arlekin",
    host: "Arlekin",
    description: "Beloved songs from Greek entechno, laiko, and rebetiko repertoire, paired with international tracks and melodies.",
    tags: ["#Entechno", "#Laiko", "#Rebetiko"],
    image: "/shows/arlekin.jpg"
  },
  {
    id: "show-masa-kai-arkoudios",
    title: "Masa & Arkoudios",
    host: "Masa & Arkoudios",
    description: "Do you love everyday stories, spontaneous conversations, and an eclectic mix of music? Then 'Masa and Arkoudios' is your show — a radio crew that never gets boring.",
    tags: ["#Stories", "#Eclectic", "#RadioCrew"],
    image: "/shows/masa-kai-arkoudios.jpg"
  },
  {
    id: "show-oso-boreis-entechna",
    title: "Oso Boreis Entechna",
    host: "Entechno Crew",
    description: "A show rooted in Greek entechno music with romance and nostalgia, seasoned with student energy and diverse influences from rock to rap and rebetiko. The live chat is yours to request songs and shape tribute nights! Tune in with us!",
    tags: ["#Entechno", "#StudentLife", "#LiveChat"],
    image: "/shows/oso-boreis-entechna.jpg"
  }
];

export const SHOWS_DESCRIPTIONS_GR: ShowDescription[] = [
  {
    id: "show-drink-n-roll",
    title: "Drink N Roll",
    host: "Drink N Roll Crew",
    description: "Ένα μουσικό-χαοτικό ταξίδι γεμάτο rock ενέργεια, fun facts για καλλιτέχνες, ενημέρωση και χαλαρές συζητήσεις που δεν ξέρεις ποτέ πού θα καταλήξουν. Have a drink on me, όπως λένε και οι AC/DC πιάσε μια μπύρα, άραξε και έλα να τα πούμε αργά το βράδυ.",
    tags: ["#Rock", "#NightSession", "#Talk"],
    image: "/shows/drink-and-roll.jpg"
  },
  {
    id: "show-girls-next-door",
    title: "The Girls Next Door",
    host: "The Girls Next Door",
    description: "Αν η φοιτητική ζωή ήταν τραγούδι, σίγουρα θα έπαιζε στο The Girls Next Door — εκεί όπου το girl talk γίνεται… on air! 🎙️ Δεν είμαστε απλώς τα κορίτσια της διπλανής πόρτας, αλλά εκείνες που σχολιάζουν τα πιο hot topics, μοιράζονται random σκέψεις, όλα τα φοιτητικά feelings και φυσικά, σας κρατούν συντροφιά με την καλύτερη μουσική! 🎶 Από νέα ταινιών, σειρών και βιβλίων μέχρι celeb gossip, νέους δίσκους και διαδραστικά παιχνίδια με τους ακροατές — όλα έχουν θέση στην εκπομπή μας. Γιατί τελικά… η ιδέα για το ραδιόφωνο made it out of the group chat! 💬",
    tags: ["#GirlTalk", "#PopCulture", "#StudentLife"],
    image: "/shows/girls-next-door.jpg"
  },
  {
    id: "show-arlekin",
    title: "Αρλεκίν",
    host: "Αρλεκίν",
    description: "Τραγούδια αγαπημένα από έντεχνο, λαϊκό, ρεμπέτικο ρεπερτόριο αλλά και με ξενόγλωσσο στίχο.",
    tags: ["#Entechno", "#Laiko", "#Rebetiko"],
    image: "/shows/arlekin.jpg"
  },
  {
    id: "show-masa-kai-arkoudios",
    title: "Η Μάσα και ο Αρκούδιος",
    host: "Μάσα & Αρκούδιος",
    description: "Σου αρέσουν οι καθημερινές ιστορίες, οι αυθόρμητες κουβέντες και πολλά διαφορετικά είδη μουσικής; Τότε η «Μάσα και ο Αρκούδιος» είναι η εκπομπή σου. Μια ραδιοφωνική παρέα που δεν βαριέται ποτέ.",
    tags: ["#Stories", "#Eclectic", "#RadioCrew"],
    image: "/shows/masa-kai-arkoudios.jpg"
  },
  {
    id: "show-oso-boreis-entechna",
    title: "Όσο Μπορείς Έντεχνα",
    host: "Έντεχνη Παρέα",
    description: "Μία εκπομπή βασισμένη στο έντεχνο, με διακριτά στοιχεία ρομαντισμού και πινελιές νοσταλγίας. Ωστόσο, ως γνήσιοι φοιτητές, το μιουσικ τειστ μας είναι πιο ακατάστατο και από τη ζωή μας. Από τη μία υπάρχουν μέρες που ξημερώνουμε στο Σαντάν και άλλες που το πρωί μας βρίσκει στα ρεμπετάδικα. Έτσι και η εκπομπή, χωρίς να παρεκκλίνει από το βασικό της πυρήνα, το έντεχνο, θα περιέχει επιρροές και άλλων ειδών μουσικής, βασισμένες στη θεματολογία της ημέρας, όπως ροκ, ραπ και οτιδήποτε άλλο νιώσεις πως πρέπει να ακουστεί (Γι' αυτό θυμήσου, το chat του ραδιοφώνου είναι για σένα.) Όπως προαναφέραμε λοιπόν, σε χιουμοριστικό τόνο, επιθυμούμε την ανάμιξή σας με την εκπομπή, ώστε να δημιουργήσουμε βραδιές-αφιέρωμα και να αναπτύξουμε θεματολογίες βασισμένες σε δικές σας ιδέες και προβληματισμούς. Συντονίσου στην παρέα μας!",
    tags: ["#Entechno", "#StudentVibes", "#LiveChat"],
    image: "/shows/oso-boreis-entechna.jpg"
  }
];

export const ARCHIVE_ITEMS_EN: ArchiveItem[] = [
  {
    id: "arc1",
    title: "Midnight Circuits Vol. 4",
    date: "Oct 24, 2024",
    description: "Vertex tearing through heavy industrial techno cuts and unreleased student demos.",
    tags: ["#Techno", "#Underground"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCew2lvki29-0UvxsVFeNF-kjaXUlqf4IiOhuJpu786GZDycUAr1AISsZ1gIFczB-NHo6SfTxnLmm-SYa5gKR_onEnRmKGAiSOqPg5v6QQpLOjQoJxfJ4kE8Ba6dq5iDlZgphOvT43vo2vmtAuLgdjPnLLZJ34RUSMBLWKpge9m3OGmDRxPFb4p1ikwLUO8EvOebTGJ6O_ersz16erBmBbE06P922krmrwO0Gu43L3M3V_7f1aoOrO26-I8sAIEUY0oU00vzYxNsYE"
  },
  {
    id: "arc2",
    title: "Study Session Frequencies",
    date: "Oct 18, 2024",
    description: "Two hours of uninterrupted chillhop and ambient beats to get you through finals week.",
    tags: ["#LoFi", "#Beats"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBD1tCw1ZdYSPE8sqn3COrBeM2gINnSp61A8rRSscwLAhoPR_2wHHKVMjSNnTPj3rL6JQl554N5DF5f8oTZ9q4C1fZp85yCCp-rZz5aOmBejRD9vVVQdiFq2ykLwa2w7SJVuMOLkP3zZQlLV2I9oxoCujQaQShaPN-4fz_GNh_aYAinzII14DHSPIx3uNP_7nuw_xEhrfqF6MQ6Q2g6OBX7wQI3l_NPh7qW2UCGvFC5zeSjq5UvcNapjoujVE6so8gCtnPT7Ka_GY"
  },
  {
    id: "arc3",
    title: "The Morning Debrief",
    date: "Oct 15, 2024",
    description: "Discussing the latest campus events, upcoming elections, and an interview with the Dean.",
    tags: ["#Talk", "#CampusNews"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0F5VnEb95pMmoOd7t61PWGX_MujYYBI5bFGarpZ2WMPDlBo-t6c0zYMIyCO2RvOonMCdbTTvMQ-hnVA2N0UWGsCoESpPaTJZLlsksIk6s5VlJB6BO_GWk0mkmxRZTib1a9EQNM2gLigXl0GHtYmcdE-85jLZ4DUpNgcXDfB2IuZpzQDHmB7udf6U1tiwLIEu0ful89iS4_2eECkEr5vmIf38cRnT2j0BZJIIMUMHtfLoGscoW80or4BloZNwQR1RJScM-eN08Uog"
  }
];

export const ARCHIVE_ITEMS_GR: ArchiveItem[] = [
  {
    id: "arc1",
    title: "Midnight Circuits Vol. 4",
    date: "24 Οκτ 2024",
    description: "Ο Vertex σαρώνει με heavy industrial techno κομμάτια και ακυκλοφόρητα demos φοιτητών.",
    tags: ["#Techno", "#Underground"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCew2lvki29-0UvxsVFeNF-kjaXUlqf4IiOhuJpu786GZDycUAr1AISsZ1gIFczB-NHo6SfTxnLmm-SYa5gKR_onEnRmKGAiSOqPg5v6QQpLOjQoJxfJ4kE8Ba6dq5iDlZgphOvT43vo2vmtAuLgdjPnLLZJ34RUSMBLWKpge9m3OGmDRxPFb4p1ikwLUO8EvOebTGJ6O_ersz16erBmBbE06P922krmrwO0Gu43L3M3V_7f1aoOrO26-I8sAIEUY0oU00vzYxNsYE"
  },
  {
    id: "arc2",
    title: "Study Session Frequencies",
    date: "18 Οκτ 2024",
    description: "Δύο ώρες αδιάκοπου chillhop και ambient beats για να σας κρατήσουν συντροφιά στην εξεταστική.",
    tags: ["#LoFi", "#Beats"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBD1tCw1ZdYSPE8sqn3COrBeM2gINnSp61A8rRSscwLAhoPR_2wHHKVMjSNnTPj3rL6JQl554N5DF5f8oTZ9q4C1fZp85yCCp-rZz5aOmBejRD9vVVQdiFq2ykLwa2w7SJVuMOLkP3zZQlLV2I9oxoCujQaQShaPN-4fz_GNh_aYAinzII14DHSPIx3uNP_7nuw_xEhrfqF6MQ6Q2g6OBX7wQI3l_NPh7qW2UCGvFC5zeSjq5UvcNapjoujVE6so8gCtnPT7Ka_GY"
  },
  {
    id: "arc3",
    title: "The Morning Debrief",
    date: "15 Οκτ 2024",
    description: "Συζήτηση για τα τελευταία πανεπιστημιακά γεγονότα, επικείμενες εκλογές και συνέντευξη με τον Κοσμήτορα.",
    tags: ["#Talk", "#CampusNews"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0F5VnEb95pMmoOd7t61PWGX_MujYYBI5bFGarpZ2WMPDlBo-t6c0zYMIyCO2RvOonMCdbTTvMQ-hnVA2N0UWGsCoESpPaTJZLlsksIk6s5VlJB6BO_GWk0mkmxRZTib1a9EQNM2gLigXl0GHtYmcdE-85jLZ4DUpNgcXDfB2IuZpzQDHmB7udf6U1tiwLIEu0ful89iS4_2eECkEr5vmIf38cRnT2j0BZJIIMUMHtfLoGscoW80or4BloZNwQR1RJScM-eN08Uog"
  }
];

export const EXTRA_ARCHIVE_ITEMS_EN: ArchiveItem[] = [
  {
    id: "arc4",
    title: "Experimental Night",
    date: "Oct 12, 2024",
    description: "Glitch hop, IDM, and audio experiments from the media arts department.",
    tags: ["#Experimental", "#IDM"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHXG2Y29-0UvxsVFeNF-kjaXUlqf4IiOhuJpu786GZDycUAr1AISsZ1gIFczB-NHo6SfTxnLmm-SYa5gKR_onEnRmKGAiSOqPg5v6QQpLOjQoJxfJ4kE8Ba6dq5iDlZgphOvT43vo2vmtAuLgdjPnLLZJ34RUSMBLWKpge9m3OGmDRxPFb4p1ikwLUO8EvOebTGJ6O_ersz16erBmBbE06P922krmrwO0Gu43L3M3V_7f1aoOrO26-I8sAIEUY0oU00vzYxNsYE"
  },
  {
    id: "arc5",
    title: "Rhythm & Soul",
    date: "Oct 08, 2024",
    description: "Warm vinyl grooves from the jazz archive mixed with modern neo-soul vibes.",
    tags: ["#Jazz", "#Soul"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBD1tCw1ZdYSPE8sqn3COrBeM2gINnSp61A8rRSscwLAhoPR_2wHHKVMjSNnTPj3rL6JQl554N5DF5f8oTZ9q4C1fZp85yCCp-rZz5aOmBejRD9vVVQdiFq2ykLwa2w7SJVuMOLkP3zZQlLV2I9oxoCujQaQShaPN-4fz_GNh_aYAinzII14DHSPIx3uNP_7nuw_xEhrfqF6MQ6Q2g6OBX7wQI3l_NPh7qW2UCGvFC5zeSjq5UvcNapjoujVE6so8gCtnPT7Ka_GY"
  },
  {
    id: "arc6",
    title: "The Indie Hour",
    date: "Oct 05, 2024",
    description: "Highlighting local band demos and the freshest alternative student picks.",
    tags: ["#Indie", "#Local"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0F5VnEb95pMmoOd7t61PWGX_MujYYBI5bFGarpZ2WMPDlBo-t6c0zYMIyCO2RvOonMCdbTTvMQ-hnVA2N0UWGsCoESpPaTJZLlsksIk6s5VlJB6BO_GWk0mkmxRZTib1a9EQNM2gLigXl0GHtYmcdE-85jLZ4DUpNgcXDfB2IuZpzQDHmB7udf6U1tiwLIEu0ful89iS4_2eECkEr5vmIf38cRnT2j0BZJIIMUMHtfLoGscoW80or4BloZNwQR1RJScM-eN08Uog"
  }
];

export const EXTRA_ARCHIVE_ITEMS_GR: ArchiveItem[] = [
  {
    id: "arc4",
    title: "Experimental Night",
    date: "12 Οκτ 2024",
    description: "Glitch hop, IDM, και ηχητικοί πειραματισμοί από το τμήμα ψηφιακών τεχνών.",
    tags: ["#Experimental", "#IDM"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHXG2Y29-0UvxsVFeNF-kjaXUlqf4IiOhuJpu786GZDycUAr1AISsZ1gIFczB-NHo6SfTxnLmm-SYa5gKR_onEnRmKGAiSOqPg5v6QQpLOjQoJxfJ4kE8Ba6dq5iDlZgphOvT43vo2vmtAuLgdjPnLLZJ34RUSMBLWKpge9m3OGmDRxPFb4p1ikwLUO8EvOebTGJ6O_ersz16erBmBbE06P922krmrwO0Gu43L3M3V_7f1aoOrO26-I8sAIEUY0oU00vzYxNsYE"
  },
  {
    id: "arc5",
    title: "Rhythm & Soul",
    date: "08 Οκτ 2024",
    description: "Ζεστές αυλακώσεις βινυλίου από το αρχείο της jazz αναμεμειγμένες με neo-soul.",
    tags: ["#Jazz", "#Soul"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBD1tCw1ZdYSPE8sqn3COrBeM2gINnSp61A8rRSscwLAhoPR_2wHHKVMjSNnTPj3rL6JQl554N5DF5f8oTZ9q4C1fZp85yCCp-rZz5aOmBejRD9vVVQdiFq2ykLwa2w7SJVuMOLkP3zZQlLV2I9oxoCujQaQShaPN-4fz_GNh_aYAinzII14DHSPIx3uNP_7nuw_xEhrfqF6MQ6Q2g6OBX7wQI3l_NPh7qW2UCGvFC5zeSjq5UvcNapjoujVE6so8gCtnPT7Ka_GY"
  },
  {
    id: "arc6",
    title: "The Indie Hour",
    date: "05 Οκτ 2024",
    description: "Προβολή τοπικών συγκροτημάτων και εναλλακτικών φοιτητικών επιλογών.",
    tags: ["#Indie", "#Local"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0F5VnEb95pMmoOd7t61PWGX_MujYYBI5bFGarpZ2WMPDlBo-t6c0zYMIyCO2RvOonMCdbTTvMQ-hnVA2N0UWGsCoESpPaTJZLlsksIk6s5VlJB6BO_GWk0mkmxRZTib1a9EQNM2gLigXl0GHtYmcdE-85jLZ4DUpNgcXDfB2IuZpzQDHmB7udf6U1tiwLIEu0ful89iS4_2eECkEr5vmIf38cRnT2j0BZJIIMUMHtfLoGscoW80or4BloZNwQR1RJScM-eN08Uog"
  }
];

export const DEFAULT_EVENTS_GR: StationEvent[] = [
  {
    id: "ev1",
    dayNum: "18",
    monthStr: "ΜΑΙ",
    categoryBadge: "Festival & Outdoor Stage",
    timeLocation: "🕒 19:30 • 📍 Πεδίον του Άρεως, Βόλος",
    title: "Campus Spring Festival 2026",
    description: "Το μεγαλύτερο φοιτητικό φεστιβάλ του Βόλου επιστρέφει με live bands, indie alternative acts και live stages στο Πεδίον του Άρεως. Μια ολόκληρη ημέρα γεμάτη μουσική, live ραδιοφωνικές συνεντεύξεις στον αέρα και ελεύθερη είσοδο για όλη την πανεπιστημιακή κοινότητα.",
    tags: ["#LiveBands", "#FreeEntry", "#OutdoorStage", "#VolosCampus"]
  },
  {
    id: "ev2",
    dayNum: "24",
    monthStr: "ΜΑΙ",
    categoryBadge: "Workshop & Studio Training",
    timeLocation: "🕒 17:00 • 📍 FRS Broadcast Studio A",
    title: "Workshop: Podcast & Audio Production",
    description: "Εξειδικευμένο εργαστήριο ήχου και παραγωγής εκπομπών από τους τεχνικούς και παραγωγούς του σταθμού. Πρακτική εκπαίδευση σε κονσόλες μίξης, μικροφωνικές τεχνικές, ηχογράφηση φωνής, mastering podcast επεισοδίων και live streaming workflows.",
    tags: ["#Podcast", "#SoundMixing", "#StudioA", "#RadioSkills"]
  },
  {
    id: "ev3",
    dayNum: "06",
    monthStr: "ΙΟΥΝ",
    categoryBadge: "Vinyl Session",
    timeLocation: "🕒 21:00 • 📍 Πολυτεχνείο Βόλου",
    title: "Vinyl Night: Lo-Fi Beats & Analog Sound",
    description: "Βραδιά αφιερωμένη στον αναλογικό ήχο και τη μαγεία του βινυλίου. Οι παραγωγοί του σταθμού επιλέγουν rare grooves, soul, funk και lo-fi hip hop αποκλειστικά από δίσκους βινυλίου με ζωντανή αναμετάδοση στο web stream.",
    tags: ["#VinylOnly", "#Analog", "#ChillVibes"]
  }
];

export const DEFAULT_EVENTS_EN: StationEvent[] = [
  {
    id: "ev1",
    dayNum: "18",
    monthStr: "MAY",
    categoryBadge: "Festival & Outdoor Stage",
    timeLocation: "🕒 19:30 • 📍 Pedion tou Areos, Volos",
    title: "Campus Spring Festival 2026",
    description: "The biggest student festival in Volos returns with live bands, indie alternative acts, and live stages at Pedion tou Areos. A full day of live music, on-air radio interviews, and free entry for the entire university community.",
    tags: ["#LiveBands", "#FreeEntry", "#OutdoorStage", "#VolosCampus"]
  },
  {
    id: "ev2",
    dayNum: "24",
    monthStr: "MAY",
    categoryBadge: "Workshop & Studio Training",
    timeLocation: "🕒 17:00 • 📍 FRS Broadcast Studio A",
    title: "Workshop: Podcast & Audio Production",
    description: "Hands-on audio and broadcasting workshop led by station sound engineers and hosts. Practical training in mixing desks, microphone techniques, voice recording, podcast mastering, and live streaming workflows.",
    tags: ["#Podcast", "#SoundMixing", "#StudioA", "#RadioSkills"]
  },
  {
    id: "ev3",
    dayNum: "06",
    monthStr: "JUN",
    categoryBadge: "Vinyl Session",
    timeLocation: "🕒 21:00 • 📍 Volos Polytechnic",
    title: "Vinyl Night: Lo-Fi Beats & Analog Sound",
    description: "An evening dedicated to analog sound and vinyl groove. Station producers spin rare grooves, soul, funk, and lo-fi hip hop strictly from vinyl records with live broadcast on the web radio stream.",
    tags: ["#VinylOnly", "#Analog", "#ChillVibes"]
  }
];

