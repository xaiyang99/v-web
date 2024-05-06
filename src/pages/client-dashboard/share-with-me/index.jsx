import { useLazyQuery, useMutation } from "@apollo/client";
import * as React from "react";
import streamSaver from "streamsaver";
// import material ui
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import CryptoJS from "crypto-js";
import { BiTime } from "react-icons/bi";
// components
import { Base64 } from "js-base64";
import _ from "lodash";
import moment from "moment";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QUERY_RENDER_FOLDER } from "../../../client-components/sidebar/apollo/SidebarApollo";
import { errorMessage, successMessage } from "../../../components/Alerts";
import FileDetailsDialog from "../../../components/FileDetailsDialog";
import Snackbar from "../../../components/Notification";
import { ENV_KEYS } from "../../../constants";
import { EventUploadTriggerContext } from "../../../contexts/EventUploadTriggerContext";
import { FolderContext } from "../../../contexts/FolderContext";
import {
  ConvertBytetoMBandGB,
  GetFileTypeFromFullType,
  GetFolderName,
  getFilenameWithoutExtension,
  handleGraphqlErrors,
  truncateName,
} from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import useBreadcrumbData from "../../../hooks/useBreadcrumbData";
import useGetUrl from "../../../hooks/useGetUrl";
import useScroll from "../../../hooks/useScrollDown";
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
import FolderGridItem from "../clound/FolderGridItem";
import LinearBuffer from "../clound/LinearProgress";
import {
  MUTATION_ACTION_FILE,
  MUTATION_UPDATE_RECENT_FILE,
} from "../clound/apollo";
import CreateFileDropDialog from "../components/CreateFileDropDialog";
import CreateShare from "../components/CreateShare";
import Empty from "../components/Empty";
import PreviewFile from "../components/PreviewFile";
import RenameDialogFile from "../components/RenameDialogFile";
import SwitchPages from "../components/SwitchPages";
import { MUTATION_UPDATE_FOLDER } from "../components/apollo";
import FileCardContainer from "../components/file/FileCardContainer";
import FileCardItem from "../components/file/FileCardItem";
import MenuDropdownItem from "../components/menu/MenuDropdownItem";
import { useMenuDropdownState } from "../components/menu/MenuDropdownProvider";
import {
  shareWithMeFileMenuItems,
  shareWithMeFolderMenuItems,
} from "../components/menu/MenuItems";
import ProgressingBar from "../components/progressingBar";
import * as MUI from "../css/cloundStyle";
import { QUERY_FOLDERS } from "../extendFolder/apollo";
import { CREATE_FILEDROP_LINK_CLIENT } from "../file-drop/apollo";
import { UPADATE_FOLDERS } from "../folder/apollo/folder";
import * as MUIFOLDER from "./../css/folderStyle";
import ListShare from "./ListShare";
import { DELETE_SHARE, QUERY_SHARE_ME } from "./apollo";
import useDownloadFile from "./hooks/useDownloadFile";
import * as Icons from "./icons/icon";

