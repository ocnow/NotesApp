// src/services/session.server.ts
import { useSession } from '@tanstack/react-start/server'
import { getAuth } from 'firebase-admin/auth'

type SessionUser = {
  userEmail: string,
  firebaseUid: string, 
}

export function useAppSession() {
  return useSession<SessionUser>({
    password: process.env.SESSION_SECRET || 'ChangeThisBeforeShippingToProdOrYouWillBeFired',
  })
}

export async function verifyFirebaseToken(idToken: string) {
  const auth = getAuth()
  try {
    const decodedToken = await auth.verifyIdToken(idToken)
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error)
    throw new Error('Invalid token')
  }
}