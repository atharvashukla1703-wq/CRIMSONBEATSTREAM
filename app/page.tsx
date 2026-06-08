"use client";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import {
  onAuthStateChanged
} from "firebase/auth";
import ProfileCard from "@/components/ProfileCard";
import AccountType from "@/components/AccountType";
import Login from "@/components/Login";
import { useEffect, useMemo, useRef, useState } from "react";
import { songs } from "@/lib/songs";

import {
  FaHome,
  FaSearch,
  FaHeart,
  FaMusic,
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
} from "react-icons/fa";

import {
  MdLibraryMusic,
  MdGraphicEq,
} from "react-icons/md";

import {
  IoMdShuffle,
} from "react-icons/io";

import {
  RiRepeat2Fill,
} from "react-icons/ri";
type Song = {
  id?: string;
  title: string;
  artist?: string;
  audio: string;
  cover: string;
  color: string;
  genre?: string;
  mood?: string;
  releaseYear?: number;
};

export default function Home() {
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fileInputRef =
  useRef<HTMLInputElement | null>(null);
  const coverInputRef =
  useRef<HTMLInputElement | null>(null);

  
  
  
  const [uploadedSongs, setUploadedSongs] =
  useState<Song[]>([]);
  const [totalStreams, setTotalStreams] =
  useState(0);
  const [totalFollowers, setTotalFollowers] =
  useState(0);
  const safeSongs: Song[] = [
  ...(songs || []),
  ...uploadedSongs,
];
  useEffect(() => {
  const loadUploadedSongs =
    async () => {
      const snapshot =
        await getDocs(
          collection(db, "songs")
        );

      const songsFromDb =
        snapshot.docs.map(
          (doc) =>
            ({
  id: doc.id,
  title:
    doc.data().title,
  artist:
    doc.data().artist,
  audio:
    doc.data().songUrl,
  cover:
    doc.data().coverUrl,
  streams:
    doc.data().streams || 0,
  color:
    "#ff003c",
}) as Song
        );

      setUploadedSongs(
        songsFromDb
      );
      if (
  songsFromDb.length > 0
) {
  setCurrentSong(
    songsFromDb[0]
  );
}
      const streamCount =
  songsFromDb.reduce(
    (total, song: any) =>
      total + (song.streams || 0),
    0
  );

setTotalStreams(
  streamCount
);
const followersSnapshot =
  await getDocs(
    collection(db, "followers")
  );

let followersCount = 0;

followersSnapshot.forEach(
  (doc) => {
    const artists =
      doc.data().artists || [];

    if (
      artists.includes(
        artistName
      )
    ) {
      followersCount++;
    }
  }
);

setTotalFollowers(
  followersCount
);
    };

  loadUploadedSongs();
}, []);

  const [currentSong, setCurrentSong] = useState<Song>(
    safeSongs[0] || {
      title: "No Song",
      audio: "",
      cover: "",
      color: "#000",
    }
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [cinematicMode, setCinematicMode] = useState(false);

  const [search, setSearch] = useState("");

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const [library, setLibrary] = useState<Song[]>([]);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [followedArtists, setFollowedArtists] =
  useState<string[]>([]);
  const [isArtist, setIsArtist] =
  useState(false);
  
  const [artistName, setArtistName] =
  useState("Canon X");
  const [artistBio, setArtistBio] =
  useState("");

const [artistGenre, setArtistGenre] =
  useState("");

const [artistProfileImage, setArtistProfileImage] =
  useState("");
  const [
  selectedProfileImage,
  setSelectedProfileImage,
] = useState<File | null>(
  null
);
  const [selectedSong, setSelectedSong] =
  useState<File | null>(null);
  const [selectedCover, setSelectedCover] =
  useState<File | null>(null);
  const [songTitle, setSongTitle] =
  useState("");
  const [editingSongId, setEditingSongId] =
  useState("");

const [editedTitle, setEditedTitle] =
  useState("");
  const saveArtistProfile =
  async () => {
    if (!auth.currentUser)
      return;

    try {
      let profileImageUrl =
  artistProfileImage;

if (
  selectedProfileImage
) {
  const formData =
    new FormData();

  formData.append(
    "file",
    selectedProfileImage
  );

  formData.append(
    "upload_preset",
    "crimson_songs"
  );

  const upload =
    await fetch(
      "https://api.cloudinary.com/v1_1/drvax7ayk/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

  const data =
    await upload.json();

  profileImageUrl =
    data.secure_url;
}
      await setDoc(
        doc(
          db,
          "artistProfiles",
          auth.currentUser.uid
        ),
        {
          artistName,
          artistBio,
          artistGenre,
          artistProfileImage:
  profileImageUrl,
        }
      );

      alert(
        "Artist profile saved!"
      );
    } catch (error) {
      console.log(error);
    }
  };
  const uploadToCloudinary = async () => {
  if (
    !selectedSong ||
    !selectedCover ||
    !songTitle
  ) {
    alert(
      "Please select song, cover and title"
    );
    return;
  }
  const songFormData =
  new FormData();

songFormData.append(
  "file",
  selectedSong
);

songFormData.append(
  "upload_preset",
  "crimson_songs"
);

const songUpload =
  await fetch(
    "https://api.cloudinary.com/v1_1/drvax7ayk/video/upload",
    {
      method: "POST",
      body: songFormData,
    }
  );

const songData =
  await songUpload.json();
  const coverFormData =
  new FormData();

coverFormData.append(
  "file",
  selectedCover
);

coverFormData.append(
  "upload_preset",
  "crimson_songs"
);

const coverUpload =
  await fetch(
    "https://api.cloudinary.com/v1_1/drvax7ayk/image/upload",
    {
      method: "POST",
      body: coverFormData,
    }
  );


const coverData =
  await coverUpload.json();


  await addDoc(
  collection(db, "songs"),
  {
    title: songTitle,
    artist: artistName,
    songUrl:
      songData.secure_url,
    coverUrl:
      coverData.secure_url,
    streams: 0,
    createdAt:
      new Date(),
  }
);

console.log(
  "Firestore save completed"
);

console.log(
  "Song URL:",
  songData.secure_url
);

console.log(
  "Cover URL:",
  coverData.secure_url
);


alert(
  "Song uploaded successfully!"
);
};
  useEffect(() => {
  const role =
    localStorage.getItem("accountType");

  setIsArtist(role === "Artist");
}, []);
useEffect(() => {
  const unsubscribe =
    onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) return;

        try {
          const profileDoc =
            await getDoc(
              doc(
                db,
                "artistProfiles",
                user.uid
              )
            );

          if (
            profileDoc.exists()
          ) {
            const data =
              profileDoc.data();

            setArtistName(
              data.artistName || ""
            );

            setArtistBio(
              data.artistBio || ""
            );

            setArtistGenre(
              data.artistGenre || ""
            );

            setArtistProfileImage(
              data.artistProfileImage ||
                ""
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    );

  return () =>
    unsubscribe();
}, []);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);

  const [visualizerData, setVisualizerData] = useState<number[]>(
    Array(64).fill(20)
  );

  // FILTERED SONGS
  const filteredSongs = useMemo(() => {
    return safeSongs.filter((song) =>
      song.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, safeSongs]);

  // VISUALIZER
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setVisualizerData(
          Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 180) + 20
          )
        );
      }
    }, 90);

    return () => clearInterval(interval);
  }, [isPlaying]);
  useEffect(() => {
  if (
    safeSongs.length > 0 &&
    !currentSong.audio
  ) {
    setCurrentSong(
      safeSongs[0]
    );
  }
}, [safeSongs]);

  // AUDIO ENGINE
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong.audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };

    const handleEnd = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
        return;
      }

      let nextSong: Song;

      if (shuffle) {
        const randomIndex = Math.floor(Math.random() * safeSongs.length);
        nextSong = safeSongs[randomIndex] || currentSong;
      } else {
        const index = safeSongs.findIndex(
          (s) => s.title === currentSong.title
        );

        const nextIndex =
          index === safeSongs.length - 1 ? 0 : index + 1;

        nextSong = safeSongs[nextIndex] || currentSong;
      }

      setCurrentSong(nextSong);
      setIsPlaying(true);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnd);
    };
  }, [currentSong, shuffle, repeat, safeSongs]);

  // LOAD SONG CHANGE
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong.audio) return;

    const loadSong = async () => {
      try {
        audio.pause();
        audio.src = currentSong.audio;
        audio.load();

        audio.volume = volume;
        audio.playbackRate = playbackSpeed;

        setCurrentTime(0);

        if (isPlaying) {
          await audio.play();
        }
      } catch (err) {
        console.log("Audio error:", err);
      }
    };

    loadSong();
  }, [currentSong]);

  // VOLUME / SPEED SYNC
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.playbackRate = playbackSpeed;
  }, [volume, playbackSpeed]);

  // CONTROLS
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play();
      setIsPlaying(true);
    }
  };

  const playSong = async (
  song: Song
) => {
  setCurrentSong(song);
  setIsPlaying(true);

  if (song.id) {
    try {
      await updateDoc(
        doc(db, "songs", song.id),
        {
          streams:
            increment(1),
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
};

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;

    const seekTime = percent * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };
  const editSong = async () => {
  if (
    !editingSongId ||
    !editedTitle
  )
    return;

  try {
    await updateDoc(
      doc(
        db,
        "songs",
        editingSongId
      ),
      {
        title:
          editedTitle,
      }
    );

    setUploadedSongs(
      uploadedSongs.map(
        (song) =>
          song.id ===
          editingSongId
            ? {
                ...song,
                title:
                  editedTitle,
              }
            : song
      )
    );

    setEditingSongId("");
    setEditedTitle("");

    alert(
      "Song updated successfully!"
    );
  } catch (error) {
    console.log(error);
  }
};
  const deleteSong = async (
  songId: string
) => {
  try {
    await deleteDoc(
      doc(db, "songs", songId)
    );

    setUploadedSongs(
      uploadedSongs.filter(
        (song) =>
          song.id !== songId
      )
    );

    alert(
      "Song deleted successfully!"
    );
  } catch (error) {
    console.log(error);
  }
};
const followArtist = async (
  artistName: string
) => {
  if (!auth.currentUser) return;

  if (
    !followedArtists.includes(
      artistName
    )
  ) {
    const updatedArtists = [
      ...followedArtists,
      artistName,
    ];

    setFollowedArtists(
      updatedArtists
    );

    try {
      await setDoc(
        doc(
          db,
          "followers",
          auth.currentUser.uid
        ),
        {
          artists:
            updatedArtists,
        }
      );

      console.log(
        "FOLLOWED ARTIST"
      );
    } catch (error) {
      console.log(error);
    }
  }
};
  const addToPlaylist = async (
  song: Song
) => {
  if (!auth.currentUser) return;

  if (
    !playlist.find(
      (s) => s.title === song.title
    )
  ) {
    const updatedPlaylist = [
      ...playlist,
      song,
    ];

    setPlaylist(updatedPlaylist);

    try {
      console.log("PLAYLIST BUTTON WORKING");
      await setDoc(
        doc(
          db,
          "playlists",
          auth.currentUser.uid
        ),
        {
          songs: updatedPlaylist,
        }
      );
      console.log(
  "PLAYLIST SAVED SUCCESSFULLY"
);

      console.log(
        "Playlist saved successfully"
      );
    } catch (error) {
  console.error(
    "PLAYLIST ERROR:",
    error
  );
}
  }
};

  const addToLibrary = async () => {
  if (!auth.currentUser) return;

  if (
    !library.find(
      (s) => s.title === currentSong.title
    )
  ) {
    const updatedLibrary = [
      ...library,
      currentSong,
    ];

    setLibrary(updatedLibrary);

    try {
      await setDoc(
        doc(
          db,
          "libraries",
          auth.currentUser.uid
        ),
        {
          songs: updatedLibrary,
        }
      );

      console.log(
        "Library saved successfully"
      );
    } catch (error) {
      console.log(error);
    }
  }
};

  const toggleLike = () => {
    if (likedSongs.includes(currentSong.title)) {
      setLikedSongs(
        likedSongs.filter((t) => t !== currentSong.title)
      );
    } else {
      setLikedSongs([...likedSongs, currentSong.title]);
    }
  };

  const progress =
    duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (t: number) => {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
  if (cinematicMode) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
overflow: "hidden",
        
        backgroundImage:
  `url(${currentSong.cover})`,
backgroundSize: "cover",
backgroundPosition: "center",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
      }}
    >
      <div
  style={{
    position: "absolute",
    inset: 0,
    backdropFilter: "blur(30px)",
    background:
`
linear-gradient(
180deg,
rgba(0,0,0,.25),
rgba(0,0,0,.85)
)
`,
    zIndex: 1,
  }}
/>
console.log(
  "COVER URL:",
  currentSong.cover
);
      <img
        src={currentSong.cover}
        alt={currentSong.title}
        style={{
          width: 520,
          height: 520,
          objectFit: "cover",
          borderRadius: 24,
          marginBottom: 30,
          
          animation:
  "floatCover 5s ease-in-out infinite",
         boxShadow:
`
0 0 40px rgba(255,0,60,.5),
0 0 80px rgba(255,0,60,.4),
0 0 140px rgba(255,0,60,.3)
`,
  zIndex: 2,
}}
      />

      <h1
  style={{
    fontSize: 64,
    fontWeight: 900,
    textAlign: "center",
    zIndex: 2,
  }}
>
  {currentSong.title}
</h1>

      <h2
  style={{
    fontSize: 26,
    color: "#dddddd",
    textAlign: "center",
    zIndex: 2,
    marginTop: 10,
  }}
>
  {currentSong.artist}
</h2>
      <div
  style={{
    display: "flex",
    alignItems: "end",
    justifyContent: "center",
    gap: 4,
    height: 180,
    marginTop: 40,
    zIndex: 2,
  }}
>
  {visualizerData.map(
    (bar, index) => (
      <div
        key={index}
        style={{
          width: 8,
          height: bar,
          borderRadius: 10,
          background:
"linear-gradient(to top,#ff003c,#ff4d6d,#ffffff)",
        }}
      />
    )
  )}
</div>

      <button
        onClick={() =>
          setCinematicMode(false)
        }
        style={{
          marginTop: 30,
          padding: "12px 24px",
          borderRadius: 12,
          border: "none",
          background: "#ff003c",
          color: "white",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        Exit Cinematic Mode
      </button>
    </div>
  );
}
  return (
    <>
      <main
        style={{
          display: "flex",
          minHeight: "100vh",
          
          color: "white",
          overflowX: "hidden",
          background:
  `radial-gradient(circle at top, ${currentSong.color}66, #050505 45%, #000 100%)`,
        }}
      >
        <div
   className="left-sidebar"
  style={{
    width: 220,
    flexShrink: 0,
    padding: 24,
    background:
  "linear-gradient(180deg,#050505,#0a0000)",
    borderRight: "1px solid rgba(255,0,60,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  }}
>
  <h1
  style={{
    color: "#ff003c",
    marginBottom: 30,
    fontSize: 36,
    fontWeight: 900,
    letterSpacing: 1,
  }}
>
  CRIMSON
</h1>

  

  
</div>

        {/* CENTER */}
<div
  className="main-content"
  style={{
    flex: 1,
    minWidth: 0,
    padding: 20,
    overflowY: "auto",
  }}
>
  <div
  style={{
    marginBottom: 40,
  }}
>
  <p
    className="hero-subtitle"
    style={{
      color: "#ff003c",
      letterSpacing: 4,
      fontSize: 14,
      marginBottom: 10,
      textTransform: "uppercase",
    }}
  >
    Immersive Music Universe
  </p>

  <h1
    className="hero-title"
    style={{
      fontSize: 48,
      fontWeight: 900,
      lineHeight: 1,
      marginBottom: 15,
      textShadow:
  "0 0 20px rgba(255,0,60,0.5)",
    }}
  >
    CRIMSON
<br />
BEATSTREAM
  </h1>
 <p
  style={{
    color: "#888",
    maxWidth: 650,
    fontSize: 18,
    lineHeight: 1.7,
  }}
>
  Dark cinematic music experience built for artists,
  night-drive energy, immersive discovery and premium
  listening.
</p>

<div style={{ marginTop: 20 }}>
  <Login />
  <AccountType />
  <ProfileCard />
</div>
  <div
  style={{
    display: "flex",
    gap: 12,
    marginTop: 20,
    flexWrap: "wrap",
  }}
>
  <button
    style={{
      padding: "10px 18px",
      borderRadius: 999,
      border: "1px solid rgba(255,0,60,0.2)",
      background: "#120000",
      color: "#ff4d6d",
    }}
  >
    🔥 Trending
  </button>

  <button
    style={{
      padding: "10px 18px",
      borderRadius: 999,
      border: "1px solid rgba(255,0,60,0.2)",
      background: "#120000",
      color: "#ff4d6d",
    }}
  >
    🎵 New Releases
  </button>

  <button
    style={{
      padding: "10px 18px",
      borderRadius: 999,
      border: "1px solid rgba(255,0,60,0.2)",
      background: "#120000",
      color: "#ff4d6d",
    }}
  >
    🎤 Artists
  </button>
</div>
</div>
<div
  style={{
    width: "100%",
    height:  "auto",
    minHeight: 260,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 35,
    position: "relative",
    background:
      "linear-gradient(135deg,#120000,#3d0000,#000000)",
    border: "1px solid rgba(255,0,60,0.1)",
  }}
>
  <img
    src={currentSong.cover}
    style={{
      position: "absolute",
      right: 0,
      top: 0,
      height: "100%",
      width: "45%",
      objectFit: "cover",
      opacity: 0.45,
    }}
  />

  <div
    style={{
      position: "relative",
      zIndex: 2,
      padding: 45,
    }}
  >
    <p
      style={{
        color: "#ff003c",
        letterSpacing: 3,
        marginBottom: 12,
      }}
    >
      CRIMSON EXCLUSIVE
    </p>

    <h2
  style={{
    fontSize: "clamp(32px,4vw,58px)",
    fontWeight: 900,
    marginBottom: 10,
  }}
>
  {currentSong.title}
</h2>

    <p
      style={{
        color: "#999",
        maxWidth: 500,
        marginBottom: 20,
      }}
    >
      Enter the world of Canon X. Dark cinematic
trap, night-drive energy, immersive soundscapes
and the future of music discovery.
    </p>

    <button
      onClick={() => playSong(currentSong)}
      style={{
        padding: "14px 28px",
        border: "none",
        borderRadius: 16,
        background:
          "linear-gradient(90deg,#ff003c,#770000)",
        color: "white",
        fontWeight: 700,
      }}
    >
      ▶ Play Now
    </button>
  </div>
</div>
{isArtist && (
  <div
    style={{
      padding: 24,
      borderRadius: 24,
      marginBottom: 30,
      background:
        "linear-gradient(135deg,#220000,#050505)",
      border:
        "1px solid rgba(255,0,60,0.15)",
    }}
  >
    <h2
      style={{
        color: "#ff003c",
        marginBottom: 10,
      }}
    > 
      🎤 Artist Dashboard
    </h2>

    <p
      style={{
        color: "#999",
        marginBottom: 15,
      }}
    >
      Welcome to your artist control center.
    </p>
   <p
  style={{
    color: "#999",
    marginBottom: 15,
  }}
>
  Artist: {artistName}
</p>

<p
  style={{
    color: "#666",
    marginBottom: 20,
  }}
>
  Dark cinematic trap artist.
  Night-drive energy.
</p>
    <>
    <input
  type="text"
  placeholder="Song Title"
  value={songTitle}
  onChange={(e) =>
    setSongTitle(e.target.value)
  }
  style={{
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #333",
    background: "#111",
    color: "white",
    marginBottom: 12,
  }}
/>
  <input
  ref={fileInputRef}
  type="file"
  accept="audio/*"
  onChange={(e) => {
    const file =
      e.target.files?.[0];

    if (file) {
  setSelectedSong(file);

  console.log(
    "Selected File:",
    file.name
  );
}
  }}
  style={{ display: "none" }}
/>

  <button
    onClick={() =>
      fileInputRef.current?.click()
    }
    style={{
      padding: "12px 20px",
      borderRadius: 14,
      border: "none",
      background:
        "linear-gradient(90deg,#ff003c,#770000)",
      color: "white",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    Upload Song
  </button>
  {selectedSong && (
  <p
    style={{
      color: "#ff4d6d",
      marginTop: 12,
      fontWeight: 700,
    }}
  >
    Selected: {selectedSong.name}
  </p>
)}
<>
  <input
    ref={coverInputRef}
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file =
        e.target.files?.[0];

      if (file) {
        setSelectedCover(file);
      }
    }}
    style={{ display: "none" }}
  />

  <button
    onClick={() =>
      coverInputRef.current?.click()
    }
    style={{
      padding: "12px 20px",
      borderRadius: 14,
      border: "none",
      background:
        "linear-gradient(90deg,#444,#111)",
      color: "white",
      fontWeight: 700,
      cursor: "pointer",
      marginTop: 12,
    }}
  >
    Upload Cover
  </button>

  {selectedCover && (
    <p
      style={{
        color: "#ff4d6d",
        marginTop: 12,
      }}
    >
      Cover: {selectedCover.name}
    </p>
  )}
  {songTitle &&
  selectedSong &&
  selectedCover && (
    <div
      style={{
        marginTop: 20,
        padding: 16,
        borderRadius: 16,
        background: "#0b0b0b",
        border:
          "1px solid rgba(255,0,60,0.15)",
      }}
    >
      <h3
        style={{
          color: "#ff003c",
          marginBottom: 10,
        }}
      >
        Upload Preview
      </h3>

      <p style={{ color: "#999" }}>
        Title: {songTitle}
      </p>

      <p style={{ color: "#999" }}>
        Song: {selectedSong.name}
      </p>

      <p style={{ color: "#999" }}>
        Cover: {selectedCover.name}
      </p>
      <button
  onClick={uploadToCloudinary}
  style={{
    marginTop: 15,
    padding: "12px 20px",
    borderRadius: 12,
    border: "none",
    background:
      "linear-gradient(90deg,#ff003c,#770000)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  }}
>
  🚀 Upload To Crimson Beatstream
</button>
    </div>
)}
  </>
</>
    <div
  style={{
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    boxShadow:
  "0 0 30px rgba(255,0,60,0.12)",
    background: "#0b0b0b",
  }}
>
  <h3
    style={{
      color: "#ff003c",
      marginBottom: 8,
    }}
  >
    Latest Release
  </h3>

  <div>
  {uploadedSongs.length === 0 ? (
    <p
      style={{
        color: "#999",
      }}
    >
      No songs uploaded yet
    </p>
  ) : (
    uploadedSongs.map((song) => (
      <div
  key={song.id}
  onClick={() => playSong(song)}
  style={{
    color: "#999",
    marginBottom: 8,
    cursor: "pointer",
    padding: 8,
    borderRadius: 10,
    background: "#111",
  }}
>
  <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 12,
  }}
>
  <img
    src={song.cover}
    alt={song.title}
    style={{
      width: 50,
      height: 50,
      borderRadius: 10,
      objectFit: "cover",
    }}
  />

  <div>
    <div>
      🎵 {song.title}
    </div>

    <div
      style={{
        color: "#666",
        fontSize: 12,
      }}
    >
      {song.artist}
      {editingSongId ===
  song.id && (
  <div
    style={{
      marginTop: 10,
    }}
  >
    <input
      value={editedTitle}
      onChange={(e) =>
        setEditedTitle(
          e.target.value
        )
      }
      style={{
        padding: 8,
        borderRadius: 8,
        border: "none",
        width: "100%",
        marginBottom: 8,
      }}
    />

    <button
      onClick={(e) => {
        e.stopPropagation();
        editSong();
      }}
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        border: "none",
        background:
          "#00aa55",
        color: "white",
        cursor: "pointer",
      }}
    >
      Save
    </button>
  </div>
)}
      <button
  onClick={(e) => {
    e.stopPropagation();

    setEditingSongId(
      song.id || ""
    );

    setEditedTitle(
      song.title
    );
  }}
  style={{
    marginTop: 8,
    marginRight: 8,
    padding: "6px 10px",
    borderRadius: 8,
    border: "none",
    background: "#003366",
    color: "white",
    cursor: "pointer",
  }}
>
  ✏ Edit
</button>
      <button
  onClick={(e) => {
    e.stopPropagation();

    deleteSong(song.id!);
  }}
  style={{
    marginTop: 8,
    padding: "6px 10px",
    borderRadius: 8,
    border: "none",
    background: "#550000",
    color: "white",
    cursor: "pointer",
  }}
>
  🗑 Delete
</button>
    </div>
  </div>
</div>
</div>
    ))
  )}
</div>
</div>
<div
  style={{
    padding: 20,
    borderRadius: 20,
    background: "#0b0b0b",
    marginBottom: 20,
  }}
>
  <h2>
    Artist Profile
  </h2>
  {artistProfileImage && (
  <img
    src={artistProfileImage}
    alt="Artist"
    style={{
      width: 120,
      height: 120,
      borderRadius: "50%",
      objectFit: "cover",
      display: "block",
      marginBottom: "0 auto 20px auto",
      border:
        "3px solid #ff003c",
    }}
  />
)}

  <input
    placeholder="Artist Name"
    value={artistName}
    onChange={(e) =>
      setArtistName(
        e.target.value
      )
    }
    style={{
      width: "100%",
      padding: 10,
      marginBottom: 10,
      borderRadius: 10,
    }}
  />

  <input
    placeholder="Genre"
    value={artistGenre}
    onChange={(e) =>
      setArtistGenre(
        e.target.value
      )
    }
    style={{
      width: "100%",
      padding: 10,
      marginBottom: 10,
      borderRadius: 10,
    }}
  />

  <textarea
    placeholder="Artist Bio"
    value={artistBio}
    onChange={(e) =>
      setArtistBio(
        e.target.value
      )
    }
    style={{
      width: "100%",
      padding: 10,
      minHeight: 100,
      marginBottom: 10,
      borderRadius: 10,
    }}
  />
<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setSelectedProfileImage(
      e.target.files?.[0] ||
        null
    )
  }
  style={{
    marginBottom: 10,
  }}
/>
  <button
    onClick={
      saveArtistProfile
    }
    style={{
      padding: "10px 20px",
      border: "none",
      borderRadius: 10,
      background:
        "#ff003c",
      color: "white",
      cursor: "pointer",
      fontWeight: 700,
    }}
  >
    Save Profile
  </button>
</div>
    <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(3,1fr)",
    gap: 12,
    marginTop: 20,
  }}
>
  <div
    style={{
      padding: 14,
      borderRadius: 16,
      background: "#0b0b0b",
    }}
  >
    <h3 style={{ color: "#ff003c" }}>
       {uploadedSongs.length}
    </h3>
    <p style={{ color: "#888" }}>
      Songs
    </p>
  </div>

  <div
    style={{
      padding: 14,
      borderRadius: 16,
      background: "#0b0b0b",
    }}
  >
    <h3 style={{ color: "#ff003c" }}>
      {totalFollowers}
    </h3>
    <p style={{ color: "#888" }}>
      Followers
    </p>
  </div>

  <div
    style={{
      padding: 14,
      borderRadius: 16,
      background: "#0b0b0b",
    }}
  >
    <h3 style={{ color: "#ff003c" }}>
      {totalStreams}
    </h3>
    <p style={{ color: "#888" }}>
      Streams
    </p>
  </div>
</div>
  </div>
)}
{!isArtist && (
  <div
    style={{
      padding: 24,
      borderRadius: 24,
      marginBottom: 30,
      background:
        "linear-gradient(135deg,#101010,#050505)",
      border:
        "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <h2
      style={{
        color: "#ff003c",
        marginBottom: 10,
      }}
    >
      🎧 Listener Dashboard
    </h2>

    <p
      style={{
        color: "#999",
      }}
    >
      Discover music, build playlists and follow artists.
    </p>
    <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(3,1fr)",
    gap: 12,
    marginTop: 20,
    boxShadow:
  "0 0 20px rgba(255,255,255,0.05)",
  }}
>
  <div
    style={{
      padding: 14,
      borderRadius: 16,
      background: "#0b0b0b",
    }}
  >
    <h3 style={{ color: "#ff003c" }}>
      {library.length}
    </h3>
    <p style={{ color: "#888" }}>
      Library
    </p>
  </div>

  <div
    style={{
      padding: 14,
      borderRadius: 16,
      background: "#0b0b0b",
    }}
  >
    <h3 style={{ color: "#ff003c" }}>
      {playlist.length}
    </h3>
    <p style={{ color: "#888" }}>
      Playlists
    </p>
  </div>

  <div
    style={{
      padding: 14,
      borderRadius: 16,
      background: "#0b0b0b",
    }}
  >
    <h3 style={{ color: "#ff003c" }}>
      {followedArtists.length}
    </h3>
    <p style={{ color: "#888" }}>
      Following
    </p>
  </div>
</div>
  </div>
)}
  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search songs, artists, albums..."
    style={{
      width: "100%",
      padding: "18px 22px",
      borderRadius: 20,
      border: "1px solid rgba(255,0,60,0.1)",
      background: "#0a0a0a",
      color: "white",
      marginBottom: 30,
      fontSize: 16,
      boxShadow:
  "0 0 25px rgba(255,0,60,0.15)",
    }}
  />
  <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 20,
    marginBottom: 35,
  }}
