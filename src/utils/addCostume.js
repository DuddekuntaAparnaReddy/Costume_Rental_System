// src/utils/addCostume.js

/*
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const addCostume = async (costume) => {
  try {
    await addDoc(collection(db, "costumes"), costume);
    alert("Costume added successfully!");
  } catch (e) {
    console.error("Error adding costume:", e);
  }
};
*/

import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const addCostume = async (costume) => {
  try {
    const docRef = await addDoc(collection(db, "costumes"), costume);
    console.log("Firestore ID:", docRef.id);
    return docRef.id; // ✅ return the generated ID
  } catch (e) {
    console.error("Error adding costume:", e);
    throw e;
  }
};

