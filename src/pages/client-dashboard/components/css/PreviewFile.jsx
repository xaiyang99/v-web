import { Box, createTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
export const DivContainer = styled("div")({});
const theme = createTheme();

export const DivPreviewBody = styled("div")({
  width: "100% !important",
  "& .react-pdf__Page__canvas": {
    // border: "1px solid rgb(233, 233, 233)",
    padding: "0px !important",
    marginTop: "10px",
    width: "100% !important",
  },

  "& .react-pdf__Page__annotations": {
    height: "0 !important",
  },

  "& .react-pdf__Page__textContent": {
    fontFamily: "sans-serif",
    fontSize: "10px",
    lineHeight: "1.2",
    color: "#000000",
    display: "none",
  },
});

export const ShowImageBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const ImagePreview = styled("img")({
  borderRadius: "6px",
  width: "100%",
  height: "auto",
  objectFit: "scale-down",
});

export const DivShowIcon = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem 0",
  borderRadius: "10px",
});

export const TextFileName = styled("h2")({
  margin: 0,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontSize: "1.4rem",

  [theme.breakpoints.down("md")]: {
    fontSize: "1.2rem",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "0.90rem",
  },
});
