import * as React from "react";
import * as Mui from "../css/fileDropStyle";

// component and functions
import { useLazyQuery } from "@apollo/client";
import { successMessage } from "../../../components/Alerts";
import DialogV1 from "../../../components/DialogV1";
import {
  generateRandomUniqueNumber,
  getDateFormateYYMMDD,
} from "../../../functions";
import useAuth from "../../../hooks/useAuth";

//mui component and style
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { styled as muiStyled } from "@mui/system";
import CopyToClipboard from "react-copy-to-clipboard";
import { QUERY_FILEDROP_LINKS } from "../file-drop/apollo";

const DialogPreviewFileV1Boby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(3),
  "& .MuiDialogActions-root": {
    display: "none",
  },
}));

const DialogPreviewQRcode = (props) => {
  const user = useAuth();
  const link = process.env.REACT_APP_FILE_DROP_LINK || "";
  const [value, setValue] = React.useState(link);
  const [isCopy, setIsCopy] = React.useState(false);
  const [isShow, setIsShow] = React.useState(false);
  const [selectDay, setSelectDay] = React.useState(1);
  const [expiredDate, setExpiredDate] = React.useState(null);
  const [latestUrl, setLatestUrl] = React.useState("");
  const mMobileScreen = useMediaQuery("(max-width:320px)");
  const [queryFileDropLinks, { data: linkData }] =
    useLazyQuery(QUERY_FILEDROP_LINKS);

  const handleCopyLink = () => {
    setIsCopy(true);
    successMessage("You've copied link!!", 3000);
  };

  const calculateExpirationDate = (days) => {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + days);

    return expirationDate.toISOString();
  };

  const handleExpiredDateChange = (event) => {
    const selectedDays = event.target.value;
    setSelectDay(selectedDays);

    const expirationDateTime = calculateExpirationDate(selectedDays);
    setExpiredDate(getDateFormateYYMMDD(expirationDateTime));
  };

  const handleGenerateLink = () => {
    successMessage("Create file drop link successful!", 3000);
    setIsCopy(false);

    handleExpiredDateChange({
      target: {
        value: selectDay || 1,
      },
    });

    const genLink = link + user?.user?._id + "-" + generateRandomUniqueNumber();
    setValue(genLink);
    setIsShow(true);
    props.handleChange(genLink, expiredDate);
  };

  const queryFileDropLink = () => {
    queryFileDropLinks({
      variables: {
        where: {
          folderId: props?.folderId,
          createdBy: user?.user?._id,
          status: "opening",
        },
      },
    });
    if (linkData?.getPrivateFileDropUrl?.data) {
      const data = linkData?.getPrivateFileDropUrl?.data;
      const lastRecord = data[data.length - 1];
      setLatestUrl(lastRecord?.url);
    }
  };

  React.useEffect(() => {
    queryFileDropLink();
  }, [props?.folderId, linkData]);

  React.useEffect(() => {
    if (!!expiredDate) {
      setExpiredDate(null);
    }
  }, [props?.isOpen]);

  return (
    <DialogV1
      {...props}
      dialogProps={{
        PaperProps: {
          sx: {
            overflowY: "initial",
            maxWidth: "500px",
          },
        },
      }}
      dialogContentProps={{
        sx: {
          backgroundColor: "white !important",
          borderRadius: "6px",
          padding: (theme) => `${theme.spacing(8)} ${theme.spacing(6)}`,
        },
      }}
    >
      <DialogPreviewFileV1Boby>
        <Mui.FiledropContainer>
          <Mui.ShowHeaderDetail>
            <Typography variant="h3">
              Select expired date to this link! Default: 24 hours
            </Typography>
            <Typography variant="h6">
              Please share this link with the intended recipient of the file.
            </Typography>
          </Mui.ShowHeaderDetail>
          <Mui.GenerateLinkArea>
            <FormControl sx={{ width: "20%" }} size="small">
              <InputLabel id="demo-simple-select-label">
                Expired date
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectDay}
                label="Expired date"
                onChange={handleExpiredDateChange}
              >
                <MenuItem value={1}>1 {mMobileScreen ? "d" : "day"}</MenuItem>
                <MenuItem value={2}>2 {mMobileScreen ? "d" : "day"}</MenuItem>
                <MenuItem value={3}>3 {mMobileScreen ? "d" : "day"}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              sx={{
                width: "75%",
                fontSize: "18px !important",
                color: "grey !important",
              }}
              size="small"
              InputLabelProps={{
                shrink: false,
              }}
              disabled
              value={value !== link ? value : latestUrl || ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {isCopy ? (
                      <IconButton>
                        <DownloadDoneIcon sx={{ color: "#17766B" }} />
                      </IconButton>
                    ) : (
                      <CopyToClipboard
                        text={value !== link ? value : latestUrl || ""}
                        onCopy={handleCopyLink}
                        sx={{ cursor: "copy" }}
                      >
                        <IconButton
                          aria-label="copy"
                          disabled={
                            latestUrl ? false : value == link ? true : false
                          }
                        >
                          <ContentCopyIcon sx={{ fontSize: "1rem" }} />
                        </IconButton>
                      </CopyToClipboard>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Mui.GenerateLinkArea>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "start",
              flexDirection: "column",
            }}
          >
            {isShow && (
              <Typography
                variant=""
                sx={{ fontSize: "0.8rem", color: "#4B465C" }}
              >
                This link will be expired on:
                {expiredDate && (
                  <span style={{ color: "#17766B" }}> {expiredDate}.</span>
                )}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleGenerateLink}
              sx={{ mt: 4 }}
            >
              Generate link now
            </Button>
          </Box>
        </Mui.FiledropContainer>
      </DialogPreviewFileV1Boby>
    </DialogV1>
  );
};

export default DialogPreviewQRcode;
