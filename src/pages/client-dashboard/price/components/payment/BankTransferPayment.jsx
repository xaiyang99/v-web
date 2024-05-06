import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { styled, createTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import NormalButton from "../../../../../components/NormalButton";
import * as Icon from "../../icons";
import UploadTransferSlipImage from "./UploadTransferSlipImage";

const BankTransferPaymentContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: 12,
}));

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: 50,
  width: 12,
  height: 12,
  border: "2px solid #DBDADE",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    borderColor: theme.palette.primaryTheme.main,
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(57,75,89,.5)"
        : "rgba(206,217,224,.5)",
  },
}));

const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&:before": {
    display: "block",
    borderRadius: 50,
    width: 6,
    height: 6,
    content: "''",
    backgroundColor: theme.palette.primaryTheme.main,
  },
  borderColor: theme.palette.primaryTheme.main,
}));

const BankTransferPayment = () => {
  const theme = useTheme();
  const [activebankTransfer, setActiveBankTransfer] = useState(0);
  const bankTransferList = useMemo(
    () => [
      { accName: "BCEL One", accNumber: "BCEL One" },
      { accName: "LDB", accNumber: "LDB" },
      { accName: "JDB", accNumber: "JDB" },
      { accName: "Lao-Viet", accNumber: "Lao-Viet" },
      { accName: "ACELEDA", accNumber: "ACELEDA" },
    ],
    []
  );
  return (
    <BankTransferPaymentContainer>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        You can choose the bank with which you are convenient to pay
      </Typography>
      <Box
        sx={{
          display: "flex",
          padding: 3,
        }}
      >
        <Typography
          component="div"
          className="bank-transfer-group"
          sx={{
            display: "flex",
            flexDirection: "column",
            minWidth: 150,
          }}
        >
          <FormGroup>
            {bankTransferList.map((bankTransfer, index) => {
              return (
                <FormControlLabel
                  sx={{
                    ":hover": {
                      ".label": {
                        color: theme.palette.primaryTheme.main,
                      },
                    },
                  }}
                  key={index}
                  control={
                    <Checkbox
                      checked={activebankTransfer === index}
                      onChange={(e) => setActiveBankTransfer(index)}
                      sx={{
                        "&:hover": { bgcolor: "transparent" },
                        "& .MuiSvgIcon-root": { fontSize: 28 },
                      }}
                      disableRipple
                      color="default"
                      icon={<BpIcon />}
                      checkedIcon={<BpCheckedIcon />}
                    />
                  }
                  label={
                    <Typography
                      component="div"
                      className="label"
                      sx={{
                        ...(activebankTransfer === index && {
                          fontWeight: 600,
                          color: theme.palette.primaryTheme.main,
                        }),
                      }}
                    >
                      {bankTransfer.accName}
                    </Typography>
                  }
                />
              );
            })}
          </FormGroup>
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 2,
            padding: "0 12px",
            borderLeft: "1px solid #DBDADE",
            flex: 1,
          }}
        >
          <Typography
            component="li"
            sx={{
              fontWeight: 600,
            }}
          >
            Options
          </Typography>
          <Typography component="div">
            Account number: {bankTransferList[activebankTransfer].accNumber}
          </Typography>
          <Typography component="div">QR Code:</Typography>
          <NormalButton
            sx={{
              width: "150px",
              height: "auto",
              fontWeight: 500,
              marginTop: 3,
              padding: "8px 16px",
              color: theme.palette.primaryTheme.main,
              borderRadius: "4px",
              display: "block",
              textAlign: "center",
              backgroundColor: "rgba(23, 118, 107, 0.16)",
            }}
          >
            Download image
          </NormalButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 4,
        }}
      >
        <UploadTransferSlipImage />
      </Box>
    </BankTransferPaymentContainer>
  );
};

export default BankTransferPayment;
