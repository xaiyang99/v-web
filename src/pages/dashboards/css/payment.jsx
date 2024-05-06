import { Box, styled } from "@mui/material";
import { createTheme } from "@mui/material/styles";
const theme = createTheme();

export const ListFilter = styled(Box)({
  display: "flex",
  flexDirection: "column",
  marginTop: "1rem",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
});

export const PaymentManage = styled(Box)(({ theme }) => ({
  display: "flex",
  columnGap: theme.spacing(2),
}));
export const FilterPayment = styled(Box)({
  display: "flex",
});
export const FilterExport = styled(Box)({
  display: "flex",
});
