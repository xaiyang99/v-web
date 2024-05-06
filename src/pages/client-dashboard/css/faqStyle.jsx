import { Box, Container, Paper } from "@mui/material";
import { styled, createTheme } from "@mui/material/styles";
const theme = createTheme();

export const ContainerFAQ = styled(Container)({
  padding: "2rem",
  h3: {
    margin: "1rem 0",
    color: "#5D596C",
  },
  h1: {
    textAlign: "center",
    color: "#5D596C",
  },
  h4: {
    textAlign: "center",
    color: "#5D596C",
    margin: "0.5rem 0",
  },
  h6: {
    color: "#5D596C",
    fontWeight: "600",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "0 0.2rem",
    h1: {
      fontSize: "1.3rem",
    },
    h3: {
      fontSize: "1rem",
      padding: "0 1rem",
    },
    h4: {
      fontSize: "0.8rem",
    },
    h6: {
      fontSize: "0.8rem",
    },
  },
});

export const PaperGlobal = styled(Paper)({
  padding: "4rem 2rem",
  [theme.breakpoints.down("sm")]: {
    padding: "1rem 0.5rem",
  },
});

export const BoxShowAccordian = styled(Box)({
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  margin: "1.5rem 0",
  borderRadius: "6px",
});
