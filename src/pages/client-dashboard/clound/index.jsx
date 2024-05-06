import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, CircularProgress, useMediaQuery } from "@mui/material";
import CryptoJS from "crypto-js";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import streamSaver from "streamsaver";
import * as MUI from "../css/cloundStyle";
import * as MUIFOLDER from "./../css/folderStyle";

// aopllo
import {
  MUTATION_ACTION_FILE,
  MUTATION_DELETE_RECENT_FILE,
  MUTATION_UPDATE_RECENT_FILE,
  QUERY_DESC_FOLDER,
  QUERY_DESC_MAIN_FILES,
  QUERY_FILE_CATEGORY,
} from "./apollo";

// functions

// components
import { errorMessage, successMessage } from "../../../components/Alerts";
import {
  ConvertBytetoMBandGB,
  GetFileType,
  GetFileTypeFromFullType,
  GetFolderName,
  getFilenameWithoutExtension,
  handleGraphqlErrors,
} from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import CreateFileDropDialog from "../components/CreateFileDropDialog";
import CreateShare from "../components/CreateShare";
import MediaCard from "../components/MediaCard";
import PreviewFile from "../components/PreviewFile";
import ProgressingBar from "../components/progressingBar";
import { CREATE_FILEDROP_LINK_CLIENT } from "../file-drop/apollo";

import SwitchPages from "../components/SwitchPages";
import {
  MUTATION_SOFT_DELETE_FOLDER,
  MUTATION_UPDATE_FOLDER,
} from "../components/apollo";
import Myfolder from "./Myfolder";

import useScroll from "../../../hooks/useScrollDown";
import FileCardContainer from "../components/file/FileCardContainer";
import FileCardItem from "../components/file/FileCardItem";
import MenuDropdownItem from "../components/menu/MenuDropdownItem";
import { useMenuDropdownState } from "../components/menu/MenuDropdownProvider";
import MenuItems, { favouriteMenuItems } from "../components/menu/MenuItems";
import FolderGridItem from "./FolderGridItem";
import LinearBuffer from "./LinearProgress";

// functions
import { truncateName } from "../../../functions";

// material icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { green } from "@mui/material/colors";
import { Base64 } from "js-base64";
import moment from "moment";
import { CSVLink } from "react-csv";
import { BiTime } from "react-icons/bi";
import FileDetailsDialog from "../../../components/FileDetailsDialog";
import { ENV_KEYS } from "../../../constants";
import { EventUploadTriggerContext } from "../../../contexts/EventUploadTriggerContext";
import { FolderContext } from "../../../contexts/FolderContext";
import useBreadcrumbData from "../../../hooks/useBreadcrumbData";
import useExportCSV from "../../../hooks/useExportCSV";
import useGetUrl from "../../../hooks/useGetUrl";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
import CardSkeleton from "../components/CardSkeleton";
import CloudFilesDataGrid from "../components/CloudFilesDataGrid";
import CloudFoldersDataGrid from "../components/CloudFoldersDataGrid";
import Empty from "../components/Empty";
import ListSkeleton from "../components/ListSkeleton";
import RenameDialogFile from "../components/RenameDialogFile";
import CreateFilePasswordDialog from "../components/slider/CreateFilePasswordDialog";
import FileCardSlider from "../components/slider/FileCardSlider";
import * as Icon from "./icons";

const ITEM_PER_PAGE_GRID = 20;

