import { useLazyQuery, useMutation } from "@apollo/client";
import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import streamSaver from "streamsaver";

// material ui icon and component
import { Typography } from "@mui/material";
import SwitchPages from "../components/SwitchPages";
import ProgressingBar from "../components/progressingBar";

// componento
import useAuth from "../../../hooks/useAuth";
import * as MUI from "../css/extendFolderStyle";

// graphql
import {
  MUTATION_ACTION_FILES,
  MUTATION_DELETE_SHARE,
  MUTATION_FILES,
  MUTATION_FOLDERS,
  QUERY_FOLDERS,
} from "./apollo";

//function
import _ from "lodash";
import moment from "moment";
import { CSVLink } from "react-csv";
import { QUERY_RENDER_FOLDER } from "../../../client-components/sidebar/apollo/SidebarApollo";
import { errorMessage, successMessage } from "../../../components/Alerts";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import FileDetailsDialog from "../../../components/FileDetailsDialog";
import AlertDialog from "../../../components/deleteDialog";
import { ENV_KEYS } from "../../../constants";
import { EventUploadTriggerContext } from "../../../contexts/EventUploadTriggerContext";
import { FolderContext } from "../../../contexts/FolderContext";
import {
  ConvertBytetoMBandGB,
  CutFileType,
  GetFileType,
  GetFileTypeFromFullType,
  encryptData,
  folderIdLocalKey,
  getFilenameWithoutExtension,
  handleGraphqlErrors,
  truncateName,
} from "../../../functions";
import useBreadcrumbData from "../../../hooks/useBreadcrumbData";
import useExportCSV from "../../../hooks/useExportCSV";
import useFirstRender from "../../../hooks/useFirstRender";
import useGetUrlExtendFolder from "../../../hooks/useGetUrlExtendFolder";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
import CreateFileDropDialog from "../components/CreateFileDropDialog";
import CreateShare from "../components/CreateShare";
import ExtendFilesDataGrid from "../components/ExtendFileDataGrid";
import ExtendFoldersDataGrid from "../components/ExtendFolderDataGrid";
import PreviewFile from "../components/PreviewFile";
import RenameDialogFile from "../components/RenameDialogFile";
import FileCardContainer from "../components/file/FileCardContainer";
import FileCardItem from "../components/file/FileCardItem";
import MenuDropdownItem from "../components/menu/MenuDropdownItem";
import { useMenuDropdownState } from "../components/menu/MenuDropdownProvider";
import menuItems, { favouriteMenuItems } from "../components/menu/MenuItems";
import CreateFilePasswordDialog from "../components/slider/CreateFilePasswordDialog";
import { CREATE_FILEDROP_LINK_CLIENT } from "../file-drop/apollo";
import useFetchFolders from "./hooks/useFetchFolders";
import useFetchSubFoldersAndFiles from "./hooks/useFetchSubFoldersAndFiles";

const {
  REACT_APP_STORAGE_ZONE,
  REACT_APP_BUNNY_SECRET_KEY,
  REACT_APP_BUNNY_PULL_ZONE,
  REACT_APP_ACCESSKEY_BUNNY,
  REACT_APP_DOWNLOAD_URL,
} = process.env;

const ITEM_PER_PAGE = 10;

