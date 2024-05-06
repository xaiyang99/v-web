import { Box, CircularProgress, Typography, createTheme, styled } from "@mui/material";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { isChatYesterday } from "../../../functions";
const theme = createTheme();

// &&&&________&&&&________
// ========= Chat CSS ==========

export const BoxHeaderDate = ({ date }) => {
  let dateValue = "";
  const passValue = new Date(date);
  const currentDate = new Date();

  let yesterday = isChatYesterday(date);
  if (moment(passValue).format("dd/MM/yyyy") === moment(currentDate).format("dd/MM/yyyy")) {
    dateValue = "Today";
  } else if (yesterday) {
    dateValue = "Yesterday";
  } else {
    dateValue = date;
  }

  return (
    <ChatHeaderDateContainer>
      <ChatHeaderDate>
        <Typography component="span">{dateValue}</Typography>
      </ChatHeaderDate>
    </ChatHeaderDateContainer>
  );
};

export const ChatContainer = styled(Box)({
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  borderRadius: "5px",
  marginTop: "1.2rem",
  backgroundColor: "transparent",
  display: "flex",
  flexDirection: "column",
});

export const ChatHeader = styled(Box)({
  position: "relative",
});

export const ChatHeaderWrapper = styled(Box)({
  backgroundColor: "#fff",
  padding: ".8rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const ChatHeaderLeft = styled(Box)({
  display: "flex",
  alignItems: "center",

  img: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  ".admin-logo": {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "5px solid #17766B",
    backgroundColor: "#7DB2AC",

    [theme.breakpoints.down("sm")]: {
      width: "36px",
      height: "36px",
      display: "none",
    },

    h4: {
      fontSize: "1.2rem",
      color: "#fff",

      [theme.breakpoints.down("sm")]: {
        fontSize: "0.9rem",
      },
    },
  },

  ".admin-info, .header-info": {
    marginLeft: "10px",
    span: {
      fontSize: "0.8rem",
      color: "#4B465C",
    },
  },

  ".admin-info": {
    h2: {
      fontSize: "1rem",
      color: "#4B465C",

      [theme.breakpoints.down("sm")]: {
        fontSize: "0.8rem",
      },
    },
    span: {
      fontSize: "0.9rem",
      [theme.breakpoints.down("sm")]: {
        fontSize: "0.7rem",
      },
    },
  },

  ".header-info": {
    h2: {
      fontSize: "1.1rem",
      color: "#4B465C",
    },
  },
});

export const ChatHeaderRight = styled(Box)({});

export const ChatBodyContainer = styled(Box)({});

export const ChatContentContainer = styled(Box)({
  padding: "0.3rem 1rem 0.8rem 1rem",
});

export const ChatContent = styled(Box)({
  width: "100%",
  height: "60vh",
  overflowY: "scroll",
});

export const ChatFooterContainer = styled(Box)({
  position: "relative",
  margin: "1.5rem 0 1rem 0",
  // paddingTop: "2.2rem",
});

export const ChatMessageReply = styled(Box)({
  width: "100%",
  marginTop: "0.5rem",
  transition: "all 0.3",
  flex: "none",
  order: 2,
  // position: "absolute",
  // bottom: "0",
});

export const ChatMessageReplyForm = styled(Box)({
  // position: "sticky",
  // bottom: 0,
  // left: 0,
  backgroundColor: "inherit",
  zIndex: 99,
  flex: "none",
  order: 3,
});

export const ChatReplyLabel = styled("label")({
  display: "block",
  marginBottom: "0.8rem",
  fontSize: "1rem",
  color: "#5D596C",
  fontWeight: "600",
});

export const ChatReplyInput = styled(Box)({
  display: "flex",
  alignItems: "center",
  width: "inherit",
});

export const ChatAction = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  // marginBottom: "2rem",
});

export const ChatSubmitReply = styled(Box)({
  marginTop: "1.2rem",
  display: "flex",
  justifyContent: "flex-end",
});

// ======== Chat Panel ========
// Not usage
export const ChatPanelContainer = styled(Box)({});

// Show header on Date chat
export const ChatHeaderDateContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  margin: "10px 3px",
});

export const ChatHeaderDate = styled(Box)({
  padding: "3px 10px",
  textAlign: "center",

  span: {
    fontWeight: "500",
    fontSize: "0.69rem",
    color: "#5D596C",

    [theme.breakpoints.down("sm")]: {
      fontSize: "0.55rem",
    },
  },
});

export const ChatPanelLoading = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "1.5rem",
});

export const ChatPanelInfinityContainer = styled(Box)({
  width: "100%",
  height: "50vh",
  overflow: "hidden",
  overflowY: "scroll",
  padding: "0.5rem 0.8rem 0.8rem 0",
  display: "flex",
  flexDirection: "column-reverse",

  ".chat-panel-slide": {
    scrollBehavior: "smooth",
  },

  "&::-webkit-scrollbar": {
    width: "6px",
    borderRadius: "5px",
  },

  "&::-webkit-scrollbar-track": {
    backgroundColor: "#F7F9FC",
    borderRadius: "6px",
  },

  "&::-webkit-scrollbar-thumb": {
    borderRadius: "6px",
    backgroundColor: "#17766B",
    transition: "0.3s all",
  },
});

