import { Box, Divider, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { paymentState } from "../../../../redux/slices/paymentSlice";

const PriceDetailsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: "16px",
  padding: theme.spacing(4),
}));

const PriceDetailsItem = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography component="div" className="title" {...props.TitleProps}>
        {props.title}
      </Typography>
      <Typography component="div" className="context" {...props.ContextProps}>
        {props.context}
      </Typography>
    </Box>
  );
};

const PriceDetails = () => {
  const { currencySymbol, ...paymentSelector } = useSelector(paymentState);
  const theme = useTheme();

  return (
    <>
      <PriceDetailsContainer>
        <Typography
          component="div"
          sx={{
            fontWeight: 600,
          }}
        >
          Price Details
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 1,
          }}
        >
          <PriceDetailsItem
            title="Bag Total"
            context={`${currencySymbol}${paymentSelector.price.toLocaleString()}`}
          />
          <PriceDetailsItem
            title="Coupon Discount"
            context={
              paymentSelector.couponAmount
                ? `(${paymentSelector.couponDiscount}${
                    paymentSelector.couponType
                  }) ${currencySymbol}${paymentSelector.couponAmount.toFixed(
                    2,
                  )}`
                : 0
            }
            ContextProps={{
              sx: {
                color: theme.palette.primaryTheme.main,
                fontWeight: 600,
              },
            }}
          />
          <PriceDetailsItem
            title="Tax"
            context={`(${
              paymentSelector.taxPercent
            }%) ${currencySymbol}${paymentSelector.taxPrice.toLocaleString()}`}
          />
          <PriceDetailsItem
            title="Order Total"
            context={`${currencySymbol}${paymentSelector.totalWithoutDiscount.toLocaleString()}`}
          />
        </Box>
      </PriceDetailsContainer>
      <Divider
        sx={{
          color: "black",
        }}
      />
      <PriceDetailsContainer>
        <PriceDetailsItem
          title="Total"
          context={`${currencySymbol}${(
            paymentSelector.total - paymentSelector.couponAmount
          ).toLocaleString()}`}
          TitleProps={{
            sx: {
              fontWeight: 600,
            },
          }}
          ContextProps={{
            sx: {
              fontWeight: 600,
            },
          }}
        />
      </PriceDetailsContainer>
    </>
  );
};

export default PriceDetails;
