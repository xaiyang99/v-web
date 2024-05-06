import { Box, Paper, createTheme, styled } from "@mui/material";

const theme = createTheme();

export const PaperGlobal = styled(Paper)({
  padding: "2rem",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 0.5rem",
  },
  marginTop: "3rem",
});

export const feedbackContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  h2: {
    color: "#5D596C",
  },
});

export const showButtonBox = styled(Box)({
  width: "30%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
});
