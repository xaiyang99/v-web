import axios from "axios";
import { customAlphabet } from "nanoid";
import PropTypes from "prop-types";
import * as React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { v4 as uuidv4 } from "uuid";
import * as MUI from "../css/showFileDialog";

// material ui components
import { Delete, Upload } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
// react animate component

import { useMutation } from "@apollo/client";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { FileIcon, defaultStyles } from "react-file-icon";
import { UAParser } from "ua-parser-js";
import { errorMessage, successMessage } from "../../../../components/Alerts";
import {
  ConvertBytetoMBandGB,
  GetFileType,
  getFileNameExtension,
} from "../../../../functions";
import { cutFileName } from "../../../../utils/limitTextLenght";
import { CREATE_FILE_PUBLIC_DROP } from "./apollo";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs(props) {
  const {
    open,
    files,
    onDeleteData,
    selectMore,
    onRemoveAll,
    dataFile,
    openModal,
    checkSend,
    userId,
    newName,
    folderId,
    path,
    newPath,
    // folderNewname,
  } = props;
  const theme = useTheme();
  const UA = new UAParser();
  const result = UA.getResult();
  const [createFilePublic] = useMutation(CREATE_FILE_PUBLIC_DROP);
  const [file, setFile] = React.useState(files);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDone, setIsDone] = React.useState(-1);
  const [numUploadedFiles, setNumUploadedFiles] = React.useState(0);
  const [uploadSpeed, setUploadSpeed] = React.useState(0);
  const [overallProgress, setOverallProgress] = React.useState(0);
  const [country, setCountry] = React.useState(null);
  const [currentURL, setCurrentURL] = React.useState(null);

  const isRunningRef = React.useRef(true);
  let link = null;
  window.location.protocol === "http:"
    ? (link = process.env.REACT_APP_DOWNLOAD_URL_SERVER)
    : (link = process.env.REACT_APP_DOWNLOAD_URL_SERVER);

  const BUNNY_URL = process.env.REACT_APP_BUNNY_URL;
  const ACCESS_KEY = process.env.REACT_APP_ACCESSKEY_BUNNY;
  const [value, setValue] = React.useState(link);

  React.useEffect(() => {
    if (openModal === false || openModal === true) {
      setIsUploading(false);
    }
  }, [openModal]);

  React.useEffect(() => {
    setFile(files);
  }, [files]);

  React.useEffect(() => {
    const fetchIPAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        const { ip } = response?.data;
        if (ip) {
          const res = await axios.get(`http://ip-api.com/json/${ip}`);
          setCountry(res?.data?.countryCode);
        }
      } catch (error) {
        // console.error("Error fetching IP address:", error);
      }
    };
    fetchIPAddress();
  }, []);

  React.useEffect(() => {
    setCurrentURL(window.location.href);
  }, [window.location.href]);

  const _functionResetValue = async () => {
    setIsDone(1);
    setFile([]);
    checkSend([]);
  };

  const filesArray = file?.map((obj) => {
    return {
      id: obj.file.id,
      path: obj.file.path,
      lastModified: obj.file.lastModified,
      name: obj.file.name,
      size: obj.file.sizeFile,
      type: obj.file.type,
      webkitRelativePath: obj.file.webkitRelativePath,
      password: "",
      URLpassword: "",
    };
  });

  const dataSizeAll = filesArray.reduce((total, obj) => {
    return total + obj.size;
  }, 0);

  const handleGetBackId = (id) => {
    onDeleteData(id);
  };

  const handleCloseModal = () => {
    onRemoveAll();
    _functionResetValue();
    handleCloseAndDeleteFile();
  };

  const handlePrepareToUpload = () => {
    const mergedArray = filesArray.map((item) => {
      item.password = "";
      item.URLpassword = "";
      return item;
    });
    setIsUploading(true);
    handleUpload(mergedArray);
  };

  const handleUpload = async (files) => {
    let numbercout = 0;
    let totalSize = dataFile.reduce((acc, file) => acc + file.size, 0);
    let uploadedSize = 0;
    let getUrlAllWhenReturn = [];
    let publicUser = `${BUNNY_URL}/public`;
    let privateUser = `${BUNNY_URL}${newName}-${userId}/${newPath}`;
    try {
      const responseIp = await axios.get("https://load.vshare.net/getIP");
      const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      const nanoid = customAlphabet(alphabet, 6);
      const generateID = nanoid();
      const urlAllFile = generateID;
      let i = 0;
      for (const file of files) {
        if (!isRunningRef.current) {
          break;
        }
        const randomName = uuidv4();
        const { data: _createFilePublic } = await createFilePublic({
          variables: {
            data: {
              fileExpired: [
                {
                  typeDate: "days",
                  amount: 1,
                },
              ],
              fileType: file?.type,
              filename: String(
                `${file?.name}${randomName + getFileNameExtension(file?.name)}`,
              ),
              ip: String(responseIp?.data),
              newFilename: randomName + getFileNameExtension(file?.name),
              size: String(file?.size),
              urlAll: String(urlAllFile),
              dropUrl: currentURL,
              path:
                folderId > 0
                  ? String(`${path}/${file?.name}${randomName}`)
                  : "",
              newPath: folderId > 0 ? String(`${newPath}/${randomName}`) : "",
              country: country,
              device: result.os.name + result.os.version,
              ...(folderId > 0 ? { folder_id: folderId } : {}),
            },
          },
        });
        getUrlAllWhenReturn = _createFilePublic.createFilesPublic;
        if (_createFilePublic) {
          let initialUploadSpeedCalculated = false;
          const startTime = new Date().getTime();
          const options = {
            method: "PUT",
            url:
              userId > 0 && folderId > 0
                ? `${privateUser}/${
                    randomName + getFileNameExtension(file?.name)
                  }`
                : `${publicUser}/${
                    randomName + getFileNameExtension(file?.name)
                  }`,
            headers: {
              AccessKey: ACCESS_KEY,
              "content-type": "application/octet-stream",
            },
            data: dataFile[i],
            onUploadProgress: (progressEvent) => {
              const currentFileUploadedSize =
                (progressEvent.loaded * dataFile[i].size) / progressEvent.total;
              const currentUploadPercentage = (
                ((uploadedSize + currentFileUploadedSize) / totalSize) *
                100
              ).toFixed(0);
              setOverallProgress(currentUploadPercentage);
              const currentTime = new Date().getTime();
              const elapsedTime = (currentTime - startTime) / 1000;
              if (!initialUploadSpeedCalculated && elapsedTime > 0) {
                const initialUploadSpeed = (
                  progressEvent.loaded /
                  1024 /
                  elapsedTime
                ).toFixed(2);
                setUploadSpeed(initialUploadSpeed);
                initialUploadSpeedCalculated = true;
              }
              if (elapsedTime > 1) {
                const uploadSpeed = (
                  progressEvent.loaded /
                  1024 /
                  elapsedTime
                ).toFixed(2);
                setUploadSpeed(uploadSpeed);
              }
            },
          };
          await axios
            .request(options)
            .then(function () {
              setNumUploadedFiles(++numbercout);
              uploadedSize += dataFile[i].size;
            })
            .catch(function (error) {
              errorMessage(error, 2000);
            });
          i++;
        } else {
          isRunningRef.current = false;
          break;
        }
      }
      setIsDone(1);
      setValue(`${value}${getUrlAllWhenReturn?.urlAll}`);
      successMessage("Upload Successful!!", 3000);
      onRemoveAll();
    } catch (error) {
      let cutError = error.message.replace(/(ApolloError: )?Error: /, "");
      let str = GetFileType(cutError);
      let indexRemote = str?.indexOf("IS_NOT_ALLOWED");
      let finalResult = str?.substring(0, indexRemote);

      if (cutError == "FILE_NAME_CONTAINS_A_SINGLE_QUOTE(')") {
        setUploadSpeed(0);
        setOverallProgress(0);
        setIsUploading(false);
        errorMessage("Sorry We Don't Allow File Name Include (')", 3000);
      } else if (cutError == "UPLOAD_LIMITED") {
        setUploadSpeed(0);
        setOverallProgress(0);
        setIsUploading(false);
        errorMessage("Upload Is Limited! Pleaes Try Again Tomorrow!", 3000);
      } else if (cutError == "NONE_URL") {
        setUploadSpeed(0);
        setOverallProgress(0);
        setIsUploading(false);
        errorMessage("Your Upload Link Is Incorrect!", 3000);
      } else if (finalResult) {
        setUploadSpeed(0);
        setOverallProgress(0);
        setIsUploading(false);
        errorMessage(`File ${finalResult} is not allowed`, 3000);
      } else {
        setUploadSpeed(0);
        setOverallProgress(0);
        setIsUploading(false);
        errorMessage("Something Wrong Please Try Again Later!", 3000);
      }
    }
  };

  const handleCloseAndDeleteFile = async () => {
    isRunningRef.current = false;
  };
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <React.Fragment>
      {!isUploading ? (
        <BootstrapDialog aria-labelledby="customized-dialog-title" open={open}>
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleCloseModal}
            sx={{ border: "1px solid #ffffff" }}
          >
            <MUI.BoxUploadTitle>
              <Typography
                variant=""
                sx={{
                  marginTop: isMobile ? "0.5rem" : "",
                  fontSize: "1rem",
                }}
              >
                Upload files
              </Typography>
            </MUI.BoxUploadTitle>
          </BootstrapDialogTitle>
          <DialogContent
            dividers
            sx={{
              width: isMobile ? "auto" : "600px",
              padding: "0 1.5rem !important",
            }}
          >
            <MUI.BoxNumberOfSelectedFile>
              <strong>
                Your {filesArray?.length} files are ready to upload
              </strong>
            </MUI.BoxNumberOfSelectedFile>
            {filesArray?.map((item, index) => (
              <MUI.BoxShowFiles key={index}>
                <MUI.BoxShowFileDetail>
                  {!isMobile && (
                    <MUI.BoxShowFileIcon>
                      <FileIcon
                        extension={GetFileType(item.name)}
                        {...defaultStyles[GetFileType(item.name)]}
                      />
                    </MUI.BoxShowFileIcon>
                  )}
                  {!isMobile && (
                    <MUI.BoxShowFileName>
                      <Typography variant="" sx={{ fontSize: "0.8rem" }}>
                        {cutFileName(item.name, 10)}
                      </Typography>
                      <Typography
                        variant=""
                        sx={{ fontSize: "0.7rem", color: "#17766B" }}
                      >
                        ({ConvertBytetoMBandGB(item.size)})
                      </Typography>
                    </MUI.BoxShowFileName>
                  )}
                </MUI.BoxShowFileDetail>
                <MUI.BoxShowLockFile
                  sx={{ justifyContent: "space-between !important" }}
                >
                  {isMobile ? (
                    <MUI.BoxShowFileName>
                      <MUI.BoxShowFileIcon>
                        <FileIcon
                          extension={GetFileType(item.name)}
                          {...defaultStyles[GetFileType(item.name)]}
                        />
                      </MUI.BoxShowFileIcon>
                      &nbsp;&nbsp;
                      <Typography variant="" sx={{ fontSize: "0.8rem" }}>
                        {cutFileName(item.name, 10)}
                      </Typography>
                      <Typography
                        variant=""
                        sx={{ fontSize: "0.7rem", color: "#17766B" }}
                      >
                        ({ConvertBytetoMBandGB(item.size)})
                      </Typography>
                    </MUI.BoxShowFileName>
                  ) : (
                    <div style={{ width: "100px" }}></div>
                  )}
                  <IconButton onClick={() => handleGetBackId(item.id - 1)}>
                    <Delete
                      sx={{
                        fontSize: "1.2rem",
                        [theme.breakpoints.down("sm")]: {
                          marginLeft: "1rem",
                        },
                      }}
                    />
                  </IconButton>
                </MUI.BoxShowLockFile>
              </MUI.BoxShowFiles>
            ))}
            <MUI.BoxUploadAndReset>
              <Button
                startIcon={<Upload />}
                autoFocus
                sx={{
                  color: "#17766B",
                  fontSize: "0.8rem",
                }}
                {...selectMore}
                size="small"
              >
                Select More
              </Button>
              <Button
                startIcon={<RestartAltIcon />}
                autoFocus
                sx={{
                  fontSize: "0.8rem",
                  color: "#000000",
                }}
                onClick={onRemoveAll}
                size="small"
              >
                Reset
              </Button>
            </MUI.BoxUploadAndReset>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              startIcon={<Upload sx={{}} />}
              autoFocus
              sx={{
                background: "#17766B",
                color: "#ffffff",
                fontSize: "14px",
                padding: "2px 30px",
                borderRadius: "6px",
                border: "1px solid #17766B",
                "&:hover": { border: "1px solid #17766B", color: "#17766B" },
                margin: "1rem 0",
              }}
              onClick={() => {
                handlePrepareToUpload();
                setIsDone(0);
              }}
            >
              Upload
            </Button>
          </DialogActions>
        </BootstrapDialog>
      ) : isDone === 0 ? (
        <BootstrapDialog aria-labelledby="customized-dialog-title" open={open}>
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleCloseModal}
          >
            <MUI.BoxProgressHeader>
              <Typography variant="" sx={{ fontSize: "1rem" }}>
                Uploading in progress...
              </Typography>
            </MUI.BoxProgressHeader>
          </BootstrapDialogTitle>
          <DialogContent
            sx={{
              paddingBottom: "2rem",
              width: isMobile ? "auto" : "600px",
            }}
          >
            <MUI.BoxUploadProgress>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  [theme.breakpoints.down("sm")]: {
                    margin: "1rem 0 ",
                  },
                }}
              >
                <CircularProgressbar
                  value={overallProgress}
                  text={`${overallProgress}%`}
                  styles={buildStyles({
                    strokeLinecap: "butt",
                    textSize: "12px",
                    pathTransitionDuration: 0.5,
                    pathColor: "#17766B",
                    textColor: "#0F6C61",
                    trailColor: "#d6d6d6",
                    backgroundColor: "#17766B",
                  })}
                />
              </Box>

              <MUI.BoxUploadProgressDetail>
                <Typography variant="" sx={{ fontSize: "0.9rem" }}>
                  Sending {filesArray.length} files in progress,
                  {ConvertBytetoMBandGB(dataSizeAll)} in total
                </Typography>
                <Typography variant="" sx={{ fontSize: "0.8rem" }}>
                  {numUploadedFiles}/{filesArray.length} uploaded files
                </Typography>
                <Typography variant="" sx={{ fontSize: "0.8rem" }}>
                  {ConvertBytetoMBandGB(uploadSpeed)}/s
                </Typography>
              </MUI.BoxUploadProgressDetail>
            </MUI.BoxUploadProgress>
            <br />
            <br />
            {filesArray?.map((data, index) => (
              <MUI.BoxUploadFiles key={index}>
                <MUI.BoxUploadFileDetail>
                  <Box sx={{ width: "25px" }}>
                    <FileIcon
                      extension={GetFileType(data.name)}
                      {...defaultStyles[GetFileType(data.name)]}
                    />
                  </Box>
                  &nbsp;&nbsp;&nbsp;
                  <MUI.BoxFilesName>
                    <Typography
                      variant=""
                      sx={{ fontSize: "0.8rem !important" }}
                    >
                      {data?.name}
                    </Typography>
                    <Typography
                      variant=""
                      sx={{
                        fontSize: "0.7rem !important",
                        color: "#17766B",
                      }}
                    >
                      {ConvertBytetoMBandGB(data?.size)}
                    </Typography>
                  </MUI.BoxFilesName>
                </MUI.BoxUploadFileDetail>
                <Box>
                  {index + 1 <= numUploadedFiles ? (
                    <>
                      <DownloadDoneIcon size={20} color="success" />
                    </>
                  ) : (
                    <>
                      <CircularProgress size={20} color="success" />
                    </>
                  )}
                </Box>
              </MUI.BoxUploadFiles>
            ))}
            <br />
          </DialogContent>
        </BootstrapDialog>
      ) : null}
    </React.Fragment>
  );
}
