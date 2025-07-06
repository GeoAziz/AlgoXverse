
'use server';

import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const profileSchema = z.object({
  uid: z.string(),
  displayName: z.string().min(3).max(50),
});

export async function updateProfile(uid: string, displayName: string) {
  try {
    profileSchema.parse({ uid, displayName });
    
    await adminAuth.updateUser(uid, { displayName });
    await adminDb.collection('users').doc(uid).update({ displayName });

    revalidatePath('/settings');
    revalidatePath('/'); // For sidebar
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}
