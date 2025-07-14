'use server';

import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';
import type { Storage } from 'firebase-admin/storage';

interface FirebaseAdminServices {
  auth: Auth;
  db: Firestore;
  storage: Storage;
}

let services: FirebaseAdminServices | undefined = undefined;

function initializeAdminApp(): FirebaseAdminServices {
  if (services) {
    return services;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);

    // 🔥 Fix private_key line breaks for Vercel-style env escaping
    if (typeof serviceAccount.private_key === 'string') {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }

    services = {
      auth: getAuth(),
      db: getFirestore(),
      storage: getStorage(),
    };

    return services;
  } catch (error: any) {
    console.error('🔥 Firebase Admin Initialization Error:', error.message);
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
}

function getFirebaseAdmin(): FirebaseAdminServices {
  try {
    return initializeAdminApp();
  } catch (error) {
    console.warn((error as Error).message);
    console.warn('⚠️ Returning dummy Firebase Admin services. This is expected during build if env vars are missing.');

    const dummyDb = {
      collection: () => ({
        orderBy: () => ({ get: async () => ({ docs: [], size: 0, empty: true }) }),
        where: () => ({
          orderBy: () => ({ get: async () => ({ docs: [], size: 0, empty: true }) }),
        }),
        doc: () => ({
          get: async () => ({ exists: false, data: () => null }),
          update: async () => {},
        }),
        add: async () => ({ id: 'dummy' }),
        get: async () => ({ docs: [], size: 0, empty: true }),
      }),
    } as unknown as Firestore;

    return {
      auth: {} as Auth,
      db: dummyDb,
      storage: {} as Storage,
    };
  }
}

export const { auth: adminAuth, db: adminDb, storage: adminStorage } = getFirebaseAdmin();
