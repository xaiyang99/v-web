import { Box, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import {
  PACKAGE_TYPE,
  paymentState,
} from "../../../../../redux/slices/paymentSlice";
import PackagePlan from "../PackagePlan";

const MyShoppingBagContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: 16,
  fontSize: 16,
});

const MyShoppingBagContent = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(4),
  borderRadius: 4,
  border: "1px solid #DBDADE",
}));

const MyShoppingBag = () => {
  const paymentSelector = useSelector(paymentState);
  const theme = useTheme();
  const currentPackageType = paymentSelector.activePackageType;
  const packagePrice =
    (currentPackageType === PACKAGE_TYPE.annual
      ? paymentSelector.activePackageData.annualPrice
      : paymentSelector.activePackageData.monthlyPrice) || 0;

  return (
    <MyShoppingBagContainer>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
        }}
      >
        My Shopping Bag
      </Typography>
      <MyShoppingBagContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 2,
          }}
        >
          <PackagePlan />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
          }}
        >
          <span
            style={{
              color: theme.palette.primaryTheme.main,
            }}
          >
            {packagePrice && (
              <>
                {paymentSelector.currencySymbol}
                {packagePrice?.toLocaleString()}
              </>
            )}
          </span>
        </Typography>
      </MyShoppingBagContent>
    </MyShoppingBagContainer>
  );
};

export default MyShoppingBag;
