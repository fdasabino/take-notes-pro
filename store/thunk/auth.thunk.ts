import { auth } from "@/firebase/firebase";
import { setError, setLoading, setUser } from "@/store/auth.slice";
import { AuthUser } from "@/store/types/auth.types";
import { Action, createAsyncThunk, Dispatch, Unsubscribe } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// Helper functions
export const listenToAuthChanges = (dispatch: Dispatch<Action>): Unsubscribe => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  const unsubscribe = onAuthStateChanged(
    auth,
    (user) => {
      const authUser = user
        ? {
            uid: user.uid,
            email: user.email,
            imageURL: user.photoURL,
            name: user.displayName,
          }
        : null;
      dispatch(setUser(authUser));
      dispatch(setLoading(false));
    },
    (error) => {
      dispatch(setError(getFirebaseErrorMessage(error)));
      dispatch(setLoading(false));
    }
  );

  return unsubscribe;
};

const googleProvider = new GoogleAuthProvider();

export const getFirebaseErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred while authenticating.";
};

// Thunks
export const signUpWithEmail = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/signUpWithEmail", async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid, email: userEmail } = userCredential.user;
    return { uid, email: userEmail };
  } catch (error) {
    return rejectWithValue(getFirebaseErrorMessage(error));
  }
});

export const signInWithEmail = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/signInWithEmail", async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { uid, email: userEmail } = userCredential.user;
    return { uid, email: userEmail };
  } catch (error) {
    return rejectWithValue(getFirebaseErrorMessage(error));
  }
});

export const signOutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/signOutUser",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (error) {
      return rejectWithValue(getFirebaseErrorMessage(error));
    }
  }
);

export const signInWithGoogle = createAsyncThunk<AuthUser, void, { rejectValue: string }>(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { uid, email, photoURL, displayName } = result.user;
      return { uid, email, imageURL: photoURL, name: displayName };
    } catch (error) {
      return rejectWithValue(getFirebaseErrorMessage(error));
    }
  }
);

export const resetPassword = createAsyncThunk<void, { email: string }, { rejectValue: string }>(
  "auth/resetPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      return rejectWithValue(getFirebaseErrorMessage(error));
    }
  }
);