export const ChatPanelInfinity = styled(InfiniteScroll)({
  display: "flex",
  flexDirection: "column-reverse",
  width: "100%",
  overflow: "hidden",
});

export const ChatListContainer = styled(Box)({
  margin: "0.15rem 0",
  display: "flex",
  // gap: "0.6rem",
  img: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  "&.chat-user": {
    display: "flex",
    justifyContent: "flex-start",
    small: {
      color: "#4B465C",
    },
  },
  "&.chat-owner": {
    display: "flex",
    justifyContent: "flex-end",
    small: {
      color: "#fff",
    },
  },
});

export const ChatBoxListContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

export const ChatBoxContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  position: "relative",
});

export const ChatBoxCardContainer = styled(Box)({
  position: "relative",
  "&.box-card-user": {
    display: "flex",
    alignItems: "center",
  },

  ".owner": {
    float: "right",
  },
});

export const ChatBoxCard = styled(Box)({
  padding: "0.3rem 0.62rem 0.2rem 0.62rem",
  borderRadius: "6px",
  boxShadow: "rgba(149, 157, 165, 0.1) 0px 8px 24px",
  display: "flex",
  flexDirection: "column",

  [theme.breakpoints.down("690")]: {
    padding: "0.17rem 0.48rem",
  },

  "& .reply-box": {
    backgroundColor: "#105B4E",
    padding: "0.3rem 0.5rem",
    borderRadius: "6px",
    marginBottom: "0.3rem",
    marginTop: "0.3rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",

    "&.user": {
      backgroundColor: "#E7E6E9",
      p: {
        color: "#105B4E",
      },

      div: {
        span: {
          color: "#5D596C",
        },
      },
    },

    p: {
      textAlign: "left",
      height: "inherit",
      color: "#fff",
      fontSize: "12px",
      fontWeight: "bold",
    },

    div: {
      textAlign: "left",
      lineHeight: "1.1",

      span: {
        color: "#ccc",
        fontSize: "10px",
      },
    },
  },

  "&.user, &.owner": {
    maxWidth: "560px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "wrap",

    span: {
      fontSize: "0.7rem",
      lineHeight: "1.35",
      whiteSpace: "pre-line",
      [theme.breakpoints.down("690")]: {
        fontSize: "0.6rem",
      },
    },
  },

  "&.user": {
    color: "#67798A",
    backgroundColor: "#fff",
    borderTopLeftRadius: "0",
  },
  "&.owner": {
    color: "#fff",
    backgroundColor: "#17766B",
    borderTopRightRadius: "0",
  },

  ".timeDate": {
    marginTop: "-4px",
    small: {
      fontSize: "0.5rem",
      fontWeight: "500",
      color: "#4B465C",

      [theme.breakpoints.down("690")]: {
        fontSize: "0.42rem",
      },
    },
  },

  ".timeDate.user": {
    textAlign: "left",
    color: "#4B465C",
  },

  ".timeDate.owner": {
    textAlign: "right",

    small: {
      color: "#FFF",
    },
  },
});

export const ChatBoxFileListContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  // maxWidth: "500px",

  // "&.user": {
  //   padding: "0.6rem 0.9rem",
  // },
});

export const ChatBoxFileItem = styled(Box)({
  padding: "0.5rem 0.8rem",
  borderRadius: "6px",
  border: "2px solid #17766B",
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  position: "relative",
  backgroundColor: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",

  "& .icon-file": {
    display: "flex",
    alignItems: "center",
  },

  "&.user, &.owner": {
    span: {
      fontSize: "0.68rem",
      maxWidth: "250px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "wrap",
    },
  },

  "&.user": {
    color: "#67798A",
    backgroundColor: "#fff",
  },
  "&.owner": {
    color: "#fff",
    backgroundColor: "#17766B",
  },

  ".icon-download-user": {
    color: "#4B465C",
  },
  ".icon-download-owner": {
    color: "#fff",
  },
});

export const ChatFileDowloading = styled(CircularProgress)({});

export const ChatReplyBoxMessage = styled(Box)({
  width: "100%",
  border: "1px solid #105B4E",
  borderTopLeftRadius: "7px",
  borderTopRightRadius: "7px",
  backgroundColor: "#E2EAEC",
  padding: "1rem 1.2rem",
  transition: "all 0.3s ease",

  h2: {
    fontSize: "0.85rem",
    color: "#4B465C",
    paddingBottom: "0.5rem",
  },
  h4: {
    fontSize: "0.85rem",
    color: "#4B465C",
    fontWeight: "300",
    lineHeight: "1.45",
    whiteSpace: "pre-line",
  },
});

export const ChatReplyBoxMessageContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const ChatReplyBoxMessageClose = styled(Box)({
  display: "flex",
  alignItems: "flex-end",
});

export const ChatTicketClose = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  h2: {
    fontSize: "0.8rem",
    color: "#4B465C",
    fontWeight: "500",
  },
});

