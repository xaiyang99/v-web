import { Grid, Stack, Switch, Typography, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { encryptId } from "../../../../functions";
import {
  PACKAGE_TYPE,
  paymentState,
  setPackageType,
} from "../../../../redux/slices/paymentSlice";
import * as MUI from "../../css/priceStyle";
import PriceCard from "./PriceCard";

const { REACT_APP_ENCRYPTION_KEY } = process.env;

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#17766B",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const PricingPlans = (props) => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:600px)");
  const { packageType, activePackageType } = useSelector(paymentState);

  return (
    <>
      <MUI.BoxShowSection1>
        <Typography variant="h3">Pricing Plans</Typography>
        <Typography variant="h6">
          All plans inclue 40+ advanced tools and features to boost your
          product.
        </Typography>
        <Typography variant="h6">
          Choose the beset plan to fit your needs
        </Typography>
        <MUI.BoxShowSwitchPlan>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6">Monthly</Typography>
            <AntSwitch
              checked={packageType === PACKAGE_TYPE.annual ? true : false}
              onChange={() => {
                dispatch(
                  setPackageType(
                    packageType !== PACKAGE_TYPE.annual
                      ? PACKAGE_TYPE.annual
                      : PACKAGE_TYPE.monthly,
                  ),
                );
              }}
              inputProps={{ "aria-label": "ant design" }}
            />
            <Typography variant="h6" sx={{ marginLeft: "1rem !important" }}>
              Annual
            </Typography>
          </Stack>
        </MUI.BoxShowSwitchPlan>
      </MUI.BoxShowSection1>
      <MUI.BoxShowSection2>
        <Grid container spacing={isMobile ? 2 : 8}>
          {props.data?.map((packageData, index) => {
            return (
              <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                <PriceCard
                  {...packageData}
                  buttonProps={{
                    onClick: () => {
                      props.onDialogTermsAndConditionsOpen(
                        encryptId(packageData._id, REACT_APP_ENCRYPTION_KEY),
                        packageData,
                      );
                    },
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </MUI.BoxShowSection2>
    </>
  );
};

export default PricingPlans;
