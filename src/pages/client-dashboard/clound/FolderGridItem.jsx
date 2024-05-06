import { Box, Grid, Paper, styled, useMediaQuery } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useRef, useState } from "react";
import { BsPinAngleFill } from "react-icons/bs";
import { cutStringWithEllipsis } from "../../../functions";
import useHover from "../../../hooks/useHover";
import useOuterClicked from "../../../hooks/useOutsideClicked";
import MenuDropdown from "../components/menu/MenuDropdownContainer";
import * as MUI from "../css/folderStyle";
import * as Icon from "./icons";
const Item = styled(Paper)(({ theme, ...props }) => ({
  ...theme.typography.body2,
  textAlign: "left",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "201.58px",
  minHeight: "201.58px",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px;",
  color: theme.palette.text.secondary,
  ":after": {
    transition: "100ms ease-in-out",
    position: "absolute",
    content: "''",
    display: "block",
    width: "100%",
    height: "100%",
    borderRadius: "inherit",
    backgroundColor: "#e2e8f0",
    opacity: props.isonhover === "true" ? 0.1 : 0,
  },
  ":hover": {
    ":after": {
      opacity: 0.1,
    },
    cursor: "pointer",
  },

  ...(props.ischecked ? { backgroundColor: "#A5D4CE" } : ""),
}));
const MenuButtonContainer = styled("div")({
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: 2,
  margin: "5px",
});
const Pin = styled("div")({
  position: "absolute",
  top: "5px",
  left: "8px",
  color: "#3C384A",
  fontSize: "18px",
  zIndex: 1,
});
const IconFolderContainer = styled("div")({
  minWidth: "150px",
  minHeight: "201.58px",
});

export default function FolderGridItem({ onOuterClick, cardProps, ...props }) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const itemRef = useRef(null);
  const isFolderItemHover = useHover(itemRef);
  const isCardOuterClicked = useOuterClicked(itemRef);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { onDoubleClick: onCardDoubleClick, ...cardDataProps } =
    cardProps || {};
  useEffect(() => {
    props.setIsOpenMenu(isFolderItemHover);
    setIsOpenMenu(isFolderItemHover);
  }, [isFolderItemHover]);

  useEffect(() => {
    props.setIsOpenMenu(isCardOuterClicked);
    onOuterClick?.();
  }, [isCardOuterClicked]);

  const handleDropdownOpen = (isOpen) => {
    setIsDropdownOpen(isOpen);
  };

  return (
    <Grid item md={4} lg={2} xs={6} sm={6}>
      <Item
        className="card-item"
        ref={itemRef}
        {...{
          ...cardDataProps,
          ...(!isDropdownOpen && {
            onDoubleClick: onCardDoubleClick,
          }),
          ischecked: cardDataProps?.ischecked?.toString(),
        }}
      >
        {props.isPinned && (
          <Pin>
            <BsPinAngleFill />
          </Pin>
        )}
        {props?.menuItem && isOpenMenu && (
          <MenuButtonContainer>
            <MenuDropdown
              customButton={props.customButton}
              onOpenChange={handleDropdownOpen}
            >
              {props.menuItem}
            </MenuDropdown>
          </MenuButtonContainer>
        )}

        <Box>
          <MUI.Folder>
            <IconFolderContainer>
              {props?.file_id || props?.folderId ? (
                <Icon.MyfolderFull />
              ) : (
                <Icon.MyfolerEmpty />
              )}
            </IconFolderContainer>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {props.folder_name.length > 10 ? (
                <Tooltip title={props.folder_name} placement="bottom">
                  <MUI.FolderTitle key={props.key}>
                    {cutStringWithEllipsis(
                      props?.folder_name,
                      isMobile ? 8 : 15,
                    )}
                  </MUI.FolderTitle>
                </Tooltip>
              ) : (
                <MUI.FolderTitle key={props.key}>
                  {cutStringWithEllipsis(props?.folder_name, isMobile ? 8 : 10)}
                </MUI.FolderTitle>
              )}
            </Box>
          </MUI.Folder>
        </Box>
      </Item>
    </Grid>
  );
}
