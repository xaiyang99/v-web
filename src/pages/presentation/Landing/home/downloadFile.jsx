import { useLazyQuery, useMutation } from "@apollo/client";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import streamSaver from "streamsaver";

// components
import { errorMessage, successMessage } from "../../../../components/Alerts";
import {
  ConvertBytetoMBandGB,
  CutfileName,
  truncateName,
} from "../../../../functions";
import { cutFileName } from "../../../../utils/limitTextLenght";
import { QUERY_DESC_FOLDER } from "../../../client-dashboard/clound/apollo";
import {
  QUERY_FILE_PUBLIC,
  QUERY_FILE_PUBLIC_LINK,
  QUERY_FOLDER_PUBLIC_LINK,
} from "../components/apollo";
import * as MUI from "../css/style";
import "../css/style.css";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CryptoJS from "crypto-js";
import { Base64Decode } from "../../../../base64-file";
import DialogPreviewQRcode from "../../../dashboards/components/DialogPreviewQRcode";
import useManageSetting from "../../../dashboards/settings/hooks/useManageSetting";
import CardFileDownload from "../components/CardFileDownload";
import FolderDownloadComponent from "../components/FolderDownload";
import {
  CREATED_DETAIL_ADVERTISEMENT,
  QUERY_ADVERTISEMENT,
  QUERY_GENERAL_BUTTON_DOWNLOAD,
  QUERY_USER,
} from "./apollo";
import ConfirmQRCodeDialog from "./confirmQRCodeDialog";

