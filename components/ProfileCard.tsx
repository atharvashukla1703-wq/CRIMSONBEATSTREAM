"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileCard() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState("Loading...");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          setUser(null);
          return;
        }

        setUser(currentUser);

        try {
          const docRef = doc(
            db,
            "users",
            currentUser.uid
          );

          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            setRole(
              data.role || "Listener"
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  if (!user) return null;

  return (
    <div
      style={{
        marginTop: 20,
        padding: 20,
        borderRadius: 20,
        background:
          "linear-gradient(135deg,#120000,#050505)",
        border:
          "1px solid rgba(255,0,60,0.12)",
      }}
    >
      <img
        src={user.photoURL}
        alt="profile"
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          marginBottom: 12,
        }}
      />

      <h3>{user.displayName}</h3>

      <p style={{ color: "#999" }}>
        {user.email}
      </p>

      <p
        style={{
          color: "#ff4d6d",
          fontWeight: 700,
          marginTop: 10,
        }}
      >
        {role}
      </p>
    </div>
  );
}