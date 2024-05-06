import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { paymentState } from "../../../../redux/slices/paymentSlice";
import PackagePlan from "./PackagePlan";
import PriceDetails from "./PriceDetails";

const PackageDetailsContainer = styled("div")({
  borderRadius: "4px",
  border: "1px solid #DBDADE",
});

const PackageDetailsItem = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(4),
  rowGap: "16px",
}));

const PackageDetailsContentItem = styled("div")(({ theme }) => ({
  display: "flex",
  rowGap: 0.5,
  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
}));

const PackageDetails = (props) => {
  const { currencySymbol, addressData, ...paymentSelector } =
    useSelector(paymentState);
  const totalPrice = `${currencySymbol}${(
    paymentSelector.total - paymentSelector.couponAmount
  ).toLocaleString()}`;
  return (
    <PackageDetailsContainer>
      <PackageDetailsItem>
        <Typography
          component="div"
          sx={{
            fontWeight: 600,
          }}
        >
          Package Plans
        </Typography>
        <PackageDetailsContentItem
          sx={{
            flexDirection: "column",
          }}
        >
          <PackagePlan />
        </PackageDetailsContentItem>
        {props.isPayment && (
          <>
            <PackageDetailsContentItem>
              <Typography
                variant="h6"
                className="title"
                sx={{
                  mr: 20,
                  fontWeight: 600,
                }}
              >
                Total
              </Typography>
              <Typography component="div" className="context" variant="h6">
                {totalPrice}
              </Typography>
            </PackageDetailsContentItem>
            <PackageDetailsContentItem>
              <Typography
                variant="body"
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <span>
                  {addressData.first_name} {addressData.last_name}
                  {addressData.tel && `, ${addressData.tel}`}
                </span>
                <span>{addressData.email}</span>
              </Typography>
            </PackageDetailsContentItem>
          </>
        )}
        {props.isAddress && <PriceDetails />}
      </PackageDetailsItem>
    </PackageDetailsContainer>
  );
};

export default PackageDetails;
