import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (typeof window !== 'undefined') {
    if (!getApps().length) {
        try {
            app = initializeApp(firebaseConfig);
        } catch (e) {
            console.error('Failed to initialize Firebase, check your environment variables.', e);
            app = {} as FirebaseApp;
        }
    } else {
        app = getApp();
    }

    try {
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
    } catch (e) {
        console.error("Failed to initialize Firebase services, likely due to missing config.", e);
        auth = {} as Auth;
        db = {} as Firestore;
        storage = {} as FirebaseStorage;
    }
} else {
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
    storage = {} as FirebaseStorage;
}

export { app, auth, db, storage };
