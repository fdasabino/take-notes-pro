import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import menuReducer from "./menu.slice";
import notesReducer from "./notes.slice";
import themeReducer from "./theme.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    notes: notesReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
