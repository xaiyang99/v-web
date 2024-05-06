import React, { Fragment, useState } from "react";
import "./../components/css/pagination.css";

// material ui icon and component
import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as Icon from "../../../icons/icons";

//function
import { Base64 } from "js-base64";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { DATE_PATTERN_FORMAT } from "../../../utils/date";
import Action2 from "../actionTable/Action2";
import ActionShare from "../actionTable/ActionShare";
import FileDataGrid from "./file/FileDataGrid";
import { favouriteMenuItems, shortFavouriteMenuItems } from "./menu/MenuItems";
import { ConvertBytetoMBandGB } from "../../../functions";

const ExtendFoldersDataGridContainer = styled("div")(() => ({
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

function ExtendFoldersDataGrid(props) {
  const [hover, setHover] = useState("");
  const [anchorEvent, setAnchorEvent] = React.useState(null);
  const [menuDropdownAnchor, setMenuDropdownAnchor] = React.useState(null);
  // const [isLoaded, setIsloaded] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:600px) and (max-width:1024px)");
  const navigate = useNavigate();

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

  const handleOnPreviw = (data) => {
    if (isTablet || isMobile) {
      if (props.user.permission) {
        const base64URL = Base64.encodeURI(
          props.user._id +
            "/" +
            props.user.newName +
            "/" +
            props.user.permission +
            "/" +
            data.row?.url,
        );
        navigate(`/folder/${base64URL}`);
      } else {
        const base64URL = Base64.encodeURI(data?.row?.url);
        navigate(`/folder/${base64URL}`);
      }
    }
  };

  const columns = [
    {
      field: "folder_name",
      headerName: "Name",
      editable: false,
      renderCell: (params) => {
        const { name, isContainsFiles } = params.row || {};
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: "12px",
            }}
          >
            <FileIconContainer onClick={() => handleOnPreviw(params)}>
              {isContainsFiles ? (
                <Icon.FolderFillIcon />
              ) : (
                <Icon.FolderEmptyIcon />
              )}
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
        return <Fragment>{ConvertBytetoMBandGB(params.row.size)}</Fragment>;
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
        const { isContainsFiles } = params.row || {};

        return (
          <>
            {props.isFromSharingUrl ? (
              <ActionShare
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
                isContainsFiles={isContainsFiles}
              />
            ) : (
              <Action2
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
              />
            )}
          </>
        );
      },
    },
  ];

  return (
    <ExtendFoldersDataGridContainer>
      <FileDataGrid
        dataGrid={{
          sx: {
            "& .MuiDataGrid-columnSeparator": { display: "none" },
          },
          onRowDoubleClick: (params) => {
            const { url } = params.row || {};
            if (props.user.permission) {
              const base64URL = Base64.encodeURI(
                props.user._id +
                  "/" +
                  props.user.newName +
                  "/" +
                  props.user.permission +
                  "/" +
                  url,
              );
              navigate(`/folder/${base64URL}`);
            } else {
              const base64URL = Base64.encodeURI(url);
              navigate(`/folder/${base64URL}`);
            }
          },
          //     }),
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "90%",
          mt: 3,
        }}
      ></Box>
    </ExtendFoldersDataGridContainer>
  );
}

export default ExtendFoldersDataGrid;
