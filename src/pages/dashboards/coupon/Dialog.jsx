import {
  Box,
  Button,
  Card,
  Divider,
  InputLabel,
  Radio,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useState } from "react";
import DialogV1 from "../../../components/DialogV1";
import * as Icon from "../../../icons/icons";
import { useTranslation } from "react-i18next";
const DialogFormBoby = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  rowGap: theme.spacing(5),
}));
const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.primaryTheme.brown(),
  fontWeight: theme.typography.fontWeightMedium,
  marginTop: "15px",
  marginBottom: "2px",
}));
const CustomButton = styled(Button)({
  borderRadius: "6px",
});
const DesctionContainer = styled(Box)(({ theme }) => ({
  width: "50%",
  display: "flex",
  justifyContent: "center",
  padding: "5px 10px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));
const CardSocialContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: "5px 10px",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));
const CardSocial = styled(Card)(({ theme }) => ({
  padding: "10px 60px",
  margin: "0px 10px",
  boxShadow: "rgba(0, 0, 0, 0.16) 0px 0.5px 2px",
  [theme.breakpoints.down("sm")]: {
    margin: "10px",
    padding: "10px",
  },
}));
const CardSocialItem = styled(Box)({
  display: "flex",
  justifyContent: "center",
});
function Dialog(props) {
  const { dataForEvents, setDataForEvents, onClose, onClick } = props;
  const { t } = useTranslation();

  const handleChange = (event) => {
    setDataForEvents((state) => ({
      ...state,
      data: { ...state.data, action: event.target.value },
    }));
  };

  const [socialData, setSocialData] = useState([
    {
      icon: <Icon.Mail size="35px" />,
      name: "Email",
      action: "email",
      label: "Enter your friend's email address",
      placeholder: "john@gmail.com",
    },
    {
      icon: <Icon.WhatsApp size="35px" />,
      name: "WhatsApp",
      action: "whatsapp",
      label: "Enter your friend's Whatsapp contact",
      placeholder: "+856 20 5855..",
    },
    {
      icon: <Icon.Line size="35px" />,
      name: "Line",
      action: "line",
      label: "Enter your friend's line",
      placeholder: "example_123",
    },
  ]);
  const inputLabel = socialData.filter(
    (item) => item.action === dataForEvents.data?.action
  );

  return (
    <div>
      <DialogV1
        {...props}
        dialogProps={{
          PaperProps: {
            sx: {
              overflowY: "initial",
              maxWidth: props.width || "600px",
            },
            zindex: 10000,
          },
        }}
        dialogContentProps={{
          sx: {
            borderRadius: "6px",
            padding: (theme) => `${theme.spacing(8)} ${theme.spacing(6)}`,
          },
        }}
      >
        {props.status === 1 && (
          <DialogFormBoby>
            <Box sx={{ mt: 5 }}>
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  color: (theme) => theme.palette.primaryTheme.brown(),
                }}
                variant="h2"
              >
                {props?.label}
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <DesctionContainer>
                  <Typography
                    sx={{
                      mt: 3,
                      textAlign: "center",
                      color: (theme) => theme.palette.primaryTheme.brown(),
                    }}
                    variant="p"
                  >
                    {props.desc}
                  </Typography>
                </DesctionContainer>
              </Box>
            </Box>

            <CardSocialContainer>
              {socialData?.map((item, index) => (
                <CardSocial
                  key={index}
                  sx={{
                    border:
                      dataForEvents.data.action === item.action
                        ? "1px solid #17766B"
                        : "none",
                  }}
                >
                  <CardSocialItem>{item.icon}</CardSocialItem>
                  <CardSocialItem>
                    <Typography variant="p">{item.name}</Typography>
                  </CardSocialItem>
                  <CardSocialItem>
                    <Radio
                      checked={dataForEvents.data.action === item.action}
                      onChange={handleChange}
                      value={item.action}
                      size="small"
                      name="radio-buttons"
                      inputProps={{ "aria-label": item.action }}
                    />
                  </CardSocialItem>
                </CardSocial>
              ))}
            </CardSocialContainer>

            <Divider />

            <Typography
              variant="h5"
              sx={{
                mb: -2,
                mt: 2,
                color: (theme) => theme.palette.primaryTheme.brown(),
              }}
            >
              Invite your friends
            </Typography>
            <InputLabel
              sx={{
                margin: "0px 0px -20px 0px",
                color: (theme) => theme.palette.primaryTheme.brown(),
              }}
            >
              {inputLabel[0]?.label}
            </InputLabel>
            <Box
              sx={{
                mb: 5,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TextField
                size="small"
                fullWidth
                error={dataForEvents.data.error}
                placeholder={inputLabel[0]?.placeholder}
                sx={{ paddingRight: "10px" }}
                value={dataForEvents.data.send || ""}
                onChange={(e) => {
                  setDataForEvents((state) => ({
                    ...state,
                    data: {
                      ...state.data,
                      send: e.target.value,
                    },
                  }));
                }}
                helperText={dataForEvents.data.error}
              />
              <Box>
                <Button
                  variant="contained"
                  color="primaryTheme"
                  sx={{ borderRadius: "5px" }}
                  onClick={onClick}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </DialogFormBoby>
        )}
        {props.status === 2 && (
          <DialogFormBoby>
            <Box sx={{ mt: 5 }}>
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  color: (theme) => theme.palette.primaryTheme.brown(),
                }}
                variant="h2"
              >
                {props.label}
              </Typography>
              <CustomInputLabel>{t("_total")}</CustomInputLabel>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    mt: 3,
                    textAlign: "center",
                    color: (theme) => theme.palette.primaryTheme.brown(),
                  }}
                  variant="p"
                >
                  {props.desc}
                </Typography>
                <TextField
                  variant="outlined"
                  error={false}
                  placeholder={t("_total_placeholder")}
                  fullWidth
                  size="small"
                  type="number"
                  value={dataForEvents.data.total}
                  onChange={(e) => {
                    setDataForEvents((state) => ({
                      ...state,
                      data: { ...state.data, total: e?.target?.value },
                    }));
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "40px",
                }}
              >
                <CustomButton
                  variant="contained"
                  color="primaryTheme"
                  onClick={onClick}
                >
                  {dataForEvents.action
                    ? t("_update_button")
                    : t("_save_button")}
                </CustomButton>
                <CustomButton
                  sx={{ ml: 3 }}
                  variant="contained"
                  color="secondaryTheme"
                  onClick={onClose}
                >
                  {t("_cancel_button")}
                </CustomButton>
              </Box>
            </Box>
          </DialogFormBoby>
        )}
      </DialogV1>
    </div>
  );
}

export default Dialog;
