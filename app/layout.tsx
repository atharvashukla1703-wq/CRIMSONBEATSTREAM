import "./globals.css";

import Sidebar from "@/components/Sidebar";
import MusicPlayer from "@/components/MusicPlayer";

import { MusicProvider } from "@/context/MusicContext";
import { AuthProvider } from "@/context/AuthContext";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "black",
          color: "white",
          overflowX: "hidden",
        }}
      >
        <MusicProvider>
          <div
            style={{
              display: "flex",
              minHeight: "100vh",
            }}
          >
            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <main
              style={{
                flex: 1,
                padding: "30px",
                background:
                  "radial-gradient(circle at top, #220000 0%, #000 70%)",
                paddingBottom: "140px",
              }}
            >
              {children}
            </main>
          </div>

          {/* GLOBAL MUSIC PLAYER */}
          <MusicPlayer />
        </MusicProvider>
      </body>
    </html>
  );
}