>
  <div
    style={{
      padding: 24,
      borderRadius: 24,
      background:
        "linear-gradient(135deg,#120000,#050505)",
      border: "1px solid rgba(255,0,60,0.08)",
    }}
  >
    <h2 style={{ color: "#ff003c" }}>
  {safeSongs.length}
</h2>
    <p style={{ color: "#999" }}>
      Tracks Available
    </p>
  </div>

  <div
    style={{
      padding: 24,
      borderRadius: 24,
      background:
        "linear-gradient(135deg,#120000,#050505)",
      border: "1px solid rgba(255,0,60,0.08)",
    }}
  >
    <h2 style={{ color: "#ff003c" }}>
  {[...new Set(safeSongs.map(song => song.artist))]
    .length}
</h2>
    <p style={{ color: "#999" }}>
      Featured Artist
    </p>
  </div>

  <div
    style={{
      padding: 24,
      borderRadius: 24,
      background:
        "linear-gradient(135deg,#120000,#050505)",
      border: "1px solid rgba(255,0,60,0.08)",
    }}
  >
    <h2 style={{ color: "#ff003c" }}>
      {likedSongs.length}
    </h2>
    <p style={{ color: "#999" }}>
      Liked Songs
    </p>
  </div>
</div>
<h2
  style={{
    marginBottom: 20,
    fontSize: 28,
    marginTop: 20,
  }}
