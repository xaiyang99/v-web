import { Box, Grid, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DialogV1 from "../../../../../components/DialogV1";
import NormalButton from "../../../../../components/NormalButton";
import useAuth from "../../../../../hooks/useAuth";
import {
  PACKAGE_TYPE,
  paymentState,
  setActivePaymentId,
  setActivePaymentType,
  setCalculatePrice,
  setPaymentSteps,
} from "../../../../../redux/slices/paymentSlice";
import Offer from "../Offer";
import PricingPlans from "../PricingPlans";
import MyShoppingBag from "../cart/MyShoppingBag";
import PricingForm from "../cart/PricingForm";

const CartContainer = styled("div")({});

const CartPricingDetailWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: 32,
});

const CartPricingFormWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
});

const Cart = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const paymentSelector = useSelector(paymentState);
  const [isDialogPlansOpen, setIsDialogPlansOpen] = useState(false);
  const { generateNewToken } = useAuth();

  useEffect(() => {
    dispatch(
      setPaymentSteps({
        number: 0,
        value: true,
      }),
    );
  }, []);

  return (
    <CartContainer>
      <Grid container spacing={5}>
        <Grid item md={9} sm={12}>
          <CartPricingDetailWrapper>
            <Offer
              title="Available Offer"
              context={
                <>
                  <div>
                    -0% Instant Discount on Bank of America Corp Bank Debit and
                    Credit cards.
                  </div>
                  <div>
                    -50% Cashback Voucher of up to $60 on first ever PayPal
                    transaction.
                  </div>
                </>
              }
            />
            <Box>
              <MyShoppingBag />
              <NormalButton
                sx={{
                  fontSize: 15,
                  fontWeight: 500,
                  marginTop: 3,
                  width: "235px",
                  padding: 2,
                  color: theme.palette.primaryTheme.main,
                  borderRadius: "4px",
                  display: "block",
                  textAlign: "center",
                  backgroundColor: "rgba(23, 118, 107, 0.16)",
                }}
                onClick={() => setIsDialogPlansOpen(true)}
              >
                Change plan
              </NormalButton>
            </Box>
          </CartPricingDetailWrapper>
        </Grid>
        <Grid item md={3} sm={12} width={"100%"}>
          <CartPricingFormWrapper>
            <PricingForm />
            <NormalButton
              sx={{
                marginTop: 3,
                width: "auto",
                height: "35px",
                padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                borderRadius: (theme) => theme.spacing(1),
                backgroundColor: (theme) => theme.palette.primaryTheme.main,
                textAlign: "center",
                display: "block",
                color: "white !important",
              }}
              onClick={() => props.onSubmit()}
            >
              Next address
            </NormalButton>
          </CartPricingFormWrapper>
        </Grid>
      </Grid>
      <DialogV1
        isOpen={isDialogPlansOpen}
        onClose={() => setIsDialogPlansOpen(false)}
        dialogProps={{
          sx: {
            zIndex: 9999999999,
          },
          PaperProps: {
            sx: {
              overflowY: "initial",
              maxWidth: "1250px",
            },
          },
        }}
        dialogContentProps={{
          sx: {
            borderRadius: "6px",
            padding: (theme) => `${theme.spacing(8)} ${theme.spacing(6)}`,
          },
        }}
      >
        <PricingPlans
          data={props.packageData}
          onDialogTermsAndConditionsOpen={(packageId, packageData) => {
            dispatch(setActivePaymentType(packageData._type));
            dispatch(setActivePaymentId(packageData._id));
            dispatch(setCalculatePrice());
            navigate(`/pricing/checkout/${packageId}`);
          }}
        />
      </DialogV1>
    </CartContainer>
  );
};

export default Cart;
