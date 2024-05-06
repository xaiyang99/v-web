import { useMutation } from "@apollo/client";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import {
  Button,
  InputAdornment,
  TextField,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { createTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { MuiChipsInput } from "mui-chips-input";
import * as React from "react";
import { useMemo } from "react";
import { Base64Encode } from "../../../base64-file";
import { errorMessage, successMessage } from "../../../components/Alerts";
import Loader from "../../../components/Loader";
import { EventUploadTriggerContext } from "../../../contexts/EventUploadTriggerContext";
import { cutStringWithEllipsis, handleGraphqlErrors } from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import useGetUrl from "../../../hooks/useGetUrl";
import ActionShareStatus from "../actionTable/ActionShareStatus";
import ShareAction from "../actionTable/ShareAction";
import {
  CREATE_SHARE,
  CREATE_SHARE_FROM_SHARING,
} from "../share-with-me/apollo";
import "./../css/chipinput.css";
import { useMenuDropdownState } from "./menu/MenuDropdownProvider";

const theme = createTheme();
const TextFieldShare = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  margin: "0px 0px 40px 0px",
});
const ButtonGet = styled("div")({
  padding: "0 0 0 10px",
});
const ActionContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  margin: "50px 0px 30px 0px",
});
const TextInputdShare = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  margin: "10px 0px",
  [theme.breakpoints.down("sm")]: {
    display: "column",
    flexDirection: "column",
  },
}));

