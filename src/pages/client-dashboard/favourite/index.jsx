import { useLazyQuery, useMutation } from "@apollo/client";
import axios from "axios";
import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";
import React, { Fragment, useEffect, useState } from "react";
import {
  MUTATION_ACTION_FILES,
  MUTATION_FILES,
  MUTATION_FOLDERS,
  QUERY_FILES,
  QUERY_FOLDERS,
} from "./apollo";

// component
import { Box, Typography } from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import useFirstRender from "../../../hooks/useFirstRender";
import FavouriteFilesDataGrid from "../components/FavouriteFilesDataGrid";
import SwitchPages from "../components/SwitchPages";
import FileCardContainer from "../components/file/FileCardContainer";
import FileCardItem from "../components/file/FileCardItem";
import ProgressingBar from "../components/progressingBar";
import * as MUI from "../css/favouriteStyle";

// icons
import JSZip from "jszip";
import _ from "lodash";
import moment from "moment";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../../../components/Alerts";
import FileDetailsDialog from "../../../components/FileDetailsDialog";
import AlertDialog from "../../../components/deleteDialog";
import { ENV_KEYS } from "../../../constants";
import { FolderContext } from "../../../contexts/FolderContext";
import {
  ConvertBytetoMBandGB,
  CutFileType,
  GetFileType,
  GetFileTypeFromFullType,
  extractDirectoryName,
  extractFileNames,
  folderIdLocalKey,
  getFilenameWithoutExtension,
  handleGraphqlErrors,
  truncateName,
} from "../../../functions";
import useBreadcrumbData from "../../../hooks/useBreadcrumbData";
import useGetUrl from "../../../hooks/useGetUrl";
import useScrollDown from "../../../hooks/useScrollDown";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
import useManageSetting from "../../dashboards/settings/hooks/useManageSetting";
import CardSkeleton from "../components/CardSkeleton";
import CreateShare from "../components/CreateShare";
import Empty from "../components/Empty";
import ListSkeleton from "../components/ListSkeleton";
import PreviewFile from "../components/PreviewFile";
import RenameDialogFile from "../components/RenameDialogFile";
import MenuDropdownItem from "../components/menu/MenuDropdownItem";
import { useMenuDropdownState } from "../components/menu/MenuDropdownProvider";
import menuItems from "../components/menu/MenuItems";
import CreateFilePasswordDialog from "../components/slider/CreateFilePasswordDialog";
import * as MUI_TOGLE from "../css/folderStyle";
import useManageFavorites from "./hooks";
import * as Icon from "./icons";
const {
  REACT_APP_STORAGE_ZONE,
  REACT_APP_BUNNY_SECRET_KEY,
  REACT_APP_BUNNY_API,
  REACT_APP_BUNNY_PULL_ZONE,
  REACT_APP_ACCESSKEY_BUNNY,
  REACT_APP_DOWNLOAD_URL,
} = process.env;

const ITEM_PER_PAGE_LIST = 10;
const ITEM_PER_PAGE_GRID = 40;

