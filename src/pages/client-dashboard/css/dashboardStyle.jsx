import { styled } from "@mui/material/styles";

export const DashboardContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(5),
  [theme.breakpoints.down("md")]: {
    padding: "0 10px",
  },
}));

export const DashboardItem = styled("div")({});
