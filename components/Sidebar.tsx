"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div style={{
      width: "250px",
      height: "100vh",
      backgroundColor: "#0a0a0a",
      color: "white",
      padding: "20px"
    }}>
      <h2 style={{ marginBottom: "20px" }}>
        Crimson Beatstream
      </h2>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <Link href="/">Home</Link>
        <Link href="/search">Search</Link>
        <Link href="/library">Library</Link>
        <Link href="/artist">Artist</Link>
        <Link href="/upload">Upload</Link>
      </div>
    </div>
  );
}