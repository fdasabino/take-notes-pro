import { createSlice } from "@reduxjs/toolkit";
import {
  createNoteForUser,
  deleteNoteForUser,
  fetchNotesForUser,
  updateNoteForUser,
} from "@/features/notes/api/notes.thunk";
import { NotesState } from "@/features/notes/types/notes.types";

const initialState: NotesState = {
  items: [],
  loading: false,
  error: null,
  lastFetchedUserId: null,
};

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
