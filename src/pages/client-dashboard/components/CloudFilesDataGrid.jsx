import React, { Fragment, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import ResponsivePagination from "react-responsive-pagination";
import "./../components/css/pagination.css";

// material ui icon and component
import { Box } from "@mui/material";

// component

// graphql

//function
import { styled } from "@mui/material/styles";
import {
  ConvertBytetoMBandGB,
  CutfileName,
  DateFormat,
  GetFileType,
} from "../../../functions";
import Action from "../actionTable/Action";
import FileDataGrid from "./file/FileDataGrid";

const CloudFilesDataGridContainer = styled("div")(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

function CloudFilesDataGrid(props) {
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
      field: "filename",
      headerName: "Name",
      editable: false,
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", alignItems: "center", columnGap: "12px" }}
          >
            <Box
              sx={{ width: "20px", textAlign: "center" }}
              mt={2}
              onClick={() => props.handleEvent("preview", params.row)}
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
      flex: 1,
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
          <Action
            params={params}
            eventActions={{
              hover,
              setHover,
              handleEvent: (action, data) => props.handleEvent(action, data),
            }}
            anchor={[menuDropdownAnchor, setMenuDropdownAnchor]}
          />
        );
      },
    },
  ];

  return (
    <CloudFilesDataGridContainer>
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
          getRowId: (row) => row._id,
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
            <Fragment>
              {isPage && (
                <ResponsivePagination
                  current={props.pagination.currentPage}
                  total={props.pagination.total}
                  onPageChange={props.pagination.setCurrentPage}
                />
              )}
            </Fragment>
          )}
        </Box>
      )}
    </CloudFilesDataGridContainer>
  );
}

export default CloudFilesDataGrid;
