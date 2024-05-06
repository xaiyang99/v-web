import { useLazyQuery, useMutation } from "@apollo/client";
import { Box, styled, useMediaQuery } from "@mui/material";
import { Base64 } from "js-base64";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { useNavigate, useParams } from "react-router-dom";
import streamSaver from "streamsaver";
import { errorMessage, successMessage } from "../../../components/Alerts";
import FileDetailsDialog from "../../../components/FileDetailsDialog";
import {
  ConvertBytetoMBandGB,
  DateFormat,
  GetFileType,
  GetFileTypeFromFullType,
  getFileNameExtension,
  truncateName,
} from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import useBreadcrumbData from "../../../hooks/useBreadcrumbData";
import useGetUrl from "../../../hooks/useGetUrl";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
import Action from "../actionTable/Action";
import Action2 from "../actionTable/Action2";
import DataGridFile from "../clound/DataGridFile";
import * as MyfolderFull from "../clound/icons";
import CreateShare from "../components/CreateShare";
import RenameDialogFile from "../components/RenameDialogFile";
import { useMenuDropdownState } from "../components/menu/MenuDropdownProvider";
import {
  favouriteMenuItems,
  shortFavouriteMenuItems,
} from "../components/menu/MenuItems";
import {
  MUTATION_ACTION_FILES,
  MUTATION_FILES,
  MUTATION_FOLDERS,
  QUERY_FOLDERS,
} from "../extendFolder/apollo";
import useFetchSubFoldersAndFilesMulti from "../extendFolder/hooks/useFetchSubFoldersAndFilesMultiple";
import * as MUI from "./../css/cloundStyle";
import { QUERY_SEARCH } from "./apollo";

