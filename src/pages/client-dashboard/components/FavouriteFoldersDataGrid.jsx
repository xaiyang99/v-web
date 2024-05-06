import React, { useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import "./../components/css/pagination.css";

// material ui icon and component
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// component

// graphql

//function
import moment from "moment";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
import Action2 from "../actionTable/Action2";
import FileDataGrid from "./file/FileDataGrid";
import { favouriteMenuItems, shortFavouriteMenuItems } from "./menu/MenuItems";

const FavouriteFoldersDataGridContainer = styled("div")(() => ({
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

function FavouriteFoldersDataGrid(props) {
  const [hover, setHover] = useState("");
  const [anchorEvent, setAnchorEvent] = React.useState(null);
  const [menuDropdownAnchor, setMenuDropdownAnchor] = React.useState(null);
  const [isLoaded, setIsloaded] = useState(null);

  const handlePopperOpen = (event) => {
    const id = event.currentTarget.dataset.id;
    const row = props.data.find((r) => r.id === id);
    setHover(row);
    setAnchorEvent(event.currentTarget);
  };
  const handlePopperClose = (event) => {
    if (anchorEvent == null) {
      return;
    }
    setHover("");
    setAnchorEvent(null);
  };

  React.useEffect(() => {
    if (props.data.length > 0) {
      setIsloaded(true);
    }
  }, [props.data]);

  const columns = [
    {
      field: "folder_name",
      headerName: "Name",
      editable: false,
      renderCell: (params) => {
        const { folder_name } = params.row;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: "12px",
            }}
          >
            <FileIconContainer>
              <FolderCopyIcon color="primaryTheme" />
            </FileIconContainer>
            <div className="file_name">{folder_name}</div>
          </div>
        );
      },
      flex: 1,
    },
    {
      field: "size",
      headerName: "Size",
      renderCell: (params) => 0,
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
      renderCell: (params, index) => {
        return (
          <Action2
            params={params}
            eventActions={{
              hover,
              setHover,
              handleEvent: (action, data) => props.handleEvent(action, data),
            }}
            menuItems={favouriteMenuItems}
            shortMenuItems={shortFavouriteMenuItems}
            anchor={[menuDropdownAnchor, setMenuDropdownAnchor]}
          />
        );
      },
    },
  ];

  return (
    <FavouriteFoldersDataGridContainer>
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
          columns,
          hideFooter: true,
        }}
        data={props.data}
      />
      {props.pagination.total > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
            mt: 3,
          }}
        >
          {isLoaded !== null && isLoaded && (
            <ResponsivePagination
              current={props.pagination.currentPage}
              total={props.pagination.total}
              onPageChange={props.pagination.setCurrentPage}
            />
          )}
        </Box>
      )}
    </FavouriteFoldersDataGridContainer>
  );
}

export default FavouriteFoldersDataGrid;
