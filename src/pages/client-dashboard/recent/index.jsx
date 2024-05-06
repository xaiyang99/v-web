import { useLazyQuery, useMutation } from "@apollo/client";
import CryptoJS from "crypto-js";
import { Fragment, useContext, useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { TbDownload, TbUpload } from "react-icons/tb";
import {
  MUTATION_ACTION_FILE,
  MUTATION_DELETE_RECENT_FILE,
  MUTATION_UPDATE_RECENT_FILE,
  QUERY_DESC_RECENT_FILE,
  QUERY_FOLDERS,
} from "./apollo";

// component
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import useFirstRender from "../../../hooks/useFirstRender";
import {
  DATE_PATTERN_FORMAT,
  isDateEarlierThisMonth,
  isDateEarlierThisWeek,
  isDateEarlierThisYear,
  isDateLastMonth,
  isDateLastWeek,
  isDateLastYear,
  isDateOnToday,
  isDateYesterday,
} from "../../../utils/date";
import RecentDataGrid from "../components/RecentDataGrid";
import SwitchPages from "../components/SwitchPages";
import FileCardContainer from "../components/file/FileCardContainer";
import FileCardItem from "../components/file/FileCardItem";
import ProgressingBar from "../components/progressingBar";
import * as MUI_TOGLE from "../css/folderStyle";
import * as MUI from "../css/recentFileStyle";

// icons
import { Base64 } from "js-base64";
import _ from "lodash";
import moment from "moment/moment";
import { BiTime } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../../../components/Alerts";
import FileDetailsDialog from "../../../components/FileDetailsDialog";
import AlertDialog from "../../../components/deleteDialog";
import { ENV_KEYS } from "../../../constants";
import { EventUploadTriggerContext } from "../../../contexts/EventUploadTriggerContext";
import { useSettingKey } from "../../../contexts/SettingKeyContext";
import {
  ConvertBytetoMBandGB,
  CutFileType,
  GetFileType,
  GetFileTypeFromFullType,
  getFilenameWithoutExtension,
  handleGraphqlErrors,
  truncateName,
} from "../../../functions";
import useBreadcrumbData from "../../../hooks/useBreadcrumbData";
import useGetUrl from "../../../hooks/useGetUrl";
import useScroll from "../../../hooks/useScrollDown";
import CreateShare from "../components/CreateShare";
import Empty from "../components/Empty";
import PreviewFile from "../components/PreviewFile";
import RenameDialogFile from "../components/RenameDialogFile";
import MenuDropdownItem from "../components/menu/MenuDropdownItem";
import { useMenuDropdownState } from "../components/menu/MenuDropdownProvider";
import menuItems from "../components/menu/MenuItems";
import CreateFilePasswordDialog from "../components/slider/CreateFilePasswordDialog";
import * as Icon from "./icons";

const {
  REACT_APP_STORAGE_ZONE,
  REACT_APP_BUNNY_SECRET_KEY,
  REACT_APP_BUNNY_PULL_ZONE,
  REACT_APP_ACCESSKEY_BUNNY,
  REACT_APP_DOWNLOAD_URL,
} = process.env;

function Index() {
  const { user } = useAuth();
  const settingKey = useSettingKey();
  const navigate = useNavigate();
  const [actionStatus, setActionStatus] = useState("all");
  const [dataRecentFiles, setDataRecentFiles] = useState(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  const isFirstRender = useFirstRender();
  const [isDataRecentFilesFound, setIsDataRecentFilesFound] = useState(null);
  const [isLoaded, setIsLoaded] = useState(null);
  const [getFolders] = useLazyQuery(QUERY_FOLDERS, { fetchPolicy: "no-cache" });
  const [
    getRecentFile,
    { data, loading: fileLoading, refetch: recentFileRefetch },
  ] = useLazyQuery(QUERY_DESC_RECENT_FILE, { fetchPolicy: "no-cache" });
  const [getRecentFileWithoutFiltering] = useLazyQuery(QUERY_DESC_RECENT_FILE, {
    fetchPolicy: "no-cache",
  });
  const [updateFile] = useMutation(MUTATION_UPDATE_RECENT_FILE);
  const [deleteRecentFile] = useMutation(MUTATION_DELETE_RECENT_FILE);
  const { setIsAutoClose, isAutoClose } = useMenuDropdownState();
  const eventUploadTrigger = useContext(EventUploadTriggerContext);
  const [total, setTotal] = useState(0);
  const [toggle, setToggle] = useState("list");

  const { limitScroll } = useScroll({ total, toggle });
  const handleToggle = (value) => {
    setToggle(value);
    localStorage.setItem("toggle", value);
  };

  const [progressing, setProgressing] = useState(0);
  const [isPasswordLink, setIsPasswordLink] = useState(false);
  const [procesing, setProcesing] = useState(true);
  const [showProgressing, setShowProgressing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dataForEvents, setDataForEvents] = useState({
    action: null,
    data: {},
  });

  /* data for Breadcrumb */
  const breadcrumbData = useBreadcrumbData(
    dataForEvents.data?.path ||
      (dataForEvents.data?.path, dataForEvents.data?.filename),
  );

  // popup
  const [name, setName] = useState("");

  //dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileDetailsDialog, setFileDetailsDialog] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  const [shareDialog, setShareDialog] = useState(false);
  const [dataGetUrl, setDataGetUrl] = useState(null);

  const [fileAction] = useMutation(MUTATION_ACTION_FILE);

  const handleGetFolderURL = useGetUrl(dataGetUrl);

  const handleOpenPasswordLink = () => {
    setIsPasswordLink(true);
  };

  const handleClosePasswordLink = () => {
    setIsPasswordLink(false);
    resetDataForEvents();
  };

  useEffect(() => {
    if (dataGetUrl) {
      handleGetFolderURL(dataGetUrl);
      setTimeout(() => {
        setDataGetUrl(null);
      }, 300);
    }
  }, [dataGetUrl]);

  const handleGetLink = async () => {
    await setDataGetUrl(dataForEvents.data);
    await setDataForEvents((prev) => {
      return {
        ...prev,
        action: "",
      };
    });
  };

  useEffect(() => {
    if (isAutoClose) {
      resetDataForEvents({});
    }
  }, [isAutoClose]);

  const customGetRecentFiles = () => {
    getRecentFile({
      variables: {
        where: {
          status: "active",
          createdBy: user._id,
          ...(actionStatus !== "all" && {
            actionStatus,
          }),
        },
        orderBy: "actionDate_DESC",
        limit: 100,
      },
    });
  };

  useEffect(() => {
    function getDataSetting() {
      const localStorageToggled = localStorage.getItem("toggle");
      if (localStorageToggled) {
        setToggle(localStorageToggled === "list" ? "list" : "grid");
      } else {
        setToggle("list");
        localStorage.setItem("toggle", "list");
      }
    }

    getDataSetting();
  }, []);

  useEffect(() => {
    //  && !queriesExecuted
    if (eventUploadTrigger?.triggerData?.isTriggered) {
      customGetRecentFiles();
    }
  }, [eventUploadTrigger?.triggerData]);

  useEffect(() => {
    getRecentFile({
      variables: {
        where: {
          status: "active",
          createdBy: user._id,
        },
        orderBy: "actionDate_DESC",
        limit: 100,
      },
    });
  }, [toggle]);

  useEffect(() => {
    if (!isFirstRender) {
      customGetRecentFiles();
    }
  }, [actionStatus]);

  useEffect(() => {
    const queryData = data?.getRecentFile?.data;
    getRecentFileWithoutFiltering({
      variables: {
        where: {
          status: "active",
          createdBy: user._id,
        },
        orderBy: "actionDate_DESC",
        limit: 100,
      },
      onCompleted: async (data) => {
        const queryTotal = data?.getRecentFile?.total;
        setTotal(queryTotal);
        if (queryTotal > 0) {
          setIsDataRecentFilesFound(true);
        } else {
          setIsDataRecentFilesFound(false);
        }
      },
    });
    // setDataRecentFiles((_) => {   ໂຕເກົ່າທີ່ມີບັນຫາ
    setDataRecentFiles(() => {
      const result = [
        { title: "Today", data: [] },
        { title: "Yesterday", data: [] },
        { title: "Earlier this week", data: [] },
        { title: "Last week", data: [] },
        { title: "Earlier this month", data: [] },
        { title: "Last month", data: [] },
        { title: "Earlier this year", data: [] },
        { title: "Last year", data: [] },
      ];
      if (queryData) {
        queryData.forEach((data) => {
          if (data.actionDate && isDateOnToday(data.actionDate)) {
            result[0].data.push(data);
          } else if (data.actionDate && isDateYesterday(data.actionDate)) {
            result[1].data.push(data);
          } else if (
            data.actionDate &&
            isDateEarlierThisWeek(data.actionDate)
          ) {
            result[2].data.push(data);
          } else if (data.actionDate && isDateLastWeek(data.actionDate)) {
            result[3].data.push(data);
          } else if (
            data.actionDate &&
            isDateEarlierThisMonth(data.actionDate)
          ) {
            result[4].data.push(data);
          } else if (data.actionDate && isDateLastMonth(data.actionDate)) {
            result[5].data.push(data);
          } else if (
            data.actionDate &&
            isDateEarlierThisYear(data.actionDate)
          ) {
            result[6].data.push(data);
          } else if (data.actionDate && isDateLastYear(data.actionDate)) {
            result[7].data.push(data);
          } else {
            if (data.actionDate) {
              result[7].data.push(data);
            }
          }
        });
      }

      return result.map((recentFiles) => {
        return {
          ...recentFiles,
          data: recentFiles.data.splice(0, 15).map((data) => ({
            id: data._id,
            ...data,
          })),
        };
      });
    });
  }, [data?.getRecentFile?.data]);

  useEffect(() => {
    if (isDataRecentFilesFound !== null) {
      setIsLoaded(true);
    }
  }, [isDataRecentFilesFound]);

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
        handleDownloadFiles();
        break;
      case "delete":
        /* setDeleteDialogOpen(true); */
        await handleDeleteRecentFile();
        break;
      case "rename":
        setRenameDialogOpen(true);
        break;
      case "favourite":
        handleAddFavourite();
        break;
      case "preview":
        setShowPreview(true);
        break;

      case "password":
        handleOpenPasswordLink();
        break;
      case "get link":
        await handleGetLink();
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

  // async function copyTextToClipboard(text) {
  //   if ("clipboard" in navigator) {
  //     return await navigator.clipboard.writeText(text);
  //   } else {
  //     return document.execCommand("copy", true, text);
  //   }
  // }

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

  const handleDownloadFiles = async () => {
    // setShowProgressing(true);
    let real_path;
    if (dataForEvents.data.newPath === null) {
      real_path = "";
    } else {
      real_path = truncateName(dataForEvents.data.newPath);
    }

    // const lastIndex = dataForEvents.data?.newPath?.lastIndexOf("/");
    // const resultPath =
    //   dataForEvents.data?.newPath?.substring(0, lastIndex) ?? "";
    // const resultFileName =
    //   dataForEvents.data?.newPath?.substring(lastIndex) ?? "";
    // console.log(resultPath);

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
        // await handleActionFile("download");
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
      recentFileRefetch();
      setFileDetailsDialog(false);
    } catch (error) {
      errorMessage(error, 2000);
    }
  };

  const handleDeleteRecentFile = async () => {
    try {
      await deleteRecentFile({
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
          recentFileRefetch();
          resetDataForEvents();
          setIsAutoClose(true);
        },
      });
    } catch (err) {
      errorMessage("Sorry! Something went wrong. Please try again!");
    }
  };

  const handleRename = async () => {
    try {
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
          setRenameDialogOpen(false);
          successMessage("Update File successfull", 2000);
          await handleActionFile("edit");
          recentFileRefetch();
          resetDataForEvents();
          setIsAutoClose(true);
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
          setRenameDialogOpen(false);
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
          recentFileRefetch();
          setFileDetailsDialog(false);
        },
      });
    } catch (error) {
      errorMessage(
        "Sorry!!. Something went wrong. Please try again later!!",
        2000,
      );
    }
  };

  useEffect(() => {
    if (dataForEvents.action) {
      setName(dataForEvents.data.filename);
    }
  }, [renameDialogOpen]);

  const handleFileDetailDialogBreadcrumbFolderNavigate = async (link) => {
    const result = await getFolders({
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {shareDialog && (
        <CreateShare
          onClose={() => {
            resetDataForEvents();
            setShareDialog(false);
          }}
          open={shareDialog}
          data={dataForEvents.data}
          refetch={fileLoading || recentFileRefetch}
        />
      )}
      {!_.isEmpty(dataForEvents.data) && (
        <FileDetailsDialog
          iconTitle={<BiTime />}
          title="Recent"
          path={breadcrumbData}
          name={dataForEvents.data.filename || dataForEvents.data.folder_name}
          breadcrumb={{
            handleFolderNavigate:
              handleFileDetailDialogBreadcrumbFolderNavigate,
          }}
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
            setShowPreview(false);
            resetDataForEvents();
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
          setRenameDialogOpen(false);
          resetDataForEvents();
        }}
        onSave={handleRename}
        title={"Rename file"}
        label={"Rename file"}
        defaultValue={dataForEvents.data.filename}
        setName={setName}
        name={name}
      />
      <AlertDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          resetDataForEvents();
        }}
        onClick={handleDeleteRecentFile}
        title="Delete this item?"
        message={
          "If you click yes " +
          dataForEvents.data.filename +
          " will be deleted?"
        }
      />
      {showProgressing && (
        <ProgressingBar procesing={procesing} progressing={progressing} />
      )}
      <MUI_TOGLE.TitleAndSwitch>
        <MUI_TOGLE.SwitchItem>
          <Typography variant="h4">Recent</Typography>
        </MUI_TOGLE.SwitchItem>
        {isDataRecentFilesFound !== null && isDataRecentFilesFound && (
          <SwitchPages
            handleToggle={handleToggle}
            toggle={toggle}
            setToggle={setToggle}
          />
        )}
      </MUI_TOGLE.TitleAndSwitch>
      <MUI.RecentFilesContainer>
        {isMobile ? (
          <MUI.ListButtonRecent>
            <Button
              variant={actionStatus === "all" ? "contained" : "string"}
              sx={{
                color: `${actionStatus === "all" ? "#fff" : "#4B465C"}`,
              }}
              onClick={() => setActionStatus("all")}
            >
              All
            </Button>
            <IconButton
              onClick={() => setActionStatus("edit")}
              style={{
                ...(actionStatus === "edit" && {
                  backgroundColor: "#17766B",
                  color: "#fff",
                }),
              }}
            >
              <FaRegEdit />
            </IconButton>
            <IconButton
              onClick={() => setActionStatus("upload")}
              style={{
                ...(actionStatus === "upload" && {
                  backgroundColor: "#17766B",
                  color: "#fff",
                }),
              }}
            >
              <TbDownload />
            </IconButton>
            <IconButton
              onClick={() => setActionStatus("download")}
              style={{
                ...(actionStatus === "download" && {
                  backgroundColor: "#17766B",
                  color: "#fff",
                }),
              }}
            >
              <TbUpload />
            </IconButton>
          </MUI.ListButtonRecent>
        ) : (
          <MUI.ListButtonRecent>
            <Button
              variant={actionStatus === "all" ? "contained" : "string"}
              sx={{
                ml: 3,
                color: `${actionStatus === "all" ? "#fff" : "#4B465C"}`,
              }}
              onClick={() => setActionStatus("all")}
            >
              All
            </Button>
            <Button
              variant={actionStatus === "edit" ? "contained" : "string"}
              sx={{
                color: `${actionStatus === "edit" ? "#fff" : "#4B465C"}`,
              }}
              startIcon={<FaRegEdit size="18px" />}
              onClick={() => setActionStatus("edit")}
            >
              Latest Edit
            </Button>
            <Button
              variant={actionStatus === "upload" ? "contained" : "string"}
              sx={{
                color: `${actionStatus === "upload" ? "#fff" : "#4B465C"}`,
              }}
              startIcon={<TbUpload />}
              onClick={() => setActionStatus("upload")}
            >
              Latest Upload
            </Button>
            <Button
              variant={actionStatus === "download" ? "contained" : "string"}
              sx={{
                color: `${actionStatus === "download" ? "#fff" : "#4B465C"}`,
              }}
              startIcon={<TbDownload />}
              onClick={() => setActionStatus("download")}
            >
              Latest Download
            </Button>
          </MUI.ListButtonRecent>
        )}
        <Fragment>
          {isDataRecentFilesFound !== null && isDataRecentFilesFound && (
            <>
              <MUI.RecentFilesList>
                {isLoaded &&
                  dataRecentFiles?.length > 0 &&
                  dataRecentFiles.map((dataRecentFile, index) => {
                    return (
                      <Fragment key={index}>
                        {dataRecentFile.data.length > 0 && (
                          <MUI.RecentFilesItem>
                            <Typography variant="h4" fontWeight="bold">
                              {dataRecentFile.title}
                            </Typography>
                            {toggle === "grid" && (
                              <FileCardContainer>
                                {dataRecentFile.data.map((data, index) => {
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
                                        data.newFilename
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
                                      fileType={GetFileTypeFromFullType(
                                        data.fileType,
                                      )}
                                      name={data.filename}
                                      key={index}
                                      menuItems={menuItems.map(
                                        (menuItem, index) => {
                                          return (
                                            <MenuDropdownItem
                                              isFavorite={
                                                data.favorite ? true : false
                                              }
                                              isPassword={
                                                data.filePassword ? true : false
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
                                })}
                              </FileCardContainer>
                            )}
                            {toggle !== "grid" && (
                              <Fragment>
                                {dataRecentFile.data.length > 0 && (
                                  <RecentDataGrid
                                    data={dataRecentFile.data}
                                    handleEvent={(action, data) => {
                                      setDataForEvents({
                                        action,
                                        data,
                                      });
                                    }}
                                  />
                                )}
                              </Fragment>
                            )}
                          </MUI.RecentFilesItem>
                        )}
                      </Fragment>
                    );
                  })}
              </MUI.RecentFilesList>
            </>
          )}
        </Fragment>

        {!fileLoading && isDataRecentFilesFound === false && (
          <Empty icon={<Icon.RecentEmptyIcon />} title="No Recent files" />
        )}

        <CreateFilePasswordDialog
          checkType="file"
          isOpen={isPasswordLink}
          dataValue={dataForEvents.data}
          filename={dataForEvents.data?.filename || "Unknown"}
          isUpdate={dataForEvents.data?.filePassword ? true : false}
          onConfirm={() => {
            recentFileRefetch();
          }}
          onClose={handleClosePasswordLink}
        />
      </MUI.RecentFilesContainer>
    </Box>
  );
}

export default Index;
