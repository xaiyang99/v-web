import React, { Fragment, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import * as Icon from "../../../icons/icons";

//function
import { styled } from "@mui/material/styles";
import moment from "moment";
import { ConvertBytetoMBandGB, GetFileType } from "../../../functions";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
import Action2 from "../actionTable/Action2";
import FileDataGrid from "./file/FileDataGrid";
import { trashMenuItems } from "./menu/MenuItems";
import { Box } from "@mui/material";

const DeletedFoldersAndFilesDataGridContainer = styled("div")(() => ({
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

function DeletedFoldersAndFilesDataGrid(props) {
  const [hover, setHover] = useState("");
  const [anchorEvent, setAnchorEvent] = React.useState(null);
  const [menuDropdownAnchor, setMenuDropdownAnchor] = React.useState(null);

  const handlePopperOpen = (event) => {
    const id = event.currentTarget.dataset.id;
    const row = props.data.find((r) => r.id === id);
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
      field: "name",
      headerName: "Name",
      editable: false,
      flex: 1,
      minWidth: "300px",
      renderCell: (params) => {
        const { name, checkTypeItem, totalItems } = params.row;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: "12px",
            }}
          >
            <FileIconContainer>
              {checkTypeItem === "folder" ? (
                <>
                  {totalItems > 0 ? (
                    <Icon.FolderFillIcon />
                  ) : (
                    <Icon.FolderEmptyIcon />
                  )}
                </>
              ) : (
                <FileIcon
                  extension={GetFileType(name)}
                  {...{ ...defaultStyles[GetFileType(name)] }}
                />
              )}
            </FileIconContainer>
            <div className="file_name">{name}</div>
          </div>
        );
      },
    },
    {
      field: "size",
      headerName: "Size",
      renderCell: (params) => {
        return (
          <Fragment>
            <Box>
              {params?.row?.size ? ConvertBytetoMBandGB(params.row.size) : "--"}
            </Box>
          </Fragment>
        );
      },
      editable: false,
      flex: 1,
      minWidth: 80,
    },
    {
      field: "updatedAt",
      headerName: "Date",
      editable: false,
      renderCell: (params) =>
        moment(params.row.updatedAt).format(DATE_PATTERN_FORMAT.datetime),
      flex: 1,
      minWidth: 180,
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
            menuItems={trashMenuItems}
            shortMenuItems={trashMenuItems}
            anchor={[menuDropdownAnchor, setMenuDropdownAnchor]}
          />
        );
      },
    },
  ];

  return (
    <DeletedFoldersAndFilesDataGridContainer>
      <FileDataGrid
        dataGrid={{
          sx: {
            "& .MuiDataGrid-columnSeparator": { display: "none" },
            borderRadius: 0,
            "& .MuiDataGrid-columnSeparator": { display: "none" },
            "& .MuiDataGrid-virtualScroller": {
              overflowX: "scroll",
            },
          },
          checked: true,
          hideFooter: true,
          disableColumnFilter: true,
          disableColumnMenu: true,
          componentsProps: {
            row: {
              onMouseEnter: handlePopperOpen,
              onMouseLeave: handlePopperClose,
            },
          },
          columns,
        }}
        data={props.data}
      />
    </DeletedFoldersAndFilesDataGridContainer>
  );
}

export default DeletedFoldersAndFilesDataGrid;
