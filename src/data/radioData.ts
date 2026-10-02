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

export const ARCHIVE_ITEMS_GR: ArchiveItem[] = [
  {
    id: "show-girls-next-door",
    title: "The Girls Next Door",
    date: "Mixcloud Archive",
    description: "Το girl talk γίνεται on air! Hot topics, random σκέψεις, φοιτητικά feelings, νέα ταινιών, βιβλία, gossip και διαδραστικά παιχνίδια με τους ακροατές.",
    tags: ["#GirlTalk", "#PopCulture", "#StudentLife"],
    image: "/shows/girls-next-door.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/the-girls-next-door2024-25/"
  },
  {
    id: "show-drink-n-roll",
    title: "Drink N Roll",
    date: "Mixcloud Archive",
    description: "Ένα μουσικό-χαοτικό ταξίδι γεμάτο rock ενέργεια, fun facts για καλλιτέχνες, ενημέρωση και χαλαρές συζητήσεις που δεν ξέρεις ποτέ πού θα καταλήξουν.",
    tags: ["#Rock", "#NightSession", "#Talk"],
    image: "/shows/drink-and-roll.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/"
  },
  {
    id: "show-arlekin",
    title: "Αρλεκίν",
    date: "Mixcloud Archive",
    description: "Τραγούδια αγαπημένα από έντεχνο, λαϊκό, ρεμπέτικο ρεπερτόριο αλλά και με επιλεγμένο ξενόγλωσσο στίχο.",
    tags: ["#Entechno", "#Laiko", "#Rebetiko"],
    image: "/shows/arlekin.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/"
  },
  {
    id: "show-masa-kai-arkoudios",
    title: "Η Μάσα και ο Αρκούδιος",
    date: "Mixcloud Archive",
    description: "Καθημερινές ιστορίες, αυθόρμητες κουβέντες και εκλεκτικές μουσικές. Μια ραδιοφωνική παρέα που δεν βαριέται ποτέ.",
    tags: ["#Stories", "#Eclectic", "#RadioCrew"],
    image: "/shows/masa-kai-arkoudios.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/"
  },
  {
    id: "show-oso-boreis-entechna",
    title: "Όσο Μπορείς Έντεχνα",
    date: "Mixcloud Archive",
    description: "Βασισμένη στο έντεχνο με ρομαντισμό και νοσταλγία, εμπλουτισμένη με ροκ, ραπ και ρεμπέτικα ακούσματα και αλληλεπίδραση με το chat.",
    tags: ["#Entechno", "#StudentVibes", "#LiveChat"],
    image: "/shows/oso-boreis-entechna.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/"
  },
  {
    id: "show-metal-zone",
    title: "Metal Zone",
    date: "2024 - 2025",
    description: "Heavy metal, hard rock και underground κιθαριστικά riff από το ιστορικό αρχείο του FRS UTH.",
    tags: ["#Metal", "#HardRock", "#Archive"],
    image: "/shows/rock.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/metal-zone2024-25/"
  }
];