>
  🔥 Trending Now
</h2>

<div
  style={{
    display: "flex",
    gap: 16,
    overflowX: "auto",
    marginBottom: 35,
    paddingBottom: 10,
  }}
>
  {safeSongs.slice(0, 4).map((song, i) => (
    <div
      key={i}
      style={{
        minWidth: 260,
        height: 140,
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={() => playSong(song)}
    >
      <img
        src={song.cover}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top,rgba(0,0,0,.9),transparent)",
          padding: 16,
          display: "flex",
          alignItems: "end",
        }}
      >
        <div>
          <h3>{song.title}</h3>
          <p style={{ color: "#ccc" }}>
            {song.artist}
            
            
          </p>
        </div>
      </div>
    </div>
  ))}
</div>
<h2
  style={{
    marginBottom: 20,
    fontSize: 28,
  }}
>
  ❤️ Liked Songs
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill,minmax(220px,1fr))",
    gap: 20,
    marginBottom: 35,
  }}
>
  {safeSongs
    .filter((song) =>
      likedSongs.includes(song.title)
    )
    .map((song, i) => (
      <div
        key={i}
        style={{
          padding: 14,
          borderRadius: 20,
          background:
            "linear-gradient(145deg,#150000,#050505)",
          border:
            "1px solid rgba(255,0,60,.12)",
        }}
      >
        <img
          src={song.cover}
          style={{
            width: "100%",
            borderRadius: 14,
          }}
        />

        <h3
          style={{
            marginTop: 10,
          }}
        >
          {song.title}
        </h3>

        <p
          style={{
            color: "#888",
          }}
        >
          {song.artist}
        </p>
      </div>
    ))}
