import { useLazyQuery } from "@apollo/client";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { warningMessage } from "../../../../../components/Alerts";
import InputTextField from "../../../../../components/InputTextField";
import NormalButton from "../../../../../components/NormalButton";
import {
  paymentState,
  setDiscountToPackage,
} from "../../../../../redux/slices/paymentSlice";
import { QUERY_COUPON } from "../../apollo";
import PriceDetails from "../PriceDetails";
import Gift from "./Gift";

const PricingFormContainer = styled("div")({
  borderRadius: "4px",
  border: "1px solid #DBDADE",
});

const PricingFormItem = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(4),
  rowGap: "16px",
}));

const PricingForm = () => {
  const dispatch = useDispatch();
  const paymentSelector = useSelector(paymentState);
  const theme = useTheme();
  const [couponValue, setCouponValue] = useState("");
  const [queryCoupon] = useLazyQuery(QUERY_COUPON, {
    fetchPolicy: "no-cache",
  });
  const onCouponChangeEvent = (e) => {
    setCouponValue(e.target.value);
  };

  const onApplyCouponEvent = async () => {
    try {
      if (couponValue) {
        const couponData = (
          await queryCoupon({
            variables: {
              where: {
                code: couponValue,
              },
            },
          })
        ).data?.coupons.data?.[0];
        if (
          couponData &&
          couponData.typeCouponID.status === "active" &&
          couponData.status === "available" &&
          couponData.typeCouponID.unit === "percent"
        ) {
          dispatch(
            setDiscountToPackage({
              coupon: {
                type: couponData.typeCouponID.unit,
                amount: couponData.typeCouponID.actionCoupon,
                code: couponValue,
              },
            })
          );
        } else {
          warningMessage("The coupon code could not be found", 3000);
        }
      }
    } catch (e) {}
  };

  return (
    <PricingFormContainer>
      <PricingFormItem>
        <Typography
          component="div"
          sx={{
            fontWeight: 600,
          }}
        >
          Offer
        </Typography>
        <Box
          sx={{
            display: "flex",
            columnGap: 4,
          }}
        >
          <InputTextField
            inputLayoutProps={{
              sx: { height: "35px", minHeight: "35px", marginTop: 0 },
            }}
            inputProps={{
              placeholder: "Enter Promo Code",
              value: couponValue,
              onChange: onCouponChangeEvent,
            }}
          />
          <NormalButton
            sx={{
              marginTop: 0,
              width: "auto",
              fontSize: 15,
              fontWeight: 500,
              padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
              height: "35px",
              color: theme.palette.primaryTheme.main,
              borderRadius: "4px",
              display: "block",
              textAlign: "center",
              backgroundColor: "rgba(23, 118, 107, 0.16)",
            }}
            onClick={onApplyCouponEvent}
          >
            Apply
          </NormalButton>
        </Box>
        {(paymentSelector.couponType === "point" ||
          paymentSelector.couponType === "space") && <Gift />}
      </PricingFormItem>
      <Divider
        sx={{
          color: "black",
        }}
      />
      <PriceDetails />
    </PricingFormContainer>
  );
};

export default PricingForm;
