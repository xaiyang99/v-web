import { styled } from "@mui/material";

export const StatisticsContainer = styled("div")({
  height: "auto",
});

export const StatisticsNav = styled("div")(({ theme }) => ({
  margin: "12px 10px",
  display: "flex",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));
export const StatisticsPaper = styled("div")({
  margin: "12px 0",
});
export const CardPaperLeft = styled("div")(({ theme }) => ({
  marginTop: "20px",
  flex: "0 0 15%",
  [theme.breakpoints.down("md")]: {
    flex: "0 0 25%",
  },
}));
export const CardPaperRight = styled("div")({
  flex: "1",
});
export const StatisticsItem = styled("div")({
  boxShadow: "rgba(0, 0, 0, 0.09) 0px 1px 8px",
  marginTop: "10px",
});
export const StatisticAutoComplete = styled("div")(({ theme }) => ({
  width: "80%",
  [theme.breakpoints.down("sm")]: {
    marginTop: "10px",
    width: "100%",
  },
}));
