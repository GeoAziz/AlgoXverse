
import admin from 'firebase-admin';
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const initializeAdminApp = (): App => {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    // This warning is helpful for local development.
    // In Vercel, this variable will be present at runtime but not always during the build.
    console.warn(
      'FIREBASE_SERVICE_ACCOUNT_JSON is not set. Firebase Admin SDK will not be initialized.'
    );
    // Returning a dummy object to prevent build crashes.
    // This part of the code should ideally not be hit at runtime in a configured environment.
    return {
        name: 'dummy',
        options: {},
        auth: () => { throw new Error('Firebase Admin not initialized'); },
        firestore: () => { throw new Error('Firebase Admin not initialized'); },
        storage: () => { throw new Error('Firebase Admin not initialized'); },
    } as unknown as App;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    return initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_JSON or initializing app:', error);
    throw new Error('Firebase Admin SDK initialization failed.');
  }
};

const adminApp = initializeAdminApp();

// Export the initialized services directly.
// The logic inside initializeAdminApp ensures this is safe for the build process.
const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);
const adminStorage = getStorage(adminApp);

export { adminAuth, adminDb, adminStorage };
