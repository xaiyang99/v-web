import { composeWithDevTools } from "@redux-devtools/extension";
import { configureStore } from "@reduxjs/toolkit";
import chatMessageReducer from "./slices/chatMessageSlice";
import dialogReducer from "./slices/dialogSlice";
import generalReducer from "./slices/generalStatistics";
import paymentReducer from "./slices/paymentSlice";
import purshaseReducer from "./slices/purshareStatistic";
import optionsReducer from "./slices/statistics";
import textEditorReducer from "./slices/textEditorSlice";
import uploadDownloadReducer from "./slices/uploadDownloadStatistic";
import permissionReducer from "./slices/permissionSlice";

export const store = configureStore(
  {
    reducer: {
      payment: paymentReducer,
      dialogOpen: dialogReducer,
      options: optionsReducer,
      textEditor: textEditorReducer,
      chatMessasge: chatMessageReducer,
      purshase: purshaseReducer,
      uploadDownload: uploadDownloadReducer,
      general: generalReducer,
      permission: permissionReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  },
  composeWithDevTools(),
);
