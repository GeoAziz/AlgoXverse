
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (e) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_JSON:', e);
  }
} else {
  // This warning is helpful for local development.
  console.warn(
    'FIREBASE_SERVICE_ACCOUNT_JSON is not set. Firebase Admin SDK will not be initialized in non-Vercel environments.'
  );
}

let adminApp: App | undefined;

if (!admin.apps.length) {
  if (serviceAccount) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } else if (process.env.VERCEL) {
    // In Vercel, the Admin SDK is initialized automatically with runtime credentials.
    adminApp = admin.initializeApp();
  }
} else {
  adminApp = admin.app();
}

const adminAuth = adminApp ? getAuth(adminApp) : undefined;
const adminDb = adminApp ? getFirestore(adminApp) : undefined;
const adminStorage = adminApp ? getStorage(adminApp) : undefined;

export { adminAuth, adminDb, adminStorage };
