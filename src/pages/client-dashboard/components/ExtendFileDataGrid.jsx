import React, { useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import "./../components/css/pagination.css";

// material ui icon and component
import { Box, useMediaQuery } from "@mui/material";
//function
import ResponsivePagination from "react-responsive-pagination";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { ConvertBytetoMBandGB, GetFileType } from "../../../functions";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
import Action from "../actionTable/Action";
import ActionFileShare from "../actionTable/ActionFileShare";

import FileDataGrid from "./file/FileDataGrid";
import menuItems, {
  favouriteMenuItems,
  shortFavouriteMenuItems,
  shortFileShareMenu,
} from "./menu/MenuItems";
const ExtendFilesDataGridContainer = styled("div")(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const FileIconContainer = styled("div")(() => ({
  width: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
}));

function ExtendFilesDataGrid(props) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:600px) and (max-width:1024px)");
  const [hover, setHover] = useState("");
  const [anchorEvent, setAnchorEvent] = React.useState(null);
  const [menuDropdownAnchor, setMenuDropdownAnchor] = React.useState(null);
  // const [isLoaded, setIsloaded] = useState(null);

  const handlePopperOpen = (event) => {
    const id = event.currentTarget.dataset.id;
    const row = props.data.find((r) => r.id === id);
    setHover(row);
    setAnchorEvent(event.currentTarget);
  };

  const handleOnPreview = (data) => {
    if (isTablet || isMobile) {
      props.handleEvent("preview", data.row);
    }
  };
  // const handlePopperClose = (event) => {
  const handlePopperClose = () => {
    if (anchorEvent == null) {
      return;
    }
    setHover("");
    setAnchorEvent(null);
  };

  // React.useEffect(() => {
  //   if (props.data.length > 0) {
  //     setIsloaded(true);
  //   }
  // }, [props.data]);

  const columns = [
    {
      field: "filename",
      headerName: "Name",
      editable: false,
      renderCell: (params) => {
        const { name } = params.row;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: "12px",
            }}
          >
            <FileIconContainer onClick={() => handleOnPreview(params)}>
              <FileIcon
                extension={GetFileType(name)}
                {...{ ...defaultStyles[GetFileType(name)] }}
              />
            </FileIconContainer>
            <div className="file_name">{name}</div>
          </div>
        );
      },
      flex: 1,
    },
    {
      field: "size",
      headerName: "Size",
      renderCell: (params) => {
        return <Box>{ConvertBytetoMBandGB(params.row.size)}</Box>;
      },
      editable: false,
      flex: 1,
    },
    {
      field: "updatedAt",
      headerName: "Date",
      editable: false,
      renderCell: (params) =>
        moment(params.row.updatedAt).format(DATE_PATTERN_FORMAT.datetime),
      flex: 1,
    },
    {
      field: "action",
      headerName: "",
      flex: 1,
      align: "right",
      editable: false,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {props.isFromSharingUrl ? (
              <ActionFileShare
                params={params}
                eventActions={{
                  hover,
                  setHover,
                  handleEvent: (action, data) =>
                    props.handleEvent(action, data),
                }}
                menuItems={menuItems}
                shortMenuItems={props.shortMenuItems || shortFileShareMenu}
                anchor={[menuDropdownAnchor, setMenuDropdownAnchor]}
                user={props.user}
              />
            ) : (
              <Action
                params={params}
                eventActions={{
                  hover,
                  setHover,
                  handleEvent: (action, data) =>
                    props.handleEvent(action, data),
                }}
                menuItems={favouriteMenuItems}
                shortMenuItems={shortFavouriteMenuItems}
                anchor={[menuDropdownAnchor, setMenuDropdownAnchor]}
                user={props.user}
              />
            )}
          </>
        );
      },
    },
  ];

  return (
    <ExtendFilesDataGridContainer>
      <FileDataGrid
        dataGrid={{
          sx: {
            "& .MuiDataGrid-columnSeparator": { display: "none" },
          },
          checked: true,
          disableColumnFilter: true,
          disableColumnMenu: true,
          componentsProps: {
            row: {
              onMouseEnter: handlePopperOpen,
              onMouseLeave: handlePopperClose,
            },
          },
          onRowDoubleClick: (params) => {
            props.handleEvent("preview", params.row);
          },
          columns,
          hideFooter: true,
        }}
        data={props.data}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "90%",
          mt: 3,
        }}
      >
        {/* <ResponsivePagination
          current={props?.pagination?.currentPage}
          total={props?.pagination?.total}
          onPageChange={props?.pagination?.setCurrentPage}
        /> */}
      </Box>
    </ExtendFilesDataGridContainer>
  );
}

export default ExtendFilesDataGrid;
