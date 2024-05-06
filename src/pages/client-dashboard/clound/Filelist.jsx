import { useLazyQuery, useMutation } from "@apollo/client";
import { Box, useMediaQuery } from "@mui/material";
import CryptoJS from "crypto-js";
import React, { useEffect, useMemo, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { BiTime } from "react-icons/bi";
import ResponsivePagination from "react-responsive-pagination";
import { errorMessage, successMessage } from "../../../components/Alerts";
import {
  ConvertBytetoMBandGB,
  CutfileName,
  DateFormat,
  GetFileType,
  GetFileTypeFromFullType,
  getFileNameExtension,
  getFilenameWithoutExtension,
  truncateName,
} from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import Action from "../actionTable/Action";
import ProgressingBar from "../components/progressingBar";
import { QUERY_RECENT_FILE_ALL } from "../recent/apollo";
import "./../components/css/pagination.css";
import {
  MUTATION_ACTION_FILE,
  MUTATION_DELETE_RECENT_FILE,
  MUTATION_UPDATE_RECENT_FILE,
  QUERY_DESC_FOLDER,
} from "./apollo";

import { Base64 } from "js-base64";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import FileDetailsDialog from "../../../components/FileDetailsDialog";
import useBreadcrumbData from "../../../hooks/useBreadcrumbData";
import useGetUrl from "../../../hooks/useGetUrl";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
import CreateShare from "../components/CreateShare";
import PreviewFile from "../components/PreviewFile";
import RenameDialogFile from "../components/RenameDialogFile";
import { useMenuDropdownState } from "../components/menu/MenuDropdownProvider";
import useDownloadFile from "../share-with-me/hooks/useDownloadFile";
import DataGridFile from "./DataGridFile";

function Filelist(props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const open = Boolean(null);
  const [name, setName] = useState("");
  const [hover, setHover] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [progressing, setProgressing] = React.useState(0);
  const [procesing, setProcesing] = React.useState(true);
  const [dataAction, setDataAction] = useState(null);
  const [showProgressing, setShowProgressing] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [fileType, setFileType] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:600px) and (max-width:1024px)");
  const [openShare, setOpenShare] = useState(Boolean(false));
  const [path, setPath] = useState("");
  const [afterDowload, setAfterDowload] = React.useState(null);
  const [fileDetailsOpen, setFileDetailsOpen] = React.useState(false);
  const [dataGetUrl, setDataGetUrl] = useState(null);
  const ACCESS_KEY = process.env.REACT_APP_ACCESSKEY_BUNNY;
  const STORAGE_ZONE = process.env.REACT_APP_STORAGE_ZONE;
  const SECRET_KEY = process.env.REACT_APP_BUNNY_SECRET_KEY;
  let PreviewImageUrl = process.env.REACT_APP_BUNNY_PULL_ZONE;
  const {
    fileRefetch,
    currentFilePage,
    setCurrentFilePage,
    countFilePage,
    rowFilePage,
    total,
  } = props;
  const [updateFile] = useMutation(MUTATION_UPDATE_RECENT_FILE);
  const [deleteRecentFile] = useMutation(MUTATION_DELETE_RECENT_FILE);
  const [fileAction] = useMutation(MUTATION_ACTION_FILE, {
    refetchQueries: [
      {
        query: QUERY_RECENT_FILE_ALL,
        variables: {
          where: {
            status: "active",
          },
          limit: 100,
          orderBy: "actionDate_DESC",
        },
        awaitRefetchQueries: true,
      },
    ],
  });

  const [getFolder] = useLazyQuery(QUERY_DESC_FOLDER, {
    fetchPolicy: "no-cache",
  });
  const { setIsAutoClose, isAutoClose } = useMenuDropdownState();
  const handleCloseRenameDialog = () => {
    setRenameOpen(false);
  };
  const handleGetFolderURL = useGetUrl(dataGetUrl);
  const totalDownloadHandle = useDownloadFile(afterDowload);
  React.useEffect(() => {
    if (afterDowload) {
      totalDownloadHandle(afterDowload);
    }
  }, [afterDowload]);

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

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

  /* data for Breadcrumb */
  const breadcrumbData = useBreadcrumbData(
    dataAction?.path ||
      (dataAction?.path, CutfileName(dataAction?.filename, newName)),
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

  // rename file function
  const handleSaveRename = async () => {
    let actionStatus = "edit";

    try {
      let updateRecentFile = await updateFile({
        variables: {
          where: {
            _id: dataAction?._id,
          },
          data: {
            filename: name,
            updatedBy: user._id,
          },
        },
      });
      if (updateRecentFile?.data?.updateFiles?._id) {
        handleActionFile(actionStatus);
        handleCloseRenameDialog();
        successMessage("Update File successfull", 2000);
      }

      fileRefetch();
    } catch (error) {
      errorMessage(
        "Sorry!!. Something went wrong. Please try again later!!",
        2000,
      );
    }
  };

  const handleDownloadZipFile = async (data) => {
    let actionStatus = "download";
    setShowProgressing(true);
    setOpenPreview(false);
    setIsAutoClose(true);
    const secretKey = SECRET_KEY;
    let real_path;
    if (data?.newPath || hover?.newPath || dataAction?.newPath) {
      real_path = truncateName(
        "/" + data?.newPath ||
          "/" + hover?.newPath ||
          "/" + dataAction?.newPath,
      );
    } else {
      real_path = "";
    }
    try {
      let headers;
      if (!data == null || (data !== "undefined" && data)) {
        headers = {
          accept: "*/*",
          storageZoneName: STORAGE_ZONE,
          isFolder: false,
          path:
            user.newName + "-" + user._id + real_path + "/" + data?.newFilename,
          fileName: data?.newFilename,
          AccessKey: ACCESS_KEY,
        };
      } else {
        headers = {
          accept: "*/*",
          storageZoneName: STORAGE_ZONE,
          isFolder: false,
          path:
            user.newName +
              "-" +
              user._id +
              real_path +
              "/" +
              dataAction?.newFilename || hover?.newFilename,
          fileName: CryptoJS.enc.Utf8.parse(
            dataAction?.filename || hover?.newFilename,
          ),
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
        await handleActionFile(actionStatus);
        setAfterDowload(data?._id || hover?._id || dataAction?._id);
      }
      const blob = new Blob(chunks);
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download =
        CutfileName(data?.filename, data?.newFilename) ||
        CutfileName(hover?.newFilename) ||
        CutfileName(dataAction?.newFilename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (countPercentage === 100) {
        setShowProgressing(false);
        setProcesing(false);
        successMessage("Download successful", 2000);
        setAfterDowload("");
      } else {
        setAfterDowload("");
      }

      fileRefetch();
      setDataAction(null);
    } catch (error) {
      console.error(error);
    }
  };

  // File action for count in recent file
  const handleActionFile = async (val) => {
    try {
      await fileAction({
        variables: {
          fileInput: {
            createdBy: parseInt(user._id),
            fileId: parseInt(hover?._id) || parseInt(dataAction?._id),
            actionStatus: val,
          },
        },
      });
    } catch (error) {
      errorMessage(error, 2500);
    }
  };

  // DELETE FILE
  const handleDeleteFile = async (data) => {
    try {
      let deleteFile = await deleteRecentFile({
        variables: {
          where: {
            _id: data?.id,
          },
          data: {
            status: "deleted",
            createdBy: user._id,
          },
        },
      });

      if (deleteFile?.data?.updateFiles?._id) {
        // handleDialogClose();
        successMessage("Delete file successful!!", 2000);
      }
      fileRefetch();
    } catch (err) {
      errorMessage("Sorry! Something went wrong. Please try again!");
    }
  };

  // on open file
  const hanleOpenFile = (parame) => {
    setOpenPreview(true);
    setName(parame?.row?.filename);
    setNewName(parame?.row?.newFilename);
    setFileType(parame?.row?.fileType);
    setPath(parame?.row.path);
    setDataAction(parame?.row);
  };

  const onPreViewClick = (data) => {
    if (isTablet || isMobile) {
      hanleOpenFile(data);
    }
  };

  const handleEvent = async (e, value) => {
    setIsAutoClose(true);
    // setId(value?._id);
    setDataAction(value);
    setName(CutfileName(value?.filename, value?.newFilename));

    if (e === "download") {
      await handleDownloadZipFile(value);
    } else if (e === "rename") {
      setRenameOpen(true);
    } else if (e === "delete") {
      handleDeleteFile(value);
    } else if (e === "favourite") {
      handleFavourite(value);
    } else if (e === "get link") {
      setDataGetUrl(value);
    } else if (e === "share") {
      setOpenShare(true);
    } else if (e === "detail") {
      setFileDetailsOpen(true);
      setNewName(value?.newFilename);
    }
  };

  // favourite function
  const handleFavourite = async (val) => {
    try {
      await updateFile({
        variables: {
          where: {
            _id: parseInt(val?._id) || dataAction._id,
          },
          data: {
            favorite: val?.favorite || dataAction?.favorite ? 0 : 1,
          },
        },
        onCompleted: () => {
          setIsAutoClose(true);
          if (val?.favorite) {
            fileRefetch();
            successMessage("One File removed from Favourite", 1000);
          } else {
            successMessage("One File added to Favourite", 1000);
            fileRefetch();
          }
          setDataAction((state) => ({
            ...state,
            favorite: dataAction?.favorite ? 0 : 1,
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

  const NO = (index) => {
    const no = rowFilePage * currentFilePage - rowFilePage;

    if (rowFilePage > 0) {
      return no + index + 1;
    } else {
      return index + 1;
    }
  };

  const columns = [
    {
      field: "filename",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", alignItems: "center", columnGap: "12px" }}
          >
            <Box
              sx={{ width: "20px", textAlign: "center" }}
              mt={2}
              onClick={() => onPreViewClick(params)}
            >
              <FileIcon
                color="white"
                extension={GetFileType(params.row.filename)}
                {...{ ...defaultStyles[GetFileType(params.row.filename)] }}
              />
            </Box>
            <span>
              {CutfileName(params?.row?.filename, params?.row?.newFilename)}
            </span>
          </div>
        );
      },
    },
    {
      field: "size",
      headerName: "File size",
      flex: 1,
      renderCell: (params) => {
        return (
          <span>
            {ConvertBytetoMBandGB(params.row.size ? params.row.size : 0)}
          </span>
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Lasted Update",
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
      headerAlign: "right",
      editable: false,
      sortable: false,
      renderCell: (params) => {
        return (
          <Action
            params={params}
            eventActions={{
              hover,
              setHover,
              handleEvent,
            }}
          />
        );
      },
    },
  ];

  const rows = useMemo(
    () =>
      props?.data.map((row, index) => ({
        ...row,
        id: row._id,
        index: NO(index),
      })) || [],
    [props.data],
  );

  return (
    <div>
      <DataGridFile
        dataGrid={{
          columns,
          hideFooter: true,
          sx: {
            "& .MuiDataGrid-columnSeparator": { display: "none" },
            "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
              display: "none",
            },
            ".MuiDataGrid-columnHeaders": {
              fontSize: "1rem",
            },
          },
        }}
        data={rows}
        key={(row) => row.id}
        setHover={setHover}
        open={open}
        hanleOpenFile={hanleOpenFile}
      />

      {total > rows?.length && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
            mt: 3,
          }}
        >
          <ResponsivePagination
            current={currentFilePage}
            total={countFilePage}
            onPageChange={setCurrentFilePage}
          />
        </Box>
      )}

      {showProgressing && (
        <ProgressingBar procesing={procesing} progressing={progressing} />
      )}
      <RenameDialogFile
        open={renameOpen}
        onClose={handleCloseRenameDialog}
        onClick={handleSaveRename}
        title="Rename file"
        label={CutfileName(name, newName)}
        setName={setName}
        name={CutfileName(name, newName)}
        defaultValue={getFilenameWithoutExtension(dataAction?.filename)}
        extension={getFileNameExtension(name)}
      />

      {openPreview && (
        <PreviewFile
          open={openPreview}
          handleClose={handleClosePreview}
          onClick={handleDownloadZipFile}
          filename={CutfileName(name, newName)}
          newFilename={newName}
          fileType={fileType}
          path={path}
          user={user}
        />
      )}

      {openShare && (
        <CreateShare
          onClose={() => {
            setOpenShare(false);
          }}
          open={openShare}
          data={dataAction}
          refetch={fileRefetch}
        />
      )}

      {fileDetailsOpen && dataAction && (
        <FileDetailsDialog
          iconTitle={<BiTime />}
          title="My Cloud"
          path={breadcrumbData}
          name={CutfileName(dataAction?.filename, dataAction?.newFilename)}
          breadcrumb={{
            handleFolderNavigate:
              handleFileDetailDialogBreadcrumbFolderNavigate,
          }}
          type={GetFileTypeFromFullType(dataAction.fileType)}
          displayType={dataAction?.fileType}
          size={dataAction?.size ? ConvertBytetoMBandGB(dataAction?.size) : 0}
          dateAdded={moment(
            dataAction.createdAt,
            "YYYY-MM-DDTHH:mm:ss.SSS",
          ).format(DATE_PATTERN_FORMAT.datetime)}
          lastModified={moment(
            dataAction.updatedAt,
            "YYYY-MM-DDTHH:mm:ss.SSS",
          ).format(DATE_PATTERN_FORMAT.datetime)}
          totalDownload={dataAction?.totalDownload}
          isOpen={fileDetailsOpen}
          onClose={() => {
            setFileDetailsOpen(false);
          }}
          imageUrl={
            PreviewImageUrl +
            user.newName +
            "-" +
            user._id +
            "/" +
            (dataAction?.newPath ? truncateName(dataAction?.newPath) : "") +
            dataAction?.newFilename
          }
          {...{
            favouriteIcon: {
              isShow: true,
              handleFavouriteOnClick: async () => await handleFavourite(),
              isFavourite: dataAction?.favorite ? true : false,
            },
            downloadIcon: {
              isShow: true,
              handleDownloadOnClick: async () =>
                await handleDownloadZipFile(dataAction),
            },
          }}
        />
      )}
    </div>
  );
}

export default Filelist;
