import { useMutation } from "@apollo/client";
import { Box, styled, useMediaQuery } from "@mui/material";
import CryptoJS from "crypto-js";
import { Base64 } from "js-base64";
import React, { useEffect, useMemo } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { useNavigate } from "react-router-dom";
import streamSaver from "streamsaver";
import * as Icons from "./icons";

import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { errorMessage, successMessage } from "../../../components/Alerts";
import {
  ConvertBytetoMBandGB,
  DateFormat,
  getFileNameExtension,
  getFilenameWithoutExtension,
} from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import Action2 from "../actionTable/Action2";
import CreateFileDropDialog from "../components/CreateFileDropDialog";
import CreateShare from "../components/CreateShare";
import RenameDialogFile from "../components/RenameDialogFile";
import {
  MUTATION_SOFT_DELETE_FOLDER,
  MUTATION_UPDATE_FOLDER,
} from "../components/apollo";
import { useMenuDropdownState } from "../components/menu/MenuDropdownProvider";
import {
  favouriteMenuItems,
  shortFavouriteMenuItems,
} from "../components/menu/MenuItems";
import "./../components/css/pagination.css";
// import ProgressingBar from "../components/progressingBar";
import { QUERY_RENDER_FOLDER } from "../../../client-components/sidebar/apollo/SidebarApollo";
import { FolderContext } from "../../../contexts/FolderContext";
import useGetUrl from "../../../hooks/useGetUrl";
import { CREATE_FILEDROP_LINK_CLIENT } from "../file-drop/apollo";

const IconFolderContainer = styled(Box)({
  width: "30px",
});

