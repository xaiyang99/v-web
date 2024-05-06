import { Box, Typography } from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import { useTranslation } from "react-i18next";
import DialogV1 from "../../components/DialogV1";
import NormalButton from "../../components/NormalButton";
import * as Icon from "../../icons/icons";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DialogPaymentPackageBoby = muiStyled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(5),
}));

const DialogPaymentPackage = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <DialogV1
      {...props}
      dialogProps={{
        PaperProps: {
          sx: {
            overflowY: "initial",
            maxWidth: "650px",
          },
        },
        sx: {
          columnGap: "20px",
        },
      }}
      dialogContentProps={{
        sx: {
          backgroundColor: "white !important",
          borderRadius: "6px",
          padding: (theme) => `${theme.spacing(5)}`,
        },
      }}
    >
      <DialogPaymentPackageBoby>
        <Typography
          variant="div"
          sx={{
            textAlign: "center",
          }}
        >
          <Icon.TimeOutIcon
            style={{
              width: "150px",
              height: "150px",
            }}
          />
        </Typography>
        <Typography
          variant="h3"
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: (theme) => theme.spacing(7),
            color: (theme) => theme.palette.primaryTheme.brown(),
          }}
        >
          Your current package has expired
        </Typography>
        <Typography
          variant="div"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            rowGap: (theme) => theme.spacing(3),
            fontWeight: "bold",
            marginBottom: (theme) => theme.spacing(7),
            color: (theme) => theme.palette.primaryTheme.brown(),
          }}
        >
          <Typography variant="h5">Your current package has expired</Typography>
          <Typography variant="p">
            Don't miss out on uninterrupted access to our platform. Renew now to
            continue using our system. Stay connected and productive by renewing
            your package today!
          </Typography>
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: (theme) => theme.spacing(4),
          }}
        >
          {props.label}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            columnGap: (theme) => theme.spacing(3),
          }}
        >
          <Box
            sx={{
              display: "flex",
              columnGap: (theme) => theme.spacing(3),
            }}
          >
            {/* <NormalButton
              onClick={() => props.onClose()}
              sx={{
                width: "auto",
                padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                borderRadius: (theme) => theme.spacing(1),
                backgroundColor: "rgba(0,0,0,0.1)",
                color: "rgba(0,0,0,0.5)",
              }}
            >
              Talk With us First
            </NormalButton> */}
            <NormalButton
              sx={{
                width: "auto",
                padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                borderRadius: (theme) => theme.spacing(1),
                backgroundColor: (theme) => theme.palette.primaryTheme.main,
                color: "white !important",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => props.onConfirm()}
            >
              Continue, Subscribe Now{" "}
              <FaArrowRight style={{ marginLeft: "5px" }} />
            </NormalButton>
          </Box>
        </Box>
      </DialogPaymentPackageBoby>
    </DialogV1>
  );
};

export default DialogPaymentPackage;
