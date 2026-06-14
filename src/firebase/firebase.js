import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const cleanEnvVar = (val) => {
    if (typeof val !== "string") return val;
    let clean = val.trim();
    if (clean.endsWith(",")) {
        clean = clean.slice(0, -1).trim();
    }
    if (
        (clean.startsWith('"') && clean.endsWith('"')) ||
        (clean.startsWith("'") && clean.endsWith("'"))
    ) {
        clean = clean.slice(1, -1).trim();
    }
    return clean;
};

const firebaseConfig = {
    apiKey: cleanEnvVar(import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: cleanEnvVar(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: cleanEnvVar(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: cleanEnvVar(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: cleanEnvVar(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    appId: cleanEnvVar(import.meta.env.VITE_FIREBASE_APP_ID),
    databaseURL: `https://${cleanEnvVar(import.meta.env.VITE_FIREBASE_PROJECT_ID)}-default-rtdb.firebaseio.com`,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);

export default app;