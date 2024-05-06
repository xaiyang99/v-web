import React, { Fragment } from "react";
import {
  ConvertBytetoMBandGB,
  CutfileName,
  GetFileType,
} from "../../../../functions";
import { FileIcon, defaultStyles } from "react-file-icon";
import { cutFileName } from "../../../../utils/limitTextLenght";
import {
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import { DivDownloadFileBox } from "../css/style";

function CardFileDownload(props) {
  const {
    isPublic,
    dataFiles,
    isSuccess,
    isDownloadAll,
    isHide,
    isProcessing,
    isMobile,
    fileTotal,
    hasFileWithoutPassword,
    hideDownload,
    downloadFiles,
    setIndex,
    setPassword,
    setGetFilenames,
    setGetNewFileName,
    setCheckModal,
    handleQRGeneration,
    downloadFilesAll,
  } = props;

  return (
    <Fragment>
      {dataFiles?.map((dataFile, index) => (
        <DivDownloadFileBox key={index}>
          <Box>
            <Typography variant="h6" sx={{ display: "flex" }}>
              <div
                style={{
                  width: isMobile ? "15px" : "20px",
                  marginTop: "-6px",
                }}
              >
                <FileIcon
                  extension={GetFileType(dataFile.filename)}
                  {...defaultStyles[GetFileType(dataFile.filename)]}
                  size={10}
                />
              </div>
              &nbsp;{" "}
              {cutFileName(
                CutfileName(dataFile?.filename, dataFile?.newFilename),
                10,
              )}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">
              {ConvertBytetoMBandGB(dataFile?.size)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Fragment>
              {isSuccess[index] ? (
                <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
              ) : isHide[index] ? (
                <CircularProgress
                  color="success"
                  sx={{ color: "#17766B" }}
                  size={isMobile ? "18px" : "22px"}
                />
              ) : !dataFile?.filePassword ? (
                <IconButton
                  onClick={() => {
                    downloadFiles(
                      index,
                      dataFile?._id,
                      dataFile?.newFilename,
                      dataFile?.filename,
                      dataFile?.filePassword,
                    );
                    setIndex(index);
                    setPassword("");
                    setGetFilenames(dataFile?.filename);
                    setGetNewFileName(dataFile?.newFilename);
                    setCheckModal(true);
                  }}
                >
                  <DownloadIcon
                    sx={{
                      color: "#17766B",
                      fontSize: isMobile ? "17px" : "22px",
                    }}
                  />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    downloadFiles(
                      index,
                      dataFile?._id,
                      dataFile?.newFilename,
                      dataFile?.filename,
                      dataFile?.filePassword,
                    );
                    setIndex(index);
                    setPassword("");
                    setGetFilenames(dataFile?.filename);
                    setGetNewFileName(dataFile?.newFilename);
                    setCheckModal(true);
                  }}
                >
                  <FileDownloadOffIcon
                    sx={{
                      fontSize: isMobile ? "17px" : "22px",
                    }}
                  />
                </IconButton>
              )}
            </Fragment>

            {isPublic && (
              <Fragment>
                {!dataFile?.filePassword ? (
                  <IconButton>
                    <LockOpenIcon
                      sx={{
                        color: "#17766B",
                        fontSize: isMobile ? "17px" : "22px",
                      }}
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      downloadFiles(
                        index,
                        dataFile?._id,
                        dataFile?.newFilename,
                        dataFile?.filename,
                        dataFile?.filePassword,
                      );
                      setIndex(index);
                      setPassword("");
                      setGetFilenames(dataFile?.filename);
                      setGetNewFileName(dataFile?.newFilename);
                      setCheckModal(true);
                    }}
                  >
                    <LockIcon
                      sx={{
                        fontSize: isMobile ? "16px" : "22px",
                      }}
                    />
                  </IconButton>
                )}
              </Fragment>
            )}

            <Tooltip title="Generate QR code" placement="top">
              <IconButton onClick={(e) => handleQRGeneration(e, dataFile)}>
                <QrCode2Icon
                  sx={{
                    color: "#17766B",
                    fontSize: isMobile ? "16px" : "22px",
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </DivDownloadFileBox>
      ))}

      {hasFileWithoutPassword && fileTotal > 1 ? (
        <Box
          sx={{
            textAlign: "end",
            background: "none",
          }}
        >
          {isDownloadAll ? (
            <Tooltip title="Only download files without password">
              <Button variant="outlined" style={{ width: "140px" }}>
                <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
                Success
              </Button>
            </Tooltip>
          ) : (
            <Fragment>
              {hideDownload ? (
                <Tooltip title="Only download files without password">
                  <Button
                    variant="outlined"
                    style={{ width: "140px" }}
                    onClick={() => downloadFilesAll(dataFiles)}
                  >
                    {isProcessing ? (
                      <CircularProgress
                        color="success"
                        sx={{ color: "#17766B" }}
                        size={isMobile ? "18px" : "22px"}
                      />
                    ) : (
                      <DownloadIcon
                        sx={{
                          color: "#17766B",
                          fontSize: isMobile ? "16px" : "22px",
                        }}
                      />
                    )}
                    &nbsp;Download all
                  </Button>
                </Tooltip>
              ) : null}
            </Fragment>
          )}
        </Box>
      ) : null}
    </Fragment>
  );
}

export default CardFileDownload;