const CreateShare = (props) => {
  const { open, data, onClose, share: propShare } = props;

  const share = useMemo(() => {
    return propShare || {};
  }, [propShare]);

  const { user } = useAuth();
  const [createShare] = useMutation(CREATE_SHARE);
  const [createShareFromSharing] = useMutation(CREATE_SHARE_FROM_SHARING);
  const [statusShare, setStatusShare] = React.useState("view");
  const [isGlobals, setIsGlobals] = React.useState("public");
  const [coppied, setCoppied] = React.useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");
  const isSmallMobile = useMediaQuery("(max-width:350px)");
  const [getURL, setGetURL] = React.useState("");
  const { setIsAutoClose } = useMenuDropdownState();
  const [chipData, setChipData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const eventUploadTrigger = React.useContext(EventUploadTriggerContext);
  const encodeKey = process.env.REACT_APP_ENCODE_KEY;
  const totalHandleUrl = useGetUrl(props?.data);

  const handleChange = (newChip) => {
    setChipData(newChip);
  };
  const isValidEmail = (data) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(data);
  };

  React.useEffect(() => {
    isValidEmail(data);
  }, [chipData]);

  React.useEffect(() => {
    let createdById = "";
    let fileId = "";

    let dataType = data?.folder_type || data?.folderId?._id ? "folder" : "file";
    let ownerData = data?.createdBy?._id ?? data?.ownerId?._id;
    let newNameData = data?.createdBy?.newName ?? data?.ownerId?.newName;

    // fileId = Base64?.encode(data?._id, true);
    fileId = Base64Encode(
      {
        _id: data?._id,
        type: dataType,
      },
      encodeKey,
    );

    createdById = Base64Encode(ownerData, encodeKey);

    const baseURL = `${fileId}-${createdById}-${newNameData}`;

    const params = new URLSearchParams();
    params.set("lc", baseURL);

    let getVshareUrl;
    if (isGlobals === "private") {
      getVshareUrl = new URL(process.env.REACT_APP_VSHARE_URL_PRIVATE);
    } else {
      getVshareUrl = new URL(process.env.REACT_APP_DOWNLOAD_URL_SERVER);
    }
    getVshareUrl.search = params.toString();
    setGetURL(getVshareUrl);
  }, [data, user, isGlobals]);

  const handleShareStatus = async () => {
    try {
      if (chipData.length > 0) {
        if (
          (data?.folder_type === "folder" ||
            data?.checkTypeItem === "folder") &&
          !undefined
        ) {
          let shareCount = 0;
          for (let i = 0; i < chipData.length; i++) {
            if (share.isFromShare) {
              shareCount += 1;
              await createShareFromSharing({
                variables: {
                  body: {
                    accessKey: "",
                    folderId: data?._id,
                    isPublic: isGlobals,
                    permission: statusShare,
                    toAccount: chipData[i],
                    link: process.env.REACT_APP_VSHARE_URL_PRIVATE,
                    shareId: share._id,
                  },
                },
              });
            } else {
              shareCount += 1;
              await createShare({
                variables: {
                  body: {
                    folderId: data?._id,
                    ownerId: data?.createdBy?._id || props.ownerId?._id,
                    fromAccount: user?.email,
                    isPublic: isGlobals,
                    permission: statusShare,
                    toAccount: chipData[i],
                    link: process.env.REACT_APP_VSHARE_URL_PRIVATE,
                    status: "active",
                    isShare: "yes",
                  },
                },
              });
            }
          }
          if (shareCount === chipData.length) {
            successMessage("Share successful", 3000);
            onClose();
          }
        } else {
          let shareCount = 0;
          for (let i = 0; i < chipData.length; i++) {
            if (share.isFromShare) {
              shareCount += 1;
              await createShareFromSharing({
                variables: {
                  body: {
                    fileId: data?._id,
                    accessKey: "",
                    isPublic: isGlobals,
                    permission: statusShare,
                    toAccount: chipData[i],
                    link: process.env.REACT_APP_VSHARE_URL_PRIVATE,
                    shareId: share._id,
                  },
                },
              });
            } else {
              shareCount += 1;
              await createShare({
                variables: {
                  body: {
                    fileId: data?._id,
                    accessKey: "",
                    ownerId: data?.createdBy?._id || props.ownerId?._id,
                    fromAccount: user?.email,
                    isPublic: isGlobals,
                    permission: statusShare,
                    toAccount: chipData[i],
                    link: process.env.REACT_APP_VSHARE_URL_PRIVATE,
                    status: "active",
                    isShare: "yes",
                  },
                },
              });
            }
          }
          if (shareCount === chipData.length) {
            setIsAutoClose(true);
            onClose();
            eventUploadTrigger.trigger();
            successMessage("Share file successful", 3000);
          }
        }
      } else {
        onClose();
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  // get link
  const handleGetFolderLink = async () => {
    copyTextToClipboard(getURL)
      .then(() => {
        totalHandleUrl(props?.data);
        setLoading(true);
        setCoppied(true);
      })
      .catch((err) => {
        errorMessage(err, 2000);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 400);
      });
  };

  // status share
  const handleStatus = async (data) => {
    setStatusShare(data);
    setIsAutoClose(true);
  };

  const handleIsGlobal = async (data) => {
    setIsGlobals(data);
    setIsAutoClose(true);
  };

  return (
    <Dialog open={open} onClose={onClose} keepMounted fullWidth={true}>
      <Box
        sx={{
          [theme.breakpoints.up("sm")]: {
            minWidth: "450px",
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {data?.folder_type === "folder" ||
            data?.checkTypeItem === "folder" ? (
              <Typography variant="h6" fontSize={isMobile ? "0.8rem" : "1rem"}>
                Share {data?.folder_name || data?.name}
              </Typography>
            ) : (
              <Typography variant="h6" fontSize={isMobile ? "0.8rem" : "1rem"}>
                Share "
                {cutStringWithEllipsis(
                  data?.filename || data?.name,
                  isMobile ? 20 : 50,
                )}
                "
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
            }}
          >
            <ActionShareStatus
              isglobals={isGlobals}
              _handleIsGlobal={handleIsGlobal}
            />

            <Typography
              variant="p"
              sx={{
                marginTop: isSmallMobile ? 2 : 0,
                ml: 1,
                fontSize: isSmallMobile ? "10px" : "12px",
              }}
            >
              {isGlobals === "public"
                ? "(Anyone on the internet with the link can view)"
                : "(Only people with access can open with the link)"}
            </Typography>
          </Box>
          <TextFieldShare>
            {isMobile ? (
              <TextField
                autoFocus
                size="small"
                type="text"
                fullWidth
                variant="outlined"
                value={getURL}
                InputLabelProps={{
                  shrink: false,
                }}
                sx={{ userSelect: "none" }}
                disabled={isGlobals === "private" ? true : false}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {loading ? (
                        <Loader size={16} />
                      ) : coppied ? (
                        <DownloadDoneIcon
                          sx={{
                            color: "#17766B",
                            fontSize: "18px",
                          }}
                        />
                      ) : (
                        <ContentCopyIcon
                          sx={{
                            fontSize: "18px",
                          }}
                          disabled={
                            (isGlobals === "private") | coppied ? true : false
                          }
                          onClick={handleGetFolderLink}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <TextField
                autoFocus
                size="small"
                type="text"
                fullWidth
                variant="outlined"
                value={getURL}
                disabled={isGlobals === "private" ? true : false}
                sx={{ userSelect: "none" }}
              />
            )}
            {!isMobile && (
              <ButtonGet>
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: isSmallMobile ? "100px" : "120px",
                  }}
                  disabled={(isGlobals === "private") | coppied ? true : false}
                  onClick={handleGetFolderLink}
                >
                  {loading ? (
                    <Loader size={22} />
                  ) : coppied ? (
                    <DownloadDoneIcon
                      sx={{
                        color: "#17766B",
                        fontSize: "22px",
                      }}
                    />
                  ) : (
                    "Get Link"
                  )}
                </Button>
              </ButtonGet>
            )}
          </TextFieldShare>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              mb: isMobile ? "1px" : "4px",
            }}
            fontSize={isMobile ? "0.8rem" : "1rem"}
          >
            Send the document via email
          </Typography>
          <TextInputdShare>
            <MuiChipsInput
              value={chipData}
              placeholder="Add user and Group"
              fullWidth
              onChange={handleChange}
              validate={isValidEmail}
            />

            {chipData.length > 0 && (
              <ShareAction
                statusshare={statusShare}
                handleStatus={handleStatus}
              />
            )}
          </TextInputdShare>

          <ActionContainer>
            <Button
              sx={{
                borderRadius: "6px",
                padding: "8px 25px",
              }}
              type="button"
              variant="contained"
              color="greyTheme"
              onClick={() => onClose()}
            >
              Done
            </Button>
            <Button
              sx={{
                borderRadius: "6px",
                padding: "8px 25px",
              }}
              type="button"
              variant="contained"
              color="primaryTheme"
              onClick={handleShareStatus}
            >
              Send
            </Button>
          </ActionContainer>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default CreateShare;