import CryptoJS from "crypto-js";
import PreviewFile from "../components/PreviewFile";
import useDownloadFile from "../share-with-me/hooks/useDownloadFile";
const IconFolderContainer = styled(Box)({
  minWidth: "30px",
  marginLeft: "-5px",
});
function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:600px) and (max-width:1024px)");
  const params = useParams();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [hover, setHover] = useState("");
  const [dataOfSearch, setDataOfSearch] = useState([]);
  const [menuDropdownAnchor, setMenuDropdownAnchor] = React.useState(null);
  const { setIsAutoClose } = useMenuDropdownState();
  const [getFolders] = useLazyQuery(QUERY_FOLDERS, { fetchPolicy: "no-cache" });
  const [fileAction] = useMutation(MUTATION_ACTION_FILES);
  const [updateFile] = useMutation(MUTATION_FILES);
  const [updateFolder] = useMutation(MUTATION_FOLDERS);
  const [searchFolderAndFile, { refetch }] = useLazyQuery(QUERY_SEARCH, {
    fetchPolicy: "no-cache",
  });
  const [name, setName] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [fileDetailsDialog, setFileDetailsDialog] = React.useState(false);
  const [shareDialog, setShareDialog] = React.useState(false);
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });
  const {
    REACT_APP_STORAGE_ZONE,
    REACT_APP_BUNNY_SECRET_KEY,
    REACT_APP_BUNNY_PULL_ZONE,
    REACT_APP_ACCESSKEY_BUNNY,
    REACT_APP_DOWNLOAD_URL,
  } = process.env;
  const breadCrumbData = useBreadcrumbData(dataForEvents.data?.path);
  const [afterDowload, setAfterDowload] = React.useState(null);
  const [progressing, setProgressing] = React.useState(0);
  const [procesing, setProcesing] = React.useState(true);
  const [showProgressing, setShowProgressing] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  let folderById = [];
  for (let i = 0; i < dataOfSearch?.length; i++) {
    if (dataOfSearch[i].checkTypeItem === "folder") {
      folderById.push(dataOfSearch[i]._id);
    }
  }
  const totalDownloadHandle = useDownloadFile(afterDowload);
  const fetchSubFoldersAndFiles = useFetchSubFoldersAndFilesMulti(folderById);
  let folderId = [];
  for (let k = 0; k < fetchSubFoldersAndFiles.data?.length; k++) {
    folderId.push({
      id: fetchSubFoldersAndFiles.data[k].parentFolderId,
      total:
        fetchSubFoldersAndFiles.data[k].files?.data[0]?._id ||
        fetchSubFoldersAndFiles.data[k].folders?.data[0]?._id,
    });
  }
  const handleGetFolderURL = useGetUrl(dataForEvents.data);
  React.useEffect(() => {
    if (afterDowload) {
      totalDownloadHandle(afterDowload);
    }
  }, [afterDowload]);
  React.useEffect(() => {
    if (!_.isEmpty(dataForEvents.data) && dataForEvents.action === "get link") {
      handleGetFolderURL(dataForEvents.data);
    }
  }, [dataForEvents.data]);

  /* data for Breadcrumb */
  const breadcrumbDataForFileDetails = useBreadcrumbData(
    breadCrumbData?.join("/"),
    dataForEvents.data?.name,
  );

  const handleSearch = async () => {
    if (params?.name) {
      await searchFolderAndFile({
        variables: {
          where: {
            name: params?.name,
            createdBy: user?._id,
          },
        },
        onCompleted: (data) => {
          setDataOfSearch(data.searchFolderAndFile?.data);
        },
      });
    }
  };

  useEffect(() => {
    handleSearch();
  }, [params]);

  const hanleOpenFile = (params) => {
    if (params.row?.checkTypeItem === "folder") {
      const base64URL = Base64.encodeURI(params.row?.url);
      navigate(`/folder/${base64URL}`);
    } else {
      setDataForEvents({
        action: "preview",
        type: "file",
        data: params.row,
      });
    }
  };
  const handleOnClick = (data) => {
    if (data?.checkTypeItem === "folder" && (isTablet || isMobile)) {
      const base64URL = Base64.encodeURI(data?.url);
      navigate(`/folder/${base64URL}`);
    }
  };
  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: null,
      data: {},
    }));
  };
  useEffect(() => {
    if (dataForEvents.action) {
      if (dataForEvents.type === "folder") {
        setName(dataForEvents.data.name);
      } else {
        setName(dataForEvents.data.name);
      }
    }
  }, [renameDialogOpen]);

  useEffect(() => {
    if (dataForEvents.action && dataForEvents.data) {
      handleEvent(dataForEvents.action);
    }
  }, [dataForEvents.action]);
  const handleFolderNavigate = async (link) => {
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
  const handleEvent = async (action) => {
    switch (action) {
      case "download":
        if (dataForEvents.data.checkTypeItem === "folder") {
          await handleDownloadFolders();
          setIsAutoClose(true);
        } else {
          handleDownloadFiles();
          setIsAutoClose(true);
        }
        break;
      case "delete":
        await handleDeleteFilesAndFolders();
        break;
      case "rename":
        setRenameDialogOpen(true);
        setIsAutoClose(true);
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
      case "detail":
        setFileDetailsDialog(true);
        setIsAutoClose(true);
        break;
      case "share":
        setShareDialog(true);
        setIsAutoClose(true);
        break;
      default:
        return;
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
        path:
          dataForEvents?.data.createdBy?.newName +
          "-" +
          dataForEvents?.data.createdBy?._id +
          "/" +
          dataForEvents.data.newPath,
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
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
    setShowProgressing(false);
    setIsAutoClose(false);
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
          dataForEvents.data.newName,
        fileName: CryptoJS.enc.Utf8.parse(dataForEvents.data.name),
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
        await handleActionFile("download");
      }
      if (countPercentage === 100) {
        setAfterDowload(dataForEvents.data._id);
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
    } catch (error) {
      errorMessage(error, 2000);
    }
  };
  const handleAddPin = async () => {
    try {
      let folderPin = await updateFolder({
        variables: {
          where: {
            _id: dataForEvents.data._id,
          },
          data: {
            pin: dataForEvents.data.pin ? 0 : 1,
            updatedBy: user._id,
          },
        },
        onCompleted: async (data) => {
          if (data.updateFolders?._id) {
            resetDataForEvents();
            handleSearch();
          }
          if (dataForEvents.data?.pin) {
            setTimeout(() => {
              successMessage("One folder removed from Pin", 2000);
            }, 100);
          } else {
            successMessage("One folder added to Pin", 2000);
          }
        },
      });

      if (folderPin?.data?.updateFolders?._id) {
        handleSearch();
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

          handleSearch();
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
  const handleRename = async () => {
    try {
      if (dataForEvents.data.checkTypeItem === "folder") {
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
            handleSearch();
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
            handleSearch();
            setRenameDialogOpen(false);
            successMessage("Update File successfull", 2000);
            await handleActionFile("edit");
            resetDataForEvents();
          },
        });
      }
    } catch (error) {
      errorMessage(
        "Sorry!!. Something went wrong. Please try again later!!",
        2000,
      );
    }
  };

  const handleDeleteFilesAndFolders = async () => {
    try {
      if (dataForEvents.data?.checkTypeItem === "folder") {
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
            handleSearch();
            successMessage("Delete folder successful!!", 2000);
            resetDataForEvents();
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
            handleSearch();
            successMessage("Delete file successful!!", 2000);
            resetDataForEvents();
            setIsAutoClose(true);
          },
        });
      }
    } catch (err) {
      errorMessage("Sorry! Something went wrong. Please try again!");
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => {
        const isContainFile = folderId.find((r) => {
          let id = r.id === params.row?._id;
          if (id) {
            return r.total;
          }
        });

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "20px", textAlign: "center" }} mt={2}>
              {params?.row?.checkTypeItem === "folder" ? (
                <>
                  {isContainFile?.total ? (
                    <IconFolderContainer
                      onClick={() => {
                        handleOnClick(params?.row);
                      }}
                    >
                      <MyfolderFull.MyfolderFull />
                    </IconFolderContainer>
                  ) : (
                    <IconFolderContainer
                      onClick={() => handleOnClick(params?.row)}
                    >
                      <MyfolderFull.MyfolerEmpty />
                    </IconFolderContainer>
                  )}
                </>
              ) : (
                <Box
                  onClick={() => {
                    setShowPreview(true);
                    setDataForEvents({
                      action: "preview",
                      type: "file",
                      data: params.row,
                    });
                  }}
                >
                  <FileIcon
                    extension={GetFileType(params?.row?.name)}
                    {...{
                      ...defaultStyles[GetFileType(params?.row?.name)],
                    }}
                  />
                </Box>
              )}
            </Box>
            &nbsp;&nbsp;
            <span>{params?.row?.name}</span>
          </div>
        );
      },
    },

    {
      field: "size",
      headerName: "File size",
      flex: 1,
      renderCell: (params) => {
        let itemSize = params?.row?.size;
        return <span>{itemSize ? ConvertBytetoMBandGB(itemSize) : "--"}</span>;
      },
    },

    {
      field: "updatedAt",
      headerName: "Lasted shared",
      flex: 1,
      renderCell: (params) => {
        return <span>{DateFormat(params.row.updatedAt)}</span>;
      },
    },
    {
      field: "action",
      headerName: "",
      flex: 1,
      align: "right",
      renderCell: (params) => {
        if (params?.row?.checkTypeItem === "folder") {
          const isContainFile = folderId.find((r) => {
            let id = r.id === params.row?._id;
            if (id) {
              return r.total;
            }
          });
          return (
            <div>
              <Action2
                isContainFile={isContainFile?.total}
                params={params}
                checkChild={fetchSubFoldersAndFiles?.data?.files}
                menuItems={favouriteMenuItems}
                shortMenuItems={shortFavouriteMenuItems}
                anchor={[menuDropdownAnchor, setMenuDropdownAnchor]}
                eventActions={{
                  hover,
                  setHover,
                  handleEvent: (action, data) => {
                    setDataForEvents({
                      action,
                      data,
                    });
                  },
                }}
              />
            </div>
          );
        } else {
          return (
            <div>
              <Action
                params={params}
                eventActions={{
                  hover,
                  setHover,
                  handleEvent: (action, data) => {
                    setDataForEvents({
                      action,
                      data,
                    });
                  },
                }}
                menuItems={favouriteMenuItems}
                shortMenuItems={shortFavouriteMenuItems}
                anchor={[menuDropdownAnchor, setMenuDropdownAnchor]}
                // user={props.user}
              />
            </div>
          );
        }
      },
    },
  ];

  const rows = useMemo(
    () =>
      dataOfSearch?.map((row) => {
        return {
          ...row,
          id: row._id,
        };
      }) || [],
    [dataOfSearch],
  );

  return (
    <div style={{ height: 400, width: "100%" }}>
      {shareDialog && (
        <CreateShare
          onClose={() => {
            resetDataForEvents();
            setShareDialog(false);
          }}
          open={shareDialog}
          data={dataForEvents.data}
          refetch={refetch}
          handleClose={() => {
            resetDataForEvents();
            setShareDialog(false);
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
          filename={dataForEvents.data?.name}
          newFilename={dataForEvents.data?.newName}
          fileType={dataForEvents.data?.type}
          path={dataForEvents.data?.newPath}
          user={dataForEvents.data?.createdBy}
        />
      )}
      {!_.isEmpty(dataForEvents?.data) && (
        <FileDetailsDialog
          path={breadcrumbDataForFileDetails}
          name={dataForEvents.data?.name}
          breadcrumb={{
            handleFolderNavigate: handleFolderNavigate,
          }}
          type={GetFileTypeFromFullType(dataForEvents.data?.type)}
          displayType={GetFileType(dataForEvents.data?.type)}
          size={ConvertBytetoMBandGB(dataForEvents.data?.size)}
          dateAdded={moment(
            dataForEvents.data?.createdAt,
            "YYYY-MM-DDTHH:mm:ss.SSS",
          ).format(DATE_PATTERN_FORMAT?.datetime)}
          lastModified={moment(
            dataForEvents.data?.updatedAt,
            "YYYY-MM-DDTHH:mm:ss.SSS",
          ).format(DATE_PATTERN_FORMAT?.datetime)}
          totalDownload={dataForEvents.data?.totalDownloadFile}
          isOpen={fileDetailsDialog}
          onClose={() => {
            resetDataForEvents();
            setFileDetailsDialog(false);
          }}
          imageUrl={
            REACT_APP_BUNNY_PULL_ZONE +
            dataForEvents.data?.createdBy?.newName +
            "-" +
            dataForEvents.data?.createdBy?._id +
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
      <RenameDialogFile
        open={renameDialogOpen}
        onClose={() => {
          resetDataForEvents();
          setRenameDialogOpen(false);
        }}
        onClick={handleRename}
        title={
          dataForEvents.data?.checkTypeItem === "folder"
            ? "Rename folder"
            : "Rename file"
        }
        label={
          dataForEvents.data?.checkTypeItem === "folder"
            ? "Rename folder"
            : "Rename file"
        }
        setName={setName}
        defaultValue={dataForEvents.data.name}
        extension={getFileNameExtension(name)}
        name={name}
      />
      <MUI.SearchDashboard>
        {dataOfSearch?.length > 0 && (
          <DataGridFile
            dataGrid={{ columns, hideFooter: true }}
            data={rows}
            setHover={setHover}
            open={open}
            hanleOpenFile={hanleOpenFile}
          />
        )}
      </MUI.SearchDashboard>
    </div>
  );
}

export default Index;