</div>
<h2
  style={{
    marginBottom: 20,
    fontSize: 28,
  }}
>
  ❤️ Liked Songs
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill,minmax(220px,1fr))",
    gap: 20,
    marginBottom: 35,
  }}
>
  {safeSongs
    .filter((song) =>
      likedSongs.includes(song.title)
    )
    .map((song, i) => (
      <div
        key={i}
        style={{
          padding: 14,
          borderRadius: 20,
          background:
            "linear-gradient(145deg,#120000,#050505)",
          border:
            "1px solid rgba(255,0,60,0.08)",
        }}
      >
        <img
          src={song.cover}
          style={{
            width: "100%",
            aspectRatio: "1/1",
            objectFit: "cover",
            borderRadius: 16,
          }}
        />

        <h3
          style={{
            marginTop: 10,
          }}
        >
          {song.title}
        </h3>

        <p
          style={{
            color: "#888",
          }}
        >
          {song.artist}
        </p>

        <button
          onClick={() => playSong(song)}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 10,
            borderRadius: 12,
            border: "none",
            background:
              "linear-gradient(90deg,#ff003c,#770000)",
            color: "white",
          }}
        >
          Play
        </button>
      </div>
    ))}
</div>
<h2
  style={{
    marginBottom: 20,
    fontSize: 28,
  }}
