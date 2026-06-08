export type Song = {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audio: string;
  color: string;

  // 🔥 NEW: future-ready fields (UI + backend scaling)
  duration?: number;        // optional (for backend later)
  isExplicit?: boolean;     // explicit content flag
  genre?: string;           // filtering system
  mood?: string;            // cinematic tagging
  releaseYear?: number;     // timeline sorting
};

export const songs: Song[] = [
  {
    id: "1",
    title: "Nightdrive Of Crimson",
    artist: "Canon X",
    cover: "/nightdrive.png",
    audio: "/nightdrive.mp3",
    color: "#ff003c",
    genre: "Trap",
    mood: "Cinematic Night Drive",
    releaseYear: 2026,
  },
  {
    id: "2",
    title: "Blackout",
    artist: "Canon X",
    cover: "/blackout.png",
    audio: "/blackout.mp3",
    color: "#8b0000",
    genre: "Dark Trap",
    mood: "Aggressive",
    releaseYear: 2026,
  },
  {
    id: "3",
    title: "Blackoutstreet",
    artist: "Canon X",
    cover: "/blackoutstreet.png",
    audio: "/blackoutstreet.mp3",
    color: "#520000",
    genre: "Street Trap",
    mood: "Urban Night",
    releaseYear: 2026,
  },
  {
    id: "4",
    title: "Desicannon",
    artist: "Canon X",
    cover: "/desicannon.png",
    audio: "/desicannon.mp3",
    color: "#ff2200",
    genre: "Desi Trap",
    mood: "Fusion Energy",
    releaseYear: 2026,
  },
  {
    id: "5",
    title: "Desicannonreloaded",
    artist: "Canon X",
    cover: "/desicannonreloaded.png",
    audio: "/desicannonreloaded.mp3",
    color: "#d10000",
    genre: "Desi Trap",
    mood: "Reloaded Intensity",
    releaseYear: 2026,
  },
  {
    id: "6",
    title: "Cannonxoverdrive",
    artist: "Canon X",
    cover: "/cannonxoverdrive.png",
    audio: "/cannonxoverdrive.mp3",
    color: "#ff3300",
    genre: "Hyper Trap",
    mood: "Overdrive Energy",
    releaseYear: 2026,
  },
  {
    id: "7",
    title: "Cannonxoverdrivereverb",
    artist: "Canon X",
    cover: "/cannonxoverdrivereverb.png",
    audio: "/cannonxoverdrivereverb.mp3",
    color: "#900000",
    genre: "Ambient Trap",
    mood: "Reverb Dream State",
    releaseYear: 2026,
  },
];