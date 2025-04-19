import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { hashPassword, prismaClient } from "~/utils/prisma";
import { useAppSession, verifyFirebaseToken } from "~/utils/session";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Login } from "~/components/Login";
import { initFirebaseAdmin } from "~/utils/firebaseConfig";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

console.log("api key is ",firebaseConfig.apiKey);
console.log("authDomain is ",firebaseConfig.authDomain);
console.log("projectID is ",firebaseConfig.projectId);
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export const loginFn = async ({
  data,
}: {
  data: { email: string; password: string };
}) => {
  console.log("got the data : ", data.email, data.password);
  console.log("email", data.email);
  console.log("password", data.password);
  console.log("logging in with firebase");
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    console.log("userCredential", userCredential);
    const idToken = await userCredential.user.getIdToken();
    
    // Call the loginServerFn with the token
    const serverResponse = await loginServerFn({ data: idToken });
    
    // Return both the idToken and server response
    return { success: true, idToken, serverResponse };
  } catch (error: any) {
    // Firebase Authentication error codes
    const errorCode = error.code;
    const errorMessage = error.message;
    
    console.error("Firebase Auth Error:", errorCode, errorMessage);
    
    switch (errorCode) {
      case 'auth/invalid-email':
        return { error: true, message: 'Invalid email format.' };
      case 'auth/user-disabled':
        return { error: true, message: 'This user account has been disabled.' };
      case 'auth/user-not-found':
        return { error: true, userNotFound: true, message: 'No user found with this email.' };
      case 'auth/wrong-password':
        return { error: true, message: 'Incorrect password.' };
      case 'auth/invalid-credential':
        return { error: true, message: 'Invalid credentials.' };
      case 'auth/too-many-requests':
        return { error: true, message: 'Too many unsuccessful login attempts. Please try again later.' };
      case 'auth/network-request-failed':
        return { error: true, message: 'Network error. Please check your connection.' };
      default:
        return { error: true, message: `Authentication error: ${errorMessage}` };
    }
  }
};

const loginServerFn = createServerFn({ method: "POST" })
  .validator((token : string) => token)
  .handler(async ({data}) => {
    initFirebaseAdmin()
    console.log("backend login function called with data", data);
    try {
      const decodedToken = await verifyFirebaseToken(data);
      console.log("decodedToken", decodedToken);
      if (!decodedToken) {
        return {
          error: true,
          message: "Invalid token",
        };
      }
      //Create a session
      const session = await useAppSession();

      // Store the user's email in the session
      await session.update({
        userEmail: decodedToken.email,
        firebaseUid: decodedToken.uid,
      });
    } catch (error) {
      console.error("Error verifying Firebase token:", error);
      return {
        error: true,
        message: "Failed to authenticate",
      };
    }
  });

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === "Not authenticated") {
      return <Login />;
    }

    throw error;
  },
});
