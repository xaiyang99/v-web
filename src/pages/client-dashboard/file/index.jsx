import { useLazyQuery, useMutation } from "@apollo/client";
import { Typography } from "@mui/material";
import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MUTATION_ACTION_FILES,
  MUTATION_FILES,
  QUERY_ALL_FILE_CATEGORIES,
  QUERY_FOLDERS,
} from "./apollo";

// components
import FileCardContainer from "../components/file/FileCardContainer";
import FileCardItem from "../components/file/FileCardItem";
import MenuDropdownItem from "../components/menu/MenuDropdownItem";
import menuItems from "../components/menu/MenuItems";
import ProgressingBar from "../components/progressingBar";
import * as MUI from "../css/fileTypeStyle";

import { Base64 } from "js-base64";
import _ from "lodash";
import moment from "moment";
import { errorMessage, successMessage } from "../../../components/Alerts";
import FileDetailsDialog from "../../../components/FileDetailsDialog";
import AlertDialog from "../../../components/deleteDialog";
import {
  ConvertBytetoMBandGB,
  CutFileType,
  GetFileType,
  GetFileTypeFromFullType,
  capitalizeFirstLetter,
  getFileNameExtension,
  getFilenameWithoutExtension,
  handleGraphqlErrors,
  truncateName,
} from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import useBreadcrumbData from "../../../hooks/useBreadcrumbData";
import useFirstRender from "../../../hooks/useFirstRender";
import useGetUrl from "../../../hooks/useGetUrl";
import useScroll from "../../../hooks/useScrollDown";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
// import CardSkeleton from "../components/CardSkeleton";
import CreateShare from "../components/CreateShare";
import FileTypeDataGrid from "../components/FileTypeDataGrid";
// import ListSkeleton from "../components/ListSkeleton";
import { ENV_KEYS } from "../../../constants";
import PreviewFile from "../components/PreviewFile";
import RenameDialogFile from "../components/RenameDialogFile";
import SwitchPages from "../components/SwitchPages";
import { useMenuDropdownState } from "../components/menu/MenuDropdownProvider";
import CreateFilePasswordDialog from "../components/slider/CreateFilePasswordDialog";

const {
  REACT_APP_STORAGE_ZONE,
  REACT_APP_BUNNY_SECRET_KEY,
  REACT_APP_BUNNY_PULL_ZONE,
  REACT_APP_ACCESSKEY_BUNNY,
  REACT_APP_DOWNLOAD_URL,
} = process.env;

const ITEM_PER_PAGE = 20;

