"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { songs } from "@/lib/songs";

const MusicContext = createContext<any>(null);

export function MusicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<any>(null);

  const [currentSong, setCurrentSong] =
    useState(songs[0]);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);

      setDuration(audio.duration || 0);
    };

    audio.addEventListener(
      "timeupdate",
      updateTime
    );

    return () => {
      audio.removeEventListener(
        "timeupdate",
        updateTime
      );
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();

    audio.load();

    if (isPlaying) {
      audio.play();
    }
  }, [currentSong]);

  const playSong = (song: any) => {
    setCurrentSong(song);

    setIsPlaying(true);

    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();

      setIsPlaying(false);
    } else {
      audioRef.current.play();

      setIsPlaying(true);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
        currentTime,
        setCurrentTime,
        duration,
        playSong,
        togglePlay,
        audioRef,
      }}
    >
      {children}

      <audio
        ref={audioRef}
        src={currentSong.audio}
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  return useContext(MusicContext);
}