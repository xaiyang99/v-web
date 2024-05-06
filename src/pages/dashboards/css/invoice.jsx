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

export const InvoiceManage = styled(Box)(({ theme, ...props }) => ({
  display: "flex",
  columnGap: theme.spacing(2),
}));
export const FilterInvoice = styled(Box)({
  display: "flex",
});
export const FilterExport = styled(Box)({
  display: "flex",
});