>
  ⭐ Recommended For You
</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
    gap: 20,
    marginBottom: 35,
  }}
>
  {safeSongs.slice(0, 2).map((song, i) => (
    <div
      key={i}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: 16,
        borderRadius: 20,
        background:
          "linear-gradient(135deg,#120000,#050505)",
        border: "1px solid rgba(255,0,60,0.08)",
      }}
    >
      <img
        src={song.cover}
        style={{
          width: 80,
          height: 80,
          objectFit: "cover",
          borderRadius: 16,
        }}
      />

      <div>
        <h4>{song.title}</h4>

        <p style={{ color: "#888" }}>
          {song.artist}
        </p>

        <p
          style={{
            color: "#ff4d6d",
            fontSize: 12,
            marginTop: 6,
          }}
        >
          Recommended because you like Canon X
        </p>
      </div>
    </div>
  ))}
</div>
<h2
  style={{
    marginBottom: 20,
    fontSize: 28,
  }}
>
  
  ⏱ Recently Played
</h2>

<div
  style={{
    display: "flex",
    gap: 16,
    overflowX: "auto",
    marginBottom: 35,
  }}
>
  {safeSongs.slice(0, 3).map((song, i) => (
    <div
      key={i}
      style={{
        minWidth: 220,
        background: "#0b0b0b",
        borderRadius: 20,
        padding: 14,
        border: "1px solid rgba(255,0,60,0.08)",
      }}
    >
      <img
        src={song.cover}
        style={{
          width: "100%",
          borderRadius: 16,
        }}
      />

      <h4 style={{ marginTop: 10 }}>
        {song.title}
      </h4>

      <p style={{ color: "#888" }}>
        {song.artist}
      </p>
    </div>
  ))}
