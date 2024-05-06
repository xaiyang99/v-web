import { styled, createTheme } from "@mui/material/styles";
const theme = createTheme();
export const FavouriteContainer = styled("div")(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.down("lg")]: {
    paddingLeft: "30px",
    paddingRight: "30px",
  },
}));

export const FavouriteList = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: "25px",
});

export const FavouriteItem = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: "8px",
});

export const TitleAndSwitch = styled("div")({
  display: "flex",
  height: "50px",
  alignItems: "center",
  justifyContent: "space-between",
});

export const ListButtonRecent = styled("div")({
  display: "flex",
  marginTop: "20px",
  color: "black",
});

export const AlertTittle = styled("div")(() => ({
  width: "100%",
  height: "30px",
  fontSize: "12px",
  marginTop: "40px",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    padding: "10px 20px",
  },
}));
