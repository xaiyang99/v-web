import * as React from "react";
import ReactAudioPlayer from "react-audio-player";
import { FileIcon, defaultStyles } from "react-file-icon";
import { pdfjs } from "react-pdf";
import ReactPlayer from "react-player";
import musicIcon from "../../../utils/images/music-note-in-a-circle.png";
import * as MUI from "./css/PreviewFile";

// component and functions
import { GetFileType, GetFolderName, truncateName } from "../../../functions";

// material component
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Box,
  IconButton,
  Typography,
  createTheme,
  styled,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const theme = createTheme();

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const DialogContentV1 = styled(DialogContent)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#ffffff",
  paddingBottom: "5rem",

  [theme.breakpoints.down("md")]: {
    paddingBottom: "4rem",
  },
  [theme.breakpoints.down("sm")]: {
    paddingBottom: "2.8rem",
  },
});

export default function PreviewFile(props) {
  const {
    open,
    handleClose,
    filename,
    user,
    newFilename,
    fileType,
    path,
    onClick,
  } = props;

  const type = GetFolderName(fileType);
  const getType = GetFileType(newFilename);
  let real_path;
  if (path === null || path === "") {
    real_path = "";
  } else {
    real_path = truncateName(path);
  }

  const descriptionElementRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open, newFilename]);
  const Url = process.env.REACT_APP_BUNNY_PULL_ZONE;
  return (
    <MUI.DivContainer>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#ffffff",
            padding: "16px 24px 0 24px",
          }}
        >
          <MUI.TextFileName>{filename} </MUI.TextFileName>
          <Typography
            className="title download-link"
            style={{ display: "flex", alignItems: "center" }}
          >
            {props?.permission !== "view" && (
              <IconButton onClick={() => onClick()}>
                <DownloadIcon
                  sx={{
                    cursor: "pointer",
                    color: "#707070",
                    [theme.breakpoints.down("md")]: { fontSize: 18 },
                  }}
                />
              </IconButton>
            )}
            &nbsp;&nbsp;
            <IconButton onClick={handleClose}>
              <ClearIcon
                fontSize="medium"
                sx={{ [theme.breakpoints.down("md")]: { fontSize: 18 } }}
              />
            </IconButton>
          </Typography>
        </Box>

        <DialogContentV1>
          <MUI.DivPreviewBody>
            {type === "image" ? (
              <MUI.ShowImageBox>
                <MUI.ImagePreview
                  className="image-preview"
                  src={
                    Url +
                    user.newName +
                    "-" +
                    user._id +
                    "/" +
                    real_path +
                    newFilename
                  }
                  alt=""
                  style={{ objectFit: "contain" }}
                />
              </MUI.ShowImageBox>
            ) : (type === "application" && getType === "pptx") ||
              getType === "docx" ||
              getType === "xlsx" ? (
              <iframe
                title={filename}
                src={
                  "https://view.officeapps.live.com/op/embed.aspx?" +
                  "src=" +
                  Url +
                  user.newName +
                  "-" +
                  user._id +
                  "/" +
                  real_path +
                  newFilename
                }
                style={{
                  height: "600px",
                  width: "90%",
                  marginLeft: "5%",
                  border: 0,
                }}
              ></iframe>
            ) : type === "audio" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <img src={musicIcon} alt="music icon" />
                <Typography variant="h3" sx={{ margin: "1rem 0" }}>
                  Audio player
                </Typography>
                <ReactAudioPlayer
                  src={
                    Url +
                    user.newName +
                    "-" +
                    user._id +
                    "/" +
                    real_path +
                    newFilename
                  }
                  autoPlay
                  controls
                  preload
                  style={{
                    backgroundColor: "#f2f2f2",
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                    width: "100%",
                    maxWidth: "800px",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                  controlStyle={{
                    width: "40px",
                    height: "40px",
                    margin: "8px",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  playButtonStyle={{
                    width: "40px",
                    height: "40px",
                    margin: "8px",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  volumeButtonStyle={{
                    width: "40px",
                    height: "40px",
                    margin: "8px",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  progressStyle={{
                    width: "100%",
                    height: "4px",
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                  }}
                  progressBarStyle={{
                    width: "0%",
                    height: "4px",
                    backgroundColor: "#ff3e00",
                    borderRadius: "4px",
                  }}
                />
              </div>
            ) : type == "video" ? (
              <ReactPlayer
                width={"100%"}
                url={
                  Url +
                  user.newName +
                  "-" +
                  user._id +
                  "/" +
                  real_path +
                  newFilename
                }
                controls={true}
              />
            ) : type === "application" && getType === "pdf" ? (
              <iframe
                src={
                  Url +
                  user.newName +
                  "-" +
                  user._id +
                  "/" +
                  real_path +
                  newFilename
                }
                style={{ width: "100%", height: "80vh", border: "none" }}
              ></iframe>
            ) : type === "text" && getType === "txt" ? (
              <iframe
                src={
                  Url +
                  user.newName +
                  "-" +
                  user._id +
                  "/" +
                  real_path +
                  newFilename
                }
                width="100%"
                height="500px"
              ></iframe>
            ) : (
              <MUI.DivShowIcon>
                <Box style={{ width: "250px" }}>
                  <FileIcon
                    extension={GetFileType(props.newFilename)}
                    {...defaultStyles[GetFileType(props.newFilename)]}
                  />
                </Box>
              </MUI.DivShowIcon>
            )}
          </MUI.DivPreviewBody>
        </DialogContentV1>
      </Dialog>
    </MUI.DivContainer>
  );
}
