import React from "react";
import { useSelector } from "react-redux";
import { paymentState } from "../../../../../../redux/slices/paymentSlice";

const useStripePaymentStatus = (id) => {
  const { paymentStatus, isPayment, paymentId } = useSelector(paymentState);
  const handleCancel = () => {
    const axios = require("axios");
    let data = JSON.stringify({
      paymentId: id ? id : paymentId,
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: process.env.REACT_APP_PAYMENT_CANCEL,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  };
  React.useEffect(() => {
    if (paymentStatus === "cancel" && paymentId && isPayment) {
      handleCancel();
    }
  }, [isPayment, paymentId, paymentStatus, id]);

  return handleCancel;
};

export default useStripePaymentStatus;