export const EXTRA_ARCHIVE_ITEMS_GR: ArchiveItem[] = [
  {
    id: "show-hangover",
    title: "Hangover",
    date: "2024 - 2025",
    description: "Αυθόρμητες συζητήσεις, φοιτητική καθημερινότητα και ποικίλα μουσικά ακούσματα από τους παραγωγούς του σταθμού.",
    tags: ["#Hangover", "#StudentTalk", "#Archive"],
    image: "/shows/studio.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/hangover2024-25/"
  },
  {
    id: "show-arxizei-to-mats",
    title: "Αρχίζει το Ματς",
    date: "2024 - 2025",
    description: "Αθλητική ενημέρωση, σχολιασμός της αγωνιστικής επικαιρότητας και φοιτητικός παλμός.",
    tags: ["#Sports", "#CampusTalk", "#Archive"],
    image: "/shows/concert.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/%CE%B1%CF%81%CF%87%CE%AF%CE%B6%CE%B5%CE%B9-%CF%84%CE%BF-%CE%BC%CE%B1%CF%84%CF%822024-25/"
  },
  {
    id: "show-foititikes-anisixies",
    title: "Φοιτητικές Ανησυχίες",
    date: "2024 - 2025",
    description: "Συζητήσεις για την πανεπιστημιακή ζωή, κοινωνικούς προβληματισμούς και φοιτητικά νέα.",
    tags: ["#StudentLife", "#Discussions", "#Archive"],
    image: "/shows/vinyl.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/%CF%86%CE%BF%CE%B9%CF%84%CE%B7%CF%84%CE%B9%CE%BA%CE%AD%CF%82-%CE%B1%CE%BD%CE%B7%CF%83%CF%85%CF%87%CE%AF%CE%B5%CF%822024-25/"
  },
  {
    id: "show-radio-scenario",
    title: "Ράδιο Σενάριο",
    date: "2024 - 2025",
    description: "Κινηματογράφος, σειρές, τηλεοπτικά νέα και αγαπημένα κινηματογραφικά soundtrack.",
    tags: ["#Cinema", "#Soundtracks", "#Archive"],
    image: "/shows/on-air.png",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/%CF%81%CE%AC%CE%B4%CE%B9%CE%BF-%CF%83%CE%B5%CE%BD%CE%AC%CF%81%CE%B9%CE%BF2024-25/"
  },
  {
    id: "show-cancelled",
    title: "Cancelled",
    date: "2024 - 2025",
    description: "Εκπομπή σχολιασμού και μουσικών περιπλανήσεων από την ομάδα του σταθμού.",
    tags: ["#Talk", "#Alternative", "#Archive"],
    image: "/shows/rock.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/cancelled2024-25/"
  },
  {
    id: "show-pali-deytera",
    title: "Πάλι Δευτέρα",
    date: "2024 - 2025",
    description: "Το ξεκίνημα της εβδομάδας με καλή μουσική, χιούμορ και ενέργεια.",
    tags: ["#MondayVibes", "#Eclectic", "#Archive"],
    image: "/shows/studio.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/%CF%80%CE%AC%CE%BB%CE%B9-%CE%B4%CE%B5%CF%85%CF%84%CE%AD%CF%81%CE%B12024-25/"
  }
];

export const ARCHIVE_ITEMS_EN: ArchiveItem[] = [
  {
    id: "show-girls-next-door",
    title: "The Girls Next Door",
    date: "Mixcloud Archive",
    description: "Girl talk goes on air! Hot topics, random thoughts, student feelings, movies, books, gossip, and games with listeners.",
    tags: ["#GirlTalk", "#PopCulture", "#StudentLife"],
    image: "/shows/girls-next-door.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/the-girls-next-door2024-25/"
  },
  {
    id: "show-drink-n-roll",
    title: "Drink N Roll",
    date: "Mixcloud Archive",
    description: "A chaotic musical journey packed with rock energy, artist trivia, campus updates, and laid-back late-night conversations.",
    tags: ["#Rock", "#NightSession", "#Talk"],
    image: "/shows/drink-and-roll.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/"
  },
  {
    id: "show-arlekin",
    title: "Arlekin",
    date: "Mixcloud Archive",
    description: "Beloved songs from Greek entechno, laiko, and rebetiko repertoire, paired with international tracks and melodies.",
    tags: ["#Entechno", "#Laiko", "#Rebetiko"],
    image: "/shows/arlekin.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/"
  },
  {
    id: "show-masa-kai-arkoudios",
    title: "Masa & Arkoudios",
    date: "Mixcloud Archive",
    description: "Everyday stories, spontaneous conversations, and eclectic music selections from a crew that never gets boring.",
    tags: ["#Stories", "#Eclectic", "#RadioCrew"],
    image: "/shows/masa-kai-arkoudios.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/"
  },
  {
    id: "show-oso-boreis-entechna",
    title: "Oso Boreis Entechna",
    date: "Mixcloud Archive",
    description: "Rooted in Greek entechno music with romance and nostalgia, seasoned with student energy, rock, rap, and live chat interaction.",
    tags: ["#Entechno", "#StudentLife", "#LiveChat"],
    image: "/shows/oso-boreis-entechna.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/"
  },
  {
    id: "show-metal-zone",
    title: "Metal Zone",
    date: "2024 - 2025",
    description: "Heavy metal, hard rock, and underground guitar riffs from the station archives.",
    tags: ["#Metal", "#HardRock", "#Archive"],
    image: "/shows/rock.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/metal-zone2024-25/"
  }
];

