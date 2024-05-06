import { Box, Button, createTheme, styled } from "@mui/material";
const theme = createTheme();

export const ReplyContainer = styled(Box)({
  width: "100%",
  marginTop: "1.2rem",
});

export const ReplayDate = styled(Box)({
  margin: "1.5rem 0",
});

export const SectionTimeDate = styled(Box)({
  textAlign: "center",
  margin: "1rem 0",

  h2: {
    fontSize: "1.2rem",
    fontWeight: "600",
  },
});

export const ReplyTimeBody = styled(Box)({
  padding: "2rem 1rem",
});

export const ReplyHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "0.8rem",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "start",
  },
});

export const ReplyHeaderLeft = styled(Box)({
  display: "flex",
  alignItems: "center",
  img: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    marginRight: "15px",
    objectFit: "cover",
    [theme.breakpoints.down("sm")]: {
      width: "30px",
      height: "30px",
    },
  },

  h2: {
    fontSize: "1.3rem",
    color: "#5D596C",
    [theme.breakpoints.down("md")]: {
      fontSize: "1.1rem",
    },
  },
});

export const ReplyHeaderRight = styled(Box)({
  [theme.breakpoints.down("sm")]: {
    marginTop: "10px",
  },

  h2: {
    fontSize: "1.2rem",
    color: "#A5A3AE",

    [theme.breakpoints.down("md")]: {
      fontSize: "0.8rem",
    },
  },
});

export const ReplyContent = styled(Box)({
  padding: "1rem 0",

  span: {
    fontSize: "1rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
});

export const ReplyContentAdmin = styled(Box)({
  margin: "0 14px",
});

export const ReplyAvatarContainer = styled(Box)({
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  padding: "8px",
  backgroundColor: "#17766B",
  marginRight: "1rem",
});

export const ReplyAvatar = styled(Box)({
  backgroundColor: "#7DB2AC",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  borderRadius: "50%",

  span: {
    fontSize: "1.1rem",
    color: "#fff",
    fontWeight: "bold",
  },
});

export const ReplyActionContainer = styled(Box)({
  marginTop: "0.6rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.6rem",
  marginLeft: "0.8rem",

  span: {
    marginLeft: "10px",
  },
});

export const ReplyAction = styled(Box)({});

export const ReplyButtonDownLoad = styled(Button)({
  outline: "none",
  border: "1px solid #A5A3AE",
  borderRadius: "8px",
  color: "#000",
  padding: "6px 15px",
  height: "45px",
  fontSize: "15px",
  backgroundColor: "#FFF",
  "& .downIcon": {
    width: "18px",
    height: "18px",
  },

  "&:hover": {
    backgroundColor: "#F1F0F2",
  },
});

export const ReplyCloseContainer = styled(Box)({
  margin: "0.8rem 0",
  padding: "2rem 1.2rem",

  h2: {
    fontSize: "2rem",
    marginBottom: "0.8rem",
    color: "#4B465C",

    [theme.breakpoints.down("md")]: {
      fontSize: "1.7rem",
      marginBottom: "0.5rem",
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem",
    },
  },

  span: {
    fontSize: "1rem",
    fontWeight: "400",
    color: "#4B465C",
  },

  [theme.breakpoints.down("md")]: {
    span: {
      fontSize: "0.8rem",
    },
  },
});

export const ReplyCloseToggleContent = styled(Box)({
  marginBottom: "1.8rem",

  h3: {
    fontSize: "2rem",
    marginBottom: "1.2rem",

    [theme.breakpoints.down("md")]: {
      fontSize: "1.6rem",
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: "1.4rem",
    },
  },

  h5: {
    fontSize: "1rem",

    [theme.breakpoints.down("md")]: {
      fontSize: "0.92rem",
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
});

export const ReplyCloseToggleAction = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",

  [theme.breakpoints.down("sm")]: {
    gap: "0.5rem",
  },
});
