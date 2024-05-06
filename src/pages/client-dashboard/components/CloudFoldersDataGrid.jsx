import React, { useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import "./../components/css/pagination.css";

// material ui icon and component
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// component
import * as Icons from "../../../icons/icons";

// graphql

//function
import { useMemo } from "react";
import { ConvertBytetoMBandGB, DateFormat } from "../../../functions";
import Action2 from "../actionTable/Action2";
import FileDataGrid from "./file/FileDataGrid";
import { favouriteMenuItems, shortMyCloudMenuItems } from "./menu/MenuItems";

const CloudFoldersDataGridContainer = styled("div")(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const IconFolderContainer = styled(Box)({
  width: "30px",
});

function CloudFoldersDataGrid(props) {
  const [hover, setHover] = useState("");
  const [isPage, setIsPage] = useState(false);
  const [anchorEvent, setAnchorEvent] = React.useState(null);
  const [menuDropdownAnchor, setMenuDropdownAnchor] = React.useState(null);
  const [isLoaded, setIsloaded] = useState(null);

  const handlePopperOpen = (event) => {
    const id = event.currentTarget.dataset.id;
    const row = props.data.find((r) => r._id === id);
    setHover(row);
    setAnchorEvent(event.currentTarget);
  };
  const handlePopperClose = () => {
    if (anchorEvent == null) {
      return;
    }
    setHover("");
    setAnchorEvent(null);
  };

  React.useEffect(() => {
    if (props.data?.length > 0) {
      setIsloaded(true);
    }
  }, [props.data]);

  React.useEffect(() => {
    if (props?.total > 10) {
      setIsPage(true);
    } else {
      setIsPage(false);
    }
  }, [props?.data]);

  const columns = [
    {
      field: "folder_name",
      headerName: "Name",
      editable: false,
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", alignItems: "center", columnGap: "6px" }}
          >
            <IconFolderContainer onClick={() => handleClick(params)}>
              {params.row?.total_size > 0 ? (
                <Icons.FolderFillIcon />
              ) : (
                <Icons.FolderEmptyIcon />
              )}
            </IconFolderContainer>
            <span>{params?.row?.folder_name}</span>
          </div>
        );
      },
      flex: 1,
    },
    {
      field: "size",
      headerName: "Folder size",
      renderCell: (params) => {
        return <span>{ConvertBytetoMBandGB(params?.row?.total_size)}</span>;
      },
      editable: false,
      flex: 1,
    },
    {
      field: "updatedAt",
      headerName: "Lasted Update",
      editable: false,
      renderCell: (params) => {
        return <span>{DateFormat(params.row.updatedAt)}</span>;
      },
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
          <Action2
            params={params}
            eventActions={{
              hover,
              setHover,
              handleEvent: (action, data) => props.handleEvent(action, data),
            }}
            menuItems={favouriteMenuItems}
            shortMenuItems={shortMyCloudMenuItems}
            anchor={[menuDropdownAnchor, setMenuDropdownAnchor]}
          />
        );
      },
    },
  ];

  const rows = useMemo(
    () =>
      props?.data.map((row) => ({
        ...row,
        id: row?._id,
      })) || [],
    [props?.data],
  );

  return (
    <CloudFoldersDataGridContainer>
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
          onCellDoubleClick: (params) =>
            props.handleEvent("folder double click", params.row),
          columns,
          hideFooter: true,
          getRowId: (row) => row._id,
        }}
        data={rows}
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
    </CloudFoldersDataGridContainer>
  );
}

export default CloudFoldersDataGrid;
