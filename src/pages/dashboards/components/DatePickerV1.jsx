import { Box, styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

const DatePickerV1Container = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "100%",
});

const DatePickerV1Lable = styled(Box)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
}));

const DatePickerV1Content = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  width: "100%",
}));

const DatePickerV1 = ({ datePickerProps, ...props }) => {
  return (
    <DatePickerV1Container>
      <DatePickerV1Lable>{props.label}</DatePickerV1Lable>
      <DatePickerV1Content
        sx={{
          "& .MuiTextField-root": {
            width: "100% !important",
          },
          "& .MuiInputBase-root": {},
          "input::placeholder": {
            opacity: "1 !important",
            color: "#9F9F9F",
          },
          ...(props.datePickerLayoutProps?.sx || {}),
        }}
      >
        <DatePicker
          format="dd/MM/yyyy"
          sx={{
            ...(datePickerProps?.sx || {}),
          }}
          slotProps={{
            popper: {
              sx: {
                zIndex: "99999999999 !important",
              },
            },
            desktopPaper: {
              sx: {
                boxShadow: (theme) => `${theme.baseShadow.primary} !important`,
              },
            },
            textField: {
              InputLabelProps: {
                shrink: false,
              },
              sx: {
                input: {
                  "&::placeholder": {
                    opacity: "1 !important",
                  },
                },
                ...(datePickerProps?.sx || {}),
              },
            },
            ...(props.placeholder && {
              textField: {
                placeholder: props.placeholder,
              },
            }),
          }}
          inputFormat="dd/mm/yyyy"
          {...datePickerProps}
        />
      </DatePickerV1Content>
    </DatePickerV1Container>
  );
};

export default DatePickerV1;
