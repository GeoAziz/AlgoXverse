'use server';

import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signUpWithEmail(values: z.infer<typeof registerSchema>) {
  try {
    const { email, password } = registerSchema.parse(values);
    
    const userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: email.split('@')[0],
    });

    await adminAuth.setCustomUserClaims(userRecord.uid, { role: 'trader' });

    await adminDb.collection('users').doc(userRecord.uid).set({
        email: userRecord.email,
        displayName: userRecord.displayName,
        role: 'trader',
        createdAt: new Date(),
    });

    return { error: null, success: true };
  } catch (e: any) {
    // Firebase Admin SDK throws errors with a code property
    if (e.code === 'auth/email-already-exists') {
        return { error: 'An account with this email already exists.', success: false };
    }
    return { error: e.message || "An unexpected error occurred.", success: false };
  }
}
