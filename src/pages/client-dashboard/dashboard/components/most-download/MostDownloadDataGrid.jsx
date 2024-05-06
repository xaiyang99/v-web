import { Box, Checkbox, Tooltip, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { ConvertBytetoMBandGB, GetFileType } from "../../../../../functions";
import * as Icon from "../../icons";

const MostDownloadDataGridContainer = styled("div")({
  height: "100%",
  ".MuiDataGrid-root": {
    borderRadius: 0,
  },
  ".MuiDataGrid-columnHeaders": {
    fontSize: "1rem",
  },
});

const FileIconContainer = styled("div")(() => ({
  width: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
}));

const MostDownloadDataGrid = (props) => {
  let isDataFound = React.useRef(null);
  const isMobile = useMediaQuery("(max-width:768px)");

  React.useEffect(() => {
    isDataFound.current = null;
    const timer = setTimeout(() => {
      if (props.data?.length > 0) {
        isDataFound.current = true;
      } else {
        isDataFound.current = false;
      }
    }, 10);
    return () => {
      clearTimeout(timer);
    };
  }, [props.data]);

  const columns = [
    {
      field: "filename",
      headerName: "File Name",
      editable: false,
      renderCell: (params) => {
        const { filename } = params.row;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: "12px",
            }}
          >
            <FileIconContainer>
              <FileIcon
                extension={GetFileType(filename)}
                {...{ ...defaultStyles[GetFileType(filename)] }}
              />
            </FileIconContainer>
            <Tooltip title={filename}>
              <div className="file_name">{filename}</div>
            </Tooltip>
          </div>
        );
      },
      flex: 1,
    },
    {
      field: "size",
      maxWith: 150,
      headerName: "Size",
      renderCell: (params) => ConvertBytetoMBandGB(params.row.size),
      editable: false,
      flex: 1,
    },
    {
      field: "totalDownloadFaild",
      hide: isMobile ? true : false,
      headerName: "Failed Download",
      renderCell: (params) => params.row.totalDownloadFaild || 0,
      editable: false,
      flex: 1,
    },
    {
      field: "totalDownload",
      headerName: "Success Download",
      renderCell: (params) => params.row.totalDownload || 0,
      editable: false,
      flex: 1,
    },
  ];

  return (
    <MostDownloadDataGridContainer>
      <DataGrid
        sx={{
          ...(isMobile && {
            fontSize: "0.7rem",
          }),
          height: "100% !important",
          ".MuiDataGrid-iconButtonContainer": {
            visibility: "visible",
          },
          ".MuiDataGrid-sortIcon": {
            opacity: "inherit !important",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          ".MuiDataGrid-columnHeader": {
            ...(isMobile && {
              fontSize: "0.7rem",
            }),
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            KhtmlUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            userSelect: "none",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
            display: "none",
          },
        }}
        autoHeight
        columns={columns}
        rows={props.data || []}
        hideFooter
        disableSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        getRowId={(row) => row._id}
        components={{
          BaseCheckbox: React.forwardRef((props, ref) => {
            return (
              <Checkbox
                {...props}
                sx={{
                  color: "#A5A3AE",
                }}
              />
            );
          }),
          ColumnSortedAscendingIcon: () => {
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "1.25rem",
                  color: "#A5A3AE",
                }}
              >
                <Icon.MdOutlineKeyboardArrowUpIcon />
                <Icon.MdOutlineKeyboardArrowDownIcon
                  style={{
                    color: "black",
                    marginTop: "-10px",
                  }}
                />
              </Box>
            );
          },
          ColumnSortedDescendingIcon: () => {
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "1.25rem",
                  color: "#A5A3AE",
                }}
              >
                <Icon.MdOutlineKeyboardArrowUpIcon
                  style={{
                    color: "black",
                  }}
                />
                <Icon.MdOutlineKeyboardArrowDownIcon
                  style={{
                    marginTop: "-10px",
                  }}
                />
              </Box>
            );
          },
          ColumnUnsortedIcon: () => {
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "1.25rem",
                  color: "#A5A3AE",
                }}
              >
                <Icon.MdOutlineKeyboardArrowUpIcon />
                <Icon.MdOutlineKeyboardArrowDownIcon
                  style={{
                    marginTop: "-10px",
                  }}
                />
              </Box>
            );
          },
        }}
      />
    </MostDownloadDataGridContainer>
  );
};

export default MostDownloadDataGrid;
