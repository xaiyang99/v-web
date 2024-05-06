import { createSlice } from "@reduxjs/toolkit";

const TAX_PERCENT = 0;

export const PACKAGE_TYPE = {
  annual: "annual",
  monthly: "monthly",
};

export const PAYMENT_METHOD = {
  bcelOne: "Bcel One",
  stripe: "Credit card",
};

const initialState = {
  paymentId: null,
  isPayment: false,
  currencySymbol: "$",
  taxValue: TAX_PERCENT / 100,
  taxPercent: TAX_PERCENT,
  couponCode: null,
  couponDiscount: 0,
  couponType: null,
  couponAmount: 0,
  packageType: PACKAGE_TYPE.annual,
  activePackageId: null,
  activePackageType: PACKAGE_TYPE.annual,
  packageData: null,
  activePackageData: {},
  addressData: {},
  isPaymentLoading: false,
  paymentStatus: null,
  paymentData: {},
  taxPrice: 0,
  price: 0,
  totalWithoutDiscount: 0,
  total: 0,
  activeStep: 0,
  showBcelOne: false,
  showStripe: false,
  activePaymentMethod: PAYMENT_METHOD.bcelOne,
  recentPayment: {},
  paymentSteps: {
    0: false,
    1: false,
    2: false,
    3: false,
  },
};

const setDynamicData = (state) => {
  if (state.activePackageId && state.packageData) {
    const activePackage = state.packageData.find(
      (data) => data._id === state.activePackageId,
    );

    if (activePackage) {
      const changedPrice =
        state.activePackageType === PACKAGE_TYPE.annual
          ? activePackage.annualPrice
          : activePackage.monthlyPrice;
      const monthNumber = 1;
      const price = changedPrice * monthNumber;
      const taxPrice = price * (state.taxPercent / 100);
      state.activePackageData = activePackage;
      state.price = price;
      state.taxPrice = taxPrice;
      state.totalWithoutDiscount = price + taxPrice;
      state.total = price + taxPrice;
    }
  }
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setDiscountToPackage: (state, action) => {
      const { coupon } = action.payload;
      const couponAmount = state.total * (coupon.amount / 100);
      state.couponCode = coupon.code;
      state.couponDiscount = coupon.amount;
      if (coupon.type === "percent") {
        state.couponType = "%";
        state.couponAmount = couponAmount;
      } else {
        state.couponType = coupon.type;
      }
    },

    setCalculatePrice: (state, action) => {
      setDynamicData(state);
    },

    setPackageType: (state, action) => {
      state.packageType = action.payload;
    },

    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },

    setActivePaymentId: (state, action) => {
      state.activePackageId = action.payload;
      for (let key in state.paymentSteps) {
        if (key !== "0") {
          state.paymentSteps[key] = false;
        }
      }
    },

    setActivePaymentType: (state, action) => {
      state.activePackageType = action.payload;
    },

    setShowBcel: (state, action) => {
      state.showBcelOne = action.payload;
    },

    setShowStrip: (state, action) => {
      state.showStripe = action.payload;
    },

    setPackageData: (state, action) => {
      state.packageData = action.payload;
    },

    setAddressData: (state, action) => {
      state.addressData = action.payload;
    },

    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },

    setPaymentSteps: (state, action) => {
      const { number, value } = action.payload;
      state.paymentSteps[number] = value;
      state.isPaymentLoading = false;
    },

    setActivePaymentMethod: (state, action) => {
      state.activePaymentMethod = action.payload;
    },

    setRecentPayment: (state, action) => {
      state.recentPayment = action.payload;
    },
    setPaymentId: (state, action) => {
      state.paymentId = action.payload.id;
      state.paymentStatus = action.payload.status;
      state.isPaymentLoading = true;
    },
    // resetPayment: (state, action) => {
    resetPayment: () => {
      return initialState;
    },
  },
});

export const {
  setActivePaymentType,
  setPackageType,
  setActivePaymentId,
  setActivePayment,
  setPackageData,
  setCalculatePrice,
  setAddressData,
  setRecentPayment,
  setActiveStep,
  setPaymentSteps,
  setPaymentStatus,
  setActivePaymentMethod,
  resetPayment,
  setPaymentId,
  setDiscountToPackage,
  setShowBcel,
  setShowStrip,
} = paymentSlice.actions;

export const paymentState = (state) => state.payment;

export default paymentSlice.reducer;
