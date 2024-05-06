import React, { useRef, useState } from "react";

//mui component and style
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { styled as muiStyled } from "@mui/system";

//function
import { GetFileType } from "../../../../functions";

//icon
import { FileIcon, defaultStyles } from "react-file-icon";
import * as Icon from "../../../../icons/icons";

const Item = styled("div")(({ theme, ...props }) => ({
  display: "flex",
  alignItems: "center",
  justifyItems: "center",
  width: "100%",
  height: "100%",
}));

const Image = muiStyled("img")({
  width: "100%",
  height: "100%",
  textAlign: "center",
  objectFit: "cover",
});

const FileCardItemIconContainer = muiStyled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  maxHeight: "100%",
  borderRadius: "4px",
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
}));

const FileCardItemIcon = ({
  isContainFiles,
  cardProps,
  onOuterClick,
  styleSelectedCard,
  fileType,
  thumbnailImageUrl,
  imageUrl,
  ...props
}) => {
  const itemRef = useRef(null);
  const {
    isNormalCard,
    sx,
    onDoubleClick: onCardDoubleClick,
    ...cardDataProps
  } = cardProps || {};
  const [imageFound, setImageFound] = useState(true);
  const handleImageError = () => {
    setImageFound(false);
  };
  return (
    <Item ref={itemRef} className="card-item">
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
                height: "100%",
              }}
            >
              {isContainFiles ? (
                <Icon.FolderFillIcon
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : (
                <Icon.FolderEmptyIcon
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              )}
            </Box>
          )}
          {fileType !== "folder" && (
            <FileCardItemIconContainer
              sx={{
                svg: {
                  width: "100%",
                  height: "100%",
                },
              }}
            >
              <FileIcon
                extension={GetFileType(props.name)}
                {...{ ...defaultStyles[GetFileType(props.name)] }}
              />
            </FileCardItemIconContainer>
          )}
        </React.Fragment>
      )}
    </Item>
  );
};

export default FileCardItemIcon;
