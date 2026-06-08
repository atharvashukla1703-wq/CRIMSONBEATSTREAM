"use client";

import { useState } from "react";
import { useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
} from "firebase/auth";

export default function AccountType() {
  const [accountType, setAccountType] =
  useState("Listener");
  const [savedRole, setSavedRole] =
  useState("Listener");
  const [uid, setUid] =
  useState("");
  const [roleLoaded, setRoleLoaded] =
  useState(false);
  useEffect(() => {
  const unsubscribe =
    onAuthStateChanged(auth, (user) => {
      if (user) {
  setUid(user.uid);

  const loadRole = async () => {
    const docSnap =
      await getDoc(
        doc(db, "users", user.uid)
      );

    if (docSnap.exists()) {
  const role =
    docSnap.data().role ||
    "Listener";

  setSavedRole(role);
  setAccountType(role);
  setRoleLoaded(true);
}
  };

  loadRole();
}
    });

  return () => unsubscribe();
}, []);
useEffect(() => {
  if (!uid || !roleLoaded) return;

  const saveRole = async () => {
    try {
      await setDoc(
        doc(db, "users", uid),
        {
          role: accountType,
        },
        { merge: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  saveRole();
}, [accountType, uid]);


  return (
    <div style={{ marginTop: 20 }}>
      <h3
        style={{
          marginBottom: 12,
        }}
      >
        Choose Account Type
      </h3>

      <div
        style={{
          display: "flex",
          gap: 12,
        }}
      >
        <button
  onClick={() => {
  setAccountType("Listener");

  localStorage.setItem(
    "accountType",
    "Listener"
  );
}}
  style={{
    padding: "12px 20px",
    borderRadius: 14,
    border: "none",
    background:
      accountType === "Listener"
        ? "linear-gradient(90deg,#ff003c,#770000)"
        : "#111",
    color: "white",
    fontWeight: 700,
  }}
>
  🎧 Listener
</button>

        <button
  onClick={() => {
  setAccountType("Artist");

  localStorage.setItem(
    "accountType",
    "Artist"
  );
}}
  style={{
    padding: "12px 20px",
    borderRadius: 14,
    border: "none",
    background:
      accountType === "Artist"
        ? "linear-gradient(90deg,#ff003c,#770000)"
        : "#111",
    color: "white",
    fontWeight: 700,
  }}
>
  🎤 Artist
</button>
      </div>
      <p
  style={{
    marginTop: 15,
    color: "#ff4d6d",
    fontWeight: 700,
  }}
>
  Selected: {accountType}
</p>
    </div>
  );
}