import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openDialog: (state) => {
      state.isOpen = true;
    },
    closeDialog: (state) => {
      state.isOpen = false;
    },
  },
});
export const { actions: dialogActions } = dialogSlice;
export const dialogState = (state) => state.dialog;
export default dialogSlice.reducer;
