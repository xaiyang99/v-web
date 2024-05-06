import { styled, createTheme } from "@mui/material/styles";
const theme = createTheme();

export const customTheme = createTheme({
  breakpoints: {
    values: {
      width960: 960,
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Banner FAQ
export const DivFAQBanner = styled("div")(({ theme }) => ({
  height: "10rem",
  background: "#292929",
  marginTop: "5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  h1: {
    color: "#ffffff",
    fontSize: "3.5rem",
    zIndex: "999",
  },
  [theme.breakpoints.down("width960")]: {
    marginTop: "3rem",
  },
  [theme.breakpoints.between("sm", "md")]: {
    h1: {
      textAlign: "center",
      fontSize: "3rem",
    },
  },
  [theme.breakpoints.down("sm")]: {
    h1: {
      textAlign: "center",
      fontSize: "2.3rem",
    },
  },
}));

export const ImageShape01 = styled("div")({
  position: "absolute",
  left: "10rem",
  opacity: "0.05",
  [theme.breakpoints.between("lg", "xl")]: {
    left: "6rem",
  },
});

export const ImageShape02 = styled("div")({
  position: "absolute",
  left: "60rem",
  opacity: "0.03",
  bottom: "1",
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
});

export const ImageShape03 = styled("div")({
  position: "absolute",
  right: "0",
  opacity: "0.05",
  [theme.breakpoints.down("lg")]: {
    right: "2rem",
  },
});

export const ImageShape04 = styled("div")({
  position: "absolute",
  right: "75rem",
  opacity: "0.08",
  top: "1rem",
  [theme.breakpoints.between("lg", "xl")]: {
    right: "50rem",
    border: "1px solid red",
  },
});
