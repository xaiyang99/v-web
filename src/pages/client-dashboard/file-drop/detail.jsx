import { useMutation } from "@apollo/client";
import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";
import moment from "moment";
import React from "react";
import { useParams } from "react-router-dom";
import { UAParser } from "ua-parser-js";
import { v4 as uuidv4 } from "uuid";
import * as Mui from "../css/fileTypeStyle";
import useFetchFile from "./hooks/useFetchFiles";

// apollo
import {
  DOWNLOAD_TO_CLOUD,
  MUTATION_ACTION_FILES,
  MUTATION_DELETE_FILES,
  MUTATION_FILES,
  UPLOAD_FILE,
} from "../file/apollo";

// function
import {
  ConvertBytetoMBandGB,
  CutFileType,
  CutfileName,
  GetFileType,
  GetFileTypeFromFullType,
  getFileNameExtension,
  handleGraphqlErrors,
} from "../../../functions";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";

// components
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import axios from "axios";
import { errorMessage, successMessage } from "../../../components/Alerts";
import FileDetailsDialog from "../../../components/FileDetailsDialog";
import useAuth from "../../../hooks/useAuth";
import useBreadcrumbData from "../../../hooks/useBreadcrumbData";
import FileDropDataGrid from "../components/FileDropDataGrid";
import RenameDialogFile from "../components/RenameDialogFile";
import SwitchPages from "../components/SwitchPages";
import FileCardContainer from "../components/file/FileCardContainer";
import FileCardItem from "../components/file/FileCardItem";
import MenuDropdownItem from "../components/menu/MenuDropdownItem";
import { useMenuDropdownState } from "../components/menu/MenuDropdownProvider";
import { fileDropMenuItems } from "../components/menu/MenuItems";
import ProgressingBar from "../components/progressingBar";

const ITEM_PER_PAGE = 10;
const {
  REACT_APP_STORAGE_ZONE,
  REACT_APP_BUNNY_PULL_ZONE,
  REACT_APP_ACCESSKEY_BUNNY,
  REACT_APP_DOWNLOAD_URL,
} = process.env;

