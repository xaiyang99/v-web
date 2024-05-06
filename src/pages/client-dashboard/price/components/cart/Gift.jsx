import { Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { stringPluralize } from "../../../../../functions";
import { paymentState } from "../../../../../redux/slices/paymentSlice";

const GiftContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 4,
  display: "flex",
  flexDirection: "column",
  rowGap: 16,
  backgroundColor: theme.palette.primaryTheme.brown(0.08),
}));

const Gift = () => {
  const paymentSelector = useSelector(paymentState);
  const theme = useTheme();
  return (
    <GiftContainer>
      <Typography
        component="div"
        sx={{
          fontWeight: 600,
        }}
      >
        Recieving {stringPluralize(2, paymentSelector.couponType, "s")}.
      </Typography>
      <Typography component="div">
        Amount: {paymentSelector.couponAmount} {paymentSelector.couponType}.
      </Typography>
      {/* <Typography
        component="div"
        sx={{
          fontWeight: 600,
          color: theme.palette.primaryTheme.main,
        }}
      >
        Add a gift wrap
      </Typography> */}
    </GiftContainer>
  );
};

export default Gift;
