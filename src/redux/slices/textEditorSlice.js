import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  desc: null,
  isRadio: null,
};

export const textEditorSlice = createSlice({
  name: "textEditor",
  initialState,
  reducers: {
    setDesc: (state, action) => {
      state.desc = action.payload;
    },
    setRadio: (state, action) => {
      state.isRadio = action.payload;
    },
  },
});

export const { setDesc, setRadio } = textEditorSlice.actions;
export const textEditorState = (state) => state.textEditor;

export default textEditorSlice.reducer;