function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dataFilesAndFolders, setDataFilesAndFolders] = useState([null]);
  const [dataFilesAndFoldersForGrid, setDataFilesAndFoldersForGrid] = useState([
    null,
  ]);
  const isFirstRender = useFirstRender();
  const [
    getFiles,
    {
      data: dataFiles,
      refetch: filesRefetch,
      loading: dataFilesLoadingForList,
    },
  ] = useLazyQuery(QUERY_FILES, {
    fetchPolicy: "no-cache",
  });

  const [
    getFilesForGrid,
    {
      data: dataFilesForGrid,
      refetch: filesRefetchForGrid,
      loading: dataFilesLoadingForGrid,
    },
  ] = useLazyQuery(QUERY_FILES, {
    fetchPolicy: "no-cache",
  });

  const [isDataFavoriteFilesFound, setIsDataFavoriteFilesFound] =
    useState(null);
  const [isDataFavoriteFoldersFound, setIsDataFavoriteFoldersFound] =
    useState(null);
  const [getFolders, { loadingFolders, refetch: foldersRefetch }] =
    useLazyQuery(QUERY_FOLDERS, {
      fetchPolicy: "no-cache",
    });
  const [updateFile] = useMutation(MUTATION_FILES);
  const [updateFolder] = useMutation(MUTATION_FOLDERS);
  const { setIsAutoClose, isAutoClose } = useMenuDropdownState();
  const { folderId } = React.useContext(FolderContext);
  const [isPasswordLink, setIsPasswordLink] = useState(false);

  const useDataSetting = useManageSetting();

  const settingKeys = {
    viewMode: "DVMLAGH",
  };

  const [toggle, setToggle] = React.useState(null);
  const handleToggle = (value) => {
    setToggle(value);
    localStorage.setItem("toggle", value);
  };
  const { limitScroll } = useScrollDown({
    total: dataFilesAndFoldersForGrid?.total || 0,
    limitData: ITEM_PER_PAGE_GRID,
  });

  const [progressing, setProgressing] = React.useState(0);
  const [procesing, setProcesing] = React.useState(true);
  const [showProgressing, setShowProgressing] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });
  /* data for Breadcrumb */
  const breadcrumbData = useBreadcrumbData(
    dataForEvents.data?.path ||
      (dataForEvents.data?.path, dataForEvents.data?.filename),
  );

  /* for filtered data includes pagination... */
  const [dataFileFilters, setDataFileFilters] = React.useState({});
  const [dataFolderFilters, setDataFolderFilters] = React.useState({});
  const [currentFilePage, setCurrentFilePage] = useState(1);
  const [currentFolderPage, setCurrentFolderPage] = useState(1);
  const [platform, setPlatform] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const useDataFavorite = useManageFavorites({
    userId: user?._id,
  });

  // const [viewMoreloading, setViewMoreLoading] = React.useState(null);

  // popup
  const [name, setName] = React.useState("");
  // const [isOpenMenu, setIsOpenMenu] = useState(false);

  //dialog

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);

  const [fileDetailsDialog, setFileDetailsDialog] = React.useState(false);

  const [shareDialog, setShareDialog] = React.useState(false);

  const [fileAction] = useMutation(MUTATION_ACTION_FILES);
  const handleGetFolderURLCCTv = useGetUrl(dataForEvents.data);

  React.useEffect(() => {
    if (folderId) {
      // localStorage.removeItem("folderId");
      localStorage.removeItem(folderIdLocalKey);
    }
  }, [navigate]);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    let pattern = /\((.*?)\)/;

    // Search for the pattern in the user agent string
    let match = userAgent.match(pattern);
    if (match) {
      let osInfo = match[1];
      let osName = osInfo.split(";")[0].trim().split(" ")[0];

      if (osName === "Linux") {
        //
        setPlatform("Android");
      } else if (osName === "iPhone") {
        setPlatform("iPhone");
      } else {
        setPlatform("Windows");
      }
    }
  }, []);

  const handleOpenPasswordLink = () => {
    setIsPasswordLink(true);
  };
  const handleClosePasswordLink = () => {
    setIsPasswordLink(false);
    resetDataForEvents();
  };

  const customGetFolders = () => {
    getFolders({
      variables: {
        where: {
          status: "active",
          pin: 1,
          createdBy: user._id,
        },
        ...(dataFolderFilters.skip && {
          skip: dataFolderFilters.skip,
        }),
        orderBy: "updatedAt_DESC",
        limit: ITEM_PER_PAGE_LIST,
      },
    });
  };

  const customGetFiles = () => {
    getFiles({
      variables: {
        where: {
          status: "active",
          favorite: 1,
          createdBy: user._id,
        },
        ...(dataFileFilters.skip && {
          skip: dataFileFilters.skip,
        }),
        orderBy: "updatedAt_DESC",
        limit: ITEM_PER_PAGE_LIST,
      },
    });
  };

  const customGetFilesForGrid = () => {
    getFilesForGrid({
      variables: {
        where: {
          status: "active",
          favorite: 1,
          createdBy: user._id,
        },
        orderBy: "actionDate_DESC",
        limit: limitScroll,
      },
    });
  };

  React.useEffect(() => {
    const dataViewMode = useDataSetting.data?.find(
      (data) => data?.productKey === settingKeys.viewMode,
    );

    if (!!dataViewMode) {
      const localStorageToggled = localStorage.getItem("toggle");
      if (localStorageToggled) {
        setToggle(localStorageToggled === "list" ? "list" : "grid");
      } else {
        setToggle(dataViewMode?.action || "list");
        localStorage.setItem("toggle", dataViewMode?.action || "list");
      }
    }
  }, [useDataSetting.data]);

  React.useEffect(() => {
    customGetFiles();
  }, [toggle]);

  React.useEffect(() => {
    customGetFilesForGrid();
  }, [limitScroll, toggle]);

  React.useEffect(() => {
    if (!_.isEmpty(dataForEvents.data) && dataForEvents.action === "get link") {
      handleGetFolderURLCCTv(dataForEvents.data);
      setDataForEvents((prev) => {
        return {
          ...prev,
          action: "",
        };
      });
    }
  }, [dataForEvents.action]);

  useEffect(() => {
    if (isAutoClose) {
      resetDataForEvents();
    }
  }, [isAutoClose]);

  /* folders pagination */
  React.useEffect(() => {
    if (!isFirstRender) {
      setDataFolderFilters((prevState) => {
        const result = {
          ...prevState,
          skip: (currentFolderPage - 1) * ITEM_PER_PAGE_LIST,
        };
        if (currentFolderPage - 1 === 0) {
          delete result.skip;
        }
        return result;
      });
    }
  }, [currentFolderPage]);

  React.useEffect(() => {
    if (!isFirstRender) {
      // customGetFolders();
    }
  }, [dataFolderFilters]);

  /* files pagination */
  React.useEffect(() => {
    if (!isFirstRender) {
      setDataFileFilters((prevState) => {
        const result = {
          ...prevState,
          skip: (currentFilePage - 1) * ITEM_PER_PAGE_LIST,
        };
        if (currentFilePage - 1 === 0) {
          delete result.skip;
        }
        return result;
      });
    }
  }, [currentFilePage]);

  React.useEffect(() => {
    if (!isFirstRender) {
      customGetFiles();
    }
  }, [dataFileFilters]);

  React.useEffect(() => {
    const queryData = dataFiles?.files?.data;
    if (dataFiles) {
      setDataFilesAndFolders(() => {
        const result = {
          data: dataFiles?.files?.data?.map((data) => ({
            ...data,
            id: data._id,
          })),
          total: dataFiles?.files?.total,
        };
        return result;
      });
    }
    if (queryData !== undefined) {
      if (queryData.length > 0) {
        setIsDataFavoriteFilesFound(true);
      } else {
        setIsDataFavoriteFilesFound(false);
      }
    }
  }, [dataFiles?.files?.data]);

  React.useEffect(() => {
    const queryData = dataFilesForGrid?.files?.data;
    if (dataFilesForGrid) {
      setDataFilesAndFoldersForGrid(() => {
        const result = {
          data: dataFilesForGrid?.files?.data?.map((data) => ({
            ...data,
            id: data._id,
          })),
          total: dataFilesForGrid?.files?.total,
        };
        return result;
      });
    }
    if (queryData !== undefined) {
      if (queryData.length > 0) {
        setIsDataFavoriteFilesFound(true);
      } else {
        setIsDataFavoriteFilesFound(false);
      }
    }
  }, [dataFilesForGrid?.files?.data]);

  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: null,
      type: null,
    }));
  };

  useEffect(() => {
    if (dataForEvents.action && dataForEvents.data) {
      menuOnClick(dataForEvents.action);
    }
  }, [dataForEvents.action]);

  const menuOnClick = async (action) => {
    setIsAutoClose(true);
    switch (action) {
      case "download":
        if (dataForEvents.type === "folder") {
          await handleDownloadFolders();
        } else {
          await handleDownloadFiles();
        }
        break;
      case "delete":
        /* setDeleteDialogOpen(true); */
        await handleDeleteFilesAndFolders();
        break;
      case "rename":
        setRenameDialogOpen(true);
        break;
      case "favourite":
        handleAddFavourite();
        break;

      case "password":
        handleOpenPasswordLink();
        break;
      case "pin":
        handleAddPin();
        break;
      case "preview":
        setShowPreview(true);
        break;

      case "detail":
        setFileDetailsDialog(true);
        break;
      case "share":
        setShareDialog(true);
        break;
      default:
        return;
    }
  };

  // File action for count in recent file
  const handleActionFile = async (val) => {
    try {
      await fileAction({
        variables: {
          fileInput: {
            createdBy: parseInt(user._id),
            fileId: parseInt(dataForEvents.data._id),
            actionStatus: val,
          },
        },
      });
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const getDirectoryItems = async (directory) => {
    const options = {
      method: "GET",
      url:
        REACT_APP_BUNNY_API +
        user.username +
        "/" +
        dataForEvents.data.path +
        "/" +
        directory +
        "/",
      headers: {
        accept: "application/json",
        AccessKey: REACT_APP_ACCESSKEY_BUNNY,
      },
    };
    const response = await axios.request(options);

    return response.data;
  };

  /* handle download folders */
  const handleDownloadFolders = async () => {
    setIsAutoClose(true);
    if (dataForEvents.data?.file_id[0]?._id) {
      setShowProgressing(true);
      const options = {
        method: "GET",
        url:
          "https://sg.storage.bunnycdn.com/vshare/" +
          user.username +
          "/" +
          dataForEvents.data?.path +
          "/",
        headers: {
          accept: "application/json",
          AccessKey: REACT_APP_ACCESSKEY_BUNNY,
        },
      };
      try {
        const response = await axios.request(options);

        const zipData = response.data;

        const downloadName = extractDirectoryName(zipData[0].Path);
        const zip = new JSZip();
        let loaded = 0;
        const secretKey = REACT_APP_BUNNY_SECRET_KEY;

        // Recursive function to add files and folders to the zip
        const addFilesAndFolders = async (directory, items) => {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.IsDirectory) {
              const subdirectory = directory
                ? directory + "/" + item.ObjectName
                : item.ObjectName;
              const subitems = await getDirectoryItems(subdirectory);
              await addFilesAndFolders(subdirectory, subitems);
            } else {
              const file_name = extractFileNames(
                Base64.decode(CutFileType(item.ObjectName)),
              );
              const headers = {
                accept: "*/*",
                storageZoneName: REACT_APP_STORAGE_ZONE,
                path: user.username + "/" + dataForEvents.data?.path,
                fileName: CryptoJS.enc.Utf8.parse(item.ObjectName),
                AccessKey: REACT_APP_ACCESSKEY_BUNNY,
              };
              const encryptedHeaders = CryptoJS.AES.encrypt(
                JSON.stringify(headers),
                secretKey,
              ).toString();

              const response = await fetch(REACT_APP_DOWNLOAD_URL, {
                headers: { encryptedHeaders },
              });

              const blob = await response.blob();
              zip.folder(directory).file(file_name, blob);
              loaded += 1;
              const percentage = Math.round((loaded / zipData.length) * 100);
              setProgressing(percentage);
              setProcesing(true);
            }
          }
        };

        // Get the items in the root directory and add them to the zip
        const rootItems = await getDirectoryItems("");
        await addFilesAndFolders("", rootItems);

        // Generate the zip file and download it
        zip.generateAsync({ type: "blob" }).then((content) => {
          const url = URL.createObjectURL(content);
          const a = document.createElement("a");
          a.href = url;
          a.download = downloadName;
          a.click();
          URL.revokeObjectURL(url);
        });
        setIsAutoClose(true);
        successMessage("Download successfully!!", 2000);
        setShowProgressing(false);
        setProcesing(false);
        // setIsOpenMenu(false);
        foldersRefetch({
          variables: {
            where: {
              status: "active",
              createdBy: user._id,
            },
            orderBy: "updatedAt_DESC",
            limit: ITEM_PER_PAGE_LIST,
          },
        });
      } catch (error) {
        errorMessage(error, 2000);
      }
    } else {
      errorMessage("folder empty", 3000);
    }
    resetDataForEvents();
  };

  const handleDownloadFiles = async () => {
    setShowProgressing(true);
    let real_path;
    if (dataForEvents.data.newPath === null) {
      real_path = "";
    } else {
      real_path = truncateName(dataForEvents.data.newPath);
    }
    try {
      const headers = {
        accept: "*/*",
        storageZoneName: REACT_APP_STORAGE_ZONE,
        isFolder: false,
        path:
          user.newName +
          "-" +
          user._id +
          "/" +
          real_path +
          "/" +
          dataForEvents.data.newFilename,
        fileName: CryptoJS.enc.Utf8.parse(dataForEvents.data.filename),
        AccessKey: REACT_APP_ACCESSKEY_BUNNY,
        createdBy: user?._id,
      };

      const encryptedHeaders = CryptoJS.AES.encrypt(
        JSON.stringify(headers),
        REACT_APP_BUNNY_SECRET_KEY,
      ).toString();

      const response = await fetch(REACT_APP_DOWNLOAD_URL, {
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
      }

      if (countPercentage === 100) {
        setShowProgressing(false);
        setProcesing(false);
        successMessage("Download successful!!", 2000);
        setIsAutoClose(true);
        await updateFile({
          variables: {
            where: {
              _id: dataForEvents.data._id,
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
              _id: dataForEvents.data._id,
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
      link.download = dataForEvents.data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDataForEvents((state) => ({
        ...state,
        action: null,
        data: {
          ...state.data,
          totalDownload: dataForEvents.data.totalDownload + 1,
        },
      }));
      // await handleActionFile("download");

      if (toggle === "grid") {
        filesRefetchForGrid();
      } else {
        filesRefetch();
      }
      setFileDetailsDialog(false);
    } catch (error) {
      errorMessage(error, 2000);
    }
  };

  const handleDeleteFilesAndFolders = async () => {
    try {
      if (dataForEvents.type === "folder") {
        await updateFolder({
          variables: {
            where: {
              _id: dataForEvents.data._id,
            },
            data: {
              status: "deleted",
              createdBy: user._id,
            },
          },
          onCompleted: async () => {
            setDeleteDialogOpen(false);
            successMessage("Delete folder successful!!", 2000);
            resetDataForEvents();
            setIsAutoClose(true);
            foldersRefetch({
              variables: {
                where: {
                  status: "active",
                  pin: 1,
                  createdBy: user._id,
                },
                orderBy: "updatedAt_DESC",
                limit: ITEM_PER_PAGE_LIST,
              },
            });
          },
        });
      } else {
        await updateFile({
          variables: {
            where: {
              _id: dataForEvents.data._id,
            },
            data: {
              status: "deleted",
              createdBy: user._id,
            },
          },
          onCompleted: async () => {
            setDeleteDialogOpen(false);
            successMessage("Delete file successful", 2000);
            resetDataForEvents();
            if (toggle === "grid") {
              filesRefetchForGrid();
            } else {
              filesRefetch();
            }
          },
        });
      }
    } catch (err) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const handleRename = async () => {
    try {
      if (dataForEvents.type === "folder") {
        await updateFolder({
          variables: {
            where: {
              _id: dataForEvents.data._id,
              checkFolder: dataForEvents.data.checkFolder,
            },
            data: {
              folder_name: name,
              updatedBy: user._id,
            },
          },
          onCompleted: async () => {
            setIsAutoClose(true);
            customGetFolders();
            setRenameDialogOpen(false);
            successMessage("Update Folder successfull", 2000);
            resetDataForEvents();
          },
        });
      } else {
        await updateFile({
          variables: {
            where: {
              _id: dataForEvents.data._id,
            },
            data: {
              filename: name,
              updatedBy: user._id,
            },
          },
          onCompleted: async () => {
            setIsAutoClose(true);
            if (toggle === "list") {
              filesRefetch();
            } else {
              filesRefetchForGrid();
            }
            setRenameDialogOpen(false);
            successMessage("Update File successfull", 2000);
            resetDataForEvents();
            await handleActionFile("edit");
          },
        });
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(
        handleGraphqlErrors(cutErr || "Something went wrong, Please try again"),
        2000,
      );
    }
  };

  const handleAddPin = async () => {
    try {
      await updateFolder({
        variables: {
          where: {
            _id: dataForEvents.data._id,
          },
          data: {
            pin: dataForEvents.data.pin ? 0 : 1,
            updatedBy: user._id,
          },
        },
        onCompleted: async () => {
          setIsAutoClose(true);
          setRenameDialogOpen(false);
          if (dataForEvents.data.pin) {
            successMessage("One File removed from Pin", 2000);
          } else {
            successMessage("One File added to Pin", 2000);
          }
          setDataForEvents((state) => ({
            action: null,
            data: {
              ...state.data,
              pin: dataForEvents.data.pin ? 0 : 1,
            },
          }));
          customGetFolders();
        },
      });
    } catch (error) {
      errorMessage(
        "Sorry!!. Something went wrong. Please try again later!!",
        2000,
      );
    }
  };

  const handleAddFavourite = async () => {
    try {
      await updateFile({
        variables: {
          where: {
            _id: dataForEvents.data._id,
          },
          data: {
            favorite: dataForEvents.data.favorite ? 0 : 1,
            updatedBy: user._id,
          },
        },
        onCompleted: async () => {
          setIsAutoClose(true);
          setRenameDialogOpen(false);
          /* setFileDetailsDialog(false); */
          if (dataForEvents.data.favorite) {
            successMessage("One File removed from Favourite", 2000);
          } else {
            successMessage("One File added to Favourite", 2000);
          }
          await handleActionFile("edit");
          setDataForEvents((state) => ({
            action: null,
            data: {
              ...state.data,
              favorite: dataForEvents.data.favorite ? 0 : 1,
            },
          }));
          setFileDetailsDialog(false);
          if (toggle === "list") {
            filesRefetch();
          } else {
            filesRefetchForGrid();
          }
        },
      });
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  useEffect(() => {
    if (dataForEvents.action) {
      if (dataForEvents.type === "folder") {
        setName(dataForEvents.data.folder_name);
      } else {
        setName(dataForEvents.data.filename);
      }
    }
  }, [renameDialogOpen]);

  const handleFileDetailDialogBreadcrumbFolderNavigate = async (link) => {
    await getFolders({
      variables: {
        where: {
          path: link,
          createdBy: user._id,
        },
      },
    });
  };

  return (
    <Fragment>
      {shareDialog && (
        <CreateShare
          onClose={() => {
            resetDataForEvents();
            setShareDialog(false);
          }}
          open={shareDialog}
          data={dataForEvents.data}
          refetch={loadingFolders || filesRefetch}
        />
      )}

      {!_.isEmpty(dataForEvents.data) && (
        <FileDetailsDialog
          iconTitle={<MdOutlineFavoriteBorder />}
          breadcrumb={{
            handleFolderNavigate:
              handleFileDetailDialogBreadcrumbFolderNavigate,
          }}
          title="Favourite"
          path={breadcrumbData}
          name={dataForEvents.data.filename || dataForEvents.data.folder_name}
          type={
            dataForEvents.data.fileType
              ? GetFileTypeFromFullType(dataForEvents.data.fileType)
              : CutFileType(dataForEvents.data.filename) || "folder"
          }
          displayType={
            dataForEvents.data.fileType ||
            GetFileType(dataForEvents.data.filename) ||
            "folder"
          }
          size={
            dataForEvents.data.size
              ? ConvertBytetoMBandGB(dataForEvents.data.size)
              : 0
          }
          dateAdded={moment(
            dataForEvents.data.createdAt,
            "YYYY-MM-DDTHH:mm:ss.SSS",
          ).format(DATE_PATTERN_FORMAT.datetime)}
          lastModified={moment(
            dataForEvents.data.updatedAt,
            "YYYY-MM-DDTHH:mm:ss.SSS",
          ).format(DATE_PATTERN_FORMAT.datetime)}
          totalDownload={dataForEvents.data.totalDownload}
          isOpen={fileDetailsDialog}
          // handleOnClose={(e, reason) => {
          onClose={() => {
            resetDataForEvents();
            setFileDetailsDialog(false);
          }}
          imageUrl={
            REACT_APP_BUNNY_PULL_ZONE +
            user.newName +
            "-" +
            user._id +
            "/" +
            (dataForEvents?.data?.newPath
              ? truncateName(dataForEvents.data?.newPath)
              : "") +
            dataForEvents?.data?.newFilename
          }
          {...{
            favouriteIcon: {
              isShow: true,
              handleFavouriteOnClick: async () => await handleAddFavourite(),
              isFavourite: dataForEvents.data.favorite ? true : false,
            },
            downloadIcon: {
              isShow: true,
              handleDownloadOnClick: async () => await handleDownloadFiles(),
            },
          }}
        />
      )}

      {showPreview && (
        <PreviewFile
          open={showPreview}
          handleClose={() => {
            resetDataForEvents();
            setShowPreview(false);
          }}
          onClick={handleDownloadFiles}
          filename={dataForEvents.data.filename}
          newFilename={dataForEvents.data.newFilename}
          fileType={dataForEvents.data.fileType}
          path={dataForEvents.data.newPath}
          user={user}
          userId={user._id}
        />
      )}

      <RenameDialogFile
        open={renameDialogOpen}
        onClose={() => {
          resetDataForEvents();
          setRenameDialogOpen(false);
        }}
        onSave={handleRename}
        title={"Rename file"}
        label={"Rename file"}
        setName={setName}
        defaultValue={dataForEvents.data.filename}
        name={name}
      />

      <AlertDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          resetDataForEvents();
        }}
        onClick={handleDeleteFilesAndFolders}
        title="Delete this item?"
        message={
          "If you click yes " +
          (dataForEvents.data.filename || dataForEvents.data.folder_name) +
          " will be deleted?"
        }
      />

      {showProgressing && (
        <ProgressingBar procesing={procesing} progressing={progressing} />
      )}
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <MUI_TOGLE.TitleAndSwitch>
          <MUI_TOGLE.SwitchItem>
            <Typography variant="h4">Favourite</Typography>
          </MUI_TOGLE.SwitchItem>

          {((isDataFavoriteFoldersFound !== null &&
            isDataFavoriteFoldersFound) ||
            (isDataFavoriteFilesFound !== null &&
              isDataFavoriteFilesFound)) && (
            <SwitchPages
              handleToggle={handleToggle}
              toggle={toggle === "grid" ? "grid" : "list"}
              setToggle={setToggle}
            />
          )}
        </MUI_TOGLE.TitleAndSwitch>

        <MUI.FavouriteContainer>
          {isDataFavoriteFilesFound !== null && isDataFavoriteFilesFound && (
            <>
              <MUI.FavouriteList>
                <>
                  <React.Fragment>
                    <MUI.FavouriteItem>
                      <Typography variant="h4" fontWeight="bold">
                        Files
                      </Typography>

                      <React.Fragment>
                        {toggle === "grid" && (
                          <Box>
                            {dataFilesLoadingForGrid &&
                            dataFilesAndFoldersForGrid?.data?.length ? (
                              <CardSkeleton />
                            ) : (
                              <FileCardContainer>
                                <>
                                  {dataFilesAndFoldersForGrid?.data?.map(
                                    (data, index) => {
                                      return (
                                        <FileCardItem
                                          cardProps={{
                                            onDoubleClick: () => {
                                              setDataForEvents({
                                                action: "preview",
                                                data,
                                              });
                                            },
                                          }}
                                          imageUrl={
                                            REACT_APP_BUNNY_PULL_ZONE +
                                            user.newName +
                                            "-" +
                                            user._id +
                                            "/" +
                                            (data?.newPath
                                              ? truncateName(data?.newPath)
                                              : "") +
                                            data?.newFilename
                                          }
                                          thumbnailImageUrl={
                                            REACT_APP_BUNNY_PULL_ZONE +
                                            user.newName +
                                            "-" +
                                            user._id +
                                            "/" +
                                            ENV_KEYS.REACT_APP_THUMBNAIL_PATH +
                                            "/" +
                                            getFilenameWithoutExtension(
                                              data?.newFilename,
                                            ) +
                                            `.${ENV_KEYS.REACT_APP_THUMBNAIL_EXTENSION}`
                                          }
                                          fileType={
                                            data.checkTypeItem === "folder"
                                              ? "folder"
                                              : GetFileTypeFromFullType(
                                                  data.fileType,
                                                )
                                          }
                                          name={data.filename}
                                          key={index}
                                          menuItems={menuItems?.map(
                                            (menuItem, index) => {
                                              return (
                                                <MenuDropdownItem
                                                  isFavorite={
                                                    data.favorite ? true : false
                                                  }
                                                  isPassword={
                                                    data.filePassword
                                                      ? true
                                                      : false
                                                  }
                                                  onClick={() => {
                                                    setDataForEvents({
                                                      action: menuItem.action,
                                                      data,
                                                    });
                                                  }}
                                                  key={index}
                                                  title={menuItem.title}
                                                  icon={menuItem.icon}
                                                />
                                              );
                                            },
                                          )}
                                        />
                                      );
                                    },
                                  )}
                                </>
                              </FileCardContainer>
                            )}
                          </Box>
                        )}
                        {toggle === "list" && (
                          <>
                            {dataFilesLoadingForList &&
                            dataFilesAndFolders.data ? (
                              <ListSkeleton />
                            ) : (
                              <FavouriteFilesDataGrid
                                pagination={{
                                  total: Math.ceil(
                                    dataFilesAndFolders.total /
                                      ITEM_PER_PAGE_LIST,
                                  ),
                                  currentPage: currentFilePage,
                                  setCurrentPage: setCurrentFilePage,
                                }}
                                data={dataFilesAndFolders.data}
                                total={dataFilesAndFolders.total}
                                handleEvent={(action, data) => {
                                  setDataForEvents({
                                    action,
                                    data,
                                  });
                                }}
                              />
                            )}
                          </>
                        )}
                      </React.Fragment>
                    </MUI.FavouriteItem>
                  </React.Fragment>
                </>
              </MUI.FavouriteList>
            </>
          )}
          {
            /* isDataFavoriteFoldersFound !== null &&
          !isDataFavoriteFoldersFound && */
            isDataFavoriteFilesFound !== null && !isDataFavoriteFilesFound && (
              <Empty
                icon={<Icon.FavouriteEmptyIcon />}
                title="No Favourite files"
                context="Add favourite to things that you want to easily find later"
              />
            )
          }
        </MUI.FavouriteContainer>
      </Box>

      <CreateFilePasswordDialog
        isOpen={isPasswordLink}
        dataValue={dataForEvents.data}
        filename={dataForEvents.data?.filename}
        isUpdate={dataForEvents.data?.filePassword ? true : false}
        checkType="file"
        onConfirm={() => {
          if (toggle === "list") {
            filesRefetch();
          } else {
            filesRefetchForGrid();
          }
        }}
        onClose={handleClosePasswordLink}
      />
    </Fragment>
  );
}

export default Index;
