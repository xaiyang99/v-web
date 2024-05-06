import { styled } from "@mui/material/styles";

export const AdminDashboardContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(5),
  [theme.breakpoints.down("md")]: {
    padding: "0 10px",
  },
  marginTop: theme.spacing(3),
}));

export const AdminDashboardItem = styled("div")(() => ({}));
