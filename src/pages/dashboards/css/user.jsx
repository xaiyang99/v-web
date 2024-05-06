import { styled } from "@mui/material";

export const divShowPickImage = styled("div")({
  border: "1px dotted gray",
  borderRadius: "5px",
  padding: "20px 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
});

export const divPreviewImage = styled("div")({
  width: "150px",
  height: "150px",
  img: {
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    objectFit: "contain",
    width: "100%",
    height: "100%",
  },
});

export const divShowPickerIcon = styled("div")({
  padding: "20px",
  textAlign: "center",
});
