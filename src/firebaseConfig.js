// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
VITE_FIREBASE_API_KEY=your-new-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-new-auth-domain
VITE_FIREBASE_PROJECT_ID=your-new-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-new-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-new-messaging-sender-id
VITE_FIREBASE_APP_ID=your-new-app-id
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore and export it
const db = getFirestore(app);
export { db };