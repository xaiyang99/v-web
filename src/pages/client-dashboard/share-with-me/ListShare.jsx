import { Box, styled, useMediaQuery } from "@mui/material";
import { Base64 } from "js-base64";
import React, { Fragment, useMemo, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";
import {
  ConvertBytetoMBandGB,
  DateFormat,
  GetFileType,
} from "../../../functions";
import ActionFileShare from "../actionTable/ActionFileShare";
import ActionShare from "../actionTable/ActionShare";
import DataGridFile from "../clound/DataGridFile";
import * as MyfolderFull from "../clound/icons";
import PaginationCirlce from "../components/PaginationCirlce";
import {
  shareWithMeFileMenuItems,
  shareWithMeFolderMenuItems,
  shortFavouriteMenuItems,
  shortFileShareMenu,
} from "../components/menu/MenuItems";
import "./../components/css/pagination.css";

const IconFolderContainer = styled(Box)({
  minWidth: "30px",
  marginLeft: "-5px",
});
function ListShare(props) {
  const { data, onDoubleClick } = props;
  const navigate = useNavigate();
  const [menuDropdownAnchor, setMenuDropdownAnchor] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [hover, setHover] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:600px) and (max-width:1024px)");
  const hanleOpenFile = (params) => {
    if (params?.row?.folderId?.folder_type) {
      onDoubleClick(params?.row);
    } else {
      props.handleEvent("preview", params?.row);
    }
  };

  const [showLoader, setShowLoader] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const handleOnClick = (data) => {
    if ((data.folderId?.folder_type && isTablet) || isMobile) {
      let userData =
        data?.fromAccount?._id +
        "/" +
        data?.fromAccount?.newName +
        "/" +
        data?.permission +
        "/" +
        data?.folderId?.url;
      let base64URL = Base64.encodeURI(userData);
      navigate(`/folder/${base64URL}`);
    }
  };

  const onPreViewClick = (data) => {
    if (isTablet || isMobile) {
      props.handleEvent("preview", data);
    }
  };

  const columns = [
    {
      field: "folder_name||filename",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "20px", textAlign: "center" }} mt={2}>
              {params?.row?.folderId?.folder_name ? (
                <IconFolderContainer onClick={() => handleOnClick(params.row)}>
                  <MyfolderFull.MyfolderFull />
                </IconFolderContainer>
              ) : (
                <Box onClick={() => onPreViewClick(params.row)}>
                  <FileIcon
                    extension={GetFileType(params?.row?.fileId?.filename)}
                    {...{
                      ...defaultStyles[
                        GetFileType(params?.row?.fileId?.filename)
                      ],
                    }}
                  />
                </Box>
              )}
            </Box>
            &nbsp;&nbsp;
            <span>
              {params?.row?.folderId?.folder_name ||
                params?.row?.fileId?.filename}
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
        let checkFolder = params.row?.folderId?._id;
        let fileSize = 0;

        if (checkFolder) {
          fileSize = 1024;
        } else {
          fileSize = params.row?.fileId?.size || 0;
        }

        return <Fragment>{ConvertBytetoMBandGB(fileSize)}</Fragment>;
      },
    },

    {
      field: "updatedAt",
      headerName: "Lasted shared",
      flex: 1,
      renderCell: (params) => {
        return <span>{DateFormat(params.row.createdAt)}</span>;
      },
    },
    {
      field: "action",
      headerName: "",
      flex: 1,
      align: "right",
      renderCell: (params) => {
        if (params?.row?.folderId?.folder_type) {
          return (
            <ActionShare
              params={params?.row}
              shortMenuItems={shortFavouriteMenuItems}
              menuItems={shareWithMeFolderMenuItems}
              eventActions={{
                hover,
                setHover,
                handleEvent: (action, data) => props?.handleEvent(action, data),
              }}
            />
          );
        } else {
          return (
            <ActionFileShare
              params={params}
              eventActions={{
                hover,
                setHover,
                handleEvent: (action, data) => props?.handleEvent(action, data),
              }}
              menuItems={shareWithMeFileMenuItems}
              shortMenuItems={shortFileShareMenu}
              anchor={[menuDropdownAnchor, setMenuDropdownAnchor]}
            />
          );
        }
      },
    },
  ];

  const rows = useMemo(
    () =>
      data?.map((row) => ({
        ...row,
        id: row._id,
      })) || [],
    [data],
  );

  return (
    <Fragment>
      {showLoader && rows?.length && <Loader />}
      {!showLoader && (
        <>
          <DataGridFile
            dataGrid={{ columns, hideFooter: true }}
            data={rows}
            key={(row) => row._id}
            hover={hover}
            setHover={setHover}
            open={open}
            hanleOpenFile={hanleOpenFile}
          />
          {props.pagination?.countPage > 1 && (
            <>
              {props.pagination?.countTotal > rows?.length && (
                <PaginationCirlce
                  current={props.pagination.currentPage}
                  countPage={props.pagination.countPage}
                  onPageChange={props.pagination.setCurrentPage}
                />
              )}
            </>
          )}
        </>
      )}
    </Fragment>
  );
}

export default ListShare;