function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [toggle, setToggle] = React.useState("list");
  const [notification, setNotification] = React.useState(false);
  const [getShareMe, { refetch: refetchShare }] = useLazyQuery(QUERY_SHARE_ME, {
    fetchPolicy: "no-cache",
  });
  const [getFolders] = useLazyQuery(QUERY_FOLDERS, { fetchPolicy: "no-cache" });
  const [updateFile] = useMutation(MUTATION_UPDATE_RECENT_FILE);
  const [deleteShareFileAndFolder] = useMutation(DELETE_SHARE, {
    fetchPolicy: "no-cache",
  });
  const [fileAction] = useMutation(MUTATION_ACTION_FILE);
  const [createFileDropLink] = useMutation(CREATE_FILEDROP_LINK_CLIENT);
  const [updateFolder] = useMutation(UPADATE_FOLDERS, {
    refetchQueries: [QUERY_RENDER_FOLDER],
  });
  const [updateFolderShare] = useMutation(MUTATION_UPDATE_FOLDER, {
    fetchPolicy: "no-cache",
  });
  const [listShareMe, setListShareMe] = React.useState(null);
  const { setFolderId } = React.useContext(FolderContext);

  const [name, setName] = React.useState("");
  const [checked, setChecked] = React.useState({});
  const [multiSelectId, setMultiSelectId] = React.useState([]);
  const [multiChecked, setMultiChecked] = React.useState([]);
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    data: {},
  });
  const [afterDowload, setAfterDowload] = React.useState(null);
  const [folderDrop, setFolderDrop] = React.useState("");

  //dialog
  const [progressing, setProgressing] = React.useState(0);
  const [procesing, setProcesing] = React.useState(true);
  const [fileDetailsOpen, setFileDetailsOpen] = React.useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const { setIsAutoClose } = useMenuDropdownState();
  const [shareDialog, setShareDialog] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [showProgressing, setShowProgressing] = React.useState(false);
  const [shareData, setShareData] = React.useState(null);
  const [total, setTotal] = React.useState(0);
  const { isFetching, limitScroll } = useScroll({ total, toggle });
  const eventUploadTrigger = React.useContext(EventUploadTriggerContext);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isFiledrop, setIsFiledrop] = React.useState(false);
  const handleFileAndFolderURL = useGetUrl(dataForEvents.data);

  const handleToggle = (value) => {
    setToggle(value);
    localStorage.setItem("toggle", value);
  };

  const {
    REACT_APP_BUNNY_PULL_ZONE,
    REACT_APP_BUNNY_SECRET_KEY,
    REACT_APP_STORAGE_ZONE,
    REACT_APP_DOWNLOAD_URL,
    REACT_APP_ACCESSKEY_BUNNY,
  } = process.env;

  const closeNotification = () => {
    setNotification(false);
  };

  const handleCloseFileDrop = () => {
    setIsFiledrop(false);
    resetDataForEvents();
  };

  const handleCreateFileDrop = async (link, date) => {
    try {
      const result = await createFileDropLink({
        variables: {
          input: {
            url: link,
            expiredAt: date,
            folderId: folderDrop,
          },
        },
      });

      if (result.data?.createPrivateFileDropUrl?._id) {
        handleCloseFileDrop();
      }
    } catch (error) {
      errorMessage("Something went wrong, please try again", 3000);
    }
  };

  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: "",
      data: {},
    }));
  };

  React.useEffect(() => {
    const toggled = localStorage.getItem("toggle");
    if (toggled) {
      setToggle(toggled === "list" ? "list" : "grid");
    } else {
      setToggle("list");
      localStorage.setItem("toggle", "list");
    }
  }, []);

  const totalDownloadHandle = useDownloadFile(afterDowload);

  React.useEffect(() => {
    if (afterDowload) {
      totalDownloadHandle(afterDowload);
    }
  }, [afterDowload]);

  React.useEffect(() => {
    if (!_.isEmpty(dataForEvents.data) && dataForEvents.action === "get link") {
      handleFileAndFolderURL(dataForEvents.data);
      setDataForEvents({
        action: "",
        data: {},
      });
    }
  }, [dataForEvents.action]);

  React.useEffect(() => {
    if (dataForEvents.action) {
      if (dataForEvents?.data?.folderId?.folder_type) {
        setName(dataForEvents.data.folderId.folder_name);
      } else {
        setName(dataForEvents.data.fileId.filename);
      }
    }
  }, [dataForEvents.action]);

  React.useEffect(() => {
    if (dataForEvents.action && dataForEvents.data) {
      menuOnClick(dataForEvents.action);
    }
  }, [dataForEvents.action]);

  React.useEffect(() => {
    if (eventUploadTrigger.triggerData.isTriggered) {
      queryGetShare();
    }
  }, [eventUploadTrigger.triggerData]);

  // checked file pagination
  let rowPerpage = 20;
  let countPage = 1;
  for (var i = 1; i <= Math.ceil(total / rowPerpage); i++) {
    countPage = i;
  }

  const queryGetShare = async () => {
    await getShareMe({
      variables: {
        where: {
          toAccount: user?.email,
          status: "active",
          isShare: "yes",
        },
        orderBy: "updatedAt_DESC",
        limit: toggle === "grid" ? limitScroll : rowPerpage,
        skip: toggle === "grid" ? null : rowPerpage * (currentPage - 1),
      },
      onCompleted: async (data) => {
        let queryTotal = data?.getShare?.total;
        if (queryTotal > 0) {
          setTotal(queryTotal);
          setListShareMe(() => {
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

            if (queryTotal > 0) {
              data.getShare?.data.forEach((data) => {
                if (data.createdAt && isDateOnToday(data.createdAt)) {
                  result[0].data.push(data);
                } else if (data.createdAt && isDateYesterday(data.createdAt)) {
                  result[1].data.push(data);
                } else if (
                  data.createdAt &&
                  isDateEarlierThisWeek(data.createdAt)
                ) {
                  result[2].data.push(data);
                } else if (data.createdAt && isDateLastWeek(data.createdAt)) {
                  result[3].data.push(data);
                } else if (
                  data.createdAt &&
                  isDateEarlierThisMonth(data.createdAt)
                ) {
                  result[4].data.push(data);
                } else if (data.createdAt && isDateLastMonth(data.createdAt)) {
                  result[5].data.push(data);
                } else if (
                  data.createdAt &&
                  isDateEarlierThisYear(data.createdAt)
                ) {
                  result[6].data.push(data);
                } else if (data.createdAt && isDateLastYear(data.createdAt)) {
                  result[7].data.push(data);
                } else {
                  if (data.createdAt) {
                    result[7].data.push(data);
                  }
                }
              });
              return result.map((recentFiles) => {
                return {
                  ...recentFiles,
                  // .splice(0, limitScroll)
                  data: recentFiles.data.map((data) => ({
                    id: data._id,
                    ...data,
                  })),
                };
              });
            }
          });
        }
        if (queryTotal > 0) {
          setShareData(true);
        } else {
          setShareData(false);
        }
      },
    });
  };

  React.useEffect(() => {
    queryGetShare();
  }, [limitScroll, isFetching, currentPage, toggle, countPage]);

  const menuOnClick = async (action) => {
    setIsAutoClose(true);
    switch (action) {
      case "download":
        handleDownloadFiles();
        break;
      case "delete":
        await handleDeleteShare();
        await setDataForEvents((prev) => {
          return {
            ...prev,
            action: "",
          };
        });
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
      case "get link":
        // await handleGetLink();
        break;
      case "detail":
        setFileDetailsOpen(true);
        break;
      case "share":
        setShareDialog(true);
        break;
      case "filedrop":
        setFolderDrop(dataForEvents.data?._id);
        setIsFiledrop(true);
        break;
      case "pin":
        handleAddPin();
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    if (!renameDialogOpen) {
      resetDataForEvents();
    }
  }, [renameDialogOpen]);

  const handleClickFolder = (e, value) => {
    if (e.ctrlKey && !multiChecked.includes(value?._id)) {
      setMultiChecked([...multiChecked, value?._id]);
      setMultiSelectId([...multiSelectId, value]);
    } else {
      setMultiChecked(multiChecked.filter((id) => id !== value?._id));
      setMultiSelectId(multiSelectId.filter((id) => id?._id !== value?._id));
    }

    setChecked(value?._id);
  };

  const handleOpenFolder = (value) => {
    setFolderId(value?._id);
    let base64URL = Base64.encodeURI(value?.folderId?.url);
    navigate(`/folder/share/${base64URL}`);
  };

  /* data for Breadcrumb */
  const breadcrumbData = useBreadcrumbData(
    dataForEvents.data?.fileId?.path !== null ||
      (dataForEvents.data?.fileId.path, dataForEvents.data?.fileId?.filename),
  );

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
      navigate(`/folder/share/${base64URL}`);
    }
  };

  const handleDownloadFiles = async () => {
    let actionStatus = "download";
    setShowProgressing(true);
    setIsAutoClose(true);
    if (dataForEvents.data.folderId?._id) {
      streamSaver.mitm = "/mitm.html";
      const folder_name = `${dataForEvents?.data.folderId?.folder_name}.zip`;

      const secretKey = REACT_APP_BUNNY_SECRET_KEY;
      try {
        const headers = {
          accept: "/",
          storageZoneName: REACT_APP_STORAGE_ZONE,
          isFolder: true,
          path:
            dataForEvents.data.ownerId.newName +
            "-" +
            dataForEvents.data.ownerId._id +
            "/" +
            dataForEvents.data.folderId?.newPath,
          fileName: CryptoJS.enc.Utf8.parse(folder_name),
          AccessKey: REACT_APP_ACCESSKEY_BUNNY,
          _id: dataForEvents.data.folderId._id,
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
            resetDataForEvents();

            setShowProgressing(false);
            queryGetShare();
            setFileDetailsOpen(false);
            successMessage("Download successfull", 2000);
          })
          .catch((error) => {
            errorMessage(error, 2000);
          });
      } catch (error) {
        errorMessage(error, 2000);
      }
    } else {
      let real_path;
      if (dataForEvents.data.fileId.path === null || "") {
        real_path = "";
      } else {
        real_path = truncateName("/" + dataForEvents.data.fileId.newPath);
      }

      try {
        const headers = {
          accept: "*/*",
          storageZoneName: REACT_APP_STORAGE_ZONE,
          isFolder: false,
          path:
            dataForEvents.data.ownerId.newName +
            "-" +
            dataForEvents.data.ownerId._id +
            real_path +
            "/" +
            dataForEvents.data.fileId.newFilename,
          fileName: CryptoJS.enc.Utf8.parse(dataForEvents.data.fileId.filename),
          AccessKey: REACT_APP_ACCESSKEY_BUNNY,
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
        await handleActionFile(actionStatus);
        const blob = new Blob(chunks);
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = dataForEvents.data.fileId.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (countPercentage === 100) {
          setShowProgressing(false);
          setProcesing(false);
        }
        setShowPreview(false);
        resetDataForEvents();
        setAfterDowload(dataForEvents.data.fileId._id);
        successMessage("Download successful!!", 2000);
        queryGetShare();
      } catch (error) {
        console.error(error);
        setProcesing(false);
        errorMessage("Download filed", 2000);
      }
    }
  };

  const handleRename = async () => {
    setIsAutoClose(true);
    try {
      if (dataForEvents?.data?.folderId?.folder_type) {
        let update = await updateFolder({
          variables: {
            where: {
              _id: parseInt(dataForEvents.data.folderId?._id),
              checkFolder: dataForEvents.data.folderId?.checkFolder,
            },
            data: {
              folder_name: name,
            },
          },
        });

        if (update?.data?.updateFolders?._id) {
          resetDataForEvents();
          queryGetShare();
          setRenameDialogOpen(false);
          successMessage("Update success", 3000);
        }
      } else {
        await updateFile({
          variables: {
            where: {
              _id: parseInt(dataForEvents.data?.fileId._id),
            },
            data: {
              filename: name,
              updatedBy: parseInt(user._id),
            },
          },
          onCompleted: async () => {
            setRenameDialogOpen(false);
            successMessage("Update File successfull", 2000);
            await handleActionFile("edit");
            resetDataForEvents();
            queryGetShare();
            setIsAutoClose(true);
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

  // pin foloder
  const handleAddPin = async () => {
    try {
      let folderPin = await updateFolder({
        variables: {
          where: {
            _id: dataForEvents.data.folderId._id,
          },
          data: {
            pin: dataForEvents.data.folderId.pin ? 0 : 1,
            updatedBy: user._id,
          },
        },
        onCompleted: async (data) => {
          if (data.updateFolders?._id) {
            resetDataForEvents();
            queryGetShare();
          }
          if (dataForEvents.data?.folderId?.pin) {
            setTimeout(() => {
              successMessage("One folder removed from Pin", 2000);
            }, 100);
          } else {
            successMessage("One folder added to Pin", 2000);
          }
        },
      });

      if (folderPin?.data?.updateFolders?._id) {
        refetchShare();
        setIsAutoClose(true);
      }

      setIsAutoClose(true);
    } catch (error) {
      errorMessage(
        "Sorry!!. Something went wrong. Please try again later!!",
        2000,
      );
    }
  };

  const handleDeleteShare = async () => {
    try {
      await deleteShareFileAndFolder({
        variables: {
          id: dataForEvents.data?._id,
        },

        onCompleted: async () => {
          if (dataForEvents.data?.folderId?._id) {
            successMessage("Delete folder successful !", 2000);
          } else {
            successMessage("Delete file successful !", 2000);
          }
          queryGetShare();
        },
      });
    } catch (err) {
      errorMessage(err, 3000);
      errorMessage("Sorry! Something went wrong. Please try again!", 3000);
    }
  };

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  // favourite function
  const handleAddFavourite = async () => {
    try {
      await updateFile({
        variables: {
          where: {
            _id: parseInt(dataForEvents.data.fileId._id),
          },
          data: {
            favorite: dataForEvents.data.fileId?.favorite ? 0 : 1,
          },
        },
        onCompleted: async () => {
          setRenameDialogOpen(false);
          if (dataForEvents.data.fileId.favorite) {
            successMessage("One File removed from Favourite", 2000);
          } else {
            successMessage("One File added to Favourite", 2000);
          }
          setDataForEvents((state) => ({
            action: null,
            data: {
              ...state.data,
              fileId: {
                ...state.data.fileId,
                favorite: dataForEvents.data.fileId?.favorite ? 0 : 1,
              },
            },
          }));
          queryGetShare();
          setIsAutoClose(true);
        },
      });
    } catch (error) {
      errorMessage(
        "Sorry!!. Something went wrong. Please try again later!!",
        2000,
      );
    }
  };

  // File action for count in recent file
  const handleActionFile = async (val) => {
    try {
      let action = await fileAction({
        variables: {
          fileInput: {
            createdBy: parseInt(dataForEvents.data.fromAccount._id),
            fileId: parseInt(dataForEvents.data.fileId?._id),
            actionStatus: val,
          },
        },
      });

      if (action?.data?.actionFiles) {
        refetchShare();
      }
    } catch (error) {
      console.error(error);
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
            <Typography variant="h4">Shared with me</Typography>
          </MUIFOLDER.SwitchItem>
          {shareData !== null && shareData && (
            <SwitchPages
              handleToggle={handleToggle}
              toggle={toggle}
              setToggle={setToggle}
            />
          )}
        </MUIFOLDER.TitleAndSwitch>
        {shareData && (
          <MUI.DivCloud>
            {listShareMe?.length && (
              <React.Fragment>
                {listShareMe?.map((listItem, index) => {
                  return (
                    <React.Fragment key={index}>
                      {listItem?.data?.length > 0 && (
                        <React.Fragment>
                          <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ mb: 2, mt: 3 }}
                          >
                            {listItem.data ? listItem.title : ""}
                          </Typography>
                          {toggle === "list" && (
                            <React.Fragment>
                              <ListShare
                                pagination={{
                                  countTotal: total,
                                  countPage: countPage,
                                  currentPage: currentPage,
                                  setCurrentPage: setCurrentPage,
                                }}
                                data={listItem.data}
                                handleEvent={(action, data) => {
                                  if (action === "get link") {
                                    setDataForEvents({
                                      action,
                                      data: {
                                        ...data,
                                        _id:
                                          data?.fileId?._id ??
                                          data?.folderId?._id,
                                      },
                                    });
                                  } else {
                                    setDataForEvents({
                                      action,
                                      data,
                                    });
                                  }
                                }}
                                onDoubleClick={(data) => {
                                  handleOpenFolder(data);
                                }}
                              />
                            </React.Fragment>
                          )}
                          {toggle === "grid" && (
                            <FileCardContainer>
                              {listItem?.data?.map((data, index) => {
                                if (data?.folderId?.folder_type) {
                                  return (
                                    <React.Fragment key={index}>
                                      <FolderGridItem
                                        file_id={
                                          !!data?.folderId._id ? true : false
                                        }
                                        folderId={
                                          !!data?.folderId._id ? true : false
                                        }
                                        folder_name={data?.folderId.folder_name}
                                        setIsOpenMenu={setIsOpenMenu}
                                        isOpenMenu={isOpenMenu}
                                        isPinned={
                                          data?.folderId.pin ? true : false
                                        }
                                        key={index}
                                        onOuterClick={() => {
                                          setMultiChecked(multiChecked);
                                          setChecked({});
                                        }}
                                        cardProps={{
                                          onClick: (e) =>
                                            handleClickFolder(e, data),
                                          onDoubleClick: () =>
                                            handleOpenFolder(data),
                                          /* ...(checked ===
                                            data?.folderId?._id && {
                                            ischecked: true,
                                          }), */
                                          ...(multiChecked.find(
                                            (id) => id === data?.folderId?._id,
                                          ) && {
                                            ischecked: true,
                                          }),
                                        }}
                                        menuItem={shareWithMeFolderMenuItems.map(
                                          (menuItem, index) => {
                                            const isShareAction =
                                              menuItem.action === "share" ||
                                              menuItem.action === "get link" ||
                                              menuItem.action === "download";
                                            const isCanEdit =
                                              data?.permission === "edit";
                                            return (
                                              <MenuDropdownItem
                                                {...{
                                                  ...(isShareAction &&
                                                    !isCanEdit && {
                                                      disabled: true,
                                                      sx: {
                                                        cursor:
                                                          "default !important",
                                                      },
                                                    }),
                                                }}
                                                className="menu-item"
                                                isPinned={
                                                  data?.folderId?.pin
                                                    ? true
                                                    : false
                                                }
                                                key={index}
                                                title={menuItem.title}
                                                icon={menuItem.icon}
                                                {...{
                                                  ...(isShareAction
                                                    ? {
                                                        ...(isCanEdit && {
                                                          onClick: () => {
                                                            if (
                                                              menuItem.action ===
                                                              "get link"
                                                            ) {
                                                              setDataForEvents({
                                                                action:
                                                                  menuItem.action,
                                                                data: {
                                                                  ...data,
                                                                  _id:
                                                                    data?.fileId
                                                                      ?._id ??
                                                                    data
                                                                      ?.folderId
                                                                      ?._id,
                                                                },
                                                              });
                                                            } else {
                                                              setDataForEvents({
                                                                action:
                                                                  menuItem.action,
                                                                data,
                                                              });
                                                            }
                                                          },
                                                        }),
                                                      }
                                                    : {
                                                        onClick: () => {
                                                          if (
                                                            menuItem.action ===
                                                            "get link"
                                                          ) {
                                                            setDataForEvents({
                                                              action:
                                                                menuItem.action,
                                                              data: {
                                                                ...data,
                                                                _id:
                                                                  data?.fileId
                                                                    ?._id ??
                                                                  data?.folderId
                                                                    ?._id,
                                                              },
                                                            });
                                                          } else {
                                                            setDataForEvents({
                                                              action:
                                                                menuItem.action,
                                                              data,
                                                            });
                                                          }
                                                        },
                                                      }),
                                                }}
                                              />
                                            );
                                          },
                                        )}
                                      />
                                    </React.Fragment>
                                  );
                                }
                                // Files
                                else {
                                  if (data?.fileId?.filename) {
                                    return (
                                      <FileCardItem
                                        key={index}
                                        path={data?.fileId?.path}
                                        name={data?.fileId?.filename}
                                        cardProps={{
                                          onDoubleClick: () => {
                                            setDataForEvents({
                                              action: "preview",
                                              data: {
                                                ...data,
                                                _id: data?.fileId?._id,
                                              },
                                            });
                                          },
                                        }}
                                        imageUrl={
                                          REACT_APP_BUNNY_PULL_ZONE +
                                          data.ownerId?.newName +
                                          "-" +
                                          data.ownerId?._id +
                                          "/" +
                                          (data?.fileId?.newPath ||
                                          data?.fileId?.newPath !== null
                                            ? truncateName(
                                                data?.fileId?.newPath,
                                              )
                                            : "") +
                                          "/" +
                                          data?.fileId?.newFilename
                                        }
                                        thumbnailImageUrl={
                                          REACT_APP_BUNNY_PULL_ZONE +
                                          data.ownerId?.newName +
                                          "-" +
                                          data.ownerId?._id +
                                          "/" +
                                          ENV_KEYS.REACT_APP_THUMBNAIL_PATH +
                                          "/" +
                                          getFilenameWithoutExtension(
                                            data?.fileId?.newFilename,
                                          ) +
                                          `.${ENV_KEYS.REACT_APP_THUMBNAIL_EXTENSION}`
                                        }
                                        fileType={GetFolderName(
                                          data?.fileId.fileType,
                                        )}
                                        menuItems={shareWithMeFileMenuItems.map(
                                          (menuItem, index) => {
                                            const isShareAction =
                                              menuItem.action === "share" ||
                                              menuItem.action === "get link" ||
                                              menuItem.action === "download";
                                            const isCanEdit =
                                              data?.permission === "edit";
                                            return (
                                              <MenuDropdownItem
                                                {...{
                                                  ...(isShareAction &&
                                                    !isCanEdit && {
                                                      disabled: true,
                                                      sx: {
                                                        cursor:
                                                          "default !important",
                                                      },
                                                    }),
                                                }}
                                                isFavorite={
                                                  data?.fileId?.favorite
                                                    ? true
                                                    : false
                                                }
                                                {...{
                                                  ...(isShareAction
                                                    ? {
                                                        ...(isCanEdit && {
                                                          onClick: () => {
                                                            if (
                                                              menuItem.action ===
                                                                "get link" ||
                                                              menuItem.action ===
                                                                "share"
                                                            ) {
                                                              let dataItem = {
                                                                ...data,
                                                                _id: data
                                                                  ?.fileId?._id,
                                                              };

                                                              setDataForEvents({
                                                                action:
                                                                  menuItem.action,
                                                                data: dataItem,
                                                              });
                                                            } else {
                                                              setDataForEvents({
                                                                action:
                                                                  menuItem.action,
                                                                data,
                                                              });
                                                            }
                                                          },
                                                        }),
                                                      }
                                                    : {
                                                        onClick: () => {
                                                          setDataForEvents({
                                                            action:
                                                              menuItem.action,
                                                            data,
                                                          });
                                                        },
                                                      }),
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
                                  }
                                }
                              })}
                            </FileCardContainer>
                          )}

                          {limitScroll < total &&
                            isFetching &&
                            toggle !== "list" && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  mt: 3,
                                }}
                              >
                                <LinearBuffer />
                              </Box>
                            )}
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            )}

            {showProgressing && (
              <ProgressingBar procesing={procesing} progressing={progressing} />
            )}
            {shareDialog && (
              <CreateShare
                onClose={() => {
                  resetDataForEvents();
                  setShareDialog(false);
                }}
                open={shareDialog}
                data={{
                  ...dataForEvents.data,
                  _id:
                    dataForEvents.data?.folderId?._id ??
                    dataForEvents.data?.fileId?._id,
                  folder_name: dataForEvents.data?.folderId?.folder_name,
                  folder_type: dataForEvents.data?.folderId?.folder_type,
                  name:
                    dataForEvents.data?.fileId?.filename ||
                    dataForEvents.data?.folderId?.folder_name,
                  ownerId: dataForEvents.data?.ownerId,
                }}
                share={{
                  isFromShare:
                    dataForEvents.data.isShare === "yes" ? true : false,
                  _id: dataForEvents.data.id,
                }}
                ownerId={dataForEvents.data?.ownerId}
                refetch={refetchShare}
                handleClose={() => {
                  resetDataForEvents();
                  setShareDialog(false);
                }}
              />
            )}
            <RenameDialogFile
              open={renameDialogOpen}
              onClose={() => {
                setRenameDialogOpen(false);
              }}
              onSave={handleRename}
              {...{
                ...(dataForEvents?.data?.folderId?.folder_type && {
                  title: "Rename Folder",
                  label: "Rename Folder",
                }),
                ...(!dataForEvents?.data?.folderId?.folder_type && {
                  title: "Rename File",
                  label: "Rename File",
                }),
              }}
              isFolder={
                dataForEvents?.data?.folderId?.folder_type === "folder"
                  ? true
                  : false
              }
              defaultValue={
                dataForEvents?.data?.folderId?.folder_type === "folder"
                  ? dataForEvents.data.folderId?.folder_name
                  : dataForEvents.data.fileId?.filename
              }
              name={name}
              setName={setName}
            />
            {showPreview && (
              <PreviewFile
                open={showPreview}
                handleClose={() => {
                  setShowPreview(false);
                  resetDataForEvents();
                }}
                onClick={handleDownloadFiles}
                filename={dataForEvents.data.fileId?.filename}
                newFilename={dataForEvents.data.fileId?.newFilename}
                fileType={dataForEvents.data.fileId?.fileType}
                path={dataForEvents.data.fileId?.newPath}
                user={dataForEvents.data?.ownerId}
                permission={dataForEvents?.data?.permission}
              />
            )}

            {!_.isEmpty(dataForEvents.data.fileId?._id) && fileDetailsOpen && (
              <FileDetailsDialog
                iconTitle={<BiTime />}
                title="Share with me"
                path={breadcrumbData}
                name={dataForEvents?.data?.fileId?.filename}
                breadcrumb={{
                  handleFolderNavigate:
                    handleFileDetailDialogBreadcrumbFolderNavigate,
                }}
                type={GetFileTypeFromFullType(
                  dataForEvents.data?.fileId?.fileType,
                )}
                displayType={dataForEvents.data?.fileId?.fileType}
                size={ConvertBytetoMBandGB(dataForEvents.data.fileId?.size)}
                dateAdded={moment(
                  dataForEvents.data.fileId?.createdAt,
                  "YYYY-MM-DDTHH:mm:ss.SSS",
                ).format(DATE_PATTERN_FORMAT?.datetime)}
                lastModified={moment(
                  dataForEvents.data.fileId?.updatedAt,
                  "YYYY-MM-DDTHH:mm:ss.SSS",
                ).format(DATE_PATTERN_FORMAT.datetime)}
                totalDownload={dataForEvents.data.fileId?.totalDownload}
                isOpen={fileDetailsOpen}
                onClose={() => {
                  resetDataForEvents();
                  setFileDetailsOpen(false);
                }}
                imageUrl={
                  REACT_APP_BUNNY_PULL_ZONE +
                  dataForEvents.data.ownerId?.newName +
                  "-" +
                  dataForEvents.data.ownerId?._id +
                  "/" +
                  (dataForEvents?.data?.fileId?.newPath
                    ? truncateName(dataForEvents.data?.fileId?.newPath)
                    : "") +
                  dataForEvents?.data?.fileId?.newFilename
                }
                {...{
                  favouriteIcon: {
                    isShow: true,
                    handleFavouriteOnClick: async () =>
                      await handleAddFavourite(),
                    isFavourite: dataForEvents.data.fileId?.favorite
                      ? true
                      : false,
                  },
                  downloadIcon: {
                    isShow:
                      dataForEvents?.data.permission === "edit" ? true : false,
                    handleDownloadOnClick: async () =>
                      await handleDownloadFiles(),
                  },
                }}
              />
            )}
          </MUI.DivCloud>
        )}
        {shareData !== null && !shareData && (
          <Box style={{ height: "100%" }}>
            <Empty
              icon={<Icons.ShareMeIcon />}
              title="Files and folders others have shared with you"
              context="Lore  is a body of knowledge or tradition that is passed down among members of a"
            />
          </Box>
        )}
      </Box>
      <Snackbar
        open={notification}
        timeout={1500}
        handleClose={closeNotification}
        message="Success message!!"
      />

      <CreateFileDropDialog
        isOpen={isFiledrop}
        onClose={handleCloseFileDrop}
        handleChange={handleCreateFileDrop}
      />
    </React.Fragment>
  );
}

export default Index;
