import { Box, IconButton, useMediaQuery } from "@mui/material";
import { BsPinAngleFill } from "react-icons/bs";
import { MdFavorite } from "react-icons/md";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MenuDropdownContainer from "../components/menu/MenuDropdownContainer";
import MenuDropdownItem from "../components/menu/MenuDropdownItem";
import React from "react";

export default function ActionFileShare(props) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { params, eventActions } = props;

  return (
    <div style={{ position: "relative" }}>
      {eventActions.hover &&
      eventActions.hover?.id === params?.id &&
      !isMobile ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{ padding: "0 20px", display: "flex", alignItems: "center" }}
          >
            {props?.shortMenuItems?.map((menuItem, index) => {
              let result;
              switch (true) {
                case menuItem.title === "Favourite":
                  if (params?.row?.favorite || params.row.fileId?.favorite) {
                    result = <MdFavorite fill="#17766B" />;
                  } else {
                    result = menuItem.icon;
                  }
                  break;
                case menuItem.title === "Pin":
                  if (params?.row?.pin || params?.folderId?.pin) {
                    result = <BsPinAngleFill fill="#3C384A" />;
                  } else {
                    result = menuItem.icon;
                  }
                  break;

                default:
                  result = menuItem.icon;
              }
              return (
                <IconButton
                  disabled={
                    params?.row?.permission === "edit" ||
                    props.user?.permission === "edit"
                      ? false
                      : menuItem.disabled
                  }
                  key={index}
                  onClick={() =>
                    eventActions.handleEvent(
                      menuItem.action,
                      params?.row || params
                    )
                  }
                >
                  {React.cloneElement(result, {
                    size: "18px",
                  })}
                </IconButton>
              );
            })}
          </Box>
          <MenuDropdownContainer
            customButton={{
              element: (
                <IconButton>
                  <MoreVertRoundedIcon />
                </IconButton>
              ),
            }}
          >
            {props.menuItems?.map((menuItem, index) => {
              return (
                <MenuDropdownItem
                  disabled={
                    params?.row?.permission === "edit" ||
                    props.user?.permission === "edit"
                      ? false
                      : menuItem.disabled
                  }
                  isFavorite={params?.row?.favorite ? true : false}
                  isPinned={
                    params?.row?.pin || params?.folderId?.pin ? true : false
                  }
                  onClick={() => {
                    eventActions.handleEvent(
                      menuItem.action,
                      params?.row || params
                    );
                  }}
                  key={index}
                  title={menuItem.title}
                  icon={menuItem.icon}
                />
              );
            })}
          </MenuDropdownContainer>
        </Box>
      ) : (
        <MenuDropdownContainer
          anchor={props.anchor}
          customButton={{
            element: (
              <IconButton>
                <MoreVertRoundedIcon />
              </IconButton>
            ),
          }}
        >
          {props.menuItems?.map((menuItem, index) => {
            return (
              <MenuDropdownItem
                key={index}
                disabled={
                  params?.row?.permission === "edit" ||
                  props.user?.permission === "edit"
                    ? false
                    : menuItem.disabled
                }
                title={menuItem.title}
                icon={menuItem.icon}
                onClick={() => {
                  eventActions.handleEvent(
                    menuItem.action,
                    params?.row || params
                  );
                }}
              />
            );
          })}
        </MenuDropdownContainer>
      )}
    </div>
  );
}
