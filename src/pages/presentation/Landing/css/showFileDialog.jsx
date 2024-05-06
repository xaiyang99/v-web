import { Box, Button, TextField } from "@mui/material";
import { styled, createTheme } from "@mui/material/styles";
const theme = createTheme();

// upload modal
export const BoxUploadTitle = styled(Box)({
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  padding: "0.8rem",
  span: {
    fontSize: "1rem",
    fontWeight: 600,
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.9rem",
    },
  },
});

export const BoxLimitTimeAndLock = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: {},
});

export const BoxLimitTime = styled(Box)({
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  flexDirection: "column",
  width: "50%",
  span: {
    fontSize: "0.8rem",
    margin: "0 0 0.2rem 0",
    fontWeight: 600,
    color: "#17766B",
    [theme.breakpoints.down("sm")]: {
      margin: "0 0 0.2rem 0",
    },
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
});

export const BoxDownloadLinkPassword = styled(Box)({
  display: "flex",
  alignItems: "start",
  justifyContent: "center",
  flexDirection: "column",
  marginBottom: "0.2rem",
  span: {
    fontSize: "0.8rem",
    margin: "0 0 0.2rem 0",
    fontWeight: 600,
    color: "#17766B",
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    [theme.breakpoints.down("sm")]: {
      margin: "0 0 0.4rem 0",
    },
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
});

export const BoxTextFieldAndLockIcon = styled(Box)({
  display: "flex",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    marginRight: "0px",
    width: "100%",
  },
});

export const textFieldViewLink = styled(TextField)({
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
});

export const BoxNumberOfSelectedFile = styled(Box)({
  width: "100%",
  textAlign: "start",
  margin: "0.5rem 0",
  [theme.breakpoints.down("sm")]: {
    textAlign: "start",
  },
  strong: {
    fontSize: "0.8rem",
  },
});

export const BoxShowFiles = styled(Box)({
  display: "flex",
  textAlign: "center",
  justifyContent: "space-between",
  marginTop: "1rem",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    marginTop: "0.2rem",
  },
});

export const BoxShowFileDetail = styled(Box)({
  display: "flex",
  textAlign: "center",
  justifyContent: "start",
});

export const BoxShowFileIcon = styled(Box)({
  width: "25px",
  [theme.breakpoints.down("sm")]: {
    width: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "0.5rem",
  },
});

export const BoxShowFileName = styled(Box)({
  marginLeft: "0.5rem",
  display: "flex",
  alignItems: "start",
  justifyContent: "start",
  // flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    marginLeft: "0",
    alignItems: "center",
    justifyContent: "start",
    flexDirection: "row",
  },
});

export const BoxShowLockFile = styled(Box)({
  display: "flex",
  textAlign: "center",
  justifyContent: "flex-start",
  marginLeft: "8rem",
  [theme.breakpoints.down("sm")]: {
    marginTop: "0.5rem",
    marginLeft: "0",
  },
});

export const textFieldLockSingleFile = styled(TextField)({
  [theme.breakpoints.down("sm")]: {
    marginLeft: "0",
    width: "100%",
  },
});

export const BoxUploadAndReset = styled(Box)({
  textAlign: "end",
  margin: "0.5rem 0",
  [theme.breakpoints.down("sm")]: {
    textAlign: "center",
  },
});

// uploading progress modal
export const BoxProgressHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.5rem 1rem",
  h3: {
    fontSize: "1.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "0 0 0 5px",
    h3: {
      fontSize: "18px",
    },
  },
});

export const BoxUploadProgress = styled(Box)({
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    h5: {
      display: "none",
    },
  },
});

export const BoxUploadProgressDetail = styled(Box)({
  display: "flex",
  alignItems: "start",
  justifyContent: "center",
  flexDirection: "column",
  padding: "0 1rem",
  h5: {
    fontSize: "1.125rem",
    marginTop: "0.5rem",
  },
  h6: {
    fontSize: "1rem",
    marginTop: "0.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    alignItems: "center",
  },
});

export const BoxUploadFiles = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 1rem 1rem 1rem",
});

export const BoxUploadFileDetail = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "0.5rem",
});

export const BoxFilesName = styled(Box)({
  display: "flex",
  alignItems: "start",
  justifyContent: "center",
  flexDirection: "column",
  h5: {
    fontSize: "14px",
  },
  h6: {
    fontSize: "10px",
  },
});

// upload done modal
export const BoxUploadDoneTitle = styled(Box)({
  h5: {
    fontSize: "1rem",
    padding: "0.8rem 2rem",
    backgroundColor: "#F4F4F4",
    borderRadius: "5px",
    display: "flex",
    alignItems: "start",
    justifyContent: "start",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: "0.8rem 0.3rem",
      fontSize: "14px",
    },
  },
});

export const BoxUploadDoneBody = styled(Box)({
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  padding: "0 1rem 1rem 1rem",
  marginTop: "2rem",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    marginTop: "0",
  },
});

export const BoxUploadDoneContent = styled(Box)({
  width: "70%",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
});

export const BoxShowAndCopyPassword = styled(Box)({
  width: "100%",
  margin: "2rem 0 0.5rem 0",
  background: "#F4F4F4",
  padding: "1rem",
  borderRadius: "10px",
  h5: {
    fontSize: "14px",
    margin: "0.2rem",
  },
  h6: {
    fontSize: "14px",
    margin: "0.2rem",
    textIndent: "0.2rem",
  },
  [theme.breakpoints.down("sm")]: {
    margin: "1rem 0 0.5rem 0",
  },
});

export const buttonCopyPasswordDetail = styled(Button)({
  margin: "1rem 0",
});

export const BoxCopyDownloadLink = styled(Box)({
  h5: {
    fontSize: "14px",
  },
});

export const BoxShowDownloadLink = styled(Box)({
  width: "90%",
  display: "flex",
  alignItems: "center",
  padding: "0.5rem 1rem",
  background: "#E9E9E9",
  borderRadius: "5px",
  marginTop: "0.5rem",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
});

export const BoxShareToSocialMedia = styled(Box)({
  marginTop: "2rem",
  display: "flex",
  flexDirection: "column",
  h5: {
    fontSize: "14px",
  },
});

export const BoxShowSocialMedia = styled(Box)({
  marginTop: "1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    justifyContent: "space-around",
    h6: {
      display: "none",
    },
  },
});

export const BoxShowIcon = styled(Box)({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  "&:hover": { color: "#18776C" },
  h6: {
    fontSize: "12px",
  },
});

export const BoxUploadDoneQR = styled(Box)({
  width: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    paddingTop: "1.5rem",
  },
});

export const BoxUploadDoneFooter = styled(Box)({
  margin: "3rem 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    margin: "0.5rem 0 1rem 0",
  },
});

export const buttonViewFile = styled(Button)({
  display: "flex",
  background: "#d32f2f",
  color: "#ffffff",
  fontSize: "14px",
  padding: "2px 30px",
  borderRadius: "20px",
  border: "1px solid #d32f2f",
  "&:hover": { border: "1px solid #d32f2f", color: "#d32f2f" },
  margin: "1rem 0",
  [theme.breakpoints.down("sm")]: {
    padding: "2px 20px",
  },
});

export const buttonRestartUpload = styled(Button)({
  background: "#ffffff",
  color: "#17766B",
  fontSize: "14px",
  padding: "2px 30px",
  borderRadius: "20px",
  border: "1px solid #17766B",
  "&:hover": {
    border: "1px solid #17766B",
    color: "#17766B",
  },
  margin: "1rem 0",
  [theme.breakpoints.down("sm")]: {
    padding: "2px 20px",
  },
});
