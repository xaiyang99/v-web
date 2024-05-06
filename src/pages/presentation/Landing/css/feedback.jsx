import { styled, createTheme } from "@mui/material/styles";
import { Container } from "@mui/system";
const theme = createTheme();

export const FeedbackContainer = styled(Container)({
  [theme.breakpoints.down("sm")]: {
    padding: "0",
  },
  "& .tox-statusbar": {
    display: "none",
    "& .tox-statusbar__text-container": {
      display: "none",
    },
  },
  "& ::-webkit-input-placeholder": {
    fontSize: "12px",
  },
});

export const NotificationDiv = styled("div")({
  padding: "1rem",
  margin: "1rem 0",
  borderRadius: "10px",
  background: "#DAE9E7",
  display: "flex",
  alignItems: "start",
  justifyContent: "center",
  flexDirection: "column",
  color: "#5D596C",
  fontSize: "1.125rem",
  fontWeight: 500,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem",
    fontWeight: 400,
  },
});

export const AgreeDiv = styled("div")({});

export const ActionDiv = styled("div")({
  padding: "1rem 0",
});
