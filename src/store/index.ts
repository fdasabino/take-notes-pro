import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/state/auth.slice";
import notesReducer from "@/features/notes/state/notes.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
