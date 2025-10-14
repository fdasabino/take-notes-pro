import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe,
} from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { createAsyncThunk, createSlice, PayloadAction, type AnyAction } from "@reduxjs/toolkit";
import type { Dispatch } from "redux";
import { FirebaseError } from "firebase/app";
import { auth } from "@/firebase/firebase";

export interface AuthUser {
  imageURL?: string | null;
  name?: string | null;
  uid: string;
  email: string | null;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const googleProvider = new GoogleAuthProvider();

const getFirebaseErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred while authenticating.";
};

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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to create account.";
      })
      .addCase(signInWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to sign in.";
      })
      .addCase(signOutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to sign out.";
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to sign in with Google.";
      });
  },
});

export const listenToAuthChanges = (dispatch: Dispatch<AnyAction>): Unsubscribe => {
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

export const { setLoading, setUser, setError } = authSlice.actions;
export default authSlice.reducer;
