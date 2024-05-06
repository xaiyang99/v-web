import { styled, Box, InputLabel, createTheme } from "@mui/material";

const theme = createTheme();

export const ReplyContainer = styled(Box)({
  margin: "1rem 0 1.8rem 0",
});

export const TicketContainer = styled(Box)({
  width: "100%",
  [theme.breakpoints.down("1280")]: {
    padding: "0 20px",
  },
});

export const Label = styled(InputLabel)({
  marginBottom: "5px",
  display: "block",
});

export const TicketBody = styled(Box)({
  padding: "1.5rem 1.2rem",

  h4: {
    fontSize: "0.9rem",
  },
});

export const InputWrapper = styled(Box)({
  margin: "14px 0",

  h2: {
    fontSize: "1.2rem",
  },
});
// export const ButtonCreate = styled(Box)({})
