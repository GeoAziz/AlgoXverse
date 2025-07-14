
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let adminApp: App | undefined;

if (!admin.apps.length) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      
      // Vercel can mangle the private key's newlines. This fixes it.
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
      
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch (e) {
      console.error('Error initializing Firebase Admin SDK:', e);
    }
  } else if (process.env.VERCEL) {
    // In Vercel, the Admin SDK can sometimes be initialized automatically with runtime credentials.
    adminApp = admin.initializeApp();
  } else {
    console.warn(
      'FIREBASE_SERVICE_ACCOUNT_JSON is not set. Firebase Admin SDK will not be initialized in non-Vercel environments.'
    );
  }
} else {
  adminApp = admin.app();
}

const adminAuth = adminApp ? getAuth(adminApp) : undefined;
const adminDb = adminApp ? getFirestore(adminApp) : undefined;
const adminStorage = adminApp ? getStorage(adminApp) : undefined;

export { adminAuth, adminDb, adminStorage };
