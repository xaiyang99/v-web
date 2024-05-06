import { Card, CardContent } from "@mui/material";
import { styled, createTheme } from "@mui/material/styles";
const theme = createTheme();

export const CardMedia = styled(Card)({
  width: "230px",
  [theme.breakpoints.down("md")]: {
    width: "160px",
    marginLeft: "0.3rem",
  },
});

export const CardMediaContent = styled(CardContent)({
  display: "flex",
  alignItems: "start",
  justifyContent: "start",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    h3: {
      display: "none",
    },
  },
});
