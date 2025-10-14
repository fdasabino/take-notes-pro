import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import { Timestamp, collection, getDocs, type DocumentData, type QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export interface NoteDocument {
  id: string;
  title?: string;
  content?: string;
  createdAt?: string;
}

interface NotesState {
  items: NoteDocument[];
  loading: boolean;
  error: string | null;
  lastFetchedUserId: string | null;
}

const initialState: NotesState = {
  items: [],
  loading: false,
  error: null,
  lastFetchedUserId: null,
};

const serializeTimestamp = (value: unknown): string | undefined => {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (value && typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
    const { seconds, nanoseconds } = value as { seconds: number; nanoseconds: number };
    return new Timestamp(seconds, nanoseconds).toDate().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return undefined;
};

const mapDocumentToNote = (snapshot: QueryDocumentSnapshot<DocumentData>): NoteDocument => {
  const data = snapshot.data();

  const normalized: NoteDocument = {
    id: snapshot.id,
    ...data,
  } as NoteDocument;

  if ("createdAt" in data) {
    normalized.createdAt = serializeTimestamp(data.createdAt) ?? normalized.createdAt;
  }

  return normalized;
};

const getFirestoreErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to fetch notes due to an unexpected error.";
};

export const fetchNotesForUser = createAsyncThunk<
  NoteDocument[],
  { userId: string },
  { rejectValue: string }
>("notes/fetchNotesForUser", async ({ userId }, { rejectWithValue }) => {
  if (!userId) {
    return rejectWithValue("A user must be signed in to fetch notes.");
  }

  try {
    const notesRef = collection(db, "users", userId, "notes");
    const snapshot = await getDocs(notesRef);

    return snapshot.docs.map(mapDocumentToNote);
  } catch (error) {
    return rejectWithValue(getFirestoreErrorMessage(error));
  }
});

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearNotes(state) {
      state.items = [];
      state.error = null;
      state.lastFetchedUserId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotesForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotesForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
        state.lastFetchedUserId = action.meta.arg.userId;
      })
      .addCase(fetchNotesForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to fetch notes.";
        state.items = [];
        state.lastFetchedUserId = null;
      });
  },
});

export const { clearNotes } = notesSlice.actions;
export default notesSlice.reducer;
