// src/utils/updateCostumeQuantity.js
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const updateCostumeQuantity = async (firestoreId, newQuantity) => {
  try {
    await updateDoc(doc(db, "costumes", firestoreId), {
      quantity: newQuantity,
      available: newQuantity > 0
    });
    console.log(`Updated quantity to ${newQuantity}`);
  } catch (e) {
    console.error("Failed to update costume quantity:", e);
  }
};
