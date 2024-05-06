import { createSlice } from "@reduxjs/toolkit";
import { compareIndochinaDateToGeneral } from "../../functions";

const startDate = compareIndochinaDateToGeneral(new Date());

const initialState = {
  broadcast: "weekly",
  broadcastDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  coupon: "weekly",
  couponDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  annoucement: "weekly",
  annoucementDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  ticket: "weekly",
  ticketDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  advertising: "weekly",
  advertisingDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
};

export const generalStatistic = createSlice({
  name: "general",
  initialState,
  reducers: {
    setBroadcast: (state, action) => {
      state.broadcast = action.payload.broadcast;
      state.broadcastDate = action.payload.date;
    },
    setCoupon: (state, action) => {
      state.coupon = action.payload.coupon;
      state.couponDate = action.payload.date;
    },
    setAnnoucement: (state, action) => {
      state.annoucement = action.payload.annoucement;
      state.annoucementDate = action.payload.date;
    },
    setTicket: (state, action) => {
      state.ticket = action.payload.ticket;
      state.ticketDate = action.payload.date;
    },
    setAdvertising: (state, action) => {
      state.advertising = action.payload.advertising;
      state.advertisingDate = action.payload.date;
    },
  },
});

export const {
  setBroadcast,
  setCoupon,
  setAnnoucement,
  setTicket,
  setAdvertising,
} = generalStatistic.actions;
export const generalState = (state) => state.general;
export default generalStatistic.reducer;
