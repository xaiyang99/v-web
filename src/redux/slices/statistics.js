import { createSlice } from "@reduxjs/toolkit";
import { compareIndochinaDateToGeneral } from "../../functions";

const startDate = compareIndochinaDateToGeneral(new Date());

const initialState = {
  refreshing: false,
  toggle: "list",
  toggleOptions: ["list", "grid"],
  optionUserStatic: "weekly",
  isUserData: 0,
  isNewUser: 0,
  optionValueDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  optionSignup: "weekly",
  optionSignupDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  optionSocialSignup: "weekly",
  optionSocialSignupDate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
  option2FA: "weekly",
  option2FADate: {
    startDate: startDate,
    endDate: (() => {
      const lastedDateWeekly = new Date();
      lastedDateWeekly.setDate(lastedDateWeekly.getDate() - 6);
      return compareIndochinaDateToGeneral(lastedDateWeekly);
    })(),
  },
};

export const statisticsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setToggle: (state) => {
      state.toggle = state.toggle === "list" ? "grid" : "list";
    },
    setRefresh: (state) => {
      state.refreshing = true;
    },
    setResetRefresh: (state) => {
      state.refreshing = false;
    },
    setIsUserData: (state, action) => {
      state.isUserData = action.payload;
    },
    setIsNewUser: (state, action) => {
      state.isNewUser = action.payload;
    },
    setOptionValueDate: (state, action) => {
      state.optionValueDate = action.payload;
    },
    setOptionUserStatic: (state, action) => {
      state.optionUserStatic = action.payload;
    },
    setOptionSignup: (state, action) => {
      state.optionSignup = action.payload;
    },
    setOptionSignupDate: (state, action) => {
      state.optionSignupDate = action.payload;
    },

    setOptionSocialSignup: (state, action) => {
      state.optionSocialSignup = action.payload;
    },
    setOptionSocialSignupDate: (state, action) => {
      state.optionSocialSignupDate = action.payload;
    },
    setOption2FA: (state, action) => {
      state.option2FA = action.payload;
    },
    setOption2FADate: (state, action) => {
      state.option2FADate = action.payload;
    },
  },
});

export const {
  setOptionValueDate,
  setOptionUserStatic,
  setOptionSignup,
  setOptionVerifySignupStatic,
  setIsUserData,
  setIsNewUser,
  setRefresh,
  setResetRefresh,
  setToggle,
  setOptionSignupDate,
  setOptionSocialSignup,
  setOptionSocialSignupDate,
  setOption2FA,
  setOption2FADate,
} = statisticsSlice.actions;
export const selectOptionState = (state) => state.options;

export default statisticsSlice.reducer;
