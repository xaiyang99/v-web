import { styled, createTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  TableContainer,
  Typography,
} from "@mui/material";

export const LineReward = styled(Box)({
  marginTop: "150px",
  borderTop: "2px solid #ECECEC",
});

export const DataTableReward = styled(Box)({
  marginTop: "50px",
});
export const CardReward = styled(Card)({
  marginTop: "10px",
  boxShadow: "0px 0px 1px 1px #E7E7E7",
});
export const CardContentReward = styled(CardContent)({
  //   border: "2px solid red",
});
export const PaidcontentReward = styled(Box)({
  display: "flex",
  //   border: "2px solid red",
  justifyContent: "space-between",
});

export const RewardTypography = styled(Typography)({
  paddingTop: "20px",
});
export const LineCardReward = styled(Box)({
  marginTop: "20px",
  borderTop: "2px solid #ECECEC",
});
export const CardRewardButton = styled(Button)({
  marginTop: "50px",
  background: "#2F998B",
  color: "#fff",
  padding: "10px 30px 10px 30px",
  borderRadius: "8px",
  "&:hover": {
    background: "#2F998B",
    opacity: 0.8,
  },
  marginBottom: "20px",
});

export const RewardPagination = styled("div")({
  marginTop: "50px",
  display: "flex",
  justifyContent: "flex-end",
});
export const PaginationRoot = styled("div")({
  "& .MuiPaginationItem-icon": {
    color: "#2F998B",
  },
});
//size theme small size

export const tableRewardTheme = createTheme({
  breakpoints: {
    values: {
      // for mobile size
      width768: 768,
      width570: 570,
      width600: 600,
      width500: 500,
      width400: 400,
      width350: 350,
      width300: 300,
      width200: 200,
      width390: 390,
      width395: 395,
      width960: 960,
      widthMinIpadMini: 760,
      widthMaxIpadMini: 800,
      widthMaxIpadAir: 850,
      widthMaxSurfacePro: 950,
    },
  },
});
// responsive

export const TableContainerSize = styled(TableContainer)(({ theme }) => ({
  overflow: "auto",
  [theme.breakpoints.between("width390", "width395")]: {
    overflow: "auto",
    maxWidth: 310,
  },
  [theme.breakpoints.between("width200", "width350")]: {
    overflow: "auto",
    maxWidth: 250,
  },
  [theme.breakpoints.between("width350", "width390")]: {
    overflow: "auto",
    maxWidth: 295,
    // border: "1px solid red",
  },
  [theme.breakpoints.between("width400", "width500")]: {
    overflow: "auto",
    maxWidth: 330,
  },
  [theme.breakpoints.between("width500", "width600")]: {
    overflow: "auto",
    maxWidth: 450,
  },
  [theme.breakpoints.between("widthMinIpadMini", "widthMaxIpadMini")]: {
    overflow: "auto",
    maxWidth: 680,
  },
  [theme.breakpoints.between("widthMinIpadMini", "widthMaxIpadAir")]: {
    overflow: "auto",
    maxWidth: 730,
  },
  [theme.breakpoints.between("widthMaxIpadAir", "widthMaxSurfacePro")]: {
    overflow: "auto",
    maxWidth: 820,
  },
  [theme.breakpoints.down("sm")]: {
    border: "1px solid black",
    overflow: "auto",
  },

  [theme.breakpoints.down("md")]: {
    border: "1px solid blue",
    overflow: "auto",
  },
  [theme.breakpoints.up("lg")]: {
    border: "1px solid yellow",
    overflow: "auto",
  },
  [theme.breakpoints.up("xl")]: {
    border: "1px solid green",
    overflow: "auto",
  },
}));
