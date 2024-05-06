import { useLazyQuery, useMutation } from "@apollo/client";
import { styled } from "@mui/material/styles";
import CryptoJS from "crypto-js";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileIcon, defaultStyles } from "react-file-icon";

// components and function
import axios from "axios";
import { NavLink } from "react-router-dom";
import { errorMessage, successMessage } from "../../../../components/Alerts";
import {
  ConvertBytetoMBandGB,
  CutfileName,
  GetFileType,
} from "../../../../functions";
import ShowFiledropDialog from "../components/ShowFiledropDialog";
import * as Mui from "../css/style";
import ResponsiveAppBar from "../home/Appbar";
import Footer from "../home/Footer";
import {
  CREATED_DETAIL_ADVERTISEMENTS,
  QUERY_ADVERTISEMENTS,
  QUERY_FILE_DROP_PUBLIC,
  QUERY_GENERAL_BUTTON_DOWNLOADS,
  QUERY_USER_BY_FILE_DROP_URL,
  UPDATE_FILE_DROP_STATUS,
} from "./apollo";

// material ui
import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";

const FiledropContainer = styled(Container)({
  marginTop: "5rem",
  textAlign: "center",
  padding: "4rem 0",
});

const ShowFilesDetail = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.5rem",
  borderRadius: "5px",
  margin: "0.5rem 0",
});

const UploadArea = styled(Box)(({ theme }) => ({
  padding: "4rem 2rem",
  borderRadius: "6px",
  background: "#ECF4F3",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  p: {
    color: "#4B465C",
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "2.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "2rem 1rem",
    p: {
      fontSize: "0.8rem",
    },
  },
}));

const ExpiredArea = styled(Box)(({ theme }) => ({
  marginTop: "5rem",
  padding: "10rem 0",
  textAlign: "center",
  h1: { margin: 0, color: "#5D596C" },
  h4: { margin: "0.5rem 0", color: "#6F6B7D" },
  [theme.breakpoints.down("sm")]: {
    padding: "5rem 1rem",
    h1: {
      fontSize: "18px",
    },
  },
}));

