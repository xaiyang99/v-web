import {
  Alert,
  Box,
  Button,
  CardContent,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import { MuiChipsInput } from "mui-chips-input";
import React from "react";
import * as XLSX from "xlsx";
import { errorMessage } from "../../../components/Alerts";
import DialogV1 from "../../../components/DialogV1";
import AntSwitchComponent from "./AntSwitchComponent";
import { useTranslation } from "react-i18next";

const ImportFileInput = styled("input")(({ theme }) => ({
  "::-webkit-file-upload-button": {
    backgroundColor: theme.palette.primary.main,
    color: "#ffffff",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    height: "40px",
    minWidth: "100px",
    borderRadius: "5px",
    WebkitAppearance: "none",
  },
}));
const CustomInputLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.primaryTheme.brown(),
  fontWeight: theme.typography.fontWeightMedium,
  marginTop: "15px",
}));
const TextInputdShare = styled("div")({
  marginBottom: "20px",
});

const CustomButton = styled(Button)({
  borderRadius: "6px",
});

function Dialog(props) {
  const { dataForEvents, setDataForEvents, onClose, onClick } = props;
  const { t } = useTranslation();
  const handleChange = (newChip) => {
    setDataForEvents({
      ...dataForEvents,
      data: {
        ...dataForEvents.data,
        chips: chipsToArray(newChip),
      },
    });
  };
  const isValidEmail = (data) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(data);
  };

  React.useEffect(() => {
    isValidEmail(dataForEvents.data.chips);
  }, [dataForEvents.data]);

  function handleFile(e) {
    if (e.target.files) {
      if (e.target.files[0].name.endsWith(".xlsx")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const arrayObj = XLSX.utils.sheet_to_json(worksheet);
          setDataForEvents((state) => ({
            ...state,
            data: { ...state.data, data: arrayObj },
          }));
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      } else {
        errorMessage("Support only xlsx file", 2000);
      }
    }
  }

  return (
    <div>
      <DialogV1
        {...props}
        dialogProps={{
          PaperProps: {
            sx: {
              overflowY: "initial",
              maxWidth: props.width || "800px",
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
        <CardContent>
          <Typography sx={{ mb: 5 }} variant="h6">
            {props.label}
          </Typography>

          <Box>
            {props.checked && !dataForEvents.data.data && (
              <Alert severity="error">{t("_send_broadcast_warning")}</Alert>
            )}
            <Box
              sx={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <ImportFileInput
                type="file"
                accept=".xlsx"
                value=""
                onChange={handleFile}
              />
            </Box>
            {dataForEvents.data?.data && (
              <Table sx={{ minWidth: 300 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t("_no")}</TableCell>
                    <TableCell>{t("_email")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataForEvents.data?.data?.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {!dataForEvents.data.data && (
              <Box>
                <CustomInputLabel></CustomInputLabel>
                <TextInputdShare>
                  <MuiChipsInput
                    disabled={props.checked}
                    value={dataForEvents.data?.chips || []}
                    placeholder={t("_email_placeholders")}
                    fullWidth
                    onChange={handleChange}
                    // validate={isValidEmail}
                  />

                  {dataForEvents.data.error === "chip" && !props.checked && (
                    <Typography
                      variant="p"
                      style={{
                        color: "red",
                        fontSize: "12px",
                      }}
                    >
                      {t("_send_broadcast_error")}
                    </Typography>
                  )}
                </TextInputdShare>
                <AntSwitchComponent
                  sx={{ mt: 5 }}
                  props={{
                    checked: props.checked,
                    setChecked: props.setChecked,
                  }}
                  title={t("_all_user")}
                  desc={t("_send_broadcast_warning")}
                />
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 5,
            }}
          >
            <CustomButton
              variant="contained"
              color="primaryTheme"
              onClick={onClick}
            >
              {t("_send_button")}
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
        </CardContent>
      </DialogV1>
    </div>
  );
}

export default Dialog;
