import { Card } from "@mui/material";
import { styled, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
const theme = createTheme();

export const MUICard = styled(Card)({
  //   border: "1px solid red",
  padding: "1rem",
  background: "#ffffff",
});

export const DivFilter = styled("div")({
  //   border: "1px solid red",
});

export const DeleteButton = styled(Button)({
  color: "#4B465C",
  border: "1px solid gray",
});

export const DivTable = styled("div")({
  marginTop: "2rem",
  height: "500px",
});
