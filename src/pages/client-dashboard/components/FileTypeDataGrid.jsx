import React, { useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import "./../components/css/pagination.css";

// material ui icon and component
import { Box } from "@mui/material";
import ResponsivePagination from "react-responsive-pagination";

import { styled } from "@mui/material/styles";
import moment from "moment";
import {
  ConvertBytetoMBandGB,
  GetFileType,
  CutfileName,
} from "../../../functions";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
import Action from "../actionTable/Action";
import FileDataGrid from "./file/FileDataGrid";

const FileTypeDataGridContainer = styled("div")(() => ({
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

function FileTypeDataGrid(props) {
  const { pagination, total } = props;
  const [hover, setHover] = useState("");
  const [anchorEvent, setAnchorEvent] = React.useState(null);
  const [menuDropdownAnchor, setMenuDropdownAnchor] = React.useState(null);

  const handlePopperOpen = (event) => {
    const id = event.currentTarget.dataset.id;
    const row = props.data?.find((r) => r.id === id);
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

  const columns = [
    {
      field: "filename",
      headerName: "Name",
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
            <div className="file_name">
              {CutfileName(filename, params?.row?.newFilename)}
            </div>
          </div>
        );
      },
      flex: 1,
    },
    {
      field: "size",
      headerName: "Size",
      renderCell: (params) => ConvertBytetoMBandGB(params.row.size),
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
      headerName: "Actions",
      flex: 1,
      headerAlign: "center",
      align: "center",
      editable: false,
      sortable: false,
      renderCell: (params) => {
        return (
          <Action
            params={params}
            eventActions={{
              hover,
              setHover,
              handleEvent: (action, data) => {
                props.handleEvent(action, data);
              },
            }}
            anchor={[menuDropdownAnchor, setMenuDropdownAnchor]}
          />
        );
      },
    },
  ];

  return (
    <FileTypeDataGridContainer>
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
      {total > props.data?.length && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
            mt: 3,
          }}
        >
          <ResponsivePagination
            total={pagination?.total}
            current={pagination?.currentPage}
            onPageChange={pagination?.setCurrentPage}
          />
        </Box>
      )}
    </FileTypeDataGridContainer>
  );
}

export default FileTypeDataGrid;
