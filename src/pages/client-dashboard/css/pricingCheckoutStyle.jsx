import { styled } from "@mui/material/styles";

export const PricingCheckoutContainer = styled("div")(({ theme }) => ({
  borderRadius: "8px",
  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
  backgroundColor: "white",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  [theme.breakpoints.down("lg")]: {
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  [theme.breakpoints.down("md")]: {
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: "20px",
    marginRight: "20px",
  },
}));

export const PricingCheckoutHeader = styled("div")({});

export const PricingCheckoutBody = styled("div")(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(5),
  color: `${theme.palette.primaryTheme.brown()} !important`,
  overflow: "hidden",
}));

export const TitleAndSwitch = styled("div")({
  display: "flex",
  height: "50px",
  minHeight: "50px",
  alignItems: "center",
  justifyContent: "space-between",
});
