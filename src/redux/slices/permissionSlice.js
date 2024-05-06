import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  permission: null,
};

export const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermission: (state, action) => {
      state.permission = action.payload;
    },
  },
});

export const { setPermission } = permissionSlice.actions;

export const permissionState = (state) => state.permission;

export default permissionSlice.reducer;