function FileDropDownload() {
  const theme = createTheme();
  const [clickUpload, setClickUpload] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [queryFile, setQueryFile] = React.useState([]);
  const [userId, setUserId] = React.useState(0);
  const [newName, setNewName] = React.useState("");
  const [folderId, setFolderId] = React.useState(null);
  const [dataIp, setDataIP] = useState("");
  const [path, setPath] = React.useState("");
  const [newPath, setNewPath] = React.useState("");
  const [folderNewName, setFolderNewName] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [getActionButton, setGetActionButton] = React.useState();
  const [getAdvertisemment, setGetAvertisement] = React.useState([]);
  const [usedAds, setUsedAds] = useState([]);
  const [lastClickedButton, setLastClickedButton] = useState([]);
  const [totalClickCount, setTotalClickCount] = useState(0);
  const [isHide, setIsHide] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [getDataButtonDownload, { data: getDataButtonDL }] = useLazyQuery(
    QUERY_GENERAL_BUTTON_DOWNLOADS,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const [createDetailAdvertisement] = useMutation(
    CREATED_DETAIL_ADVERTISEMENTS,
  );

  const [getAdvertisement, { data: getDataAdvertisement }] = useLazyQuery(
    QUERY_ADVERTISEMENTS,
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const [getFileDrop, { data: filesData, refetch }] = useLazyQuery(
    QUERY_FILE_DROP_PUBLIC,
  );
  const [getUserByDropUrl, { data: dropData }] = useLazyQuery(
    QUERY_USER_BY_FILE_DROP_URL,
  );
  const [updateFileStatus] = useMutation(UPDATE_FILE_DROP_STATUS);
  const currentUrl = window.location.href;
  const data = [];
  const BUNNY_STORAGE_ZONE = process.env.REACT_APP_STORAGE_ZONE;
  const ACCESS_KEY = process.env.REACT_APP_ACCESSKEY_BUNNY;

  useEffect(() => {
    getDataButtonDownload({
      variables: {
        where: {
          groupName: "file_seeting_landing_page",
          productKey: "ASALPAS",
        },
      },
    });
    getAdvertisement({
      where: {
        status: "active",
      },
    });
    if (getDataButtonDL?.general_settings?.data[0]) {
      setGetActionButton(getDataButtonDL?.general_settings?.data[0]?.action);
    }
    if (getDataAdvertisement?.getAdvertisement?.data[0]) {
      setGetAvertisement(getDataAdvertisement?.getAdvertisement?.data);
    }
  }, [getDataButtonDL, getDataAdvertisement]);

  const handleDownloadFile = async (e, index, _id, filename, newFilename) => {
    if (lastClickedButton?.includes(_id.toString())) {
      e.preventDefault();
      const changeFilename = CutfileName(filename, newFilename);
      try {
        setIsHide((prev) => ({
          ...prev,
          [index]: true,
        }));
        const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
        const headers = {
          accept: "*/*",
          storageZoneName: BUNNY_STORAGE_ZONE,
          isFolder: false,
          path: "public/" + newFilename,
          fileName: CryptoJS.enc.Utf8.parse(newFilename),
          AccessKey: ACCESS_KEY,
        };
        const encryptedHeaders = CryptoJS.AES.encrypt(
          JSON.stringify(headers),
          secretKey,
        ).toString();
        const response = await fetch(process.env.REACT_APP_DOWNLOAD_URL, {
          headers: { encryptedHeaders },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = changeFilename;
        link.click();
        handleUpdateFileStatus(_id);
        successMessage("Download successful!!", 3000);
        setIsHide((prev) => ({
          ...prev,
          [index]: false,
        }));
        setIsSuccess((prev) => ({
          ...prev,
          [index]: true,
        }));
      } catch (error) {
        errorMessage("Something wrong try again!!", 2500);
      }
    } else {
      setTotalClickCount((prevCount) => prevCount + 1);
      if (totalClickCount >= getActionButton) {
        setLastClickedButton([...lastClickedButton, _id]);
        setTotalClickCount(0);
        e.preventDefault();
        const changeFilename = CutfileName(filename, newFilename);
        try {
          setIsHide((prev) => ({
            ...prev,
            [index]: true,
          }));
          const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
          const headers = {
            accept: "*/*",
            storageZoneName: BUNNY_STORAGE_ZONE,
            isFolder: false,
            path: "public/" + newFilename,
            fileName: CryptoJS.enc.Utf8.parse(newFilename),
            AccessKey: ACCESS_KEY,
          };

          const encryptedHeaders = CryptoJS.AES.encrypt(
            JSON.stringify(headers),
            secretKey,
          ).toString();

          const response = await fetch(process.env.REACT_APP_DOWNLOAD_URL, {
            headers: { encryptedHeaders },
          });

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = changeFilename;
          link.click();
          handleUpdateFileStatus(_id);
          successMessage("Download successful!!", 3000);
          setIsHide((prev) => ({
            ...prev,
            [index]: false,
          }));
          setIsSuccess((prev) => ({
            ...prev,
            [index]: true,
          }));
        } catch (error) {
          errorMessage("Something wrong try again!!", 2500);
        }
      } else {
        if (getAdvertisemment.length) {
          const availableAds = getAdvertisemment.filter(
            (ad) => !usedAds.includes(ad._id),
          );
          if (availableAds.length === 0) {
            setUsedAds([]);
            return;
          }
          const randomIndex = Math.floor(Math.random() * availableAds.length);
          const randomAd = availableAds[randomIndex];
          setUsedAds([...usedAds, randomAd._id]);
          try {
            const responseIp = await axios.get("https://load.vshare.net/getIP");
            const _createDetailAdvertisement = await createDetailAdvertisement({
              variables: {
                data: {
                  ip: String(responseIp?.data),
                  advertisementsID: randomAd?._id,
                },
              },
            });
            if (
              _createDetailAdvertisement?.data?.createDetailadvertisements?._id
            ) {
              window.open(randomAd.url, "_blank");
            }
          } catch (error) {
            errorMessage("Something wrong try again later!", 2000);
          }
        } else {
          e.preventDefault();
          const changeFilename = CutfileName(filename, newFilename);
          try {
            setIsHide((prev) => ({
              ...prev,
              [index]: true,
            }));
            const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
            const headers = {
              accept: "*/*",
              storageZoneName: BUNNY_STORAGE_ZONE,
              isFolder: false,
              path: "public/" + newFilename,
              fileName: CryptoJS.enc.Utf8.parse(newFilename),
              AccessKey: ACCESS_KEY,
            };

            const encryptedHeaders = CryptoJS.AES.encrypt(
              JSON.stringify(headers),
              secretKey,
            ).toString();

            const response = await fetch(process.env.REACT_APP_DOWNLOAD_URL, {
              headers: { encryptedHeaders },
            });

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = changeFilename;
            link.click();
            handleUpdateFileStatus(_id);
            successMessage("Download successful!!", 3000);
            setIsHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsSuccess((prev) => ({
              ...prev,
              [index]: true,
            }));
          } catch (error) {
            errorMessage("Something wrong try again!!", 2500);
          }
        }
      }
    }
  };

  async function getDataIP() {
    const result = await axios.get("https://load.vshare.net/getIP");

    const resData = await result.data;
    setDataIP(resData);
  }

  useEffect(() => {
    getDataIP();
  }, []);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
      setOpen(true);
    },
    [files],
  );

  React.useEffect(() => {
    getFileDrop({
      variables: {
        where: {
          dropUrl: currentUrl,
          ip: dataIp,
        },
      },
    });
    if (filesData?.getFileDrop?.total == null) {
      setQueryFile([]);
    } else {
      setQueryFile(filesData?.getFileDrop?.data);
    }
  }, [filesData]);

  React.useEffect(() => {
    getUserByDropUrl({
      variables: {
        where: {
          url: currentUrl,
        },
      },
    });
    const item = dropData?.getPublicFileDropUrl?.data[0];
    if (item?.status == "expired") {
      setStatus(item?.status);
    }
    if (item?.createdBy?._id > 0) {
      setUserId(item?.createdBy?._id);
      setNewName(item?.createdBy?.newName);
      setFolderId(item?.folderId?._id);
      setPath(item?.folderId?.path);
      setNewPath(item?.folderId?.newPath);
      setFolderNewName(item?.folderId?.newFolder_name);
    }
  }, [dropData]);

  const handleClose = (value) => {
    setOpen(value);
  };

  const handleRemoveAll = () => {
    setFiles([]);
    handleClose();
    refetch();
  };

  const handleDelete = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpdateFileStatus = async (_id) => {
    try {
      await updateFileStatus({
        variables: {
          data: {
            dropStatus: "closed",
          },
          where: {
            _id: _id,
          },
        },
      });
    } catch (error) {
      errorMessage("Something wrong. Try again later!", 2000);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <React.Fragment>
      <ResponsiveAppBar />
      {status == "expired" ? (
        <ExpiredArea>
          <Box
            sx={{
              textAlign: "center",
              fontSize: "1.2rem",
              fontWeight: 700,
              [theme.breakpoints.down("sm")]: {
                fontSize: "1rem",
              },
            }}
          >
            Unfortunately, the link you requested has expired.
          </Box>
          <Box
            sx={{
              textAlign: "center",
              fontSize: "0.9rem",
              margin: "0.5rem 0",
              fontWeight: 500,
            }}
          >
            You do not have permission to view this page using the credentials
            that you have provided while login.
          </Box>
          <Box
            sx={{ textAlign: "center", fontSize: "0.9rem", fontWeight: 500 }}
          >
            Please contact your site administrator.
          </Box>
          <Button
            variant="contained"
            component={NavLink}
            to="/filedrop-page"
            sx={{ mt: 4 }}
          >
            Create new
          </Button>
          <br />
        </ExpiredArea>
      ) : (
        <FiledropContainer
          sx={{
            [theme.breakpoints.down("sm")]: {
              padding: "0 1rem",
            },
          }}
        >
          <UploadArea>
            <Typography component="p">Upload your files here!</Typography>
            <Mui.BoxShowUploadDetail {...getRootProps()}>
              <Box
                sx={{
                  padding: "0.5rem",
                  borderRadius: "6px",
                  background: "#DFE6E7",
                }}
              >
                <FileUploadOutlinedIcon
                  sx={{ fontSize: "30px", color: "#5D596C" }}
                />
              </Box>

              <Box className="box-drag" sx={{ mt: 4, mb: 2 }}>
                <Typography component="span">
                  Drag and drop your files here to upload
                </Typography>
              </Box>
              <Mui.ButtonUpload
                variant="contained"
                onClick={() => {
                  setOpen(true);
                  setClickUpload(!clickUpload);
                }}
                startIcon={
                  <FileUploadOutlinedIcon
                    sx={{ color: "#fff", verticalAlign: "middle" }}
                  />
                }
              >
                Select files
                <input {...getInputProps()} hidden={true} />
              </Mui.ButtonUpload>
            </Mui.BoxShowUploadDetail>
            {files.map((file, index) => {
              const newFile = new File([file.data], file.name, {
                type: file.type,
              });
              newFile.id = (index + 1).toString();
              newFile.path = file.path;
              newFile.sizeFile = file.size;
              const updatedFile = { file: newFile };
              data.push(updatedFile);
            })}
            {data.length > 0 ? (
              <ShowFiledropDialog
                open={open}
                files={data}
                onClose={handleClose}
                onDeleteData={handleDelete}
                selectMore={{ ...getRootProps() }}
                onRemoveAll={handleRemoveAll}
                dataFile={files}
                openModal={clickUpload}
                checkSend={() => setFiles([])}
                userId={userId}
                newName={newName}
                folderId={folderId}
                folderNewname={folderNewName}
                path={path}
                newPath={newPath}
              />
            ) : (
              ""
            )}
          </UploadArea>
          {queryFile?.length > 0 ? (
            <>
              <Box
                sx={{
                  color: "#4B465C",
                  margin: "2rem 0 0.5rem 0",
                  fontSize: "1.1rem",
                  textAlign: "start",
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "0.8rem",
                  },
                }}
              >
                Anyone with the link will be able to access your file.
              </Box>
              <Box
                sx={{
                  boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                  borderRadius: "6px",
                  padding: "2rem",
                  [theme.breakpoints.down("sm")]: {
                    marginBottom: "2rem",
                  },
                }}
              >
                {queryFile?.map((val, index) => (
                  <ShowFilesDetail key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ width: "25px", mr: 2 }}>
                        <FileIcon
                          color="white"
                          extension={GetFileType(val.filename)}
                          {...{ ...defaultStyles[GetFileType(val.filename)] }}
                        />
                      </Box>
                      <Box sx={{ textAlign: "start" }}>
                        <span>
                          {CutfileName(val.filename, val.newFilename)}
                        </span>
                        <br />
                        <span>{ConvertBytetoMBandGB(val.size)}</span>
                      </Box>
                    </Box>
                    {userId > 0 ? (
                      ""
                    ) : (
                      <Box>
                        {isSuccess[index] ? (
                          <FileDownloadDoneIcon sx={{ color: "#17766B" }} />
                        ) : isHide[index] ? (
                          <CircularProgress
                            color="success"
                            sx={{ color: "#17766B" }}
                            size={isMobile ? "18px" : "22px"}
                          />
                        ) : (
                          <Tooltip title="Download" placement="top">
                            <IconButton
                              onClick={(e) =>
                                handleDownloadFile(
                                  e,
                                  index,
                                  val?._id,
                                  val?.filename,
                                  val?.newFilename,
                                )
                              }
                            >
                              <DownloadIcon
                                sx={{ ":hover": { color: "#17766B" } }}
                              />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    )}
                  </ShowFilesDetail>
                ))}
              </Box>
            </>
          ) : (
            ""
          )}
        </FiledropContainer>
      )}
      <Footer />
    </React.Fragment>
  );
}

export default FileDropDownload;