function Index() {
  const { fileType } = useParams();
  const { user } = useAuth();
  const fileTypeDecode = Base64.decode(fileType);
  const isFirstRender = useFirstRender();
  const [getFileData, { data: dataFetching, loading: fileLoading }] =
    useLazyQuery(QUERY_ALL_FILE_CATEGORIES, {
      fetchPolicy: "no-cache",
    });
  const [isDataFound, setDataFound] = React.useState(null);

  const navigate = useNavigate();
  const [toggle, setToggle] = React.useState("list");

  const handleToggle = (value) => {
    setToggle(value);
    localStorage.setItem("toggle", value);
  };

  const [getFolders, { refetch: refetchFiles }] = useLazyQuery(QUERY_FOLDERS, {
    fetchPolicy: "no-cache",
  });
  const [updateFile] = useMutation(MUTATION_FILES);
  const [progressing, setProgressing] = React.useState(0);
  const [procesing, setProcesing] = React.useState(true);
  const [showProgressing, setShowProgressing] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });

  /* for filtered data includes pagination... */
  const [dataFolderFilters, setDataFolderFilters] = React.useState({});
  const [currentFilePage, setCurrentFilePage] = useState(1);
  const { setIsAutoClose } = useMenuDropdownState();
  const [currentFolderPage, setCurrentFolderPage] = useState(1);
  const [isPasswordLink, setIsPasswordLink] = useState(false);

  // popup
  const [name, setName] = React.useState("");

  //dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [fileDetailsDialog, setFileDetailsDialog] = React.useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [total, setTotal] = useState(0);
  const [fileData, setFileData] = useState([]);

  const [fileAction] = useMutation(MUTATION_ACTION_FILES);

  /* data for Breadcrumb */
  const breadcrumbDataForFileDetails = useBreadcrumbData(
    dataForEvents.data?.newPath ||
      (dataForEvents.data?.newPath, dataForEvents.data?.filename),
  );

  const { limitScroll } = useScroll({
    total: total,
    limitData: ITEM_PER_PAGE,
  });

  const handleOpenPasswordLink = () => {
    setIsPasswordLink(true);
  };
  const handleClosePasswordLink = () => {
    setIsPasswordLink(false);
    resetDataForEvents();
  };

  const queryFileGrid = async () => {
    if (toggle === "grid") {
      try {
        await getFileData({
          variables: {
            where: {
              createdBy: parseInt(user?._id),
              fileType: fileTypeDecode,
              status: "active",
            },

            limit: limitScroll,
          },
          onCompleted: (data) => {
            if (data) {
              const queryData = data?.getFileCategoryDetails?.data || [];
              const queryTotal = data?.getFileCategoryDetails?.total || 0;
              setTotal(queryTotal);
              if (queryData?.length > 0) {
                setFileData(queryData);
                setDataFound(true);
              } else {
                setDataFound(false);
              }
            }
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const queryFiles = async () => {
    try {
      if (toggle === "list") {
        await getFileData({
          variables: {
            where: {
              createdBy: parseInt(user?._id),
              fileType: fileTypeDecode,
              status: "active",
            },

            limit: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (currentFilePage - 1),
          },
          onCompleted: (data) => {
            if (data) {
              const queryData = data?.getFileCategoryDetails?.data || [];
              const queryTotal = data?.getFileCategoryDetails?.total || 0;
              setTotal(queryTotal);
              if (queryData?.length > 0) {
                setFileData(queryData);
                setDataFound(true);
              } else {
                setDataFound(false);
              }
            }
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    queryFiles();
  }, [toggle, currentFilePage]);

  useEffect(() => {
    queryFileGrid();
  }, [limitScroll, toggle]);

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

  useEffect(() => {
    const localStorageToggled = localStorage.getItem("toggle");
    if (localStorageToggled) {
      setToggle(localStorageToggled === "list" ? "list" : "grid");
    } else {
      localStorage.setItem("toggle", "list");
      setToggle("list");
    }
  }, []);

  const customGetFiles = () => {
    if (toggle === "list") {
      queryFiles();
    } else {
      queryFileGrid();
    }
  };

  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: "",
      data: {},
    }));
  };

  useEffect(() => {
    if (dataForEvents.action && dataForEvents.data) {
      menuOnClick(dataForEvents.action);
    }
  }, [dataForEvents.action]);

  const [dataGetUrl, setDataGetURL] = useState(null);

  const menuOnClick = async (action) => {
    setIsAutoClose(true);
    switch (action) {
      case "download":
        handleDownloadFiles();
        break;
      case "delete":
        await handleDeleteFilesAndFolders();
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

  useEffect(() => {
    if (dataGetUrl) {
      handleGetUrl(dataGetUrl);
      setTimeout(() => {
        setDataGetURL(null);
      }, 300);
    }
  }, [dataGetUrl]);

  const handleGetUrl = useGetUrl(dataGetUrl);

  const handleGetLink = async () => {
    await setDataGetURL(dataForEvents.data);
    await setDataForEvents((prev) => {
      return {
        ...prev,
        action: "",
      };
    });
  };

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
    setShowProgressing(true);
    let real_path = "";
    if (dataForEvents.data?.newPath === null) {
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
        // await handleActionFile("download");
      }

      const blob = new Blob(chunks);
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = dataForEvents.data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowPreview(false);
      setFileDetailsDialog(false);
      setDataForEvents((state) => ({
        ...state,
        action: null,
        data: {
          ...state.data,
          totalDownload: dataForEvents.data.totalDownload + 1,
        },
      }));
      customGetFiles();
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const handleDeleteFilesAndFolders = async () => {
    try {
      if (dataForEvents.type === "folder") {
        return;
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
            customGetFiles();
            resetDataForEvents();
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
        return;
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
            // setIsAutoClose(true);
            customGetFiles();
            setRenameDialogOpen(false);
            successMessage("Update File successfull", 2000);
            await handleActionFile("edit");
            resetDataForEvents();
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
          // setIsAutoClose(true);
          setRenameDialogOpen(false);
          setFileDetailsDialog(false);
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
          customGetFiles();
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
      if (dataForEvents.type === "folder") {
        setName(dataForEvents.data.name);
      } else {
        setName(dataForEvents.data.filename);
      }
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
    <React.Fragment>
      {shareDialog && dataForEvents.data && (
        <CreateShare
          onClose={() => {
            setShareDialog(false);
            resetDataForEvents();
          }}
          open={shareDialog}
          data={{
            ...dataForEvents?.data,
            filename: dataForEvents.data?.filename,
          }}
          ownerId={{
            _id: dataForEvents.data?.createdBy?._id,
            newName: dataForEvents.data?.createdBy?.newName,
          }}
          refetch={refetchFiles}
          handleClose={() => {
            setShareDialog(false);
            resetDataForEvents();
          }}
        />
      )}

      {!_.isEmpty(dataForEvents.data) && (
        <FileDetailsDialog
          path={breadcrumbDataForFileDetails}
          name={dataForEvents.data?.filename || dataForEvents.data?.filename}
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
            resetDataForEvents();
            setShowPreview(false);
          }}
          onClick={handleDownloadFiles}
          filename={dataForEvents.data.filename}
          newFilename={dataForEvents.data.newFilename}
          fileType={dataForEvents.data.fileType}
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
        title={"Rename file"}
        label={"Rename file"}
        setName={setName}
        defaultValue={
          dataForEvents.type === "folder"
            ? dataForEvents.data.name
            : dataForEvents.data.filename
        }
        extension={getFileNameExtension(name)}
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
          (dataForEvents.data.filename || dataForEvents.data.name) +
          " will be deleted?"
        }
      />

      <CreateFilePasswordDialog
        isOpen={isPasswordLink}
        dataValue={dataForEvents.data}
        filename={dataForEvents.data?.filename}
        isUpdate={dataForEvents.data.filePassword ? true : false}
        checkType="file"
        onConfirm={() => {
          customGetFiles();
        }}
        onClose={handleClosePasswordLink}
      />

      {showProgressing && (
        <ProgressingBar procesing={procesing} progressing={progressing} />
      )}

      <MUI.FileTypeContainer>
        <MUI.TitleAndSwitch className="title-n-switch">
          <Typography variant="h3">
            {capitalizeFirstLetter(fileTypeDecode)}
          </Typography>
          {isDataFound !== null && isDataFound && (
            <SwitchPages
              handleToggle={handleToggle}
              toggle={toggle === "grid" ? "grid" : "list"}
              setToggle={setToggle}
            />
          )}
        </MUI.TitleAndSwitch>
        {isDataFound !== null && isDataFound && (
          <>
            <MUI.FileTypeList>
              <React.Fragment>
                {/* {fileLoading ? ( */}
                {/* <Fragment>
                  {toggle === "list" ? <ListSkeleton /> : <CardSkeleton />}
                </Fragment> */}
                {/* ) : ( */}
                <MUI.FileTypeItem>
                  <React.Fragment>
                    {toggle === "grid" && (
                      <FileCardContainer>
                        {fileData?.map((data, index) => {
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
                                getFilenameWithoutExtension(data.newFilename) +
                                `.${ENV_KEYS.REACT_APP_THUMBNAIL_EXTENSION}`
                              }
                              fileType={GetFileTypeFromFullType(data.fileType)}
                              name={data.filename}
                              key={index}
                              menuItems={menuItems.map((menuItem, index) => {
                                return (
                                  <MenuDropdownItem
                                    isFavorite={data.favorite ? true : false}
                                    isPassword={
                                      data?.filePassword ||
                                      data?.password ||
                                      data?.access_password ||
                                      data?.access_passwordFolder
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
                              })}
                            />
                          );
                        })}
                      </FileCardContainer>
                    )}

                    {toggle !== "grid" && (
                      <FileTypeDataGrid
                        pagination={{
                          total: Math.ceil(total / ITEM_PER_PAGE),
                          currentPage: currentFilePage,
                          setCurrentPage: setCurrentFilePage,
                        }}
                        total={total}
                        data={fileData}
                        handleEvent={(action, data) => {
                          setDataForEvents({
                            data,
                            action,
                          });
                        }}
                      />
                    )}
                  </React.Fragment>
                </MUI.FileTypeItem>
                {/* )} */}
              </React.Fragment>
            </MUI.FileTypeList>
          </>
        )}
      </MUI.FileTypeContainer>
    </React.Fragment>
  );
}

export default Index;