function MyCloud() {
  const [getFolder, { loading: folderLoading, refetch: refetchFolder }] =
    useLazyQuery(QUERY_DESC_FOLDER, { fetchPolicy: "no-cache" });

  const [getFile, { loading: fileLoading }] = useLazyQuery(
    QUERY_DESC_MAIN_FILES,
    {
      fetchPolicy: "no-cache",
    },
  );

  const [deleteRecentFile] = useMutation(MUTATION_DELETE_RECENT_FILE);
  const [updateFile] = useMutation(MUTATION_UPDATE_RECENT_FILE);
  const [getCategoryAll, { loading: countLoading }] = useLazyQuery(
    QUERY_FILE_CATEGORY,
    {
      fetchPolicy: "no-cache",
    },
  );
  const [createFileDropLink] = useMutation(CREATE_FILEDROP_LINK_CLIENT);

  const [fileAction] = useMutation(MUTATION_ACTION_FILE);
  const [deleteFolder] = useMutation(MUTATION_SOFT_DELETE_FOLDER);
  const [updateFolder] = useMutation(MUTATION_UPDATE_FOLDER);
  const { user } = useAuth();
  const [folder, setFolder] = React.useState(null);
  const [getCategory, setGetCategory] = React.useState(null);
  const [mainFile, setMainFile] = React.useState(null);
  const [progressing, setProgressing] = React.useState(0);
  const [procesing, setProcesing] = React.useState(true);
  const [showProgressing, setShowProgressing] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isPasswordLink, setIsPasswordLink] = useState(false);
  const [checked, setChecked] = useState({});
  const [multiSelectId, setMultiSelectId] = useState([]);
  const [multiChecked, setMultiChecked] = useState([]);
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);

  const handleCloseRenameDialog = () => {
    resetDataForEvent();
    setRenameDialogOpen(false);
  };

  useEffect(() => {
    if (!renameDialogOpen) {
      setName("");
    }
  }, [renameDialogOpen]);

  const open = Boolean(null);
  const [fileDetailsDialog, setFileDetailsDialog] = React.useState(false);
  const [fileType, setFileType] = useState("");
  const [path, setPath] = React.useState("");
  const [openShare, setOpenShare] = useState(Boolean(false));
  const [toggle, setToggle] = React.useState(null);
  const [optionsValue, setOptionsValue] = useState(false);
  const [getValue, setGetValue] = useState(null);
  const [viewMore, setViewMore] = useState(20);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { setIsAutoClose, isAutoClose } = useMenuDropdownState();
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentFilePage, setCurrentFilePage] = useState(1);
  const { isAtBottom, limitScroll } = useScroll({
    total,
    limitData: ITEM_PER_PAGE_GRID,
  });
  const { setFolderId, triggerFolder, handleTriggerFolder } =
    React.useContext(FolderContext);
  const [dataGetUrl, setDataGetUrl] = useState(null);
  let PreviewImageUrl = process.env.REACT_APP_BUNNY_PULL_ZONE;
  const [afterDowload, setAfterDowload] = React.useState(null);
  const eventUploadTrigger = React.useContext(EventUploadTriggerContext);
  // const totalDownloadHandle = useDownloadFile(afterDowload);
  const handleGetFolderURL = useGetUrl(dataGetUrl || getValue);
  const [openFileDrop, setOpenFileDrop] = React.useState(false);
  const [folderDropId, setFolderDropId] = React.useState(0);
  const [currentFolderId, setCurrentFolderId] = React.useState(0);
  const [dataForEvent, setDataForEvent] = useState({
    data: {},
    action: "",
  });
  const [csvFolder, setCsvFolder] = useState({
    folderId: "",
    folderName: " ",
  });
  const csvRef = useRef();
  const useDataExportCSV = useExportCSV({
    folderId: csvFolder.folderId,
    exportRef: csvRef,
  });

  useEffect(() => {
    if (useDataExportCSV.data?.length > 0) {
      setCsvFolder({
        folderId: "",
        folderName: "",
      });
    }
  }, [useDataExportCSV.data]);

  React.useEffect(() => {
    if (afterDowload) {
      // totalDownloadHandle(afterDowload);
    }
  }, [afterDowload]);

  useEffect(() => {
    if (dataGetUrl) {
      handleGetFolderURL(dataGetUrl);
    }
  }, [dataGetUrl]);

  useEffect(() => {
    if (isAutoClose) {
      setDataGetUrl(null);
    }
  }, [isAutoClose]);

  useEffect(() => {
    const toggled = localStorage.getItem("toggle");
    if (toggled) {
      setToggle(toggled === "grid" ? "grid" : "list");
    } else {
      setToggle("list");
      localStorage.setItem("toggle", "list");
    }
  }, []);

  const handleToggle = (value) => {
    setToggle(value);
    localStorage.setItem("toggle", value);
  };

  const handleOpenPassword = () => {
    setIsPasswordLink(true);
  };
  const handleClosePassword = () => {
    setIsPasswordLink(false);
    setDataForEvent({
      action: "",
      data: {},
    });
  };

  // checked folder pagination
  let rowFolderpage = 20;
  let countPage = 0;
  for (var i = 1; i <= Math.ceil(totalPages / rowFolderpage); i++) {
    countPage = i;
  }

  // checked file pagination
  let rowFilePage = 20;
  let countFilePage = 0;
  for (var k = 1; k <= Math.ceil(total / rowFilePage); k++) {
    countFilePage = k;
  }

  const handleClickFolder = (e, value) => {
    if (e.ctrlKey && !multiChecked.includes(value?._id)) {
      setMultiChecked([...multiChecked, value?._id]);
      setMultiSelectId([...multiSelectId, value]);
    } else {
      setMultiChecked(multiChecked.filter((id) => id !== value?._id));
      setMultiSelectId(multiSelectId.filter((id) => id?._id !== value?._id));
    }
    if (value.folder_type === "folder") {
      setName(value?.folder_name);
    } else {
      setName(value?.filename);
    }

    setChecked(value?._id);
    setPath(value.path);
    setOptionsValue(true);
    setGetValue(value);
  };

  const handleClose = () => {
    setOptionsValue(false);
    setGetValue(null);
    setMultiChecked([]);
    setMultiSelectId([]);
    resetDataForEvent();
  };

  // const handle
  const handleShareClose = () => {
    handleClose();
    setOpenShare(false);
  };

  // open folder
  const handleOpenFolder = (value) => {
    setFolderId(value?._id);
    handleClose();
    let url = value?.url;
    const base64URL = Base64.encodeURI(url);
    navigate(`/folder/${base64URL}`);
  };

  const handleClosePreview = () => {
    resetDataForEvent();
    setShowPreview(false);
  };

  // query file grid
  const queryFileGrid = async () => {
    try {
      if (toggle === "grid") {
        await getFile({
          variables: {
            where: {
              createdBy: user?._id,
              checkFile: "main",
              status: "active",
              source: "default",
            },
            orderBy: "updatedAt_DESC",
            limit: limitScroll,
          },
          onCompleted: (data) => {
            if (data) {
              setMainFile(data?.files?.data);
              setTotal(data?.files?.total);
            }
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function handleExportFolder(id) {
    await getFile({
      variables: {
        where: {
          folder_id: id,
        },
      },
      onCompleted: (data) => {
        setdata;
      },
    });
  }

  // query files
  const queryFile = async () => {
    try {
      setLoading(true);
      if (toggle === "list") {
        await getFile({
          variables: {
            where: {
              createdBy: user._id,
              checkFile: "main",
              status: "active",
              source: "default",
            },
            orderBy: "updatedAt_DESC",
            limit: rowFilePage,
            skip: rowFilePage * (currentFilePage - 1),
          },
          onCompleted: (data) => {
            if (data) {
              setMainFile(data?.files?.data);
              setTotal(data?.files?.total);
            }
          },
        });
      }
      setLoading(false);
    } catch (error) {
      errorMessage(error, 3000);
    }
  };

  React.useEffect(() => {
    queryFile();
  }, [currentFilePage, countFilePage, toggle]);

  React.useEffect(() => {
    queryFileGrid();
  }, [limitScroll, toggle]);

  //query all files count and separate base on file type
  const queryCategory = async () => {
    await getCategoryAll({
      onCompleted: (data) => {
        if (data) {
          setGetCategory(data);
        }
      },
    });
  };

  React.useEffect(() => {
    queryCategory();
  }, []);

  //query all folder
  const queryFolder = async () => {
    setLoading(true);
    if (toggle === "list") {
      await getFolder({
        variables: {
          where: {
            checkFolder: "main",
            restore: "show",
            createdBy: user._id,
          },
          orderBy: "pin_DESC",
          limit: rowFolderpage,
          skip: rowFolderpage * (currentPage - 1),
        },
        onCompleted: (data) => {
          if (data) {
            setFolder(data);
            setTotalPages(data?.folders?.total);
          }
        },
      });
    } else {
      await getFolder({
        variables: {
          where: {
            checkFolder: "main",
            restore: "show",
            createdBy: user._id,
          },
          orderBy: "pin_DESC",
          limit: viewMore,
        },
        onCompleted: (data) => {
          if (data) {
            setFolder(data);
            setTotalPages(data?.folders?.total);
          }
        },
      });
    }
    setLoading(false);
  };

  React.useEffect(() => {
    queryFolder();
  }, [viewMore, currentPage, countPage, toggle]);
  // const [queriesExecuted, setQueriesExecuted] = useState(false);

  React.useEffect(() => {
    //  && !queriesExecuted
    if (eventUploadTrigger?.triggerData?.isTriggered) {
      queryFolder();
      if (toggle === "list") {
        queryFile();
      } else {
        queryFileGrid();
      }
      queryCategory();
      // setQueriesExecuted(true);
    }
  }, [eventUploadTrigger?.triggerData]);

  let checkUploadSuccessAll = localStorage.getItem("uploadSuccess");
  React.useEffect(() => {
    queryFolder();
  }, [checkUploadSuccessAll]);

  // onclick view more
  const hanldeViewMore = () => {
    if (!loading) {
      // setSuccess(false);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // setSuccess(true);
        setViewMore(viewMore + 20);
      }, 0);
    }
  };

  const downloadFilesFromBunny = async (inputData) => {
    const data = inputData || getValue;
    let actionStatus = "download";
    setShowProgressing(true);
    setOpenPreview(false);
    setIsAutoClose(true);
    const secretKey = ENV_KEYS.REACT_APP_BUNNY_SECRET_KEY;
    let real_path;
    if (data?.newPath === null || getValue?.newPath === null) {
      real_path = "";
    } else {
      real_path = truncateName("/" + data.newPath || "/" + getValue?.newPath);
    }

    try {
      let headers;
      if (!data) {
        headers = {
          accept: "/",
          storageZoneName: ENV_KEYS.REACT_APP_STORAGE_ZONE,
          isFolder: false,
          path:
            user.newName +
              "-" +
              user._id +
              real_path +
              "/" +
              data.newFilename || getValue?.newFilename,
          fileName: CryptoJS.enc.Utf8.parse(
            data?.filename || getValue?.filename,
          ),
          AccessKey: ENV_KEYS.REACT_APP_ACCESSKEY_BUNNY,
          createdBy: user?._id,
        };
      } else {
        headers = {
          accept: "/",
          storageZoneName: ENV_KEYS.REACT_APP_STORAGE_ZONE,
          isFolder: false,
          path:
            user.newName + "-" + user._id + real_path + "/" + data?.newFilename,
          fileName: CryptoJS.enc.Utf8.parse(data?.filename),
          AccessKey: ENV_KEYS.REACT_APP_ACCESSKEY_BUNNY,
          createdBy: user?._id,
        };
      }

      const encryptedHeaders = CryptoJS.AES.encrypt(
        JSON.stringify(headers),
        secretKey,
      ).toString();
      const response = await fetch(process.env.REACT_APP_DOWNLOAD_URL, {
        headers: { encryptedHeaders },
      });

      const reader = response.body.getReader();
      const contentLength = +response.headers.get("Content-Length");
      let receivedLength = 0;
      const chunks = [];
      let countPercentage = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        countPercentage = Math.round((receivedLength / contentLength) * 100);
        setProgressing(countPercentage);
        setProcesing(true);
        // setAfterDowload(data?._id || getValue?._id);
      }
      if (countPercentage === 100) {
        setShowProgressing(false);
        setProcesing(false);
        successMessage("Download successful!!", 2000);
        setIsAutoClose(true);
        await updateFile({
          variables: {
            where: {
              _id: data._id,
            },
            data: {
              totalDownload: 1,
            },
          },
        });
      } else {
        setShowProgressing(false);
        setProcesing(false);
        await updateFile({
          variables: {
            where: {
              _id: data._id,
            },
            data: {
              totalDownloadFaild: 1,
            },
          },
        });
      }

      const blob = new Blob(chunks);
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setGetValue((prev) => {
        return {
          ...prev,
          totalDownload: parseInt(getValue?.totalDownload + 1),
        };
      });
      await handleActionFile(actionStatus);
      setFileDetailsDialog(false);
      resetDataForEvent();
      if (toggle === "list") {
        queryFile();
      } else {
        queryFileGrid();
      }
    } catch (error) {
      console.log(error);
      setGetValue(null);
      resetDataForEvent();
      errorMessage(error, 3000);
    }
  };

  // download more folder
  const handleDownloadFolders = async () => {
    for (let i = 0; i < multiSelectId.length; i++) {
      handleDownloadZipFile(multiSelectId[i]);
    }
  };

  streamSaver.mitm = "/mitm.html";

  const handleDownloadZipFile = async (data) => {
    setShowProgressing(true);
    let folder_name;
    let path;
    if (data) {
      path = data?.newPath;
      folder_name = `${data?.folder_name}.zip`;
    } else {
      path = getValue?.newPath;
      folder_name = `${getValue?.folder_name}.zip`;
    }

    const secretKey = ENV_KEYS.REACT_APP_BUNNY_SECRET_KEY;
    try {
      const headers = {
        accept: "/",
        storageZoneName: ENV_KEYS.REACT_APP_STORAGE_ZONE,
        isFolder: true,
        path: user.newName + "-" + user._id + "/" + path,
        fileName: CryptoJS.enc.Utf8.parse(folder_name),
        AccessKey: ENV_KEYS.REACT_APP_ACCESSKEY_BUNNY,
        _id: data?._id || getValue?._id,
        createdBy: user?._id,
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
          setShowProgressing(false);
          resetDataForEvent();
          successMessage("Download successfull", 2000);
          setFileDetailsDialog(false);
          setIsOpenMenu(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      setShowProgressing(false);
      console.error(error);
    }
  };

  const handleDeleteFile = async (data) => {
    let deleteFile = await deleteRecentFile({
      variables: {
        where: {
          _id: parseInt(data?._id),
        },
        data: {
          status: "deleted",
          createdBy: user._id,
        },
      },
    });

    if (deleteFile?.data?.updateFiles?._id) {
      setIsAutoClose(true);
      resetDataForEvent();
      successMessage("Delete file successful!!", 2000);
    }
    if (toggle === "list") {
      queryFile();
    } else {
      queryFileGrid();
    }
  };

  const handleDeleteFolder = async (folderData) => {
    try {
      if (multiSelectId.length > 0) {
        for (let i = 0; i < multiSelectId.length; i++) {
          let data = await deleteFolder({
            variables: {
              where: {
                _id: multiSelectId[i]?._id,
              },
              data: {
                checkFolder: multiSelectId[i]?.checkFolder,
                status: "deleted",
              },
            },
          });
          if (data?.data?.updateFolders?._id) {
            queryFolder();
            setIsOpenMenu(false);
          }
        }
        setMultiSelectId([]);
        handleClose();
      } else {
        let data = await deleteFolder({
          variables: {
            where: {
              _id: folderData?._id,
            },
            data: {
              checkFolder: folderData?.checkFolder,
              status: "deleted",
            },
          },
        });
        if (data?.data?.updateFolders?._id) {
          queryFolder();
          setIsOpenMenu(false);
        }
        handleClose();
      }
      successMessage("Delete folder successfull!", 3000);
    } catch (err) {
      errorMessage("Something wrong. Please try again!");
    }
  };

  // rename file function
  const handleSaveRename = async (newRename) => {
    let actionStatus = "edit";
    try {
      let updateRecentFile = await updateFile({
        variables: {
          where: {
            _id: parseInt(getValue?._id),
          },
          data: {
            filename: newRename,
            updatedBy: user._id,
          },
        },
      });
      if (updateRecentFile?.data?.updateFiles?._id) {
        handleActionFile(actionStatus);
        handleCloseRenameDialog();
        successMessage("Update File successfull", 2000);
      }
      if (toggle === "list") {
        queryFile();
      } else {
        queryFileGrid();
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  // File action for count in recent file
  const handleActionFile = async (val, data) => {
    try {
      await fileAction({
        variables: {
          fileInput: {
            createdBy: parseInt(user._id),
            fileId: parseInt(data?._id ? data?._id : getValue?._id),
            actionStatus: val,
          },
        },
      });
    } catch (error) {
      errorMessage(error, 2500);
    }
  };

  /* data for Breadcrumb */
  const breadcrumbData = useBreadcrumbData(
    getValue?.path || (getValue?.path, getValue?.filename),
  );

  const handleFileDetailDialogBreadcrumbFolderNavigate = async (link) => {
    const result = await getFolder({
      variables: {
        where: {
          path: link,
          createdBy: user._id,
        },
      },
    });
    if (result) {
      const [dataById] = result.data.folders.data;
      const base64URL = Base64.encodeURI(dataById.url);
      navigate(`/folder/${base64URL}`);
    }
  };

  // open file drop
  const handleOpenFileDropDialog = (id) => {
    setCurrentFolderId(id);
    setOpenFileDrop(true);
    resetDataForEvent();
  };

  // close file drop
  const handleCloseFileDropDialog = () => {
    setOpenFileDrop(false);
  };

  const handleCreateFileDrop = async (link, date) => {
    try {
      let fileDropLink = await createFileDropLink({
        variables: {
          input: {
            url: link,
            expiredAt: date,
            folderId: folderDropId,
          },
        },
      });
      if (fileDropLink?.data?.createDrop?._id) {
        successMessage("Create file-drop link success!", 2000);
      }
    } catch (error) {
      errorMessage("Something went wrong!", 2000);
    }
  };

  const resetDataForEvent = () => {
    setDataForEvent({
      data: {},
      action: "",
    });
  };

  // event-ss
  const handleEvent = async (e, data) => {
    setGetValue(data);
    setIsAutoClose(true);
    setName(data?.filename || data?.folder_name);
    setTimeout(() => {
      setOptionsValue(false);
    }, 500);
    if (e === "rename") {
      setRenameDialogOpen(true);
    } else if (e === "download") {
      setIsAutoClose(true);
      if (
        getValue?.folder_type === "folder" ||
        data?.folder_type === "folder"
      ) {
        if (multiSelectId.length > 0) {
          await handleDownloadFolders();
        } else {
          await handleDownloadZipFile(data);
        }
      } else {
        await downloadFilesFromBunny(data);
      }
    } else if (e === "delete") {
      if (
        getValue?.folder_type === "folder" ||
        data?.folder_type === "folder"
      ) {
        handleDeleteFolder(data);
      } else {
        handleDeleteFile(data);
      }
    } else if (e === "get link") {
      setDataGetUrl(data || getValue);
    } else if (e === "pin") {
      handleAddPin(data);
    } else if (e === "favourite") {
      handleFavourite(data);
    } else if (e === "share") {
      setOpenShare(true);
    } else if (e === "filedrop") {
      setFolderDropId(data?._id);
      handleOpenFileDropDialog(data?._id);
    } else if (e === "detail") {
      setFileDetailsDialog(true);
    } else if (e === "password") {
      setDataForEvent({
        data,
        action: "password",
      });
      handleOpenPassword();
    } else if (e === "folder double click") {
      handleOpenFolder(data);
    } else if (e === "preview") {
      setShowPreview(true);
      setOpenPreview(true);
      setName(data?.filename);
      setNewName(data?.newFilename);
      setFileType(data?.fileType);
      setPath(data?.newPath);
    } else if (e === "export-csv") {
      setCsvFolder({
        folderId: data?._id,
        folderName: data?.folder_name + ".csv",
      });
    }
  };

  useEffect(() => {
    if (dataForEvent.data && dataForEvent.action) {
      menuOnClick(dataForEvent.action);
    }
  }, [dataForEvent.action]);

  const menuOnClick = async (action) => {
    setIsAutoClose(true);
    setGetValue(dataForEvent.data);
    setName(dataForEvent.data?.filename || dataForEvent.data?.folder_name);
    setTimeout(() => {
      setOptionsValue(false);
    }, 500);

    switch (action) {
      case "rename": {
        setRenameDialogOpen(true);
        break;
      }
      case "download": {
        if (
          // getValue?.folder_type === "folder" ||
          dataForEvent.data?.folder_type === "folder"
        ) {
          if (multiSelectId.length > 0) {
            await handleDownloadFolders();
          } else {
            await handleDownloadZipFile(dataForEvent.data);
          }
        } else {
          await downloadFilesFromBunny(dataForEvent.data);
        }
        break;
      }
      case "delete": {
        if (
          getValue?.folder_type === "folder" ||
          dataForEvent.data?.folder_type === "folder"
        ) {
          handleDeleteFolder(dataForEvent.data);
        } else {
          handleDeleteFile(dataForEvent.data);
        }
        break;
      }
      case "get link": {
        setDataGetUrl(dataForEvent.data);
        setDataForEvent((prev) => {
          return {
            ...prev,
            action: "",
          };
        });
        break;
      }
      case "pin": {
        handleAddPin(dataForEvent.data);
        break;
      }
      case "favourite": {
        handleFavourite(dataForEvent.data);
        resetDataForEvent();
        break;
      }
      case "share": {
        setOpenShare(true);
        break;
      }
      case "filedrop": {
        setFolderDropId(dataForEvent.data?._id);
        handleOpenFileDropDialog(dataForEvent.data?._id);
        break;
      }
      case "detail": {
        setFileDetailsDialog(true);
        break;
      }
      case "password": {
        handleOpenPassword();
        break;
      }
      case "folder double click": {
        handleOpenFolder(dataForEvent.data);
        break;
      }
      case "preview": {
        setShowPreview(true);
        setOpenPreview(true);
        setName(dataForEvent.data?.filename);
        setNewName(dataForEvent.data?.newFilename);
        setFileType(dataForEvent.data?.fileType);
        setPath(dataForEvent.data?.newPath);
        break;
      }
      case "export-csv": {
        setCsvFolder({
          folderId: dataForEvent.data?._id,
          folderName: dataForEvent.data?.folder_name,
        });
        resetDataForEvent();
        break;
      }
    }
  };

  // favourite function
  const handleFavourite = async (data) => {
    try {
      await updateFile({
        variables: {
          where: {
            _id: parseInt(data?._id),
          },
          data: {
            favorite: data.favorite ? 0 : 1,
          },
        },
        onCompleted: async () => {
          setIsAutoClose(true);
          if (data.favorite) {
            if (toggle === "list") {
              queryFile();
            } else {
              queryFileGrid();
            }
            successMessage("One File removed from Favourite", 2000);
          } else {
            if (toggle === "list") {
              queryFile();
            } else {
              queryFileGrid();
            }
            resetDataForEvent();
            successMessage("One File added to Favourite", 2000);
          }
          setGetValue((state) => ({
            ...state,
            favorite: getValue?.favorite ? 0 : 1,
          }));
        },
      });
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(
        handleGraphqlErrors(cutErr || "Something went wrong, Please try again"),
        2000,
      );
    }
  };

  // pin foloder
  const handleAddPin = async (data) => {
    try {
      await updateFolder({
        variables: {
          where: {
            _id: data._id,
          },
          data: {
            pin: data.pin ? 0 : 1,
            updatedBy: user._id,
          },
        },
        onCompleted: async () => {
          if (data.pin) {
            successMessage("One File removed from Pin", 2000);
          } else {
            successMessage("One File added to Pin", 2000);
          }
          setGetValue((state) => ({
            data: {
              ...state.data,
              pin: data.pin ? 0 : 1,
            },
          }));
          handleTriggerFolder();
          resetDataForEvent();
          queryFolder();
          setIsAutoClose(true);
          setOptionsValue(false);
        },
      });
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(
        handleGraphqlErrors(
          cutErr || "Sorry!!. Something went wrong. Please try again later!!",
        ),
        2000,
      );
    }
  };

  // rename folder
  const handleFolderRename = async (newRename) => {
    try {
      if (getValue?.folder_type === "folder") {
        let update = await updateFolder({
          variables: {
            where: {
              _id: getValue?._id,
              checkFolder: getValue.checkFolder,
            },
            data: {
              folder_name: newRename,
            },
          },
        });

        if (update?.data?.updateFolders?._id) {
          setIsOpenMenu(false);
          handleCloseRenameDialog();
          queryFolder();
          successMessage("Update success", 3000);
        }
      } else {
        await handleSaveRename(newRename);
      }

      resetDataForEvent();
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(
        handleGraphqlErrors(cutErr || "Something went wrong, Please try again"),
        2000,
      );
    }
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <MUIFOLDER.TitleAndSwitch>
          <MUIFOLDER.SwitchItem>
            <Typography variant="h5">My Cloud</Typography>
          </MUIFOLDER.SwitchItem>
          {(folder?.folders?.data?.length > 0 ||
            (mainFile !== null && mainFile?.length > 0)) && (
            <SwitchPages
              handleToggle={handleToggle}
              toggle={toggle}
              setToggle={setToggle}
            />
          )}
        </MUIFOLDER.TitleAndSwitch>

        <MUI.DivCloud>
          {(folder?.folders?.data?.length > 0 ||
            (mainFile !== null && mainFile?.length > 0)) && (
            <Box>
              <Box sx={{ mb: 2 }}>
                {isMobile ? (
                  <FileCardSlider
                    getCount={getCategory}
                    countLoading={countLoading}
                  />
                ) : (
                  <MediaCard
                    getCount={getCategory}
                    countLoading={countLoading}
                  />
                )}
                {folderLoading && folder?.folders?.data?.length > 0 ? (
                  <>
                    {toggle === "list" && <ListSkeleton />}
                    {toggle === "grid" && <CardSkeleton />}
                  </>
                ) : (
                  <MUI.DivFolders>
                    {folder?.folders?.data?.length > 0 && (
                      <MUIFOLDER.TitleAndIcon>
                        <Typography
                          sx={{ mb: 2 }}
                          display={
                            folder?.folders?.data?.length > 0 ? "" : "none"
                          }
                          variant="h4"
                        >
                          My Folders
                        </Typography>
                      </MUIFOLDER.TitleAndIcon>
                    )}

                    {toggle === "list" ? (
                      <Box>
                        {folder?.folders?.data?.length > 0 && (
                          <CloudFoldersDataGrid
                            pagination={{
                              total: Math.ceil(
                                folder?.folders.total / rowFolderpage,
                              ),
                              currentPage,
                              setCurrentPage,
                            }}
                            data={folder?.folders?.data}
                            total={folder?.folders.total}
                            handleEvent={async (action, data) => {
                              await setGetValue(data);
                              // await handleEvent(action, data);
                              await setDataForEvent({
                                action,
                                data,
                              });
                            }}
                          />
                        )}
                      </Box>
                    ) : (
                      <React.Fragment>
                        <Box>
                          <Myfolder>
                            {folder?.folders?.data?.map((item, index) => {
                              return (
                                <React.Fragment key={index}>
                                  <FolderGridItem
                                    open={open}
                                    file_id={
                                      parseInt(item?.total_size) > 0
                                        ? true
                                        : false
                                    }
                                    folder_name={item?.folder_name}
                                    setIsOpenMenu={setIsOpenMenu}
                                    isOpenMenu={isOpenMenu}
                                    isPinned={item.pin ? true : false}
                                    onOuterClick={() => {
                                      setMultiChecked(multiChecked);
                                      setChecked({});
                                    }}
                                    cardProps={{
                                      onClick: (e) =>
                                        handleClickFolder(e, item),
                                      onDoubleClick: () =>
                                        handleOpenFolder(item),
                                      /* ...(checked === item?._id && {
                                        ischecked: true,
                                      }), */
                                      ...(multiChecked.find(
                                        (id) => id === item?._id,
                                      ) && {
                                        ischecked: true,
                                      }),
                                    }}
                                    menuItem={favouriteMenuItems?.map(
                                      (menuItems, index) => {
                                        return (
                                          <MenuDropdownItem
                                            key={index}
                                            disabled={
                                              item.file_id[0]?._id ||
                                              item.parentkey[0]?._id
                                                ? false
                                                : menuItems.disabled
                                            }
                                            className="menu-item"
                                            isPinned={item.pin ? true : false}
                                            isPassword={
                                              item.filePassword ||
                                              item.access_password
                                                ? true
                                                : false
                                            }
                                            title={menuItems.title}
                                            icon={menuItems.icon}
                                            onClick={() => {
                                              setDataForEvent({
                                                data: item,
                                                action: menuItems.action,
                                              });
                                              // handleEvent(
                                              //   menuItems.action,
                                              //   item,
                                              // );
                                              setGetValue(item);
                                            }}
                                          />
                                        );
                                      },
                                    )}
                                  />
                                </React.Fragment>
                              );
                            })}
                          </Myfolder>

                          <Box
                            sx={{
                              mt: 4,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {totalPages > folder?.folders?.data?.length && (
                              <Box
                                sx={{
                                  display: "flex",
                                  position: "relative",
                                }}
                              >
                                <Button
                                  endIcon={<ExpandMoreIcon />}
                                  sx={{ mt: 2 }}
                                  disabled={loading === "loading"}
                                  size="small"
                                  variant="outlined"
                                  onClick={hanldeViewMore}
                                >
                                  View more
                                </Button>
                                {loading && (
                                  <CircularProgress
                                    size={24}
                                    sx={{
                                      color: green[500],
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      marginTop: "-12px",
                                      marginLeft: "-12px",
                                    }}
                                  />
                                )}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </React.Fragment>
                    )}
                  </MUI.DivFolders>
                )}
              </Box>
              <MUI.DivRecentFile>
                {fileLoading && mainFile === null ? (
                  <>
                    {toggle === "list" && <ListSkeleton />}
                    {toggle === "grid" && <CardSkeleton />}
                  </>
                ) : (
                  <>
                    <MUI.DivRecentFileHeader>
                      <Typography
                        variant="h4"
                        sx={{
                          display: mainFile?.length > 0 ? "" : "none",
                        }}
                      >
                        Files
                      </Typography>
                    </MUI.DivRecentFileHeader>
                    {toggle === "list" ? (
                      <Box>
                        {mainFile?.length > 0 && (
                          <CloudFilesDataGrid
                            pagination={{
                              total: Math.ceil(total / rowFilePage),
                              currentPage: currentFilePage,
                              setCurrentPage: setCurrentFilePage,
                            }}
                            data={mainFile}
                            total={total}
                            handleEvent={(action, data) => {
                              // handleEvent(action, data);
                              setDataForEvent({
                                data,
                                action,
                              });
                              setGetValue(data);
                            }}
                          />
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ mt: 4 }}>
                        {mainFile?.length > 0 && (
                          <FileCardContainer>
                            {mainFile?.map((item, index) => {
                              return (
                                <React.Fragment key={index}>
                                  <FileCardItem
                                    path={item?.path}
                                    imageUrl={
                                      PreviewImageUrl +
                                      user.newName +
                                      "-" +
                                      user._id +
                                      (item?.path
                                        ? truncateName(item?.path)
                                        : "") +
                                      "/" +
                                      item?.newFilename
                                    }
                                    thumbnailImageUrl={
                                      PreviewImageUrl +
                                      user.newName +
                                      "-" +
                                      user._id +
                                      "/" +
                                      ENV_KEYS.REACT_APP_THUMBNAIL_PATH +
                                      "/" +
                                      getFilenameWithoutExtension(
                                        item?.newFilename,
                                      ) +
                                      `.${ENV_KEYS.REACT_APP_THUMBNAIL_EXTENSION}`
                                    }
                                    fileType={GetFolderName(item?.fileType)}
                                    name={item?.filename}
                                    newName={item?.newFilename}
                                    cardProps={{
                                      onDoubleClick: () => {
                                        setShowPreview(true);
                                        setOpenPreview(true);
                                        setName(item?.filename);
                                        setNewName(item?.newFilename);
                                        setFileType(item?.fileType);
                                        setPath(item?.newPath);
                                        setGetValue(item);
                                        setDataForEvent({
                                          data: item,
                                          action: "preview",
                                        });
                                      },
                                    }}
                                    menuItems={MenuItems.map(
                                      (menuItem, index) => {
                                        return (
                                          <MenuDropdownItem
                                            key={index}
                                            isFavorite={
                                              item.favorite ? true : false
                                            }
                                            isPassword={
                                              item.filePassword ||
                                              item.access_password
                                                ? true
                                                : false
                                            }
                                            title={menuItem.title}
                                            icon={menuItem.icon}
                                            onClick={() => {
                                              // handleEvent(
                                              //   menuItem.action,
                                              //   item,
                                              // );
                                              setDataForEvent({
                                                data: item,
                                                action: menuItem.action,
                                              });
                                              setGetValue(item);
                                            }}
                                          />
                                        );
                                      },
                                    )}
                                  />
                                </React.Fragment>
                              );
                            })}
                          </FileCardContainer>
                        )}
                        {fileLoading && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: 3,
                              position: "absolute",
                              bottom: "-50px",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <LinearBuffer />
                          </Box>
                        )}
                      </Box>
                    )}
                  </>
                )}
              </MUI.DivRecentFile>
              {showPreview && (
                <PreviewFile
                  open={openPreview}
                  handleClose={handleClosePreview}
                  onClick={() => downloadFilesFromBunny(dataForEvent.data)}
                  filename={name}
                  newFilename={newName}
                  fileType={fileType}
                  path={path}
                  user={user}
                />
              )}

              {/* create share popup */}
              {openShare && (
                <CreateShare
                  onClose={handleShareClose}
                  open={openShare}
                  data={getValue || multiSelectId[0]}
                />
              )}
              {fileDetailsDialog && (
                <FileDetailsDialog
                  iconTitle={<BiTime />}
                  title="My Cloud"
                  path={breadcrumbData}
                  name={getValue?.filename}
                  breadcrumb={{
                    handleFolderNavigate:
                      handleFileDetailDialogBreadcrumbFolderNavigate,
                  }}
                  type={
                    getValue?.fileType &&
                    GetFileTypeFromFullType(getValue?.fileType)
                  }
                  displayType={
                    getValue?.fileType ||
                    GetFileType(getValue?.filename) ||
                    "folder"
                  }
                  size={
                    getValue?.size ? ConvertBytetoMBandGB(getValue?.size) : 0
                  }
                  dateAdded={moment(
                    getValue?.createdAt,
                    "YYYY-MM-DDTHH:mm:ss.SSS",
                  ).format(DATE_PATTERN_FORMAT.datetime)}
                  lastModified={moment(
                    getValue?.updatedAt,
                    "YYYY-MM-DDTHH:mm:ss.SSS",
                  ).format(DATE_PATTERN_FORMAT.datetime)}
                  totalDownload={getValue?.totalDownload}
                  // totalDownload={dataForEvent.data?.totalDownload}
                  isOpen={fileDetailsDialog}
                  onClose={() => {
                    setFileDetailsDialog(false);
                    resetDataForEvent();
                  }}
                  imageUrl={
                    PreviewImageUrl +
                    user.newName +
                    "-" +
                    user._id +
                    "/" +
                    (getValue?.newPath ? truncateName(getValue?.newPath) : "") +
                    getValue?.newFilename
                  }
                  {...{
                    favouriteIcon: {
                      isShow: true,
                      handleFavouriteOnClick: async () =>
                        await handleFavourite(getValue),
                      isFavourite: getValue?.favorite ? true : false,
                    },
                    downloadIcon: {
                      isShow: true,
                      handleDownloadOnClick: async () =>
                        await downloadFilesFromBunny(getValue),
                    },
                  }}
                />
              )}
              <RenameDialogFile
                open={renameDialogOpen}
                onClose={handleCloseRenameDialog}
                onSave={handleFolderRename}
                title={
                  getValue?.folder_type === "folder"
                    ? "Rename folder"
                    : "Rename file"
                }
                label={
                  getValue?.folder_type === "folder"
                    ? "Rename folder"
                    : "Rename file"
                }
                isFolder={getValue?.folder_type === "folder" ? true : false}
                defaultValue={
                  getValue?.folder_type === "folder"
                    ? getValue?.folder_name
                    : getValue?.filename
                }
                name={name}
                setName={setName}
              />
            </Box>
          )}
          {folder?.folders?.data?.length === 0 &&
            mainFile !== null &&
            mainFile?.length === 0 && (
              <Box style={{ height: "100%" }}>
                <Empty
                  icon={<Icon.MycloudEmpty />}
                  title="A place for all of your files"
                  context="You can drag or folders right into VShare"
                />
              </Box>
            )}

          {showProgressing && (
            <ProgressingBar procesing={procesing} progressing={progressing} />
          )}
        </MUI.DivCloud>
      </Box>

      <CreateFileDropDialog
        data
        isOpen={openFileDrop}
        onClose={handleCloseFileDropDialog}
        handleChange={handleCreateFileDrop}
        folderId={currentFolderId}
      />

      <CreateFilePasswordDialog
        isOpen={isPasswordLink}
        dataValue={dataForEvent.data}
        isUpdate={
          dataForEvent.data?.filePassword || dataForEvent.data?.access_password
            ? true
            : false
        }
        filename={dataForEvent.data?.filename || dataForEvent.data?.folder_name}
        checkType={dataForEvent.data?.folder_type ? "folder" : "file"}
        onConfirm={() => {
          queryFolder();
          if (toggle === "list") {
            queryFile();
          } else {
            queryFileGrid();
          }
        }}
        onClose={handleClosePassword}
      />

      <CSVLink
        ref={csvRef}
        data={useDataExportCSV.data}
        filename={csvFolder.folderName}
        target="_blank"
      />
    </React.Fragment>
  );
}

export default MyCloud;
