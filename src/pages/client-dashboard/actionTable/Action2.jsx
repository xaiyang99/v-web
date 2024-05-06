import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { Box, IconButton, useMediaQuery } from "@mui/material";
import React from "react";
import { BsPinAngleFill } from "react-icons/bs";
import { MdFavorite } from "react-icons/md";
import { FaLockOpen } from "react-icons/fa";
import MenuDropdownContainer from "../components/menu/MenuDropdownContainer";
import MenuDropdownItem from "../components/menu/MenuDropdownItem";

export default function Action2(props) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { params, eventActions } = props;

  return (
    <div style={{ position: "relative" }}>
      {eventActions.hover &&
      (eventActions.hover?.id || eventActions.hover?._id) === params?.id &&
      !isMobile ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {props?.shortMenuItems?.map((menuItem, index) => {
              let result;
              switch (true) {
                case menuItem.title === "Favourite":
                  if (params?.row?.favorite) {
                    result = <MdFavorite fill="#17766B" />;
                  } else {
                    result = menuItem.icon;
                  }
                  break;

                case menuItem.title === "Password":
                  if (
                    params?.row?.filePassword ||
                    params?.row?.access_password ||
                    params?.row?.password ||
                    params?.row?.access_passwordFolder
                  ) {
                    result = <FaLockOpen fill="#17766B" />;
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
                    params?.row?.file_id?.[0]?._id ||
                    params.row.parentkey?.[0]?._id ||
                    props?.isContainFile ||
                    params?.row?.isContainsFiles
                      ? false
                      : menuItem.disabled
                  }
                  key={index}
                  onClick={() =>
                    eventActions.handleEvent(
                      menuItem.action,
                      params?.row || params,
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
            {props.menuItems.map((menuItem, index) => {
              return (
                <MenuDropdownItem
                  disabled={
                    params?.row?.file_id?.[0]?._id ||
                    params.row.parentkey?.[0]?._id ||
                    props?.isContainFile ||
                    params?.row?.isContainsFiles
                      ? false
                      : menuItem.disabled
                  }
                  isPassword={
                    params?.row?.filePassword ||
                    params?.row?.access_password ||
                    params?.row?.password ||
                    params?.row?.access_passwordFolder
                      ? true
                      : false
                  }
                  isFavorite={params?.row?.favorite ? true : false}
                  isPinned={
                    params?.row?.pin || params?.folderId?.pin ? true : false
                  }
                  onClick={() => {
                    eventActions.handleEvent(menuItem.action, params?.row);
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
          {props.menuItems.map((menuItem, index) => {
            return (
              <MenuDropdownItem
                disabled={
                  params?.row?.file_id?.[0]?._id ||
                  params.row.parentkey?.[0]?._id ||
                  props.isContainFile ||
                  params?.row?.isContainsFiles
                    ? false
                    : menuItem.disabled
                }
                key={index}
                title={menuItem.title}
                isPassword={
                  params?.row?.filePassword ||
                  params?.row?.access_password ||
                  params?.row?.password ||
                  params?.row?.access_passwordFolder
                    ? true
                    : false
                }
                icon={menuItem.icon}
                onClick={() => {
                  eventActions.handleEvent(menuItem.action, params?.row);
                }}
              />
            );
          })}
        </MenuDropdownContainer>
      )}
    </div>
  );
}
