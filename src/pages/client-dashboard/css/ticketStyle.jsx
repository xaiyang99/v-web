import { createTheme, styled, Box } from "@mui/material";
const theme = createTheme();

export const TicketContainerUpload = styled(Box)({
  marginTop: "2rem",
  h4: {
    fontSize: "0.9rem",
    marginBottom: "0.8rem",
  },
});

export const TicketContainerWrapper = styled(Box)({
  width: "100%",
  // backgroundColor: "rgba(244,244,244,.5)",
  border: "3px dashed #E8E8EA",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "#F6F6F6",
    opacity: 1,
  },
});

export const TicketBodyUpload = styled(Box)({
  padding: "1rem 1.2rem",
});

export const TicketHeader = styled(Box)({
  textAlign: "center",
  marginBottom: "1.5rem",
  cursor: "pointer",
  h4: {
    marginTop: "1rem",
    color: "#5D596C",
  },

  span: {
    fontSize: "0.85rem",
    color: "#CFCED4",
  },
});

export const FileList = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
});

export const FileListItem = styled(Box)({
  border: "1px solid #ccc",
  borderRadius: "5px",
  backgroundColor: "#fff",
  padding: "0.25rem 0.3rem",
  display: "flex",

  "& .box-img": {
    borderRadius: "5px",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F3F4",
    marginRight: "12px",

    "& .icon": {
      fontSize: "1.3rem",
      color: "#67798A",
    },
  },

  "& .text-file": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    ".file-wrapper": {
      display: "flex",
      flexDirection: "column",
      p: {
        fontSize: "0.8rem",
        fontWeight: "bold",
        height: "inherit",
      },

      span: {
        fontSize: "0.7rem",
      },
    },
  },

  "& .action-file": {
    marginRight: "10px",

    "& .icon": {
      fontSize: 20,
      color: "#d33",
      cursor: "pointer",
    },
  },
});

export const TicketHeaderStatus = styled(Box)({
  textAlign: "center",
  marginBottom: "1rem",
  h2: {
    fontSize: "1.2rem",
    color: "#4B465C",
  },
});

export const TicketStatusContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginBottom: "1.2rem",
});

export const ActionTicketStatus = styled(Box)({
  textAlign: "left",
  width: "100%",
  cursor: "pointer",
  border: "2px solid #E6E5E8",
  outline: "none",
  padding: "1rem",
  borderRadius: "8px",
  transition: "0.3s all",
  backgroundColor: "#fff",

  h4: {
    fontSize: "1rem",
    color: "#4B465C",
    marginBottom: "0.6rem",

    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
  span: {
    fontSize: "0.8rem",
    color: "#4B465C",
  },

  "&.active, &:hover": {
    border: "2px solid #17766B",

    "h4, span": {
      color: "#17766B",
    },
  },
});

export const BackdropContainer = styled(Box)({
  position: "fixed",
  top: 0,
  left: "10%",
  width: "100%",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(226, 232, 240, 0.75)",
  zIndex: 99,
  // background: "rgba(255, 255, 255, 0.8)",
});

export const BackDropSpinner = styled(Box)({
  // width: "100%",
  // height: "100%",
});
