// Royale - the invitation's default content, as the source ships it.

export const A = "/sites/royale/media";

export interface Ceremony {
  name: string;
  art: string;
  /** Days from the wedding day (Vivaah). */
  offset: number;
  time: string; // HH:MM
  venue: string;
}

const HOME = "Sharma Residence, Jaipur";
export const CEREMONIES: Ceremony[] = [
  { name: "Ring Ceremony", art: "ring_ceremony.webp", offset: -2, time: "19:00", venue: HOME },
  { name: "Mehendi", art: "mehendi.webp", offset: -1, time: "11:00", venue: HOME },
  { name: "Haldi", art: "haldi.webp", offset: -1, time: "16:00", venue: HOME },
  { name: "Sangeet", art: "sangeet.webp", offset: -1, time: "19:30", venue: HOME },
  { name: "Vivaah", art: "vivaah.webp", offset: 0, time: "20:00", venue: HOME },
  { name: "Reception", art: "reception.webp", offset: 1, time: "20:00", venue: HOME },
];

export type FrameKind = "portrait" | "landscape" | "story";
export interface GalleryFrame {
  kind: FrameKind;
  hang: number;
  caption?: string;
  story?: string;
}
export const FRAMES: GalleryFrame[] = [
  { kind: "portrait", hang: 118, caption: "#howitstarted" },
  { kind: "landscape", hang: 150, caption: "#adventures" },
  { kind: "story", hang: 86, story: "Some stories begin with grand gestures. Ours started with a simple conversation." },
  { kind: "portrait", hang: 132, caption: "#thelittlethings" },
  { kind: "landscape", hang: 100, caption: "#everyday" },
  {
    kind: "story",
    hang: 120,
    story: "Friendship grew into something more, and we realized life's best moments were the ones we shared together.",
  },
  { kind: "portrait", hang: 150, caption: "#foreverbegins" },
  { kind: "landscape", hang: 92, caption: "#usforever" },
];

export interface FamilyCard {
  id: string;
  card: string;
  name: string;
  relLabel: string;
  parents: [string, string];
}
export const FAMILIES: FamilyCard[] = [
  {
    id: "ryGroomCard",
    card: "groomFamily",
    name: "Chi. Kaushik Sharma",
    relLabel: "Son of",
    parents: ["Shri Ramesh Chandra Sharma", "Smt. Sunita Sharma"],
  },
  {
    id: "ryBrideCard",
    card: "brideFamily",
    name: "Kum. Ankita Verma",
    relLabel: "Daughter of",
    parents: ["Shri Rajesh Kumar Verma", "Smt. Meera Verma"],
  },
];

export const COMPLIMENTS = [
  "Shri Suresh Sharma & Family (Chacha-Chachi)",
  "Shri Manoj Sharma & Family (Tau-Tai)",
  "Smt. Asha Gupta & Family (Bua)",
  "Shri Rajendra Mehta & Family (Mama-Mami)",
];

export const NOTE = "We can’t wait to celebrate this special day with you. Thank you for being part of our journey.";

// ---- dates ----------------------------------------------------------------

export interface Ymd {
  year: number;
  month: number;
  day: number;
}

/** The source's default: 15 days from today. */
export function defaultWeddingDate(): Ymd {
  const d = new Date();
  d.setDate(d.getDate() + 15);
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

const pad = (n: number) => String(n).padStart(2, "0");
export const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function ceremonyDate(w: Ymd, offset: number): Date {
  const d = new Date(w.year, w.month - 1, w.day);
  d.setDate(d.getDate() + offset);
  return d;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** e.g. "Sat, 5 Dec 2026" */
export const fmtDate = (d: Date) => `${DAYS[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;

export function fmtTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${pad(m)} ${suffix}`;
}

export const mapLink = (venue: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;
