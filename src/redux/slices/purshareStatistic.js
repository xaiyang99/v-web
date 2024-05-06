import { createSlice } from "@reduxjs/toolkit";
import { compareIndochinaDateToGeneral } from "../../functions";
import { slice } from "lodash";

const startDate = compareIndochinaDateToGeneral(new Date());

const initialState = {
  purshaseOption: "weekly",
  purshaseOptionDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly, slice(0, 10));
    })(),
  },
  rebills: "weekly",
  rebillsDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  totalPurshase: "weekly",
  totalPurshaseDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  refund: "weekly",
  refundDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
};

export const purshaseSlice = createSlice({
  name: "purshase",
  initialState,
  reducers: {
    setPurshaseOptionDate: (state, action) => {
      state.purshaseOptionDate = action.payload;
    },
    setPurshaseOption: (state, action) => {
      state.purshaseOption = action.payload;
    },
    setRebills: (state, action) => {
      state.rebills = action.payload.rebills;
      state.rebillsDate = action.payload.date;
    },

    setTotalPurshase: (state, action) => {
      state.totalPurshase = action.payload.option;
      state.totalPurshaseDate = action.payload.date;
    },
    setRefund: (state, action) => {
      state.refund = action.payload.option;
      state.refundDate = action.payload.date;
    },
  },
});

export const {
  setPurshaseOptionDate,
  setPurshaseOption,
  setRebills,
  setTotalPurshase,
  setRefund,
} = purshaseSlice.actions;
export const purshaseState = (state) => state.purshase;
export default purshaseSlice.reducer;
