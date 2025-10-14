import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

export interface NoteDocument {
  id: string;
  title?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
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

const mapDocumentToNote = (snapshot: DocumentSnapshot<DocumentData>): NoteDocument => {
  const data = snapshot.data();

  if (!data) {
    throw new Error("Note is missing data.");
  }

  const normalized: NoteDocument = {
    id: snapshot.id,
    ...data,
  } as NoteDocument;

  if ("createdAt" in data) {
    normalized.createdAt = serializeTimestamp(data.createdAt) ?? normalized.createdAt;
  }

  if ("updatedAt" in data) {
    normalized.updatedAt = serializeTimestamp(data.updatedAt) ?? normalized.updatedAt;
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

export const createNoteForUser = createAsyncThunk<
  NoteDocument,
  { userId: string; note: Omit<NoteDocument, "id" | "createdAt" | "updatedAt"> },
  { rejectValue: string }
>("notes/createNoteForUser", async ({ userId, note }, { rejectWithValue }) => {
  if (!userId) {
    return rejectWithValue("A user must be signed in to create a note.");
  }

  try {
    const notesRef = collection(db, "users", userId, "notes");
    const docRef = await addDoc(notesRef, {
      ...note,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snapshot = await getDoc(docRef);
    return mapDocumentToNote(snapshot);
  } catch (error) {
    return rejectWithValue(getFirestoreErrorMessage(error));
  }
});

export const updateNoteForUser = createAsyncThunk<
  NoteDocument,
  { userId: string; noteId: string; changes: Partial<Omit<NoteDocument, "id" | "createdAt">> },
  { rejectValue: string }
>("notes/updateNoteForUser", async ({ userId, noteId, changes }, { rejectWithValue }) => {
  if (!userId) {
    return rejectWithValue("A user must be signed in to update a note.");
  }

  try {
    const noteRef = doc(db, "users", userId, "notes", noteId);
    await updateDoc(noteRef, {
      ...changes,
      updatedAt: serverTimestamp(),
    });
    const snapshot = await getDoc(noteRef);
    return mapDocumentToNote(snapshot);
  } catch (error) {
    return rejectWithValue(getFirestoreErrorMessage(error));
  }
});

export const deleteNoteForUser = createAsyncThunk<
  string,
  { userId: string; noteId: string },
  { rejectValue: string }
>("notes/deleteNoteForUser", async ({ userId, noteId }, { rejectWithValue }) => {
  if (!userId) {
    return rejectWithValue("A user must be signed in to delete a note.");
  }

  try {
    const noteRef = doc(db, "users", userId, "notes", noteId);
    await deleteDoc(noteRef);
    return noteId;
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
      })
      .addCase(createNoteForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNoteForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload, ...state.items];
        state.error = null;
        state.lastFetchedUserId = action.meta.arg.userId;
      })
      .addCase(createNoteForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to create note.";
      })
      .addCase(updateNoteForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNoteForUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedNote = action.payload;
        const index = state.items.findIndex((note) => note.id === updatedNote.id);
        if (index >= 0) {
          state.items[index] = updatedNote;
        } else {
          state.items.push(updatedNote);
        }
        state.error = null;
        state.lastFetchedUserId = action.meta.arg.userId;
      })
      .addCase(updateNoteForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to update note.";
      })
      .addCase(deleteNoteForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNoteForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((note) => note.id !== action.payload);
        state.error = null;
        state.lastFetchedUserId = action.meta.arg.userId;
      })
      .addCase(deleteNoteForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unable to delete note.";
      });
  },
});

export const { clearNotes } = notesSlice.actions;
export default notesSlice.reducer;