function Detail() {
  const { user } = useAuth();
  const { url } = useParams();
  const UA = new UAParser();
  const result = UA.getResult();
  const [toggle, setToggle] = React.useState(null);
  const [currentFilePage, setCurrentFilePage] = React.useState(1);
  const [name, setName] = React.useState("");
  const { setIsAutoClose } = useMenuDropdownState();
  const [progressing, setProgressing] = React.useState(0);
  const [procesing, setProcesing] = React.useState(true);
  const [showProgressing, setShowProgressing] = React.useState(false);
  const [warningMessage, setWarningMessage] = React.useState("");
  const [existName, setExistName] = React.useState("");
  const [country, setCountry] = React.useState(null);

  const [deleteFile] = useMutation(MUTATION_DELETE_FILES);
  const [updateFile] = useMutation(MUTATION_FILES);
  const [fileAction] = useMutation(MUTATION_ACTION_FILES);
  const [uploadToBunny] = useMutation(DOWNLOAD_TO_CLOUD);
  const [uploadFiles] = useMutation(UPLOAD_FILE);

  //dialog
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
  const [fileDetailsDialog, setFileDetailsDialog] = React.useState(false);
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    type: null,
    data: {},
  });

  /* data for Breadcrumb */
  const breadcrumbDataForFileDetails = useBreadcrumbData(
    dataForEvents.data?.newPath ||
      (dataForEvents.data?.newPath, dataForEvents.data?.filename),
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
      navigate(`/folder/${base64URL}`);
    }
  };

  const handleToggle = (value) => {
    setToggle(value);
    localStorage.setItem("toggle", value);
  };

  const fetchFiles = useFetchFile({
    filter: {
      url: Base64.decode(url),
    },
  });

  React.useEffect(() => {
    if (dataForEvents.action && dataForEvents.data) {
      menuOnClick(dataForEvents.action);
    }
  }, [dataForEvents.action]);

  React.useEffect(() => {
    if (dataForEvents.action) {
      setName(
        CutfileName(
          dataForEvents.data.filename,
          dataForEvents.data.newFilename,
        ),
      );
    }
  }, [renameDialogOpen]);

  React.useEffect(() => {
    const fetchIPAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        const { ip } = response?.data;
        if (ip) {
          const res = await axios.get(`http://ip-api.com/json/${ip}`);
          setCountry(res?.data?.countryCode);
        }
      } catch (error) {
        // console.error("Error fetching IP address:", error);
      }
    };
    fetchIPAddress();
  }, []);

  const customGetFiles = () => {
    fetchFiles.customgetFiles();
  };

  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: "",
      data: {},
    }));
  };

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
      case "preview":
        // setShowPreview(true);
        break;
      case "save_to_cloud":
        handleSaveToCloud();
        break;
      case "detail":
        setFileDetailsDialog(true);
        break;
      default:
        return;
    }
  };

  const handleAddFavourite = async () => {
    try {
      await updateFile({
        variables: {
          where: {
            _id: parseInt(dataForEvents.data?._id),
          },
          data: {
            favorite: dataForEvents.data?.favorite ? 0 : 1,
          },
        },

        onCompleted: async () => {
          setIsAutoClose(true);
          if (dataForEvents.data?.favorite) {
            successMessage("One file removed from favorite", 2000);
          } else {
            successMessage("One file added from favorite", 2000);
          }
          await customGetFiles();
          setDataForEvents((prevState) => {
            return {
              ...prevState,
              action: "",
              data: {
                ...prevState.data,
                favorite: dataForEvents.data?.favorite ? 0 : 1,
              },
            };
          });
        },
      });
    } catch (error) {
      errorMessage(error, 3000);
    }
  };

  const handleSaveToCloud = async () => {
    try {
      const randomName = uuidv4();
      const responseIp = await axios.get("https://load.vshare.net/getIP");
      let uploading = await uploadFiles({
        variables: {
          data: {
            ip: String(responseIp?.data),
            newFilename:
              randomName + getFileNameExtension(dataForEvents?.data?.filename),
            filename: dataForEvents?.data?.filename,
            fileType: dataForEvents?.data?.fileType,
            size: dataForEvents?.data?.size.toString(),
            checkFile: "main",
            country: country,
            device: result.os.name + result.os.version,
          },
        },
      });
      if (uploading?.data?.createFiles?._id) {
        successMessage("Download to cloud success!", 2000);
        let sourcePath = "public/" + dataForEvents?.data?.newFilename;
        let destinationPath =
          user?.newName +
          "-" +
          user?._id +
          "/" +
          randomName +
          getFileNameExtension(dataForEvents?.data?.filename);
        handleUploadToBunny(sourcePath, destinationPath);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadToBunny = async (sourcePath, destinationPath) => {
    try {
      await uploadToBunny({
        variables: {
          pathFile: {
            sourceFilePath: sourcePath,
            destinationFilePath: destinationPath,
          },
        },
      });
    } catch (error) {
      errorMessage("Somthing went wrong!", 2000);
    }
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
    let privatePath =
      user?.newName + "-" + user?._id + "/" + dataForEvents?.data?.newPath;
    let publicPath = "public/" + dataForEvents.data.newFilename;
    try {
      const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
      const headers = {
        accept: "*/*",
        storageZoneName: REACT_APP_STORAGE_ZONE,
        isFolder: false,
        path: dataForEvents?.data?.newPath ? privatePath : publicPath,
        fileName: CryptoJS.enc.Utf8.parse(
          CutfileName(
            dataForEvents.data.filename,
            dataForEvents.data.newFilename,
          ),
        ),
        AccessKey: REACT_APP_ACCESSKEY_BUNNY,
      };
      const encryptedHeaders = CryptoJS.AES.encrypt(
        JSON.stringify(headers),
        secretKey,
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
      }

      const blob = new Blob(chunks);
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = CutfileName(
        dataForEvents.data.filename,
        dataForEvents.data.newFilename,
      );
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
      customGetFiles();
    } catch (error) {
      resetDataForEvents();
      errorMessage("Download failed! tray again!", 2000);
    }
  };

  const handleDeleteFilesAndFolders = async () => {
    try {
      if (dataForEvents.type === "folder") {
        return;
      } else {
        await deleteFile({
          variables: {
            id: dataForEvents.data._id,
          },
          onCompleted: async () => {
            successMessage("Delete file successful!!", 2000);
            customGetFiles();
            resetDataForEvents();
          },
        });
      }
    } catch (err) {
      resetDataForEvents();
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
            filename: existName ? existName : name,
            updatedBy: user._id,
          },
        },
        onCompleted: async () => {
          successMessage("Update File successfull", 2000);
          setIsAutoClose(true);
          setWarningMessage("");
          setExistName("");
          customGetFiles();
          setRenameDialogOpen(false);
          await handleActionFile("edit");
          resetDataForEvents();
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

  const handleCloseRenameDialog = () => {
    setWarningMessage("");
    setExistName("");
    resetDataForEvents();
    setRenameDialogOpen(false);
  };

  return (
    <React.Fragment>
      <Mui.FileTypeContainer>
        <Mui.TitleAndSwitch className="title-n-switch">
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              href="/file-drop"
              sx={{
                color: "#4B465C",
                fontSize: "0.9rem",
                fontWeight: "400",
                "&:hover": {
                  cursor: "pointer",
                  textDecoration: "none",
                },
              }}
            >
              file drop
            </Link>
            <Link
              sx={{
                color: "#4B465C",
                fontSize: "0.9rem",
                fontWeight: "500",
                "&:hover": {
                  cursor: "pointer",
                  textDecoration: "none",
                },
              }}
            >
              file drop details
            </Link>
          </Breadcrumbs>
          {fetchFiles.isDataFound !== null && fetchFiles.isDataFound && (
            <SwitchPages
              handleToggle={handleToggle}
              toggle={toggle === "grid" ? "grid" : "list"}
              setToggle={setToggle}
            />
          )}
        </Mui.TitleAndSwitch>
        {fetchFiles.isDataFound !== null && fetchFiles.isDataFound && (
          <Mui.FileTypeList>
            <React.Fragment>
              {fetchFiles.data.length > 0 && (
                <Mui.FileTypeItem>
                  <React.Fragment>
                    {toggle === "grid" && (
                      <FileCardContainer>
                        {fetchFiles.data.map((data, index) => {
                          let privatePath =
                            REACT_APP_BUNNY_PULL_ZONE +
                            user?.newName +
                            "-" +
                            user?._id +
                            "/" +
                            data?.newPath;
                          let publicPath =
                            REACT_APP_BUNNY_PULL_ZONE +
                            "public/" +
                            data.newFilename;
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
                                data?.newPath ? privatePath : publicPath
                              }
                              fileType={GetFileTypeFromFullType(data.fileType)}
                              name={CutfileName(
                                data.filename,
                                data.newFilename,
                              )}
                              key={index}
                              menuItems={fileDropMenuItems.map(
                                (menuItem, index) => {
                                  return (
                                    <MenuDropdownItem
                                      isFavorite={data.favorite ? true : false}
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
                      <FileDropDataGrid
                        pagination={{
                          total: Math.ceil(fetchFiles.total / ITEM_PER_PAGE),
                          currentPage: currentFilePage,
                          setCurrentPage: setCurrentFilePage,
                        }}
                        data={fetchFiles.data}
                        handleEvent={(action, data) => {
                          setDataForEvents({
                            action,
                            data,
                          });
                        }}
                      />
                    )}
                  </React.Fragment>
                </Mui.FileTypeItem>
              )}
            </React.Fragment>
          </Mui.FileTypeList>
        )}
      </Mui.FileTypeContainer>
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
            dataForEvents?.data?.newPath
              ? REACT_APP_BUNNY_PULL_ZONE +
                user?.newName +
                "-" +
                user?._id +
                "/" +
                dataForEvents?.data?.newPath
              : REACT_APP_BUNNY_PULL_ZONE +
                "public/" +
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
      <RenameDialogFile
        open={renameDialogOpen}
        onClose={handleCloseRenameDialog}
        onSave={handleRename}
        title={"Rename file"}
        label={"Rename file"}
        setName={setName}
        defaultValue={dataForEvents?.data?.filename}
        extension={getFileNameExtension(name)}
        name={existName ? existName : name}
        detail={warningMessage}
      />
      {showProgressing && (
        <ProgressingBar procesing={procesing} progressing={progressing} />
      )}
    </React.Fragment>
  );
}

export default Detail;
