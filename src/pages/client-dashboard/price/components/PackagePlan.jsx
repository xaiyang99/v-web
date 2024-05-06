import { Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import {
  PACKAGE_TYPE,
  paymentState,
} from "../../../../redux/slices/paymentSlice";

const PackagePlan = () => {
  const { currencySymbol, ...paymentSelector } = useSelector(paymentState);
  const theme = useTheme();
  const currentPackageType = paymentSelector.activePackageType;
  const packagePrice =
    (currentPackageType === PACKAGE_TYPE.annual
      ? paymentSelector.activePackageData.annualPrice
      : paymentSelector.activePackageData.monthlyPrice) || 0;
  return (
    <>
      <Typography
        className="package-plan-title"
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        {currentPackageType === PACKAGE_TYPE.annual ? (
          <>
            Annual&nbsp;
            <span
              style={{
                color: theme.palette.primaryTheme.main,
              }}
            >
              (Save up to 10%)
            </span>
          </>
        ) : (
          <>Manual</>
        )}
      </Typography>
      <Typography variant="body">
        Standard - For small to medium businesses
      </Typography>
      <Typography variant="body" fontSize={13}>
        {/* <span
          style={{
            color: theme.palette.primaryTheme.brown(0.5),
            textDecoration: "line-through",
            textDecorationColor: theme.palette.primaryTheme.brown(0.5),
          }}
        >
          $49
        </span> */}
        {currencySymbol}
        {packagePrice?.toLocaleString()}{" "}
        {currentPackageType === PACKAGE_TYPE.annual ? "x 1 year" : "x 1 month"}
      </Typography>
    </>
  );
};

export default PackagePlan;