function DownloadFile() {
  const location = useLocation();
  const [checkConfirmPassword, setConfirmPassword] = useState(false);
  const [getDataRes, setGetDataRes] = useState(null);
  const [folderDownload, setFolderDownload] = useState(null);
  const [folderSize, setFolderSize] = useState(0);
  const [folderType, setFolderType] = useState("");
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = useState("");
  const [filePasswords, setFilePasswords] = useState("");
  const [getNewFileName, setGetNewFileName] = useState("");
  const [fileQRCodePassword, setFileQRCodePassword] = useState("");
  const [getFileName, setGetFileName] = useState("");
  const [checkModal, setCheckModal] = useState(false);
  const [getFilenames, setGetFilenames] = useState("");
  const [getFolderName, setGetFolderName] = useState("");
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [isVerifyQrCode, setIsVerifyQRCode] = useState(false);
  const [fileUrl, setFileUrl] = React.useState("");
  const [getActionButton, setGetActionButton] = React.useState();
  const [getAdvertisemment, setGetAvertisement] = React.useState([]);
  const [usedAds, setUsedAds] = useState([]);
  const [lastClickedButton, setLastClickedButton] = useState([]);
  const [totalClickCount, setTotalClickCount] = useState(0);
  const [isHide, setIsHide] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dataValue, setDataValue] = useState(null);

  const params = new URLSearchParams(location.search);
  const linkValue = params.get("l");
  const urlClient = params.get("lc");
  const userqrcode = params.get("qr");
  const currentURL = window.location.href;
  const SECRET_KEY = process.env.REACT_APP_BUNNY_SECRET_KEY;
  const ACCESS_KEY = process.env.REACT_APP_ACCESSKEY_BUNNY;
  const BUNNY_STORAGE_ZONE = process.env.REACT_APP_STORAGE_ZONE;
  const BUNNY_STORAGE_PULL_ZONE = process.env.REACT_APP_BUNNY_PULL_ZONE;
  const ENCODE_KEY = process.env.REACT_APP_ENCODE_KEY;

  // const [qrcodeUser, setQrcodeUser] = useState([]);
  const [index, setIndex] = React.useState(null);
  const [hideDownload, seHideDownload] = useState(true);
  const [getData, { data: resPonData }] = useLazyQuery(QUERY_FILE_PUBLIC, {
    fetchPolicy: "cache-and-network",
  });

  const [getFileLink, { data: dataFileLink }] = useLazyQuery(
    QUERY_FILE_PUBLIC_LINK,
    {
      fetchPolicy: "cache-and-network",
    },
  );
  const [getFolderLink, { data: dataFolderLink }] = useLazyQuery(
    QUERY_FOLDER_PUBLIC_LINK,
  );

  const [getDataButtonDownload, { data: getDataButtonDL }] = useLazyQuery(
    QUERY_GENERAL_BUTTON_DOWNLOAD,
    {
      fetchPolicy: "cache-and-network",
    },
  );
  const [createDetailAdvertisement] = useMutation(CREATED_DETAIL_ADVERTISEMENT);
  const [getAdvertisement, { data: getDataAdvertisement }] = useLazyQuery(
    QUERY_ADVERTISEMENT,
    {
      fetchPolicy: "cache-and-network",
    },
  );
  const settingKeys = {
    downloadKey: "HDLABTO",
  };
  const useDataSetting = useManageSetting();
  const [getFolder, { data: isFolder }] = useLazyQuery(QUERY_DESC_FOLDER, {
    fetchPolicy: "cache-and-network",
  });
  const [getUser] = useLazyQuery(QUERY_USER, {
    fetchPolicy: "no-cache",
  });
  streamSaver.mitm = "/mitm.html";
  let linkClient = null;
  let linkClientData = "";

  let userData = { userId: "", newName: "" };

  try {
    if (urlClient) {
      linkClientData = urlClient?.split("-");
      userData = {
        userId: handleDecryptFile(linkClientData[1]),
        newName: linkClientData[2],
      };

      linkClient = handleDecryptFile(linkClientData[0]);
    }
  } catch (error) {}

  function handleDecryptFile(val) {
    // let decryptedData = JSON.parse(
    //   CryptoJS.AES.decrypt(decodeURIComponent(val), ENCODE_KEY).toString(
    //     CryptoJS.enc.Utf8,
    //   ),
    // );
    let decryptedData = JSON.parse(Base64Decode(val, ENCODE_KEY));
    return decryptedData;
  }
  function checkAppInstalled(schema, packageName) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = schema;
    document.body.appendChild(iframe);

    setTimeout(() => {
      document.body.removeChild(iframe);
      window.open(
        "https://play.google.com/store/apps/details?id=" + packageName,
      );
    }, 3000);
  }

  // get Download button
  useEffect(() => {
    function getDataSetting() {
      // Show download button
      const downloadData = useDataSetting.data?.find(
        (data) => data?.productKey === settingKeys.downloadKey,
      );
      if (!!downloadData) {
        if (downloadData?.status === "on") seHideDownload(false);
      }
    }

    getDataSetting();
  }, [useDataSetting.data]);

  // get User
  useEffect(() => {
    getUser({
      variables: {
        where: {
          newName: userqrcode,
        },
      },
      // onCompleted: (data) => {
      //   setQrcodeUser(data?.getUser?.data);
      // },
    });
  }, []);

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

  useEffect(() => {
    const getLinkData = async () => {
      try {
        if (!!linkClient?._id) {
          if (linkClient?.type === "file") {
            setIsLoading(true);
            await getFileLink({
              variables: {
                where: {
                  _id: linkClient?._id,
                },
              },
            });
            setTimeout(() => {
              setIsLoading(false);
            }, 500);

            if (dataFileLink?.queryFileGetLinks?.data) {
              setGetDataRes(dataFileLink?.queryFileGetLinks?.data || []);
            }
          } else {
            setIsLoading(true);
            await getFolderLink({
              variables: {
                where: {
                  _id: linkClient?._id,
                },
              },
            });
            setTimeout(() => {
              setIsLoading(false);
            }, 500);

            let folderData = dataFolderLink?.queryfoldersGetLinks?.data || [];
            if (folderData?.[0]?.status === "active") {
              setGetDataRes(folderData || []);
              setFolderDownload(folderData || []);

              if (folderData && folderData?.[0]?.folder_type) {
                setFolderType(folderData[0]?.folder_type);
                setFolderSize(folderData[0]?.total_size);
              }
            }
          }
        } else {
          setIsLoading(true);
          getData({
            variables: {
              where: {
                urlAll: linkValue ? String(linkValue) : null,
              },
            },
          });

          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          if (resPonData) {
            setGetDataRes(resPonData?.filesPublic?.data);
          }
        }
      } catch (error) {
        setIsLoading(false);
        errorMessage(error);
      }
    };

    getLinkData();
  }, [urlClient, linkValue, resPonData, dataFileLink, dataFolderLink]);

  useEffect(() => {
    const os = navigator.userAgent;
    const appPackageName = "com.vshare.app.client";
    const androidScheme = "http://vshare.app/download?url=" + currentURL;
    const iosScheme = "vshare.app://download?url=" + currentURL;
    try {
      if (os.match(/iPhone|iPad|iPod/i)) {
        window.open(iosScheme);
        // checkAppInstalled(customUrlSchema, appPackageName);
      } else if (os.match(/Android/i)) {
        window.open(androidScheme);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (getDataRes) {
      if (getDataRes[0]?.passwordUrlAll && !checkConfirmPassword) {
        handleClickOpen();
      }
    }
  }, [getDataRes]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const totalSize = getDataRes?.reduce((accumulator, current) => {
    return accumulator + parseInt(current.size);
  }, 0);

  // download folder
  const handleDownloadFolder = async () => {
    setTotalClickCount((prevCount) => prevCount + 1);
    if (totalClickCount >= getActionButton) {
      setTotalClickCount(0);
      let path = folderDownload[0]?.newPath ?? "";
      let folder_name = `${folderDownload[0]?.folder_name}.zip`;
      const secretKey = SECRET_KEY;
      setGetFolderName(folder_name);

      try {
        if (folderDownload[0]?.access_password) {
          handleClickOpen();
        } else {
          const headers = {
            _id: folderDownload[0]?._id,
            accept: "/",
            storageZoneName: BUNNY_STORAGE_ZONE,
            isFolder: true,
            path: userData.newName + "-" + userData.userId + "/" + path,
            fileName: CryptoJS.enc.Utf8.parse(folder_name),
            AccessKey: ACCESS_KEY,
          };
          const encryptedHeaders = CryptoJS.AES.encrypt(
            JSON.stringify(headers),
            secretKey,
          ).toString();
          const response = await fetch(process.env.REACT_APP_DOWNLOAD_URL, {
            headers: { encryptedHeaders },
          });
          const fileStream = streamSaver.createWriteStream(folder_name);
          response.body
            .pipeTo(fileStream)
            .then(() => {
              successMessage("Download successfull", 2000);
              setIsHide(false);
              setIsSuccess(true);
            })
            .catch((error) => {
              errorMessage(error, 2000);
            });
        }
      } catch (error) {
        errorMessage("Something wrong try again later!", 2000);
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
            let httpData = "";
            if (!randomAd.url.match(/^https?:\/\//i || /^http?:\/\//i)) {
              httpData = "http://" + randomAd.url;
            } else {
              httpData = randomAd.url;
            }

            let newWindow = window.open(httpData, "_blank");
            if (
              !newWindow ||
              newWindow.closed ||
              typeof newWindow.closed == "undefined"
            ) {
              window.location.href = httpData;
            }
          }
        } catch (error) {
          errorMessage("Something wrong try again later!", 2000);
        }
      } else {
        let path = folderDownload[0]?.newPath;
        let folder_name = `${folderDownload[0]?.folder_name}.zip`;
        setGetFolderName(folder_name);
        const secretKey = SECRET_KEY;
        try {
          if (folderDownload[0]?.access_password) {
            handleClickOpen();
          } else {
            setIsHide(true);
            const headers = {
              accept: "/",
              storageZoneName: BUNNY_STORAGE_ZONE,
              isFolder: true,
              path: userData.newName + "-" + userData.userId + "/" + path,
              fileName: CryptoJS.enc.Utf8.parse(folder_name),
              AccessKey: ACCESS_KEY,
              _id: folderDownload[0]?._id,
            };
            const encryptedHeaders = CryptoJS.AES.encrypt(
              JSON.stringify(headers),
              secretKey,
            ).toString();
            const response = await fetch(process.env.REACT_APP_DOWNLOAD_URL, {
              headers: { encryptedHeaders },
            });
            const fileStream = streamSaver.createWriteStream(folder_name);
            response.body
              .pipeTo(fileStream)
              .then(() => {
                successMessage("Download successfull", 2000);
                setIsHide(false);
                setIsSuccess(true);
              })
              .catch((error) => {
                errorMessage(error, 2000);
              });
          }
        } catch (error) {
          errorMessage(error, 2000);
        }
      }
    }
  };

  const _downloadFiles = async (
    index,
    buttonId,
    newFilename,
    filename,
    filePassword,
  ) => {
    setTotalClickCount((prevCount) => prevCount + 1);
    if (totalClickCount >= getActionButton) {
      setLastClickedButton([...lastClickedButton, buttonId]);
      setTotalClickCount(0);
      const changeFilename = CutfileName(filename, newFilename);

      let real_path;

      if (getDataRes[0].newPath === null) {
        real_path = "";
      } else {
        real_path = truncateName(getDataRes[0].newPath);
      }

      try {
        setFilePasswords(filePassword);
        setGetNewFileName(newFilename);
        setGetFileName(changeFilename);
        if (linkClient?._id) {
          if (filePassword) {
            handleClickOpen();
          } else {
            setIsHide((prev) => ({
              ...prev,
              [index]: true,
            }));

            const headers = {
              accept: "*/*",
              storageZoneName: BUNNY_STORAGE_ZONE,
              isFolder: false,
              path:
                userData?.newName +
                "-" +
                userData?.userId +
                "/" +
                real_path +
                newFilename,
              fileName: CryptoJS.enc.Utf8.parse(newFilename),
              AccessKey: ACCESS_KEY,
            };

            const encryptedHeaders = CryptoJS.AES.encrypt(
              JSON.stringify(headers),
              process.env.REACT_APP_BUNNY_SECRET_KEY,
            ).toString();
            const response = await fetch(process.env.REACT_APP_DOWNLOAD_URL, {
              headers: { encryptedHeaders },
            });
            const fileStream = streamSaver.createWriteStream(changeFilename);
            response.body
              .pipeTo(fileStream)
              .then(() => {
                successMessage("Download successful!!", 3000);
                setIsHide((prev) => ({
                  ...prev,
                  [index]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [index]: true,
                }));
              })
              .catch((error) => {
                errorMessage(error, 2000);
              });
          }
        } else {
          if (filePassword) {
            handleClickOpen();
          } else {
            setIsHide((prev) => ({
              ...prev,
              [index]: true,
            }));
            const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
            const headers = {
              accept: "*/*",
              storageZoneName: BUNNY_STORAGE_ZONE,
              isFolder: false,
              path: `public/${newFilename}`,
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

            const fileStream = streamSaver.createWriteStream(changeFilename);
            response.body
              .pipeTo(fileStream)
              .then(() => {
                successMessage("Download successful!!", 3000);
                setIsHide((prev) => ({
                  ...prev,
                  [index]: false,
                }));
                setIsSuccess((prev) => ({
                  ...prev,
                  [index]: true,
                }));
              })
              .catch((error) => {
                errorMessage(error, 2000);
              });
          }
        }
      } catch (error) {
        errorMessage(error, 2000);
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
            let httpData = "";
            // if (!randomAd.url.match(/^https?:\/\//i || /^http?:\/\//i)) {
            //   httpData = "http://" + randomAd.url;
            // }
            if (!randomAd.url.match(/^https?:\/\//i || /^http?:\/\//i)) {
              httpData = "http://" + randomAd.url;
            } else {
              httpData = randomAd.url;
            }

            let newWindow = window.open(httpData, "_blank");
            if (
              !newWindow ||
              newWindow.closed ||
              typeof newWindow.closed == "undefined"
            ) {
              window.location.href = httpData;
            }
          }
        } catch (error) {
          errorMessage(error, 2000);
        }
      } else {
        const changeFilename = CutfileName(filename, newFilename);
        let real_path;
        if (getDataRes[0].newPath === null) {
          real_path = "";
        } else {
          real_path = truncateName(getDataRes[0].newPath);
        }
        try {
          setFilePasswords(filePassword);
          setGetNewFileName(newFilename);
          setGetFileName(changeFilename);

          if (filePassword) {
            handleClickOpen();
          } else {
            if (linkClient?._id) {
              setIsHide((prev) => ({
                ...prev,
                [index]: true,
              }));
              const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
              const headers = {
                accept: "*/*",
                storageZoneName: BUNNY_STORAGE_ZONE,
                isFolder: false,
                path:
                  userData?.newName +
                  "-" +
                  userData?.userId +
                  "/" +
                  real_path +
                  newFilename,
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

              const fileStream = streamSaver.createWriteStream(changeFilename);
              response.body
                .pipeTo(fileStream)
                .then(() => {
                  successMessage("Download successful!!", 3000);
                  setIsHide((prev) => ({
                    ...prev,
                    [index]: false,
                  }));
                  setIsSuccess((prev) => ({
                    ...prev,
                    [index]: true,
                  }));
                })
                .catch((error) => {
                  errorMessage(error, 2000);
                });
            } else {
              setIsHide((prev) => ({
                ...prev,
                [index]: true,
              }));
              const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
              const headers = {
                accept: "*/*",
                storageZoneName: BUNNY_STORAGE_ZONE,
                isFolder: false,
                path: `public/${newFilename}`,
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

              const fileStream = streamSaver.createWriteStream(changeFilename);
              response.body
                .pipeTo(fileStream)
                .then(() => {
                  successMessage("Download successful!!", 3000);
                  setIsHide((prev) => ({
                    ...prev,
                    [index]: false,
                  }));
                  setIsSuccess((prev) => ({
                    ...prev,
                    [index]: true,
                  }));
                })
                .catch((error) => {
                  errorMessage(error, 2000);
                });
            }
          }
        } catch (error) {
          errorMessage("Something wrong try again later!", 2000);
        }
      }
    }
  };

  const _downloadFilesAll = async (getData) => {
    // setIsDownloadAll(true);
    let newFilename = null;
    let filename = null;
    let filePassword = null;
    const noPasswordData = getData.filter((item) => !item.filePassword);
    if (noPasswordData.length <= 0) {
      errorMessage("Download failed!", 3000);
      return;
    }
    const downloadPromises = [];
    setIsHide(true);
    for (const file of noPasswordData) {
      newFilename = file?.newFilename;
      filename = file?.filename;
      filePassword = file?.filePassword;
      const changeFilename = CutfileName(filename, newFilename);
      let real_path;
      if (getDataRes[0].path === null) {
        real_path = "";
      } else {
        real_path = truncateName(getDataRes[0].path);
      }
      try {
        setFilePasswords(filePassword);
        setGetNewFileName(newFilename);
        setGetFileName(changeFilename);
        if (linkClient?._id) {
          const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
          const headers = {
            accept: "*/*",
            storageZoneName: BUNNY_STORAGE_ZONE,
            isFolder: false,
            path: userData.username + "/" + real_path + newFilename,
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
          const fileStream = streamSaver.createWriteStream(changeFilename);
          const downloadPromise = new Promise((resolve, reject) => {
            response.body
              .pipeTo(fileStream)
              .then(() => {
                resolve();
              })
              .catch((error) => {
                errorMessage("Something wrong try again later!", 2000);
                reject(error);
              });
          });
          downloadPromises.push(downloadPromise);
        } else {
          if (filePassword) {
            handleClickOpen();
          } else {
            const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
            const headers = {
              accept: "*/*",
              storageZoneName: BUNNY_STORAGE_ZONE,
              isFolder: false,
              path: `public/${newFilename}`,
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
            const fileStream = streamSaver.createWriteStream(changeFilename);
            const downloadPromise = new Promise((resolve, reject) => {
              response.body
                .pipeTo(fileStream)
                .then(() => {
                  resolve();
                })
                .catch((error) => {
                  errorMessage("Something wrong try again later!", 2000);
                  reject(error);
                });
            });
            downloadPromises.push(downloadPromise);
          }
        }
      } catch (error) {
        errorMessage("Something wrong try again later!", 2000);
      }
    }
    await Promise.all(downloadPromises);
    successMessage("Download successful!!", 3000);
    setIsHide(false);
    setIsSuccess(true);
  };

  const _confirmPasword = async (password) => {
    if (!filePasswords) {
      const modifyPassword = CryptoJS.MD5(password).toString();
      const getPassword = getDataRes[0]?.passwordUrlAll;
      if (modifyPassword === getPassword) {
        setConfirmPassword(true);
        successMessage("Successful!!", 3000);
        handleClose();
      } else {
        errorMessage("Invalid password!!", 3000);
      }
    } else {
      const modifyPassword = CryptoJS.MD5(password).toString();
      const getPassword = filePasswords;

      if (modifyPassword === getPassword) {
        setConfirmPassword(true);
        setIsHide((prev) => ({
          ...prev,
          [index]: true,
        }));
        handleClose();
        const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
        let headers = null;
        if (linkClient?._id) {
          let real_path = "";
          if (getDataRes[0].newPath) {
            real_path = truncateName(getDataRes[0].newPath);
          }

          if (linkClient?.type === "folder") {
            let path = folderDownload[0]?.newPath ?? "";
            headers = {
              _id: folderDownload[0]?._id,
              accept: "/",
              storageZoneName: BUNNY_STORAGE_ZONE,
              isFolder: true,
              path: userData.newName + "-" + userData.userId + "/" + path,
              fileName: CryptoJS.enc.Utf8.parse(getFolderName),
              AccessKey: ACCESS_KEY,
            };
          } else {
            headers = {
              accept: "*/*",
              storageZoneName: BUNNY_STORAGE_ZONE,
              isFolder: false,
              path:
                userData?.newName +
                "-" +
                userData?.userId +
                "/" +
                real_path +
                getNewFileName,
              fileName: CryptoJS.enc.Utf8.parse(getNewFileName),
              AccessKey: ACCESS_KEY,
            };
          }
        } else {
          headers = {
            accept: "*/*",
            storageZoneName: BUNNY_STORAGE_ZONE,
            isFolder: false,
            path: `public/${getNewFileName}`,
            fileName: CryptoJS.enc.Utf8.parse(getNewFileName),
            AccessKey: ACCESS_KEY,
          };
        }
        const encryptedHeaders = CryptoJS.AES.encrypt(
          JSON.stringify(headers),
          secretKey,
        ).toString();
        const response = await fetch(process.env.REACT_APP_DOWNLOAD_URL, {
          headers: { encryptedHeaders },
        });
        const fileStream = streamSaver.createWriteStream(
          getFileName || getFolderName,
        );
        response.body
          .pipeTo(fileStream)
          .then(() => {
            successMessage("Download successful!!", 3000);
            setIsHide((prev) => ({
              ...prev,
              [index]: false,
            }));
            setIsSuccess((prev) => ({
              ...prev,
              [index]: true,
            }));
          })
          .catch((error) => {
            errorMessage(error, 2000);
          });
      } else {
        errorMessage("Invalid password!!", 3000);
      }
    }
  };

  const hasFileWithoutPassword = linkClient?._id
    ? linkClient?.type === "file"
      ? dataFileLink?.queryFileGetLinks?.data?.some(
          (item) => !item.filePassword,
        )
      : dataFolderLink?.queryfoldersGetLinks?.data?.some(
          (item) => !item.filePassword,
        )
    : resPonData?.filesPublic?.data?.some((item) => !item.filePassword);

  const previewHandleClose = () => {
    setPreviewOpen(false);
  };

  function handleOpenVerifyQRCode() {
    setIsVerifyQRCode(true);
  }

  function handleSuccessQRCode() {
    setTimeout(() => {
      setPreviewOpen(true);
    }, 200);
  }

  function handleCloseVerifyQRCode() {
    setFileQRCodePassword("");
    setIsVerifyQRCode(false);
  }

  const handleQRGeneration = (e, file) => {
    e.preventDefault();

    let fileDataUrl = "";
    setDataValue(file);
    if (linkClient?._id) {
      if (file?.checkFile === "main") {
        fileDataUrl =
          BUNNY_STORAGE_PULL_ZONE +
          `${userData.newName}-${userData.userId}/${file?.newFilename}`;
      } else {
        fileDataUrl =
          BUNNY_STORAGE_PULL_ZONE +
          `${userData.newName}-${userData.userId}/${file?.newPath}`;
      }
    } else {
      fileDataUrl = BUNNY_STORAGE_PULL_ZONE + "public/" + file?.newFilename;
    }

    setFileUrl(fileDataUrl);

    if (file?.filePassword) {
      setFileQRCodePassword(file.filePassword);
      handleOpenVerifyQRCode(true);
    } else {
      setPreviewOpen(true);
    }
  };

  // function handleFileQRGeneration(file) {
  //   if (urlClient) {
  //     if (file?.checkFile === "main") {
  //       setPreviewOpen(true);
  //       setFileUrl(
  //         BUNNY_STORAGE_PULL_ZONE +
  //           `${userData.newName}-${userData.userId}/${file?.newFilename}`,
  //       );
  //     } else {
  //       setPreviewOpen(true);
  //       setFileUrl(
  //         BUNNY_STORAGE_PULL_ZONE +
  //           `${userData.newName}-${userData.userId}/${file?.newPath}`,
  //       );
  //     }
  //   } else {
  //     setPreviewOpen(true);
  //     setFileUrl(BUNNY_STORAGE_PULL_ZONE + "public/" + file);
  //   }
  // }

  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <React.Fragment>
      <MUI.ContainerHome maxWidth="xl">
        <Dialog open={open}>
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant=""
              sx={{
                fontSize: isMobile ? "0.9rem" : "1.2rem",
              }}
            >
              Confirm password
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "20px 30px !important",
                maxWidth: "600px",
              }}
            >
              {checkModal ? (
                <Typography
                  variant=""
                  sx={{
                    fontSize: isMobile ? "0.8rem" : "0.9rem",
                    textAlign: "center",
                  }}
                >
                  Please enter your password for:
                  <br />
                  <span style={{ color: "#17766B" }}>
                    {cutFileName(CutfileName(getFilenames, getNewFileName), 10)}
                  </span>
                </Typography>
              ) : (
                <Typography variant="h6" sx={{ padding: "0", margin: "0" }}>
                  Please enter your link password
                </Typography>
              )}
            </Box>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            {checkModal ? (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleClose()}
                  sx={{ background: "#EA5455" }}
                  size="small"
                >
                  Cancel
                </Button>
              </>
            ) : null}
            <Button
              variant="contained"
              color="success"
              onClick={() => _confirmPasword(password)}
              sx={{ background: "#17766B" }}
              size="small"
            >
              Verify
            </Button>
          </DialogActions>
        </Dialog>

        <MUI.DivdownloadFile>
          <MUI.DivDownloadBox>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={30} />
              </Box>
            ) : (
              <Fragment>
                <MUI.BoxDownloadHeader>
                  <Fragment>
                    {linkClient?._id ? (
                      <Fragment>
                        {linkClient?.type === "file" && (
                          <>
                            {dataFileLink?.queryFileGetLinks?.total && (
                              <Typography variant="h3">
                                {dataFileLink?.queryFileGetLinks?.total}&nbsp;
                                Files ({ConvertBytetoMBandGB(totalSize)})
                              </Typography>
                            )}
                          </>
                        )}
                      </Fragment>
                    ) : (
                      <Typography variant="h3">
                        {resPonData?.filesPublic?.total}&nbsp; Files (
                        {ConvertBytetoMBandGB(totalSize)})
                      </Typography>
                    )}
                  </Fragment>
                </MUI.BoxDownloadHeader>
                {folderType && (
                  <MUI.DivDownloadFileBox>
                    <FolderDownloadComponent
                      folderDownload={folderDownload}
                      isSuccess={isSuccess}
                      isHide={isHide}
                      isMobile={isMobile}
                      setPassword={setPassword}
                      setGetFolderName={setGetFolderName}
                      setFilePasswords={setFilePasswords}
                      handleDownloadFolder={handleDownloadFolder}
                      folderSize={folderSize}
                    />
                  </MUI.DivDownloadFileBox>
                )}
                <Fragment>
                  {linkClient?._id ? (
                    <Fragment>
                      {/* Files && Folder from Clients */}
                      {dataFileLink?.queryFileGetLinks?.total > 0 ? (
                        <CardFileDownload
                          dataFiles={
                            dataFileLink?.queryFileGetLinks?.data || []
                          }
                          isMobile={isMobile}
                          hideDownload={hideDownload}
                          isPublic={false}
                          isSuccess={isSuccess}
                          isHide={isHide}
                          downloadFiles={_downloadFiles}
                          downloadFilesAll={_downloadFilesAll}
                          setIndex={setIndex}
                          setPassword={setPassword}
                          setGetFilenames={setGetFilenames}
                          setGetNewFileName={setGetNewFileName}
                          setCheckModal={setCheckModal}
                          handleQRGeneration={handleQRGeneration}
                          hasFileWithoutPassword={hasFileWithoutPassword}
                          fileTotal={
                            dataFileLink?.queryFileGetLinks?.total || 0
                          }
                        />
                      ) : (
                        <>
                          {!folderType && (
                            <MUI.DivDownloadFileBoxWrapper>
                              <Typography variant="h1">
                                Your file has expired
                              </Typography>
                            </MUI.DivDownloadFileBoxWrapper>
                          )}
                        </>
                      )}
                    </Fragment>
                  ) : (
                    <Fragment>
                      {/* -public Files Public */}
                      {!folderType && resPonData?.filesPublic?.total > 0 ? (
                        <CardFileDownload
                          dataFiles={resPonData?.filesPublic?.data || []}
                          isMobile={isMobile}
                          hideDownload={hideDownload}
                          isPublic={true}
                          isSuccess={isSuccess}
                          isHide={isHide}
                          downloadFiles={_downloadFiles}
                          downloadFilesAll={_downloadFilesAll}
                          setIndex={setIndex}
                          setPassword={setPassword}
                          setGetFilenames={setGetFilenames}
                          setGetNewFileName={setGetNewFileName}
                          setCheckModal={setCheckModal}
                          handleQRGeneration={handleQRGeneration}
                          hasFileWithoutPassword={hasFileWithoutPassword}
                          fileTotal={resPonData?.filesPublic?.total || 0}
                        />
                      ) : (
                        <>
                          {!folderType && !isLoading && (
                            <MUI.DivDownloadFileBoxWrapper>
                              <Typography variant="h1">
                                Your file has expired
                              </Typography>
                            </MUI.DivDownloadFileBoxWrapper>
                          )}
                        </>
                      )}
                    </Fragment>
                  )}
                </Fragment>
              </Fragment>
            )}
          </MUI.DivDownloadBox>
        </MUI.DivdownloadFile>
      </MUI.ContainerHome>

      <DialogPreviewQRcode
        data={fileUrl}
        isOpen={previewOpen}
        onClose={previewHandleClose}
      />

      <ConfirmQRCodeDialog
        isOpen={isVerifyQrCode}
        dataValue={dataValue}
        filename={dataValue?.filename}
        newFilename={dataValue?.newFilename}
        dataPassword={fileQRCodePassword}
        onConfirm={handleSuccessQRCode}
        onClose={handleCloseVerifyQRCode}
      />
    </React.Fragment>
  );
}

export default DownloadFile;
