import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  paymentState,
  setPaymentSteps,
} from "../../../../../redux/slices/paymentSlice";
import Offer from "../Offer";
import PackageDetails from "../PackageDetails";
import PaymentMethod from "../payment/PaymentMethod";

const PaymentContainer = styled("div")({});

const PaymentFormWrapper = styled("div")({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  rowGap: 16,
});

const PackageDetailsWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
});

const Payment = () => {
  const dispatch = useDispatch();
  const paymentSelector = useSelector(paymentState);
  useEffect(() => {
    dispatch(
      setPaymentSteps({
        number: 2,
        value: true,
      }),
    );
  }, []);

  return (
    <PaymentContainer>
      <Grid container spacing={5}>
        <Grid item md={9} sm={12}>
          <PaymentFormWrapper>
            <Offer
              title="Bank Offer"
              context={
                <>
                  <div>
                    - 10% Instant Discount on Bank of America Corp Bank Debit
                    and Credit cards
                  </div>
                </>
              }
            />

            {!paymentSelector.paymentSteps[3] ? (
              <>
                {paymentSelector?.activePaymentMethod === "" ? (
                  <></>
                ) : (
                  <Fragment>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      You can choose a payment method
                    </Typography>
                    <PaymentMethod />
                  </Fragment>
                )}
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  Expired session
                </Typography>
                <div>Your payment has already been processed.</div>
              </Box>
            )}
          </PaymentFormWrapper>
        </Grid>
        <Grid item md={3} sm={12}>
          <PackageDetailsWrapper>
            <PackageDetails isPayment />
          </PackageDetailsWrapper>
        </Grid>
      </Grid>
    </PaymentContainer>
  );
};

export default Payment;
