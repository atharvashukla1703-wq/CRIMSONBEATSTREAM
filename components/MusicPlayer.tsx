"use client";

import { useEffect, useRef, useState } from "react";

import { useMusic } from "@/context/MusicContext";

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
  } = useMusic();

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(1);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();

    audio.load();

    audio.volume = volume;

    if (isPlaying) {
      audio.play().catch(console.log);
    }
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.log);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

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

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!audioRef.current) return;

    const rect =
      e.currentTarget.getBoundingClientRect();

    const seekTime =
      ((e.clientX - rect.left) / rect.width) *
      duration;

    audioRef.current.currentTime =
      seekTime;

    setCurrentTime(seekTime);
  };

  const progress =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  const formatTime = (time: number) => {
    if (!time) return "0:00";

    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60);

    return `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "95px",
          background:
            "linear-gradient(to right,#070000,#120000,#070000)",
          borderTop:
            "1px solid rgba(255,0,60,0.15)",
          backdropFilter: "blur(25px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 25px",
          zIndex: 9999,
        }}
      >
        {/* LEFT */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            width: "25%",
          }}
        >
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            style={{
              width: "65px",
              height: "65px",
              borderRadius: "16px",
              objectFit: "cover",
              boxShadow:
                "0 0 25px rgba(255,0,60,0.35)",
            }}
          />

          <div>
            <h3
              style={{
                margin: 0,
                color: "white",
                fontSize: "16px",
              }}
            >
              {currentSong.title}
            </h3>

            <p
              style={{
                margin: 0,
                color: "#999",
                fontSize: "13px",
              }}
            >
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* CENTER */}
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            onClick={togglePlay}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "none",
              background:
                "linear-gradient(135deg,#ff003c,#6e0000)",
              color: "white",
              fontSize: "18px",
              cursor: "pointer",
              marginBottom: "10px",
              boxShadow:
                "0 0 25px rgba(255,0,60,0.4)",
            }}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                color: "#777",
                fontSize: "12px",
              }}
            >
              {formatTime(currentTime)}
            </span>

            <div
              onClick={handleSeek}
              style={{
                flex: 1,
                height: "6px",
                background: "#250000",
                borderRadius: "999px",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg,#ff003c,#ff4d4d)",
                }}
              />
            </div>

            <span
              style={{
                color: "#777",
                fontSize: "12px",
              }}
            >
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div
          style={{
            width: "25%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => {
              const value = Number(
                e.target.value
              );

              setVolume(value);

              if (audioRef.current) {
                audioRef.current.volume =
                  value;
              }
            }}
            style={{
              width: "140px",
            }}
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentSong.audio}
      />
    </>
  );
}