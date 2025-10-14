import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MenuState {
  theme: "light" | "dark" | "system";
}

const initialState: MenuState = {
  theme: "system",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<"light" | "dark" | "system">) {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
