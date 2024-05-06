import { styled, createTheme } from "@mui/material/styles";
const theme = createTheme();

export const CardHeaderTitle = styled("div")({
  h3: {
    color: "#5D596C",
    fontSize: "1.2rem",
    marginBottom: "1rem",
  },
});

export const CardHeaderFunction = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const DivLeftHeader = styled("div")({
  width: "50%",
  [theme.breakpoints.between("sm", "md")]: {
    width: "30%",
  },
});

export const DivRightHeader = styled("div")({
  width: "50%",
  [theme.breakpoints.between("sm", "md")]: {
    width: "70%",
    marginLeft: "1rem",
  },
});
