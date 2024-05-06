import { createSlice } from "@reduxjs/toolkit";
import { compareIndochinaDateToGeneral } from "../../functions";

const startDate = compareIndochinaDateToGeneral(new Date());

const initialState = {
  uploadCount: "weekly",
  uploadCountDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  uploadSize: "weekly",
  uploadSizeDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  uploadSuccess: "weekly",
  uploadSuccessDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  uploadFailed: "weekly",
  uploadFailDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  uploadDevice: "weekly",
  uploadDeviceDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  uploadCountry: "weekly",
  uploadCountryDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
};

export const uploadDownloadStatistic = createSlice({
  name: "uploadDownload",
  initialState,
  reducers: {
    setUploadCount: (state, action) => {
      state.uploadCount = action.payload.uploadCount;
      state.uploadCountDate = action.payload.date;
    },
    setUploadSize: (state, action) => {
      state.uploadSize = action.payload.uploadSize;
      state.uploadSizeDate = action.payload.date;
    },
    setUploadSuccess: (state, action) => {
      state.uploadSuccess = action.payload.success;
      state.uploadSuccessDate = action.payload.date;
    },
    setUploadFailed: (state, action) => {
      state.uploadFailed = action.payload.failed;
      state.uploadFailDate = action.payload.date;
    },
    setUploadDevice: (state, action) => {
      state.uploadDevice = action.payload.device;
      state.uploadDeviceDate = action.payload.date;
    },
    setUploadCountry: (state, action) => {
      state.uploadCountry = action.payload.contry;
      state.uploadCountryDate = action.payload.date;
    },
  },
});

export const {
  setUploadCount,
  setUploadSize,
  setUploadSuccess,
  setUploadDevice,
  setUploadFailed,
  setUploadCountry,
} = uploadDownloadStatistic.actions;
export const uploadDownState = (state) => state.uploadDownload;
export default uploadDownloadStatistic.reducer;
