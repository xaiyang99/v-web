import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataReply: null,
  messageReply: null,
  focus: false,
  files: [],
  currentIndexFile: 0,
};

const chatMessageSlice = createSlice({
  name: "chatMessage",
  initialState,
  reducers: {
    setMessageReply: (state, action) => {
      state.messageReply = action.payload;
    },
    setMessageReplyEMPTY: (state) => {
      state.messageReply = null;
    },
    setChatMessage: (state, action) => {
      state.dataReply = action.payload;
    },
    setChatMessageEMPTY: (state) => {
      state.dataReply = null;
    },
    setFocus: (state, action) => {
      state.focus = action.payload;
    },
    setFiles: (state, action) => {
      state.files.push(action.payload);
    },
    setFilesEmpty: (state) => {
      state.files = [];
    },
    setRemoveFile: (state, action) => {
      state.files.splice(action.payload, 1);
    },
    setCurrentIndex: (state, action) => {
      state.currentIndexFile = action.payload;
    },
    setFilePrev: (state) => {
      if (state.currentIndexFile === state.files.length - 1) {
        state.currentIndexFile = 0;
      } else {
        state.currentIndexFile--;
      }
    },
  },
});

export const {
  setChatMessage,
  setChatMessageEMPTY,
  setMessageReply,
  setMessageReplyEMPTY,
  setFocus,
  setFiles,
  setCurrentIndex,
  setRemoveFile,
  setFilesEmpty,
} = chatMessageSlice.actions;

export const chatMessageSelector = (state) => state.chatMessasge;

export default chatMessageSlice.reducer;
