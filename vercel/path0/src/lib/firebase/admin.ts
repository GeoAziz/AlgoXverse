
import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (e) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_JSON:', e);
    throw new Error('Could not parse Firebase service account JSON. Please check the environment variable.');
  }
} else {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.');
}

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();
const adminStorage = admin.storage();

export { adminAuth, adminDb, adminStorage };
