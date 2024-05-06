import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { Fragment } from "react";
import { ConvertBytetoMBandGB } from "../../../../functions";
import * as Icon from "../home/icons";

function FolderDownload(props) {
  const {
    folderDownload,
    isSuccess,
    isHide,
    isMobile,
    setPassword,
    setGetFolderName,
    setFilePasswords,
    handleDownloadFolder,
    folderSize,
  } = props;
  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          minWidth: "150px",
          height: "30px",
        }}
      >
        <Icon.MyfolderFull />
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          &nbsp;
          {folderDownload[0]?.folder_name}&nbsp;
          {/* {JSON.stringify(folderDownload[0])}&nbsp; */}
          {ConvertBytetoMBandGB(folderSize)}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isSuccess ? (
          <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
        ) : isHide ? (
          <CircularProgress
            color="success"
            sx={{ color: "#17766B" }}
            size={isMobile ? "18px" : "22px"}
          />
        ) : (
          <IconButton
            onClick={() => {
              let folder_name = `${folderDownload[0]?.folder_name}`;
              setPassword("");
              setGetFolderName(folder_name);
              setFilePasswords(folderDownload[0]?.access_password);
              handleDownloadFolder();
            }}
          >
            {!folderDownload[0]?.access_password ? (
              <DownloadIcon sx={{ color: "#17766B" }} />
            ) : (
              <FileDownloadOffIcon
                sx={{
                  fontSize: isMobile ? "17px" : "22px",
                }}
              />
            )}
          </IconButton>
        )}
      </Box>
    </Fragment>
  );
}

export default FolderDownload;