// export const ChatBoxCardWin = styled(Box)({});

// &&&&________&&&&________
// ========= Drawer CSS ==========
export const DrawerClose = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  padding: "1rem 1.2rem",
});

export const DrawerBodyContainer = styled(Box)({
  marginTop: "0.3rem",
  padding: "0 1rem 1rem 1rem",
});

export const DrawerBodyHeader = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  img: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "50%",
  },

  div: {
    marginTop: "1rem",
    textAlign: "center",

    h2: {
      fontSize: "1rem",
      marginBottom: "0.3rem",
    },
    span: {
      fontSize: "0.75rem",
    },
    "h2, span": {
      color: "#4B465C",
    },
  },
});

export const DrawerInfoContainer = styled(Box)({
  marginTop: "1rem",
});

export const TextLabel = styled("label")({
  fontSize: "0.8rem",
  display: "block",
  marginBottom: "0.5rem",
  color: "#A8AAAE",
  textTransform: "uppercase",
  fontWeight: "600",
});

export const DrawerInfoAbout = styled(Box)({
  marginBottom: "1.2rem",

  span: {
    fontSize: "0.8rem",
    color: "#4B465C",
  },
});

export const DrawerContactContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "0.7rem",
});

export const DrawerContactList = styled(Box)({
  display: "flex",
  alignItems: "center",

  "& .icon-contact": {
    fontSize: "1rem",
    marginRight: "0.8rem",
    color: "#5D596C",
  },

  h4: {
    fontSize: "0.8rem",
    color: "#5D596C",
    fontWeight: "500",
  },
});

export const DrawerInfoPersonal = styled(Box)({});

// DialogUpload Chat File
export const ChatShowUploadFileHeader = styled(Box)({
  textAlign: "center",

  span: {
    fontSize: "1rem",

    [theme.breakpoints.down("md")]: {
      fontSize: "0.9rem",
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: "0.75rem",
    },
  },
});

export const ChatProgressBar = styled(Box)({
  marginTop: "1rem",
  width: "100%",
});

export const ChatShowUploadFileContainer = styled(Box)({
  marginTop: "1rem",
});

export const ShowUploadChatFile = styled(Box)({
  paddingTop: "1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "30vh",
});

export const ChatPreviewUploadFile = styled(Box)({
  width: "80px",
  height: "80px",
  objectFit: "cover",

  [theme.breakpoints.down("md")]: {
    width: "68px",
    height: "68px",
  },

  [theme.breakpoints.down("sm")]: {
    width: "55px",
    height: "55px",
  },
});

export const ChatPreviewFileData = styled(Box)({
  marginTop: "1.9rem",

  span: {
    fontSize: "12px",

    [theme.breakpoints.down("md")]: {
      fontSize: "9px",
    },
  },
});

export const ShowUploadChatForm = styled(Box)({});

export const ShowPreviewUploadAllFiles = styled(Box)({
  overflowX: "scroll",
});

export const BoxPreviewFileContainer = styled(Box)({
  marginTop: "1rem",
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
});

export const BoxPreviewFileV1 = styled(Box)({
  width: "100%",
  border: "1px solid #f3f5f6",
  borderRadius: "5px",
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
});

export const BoxPreviewFileInnerV1Container = styled(Box)({
  padding: "10px 14px",
});

export const BoxPreviewFileInnerV1 = styled(Box)({
  display: "flex",
  alignItems: "center",
});

export const BoxProgressText = styled(Box)({
  marginLeft: "1rem",
  flexGrow: 1,

  span: {
    fontSize: "0.65rem",
    display: "block",
    marginBottom: "0.28rem",
  },
});

export const BoxProgressItem = styled(Box)({
  backgroundColor: "#e9ecef",
  height: "7px",
  borderRadius: "6px",
  flexGrow: 1,

  p: {
    marginTop: "0.2rem",
    marginBottom: "0.5rem",
    height: 0,
    fontSize: "0.57rem",
    color: "#17766B",
    fontWeight: "600",
  },
});

export const BoxProgressItemLine = styled(Box)({
  borderRadius: "inherit",
  height: "inherit",
  backgroundColor: "#17766B",
  flexGrow: 1,
});

export const BoxPreviewFile = styled(Box)({
  width: "50px",
  height: "50px",
  borderRadius: "6px",
  backgroundColor: "#F7F9FC",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  border: "2px solid #f3f5f6",
  position: "relative",
  transition: "all 0.3s ease",

  "&.active": {
    borderColor: "#17766B",
  },
});

export const BoxAddFile = styled(Box)({
  width: "50px",
  height: "50px",
  borderRadius: "6px",
  backgroundColor: "#f3f5f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#e6e6e6",
  },

  ".icon-add": {
    fontSize: "1.3rem",
  },
});

export const BoxDelFile = styled(Box)({
  position: "absolute",
  top: "-8px",
  right: "-6px",
  cursor: "pointer",
  // display: "none",
  transition: "all 0.2s",
  width: "17px",
  height: "17px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: "#F1BBBB",
  zIndex: 99,
});
