"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.paymentState = exports.setDiscountToPackage = exports.setPaymentId = exports.resetPayment = exports.setActivePaymentMethod = exports.setPaymentStatus = exports.setPaymentSteps = exports.setActiveStep = exports.setRecentPayment = exports.setAddressData = exports.setCalculatePrice = exports.setPackageData = exports.setActivePayment = exports.setActivePaymentId = exports.paymentSlice = exports.PAYMENT_METHOD = exports.PACKAGE_TYPE = void 0;

var _toolkit = require("@reduxjs/toolkit");

var TAX_PERCENT = 0;
var PACKAGE_TYPE = {
  annual: "annual",
  monthly: "monthly"
};
exports.PACKAGE_TYPE = PACKAGE_TYPE;
var PAYMENT_METHOD = {
  bcelOne: "Bcel One",
  stripe: "Credit card"
};
exports.PAYMENT_METHOD = PAYMENT_METHOD;
var initialState = {
  paymentId: null,
  isPayment: false,
  currencySymbol: "$",
  taxValue: TAX_PERCENT / 100,
  taxPercent: TAX_PERCENT,
  couponCode: null,
  couponDiscount: 0,
  couponType: null,
  couponAmount: 0,
  packageType: null,
  // month / annual
  activePackageId: null,
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
  activePaymentMethod: PAYMENT_METHOD.bcelOne,
  recentPayment: {},
  paymentSteps: {
    0: false,
    1: false,
    2: false,
    3: false
  }
};

var setDynamicData = function setDynamicData(state) {
  if (state.activePackageId && state.packageData) {
    var activePackage = state.packageData.find(function (data) {
      return data._id === state.activePackageId;
    });

    if (activePackage) {
      var monthNumber = activePackage.type === PACKAGE_TYPE.annual ? 1 : 1;
      var price = activePackage.price * monthNumber;
      var taxPrice = price * (state.taxPercent / 100);
      state.packageType = activePackage.type;
      state.activePackageData = activePackage;
      state.price = price;
      state.taxPrice = taxPrice;
      state.totalWithoutDiscount = price + taxPrice;
      state.total = price + taxPrice;
    }
  }
};

var paymentSlice = (0, _toolkit.createSlice)({
  name: "payment",
  initialState: initialState,
  reducers: {
    setDiscountToPackage: function setDiscountToPackage(state, action) {
      var coupon = action.payload.coupon;
      var couponAmount = state.total * (coupon.amount / 100);
      state.couponCode = coupon.code;
      state.couponDiscount = coupon.amount;

      if (coupon.type === "percent") {
        state.couponType = "%";
        state.couponAmount = couponAmount;
      } else {
        state.couponType = coupon.type;
      }
    },
    setCalculatePrice: function setCalculatePrice(state, action) {
      setDynamicData(state);
    },
    setPaymentStatus: function setPaymentStatus(state, action) {
      state.paymentStatus = action.payload;
    },
    setActivePaymentId: function setActivePaymentId(state, action) {
      state.activePackageId = action.payload;

      for (var key in state.paymentSteps) {
        if (key !== "0") {
          state.paymentSteps[key] = false;
        }
      }
    },
    setPackageData: function setPackageData(state, action) {
      state.packageData = action.payload;
    },
    setAddressData: function setAddressData(state, action) {
      state.addressData = action.payload;
    },
    setActiveStep: function setActiveStep(state, action) {
      state.activeStep = action.payload;
    },
    setPaymentSteps: function setPaymentSteps(state, action) {
      var _action$payload = action.payload,
          number = _action$payload.number,
          value = _action$payload.value;
      state.paymentSteps[number] = value;
      state.isPaymentLoading = false;
    },
    setActivePaymentMethod: function setActivePaymentMethod(state, action) {
      state.activePaymentMethod = action.payload;
    },
    setRecentPayment: function setRecentPayment(state, action) {
      state.recentPayment = action.payload;
    },
    setPaymentId: function setPaymentId(state, action) {
      state.paymentId = action.payload.id;
      state.paymentStatus = action.payload.status;
      state.isPaymentLoading = true;
    },
    // resetPayment: (state, action) => {
    resetPayment: function resetPayment() {
      return initialState;
    }
  }
});
exports.paymentSlice = paymentSlice;
var _paymentSlice$actions = paymentSlice.actions,
    setActivePaymentId = _paymentSlice$actions.setActivePaymentId,
    setActivePayment = _paymentSlice$actions.setActivePayment,
    setPackageData = _paymentSlice$actions.setPackageData,
    setCalculatePrice = _paymentSlice$actions.setCalculatePrice,
    setAddressData = _paymentSlice$actions.setAddressData,
    setRecentPayment = _paymentSlice$actions.setRecentPayment,
    setActiveStep = _paymentSlice$actions.setActiveStep,
    setPaymentSteps = _paymentSlice$actions.setPaymentSteps,
    setPaymentStatus = _paymentSlice$actions.setPaymentStatus,
    setActivePaymentMethod = _paymentSlice$actions.setActivePaymentMethod,
    resetPayment = _paymentSlice$actions.resetPayment,
    setPaymentId = _paymentSlice$actions.setPaymentId,
    setDiscountToPackage = _paymentSlice$actions.setDiscountToPackage;
exports.setDiscountToPackage = setDiscountToPackage;
exports.setPaymentId = setPaymentId;
exports.resetPayment = resetPayment;
exports.setActivePaymentMethod = setActivePaymentMethod;
exports.setPaymentStatus = setPaymentStatus;
exports.setPaymentSteps = setPaymentSteps;
exports.setActiveStep = setActiveStep;
exports.setRecentPayment = setRecentPayment;
exports.setAddressData = setAddressData;
exports.setCalculatePrice = setCalculatePrice;
exports.setPackageData = setPackageData;
exports.setActivePayment = setActivePayment;
exports.setActivePaymentId = setActivePaymentId;

var paymentState = function paymentState(state) {
  return state.payment;
};

exports.paymentState = paymentState;
var _default = paymentSlice.reducer;
exports["default"] = _default;