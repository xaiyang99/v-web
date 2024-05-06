import { Button, Tab, Tabs, TextField } from "@mui/material";
import { styled, createTheme } from "@mui/material/styles";
import { Container } from "@mui/system";
const theme = createTheme();

export const SearchContainer = styled(Container)({
  marginTop: "10rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [theme.breakpoints.down("md")]: {
    marginTop: "5rem",
  },
});

export const TextFeildSearch = styled(TextField)({
  border: "1px solid #17766B",
  outline: "none !important",
  borderRadius: "5px",
  "&:hover": {
    outline: "none",
    border: "1px solid #17766B",
  },
});

export const ButtonSearch = styled(Button)({
  background: "#2F998B",
  "&:hover": {
    background: "#2F998B",
  },
});

export const BannerContainer = styled(Container)({
  marginTop: "2rem",
});

export const MenuTabs = styled(Tabs)({
  [theme.breakpoints.down("md")]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const MenuTab = styled(Tab)({
  padding: "0.8rem 0.1rem",
});

export const DivDownloadSection = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px",
  [theme.breakpoints.between("sm", "md")]: {
    padding: "0 0.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    alignItems: "start",
    flexDirection: "column",
  },
});

export const DivDownloadSectionLeft = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  [theme.breakpoints.between("sm", "md")]: {
    flexDirection: "row",
    alignItems: "start",
  },
});

export const DivIcon = styled("div")({
  height: "5rem",
  width: "5rem",
  [theme.breakpoints.between("sm", "md")]: {
    display: "none",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
});

export const DivDetails = styled("div")({
  marginLeft: "2rem",
  h2: {
    margin: "0",
    fontSize: "20px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
    },
  },
  div: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "0.5rem 0",
  },
  [theme.breakpoints.down("md")]: {
    marginLeft: "0",
  },
  [theme.breakpoints.down("sm")]: {},
});

export const DivDownloadSectionRight = styled("div")({
  [theme.breakpoints.down("md")]: {
    textAlign: "center",
  },
});