</div>
<h2
  style={{
    marginBottom: 20,
    fontSize: 28,
  }}
>
  🎤 Top Artists
</h2>

<div
  style={{
    display: "flex",
    gap: 20,
    marginBottom: 35,
    overflowX: "auto",
  }}
>
  {[
    "Canon X",
    "Crimson Records",
    "Nightdrive Crew",
    "Darkwave",
  ].map((artist, i) => (
    <div
      key={i}
      style={{
        minWidth: 140,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg,#ff003c,#300000)",
          margin: "0 auto 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
          fontWeight: 900,
        }}
      >
        {artist.charAt(0)}
      </div>

      <p>{artist}</p>
      <button
  onClick={() =>
    followArtist(artist)
  }
  style={{
    marginTop: 10,
    padding: "8px 16px",
    borderRadius: 12,
    border: "none",
    background:
      "linear-gradient(90deg,#ff003c,#770000)",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  }}
>
  Follow
</button>
    </div>
  ))}
</div>
  <h2
    style={{
      marginBottom: 20,
      fontSize: 28,
    }}
  >
    All Songs
  </h2>

  <div
  className="song-grid"
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill,minmax(220px,1fr))",
    gap: 24,
  }}
>
    {filteredSongs.map((song, i) => (
      <div
  key={i}
  className="crimson-card"
  onClick={() => playSong(song)}
        style={{
  padding: 16,
  borderRadius: 24,
  overflow: "hidden",
  border: "1px solid rgba(255,0,60,0.12)",
  transition: "all 0.35s ease",
  cursor: "pointer",
  background:
    "linear-gradient(145deg, rgba(20,0,0,0.95), rgba(5,0,0,0.98))",
  boxShadow:
    "0 0 25px rgba(255,0,60,0.08)",

}}
      >
      <img
  src={song.cover}
  style={{
    width: "100%",
    height: 220,
    objectFit: "cover",
    borderRadius: 20,
  }}
/>

        <h3
          style={{
            marginTop: 12,
            marginBottom: 5,
            fontSize: 18,
fontWeight: 800,
          }}
        >
          {song.title}
        </h3>

        <p
  style={{
    color: "#888",
    fontSize: 13,
    marginTop: 4,
  }}
>
  {song.artist}
</p>

<div
  style={{
    display: "flex",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  }}
>
  <span
    style={{
      background: "rgba(255,0,60,0.15)",
      color: "#ff4d6d",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 11,
    }}
  >
    {song.genre || "Trap"}
  </span>

  <span
    style={{
      background: "rgba(255,255,255,0.06)",
      color: "#ccc",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 11,
    }}
  >
    {song.releaseYear || "2026"}
  </span>
</div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 12,
          }}
        >
          <button
            onClick={() => playSong(song)}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 12,
              border: "none",
              background:
                "linear-gradient(90deg,#ff003c,#770000)",
              color: "white",
            }}
          >
            Play
          </button>

          <button
            onClick={() => addToPlaylist(song)}
            style={{
              width: 50,
              borderRadius: 12,
            }}
          >
            +
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

       {/* RIGHT PLAYER */}
