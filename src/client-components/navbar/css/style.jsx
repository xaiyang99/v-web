import { Box, MenuItem, TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";

export const BoxShowDropDown = styled(Box)({
  padding: "1.5rem",
  borderRadius: "6px",
  marginTop: "-1rem",
  boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
});

export const BoxShowCurrentUser = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
});

export const BoxShowCurrentUserDetail = styled(Box)({
  marginLeft: "0.5rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "space-between",
  justifyContent: "center",
  h6: {
    fontSize: "0.8rem",
    color: "#5D596C",
    margin: "0.2rem 0",
  },
});

export const MenuItems = styled(MenuItem)({
  color: "#5D596C",
  fontSize: "0.8rem",
  "&:hover": {
    background: "#E8F2F1",
    color: "#17766B",
    borderRadius: "6px",
  },
});
export const CustomTableCell = styled({
  root: {
    border: "none",
  },
})(TableCell);