function Index() {
  const params = useParams();
  const isFirstRender = useFirstRender();
  // const [dataFilesAndFolders, setDataFilesAndFolders] = useState([null, null]);
  const navigate = useNavigate();
  const [toggle, setToggle] = React.useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const parentFolderUrl = Base64.decode(params.id);

  const handleToggle = (value) => {
    setToggle(value);
    localStorage.setItem("toggle", value);
  };
  // const [getFiles, { refetch: filesRefetch }] = useLazyQuery(QUERY_FILES, {
  //   fetchPolicy: "no-cache",
  // });

  const [getFolders] = useLazyQuery(QUERY_FOLDERS, {
    fetchPolicy: "no-cache",
  });
  const [createFileDropLink] = useMutation(CREATE_FILEDROP_LINK_CLIENT);
  const [updateFile] = useMutation(MUTATION_FILES);
  const [updateFolder] = useMutation(MUTATION_FOLDERS, {
    refetchQueries: [QUERY_RENDER_FOLDER],
  });
  const [deleteShareFileAndFolder] = useMutation(MUTATION_DELETE_SHARE, {
    fetchPolicy: "no-cache",
  });
  const { setFolderId, trackingFolderData } = React.useContext(FolderContext);
  const { user: userAuth } = useAuth();
  const user = userAuth;
  const { data: parentFolder } = useFetchFolders({
    folderUrl: parentFolderUrl,
    userId: user?._id,
  });

  const fetchSubFoldersAndFiles = useFetchSubFoldersAndFiles({
    id: parentFolder?._id,
    toggle,
    currentPage: 1,
  });

  const breadCrumbData = useBreadcrumbData(parentFolder?.path);
  const [progressing, setProgressing] = React.useState(0);
  const [procesing, setProcesing] = React.useState(true);
  const [showProgressing, setShowProgressing] = React.useState(false);

  const [showPreview, setShowPreview] = React.useState(false);
  const [isPasswordLink, setIsPasswordLink] = useState(false);
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });

  // using export csv
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

  /* for filtered data includes pagination... */
  const [dataFolderFilters, setDataFolderFilters] = React.useState({});
  const [currentFilePage, setCurrentFilePage] = useState(1);
  const { setIsAutoClose } = useMenuDropdownState();
  const [currentFolderPage, setCurrentFolderPage] = useState(1);

  // const [viewMoreloading, setViewMoreLoading] = React.useState(null);

  // popup
  const [name, setName] = React.useState("");
  // const [isOpenMenu, setIsOpenMenu] = useState(false);

  //dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [openFileDrop, setOpenFileDrop] = useState(false);

  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);

  const [fileDetailsDialog, setFileDetailsDialog] = React.useState(false);

  const [shareDialog, setShareDialog] = React.useState(false);
  const [fileAction] = useMutation(MUTATION_ACTION_FILES);

  const eventUploadTrigger = React.useContext(EventUploadTriggerContext);
  const handleGetFolderURL = useGetUrlExtendFolder(dataForEvents.data);

  React.useEffect(() => {
    if (!_.isEmpty(dataForEvents.data) && dataForEvents.action === "get link") {
      setIsAutoClose(true);
      handleGetFolderURL(dataForEvents.data);
      resetDataForEvents();
    }
  }, [dataForEvents.action]);

  /* data for Breadcrumb */
  const breadcrumbDataForFileDetails = useBreadcrumbData(
    breadCrumbData?.join("/"),
    dataForEvents.data.name,
  );

  React.useEffect(() => {
    const localStorageToggled = localStorage.getItem("toggle");
    if (localStorageToggled) {
      setToggle(localStorageToggled === "list" ? "list" : "grid");
    }
  }, []);

  useEffect(() => {
    if (parentFolder?._id) {
      setFolderId(parentFolder?._id);
    }
    return () => {
      setFolderId(0);
    };
  }, [parentFolder]);

  /* folders pagination */
  React.useEffect(() => {
    if (!isFirstRender) {
      setDataFolderFilters((prevState) => {
        const result = {
          ...prevState,
          skip: (currentFolderPage - 1) * ITEM_PER_PAGE,
        };
        if (currentFolderPage - 1 === 0) {
          delete result.skip;
        }
        return result;
      });
    }
  }, [currentFolderPage]);

  React.useEffect(() => {
    if (parentFolder?._id) {
      // localStorage.setItem("folderId", parentFolder?._id);
      const folderEncrypted = encryptData(JSON.stringify(parentFolder?._id));
      localStorage.setItem(folderIdLocalKey, folderEncrypted);
    }
  }, [parentFolder]);

  const handleOpenPasswordLink = () => {
    setIsPasswordLink(true);
  };
  const handleClosePasswordLink = () => {
    setIsPasswordLink(false);
    resetDataForEvents();
  };

  const customGetSubFoldersAndFiles = () => {
    fetchSubFoldersAndFiles.getData({
      variables: {
        where: {
          _id: parentFolder?._id,
        },
        orderBy: "updatedAt_DESC",
      },
    });
  };

  React.useEffect(() => {
    if (eventUploadTrigger.triggerData.isTriggered && parentFolder?._id) {
      customGetSubFoldersAndFiles();
    }
  }, [eventUploadTrigger.triggerData]);

  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: "",
      type: null,
    }));
  };

  function handleCloseFileDrop() {
    setOpenFileDrop(false);
  }

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
        await handleDeleteFilesAndFolders();
        break;
      case "rename":
        setRenameDialogOpen(true);
        break;

      case "password":
        let row = dataForEvents.data;

        if (row.checkTypeItem === "folder") {
          if (row.access_passwordFolder) {
            setIsUpdate(true);
          } else {
            setIsUpdate(false);
          }
        } else {
          if (row.password) {
            setIsUpdate(true);
          } else {
            setIsUpdate(false);
          }
        }
        handleOpenPasswordLink();
        break;

      case "filedrop":
        setOpenFileDrop(true);
        setDataForEvents((state) => {
          return {
            ...state,
            action: "",
          };
        });
        break;
      case "favourite":
        handleAddFavourite();
        break;
      case "pin":
        handleAddPin();
        break;
      case "preview":
        setShowPreview(true);
        break;
      case "get link":
        break;
      case "detail":
        setFileDetailsDialog(true);
        break;
      case "export-csv":
        setCsvFolder({
          folderId: dataForEvents.data?._id,
          folderName: dataForEvents.data?.name + ".csv",
        });

        resetDataForEvents();
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
      errorMessage(error, 2000);
    }
  };

  /* handle download folders */
  streamSaver.mitm = "/mitm.html";
  const handleDownloadFolders = async () => {
    setShowProgressing(true);
    const folder_name = `${dataForEvents.data?.name}.zip`;
    try {
      const headers = {
        accept: "/",
        storageZoneName: REACT_APP_STORAGE_ZONE,
        isFolder: true,
        path: user.newName + "-" + user._id + "/" + dataForEvents.data.newPath,
        fileName: CryptoJS.enc.Utf8.parse(folder_name),
        AccessKey: REACT_APP_ACCESSKEY_BUNNY,
        _id: dataForEvents.data._id,
      };
      const encryptedHeaders = CryptoJS.AES.encrypt(
        JSON.stringify(headers),
        REACT_APP_BUNNY_SECRET_KEY,
      ).toString();
      const response = await fetch(REACT_APP_DOWNLOAD_URL, {
        headers: { encryptedHeaders },
      });
      const fileStream = streamSaver.createWriteStream(folder_name);
      response.body
        .pipeTo(fileStream)
        .then(() => {
          successMessage("Download successfull", 2000);
        })
        .catch((error) => {
          errorMessage(error, 2000);
        });
    } catch (error) {
      errorMessage(error, 2000);
    }
    setShowProgressing(false);
    // setIsOpenMenu(false);
    setIsAutoClose(false);
    resetDataForEvents();
  };

  const handleCreateFileDrop = async (link, date) => {
    try {
      let fileDropLink = await createFileDropLink({
        variables: {
          input: {
            url: link,
            expiredAt: date,
            folderId: dataForEvents.data?._id,
          },
        },
      });
      if (fileDropLink?.data?.createDrop?._id) {
        successMessage("Create file-drop link success!", 2000);
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
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
          dataForEvents.data.newName,
        fileName: CryptoJS.enc.Utf8.parse(dataForEvents.data.name),
        AccessKey: REACT_APP_ACCESSKEY_BUNNY,
        createdBy: user._id,
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
        // await handleActionFile("download");
      }
      if (countPercentage === 100) {
        setShowProgressing(false);
        setProcesing(false);
        successMessage("Download successful!!", 2000);
        setIsAutoClose(true);
        setShowPreview(false);
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
      link.download = dataForEvents.data.name;
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
      customGetSubFoldersAndFiles();
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
            customGetSubFoldersAndFiles();
            setIsAutoClose(true);
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
            successMessage("Delete file successful!!", 2000);
            customGetSubFoldersAndFiles();
            resetDataForEvents();
            setIsAutoClose(true);
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
              checkFolder: dataForEvents.data.check,
            },
            data: {
              folder_name: name,
              updatedBy: user._id,
            },
          },
          onCompleted: async () => {
            setIsAutoClose(true);
            customGetSubFoldersAndFiles();
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
            customGetSubFoldersAndFiles();
            setRenameDialogOpen(false);
            successMessage("Update File successfull", 2000);
            await handleActionFile("edit");
            resetDataForEvents();
          },
        });
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
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
          customGetSubFoldersAndFiles();
        },
      });
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
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
          customGetSubFoldersAndFiles();
        },
      });
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  useEffect(() => {
    if (dataForEvents.data) {
      setName(dataForEvents.data.name);
    }
  }, [dataForEvents.data]);

  const handleFolderNavigate = async (path) => {
    const result = await getFolders({
      variables: {
        where: {
          path,
          createdBy: user._id,
        },
      },
    });

    if (result) {
      const [dataById] = result.data?.folders?.data;

      const base64URL = Base64.encodeURI(dataById.url);
      navigate(`/folder/${base64URL}`);
    }
  };

  const handleDoubleClick = (data) => {
    const base64URL = Base64.encodeURI(data.url);
    navigate(`/folder/${base64URL}`);
  };

  return (
    <React.Fragment>
      {shareDialog && (
        <CreateShare
          onClose={() => {
            setShareDialog(false);
            resetDataForEvents();
          }}
          open={shareDialog}
          data={{
            ...dataForEvents.data,
            folder_type: dataForEvents.data?.checkTypeItem === "folder" ?? "",
            folder_name: dataForEvents.data.name,
            filename: dataForEvents.data.name,
          }}
          ownerId={{
            ...dataForEvents.data,
            _id: dataForEvents.data?.createdBy?._id,
            newName: dataForEvents.data?.createdBy?.newName,
          }}
        />
      )}

      {!_.isEmpty(dataForEvents.data) && (
        <FileDetailsDialog
          path={breadcrumbDataForFileDetails}
          name={dataForEvents.data.name || dataForEvents.data.name}
          breadcrumb={{
            handleFolderNavigate: handleFolderNavigate,
          }}
          type={
            dataForEvents.data.type
              ? GetFileTypeFromFullType(dataForEvents.data.type)
              : CutFileType(dataForEvents.data.name) || "folder"
          }
          displayType={
            dataForEvents.data.type ||
            GetFileType(dataForEvents.data.name) ||
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
            dataForEvents?.data?.newName
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
          filename={dataForEvents.data.name}
          newFilename={dataForEvents.data.newName}
          fileType={dataForEvents.data.type}
          path={dataForEvents.data.newPath}
          user={user}
        />
      )}
      <RenameDialogFile
        open={renameDialogOpen}
        onClose={() => {
          resetDataForEvents();
          setRenameDialogOpen(false);
        }}
        onSave={handleRename}
        title={
          dataForEvents.type === "folder" ? "Rename folder" : "Rename file"
        }
        label={
          dataForEvents.type === "folder" ? "Rename folder" : "Rename file"
        }
        isFolder={dataForEvents.type === "folder" ? true : false}
        defaultValue={dataForEvents?.data?.name}
        name={name}
        setName={setName}
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
          (dataForEvents.data.name || dataForEvents.data.name) +
          " will be deleted?"
        }
      />
      {showProgressing && (
        <ProgressingBar procesing={procesing} progressing={progressing} />
      )}

      <MUI.ExtendContainer>
        <MUI.TitleAndSwitch className="title-n-switch">
          <BreadcrumbNavigate
            title="my Cloud"
            titlePath="/my-cloud"
            user={user}
            path={breadCrumbData}
            folderId={parentFolder?._id}
            handleNavigate={handleFolderNavigate}
          />
          {fetchSubFoldersAndFiles.isDataFound !== null &&
            fetchSubFoldersAndFiles.isDataFound && (
              <SwitchPages
                handleToggle={handleToggle}
                toggle={toggle === "grid" ? "grid" : "list"}
                setToggle={setToggle}
              />
            )}
        </MUI.TitleAndSwitch>
        {fetchSubFoldersAndFiles.isDataFound !== null &&
          fetchSubFoldersAndFiles.isDataFound && (
            <>
              <MUI.ExtendList>
                <React.Fragment>
                  {fetchSubFoldersAndFiles.data.folders.data.length > 0 && (
                    <MUI.ExtendItem>
                      <Typography variant="h4" fontWeight="bold">
                        Folders
                      </Typography>
                      <React.Fragment>
                        {toggle === "grid" && (
                          <React.Fragment>
                            <FileCardContainer>
                              {fetchSubFoldersAndFiles.data.folders.data.map(
                                (data, index) => {
                                  return (
                                    <FileCardItem
                                      cardProps={{
                                        onDoubleClick: () => {
                                          handleDoubleClick(data);
                                        },
                                      }}
                                      isContainFiles={data.isContainsFiles}
                                      fileType="folder"
                                      isPinned={data.pin ? true : false}
                                      name={data.name}
                                      key={index}
                                      menuItems={favouriteMenuItems.map(
                                        (menuItem, index) => {
                                          return (
                                            <MenuDropdownItem
                                              {...(!data.isContainsFiles
                                                ? menuItem.action ===
                                                    "get link" ||
                                                  menuItem.action === "share" ||
                                                  menuItem.action ===
                                                    "download" ||
                                                  menuItem.action ===
                                                    "password" ||
                                                  menuItem.action ===
                                                    "export-csv"
                                                  ? {
                                                      disabled: true,
                                                    }
                                                  : {
                                                      onClick: () => {
                                                        setDataForEvents({
                                                          action:
                                                            menuItem.action,
                                                          type: "folder",
                                                          data,
                                                        });
                                                      },
                                                    }
                                                : {
                                                    onClick: () => {
                                                      setDataForEvents({
                                                        action: menuItem.action,
                                                        type: "folder",
                                                        data,
                                                      });
                                                    },
                                                  })}
                                              isPinned={data.pin ? true : false}
                                              isPassword={
                                                data?.access_passwordFolder
                                                  ? true
                                                  : false
                                              }
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
                            </FileCardContainer>
                          </React.Fragment>
                        )}
                        {toggle !== "grid" && (
                          <ExtendFoldersDataGrid
                            isFromSharingUrl={false}
                            pagination={{
                              total: Math.ceil(
                                fetchSubFoldersAndFiles.data.folders.total /
                                  ITEM_PER_PAGE,
                              ),
                              currentPage: currentFolderPage,
                              setCurrentPage: setCurrentFolderPage,
                            }}
                            data={fetchSubFoldersAndFiles.data.folders.data}
                            user={user}
                            handleEvent={(action, data) => {
                              setDataForEvents({
                                action,
                                type: "folder",
                                data,
                              });
                            }}
                          />
                        )}
                      </React.Fragment>
                    </MUI.ExtendItem>
                  )}
                  {fetchSubFoldersAndFiles.data.files.data.length > 0 && (
                    <MUI.ExtendItem>
                      <Typography variant="h4" fontWeight="bold">
                        Files
                      </Typography>
                      <React.Fragment>
                        {toggle === "grid" && (
                          <FileCardContainer>
                            {fetchSubFoldersAndFiles.data.files.data.map(
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
                                      (data.newPath
                                        ? truncateName(data.newPath)
                                        : "") +
                                      data.newName
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
                                        data.newName,
                                      ) +
                                      `.${ENV_KEYS.REACT_APP_THUMBNAIL_EXTENSION}`
                                    }
                                    fileType={GetFileTypeFromFullType(
                                      data.type,
                                    )}
                                    name={data.name}
                                    key={index}
                                    menuItems={menuItems.map(
                                      (menuItem, index) => {
                                        return (
                                          <MenuDropdownItem
                                            isFavorite={
                                              data.favorite ? true : false
                                            }
                                            isPassword={
                                              data.password ? true : false
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
                          </FileCardContainer>
                        )}
                        {toggle === "list" && (
                          <ExtendFilesDataGrid
                            isFromSharingUrl={false}
                            pagination={{
                              total: Math.ceil(
                                fetchSubFoldersAndFiles.data.files.total /
                                  ITEM_PER_PAGE,
                              ),
                              currentPage: currentFilePage,
                              setCurrentPage: setCurrentFilePage,
                            }}
                            user={user}
                            data={fetchSubFoldersAndFiles.data.files.data}
                            handleEvent={(action, data) => {
                              setDataForEvents({
                                action,
                                data,
                              });
                            }}
                          />
                        )}
                      </React.Fragment>
                    </MUI.ExtendItem>
                  )}
                </React.Fragment>
              </MUI.ExtendList>
            </>
          )}
      </MUI.ExtendContainer>

      <CreateFileDropDialog
        isOpen={openFileDrop}
        onClose={handleCloseFileDrop}
        handleChange={handleCreateFileDrop}
      />

      <CreateFilePasswordDialog
        isOpen={isPasswordLink}
        dataValue={dataForEvents.data}
        isUpdate={isUpdate}
        filename={dataForEvents.data?.name}
        checkType={dataForEvents.data?.checkTypeItem}
        onConfirm={() => {
          customGetSubFoldersAndFiles();
        }}
        onClose={handleClosePasswordLink}
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

export default Index;
