import React, { useEffect, useRef, useState } from "react";

//mui component and style
import { Box, IconButton, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { styled as muiStyled } from "@mui/system";

//function
import { GetFileType, cutStringWithEllipsis } from "../../../../functions";

//icon
import { FileIcon, defaultStyles } from "react-file-icon";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import { FiDownload } from "react-icons/fi";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import NormalButton from "../../../../components/NormalButton";
import useHover from "../../../../hooks/useHover";
import useOuterClicked from "../../../../hooks/useOutsideClicked";
import * as Icon from "../../../../icons/icons";
import MenuDropdownContainer from "../menu/MenuDropdownContainer";

const Item = styled(Paper)(({ theme, ...props }) => ({
  boxShadow: "rgb(0 0 0 / 9%) 0px 2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "white",
  ...theme.typography.body2,
  textAlign: "left",
  color: theme.palette.text.secondary,
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "201.58px",
  minHeight: "201.58px",

  ...(props.isclicked === true && {
    ...(props.isstyledselectedcard
      ? {
          ...props.isstyledselectedcard,
        }
      : {
          boxShadow: "0px 0px 0px 3px rgba(22,118,107,0.75) inset",
        }),
  }),
  ...(!props.isdisableonhovereffect && {
    ":after": {
      transition: "100ms ease-in-out",
      position: "absolute",
      content: "''",
      display: "block",
      width: "100%",
      height: "100%",
      borderRadius: "inherit",
      backgroundColor: "black",
      opacity: props.isonhover === "true" ? 0.1 : 0,
    },
  }),
}));

const Image = muiStyled("img")({
  width: "100%",
  height: "100%",
  textAlign: "center",
  objectFit: "cover",
});

const FileIconContainer = muiStyled("div")(({ theme }) => ({
  width: "50px",
  height: "60px",
  borderRadius: "4px",
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
}));

const ItemTitle = muiStyled("div")(({ ...props }) => ({
  ...(props.folder === "true"
    ? {
        backgroundColor: "#F3F3F3",
      }
    : {
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;",
        backgroundColor: "white",
      }),
  position: "absolute",
  bottom: 0,
  left: "50%",
  transform: "translate(-50%,-50%)",
  padding: "8px 20px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  maxWidth: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  zIndex: 1,
}));

const Pin = muiStyled("div")({
  position: "absolute",
  top: "5px",
  left: "8px",
  color: "#3C384A",
  fontSize: "18px",
  zIndex: 1,
});

const GridItem = styled("div")(() => ({
  display: "flex",
  width: "100%",
  height: "100%",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  backgroundColor: "unset",
  borderRadius: "4px",
  transition: "200ms ease-in-out",
}));

const GridItemWrapper = styled("div")(() => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const TopRightIcon = muiStyled("div")({
  position: "absolute",
  top: "2px",
  right: "2px",
  color: "#3C384A",
  fontSize: "18px",
  zIndex: 1,
  svg: {
    color: "#817E8D",
    width: "20px",
    height: "20px",
  },
});

const Download = muiStyled("div")({
  position: "absolute",
  bottom: "2px",
  right: "2px",
  color: "#3C384A",
  fontSize: "18px",
  zIndex: 1,
  svg: {
    color: "#817E8D",
    width: "20px",
    height: "20px",
  },
});

const MenuButtonContainer = muiStyled("div")({
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: 2,
  margin: "5px",
});

const FileCardItem = ({
  isContainFiles,
  cardProps,
  onOuterClick,
  styleSelectedCard,
  fileType,
  thumbnailImageUrl,
  imageUrl,
  ...props
}) => {
  const [imageFound, setImageFound] = useState(true);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const itemRef = useRef(null);
  const isFileCardItemHover = useHover(itemRef);
  const isFileCardOuterClicked = useOuterClicked(itemRef);
  const {
    isNormalCard,
    sx,
    onDoubleClick: onCardDoubleClick,
    ...cardDataProps
  } = cardProps || {};
  useEffect(() => {
    setIsOpenMenu(isFileCardItemHover);
  }, [isFileCardItemHover]);

  useEffect(() => {
    onOuterClick?.();
  }, [isFileCardOuterClicked]);

  const handleDropdownOpen = (isOpen) => {
    setIsDropdownOpen(isOpen);
  };

  const handleImageError = () => {
    setImageFound(false);
  };

  return (
    <Grid
      item
      xs={6}
      sm={6}
      md={4}
      lg={2}
      sx={{
        width: "100%",
        height: "100%",
        display: "initial",
      }}
    >
      <Item
        ref={itemRef}
        className="card-item"
        {...{
          ...(styleSelectedCard && {
            isstyledselectedcard: styleSelectedCard,
          }),
          ...(props.disableOnHoverEffect && {
            isdisableonhovereffect: "true",
          }),
          ...cardDataProps,
          ...(!isDropdownOpen && {
            onDoubleClick: onCardDoubleClick,
          }),
          ischecked: cardDataProps?.ischecked?.toString(),
          sx: {
            ...(!isNormalCard && {
              ":hover": {
                ":after": {
                  opacity: 0.1,
                },
              },
              cursor: "pointer",
            }),
            ...sx,
          },
        }}
      >
        {props?.menuItems && isOpenMenu && (
          <MenuButtonContainer>
            <MenuDropdownContainer
              customButton={props.customButton}
              onOpenChange={handleDropdownOpen}
            >
              {props.menuItems}
            </MenuDropdownContainer>
          </MenuButtonContainer>
        )}
        <GridItem className="file-card-item">
          <GridItemWrapper>
            {fileType === "image" ? (
              <React.Fragment>
                {imageFound && thumbnailImageUrl ? (
                  <Image
                    onError={handleImageError}
                    src={thumbnailImageUrl}
                    alt={props.name}
                    className="file-card-image"
                  />
                ) : (
                  <Image
                    src={imageUrl}
                    alt={props.name}
                    className="file-card-image"
                  />
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {fileType === "folder" && (
                  <Box
                    sx={{
                      display: "flex",
                      marginBottom: "30px",
                    }}
                  >
                    {isContainFiles ? (
                      <Icon.FolderFillIcon
                        style={{
                          width: "150px",
                        }}
                      />
                    ) : (
                      <Icon.FolderEmptyIcon
                        style={{
                          width: "150px",
                        }}
                      />
                    )}
                  </Box>
                )}
                {fileType !== "folder" && (
                  <FileIconContainer>
                    <FileIcon
                      extension={GetFileType(props.name)}
                      {...{ ...defaultStyles[GetFileType(props.name)] }}
                    />
                  </FileIconContainer>
                )}
              </React.Fragment>
            )}
            {!props.disableName && (
              <React.Fragment>
                {props.name?.length > 15 ? (
                  <Tooltip title={props.name} placement="bottom">
                    <ItemTitle
                      {...{
                        ...(fileType === "folder" && {
                          folder: "true",
                        }),
                      }}
                    >
                      {cutStringWithEllipsis(props.name, 15)}
                    </ItemTitle>
                  </Tooltip>
                ) : (
                  <ItemTitle
                    {...{
                      ...(fileType === "folder" && {
                        folder: "true",
                      }),
                    }}
                  >
                    {cutStringWithEllipsis(props.name, 15)}
                  </ItemTitle>
                )}
              </React.Fragment>
            )}

            {props.isPinned && (
              <Pin>
                <BsPinAngleFill />
              </Pin>
            )}

            {props.favouriteIcon?.isShow && (
              <TopRightIcon>
                <NormalButton
                  onClick={props.favouriteIcon.handleOnClick}
                  style={{
                    margin: "5px",
                  }}
                >
                  {props.favouriteIcon.isFavourite ? (
                    <MdFavorite fill="#17766B" />
                  ) : (
                    <MdOutlineFavoriteBorder color="black" />
                  )}
                </NormalButton>
              </TopRightIcon>
            )}

            {props.pinIcon?.isShow && (
              <TopRightIcon>
                <NormalButton
                  onClick={props.pinIcon.handleOnClick}
                  style={{
                    margin: "5px",
                  }}
                >
                  {props.pinIcon.isPinned ? (
                    <BsPinAngleFill fill="#3C384A" />
                  ) : (
                    <BsPinAngle />
                  )}
                </NormalButton>
              </TopRightIcon>
            )}

            {props.downloadIcon?.isShow && (
              <Download>
                <IconButton
                  onClick={props.downloadIcon.handleOnClick}
                  sx={{
                    padding: "5px",
                  }}
                >
                  <FiDownload color="black" />
                </IconButton>
              </Download>
            )}
          </GridItemWrapper>
        </GridItem>
      </Item>
    </Grid>
  );
};

export default FileCardItem;
