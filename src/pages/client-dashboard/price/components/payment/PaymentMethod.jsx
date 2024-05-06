import { Box, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NormalButton from "../../../../../components/NormalButton";
import {
  PAYMENT_METHOD,
  paymentState,
  setActivePaymentMethod,
} from "../../../../../redux/slices/paymentSlice";
import BCELOnePayment from "./BCELOnePayment";
import StripePayment from "./StripePayment";
import useBcelOnePay from "./hooks/useBcelOnePay";

const PaymentMethodContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: 16,
});

const PaymentMethod = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const paymentSelector = useSelector(paymentState);

  const btnMethodList = useMemo(() => {
    if (paymentSelector?.showBcelOne && paymentSelector?.showStripe) {
      return [PAYMENT_METHOD.bcelOne, PAYMENT_METHOD.stripe];
    }

    if (paymentSelector?.showStripe && !paymentSelector?.showBcelOne) {
      return [PAYMENT_METHOD.stripe];
    }

    if (!paymentSelector?.showStripe && paymentSelector?.showBcelOne) {
      return [PAYMENT_METHOD.bcelOne];
    }

    return [];
  }, []);

  const bcelOnePay = useBcelOnePay();
  const paymentMethodList = () => {
    switch (paymentSelector.activePaymentMethod) {
      case PAYMENT_METHOD.bcelOne:
        return (
          <BCELOnePayment qrCode={bcelOnePay.qrCode} link={bcelOnePay.link} />
        );
      case PAYMENT_METHOD.stripe:
        return <StripePayment />;
      default:
        return;
    }
  };

  return (
    <PaymentMethodContainer>
      <Box
        sx={{
          display: "flex",
          columnGap: 1,
        }}
      >
        {btnMethodList.map((paymentMethod, index) => {
          return (
            <NormalButton
              key={index}
              sx={{
                color: `${theme.palette.primaryTheme.brown()} !important`,
                width: "auto",
                height: "35px",
                padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                fontWeight: 600,
                borderRadius: (theme) => theme.spacing(1),
                ...(paymentSelector.activePaymentMethod === paymentMethod
                  ? {
                      backgroundColor: (theme) =>
                        theme.palette.primaryTheme.main,
                      color: "white !important",
                    }
                  : {
                      ":hover": {
                        color: `${theme.palette.primaryTheme.main} !important`,
                      },
                    }),
                textAlign: "center",
                display: "block",
              }}
              onClick={() => dispatch(setActivePaymentMethod(paymentMethod))}
            >
              {paymentMethod}
            </NormalButton>
          );
        })}
      </Box>
      {paymentMethodList()}
    </PaymentMethodContainer>
  );
};

export default PaymentMethod;
