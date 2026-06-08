"use client";

import { useEffect, useState } from "react";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
} from "firebase/firestore";

import {
  auth,
  provider,
  db,
} from "@/lib/firebase";

export default function Login() {
  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result =
  await signInWithPopup(auth, provider);

const user = result.user;

await setDoc(
  doc(db, "users", user.uid),
  {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
    createdAt: new Date(),
  },
  { merge: true }
);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <div>
        <p
          style={{
            color: "white",
            marginBottom: 10,
          }}
        >
          Welcome, {user.displayName}
        </p>

        <button
          onClick={handleLogout}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "none",
            background: "#770000",
            color: "white",
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      style={{
        padding: "14px 24px",
        borderRadius: 14,
        border: "none",
        background:
          "linear-gradient(90deg,#ff003c,#770000)",
        color: "white",
        fontWeight: 700,
      }}
    >
      Sign In With Google
    </button>
  );
}