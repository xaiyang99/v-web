//mui component and style
import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import { FileIcon, defaultStyles } from "react-file-icon";
import { FaTimes } from "react-icons/fa";
import { GetFileType, cutStringWithEllipsis } from "../functions";
import BreadcrumbV2 from "../pages/client-dashboard/components/BreadcrumbV2";
import FileCardItem from "../pages/client-dashboard/components/file/FileCardItem";
import DialogV1 from "./DialogV1";

const FileDetailsDialogHeader = muiStyled("div")({
  display: "flex",
  alignItems: "center",
});
const FileDetailsDialogBoby = muiStyled("div")({
  width: "100%",
  display: "flex",
  columnGap: "2rem",
});

const FileDetailsDialogLeft = muiStyled("div")({
  width: "100%",
  flexShrink: 0,
  flexGrow: 1,
  height: "164px",
  minHeight: "164px",
});

const FileDetailsDialogRight = muiStyled("div")({
  width: "100%",
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  rowGap: "0.7rem",
  flexShrink: 0,
});

const FileDetailsDialogRightHeader = muiStyled("div")({
  fontSize: "1rem",
  fontWeight: "600",
});

const FileDetailsDialogRightList = muiStyled("ul")({
  listStyleType: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  rowGap: "0.6rem",
});

const FileDetailsDialogRightListItem = muiStyled("li")({
  width: "100%",
  display: "flex",
  alignItems: "center",
  columnGap: "1.2rem",
  "> .content": {
    fontWeight: 500,
  },
  "> .content.path": {},
});

const FileIconContainer = muiStyled("div")(() => ({
  display: "flex",
  width: "25px",
  minWidth: "25px",
  alignItems: "center",
  marginRight: "10px",
}));

const FileDetailsDialog = (props) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <DialogV1
      {...props}
      onClose={() => props.onClose()}
      disableDefaultButton
      dialogContentProps={{
        sx: {
          paddingBottom: "35px",
        },
      }}
      titleContent={
        <FileDetailsDialogHeader>
          <FileIconContainer>
            <FileIcon
              extension={GetFileType(props?.name)}
              {...{ ...defaultStyles[GetFileType(props?.name)] }}
            />
          </FileIconContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            {props.name?.length > (isMobile ? 20 : 35) ? (
              <Tooltip title={props.name} placement="bottom">
                <Typography
                  variant="h6"
                  fontSize={isMobile ? "0.8rem" : "1rem"}
                  whiteSpace="nowrap"
                >
                  {cutStringWithEllipsis(props.name, 20)}
                </Typography>
              </Tooltip>
            ) : (
              <Typography
                variant="h6"
                fontSize={isMobile ? "0.8rem" : "1rem"}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {props.name}
              </Typography>
            )}
            <IconButton
              onClick={props.onClose}
              style={{
                color: "#817E8D",
              }}
            >
              <FaTimes />
            </IconButton>
          </Box>
        </FileDetailsDialogHeader>
      }
    >
      <FileDetailsDialogBoby>
        <Grid container spacing={10} rowSpacing={13}>
          <Grid item md={5} sm={12} xs={12}>
            <FileDetailsDialogLeft>
              <FileCardItem
                fileType={props.type}
                imageUrl={props.imageUrl}
                disableName
                disableOnHoverEffect
                name={props.name}
                cardProps={{
                  isNormalCard: true,
                  sx: {
                    "&:hover": {
                      ".file-card-image": {
                        transition: "200ms",
                        opacity: 0.9,
                      },
                    },
                  },
                }}
                favouriteIcon={{
                  isShow: props?.favouriteIcon?.isShow,
                  handleOnClick: props?.favouriteIcon?.handleFavouriteOnClick,
                  isFavourite: props?.favouriteIcon?.isFavourite,
                }}
                pinIcon={{
                  isShow: props?.pinIcon?.isShow,
                  handleOnClick: props?.pinIcon?.handlePinOnClick,
                  isPinned: props?.pinIcon?.isPinned,
                }}
                downloadIcon={{
                  isShow: props?.downloadIcon?.isShow,
                  handleOnClick: props?.downloadIcon?.handleDownloadOnClick,
                }}
              />
            </FileDetailsDialogLeft>
          </Grid>
          {/* right */}
          <Grid item md={7} sm={12} xs={12}>
            <FileDetailsDialogRight>
              <FileDetailsDialogRightHeader>
                File Details
              </FileDetailsDialogRightHeader>
              <FileDetailsDialogRightList>
                <FileDetailsDialogRightListItem>
                  <div className="title">Type</div>
                  {props.displayType.length > 35 ? (
                    <Tooltip title={props.displayType} placement="bottom">
                      <div className="content">
                        {cutStringWithEllipsis(props.displayType, 35)}
                      </div>
                    </Tooltip>
                  ) : (
                    <div className="content">{props.displayType}</div>
                  )}
                </FileDetailsDialogRightListItem>
                <FileDetailsDialogRightListItem>
                  <div className="title">Size</div>
                  <div className="content">{props.size}</div>
                </FileDetailsDialogRightListItem>
                <FileDetailsDialogRightListItem>
                  <div className="title">Path</div>
                  <div
                    className="content path"
                    style={{
                      overflow: "hidden",
                      flex: "1 1 100%",
                    }}
                  >
                    <BreadcrumbV2
                      title={props.title}
                      path={props.path}
                      mainIcon={props.iconTitle}
                      handleFolderNavigate={() => {
                        props.breadcrumb.handleFolderNavigate();
                        props.handleOnClose();
                      }}
                    />
                  </div>
                </FileDetailsDialogRightListItem>
                <FileDetailsDialogRightListItem>
                  <div className="title">Date added</div>
                  <div className="content">{props.dateAdded}</div>
                </FileDetailsDialogRightListItem>
                <FileDetailsDialogRightListItem>
                  <div className="title">Last modified</div>
                  <div className="content">{props.lastModified}</div>
                </FileDetailsDialogRightListItem>
                <FileDetailsDialogRightListItem>
                  <div className="title">Total download</div>
                  <div className="content">
                    {props.totalDownload
                      ? `${props.totalDownload} ${
                          props.totalDownload > 1 ? "times" : "time"
                        }`
                      : "0 time"}
                  </div>
                </FileDetailsDialogRightListItem>
              </FileDetailsDialogRightList>
            </FileDetailsDialogRight>
          </Grid>
        </Grid>
      </FileDetailsDialogBoby>
    </DialogV1>
  );
};

export default FileDetailsDialog;
