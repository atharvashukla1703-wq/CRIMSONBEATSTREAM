"use client";

import { useRef, useState, useEffect } from "react";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  const formatTime = (time: number) => {
    if (!time) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progress =
    duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <main
      style={{
        background:
          "radial-gradient(circle at top, #140000 0%, #000 45%)",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        fontFamily: "Arial",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          background: "#050505",
          padding: "25px",
          borderRight: "1px solid #1a1a1a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "50px",
            }}
          >
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                width: "65px",
                height: "65px",
                borderRadius: "50%",
                boxShadow: "0 0 25px crimson",
              }}
            />

            <h1
              style={{
                color: "crimson",
                fontSize: "28px",
                margin: 0,
              }}
            >
              Crimson
            </h1>
          </div>

          {/* Menu */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            <p style={{ color: "white", fontSize: "20px" }}>
              Home
            </p>

            <p style={{ color: "#999", fontSize: "20px" }}>
              Discover
            </p>

            <p style={{ color: "#999", fontSize: "20px" }}>
              Library
            </p>

            <p style={{ color: "#999", fontSize: "20px" }}>
              Canon X
            </p>
          </div>
        </div>

        {/* Bottom Circle */}
        <div
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            border: "2px solid #222",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
          }}
        >
          N
        </div>
      </div>

      {/* Main */}
      <div
        style={{
          flex: 1,
          padding: "50px",
        }}
      >
        <h1
          style={{
            fontSize: "78px",
            color: "#ff003c",
            marginBottom: "15px",
            letterSpacing: "2px",
            textShadow: "0 0 25px crimson",
          }}
        >
          CRIMSON BEATSTREAM
        </h1>

        <p
          style={{
            color: "#9c9c9c",
            fontSize: "22px",
            letterSpacing: "4px",
            marginBottom: "50px",
          }}
        >
          IMMERSIVE MUSIC UNIVERSE
        </p>

        {/* Music Card */}
        <div
          style={{
            width: "380px",
            borderRadius: "28px",
            padding: "25px",
            background:
              "linear-gradient(145deg, rgba(40,0,0,0.95), rgba(10,0,0,0.98))",
            border: "1px solid rgba(255,0,0,0.15)",
            boxShadow: "0 0 40px rgba(255,0,0,0.25)",
          }}
        >
          {/* Album Art */}
          <img
            src="/nightdrive.png"
            alt="Album"
            style={{
              width: "100%",
              borderRadius: "20px",
              marginBottom: "20px",
            }}
          />

          <h2
            style={{
              color: "white",
              fontSize: "42px",
              marginBottom: "10px",
            }}
          >
            Nightdrive Of Crimson
          </h2>

          <p
            style={{
              color: "#aaa",
              fontSize: "20px",
              marginBottom: "30px",
            }}
          >
            Canon X
          </p>

          {/* Player */}
          <div
            style={{
              background: "rgba(255,0,0,0.08)",
              border: "1px solid rgba(255,0,0,0.15)",
              borderRadius: "22px",
              padding: "20px",
              boxShadow: "0 0 25px rgba(255,0,0,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              {/* Play Button */}
              <button
                onClick={togglePlay}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #ff003c, #7a0000)",
                  color: "white",
                  fontSize: "24px",
                  cursor: "pointer",
                  boxShadow: "0 0 20px crimson",
                }}
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>

              {/* Song Info */}
              <div>
                <h3
                  style={{
                    margin: 0,
                    color: "white",
                    fontSize: "22px",
                  }}
                >
                  Nightdrive
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: "#888",
                    fontSize: "15px",
                  }}
                >
                  Canon X • Crimson Mode
                </p>
              </div>
            </div>

            {/* Progress */}
            <div
              style={{
                marginTop: "25px",
              }}
            >
              <div
                style={{
                  height: "7px",
                  width: "100%",
                  background: "#220000",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, crimson, red)",
                    boxShadow: "0 0 15px red",
                    transition: "0.1s",
                  }}
                />
              </div>

              {/* Time */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                  color: "#777",
                  fontSize: "13px",
                }}
              >
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Hidden Audio */}
          <audio ref={audioRef} src="/nightdrive.mp3" />
        </div>
      </div>
    </main>
  );
}