function FolderList(props) {
  const {
    folder,
    currentPage,
    setCurrentPage,
    countPage,
    rowPerpage,
    totalPages,
    folderRefetch,
    setMultiSelectId,
    multiSelectId,
    setOptionsValue,
    setGetValue,
    getValue,
    multiChecked,
    setMultiChecked,
  } = props;

  const navigate = useNavigate();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  // const [anchorEvent, setAnchorEvent] = React.useState(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const { setFolderId } = React.useContext(FolderContext);
  const [updateFolder] = useMutation(MUTATION_UPDATE_FOLDER, {
    refetchQueries: [QUERY_RENDER_FOLDER],
  });
  const [createFileDropLink] = useMutation(CREATE_FILEDROP_LINK_CLIENT);
  const [deleteFolder] = useMutation(MUTATION_SOFT_DELETE_FOLDER);
  const [dataAction, setDataAction] = useState(null);
  const { setIsAutoClose, isAutoClose } = useMenuDropdownState();
  const [name, setName] = useState("");
  const [hover, setHover] = useState("");
  // const [showProgressing, setShowProgressing] = React.useState(false);
  // const [progressing, setProgressing] = React.useState(0);
  // const [procesing, setProcesing] = React.useState(true);
  const [openShare, setOpenShare] = useState(Boolean(false));
  const [dataGetUrl, setDataGetUrl] = useState(null);
  const ACCESS_KEY = process.env.REACT_APP_ACCESSKEY_BUNNY;
  const STORAGE_ZONE = process.env.REACT_APP_STORAGE_ZONE;
  const SECRET_KEY = process.env.REACT_APP_BUNNY_SECRET_KEY;
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:600px) and (max-width:1024px)");
  const handleGetFolderURL = useGetUrl(dataGetUrl);
  const [openFileDrop, setOpenFileDrop] = React.useState(false);
  const [folderDropId, setFolderDropId] = React.useState(0);

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

  const handleClose = () => {
    setAnchorEl(null);
  };

  // rename close
  const renameClose = () => {
    setRenameOpen(false);
  };

  const handleCloseFileDropDialog = () => {
    setOpenFileDrop(false);
  };

  // download folder function
  streamSaver.mitm = "/mitm.html";
  const handleDownloadZipFile = async (data) => {
    if (data?.file_id[0]?._id || data?.parentkey[0]?._id) {
      // setShowProgressing(true);
      const folder_name = `${data?.folder_name}.zip`;
      const secretKey = SECRET_KEY;
      try {
        const headers = {
          accept: "/",
          storageZoneName: STORAGE_ZONE,
          isFolder: true,
          path: user.newName + "-" + user._id + "/" + data.newPath,
          fileName: CryptoJS.enc.Utf8.parse(folder_name),
          AccessKey: ACCESS_KEY,
          _id: data?._id,
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
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
      // setShowProgressing(false);
    } else {
      errorMessage("Folder is empty !", 3000);
    }
  };

  // rename folder
  const handleFolderRename = async () => {
    try {
      let update = await updateFolder({
        variables: {
          where: {
            _id: dataAction.id,
            checkFolder: dataAction.checkFolder,
          },
          data: {
            folder_name: name,
          },
        },
      });

      if (update?.data?.updateFolders?._id) {
        renameClose();
        successMessage("Update success", 3000);
        props.folderRefetch();
      }
    } catch (err) {
      errorMessage("Update failed !", 3000);
    }
  };

  // delele folder
  const handleDeleteFolder = async (params) => {
    let data = await deleteFolder({
      variables: {
        where: {
          _id: params.id,
        },
        data: {
          checkFolder: params?.checkFolder,
          status: "deleted",
        },
      },
    });

    if (data?.data?.updateFolders?._id) {
      renameClose();
      props.folderRefetch();
      successMessage("Delete folder successfull!", 3000);
    }
  };

  // open file drop
  const handleOpenFileDropDialog = () => {
    setOpenFileDrop(true);
  };

  const handleEvent = async (e, data) => {
    setIsAutoClose(true);
    setDataAction(data);
    setName(data?.folder_name);

    if (e === "download") {
      await handleDownloadZipFile(data);
    } else if (e === "rename") {
      setRenameOpen(true);
    } else if (e === "delete") {
      handleDeleteFolder(data);
    } else if (e === "share") {
      setOpenShare(true);
    } else if (e === "pin") {
      handleAddPin();
    } else if (e === "filedrop") {
      setFolderDropId(data?._id);
      handleOpenFileDropDialog();
    } else if (e === "get link") {
      setDataGetUrl(data);
    }
  };

  const columns = [
    {
      field: "folder_name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", alignItems: "center", columnGap: "6px" }}
          >
            <IconFolderContainer onClick={() => handleClick(params)}>
              {params.row.file_id[0]?._id || params.row.parentkey[0]?._id ? (
                <Icons.MyfolderFull />
              ) : (
                <Icons.MyfolerEmpty />
              )}
            </IconFolderContainer>
            <span>{params?.row?.folder_name}</span>
          </div>
        );
      },
    },

    {
      field: "size",
      headerName: "Folder size",
      flex: 1,
      minWidth: 80,
      renderCell: (params) => {
        return <Box>{ConvertBytetoMBandGB(params?.row?.total_size)}</Box>;
      },
    },

    {
      field: "updatedAt",
      headerName: "Lasted Update",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return <span>{DateFormat(params.row.updatedAt)}</span>;
      },
    },
    {
      field: "action",
      headerName: "",
      flex: 1,
      headerAlign: "right",
      align: "right",
      editable: false,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <Action2
              params={params}
              shortMenuItems={shortFavouriteMenuItems}
              menuItems={favouriteMenuItems}
              eventActions={{
                hover,
                setHover,
                handleEvent,
              }}
            />
          </div>
        );
      },
    },
  ];

  const rows = useMemo(
    () =>
      folder?.folders?.data.map((row, index) => ({
        ...row,
        id: row?._id,
      })) || [],
    [folder?.folders?.data],
  );

  const handlePopperOpen = (event) => {
    const id = event.currentTarget.dataset.id;
    const row = rows?.find((r) => r._id === id);
    setHover(row);
    // setAnchorEvent(event.currentTarget);
  };

  const handlePopperClose = () => {
    if (open == null || open) {
      return;
    }
    setHover("");
  };

  const handleOnCellClick = (params) => {
    setFolderId(params?.id);
    let url = params?.row?.url;
    const base64URL = Base64.encodeURI(url);
    navigate(`/folder/${base64URL}`);
  };

  // is Mobile
  const handleClick = (data) => {
    if (isTablet || isMobile) {
      setFolderId(data?.id);
      let url = data?.row?.url;
      const base64URL = Base64.encodeURI(url);
      navigate(`/folder/${base64URL}`);
    }
  };

  useEffect(() => {
    if (multiChecked.length > 0) {
      setDataAction(null);
      setGetValue(null);
    }
  }, [getValue, dataAction]);

  const onRowSelect = (params, event) => {
    if (event.ctrlKey) {
      if (!multiChecked.includes(params?.row?.index)) {
        setMultiChecked([...multiChecked, params?.row?.index]);
        setMultiSelectId([...multiSelectId, params?.row]);
      } else {
        setMultiChecked(multiChecked.filter((id) => id !== params?.row.index));
        setMultiSelectId(
          multiSelectId.filter((id) => id?._id !== params?.row.id),
        );
      }
    } else {
      setDataAction(params?.row);
      setMultiChecked([]);
      setMultiSelectId([]);
      setOptionsValue(true);
      setGetValue(params.row);
    }
  };

  const getRowClassName = (params) => {
    if (multiChecked.includes(params?.row?.index)) {
      return "Mui-multi-selected";
    } else {
      return "";
    }
  };

  // pin foloder
  const handleAddPin = async () => {
    try {
      if (multiSelectId.length > 0) {
        for (let i = 0; i < multiSelectId.length; i++) {
          let folderPin = await updateFolder({
            variables: {
              where: {
                _id: multiSelectId[i]?._id,
              },
              data: {
                pin: multiSelectId[i]?.pin ? 0 : 1,
                updatedBy: user._id,
              },
            },
          });

          if (folderPin?.data?.updateFolders?._id) {
            setIsAutoClose(true);
            props.folderRefetch();
          }
          if (multiSelectId[i]?.pin) {
            successMessage("One folder removed from Pin", 2000);
          } else {
            successMessage("One folder added to Pin", 2000);
          }
        }
        setMultiSelectId([]);
        setOptionsValue(false);
        handleClose();
      } else {
        let folderPin = await updateFolder({
          variables: {
            where: {
              _id: hover?._id,
            },
            data: {
              pin: hover?.pin ? 0 : 1,
              updatedBy: user._id,
            },
          },
        });

        if (folderPin?.data?.updateFolders?._id) {
          setIsAutoClose(true);
          folderRefetch();
        }
        if (hover?.pin) {
          successMessage("One folder removed from Pin", 2000);
        } else {
          successMessage("One folder added to Pin", 2000);
        }
        folderRefetch();
        setOptionsValue(false);
      }
    } catch (error) {
      errorMessage(
        "Sorry!!. Something went wrong. Please try again later!!",
        2000,
      );
    }
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

  return (
    <div>
      <DataGrid
        sx={{
          "& .Mui-multi-selected": {
            bgcolor: "#e0f2f1 !important",
          },
          "& .MuiDataGrid-columnSeparator": { display: "none" },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
            display: "none",
          },
          ".MuiDataGrid-columnHeaders": {
            fontSize: "1rem",
          },
        }}
        getRowId={(row) => row._id}
        autoHeight
        rows={rows}
        key={() => Math.floor(Math.random() * 100)}
        columns={columns}
        disableColumnFilter
        disableColumnMenu
        rowsPerPageOptions={[]}
        hideFooter={true}
        aria-selected={false}
        componentsProps={{
          row: {
            onMouseEnter: handlePopperOpen,
            onMouseLeave: handlePopperClose,
          },
        }}
        style={{ border: "none", borderBottom: "1px solid #e0e0e0" }}
        onRowClick={onRowSelect}
        onCellDoubleClick={handleOnCellClick}
        getRowClassName={getRowClassName}
      />
      {totalPages > rows.length && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
            mt: 3,
          }}
        >
          <ResponsivePagination
            current={currentPage}
            total={countPage}
            onPageChange={setCurrentPage}
          />
        </Box>
      )}

      <RenameDialogFile
        open={renameOpen}
        onClose={renameClose}
        name={name}
        setName={setName}
        defaultValue={
          dataAction?.folder_type === "folder"
            ? name
            : getFilenameWithoutExtension(name)
        }
        extension={getFileNameExtension(name)}
        label="Rename folder"
        title="Rename folder"
        onClick={handleFolderRename}
      />

      <CreateFileDropDialog
        data
        isOpen={openFileDrop}
        onClose={handleCloseFileDropDialog}
        handleChange={handleCreateFileDrop}
      />

      {openShare && (
        <CreateShare
          onClose={() => {
            setOpenShare(false);
          }}
          open={openShare}
          data={dataAction}
          refetch={folderRefetch}
        />
      )}
      {/* 
      {showProgressing && (
        <ProgressingBar procesing={procesing} progressing={progressing} />
      )} */}
    </div>
  );
}

export default FolderList;