<div
  className="desktop-player"
  style={{
    width: "260px",
maxWidth: "260px",
minWidth: "260px",
    flexShrink: 0,
    padding: 24,
    background:
      "linear-gradient(180deg,#050505,#0a0000)",
    borderLeft: "1px solid rgba(255,0,60,0.08)",
    display: "flex",
    flexDirection: "column",
  }}
>
  <img
    src={currentSong.cover}
    className="player-cover"
    style={{
      width: "100%",
      height: 220,
       maxHeight: 220,
      borderRadius: 30,
      objectFit: "cover",
      marginBottom: 20,
    }}
  />

  <h2
    className="player-title"
    style={{
      fontSize: 38,
      fontWeight: 800,
      marginBottom: 8,
    }}
  >
    {currentSong.title}
  </h2>

  <p
  style={{
    color: "#ff4d6d",
    marginBottom: 6,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontSize: 12,
  }}
>
  Now Playing
</p>

<p
  style={{
    color: "#888",
    marginBottom: 25,
  }}
>
  {currentSong.artist || "Canon X"}
</p>

  <div
    className="player-buttons"
    style={{
      display: "flex",
      gap: 10,
      marginBottom: 20,
    }}
  >
    <button
      onClick={togglePlay}
      style={{
        flex: 1,
        padding: 14,
        borderRadius: 14,
        border: "none",
        background:
          "linear-gradient(90deg,#ff003c,#7a0000)",
        color: "white",
      }}
    >
      {isPlaying ? (
        <>
          <FaPause /> Pause
        </>
      ) : (
        <>
          <FaPlay /> Play
        </>
      )}
    </button>

    <button
      onClick={() => setShuffle(!shuffle)}
      style={{
        padding: 14,
        borderRadius: 14,
      }}
    >
      <IoMdShuffle />
    </button>

    <button
      onClick={() => setRepeat(!repeat)}
      style={{
        padding: 14,
        borderRadius: 14,
      }}
    >
      <RiRepeat2Fill />
    </button>
  </div>

  <div
    onClick={handleSeek}
    style={{
      height: 10,
      background: "#222",
      borderRadius: 50,
      overflow: "hidden",
      cursor: "pointer",
      marginBottom: 10,
    }}
  >
    <div
      style={{
        width: `${progress}%`,
        height: "100%",
        background:
          "linear-gradient(90deg,#ff003c,#ff4d6d)",
      }}
    />
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      color: "#999",
      marginBottom: 20,
    }}
  >
    <span>{formatTime(currentTime)}</span>
    <span>{formatTime(duration)}</span>
  </div>

  <h4
  style={{
    marginBottom: 10,
    color: "#ff4d6d",
  }}
