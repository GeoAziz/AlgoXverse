
'use server';

import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
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

function getFirebaseAdmin(): FirebaseAdminServices {
  if (services) {
    return services;
  }

  if (admin.apps.length === 0) {
    try {
      let serviceAccount: ServiceAccount;

      if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const parsedServiceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        // Vercel escapes newlines in multiline env vars. We need to un-escape them.
        serviceAccount = {
          ...parsedServiceAccount,
          privateKey: parsedServiceAccount.private_key.replace(/\\n/g, '\n'),
        };
      } else {
         // Fallback for Vercel's default credential detection
        serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        };
      }
      
      if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        throw new Error('Firebase Admin credentials are not fully set in environment variables.');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });

    } catch (error: any) {
      console.error('🔥 Firebase Admin Initialization Error:', error.message);
      throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
    }
  }

  services = {
    auth: getAuth(),
    db: getFirestore(),
    storage: getStorage(),
  };

  return services;
}

const { auth: adminAuth, db: adminDb, storage: adminStorage } = getFirebaseAdmin();

export { adminAuth, adminDb, adminStorage };
