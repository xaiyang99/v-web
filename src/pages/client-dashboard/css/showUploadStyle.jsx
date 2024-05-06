import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const ShowFileUploadBox = styled(Box)({
  border: "1px solid #E8E8E8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: "100%",
  padding: "0.5rem 1rem",
  borderRadius: "10px",
  margin: "0.5rem 0",
  h3: {
    textAlign: "start",
    width: "100%",
    fontSize: "1.125rem",
    padding: "0.5rem 0",
    color: "#4B465C",
  },
});

export const ShowFileDetailBox = styled(Box)({
  width: "100%",
  display: "flex",
  textAlign: "center",
  justifyContent: "space-between",
});

export const ShowNameAndProgress = styled(Box)({
  textAlign: "start",
  h5: {
    fontSize: "0.9rem",
    color: "#817D8D",
  },
  h6: {
    fontSize: "0.7rem",
    color: "#817D8D",
  },
});

export const ShowActionButtonBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