>
  Volume Control
</h4>

  <input
    type="range"
    min={0}
    max={1}
    step={0.01}
    value={volume}
    onChange={(e) =>
      setVolume(Number(e.target.value))
    }
    style={{
      width: "100%",
      marginBottom: 25,
    }}
  />

  <div
    className="player-buttons"
    style={{
      display: "flex",
      gap: 10,
      marginBottom: 25,
    }}
  >
    <button
      onClick={addToLibrary}
      style={{
        flex: 1,
        padding: 12,
        borderRadius: 14,
      }}
    >
      Library
    </button>

    <button
      onClick={toggleLike}
      style={{
        flex: 1,
        padding: 12,
        borderRadius: 14,
      }}
    >
      ♥ Like
    </button>
  </div>

  <button
    onClick={() => setCinematicMode(true)}
    style={{
      padding: 16,
      borderRadius: 16,
      border: "none",
      background:
        "linear-gradient(90deg,#330000,#770000)",
      color: "white",
      fontWeight: 700,
    }}
  >
    🎬 Cinematic Mode
  </button>

  <div
    className="visualizer"
    style={{
      height: 120,
maxHeight: 120,
overflow: "hidden",
      display: "flex",
      alignItems: "end",
      gap: 2,
      marginTop: 25,
    }}
  >
    {visualizerData.map((bar, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: `${bar}px`,
          background:
  "linear-gradient(to top,#ff003c,#ffffff)",

boxShadow:
  "0 0 20px rgba(255,0,60,0.8)",
          borderRadius: 20,
        }}
      />
    ))}
  </div>
</div>

<audio ref={audioRef} />
<style jsx>{`
  @keyframes floatCover {
    0% {
      transform:
        translateY(0px) scale(1);
    }

    50% {
      transform:
        translateY(-12px) scale(1.02);
    }

    100% {
      transform:
        translateY(0px) scale(1);
    }
  }
`}</style>
       </main>
    </>
  );
}
