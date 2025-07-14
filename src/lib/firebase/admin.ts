import admin from 'firebase-admin';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const initializeAdminApp = () => {
  if (getApps().length > 0) {
    return admin.app();
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    // This will only be an issue in local dev if the env var is missing.
    // In Vercel, this check is passed during the build, but the value is available at runtime.
    console.warn("FIREBASE_SERVICE_ACCOUNT_JSON is not set. Skipping admin initialization. This is expected during parts of the build process.");
    // We return a dummy object so the build doesn't crash on destructuring.
    return {
      auth: () => ({}),
      firestore: () => ({}),
      storage: () => ({}),
    } as any;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    return initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_JSON or initializing app:", error);
    throw new Error("Firebase Admin SDK initialization failed.");
  }
};

const adminApp = initializeAdminApp();

// Export functions that retrieve the services, ensuring the app is initialized.
const getAdminAuth = () => getAuth(adminApp);
const getAdminDb = () => getFirestore(adminApp);
const getAdminStorage = () => getStorage(adminApp);

// For simplicity in other files, we can export the initialized services directly,
// but they are lazily loaded via the functions above.
const adminAuth = getAdminAuth();
const adminDb = getAdminDb();
const adminStorage = getAdminStorage();


export { adminAuth, adminDb, adminStorage };