export const EXTRA_ARCHIVE_ITEMS_EN: ArchiveItem[] = [
  {
    id: "show-hangover",
    title: "Hangover",
    date: "2024 - 2025",
    description: "Spontaneous discussions, student life, and varied music selections by station hosts.",
    tags: ["#Hangover", "#StudentTalk", "#Archive"],
    image: "/shows/studio.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/hangover2024-25/"
  },
  {
    id: "show-arxizei-to-mats",
    title: "Arxizei To Mats",
    date: "2024 - 2025",
    description: "Sports updates, match reviews, and university campus sports energy.",
    tags: ["#Sports", "#CampusTalk", "#Archive"],
    image: "/shows/concert.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/%CE%B1%CF%81%CF%87%CE%AF%CE%B6%CE%B5%CE%B9-%CF%84%CE%BF-%CE%BC%CE%B1%CF%84%CF%822024-25/"
  },
  {
    id: "show-foititikes-anisixies",
    title: "Foititikes Anisixies",
    date: "2024 - 2025",
    description: "Discussions on campus student life, social topics, and student community news.",
    tags: ["#StudentLife", "#Discussions", "#Archive"],
    image: "/shows/vinyl.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/%CF%86%CE%BF%CE%B9%CF%84%CE%B7%CF%84%CE%B9%CE%BA%CE%AD%CF%82-%CE%B1%CE%BD%CE%B7%CF%83%CF%85%CF%87%CE%AF%CE%B5%CF%822024-25/"
  },
  {
    id: "show-radio-scenario",
    title: "Radio Scenario",
    date: "2024 - 2025",
    description: "Cinema, TV series, screenwriting, and iconic movie soundtracks.",
    tags: ["#Cinema", "#Soundtracks", "#Archive"],
    image: "/shows/on-air.png",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/%CF%81%CE%AC%CE%B4%CE%B9%CE%BF-%CF%83%CE%B5%CE%BD%CE%AC%CF%81%CE%B9%CE%BF2024-25/"
  },
  {
    id: "show-cancelled",
    title: "Cancelled",
    date: "2024 - 2025",
    description: "Commentary show with alternative and indie musical discoveries.",
    tags: ["#Talk", "#Alternative", "#Archive"],
    image: "/shows/rock.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/cancelled2024-25/"
  },
  {
    id: "show-pali-deytera",
    title: "Pali Deytera",
    date: "2024 - 2025",
    description: "Starting the week off right with great tunes, humor, and fresh energy.",
    tags: ["#MondayVibes", "#Eclectic", "#Archive"],
    image: "/shows/studio.jpg",
    mixcloudUrl: "https://www.mixcloud.com/frs-volou/playlists/%CF%80%CE%AC%CE%BB%CE%B9-%CE%B4%CE%B5%CF%85%CF%84%CE%AD%CF%81%CE%B12024-25/"
  }
];

export const DEFAULT_EVENTS_GR: StationEvent[] = [
  {
    id: "cafe-santan-welcome-party-2026",
    dayNum: "07",
    monthStr: "ΟΚΤ",
    categoryBadge: "Welcome Party",
    timeLocation: "🕒 21:00 • 📍 Cafe Santan (Εργατικού Κέντρου 12, Βόλος)",
    title: "Cafe Santan x FRS-UTH • Welcome Party",
    description: "Το πρώτο επίσημο Welcome Party της χρονιάς από το FRS UTH στο θρυλικό Cafe Santan! Μουσική επιμέλεια και DJ set από τον Apostolis G. Σας περιμένουμε όλους να ξεκινήσουμε τη νέα ραδιοφωνική σεζόν δυνατά!",
    tags: ["#WelcomeParty", "#CafeSantan", "#ApostolisG", "#FRSUTH"],
    link: "https://www.facebook.com/events/cafe-santan/cafe-santan-x-frs-uth-welcome-party/1121089790612134/"
  }
];

export const DEFAULT_EVENTS_EN: StationEvent[] = [
  {
    id: "cafe-santan-welcome-party-2026",
    dayNum: "07",
    monthStr: "OCT",
    categoryBadge: "Welcome Party",
    timeLocation: "🕒 21:00 • 📍 Cafe Santan (12 Ergatikou Kentrou, Volos)",
    title: "Cafe Santan x FRS-UTH • Welcome Party",
    description: "The first official Welcome Party of the academic year by FRS UTH at the legendary Cafe Santan! DJ set and musical curation by Apostolis G. Join us to kick off the new season!",
    tags: ["#WelcomeParty", "#CafeSantan", "#ApostolisG", "#FRSUTH"],
    link: "https://www.facebook.com/events/cafe-santan/cafe-santan-x-frs-uth-welcome-party/1121089790612134/"
  }
];


