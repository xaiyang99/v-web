import axios from "axios";
import CryptoJS from "crypto-js";
import * as htmlToImage from "html-to-image";
import { customAlphabet } from "nanoid";
import PropTypes from "prop-types";
import QRCode from "qrcode.react";
import * as React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import * as MUI from "../css/showFileDialog";
import imageIcon from "./image/Logo.png";

import { Delete, Upload } from "@mui/icons-material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { createTheme, styled } from "@mui/material/styles";
// react animate component

import { useMutation } from "@apollo/client";
import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material";
import CopyToClipboard from "react-copy-to-clipboard";
import { FileIcon, defaultStyles } from "react-file-icon";
import { errorMessage, successMessage } from "../../../../components/Alerts";
import { ConvertBytetoMBandGB, GetFileType } from "../../../../functions";
import { cutFileName } from "../../../../utils/limitTextLenght";
import { CREATE_FILE_PUBLIC } from "./apollo";

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
    dataPasswordLink,
    dataSubPasswordLink,
    dataUploadPerDay,
    dataUploadPerTime,
    dataMaxSize,
    dataExpire,
    dataExpires,
    // onClose,
  } = props;
  const theme = createTheme();
  const [createFilePublic] = useMutation(CREATE_FILE_PUBLIC);
  const [fileData, setFileData] = React.useState(files);
  const [primaryLock, setPrimaryLock] = React.useState(false);
  const [mainPassword, setMainPassword] = React.useState("");

  const [expired, setExpired] = React.useState({
    title: "auto",
    action: "3",
    productKey: "AEADEFO",
  });
  const [isUploading, setIsUploading] = React.useState(false);
  // const [isDone, setIsDone] = React.useState(-1);
  const [isDone, setIsDone] = React.useState(0);
  const [numUploadedFiles, setNumUploadedFiles] = React.useState(0);
  const [fileMaxSize, setFileMaxSize] = React.useState("");
  const [uploadSpeed, setUploadSpeed] = React.useState(0);
  const [overallProgress, setOverallProgress] = React.useState(0);
  const [checkUpload, setCheckUpload] = React.useState(false);
  const isRunningRef = React.useRef(true);
  // const [passwordCopied, setPasswordCompied] = React.useState(false);
  const [hidePasswordLink, setHidePasswordLink] = React.useState(true);
  const [hideSubPasswordLink, setHideSubPasswordLink] = React.useState(true);
  const [information, setInformation] = React.useState();
  const ref = React.useRef();
  let link = null;
  window.location.protocol === "http:"
    ? (link = process.env.REACT_APP_DOWNLOAD_URL_SERVER)
    : (link = process.env.REACT_APP_DOWNLOAD_URL_SERVER);
  const ACCESS_KEY = process.env.REACT_APP_ACCESSKEY_BUNNY;
  const STORAGE_ZONE = process.env.REACT_APP_STORAGE_ZONE;
  const SECRET_KEY = process.env.REACT_APP_BUNNY_SECRET_KEY;

  const [value, setValue] = React.useState(link);
  const [copied, setCopied] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState({});

  const autoProductKey = "AEADEFO";

  function handleCopy() {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 15000);
  }

  React.useEffect(() => {
    if (!!dataExpire) {
      setExpired({
        title: dataExpire?.title,
        action: dataExpire?.action,
        productKey: dataExpire?.productKey,
      });
    }
  }, [dataExpire]);

  React.useEffect(() => {
    // if (!!dataUploadPerDay) {
    // }
  }, [dataUploadPerDay]);

  React.useEffect(() => {
    if (dataPasswordLink?.status === "on") {
      setHidePasswordLink(false);
    }
  }, [dataPasswordLink]);

  React.useEffect(() => {
    let maxSize = ConvertBytetoMBandGB(dataMaxSize?.action);
    setFileMaxSize(maxSize);
  }, [dataMaxSize]);

  React.useEffect(() => {
    if (dataSubPasswordLink?.status === "on") {
      setHideSubPasswordLink(false);
    }
  }, [dataSubPasswordLink]);

  React.useEffect(() => {
    if (openModal === false || openModal === true) {
      setIsUploading(false);
    }
  }, [openModal]);

  React.useEffect(() => {
    setFileData(files);
  }, [files]);

  const _functionResetValue = async () => {
    setIsDone(1);
    setFileData([]);
    checkSend([]);
  };

  const filesArray = files?.map((obj) => {
    return {
      id: obj.file.id,
      path: obj.file.path,
      lastModified: obj.file.lastModified,
      lastModifiedDate: obj.file.lastModifiedDate,
      name: obj.file.name,
      size: obj.file.sizeFile,
      type: obj.file.type,
      webkitRelativePath: obj.file.webkitRelativePath,
      password: "",
      URLpassword: "",
      expired: "",
    };
  });

  const dataSizeAll = filesArray.reduce((total, obj) => {
    return total + obj.size;
  }, 0);

  const [childLock, setChildLock] = React.useState(
    filesArray.reduce((obj, item) => {
      obj[item.id] = false;
      return obj;
    }, {}),
  );

  const [passwords, setPasswords] = React.useState({});

  const primaryLockHandler = () => {
    if (primaryLock) {
      setPasswords((prevPasswords) => {
        const { special: passwordToRemove, ...restPasswords } = prevPasswords;
        return restPasswords;
      });
      setMainPassword("");
    } else {
      if (!passwords["special"]) {
        generateMainPassword("special");
      }
    }
    setPrimaryLock(!primaryLock);
  };

  const childLockHandler = (id) => {
    setChildLock((prevLocks) => ({
      ...prevLocks,
      [id]: !prevLocks[id],
    }));
  };

  // generate password here
  const generateMainPassword = (id) => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPasswords((prevPasswords) => ({ ...prevPasswords, [id]: password }));
    setMainPassword(password);
  };

  const generatePassword = (id) => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    handlePasswordChange(id, password);
    setPasswords((prevPasswords) => {
      const newPasswords = { ...prevPasswords };
      if (newPasswords[id]) {
        delete newPasswords[id];
      }
      newPasswords[id] = password;
      return newPasswords;
    });
  };

  const handleButtonClick = (id) => {
    const passwordExists = passwords.hasOwnProperty(id);
    if (passwordExists) {
      setPasswords((prevPasswords) => {
        const newPasswords = { ...prevPasswords };
        delete newPasswords[id];
        return newPasswords;
      });
    } else {
      generatePassword(id);
    }
  };

  const handlePasswordChange = (id, password) => {
    setPasswords((prevState) => {
      return {
        ...prevState,
        [id]: password,
      };
    });
  };

  // send back the id for delete unneeded file
  const handleGetBackId = (id) => {
    onDeleteData(id);
  };

  const handleCloseModal = () => {
    setIsUploading(true);
    _functionResetValue();
    onRemoveAll();
  };

  const handlePrepareToUpload = () => {
    let uploadPerTime = dataUploadPerTime?.action || 0;
    if (filesArray?.length > parseInt(uploadPerTime)) {
      errorMessage(`Upload file per time only ${uploadPerTime} files`, 3000);
      return;
    }

    const passwordArr = [];
    passwordArr.push(passwords);
    const mergedArray = filesArray.map((item) => {
      const password =
        passwordArr[0] && passwordArr[0].hasOwnProperty(item.id)
          ? passwordArr[0][item.id]
          : "";
      item.password = password;
      item.URLpassword = mainPassword;
      item.expired = expired;
      return item;
    });
    setInformation(mergedArray);
    setIsUploading(true);
    handleUpload(mergedArray);
  };

  const handleUpload = async (files) => {
    let totalFile = files?.length;
    let totalSize = dataFile.reduce((acc, file) => acc + file.size, 0);
    let uploadedSize = 0;
    let previousUploadPercentage = 0;
    let currentUploadPercentage = 0;
    let getUrlAllWhenReturn = [];

    try {
      const responseIp = await axios.get("https://load.vshare.net/getIP");
      const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
      const nanoid = customAlphabet(alphabet, 6);
      const generateID = nanoid();
      const urlAllFile = generateID;

      for (let i = 0; i < files.length; i++) {
        var file = files[i];
        if (!isRunningRef.current) {
          break;
        }
        let newNameFile = Math.floor(1111111111 + Math.random() * 999999);
        const cutFilename = file?.name?.split(".");
        const extension = cutFilename.pop();
        newNameFile = `${newNameFile}.${extension}`;
        const newData = {
          name: file.name || "",
          lastModified: file.lastModified || "",
          lastModifiedDate: file?.lastModifiedDate || "",
          size: file.size || "",
          type: file.type || "",
          webkitRelativePath: file.webkitRelativePath || "",
        };
        let blob = new Blob([dataFile[i]], {
          type: newData.type,
        });

        let newFile = new File([blob], file.name, { type: newData.type });
        const { data: _createFilePublic } = await createFilePublic({
          variables: {
            data: {
              checkFile: "main",
              fileExpired: [
                {
                  typeDate: expired.title,
                  amount: parseInt(expired.action),
                },
              ],
              filePassword: file?.password,
              fileType: file?.type,
              filename: String(`${file?.name}${newNameFile}`),
              ip: String(responseIp?.data),
              newFilename: String(newNameFile),
              passwordUrlAll: file?.URLpassword,
              size: String(file?.size),
              totalUploadFile: totalFile,
              urlAll: String(urlAllFile),
              createdBy: 0,
            },
          },
        });

        getUrlAllWhenReturn = _createFilePublic.createFilesPublic;
        if (_createFilePublic) {
          try {
            const formData = new FormData();
            formData.append("file", newFile);
            const secretKey = SECRET_KEY;
            let initialUploadSpeedCalculated = false;
            const startTime = new Date().getTime();
            const headers = {
              REGION: "sg",
              BASE_HOSTNAME: "storage.bunnycdn.com",
              STORAGE_ZONE_NAME: STORAGE_ZONE,
              ACCESS_KEY: ACCESS_KEY,
              PATH: "public",
              FILENAME: newNameFile,
              PATH_FOR_THUMBNAIL: "public",
            };
            const encryptedHeaders = CryptoJS.AES.encrypt(
              JSON.stringify(headers),
              secretKey,
            ).toString();
            const response = await axios.post(
              "https://load.vshare.net/upload",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  encryptedHeaders,
                },
                onUploadProgress: (progressEvent) => {
                  const currentFileUploadedSize =
                    (progressEvent.loaded * dataFile[i].size) /
                    progressEvent.total;
                  currentUploadPercentage = (
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
              },
            );
            if (response?.status == 200) {
              uploadedSize += dataFile[i].size;
              previousUploadPercentage = currentUploadPercentage;
              setUploadStatus((prevStatus) => ({
                ...prevStatus,
                [i]: true,
              }));
            }
          } catch (error) {
            console.log(error);
            errorMessage("Error uploading file. Please try againn later", 3000);
          }
        } else {
          isRunningRef.current = false;
          break;
        }
      }
      setIsDone(1);
      setValue(`${value}${getUrlAllWhenReturn?.urlAll}`);
      setCheckUpload(true);
      successMessage("Upload successful!!", 3000);
    } catch (error) {
      let cutError = error.message.replace(/(ApolloError: )?Error: /, "");
      let fileUploadSize = dataMaxSize?.action?.split(".")[0];
      if (
        cutError ===
        `This IP address has already saved ${dataUploadPerDay?.action} files today`
      ) {
        errorMessage(
          `You have uploaded more than ${dataUploadPerDay?.action} files per day!`,
          10000,
        );
        handleCloseModal();
      } else if (
        cutError ===
        "THIS_IP_ADDRESS_HAS_ALREADY_SAVED ຈຳນວນໄຟລທີ່ກຳນົດໃນລະບົບ FILES_TODAY"
      ) {
        errorMessage("You have uploaded more than 20 GB per day!", 10000);
        handleCloseModal();
      } else if (
        cutError ===
        `THE_SIZE_OF_THIS_FILE_IS_GREATER_THAN ${fileUploadSize} GB`
      ) {
        errorMessage(`The file size is bigger than ${fileMaxSize}`, 10000);
        handleCloseModal();
      } else {
        let cutDataError = error.message.replace(/(ApolloError: )?Error: /, "");
        errorMessage(cutDataError ?? "", 10000);
        handleCloseModal();
      }
    }
  };

  const downloadQR = () => {
    const originalCanvas = document.querySelector("#qr-code-canvas");
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = originalCanvas.width;
    tempCanvas.height = originalCanvas.height;
    const ctx = tempCanvas.getContext("2d");
    ctx.drawImage(originalCanvas, 0, 0);
    const img = new Image();
    img.src = imageIcon;
    img.onload = () => {
      const centerX = tempCanvas.width / 2 - img.width / 2;
      const centerY = tempCanvas.height / 2 - img.height / 2;
      ctx.drawImage(img, centerX, centerY, 50, 40);
      const pngUrl = tempCanvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qr-code.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
  };

  const _shareEmail = async () => {
    const url = value;
    const subject = "Vshare free file hosting";
    const body = `Link file share is: ${url}`;
    const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
  };

  const _shareWhatsapp = async () => {
    const url = value;
    const encodedUrl = encodeURIComponent(url);
    const whatsappUrl = `https://web.whatsapp.com/send?text=${encodedUrl}`;
    window.open(whatsappUrl, "_blank");
  };

  const _shareFacebook = async () => {
    const url = value;
    const encodedUrl = encodeURIComponent(url);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    window.open(facebookUrl, "_blank");
  };

  const _shareTelegrame = async () => {
    const url = value;
    const encodedUrl = encodeURIComponent(url);
    const telegramUrl = `https://t.me/share/url?url=${encodedUrl}`;
    window.open(telegramUrl, "_blank");
  };

  const handleCloseAndDeleteFile = async () => {
    isRunningRef.current = false;
  };

  const downloadPasswordAsImage = () => {
    const element = ref.current;
    const style = `
    font-size: 18px;
    background-color: white;
    color: black;
    padding: 2rem;
    width:255px;
    height:250px
  `;
    element.style = style;

    htmlToImage.toPng(element).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "my-passwords.png";
      link.href = dataUrl;
      link.click();
    });
  };

  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <React.Fragment>
      {!isUploading ? (
        <BootstrapDialog
          aria-labelledby="customized-dialog-title"
          open={open}
          sx={{ padding: "0" }}
          maxWidth="xl"
        >
          <BootstrapDialogTitle
            onClose={handleCloseModal}
            id="customized-dialog-title"
          >
            <MUI.BoxUploadTitle>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="span">Upload files</Typography>
                <Typography
                  variant=""
                  sx={{
                    fontSize: "0.7rem !important",
                    fontWeight: 300,
                  }}
                >
                  Max file size 10GB/file available for unlimited time
                </Typography>
              </Box>
            </MUI.BoxUploadTitle>
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <MUI.BoxLimitTimeAndLock sx={{ padding: "0.8rem" }}>
              <MUI.BoxLimitTime
                sx={{ width: hidePasswordLink ? "50%" : "100%" }}
              >
                <Typography variant="span">Auto delete file</Typography>
                <FormControl fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    sx={{
                      width: "95%",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                    }}
                    size="small"
                    value={expired?.productKey}
                    onChange={(e) => {
                      const dataExp = dataExpires?.find(
                        (exp) => exp?.productKey === e.target.value,
                      );

                      if (!!dataExp) {
                        setExpired({
                          title: dataExp.title,
                          productKey: dataExp.productKey,
                          action: dataExp.action,
                        });
                      }
                    }}
                    fullWidth
                    variant="standard"
                  >
                    {dataExpires?.map((data, index) => {
                      return (
                        <MenuItem key={index} value={data?.productKey}>
                          <React.Fragment>
                            {data?.productKey === autoProductKey ? (
                              "Auto delete"
                            ) : (
                              <React.Fragment>
                                {data?.action} {data?.title}
                              </React.Fragment>
                            )}
                          </React.Fragment>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </MUI.BoxLimitTime>

              {/* Gen password link */}
              {hidePasswordLink && (
                <MUI.BoxDownloadLinkPassword>
                  <Typography variant="span">
                    <AttachFileIcon
                      sx={{ fontSize: "14px", color: "#17766B" }}
                    />
                    &nbsp;Link password
                  </Typography>
                  <MUI.BoxTextFieldAndLockIcon>
                    <MUI.textFieldViewLink
                      id="special-input"
                      variant="standard"
                      size="small"
                      value={passwords["special"] || ""}
                      InputProps={{
                        sx: {
                          fontSize: "0.8rem",
                        },
                      }}
                    />
                    {primaryLock ? (
                      <LockIcon
                        sx={{
                          color: "#17766B",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                        }}
                        onClick={primaryLockHandler}
                      />
                    ) : (
                      <LockOpenIcon
                        sx={{ cursor: "pointer", fontSize: "1.2rem" }}
                        onClick={primaryLockHandler}
                      />
                    )}
                  </MUI.BoxTextFieldAndLockIcon>
                </MUI.BoxDownloadLinkPassword>
              )}
            </MUI.BoxLimitTimeAndLock>
            <MUI.BoxNumberOfSelectedFile sx={{ padding: "0rem 0.8rem" }}>
              <strong style={{ fontSize: "0.8rem" }}>
                Your {filesArray?.length} files are ready to upload
              </strong>
            </MUI.BoxNumberOfSelectedFile>
            {filesArray?.map((item, index) => (
              <MUI.BoxShowFiles sx={{ padding: "0.3rem 0.7rem" }} key={index}>
                <MUI.BoxShowFileDetail>
                  {!passwords[item.id] ? (
                    !isMobile && (
                      <MUI.BoxShowFileName>
                        <MUI.BoxShowFileIcon>
                          <FileIcon
                            extension={GetFileType(item.name)}
                            {...defaultStyles[GetFileType(item.name)]}
                          />
                        </MUI.BoxShowFileIcon>
                        &nbsp;&nbsp;&nbsp;
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "start",
                            justifyContent: "start",
                            flexDirection: "column",
                            [theme.breakpoints.down("sm")]: {
                              marginLeft: "0",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "row",
                            },
                          }}
                        >
                          <Typography
                            variant=""
                            sx={{ fontSize: "0.8rem !important" }}
                          >
                            {cutFileName(item.name, 10)}
                          </Typography>
                          <Typography
                            variant=""
                            sx={{ fontSize: "0.7rem !important" }}
                          >
                            ({ConvertBytetoMBandGB(item.size)})
                          </Typography>
                        </Box>
                      </MUI.BoxShowFileName>
                    )
                  ) : isMobile ? (
                    <MUI.BoxShowFileName>
                      <MUI.BoxShowFileIcon>
                        <FileIcon
                          extension={GetFileType(item.name)}
                          {...defaultStyles[GetFileType(item.name)]}
                        />
                      </MUI.BoxShowFileIcon>
                      &nbsp;&nbsp;
                      <Typography
                        variant=""
                        sx={{
                          fontSize: "0.8rem !important",
                        }}
                      >
                        {cutFileName(item.name, 10)}
                      </Typography>
                      &nbsp;
                      <Typography
                        variant=""
                        sx={{
                          fontSize: "0.7rem !important",
                          color: "#17766B",
                        }}
                      >
                        ({ConvertBytetoMBandGB(item.size)})
                      </Typography>
                    </MUI.BoxShowFileName>
                  ) : (
                    <MUI.BoxShowFileName>
                      <MUI.BoxShowFileIcon>
                        <FileIcon
                          extension={GetFileType(item.name)}
                          {...defaultStyles[GetFileType(item.name)]}
                        />
                      </MUI.BoxShowFileIcon>
                      &nbsp;&nbsp;&nbsp;
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "start",
                          justifyContent: "start",
                          flexDirection: "column",
                          [theme.breakpoints.down("sm")]: {
                            marginLeft: "0",
                            alignItems: "center",
                            justifyContent: "center",
                            // flexDirection: "row",
                          },
                        }}
                      >
                        <Typography
                          variant=""
                          sx={{
                            fontSize: "0.8rem !important",
                          }}
                        >
                          {cutFileName(item.name, 10)}
                        </Typography>
                        <Typography
                          variant=""
                          sx={{ fontSize: "0.7rem !important" }}
                        >
                          ({ConvertBytetoMBandGB(item.size)})
                        </Typography>
                      </Box>
                    </MUI.BoxShowFileName>
                  )}
                </MUI.BoxShowFileDetail>

                <MUI.BoxShowLockFile>
                  {passwords[item.id] ? (
                    <MUI.textFieldLockSingleFile
                      id="standard-basic"
                      variant="standard"
                      size="small"
                      value={passwords[item.id] || ""}
                      InputProps={{
                        sx: {
                          fontSize: "0.8rem",
                        },
                      }}
                      onChange={() =>
                        handlePasswordChange(item.id, passwords[item.id] || "")
                      }
                    />
                  ) : isMobile ? (
                    <MUI.BoxShowFileName
                      style={{
                        width: "80%",
                      }}
                    >
                      <MUI.BoxShowFileIcon>
                        <FileIcon
                          extension={GetFileType(item.name)}
                          {...defaultStyles[GetFileType(item.name)]}
                        />
                      </MUI.BoxShowFileIcon>
                      &nbsp;
                      <Box
                        sx={{
                          [theme.breakpoints.down("sm")]: {
                            display: "flex",
                            alignItems: "start",
                            justifyContent: "start",
                            flexDirection: "column",
                          },
                        }}
                      >
                        <Typography
                          variant=""
                          sx={{
                            fontSize: "0.8rem",
                          }}
                        >
                          {cutFileName(item.name, 10)}
                        </Typography>
                        <Typography
                          variant=""
                          sx={{
                            fontSize: "0.7rem",
                            color: "#17766B",
                          }}
                        >
                          ({ConvertBytetoMBandGB(item.size)})
                        </Typography>
                      </Box>
                    </MUI.BoxShowFileName>
                  ) : (
                    <div style={{ width: "100px" }}></div>
                  )}
                  {/* Gen key */}
                  {hideSubPasswordLink && (
                    <IconButton
                      onClick={() => {
                        handleButtonClick(item.id);
                        childLockHandler(item.id);
                      }}
                    >
                      {childLock[item.id] ? (
                        <LockIcon
                          sx={{ color: "#17766B", fontSize: "1.2rem" }}
                        />
                      ) : (
                        <LockOpenIcon sx={{ fontSize: "1.2rem" }} />
                      )}
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleGetBackId(item.id - 1)}>
                    <Delete sx={{ fontSize: "1.2rem" }} />
                  </IconButton>
                </MUI.BoxShowLockFile>
              </MUI.BoxShowFiles>
            ))}

            <MUI.BoxUploadAndReset sx={{ padding: "0.2rem 0.8rem" }}>
              <Button
                startIcon={<Upload />}
                autoFocus
                sx={{
                  color: "#17766B",
                  fontSize: "0.75rem",
                }}
                {...selectMore}
                size="small"
              >
                Select More
              </Button>
              &nbsp;&nbsp; &nbsp;&nbsp;
              <Button
                startIcon={<RestartAltIcon />}
                autoFocus
                sx={{
                  fontSize: "0.75rem",
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
              startIcon={<Upload />}
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
        <BootstrapDialog
          onClose={() => {}}
          aria-labelledby="customized-dialog-title"
          open={open}
          sx={{ padding: "1rem" }}
        >
          <MUI.BoxProgressHeader>
            <Typography variant="" sx={{ fontSize: "1rem" }}>
              Uploading in progress...
            </Typography>
            {checkUpload ? (
              <>
                <IconButton
                  onClick={() => {
                    setIsDone(1);
                  }}
                >
                  <CloseIcon sx={{ fontSize: "25px" }} />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton onClick={handleCloseAndDeleteFile}>
                  <CloseIcon sx={{ fontSize: "25px" }} />
                </IconButton>
              </>
            )}
          </MUI.BoxProgressHeader>
          <DialogContent sx={{ paddingBottom: "2rem" }}>
            <MUI.BoxUploadProgress>
              <div style={{ marginLeft: 8, width: 100, height: 100 }}>
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
              </div>

              <MUI.BoxUploadProgressDetail>
                <Typography
                  variant=""
                  sx={{ fontSize: "0.9rem !important", fontWeight: 600 }}
                >
                  Sending {filesArray.length} files in progress,
                  {ConvertBytetoMBandGB(dataSizeAll)} in total
                </Typography>
                <Typography variant="" sx={{ fontSize: "0.7rem" }}>
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
                      {cutFileName(data?.name, 10)}
                    </Typography>
                    <Typography
                      variant=""
                      sx={{
                        fontSize: "0.7rem !important",
                        color: "#17766B",
                      }}
                    >
                      ({ConvertBytetoMBandGB(data?.size)})
                    </Typography>
                  </MUI.BoxFilesName>
                </MUI.BoxUploadFileDetail>
                <Box sx={{ marginLeft: "1.5rem" }}>
                  {uploadStatus[index] ? (
                    <DownloadDoneIcon size={16} color="success" />
                  ) : (
                    <CircularProgress size={16} color="success" />
                  )}
                </Box>
              </MUI.BoxUploadFiles>
            ))}
            <br />
          </DialogContent>
        </BootstrapDialog>
      ) : isDone === 1 ? (
        <BootstrapDialog
          onClose={handleCloseModal}
          aria-labelledby="customized-dialog-title"
          open={open}
          sx={{ padding: "1rem 0" }}
        >
          <MUI.BoxProgressHeader>
            <Typography
              variant=""
              sx={{
                fontSize: "1rem",
                [theme.breakpoints.down("sm")]: {
                  marginLeft: "1rem",
                },
              }}
            >
              All done!
            </Typography>
            <IconButton
              onClick={() => {
                setIsDone(2);
                setIsUploading(true);
                _functionResetValue();
              }}
            >
              <CloseIcon sx={{ fontSize: "25px" }} />
            </IconButton>
          </MUI.BoxProgressHeader>
          <DialogContent>
            <MUI.BoxUploadDoneTitle>
              <Typography variant="h5">
                <CheckIcon sx={{ color: "#0F6C61" }} />
                &nbsp;{filesArray.length} files uploaded,{" "}
                {ConvertBytetoMBandGB(dataSizeAll)} in total
              </Typography>
            </MUI.BoxUploadDoneTitle>
            {information?.every((obj) => obj.password == "") &&
            information?.every((obj) => obj.URLpassword == "") ? (
              ""
            ) : (
              <MUI.BoxShowAndCopyPassword>
                <Box ref={ref}>
                  {information[0].URLpassword && (
                    <h5>
                      <strong>Download link password:</strong>&nbsp;
                      {information[0].URLpassword}
                    </h5>
                  )}
                  <h5>
                    {!information?.every((obj) => obj.password == "") && (
                      <strong>Files password:</strong>
                    )}
                  </h5>
                  {information?.map((val, index) => (
                    <Box key={index}>
                      {val.password && (
                        <Typography variant="p" sx={{ fontSize: "1rem" }}>
                          {index + 1}.&nbsp;&nbsp;{val.name}:{" "}
                          <strong> {val.password}</strong>
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
                <MUI.buttonCopyPasswordDetail
                  // disabled={passwordCopied}
                  onClick={downloadPasswordAsImage}
                >
                  Download
                </MUI.buttonCopyPasswordDetail>
              </MUI.BoxShowAndCopyPassword>
            )}

            <MUI.BoxUploadDoneBody>
              <MUI.BoxUploadDoneContent>
                <MUI.BoxCopyDownloadLink>
                  <Typography
                    variant=""
                    sx={{
                      fontSize: "0.8rem",
                      [theme.breakpoints.down("sm")]: {
                        marginTop: "0.5rem",
                      },
                    }}
                  >
                    Download link:
                  </Typography>
                  <MUI.BoxShowDownloadLink>
                    <input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      style={{
                        border: "none",
                        outline: "none",
                        backgroundColor: "#E9E9E9",
                        width: "40ch",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    />
                    {copied ? (
                      <TaskAltIcon sx={{ color: "#17766B" }} />
                    ) : (
                      <CopyToClipboard
                        text={value}
                        onCopy={handleCopy}
                        sx={{ cursor: "copy" }}
                      >
                        <ContentCopyIcon />
                      </CopyToClipboard>
                    )}
                  </MUI.BoxShowDownloadLink>
                  {copied && successMessage("Copied download link", 3000)}
                </MUI.BoxCopyDownloadLink>
                <MUI.BoxShareToSocialMedia>
                  <Typography variant="h5">
                    Share download link to social media:
                  </Typography>
                  <MUI.BoxShowSocialMedia sx={{ width: "90%" }}>
                    <MUI.BoxShowIcon onClick={() => _shareEmail()}>
                      <EmailIcon />
                      <Typography variant="h6">Email</Typography>
                    </MUI.BoxShowIcon>
                    <MUI.BoxShowIcon onClick={() => _shareWhatsapp()}>
                      <WhatsAppIcon />
                      <Typography variant="h6">WhatsApp</Typography>
                    </MUI.BoxShowIcon>
                    <MUI.BoxShowIcon onClick={() => _shareFacebook()}>
                      <FacebookIcon />
                      <Typography variant="h6">Facebook</Typography>
                    </MUI.BoxShowIcon>
                    <MUI.BoxShowIcon onClick={() => _shareTelegrame()}>
                      <TelegramIcon />
                      <Typography variant="h6">Telegram</Typography>
                    </MUI.BoxShowIcon>
                  </MUI.BoxShowSocialMedia>
                </MUI.BoxShareToSocialMedia>
              </MUI.BoxUploadDoneContent>
              <MUI.BoxUploadDoneQR>
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  <QRCode
                    id="qr-code-canvas"
                    value={value}
                    size={200}
                    level="H"
                    fgColor="#000000"
                    bgColor="#FFFFFF"
                    renderAs="canvas"
                  />
                  <img
                    src={imageIcon}
                    alt="icon"
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "50px",
                      height: "40px",
                    }}
                  />
                </div>
                <Button
                  sx={{
                    background: "#ffffff",
                    color: "#17766B",
                    fontSize: "14px",
                    padding: "2px 2rem",
                    borderRadius: "6px",
                    border: "1px solid #17766B",
                    "&:hover": {
                      border: "1px solid #17766B",
                      color: "#17766B",
                    },
                    margin: "1rem 0",
                  }}
                  onClick={() => downloadQR()}
                >
                  Download
                </Button>
              </MUI.BoxUploadDoneQR>
            </MUI.BoxUploadDoneBody>
          </DialogContent>
        </BootstrapDialog>
      ) : null}
    </React.Fragment>
  );
}
