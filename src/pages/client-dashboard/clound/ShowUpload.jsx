import { useLazyQuery, useMutation } from "@apollo/client";
import axios from "axios";
import CryptoJS from "crypto-js";
import * as React from "react";
import { useDropzone } from "react-dropzone";
import { UAParser } from "ua-parser-js";
import * as MUI from "../css/showUploadStyle";
// component and functions
import {
  errorMessage,
  successMessage,
  warningMessage,
} from "../../../components/Alerts";
import { EventUploadTriggerContext } from "../../../contexts/EventUploadTriggerContext";
import { FolderContext } from "../../../contexts/FolderContext";
import {
  ConvertBytetoMBandGB,
  calculateTime,
  cutSpaceError,
  getFileNameExtension,
} from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import fileLogo from "../../../utils/images/Logo_2.svg";
import { limitContent } from "../../../utils/limitTextLenght";
import { MUTATION_ACTION_FILE } from "./apollo";
import {
  CANCEL_UPLOAD_FOLDER,
  DELETE_FILE,
  NEW_PATH_FOLDER,
  UPLOAD_FILE,
  UPLOAD_FOLDER,
} from "./apollo/upload";

// material ui component or icons
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

export default function ShowUploadProgress(props) {
  const {
    open,
    data,
    onSelectMore,
    onDeleteData,
    onClose,
    onRemoveAll,
    folderData,
    parentComponent,
  } = props;

  const { CancelToken } = axios;
  const theme = useTheme();
  const BUNNY_URL = process.env.REACT_APP_BUNNY_URL;
  const STORAGE_ZONE = process.env.REACT_APP_STORAGE_ZONE;
  const ACCESS_KEY = process.env.REACT_APP_ACCESSKEY_BUNNY;
  const SECRET_KEY = process.env.REACT_APP_BUNNY_SECRET_KEY;
  const UA = new UAParser();
  const { user: userAuth } = useAuth();
  const result = UA.getResult();
  // apollo
  const [queryPath, { data: newPath }] = useLazyQuery(NEW_PATH_FOLDER, {
    fetchPolicy: "no-cache",
  });

  const [uploadFiles] = useMutation(UPLOAD_FILE);
  const [deleteFile] = useMutation(DELETE_FILE);
  const [uplodFolder] = useMutation(UPLOAD_FOLDER);
  const [actionFile] = useMutation(MUTATION_ACTION_FILE);
  const [cancelUploadFolder] = useMutation(CANCEL_UPLOAD_FOLDER);

  const [files, setFiles] = React.useState([]);
  const [fileId, setFileId] = React.useState({});
  const [fileTimes, setFileTimes] = React.useState([]);
  const [fileProgress, setFileProgress] = React.useState({});
  const [fileSpeeds, setFileSpeeds] = React.useState([]);
  const [successfulFiles, setSuccessfulFiles] = React.useState([]);
  const [hideSelectMore, setHideSelectMore] = React.useState(0);
  const [isHide, setIsHide] = React.useState(false);
  const [cancelStatus, setCancelStatus] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [cancelToken, setCancelToken] = React.useState({});
  const [uploadingId, setUploadingId] = React.useState(0);
  const [canClose, setCanClose] = React.useState(false);

  const [hideFolderSelectMore, setHideFolderSelectMore] = React.useState(0);
  const [cancelFolderStatus, setCancelFolderStatus] = React.useState(false);
  const [isHideFolder, setIsHideFolder] = React.useState(false);
  const [isFolderSuccess, setIsFolderSuccess] = React.useState(false);
  const { folderId, trackingFolderData } = React.useContext(FolderContext);
  const [folderCancelTokenSource, setFolderCancelTokenSource] =
    React.useState(null);
  const [folderSpeed, setFolderSpeed] = React.useState({});
  const [folderStartTimeMap, setFolderStartTimeMap] = React.useState({});
  const eventUploadTrigger = React.useContext(EventUploadTriggerContext);
  const [folderProgressMap, setFolderProgressMap] = React.useState({});
  const [country, setCountry] = React.useState(null);
  // const useDataSetting = useManageSetting();
  const user = trackingFolderData?.createdBy?._id
    ? trackingFolderData?.createdBy
    : userAuth;

  // const settingKeys = {};

  const folderNames = new Set();
  folderData?.forEach((fileArray) => {
    fileArray.forEach((file) => {
      const folderName = file.webkitRelativePath.split("/")[0];
      folderNames.add(folderName);
    });
  });

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

  // functions
  React.useEffect(() => {
    if (data) {
      setFiles(data);
    }
    if (folderData?.length < 0 && data?.length < 0) {
      handleCloseModal();
    }
  }, [data, newPath]);

  const handleUploadSuccess = (index) => {
    setSuccessfulFiles((prev) => [...prev, index]);
  };

  const handleUploadCancel = (index, type) => {
    onDeleteData(index, type);
  };

  const isSuccessful = (index) => {
    return successfulFiles.includes(index) || isSuccess[index];
  };

  const handleCancleUploadFile = async (index) => {
    const id = fileId[index];
    await deleteFile({
      variables: {
        id: id,
      },
      onCompleted: () => {
        setCancelStatus((prev) => ({
          ...prev,
          [index]: true,
        }));
      },
    });

    if (cancelToken[index]) {
      cancelToken[index].cancel();
      setCancelToken((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
    }
  };

  const handleCancelUploadFolder = async (folderKey) => {
    try {
      await cancelUploadFolder({
        variables: {
          where: {
            _id: uploadingId,
            checkFolder: folderId > 0 ? "sub" : "main",
          },
        },
        onCompleted: () => {
          setCancelFolderStatus((prev) => ({
            ...prev,
            [folderKey]: true,
          }));

          setFolderSpeed((prev) => ({
            ...prev,
            [folderKey]: 0,
          }));

          setFolderStartTimeMap((prev) => ({
            ...prev,
            [folderKey]: "0",
          }));

          setFolderProgressMap((prev) => ({
            ...prev,
            [folderKey]: 0,
          }));
        },
      });

      if (folderCancelTokenSource[folderKey]) {
        folderCancelTokenSource[folderKey].cancel();
      }
    } catch (error) {
      errorMessage(error, 2000);
    }
  };

  const handleUploadDone = () => {
    onRemoveAll();
    setIsHide(false);
  };

  const handleUploadToExternalServer = async (
    index,
    id,
    file,
    newName,
    path,
  ) => {
    const startTime = new Date();
    setIsHide((prev) => ({
      ...prev,
      [index]: true,
    }));

    let filePath = "";
    if (path === "main") {
      filePath = "";
    } else {
      filePath = "/" + path;
    }
    const url =
      BUNNY_URL + user.newName + "-" + user._id + filePath + "/" + newName;
    const pathBunny = user.newName + "-" + user._id + filePath;

    setFileId((prev) => ({
      ...prev,
      [index]: id,
    }));

    try {
      const headers = {
        REGION: "sg",
        BASE_HOSTNAME: "storage.bunnycdn.com",
        STORAGE_ZONE_NAME: STORAGE_ZONE,
        ACCESS_KEY: ACCESS_KEY,
        PATH: pathBunny,
        FILENAME: newName,
        PATH_FOR_THUMBNAIL: user.newName + "-" + user._id,
      };

      const secretKey = SECRET_KEY;
      const encryptedHeaders = CryptoJS.AES.encrypt(
        JSON.stringify(headers),
        secretKey,
      ).toString();

      const source = CancelToken.source();
      const cancelToken = source.token;
      setCancelToken((prev) => ({
        ...prev,
        [index]: source,
      }));

      const blob = new Blob([file], {
        type: file.type,
      });
      const newFile = new File([blob], file.name, { type: file.type });

      const formData = new FormData();
      formData.append("file", newFile);

      const response = await axios.post(
        "https://load.vshare.net/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            encryptedHeaders,
          },
          cancelToken,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setFileProgress((prev) => ({
              ...prev,
              [index]: percentCompleted,
            }));
            const speed = ConvertBytetoMBandGB(
              progressEvent.loaded / ((Date.now() - startTime) / 1000),
            );
            const endTime = Date.now();
            const duration = calculateTime(endTime - startTime);
            setFileSpeeds((prev) => {
              const arr = [...prev];
              arr[index] = speed;
              return arr;
            });
            setFileTimes((prev) => {
              const arr = [...prev];
              arr[index] = duration;
              return arr;
            });
          },
        },
      );

      if (response.data) {
        handleUploadSuccess(index);
      }
      setIsSuccess((prev) => ({
        ...prev,
        [index]: true,
      }));
      setIsHide((prev) => ({
        ...prev,
        [index]: false,
      }));
    } catch (error) {
      if (axios.isCancel(error)) {
        successMessage("Upload cancelled", 2000);
      } else {
        errorMessage("Upload failed", 3000);
      }
    } finally {
      setSuccessfulFiles([]);
    }
  };

  const handleUploadToInternalServer = async (fileData) => {
    setHideSelectMore(1);
    setCanClose(true);
    const filesArray = Array.from(fileData);
    if (fileData.length > 0) {
      try {
        const uploadPromises = filesArray.map(async (file, index) => {
          const randomName = Math.floor(1111111111 + Math.random() * 999999);
          let path = "";
          let newFilePath = "";
          if (folderId > 0) {
            const queryfolderPath = await queryPath({
              variables: {
                where: {
                  _id: folderId,
                  createdBy: user?._id,
                },
              },
            });
            const newPath = queryfolderPath?.data?.folders?.data[0]?.newPath;
            if (newPath) {
              path = newPath;
              newFilePath =
                newPath + "/" + randomName + getFileNameExtension(file.name);
            }
          }
          let uploading = await uploadFiles({
            variables: {
              data: {
                newFilename: randomName + getFileNameExtension(file.name),
                filename: file.name,
                fileType: file.type,
                size: file.size.toString(),
                checkFile: folderId > 0 ? "sub" : "main",
                ...(folderId > 0 ? { folder_id: folderId } : {}),
                ...(folderId > 0 ? { newPath: newFilePath } : {}),
                country: country,
                device: result.os.name + result.os.version,
                totalUploadFile: filesArray.length,
              },
            },
          });

          if (uploading?.data?.createFiles?._id) {
            let fileId = uploading?.data?.createFiles?._id;
            await handleActionFile(fileId);
            await handleUploadToExternalServer(
              index,
              fileId,
              file,
              randomName + getFileNameExtension(file.name),
              folderId > 0 ? path : "main",
            );
          }
        });
        await Promise.all(uploadPromises);
        await eventUploadTrigger?.trigger();
        setCanClose(false);
        setHideSelectMore(2);
      } catch (error) {
        setCanClose(false);
        setHideSelectMore(0);
        const message = cutSpaceError(error.message);
        if (message) {
          errorMessage("Your space isn't enough", 3000);
        } else {
          handleErrorFiles(error);
        }
      }
    }
  };

  const handleUploadFolder = async () => {
    setHideFolderSelectMore(1);
    setCanClose(true);
    let successFolderCount = 0;
    try {
      const foldersArray = Array.from(folderData);
      const totalFolders = foldersArray.length;
      for (let key in foldersArray) {
        const files = foldersArray[key];
        const folderKey = key.toString();
        let folderStartTime = new Date();
        let progressArray = Array(files.length).fill(0);
        let totalBytesUploaded = 0;
        setFolderProgressMap((prev) => ({
          ...prev,
          [folderKey]: 0,
        }));
        setIsHideFolder((prev) => ({
          ...prev,
          [folderKey]: true,
        }));

        const newObjects = files.map((file) => ({
          path: file.webkitRelativePath,
          type: file.type,
          size: file.size.toString(),
        }));

        const folderCancelTokenSource = CancelToken.source();
        setFolderCancelTokenSource({
          ...folderCancelTokenSource,
          [folderKey]: folderCancelTokenSource,
        });

        try {
          const folderUpload = await uplodFolder({
            variables: {
              data: {
                checkFolder: folderId > 0 ? "sub" : "main",
                pathFolder: newObjects,
                ...(folderId > 0 ? { parentkey: folderId } : {}),
                folder_type: "folder",
              },
            },
            cancelToken: folderCancelTokenSource.token,
          });

          if (folderUpload?.data?.uploadFolder.status === 200) {
            setUploadingId(folderUpload?.data?.uploadFolder._id);
            const arrayPath = folderUpload?.data?.uploadFolder.path;

            if (arrayPath && arrayPath.length > 0) {
              await Promise.all(
                arrayPath.map(async (path, index) => {
                  const file = files[index];
                  const blob = new Blob([file], {
                    type: file.type,
                  });
                  const newFile = new File([blob], file.name, {
                    type: file.type,
                  });

                  const lastIndex = path.newPath?.lastIndexOf("/");
                  const resultPath = path.newPath?.substring(0, lastIndex);
                  const resultFileName = path?.newPath?.substring(lastIndex);

                  const headers = {
                    REGION: "sg",
                    BASE_HOSTNAME: "storage.bunnycdn.com",
                    STORAGE_ZONE_NAME: STORAGE_ZONE,
                    ACCESS_KEY: ACCESS_KEY,
                    PATH: user.newName + "-" + user._id + "/" + resultPath,
                    FILENAME: resultFileName?.substring(1),
                    PATH_FOR_THUMBNAIL: user.newName + "-" + user._id,
                  };

                  const secretKey = SECRET_KEY;
                  const encryptedHeaders = CryptoJS.AES.encrypt(
                    JSON.stringify(headers),
                    secretKey,
                  ).toString();

                  const formData = new FormData();
                  formData.append("file", newFile);

                  const source = folderCancelTokenSource;
                  const options = {
                    method: "POST",
                    url: "https://load.vshare.net/upload",
                    headers: {
                      "Content-Type": "application/octet-stream",
                      encryptedHeaders,
                    },
                    data: formData,
                    onUploadProgress: function (progressEvent) {
                      const bytesUploaded = progressEvent.loaded;
                      totalBytesUploaded += bytesUploaded;

                      const folderSpeed = ConvertBytetoMBandGB(
                        totalBytesUploaded /
                          ((Date.now() - folderStartTime) / 1000),
                      );

                      const folderEndTime = Date.now();
                      const duration = calculateTime(
                        folderEndTime - folderStartTime,
                      );

                      setFolderSpeed((prev) => ({
                        ...prev,
                        [folderKey]: folderSpeed,
                      }));

                      setFolderStartTimeMap((prev) => ({
                        ...prev,
                        [folderKey]: duration,
                      }));

                      if (source.token.reason) {
                        return;
                      }

                      const fileProgress = Math.round(
                        (bytesUploaded * 100) / file.size,
                      );
                      progressArray[index] = fileProgress;

                      const totalProgress = Math.round(
                        progressArray.reduce((acc, p) => acc + p, 0) /
                          progressArray.length,
                      );

                      setFolderProgressMap((prev) => ({
                        ...prev,
                        [folderKey]: totalProgress,
                      }));
                    },
                    cancelToken: source.token,
                  };

                  await axios.request(options);
                  // coutFileUpload++;
                }),
              );

              successFolderCount++;

              setIsHideFolder((prev) => ({
                ...prev,
                [folderKey]: false,
              }));
              setIsFolderSuccess((prev) => ({
                ...prev,
                [folderKey]: true,
              }));
            }
          }
          await eventUploadTrigger?.trigger();
        } catch (error) {
          const message = cutSpaceError(error.message);
          if (error.message === "Error: Your package has been limited") {
            navigate("/pricing");
          } else if (message) {
            errorMessage("Your space isn't enough", 3000);
          } else {
            handleErrorFiles(error);
          }
        } finally {
          folderStartTime = new Date();
          setCanClose(false);
          if (successFolderCount === totalFolders) {
            setHideFolderSelectMore(2);
          }
        }
      }
    } catch (error) {
      let cutError = error.message.replace(/(ApolloError: )?Error: /, "");
      if (cutError == "LOGIN_IS_REQUIRED") {
        errorMessage("Your token is expired!!", 3000);
      } else if (
        cutError ==
        "NOT_ENOUGH_SIZE,SPACEPACKAGE:ຄວາມຈຸຂອງUSER, TOTALSIZEALL:ຄວາມຈຸທີ່USERໃຊ້,SIZENOW:ຄວາມຈຸປັດຈຸບັນ"
      ) {
        errorMessage(
          "Your space is not enough. Please upgrade to pro package",
          3000,
        );
      } else {
        errorMessage("Something went wrong, please try again later!", 3000);
      }
    } finally {
      setHideFolderSelectMore(0);
      setCanClose(false);
    }
  };

  const handleCloseModal = () => {
    setHideSelectMore(0);
    onClose();
    onRemoveAll();
    handleUploadDone();
    setFileProgress({});
    setIsSuccess(false);
    setIsHide(false);
    setIsFolderSuccess(false);
    setFolderProgressMap({});
    setFileSpeeds([]);
    setFileTimes([]);
    setCancelStatus(false);
    setCancelFolderStatus(false);
    setHideFolderSelectMore(0);
    setFolderSpeed({});
    setFolderStartTimeMap({});
    setFolderProgressMap({});
  };

  const handleWarningMessage = () => {
    warningMessage("Please wait until upload done!", 2000);
  };

  const handleSelectMore = () => {
    onSelectMore();
  };

  const handleActionFile = async (id) => {
    try {
      await actionFile({
        variables: {
          fileInput: {
            createdBy: parseInt(user._id),
            fileId: parseInt(id),
            actionStatus: "upload",
          },
        },
      });
    } catch (error) {
      console.error(error);
      errorMessage("You action file wrong", 2000);
    }
  };

  const mobileScreen = useMediaQuery(theme.breakpoints.down("md"));

  function LinearProgressWithLabel(props) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  function handleErrorFiles(msgError) {
    let error = msgError.message.replace(/(ApolloError: )?Error: /, "");
    let userData = localStorage.getItem("userData");
    let packageUpload = 0;
    if (userData) {
      const packageJson = JSON.parse(userData);
      packageUpload = parseInt(packageJson?.packageId?.numberOfFileUpload || 0);
    }
    if (error === "LOGIN_IS_REQUIRED") {
      errorMessage("Please login again", 3000);
    } else if (error === "FOLDER_ID_IS_NOT_NULL") {
      errorMessage("Folder is not found", 3000);
    } else if (error.includes("UPLOAD_MORE_THAN")) {
      errorMessage(
        `You can upload up to ${packageUpload} files at time. Please try again`,
        3000,
      );
    } else if (error === "TOTALUPLOADFILE_IS_NOT_UNDEFINED") {
      errorMessage("Upload file total is missing", 3000);
    } else if (error === "FILE_MAIN_FOLDER_ID_NOT_ZERO") {
      errorMessage("Main folder is not empty", 3000);
    } else {
      errorMessage(error, 3000);
    }
  }

  const { getRootProps, isDragActive } = useDropzone();

  return (
    <React.Fragment>
      <Dialog
        onClose={canClose ? () => {} : handleCloseModal}
        open={open}
        fullWidth
        maxWidth="sm"
      >
        <Box
          sx={{ textAlign: "center", padding: "1.5rem 0.5rem 0.5rem 0.5rem" }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#5D586C",
              [theme.breakpoints.down("sm")]: {
                fontSize: "0.9rem",
                fontWeight: 400,
              },
            }}
          >
            Upload, Drag and drop your files here to upload
          </Typography>
        </Box>
        <DialogContent
          style={{
            padding: "0",
          }}
        >
          <Box
            sx={{
              padding: "0.5rem 1.5rem 2rem 1.5rem",
              [theme.breakpoints.down("sm")]: {
                padding: "0.5rem",
              },
            }}
          >
            <Box>
              {hideSelectMore == 1 || hideFolderSelectMore == 1 ? (
                <Box
                  sx={{
                    border: "2px dashed #5D9F97",
                    borderRadius: "10px",
                    padding: "1rem 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                >
                  <CircularProgress size={mobileScreen ? 20 : 40} />
                  <Typography
                    variant="h3"
                    sx={{
                      margin: "0.2rem",
                      fontSize: "1.125rem",
                      mt: 3,
                      color: "#17766B",
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      },
                    }}
                  >
                    Uploading....
                  </Typography>
                </Box>
              ) : hideSelectMore == 2 || hideFolderSelectMore == 2 ? (
                <Box
                  sx={{
                    border: "2px dashed #5D9F97",
                    borderRadius: "10px",
                    padding: "1rem 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                >
                  <CheckCircleOutlineIcon
                    sx={{
                      color: "#17766B",
                      fontSize: "3rem",
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "2rem",
                      },
                    }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      margin: "0.2rem",
                      fontSize: "1.125rem",
                      color: "#17766B",
                      mt: 3,
                      [theme.breakpoints.down("sm")]: {
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      },
                    }}
                  >
                    Files upload successfully!
                  </Typography>
                </Box>
              ) : (
                <Box
                  onClick={
                    parentComponent == "clientDashboard"
                      ? () => {}
                      : handleSelectMore
                  }
                >
                  <Tooltip
                    title={
                      parentComponent == "clientDashboard"
                        ? "Drag and drop files here"
                        : "Double click for select more"
                    }
                    placement="top"
                    followCursor
                  >
                    <Box
                      sx={{
                        border: "2px dashed #5D9F97",
                        borderRadius: "10px",
                        padding: "0 0 1rem 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        cursor: "pointer",
                        background:
                          isDragActive && parentComponent == "clientDashboard"
                            ? "#5D9F97"
                            : "#ffffff",
                      }}
                      // {...(parentComponent !== "floating_button" &&
                      //   getRootProps())}
                    >
                      <img src={fileLogo} alt="file icon" />
                      {isDragActive && parentComponent == "clientDashboard" ? (
                        <Typography
                          variant="h6"
                          sx={{
                            margin: "0.1rem",
                            fontSize: "1rem",
                            color:
                              isDragActive &&
                              parentComponent == "clientDashboard"
                                ? "#ffffff"
                                : "#000000",
                            [theme.breakpoints.down("sm")]: {
                              fontSize: "0.7rem",
                            },
                          }}
                        >
                          Drop your files right here to upload!11
                        </Typography>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            [theme.breakpoints.down("sm")]: {
                              flexDirection: "column",
                            },
                          }}
                        >
                          {parentComponent == "clientDashboard" ? (
                            <Typography
                              variant="h3"
                              sx={{
                                margin: "0.2rem",
                                fontSize: "1.125rem",
                                [theme.breakpoints.down("sm")]: {
                                  fontSize: "0.9rem",
                                },
                                color:
                                  isDragActive &&
                                  parentComponent == "clientDashboard"
                                    ? "#ffffff"
                                    : "#17766B",
                              }}
                            >
                              Drop your files right here to upload!
                            </Typography>
                          ) : (
                            <Typography
                              variant="h3"
                              sx={{
                                margin: "0.2rem",
                                fontSize: "1.125rem",
                                [theme.breakpoints.down("sm")]: {
                                  fontSize: "0.9rem",
                                },
                                color:
                                  isDragActive &&
                                  parentComponent == "clientDashboard"
                                    ? "#ffffff"
                                    : "#17766B",
                              }}
                            >
                              Double click to&nbsp;
                              <strong
                                style={{
                                  color:
                                    isDragActive &&
                                    parentComponent == "clientDashboard"
                                      ? "#ffffff"
                                      : "#17766B",
                                }}
                              >
                                select more
                              </strong>
                            </Typography>
                          )}

                          <Typography
                            variant="h6"
                            sx={{
                              margin: "0.1rem",
                              fontSize: "1rem",
                              color:
                                isDragActive &&
                                parentComponent == "clientDashboard"
                                  ? "#ffffff"
                                  : "#000000",
                              [theme.breakpoints.down("sm")]: {
                                fontSize: "0.7rem",
                              },
                            }}
                          >
                            Max file size 50 MB
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Tooltip>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {Array.from(folderNames)?.map((val, index) => {
                return (
                  <MUI.ShowFileUploadBox key={index}>
                    <MUI.ShowFileDetailBox>
                      <MUI.ShowNameAndProgress>
                        <Typography variant="h5">
                          {mobileScreen
                            ? limitContent(val, 15)
                            : limitContent(val, 25)}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "start",
                            justifyContent: "start",
                            marginTop: "0.3rem",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              borderRight: "1px solid #817D8D",
                              paddingRight: "0.5rem",
                              marginRight: "0.5rem",
                            }}
                          >
                            Time:&nbsp;
                            {folderStartTimeMap[index]
                              ? folderStartTimeMap[index]
                              : 0}
                          </Typography>
                          <Typography variant="h6">
                            Speed:&nbsp;
                            {folderSpeed[index] ? folderSpeed[index] : 0}
                          </Typography>
                        </Box>
                      </MUI.ShowNameAndProgress>
                      <MUI.ShowActionButtonBox>
                        {cancelFolderStatus[index] ? (
                          <Chip
                            label="Cancled"
                            color="error"
                            variant="outlined"
                          />
                        ) : isFolderSuccess[index] ? (
                          <IconButton sx={{ background: "#EEFBF3" }}>
                            <DownloadDoneIcon sx={{ color: "#17766B" }} />
                          </IconButton>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-around",
                            }}
                          >
                            {isHideFolder[index] &&
                              folderProgressMap[index] < 100 && (
                                <Tooltip
                                  title="Cancel upload"
                                  placement="top"
                                  followCursor
                                >
                                  <IconButton
                                    onClick={() =>
                                      handleCancelUploadFolder(index)
                                    }
                                  >
                                    <HighlightOffIcon
                                      sx={{
                                        color: "#555555",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </IconButton>
                                </Tooltip>
                              )}
                            {!isHideFolder[index] && (
                              <Tooltip
                                title={"Delete" + " " + val}
                                placement="top"
                                followCursor
                              >
                                <IconButton
                                  onClick={() =>
                                    handleUploadCancel(index, "folder")
                                  }
                                >
                                  <DeleteForeverIcon
                                    sx={{ color: "#D93025" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        )}
                      </MUI.ShowActionButtonBox>
                    </MUI.ShowFileDetailBox>
                    {cancelFolderStatus[index] ? (
                      ""
                    ) : (
                      <Box sx={{ width: "100%", marginTop: "0.5rem" }}>
                        <LinearProgressWithLabel
                          variant="determinate"
                          value={
                            !folderProgressMap[index]
                              ? 0
                              : folderProgressMap[index]
                          }
                          sx={{ borderRadius: "5px", height: "5px" }}
                        />
                      </Box>
                    )}
                  </MUI.ShowFileUploadBox>
                );
              })}

              {files?.map((val, index) => {
                const progress = fileProgress[index] || 0;
                const isFileSuccessful = isSuccessful(index);
                return (
                  <MUI.ShowFileUploadBox key={index}>
                    <MUI.ShowFileDetailBox>
                      <MUI.ShowNameAndProgress>
                        <Typography variant="h5">
                          {mobileScreen
                            ? limitContent(val.name, 15)
                            : limitContent(val.name, 25)}
                          &nbsp;
                          <span
                            style={{ color: "#17766B", fontSize: "0.7rem" }}
                          >
                            ({ConvertBytetoMBandGB(val.size)})
                          </span>
                        </Typography>
                        {cancelStatus[index] ? (
                          ""
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "start",
                              justifyContent: "start",
                              marginTop: "0.3rem",
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                borderRight: "1px solid #817D8D",
                                paddingRight: "0.5rem",
                                marginRight: "0.5rem",
                              }}
                            >
                              Time:&nbsp;
                              {fileTimes[index] ? fileTimes[index] : 0}
                            </Typography>
                            <Typography variant="h6">
                              Speed:&nbsp;
                              {fileSpeeds[index] ? fileSpeeds[index] : 0}
                            </Typography>
                          </Box>
                        )}
                      </MUI.ShowNameAndProgress>
                      <MUI.ShowActionButtonBox>
                        {cancelStatus[index] ? (
                          <Chip
                            label="Cancled"
                            color="error"
                            variant="outlined"
                          />
                        ) : isFileSuccessful ? (
                          <IconButton sx={{ background: "#EEFBF3" }}>
                            <DownloadDoneIcon sx={{ color: "#17766B" }} />
                          </IconButton>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-around",
                            }}
                          >
                            {isHide[index] && progress < 100 && (
                              <Tooltip
                                title="Cancel upload"
                                placement="top"
                                followCursor
                              >
                                <IconButton
                                  onClick={() => handleCancleUploadFile(index)}
                                >
                                  <HighlightOffIcon
                                    sx={{
                                      color: "#555555",
                                      cursor: "pointer",
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                            {!isHide[index] && (
                              <Tooltip
                                title="Delete File"
                                placement="top"
                                followCursor
                              >
                                <IconButton
                                  onClick={() =>
                                    handleUploadCancel(index, "file")
                                  }
                                >
                                  <DeleteForeverIcon
                                    sx={{ color: "#D93025" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        )}
                      </MUI.ShowActionButtonBox>
                    </MUI.ShowFileDetailBox>
                    {cancelStatus[index] ? (
                      ""
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          marginTop: "0.5rem",
                        }}
                      >
                        <LinearProgressWithLabel
                          variant="determinate"
                          value={progress}
                          sx={{ borderRadius: "5px", height: "5px" }}
                        />
                      </Box>
                    )}
                  </MUI.ShowFileUploadBox>
                );
              })}
            </Box>
            <Button
              color="error"
              variant="contained"
              sx={{
                marginTop: "1rem",
                background: "#EB5F60",
                color: "#ffffff",
                fontWeight: "bold",
                "&:hover": {
                  color: "#ffffff",
                  background: "#EB5F60",
                },
              }}
              onClick={canClose ? handleWarningMessage : handleCloseModal}
              size={mobileScreen ? "small" : "medium"}
            >
              Close
            </Button>
            &nbsp;&nbsp;
            <Button
              onClick={() => {
                if (folderData?.length > 0 && data?.length > 0) {
                  handleUploadFolder();
                  handleUploadToInternalServer(data);
                } else if (data?.length > 0 && folderData?.length === 0) {
                  handleUploadToInternalServer(data);
                } else if (data?.length === 0 && folderData?.length > 0) {
                  handleUploadFolder();
                }
              }}
              variant="contained"
              sx={{ marginTop: "1rem" }}
              disabled={
                hideSelectMore != 0 || hideFolderSelectMore != 0 ? true : false
              }
              size={mobileScreen ? "small" : "medium"}
            >
              Upload Now
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
