import styled from "@emotion/styled";
import { Box, Card, Link, Typography } from "@mui/material";
import { createTheme } from "@mui//material/styles";

const theme = createTheme();
export const CheckBox = styled(Box)({
  display: "flex",
  // border: "1px solid red",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    margin: "0px 10px 0px 10px",
  },
});
export const PremiumCard = styled(Box)({
  // border: "1px solid red",
  display: "flex",
  justifyContent: "center",
});
export const CardDtail = styled(Card)({
  boxShadow: "0px 1px 5px 1px #aaaaaa",
  height: "500px",
  [theme.breakpoints.down("sm")]: {
    // border: "1px solid red",
    width: "350px",
  },
});
export const CardBodyText = styled(Typography)({
  display: "flex",
  alignItems: "center",
  padding: "4px",
});
export const BoxLink = styled(Box)({
  marginTop: "20px",
  display: "flex",
  justifyContent: "end",
  alignItems: "end",
  // border: "1px solid red",
});
export const CardLink = styled(Link)({
  // border: "1px solid red",
  display: "flex",
  alignItems: "center",
  color: "#2F998B",
  fontWeight: "bold",
});
