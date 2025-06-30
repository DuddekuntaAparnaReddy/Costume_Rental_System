// src/utils/deleteCostume.js
/*
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const deleteCostume = async (costumeId) => {
  try {
    await deleteDoc(doc(db, "costumes", costumeId));
    console.log(`Costume ${costumeId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting costume:", error);
    alert("Failed to delete costume from Firebase.");
  }
};
*/

import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const deleteCostume = async (firestoreId) => {
  try {
    await deleteDoc(doc(db, "costumes", firestoreId));
    console.log("Deleted from Firebase:", firestoreId);
  } catch (error) {
    console.error("Error deleting costume:", error);
  }
};
