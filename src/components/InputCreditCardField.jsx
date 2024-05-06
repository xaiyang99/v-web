import { Box, TextField, Typography, styled, useTheme } from "@mui/material";
import React, { useMemo, useState } from "react";
import { THEMES } from "../constants";
import * as Icons from "../icons/icons";

const InputCreditCardFieldContainer = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "100%",
});

const InputCreditCardFieldLabel = styled(Box)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
}));

const InputCreditCardFieldLayout = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  width: "100%",
}));

const InputCreditCardField = (props) => {
  const theme = useTheme();
  const [fieldStatus, setFieldStatus] = useState("");
  const defaultValue = useMemo(() => {
    const value = props.inputProps.value;
    const cleanedValue = value.replace(/[^\d]/g, "");
    const limitedValue = cleanedValue.slice(0, 16);
    const formattedValue = limitedValue.replace(/(\d{4})/g, "$1 ").trim();

    return formattedValue;
  }, [props.inputProps.value]);
  const [value, setValue] = useState(defaultValue || "");

  const handleCreditCardChange = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^\d]/g, "");

    const limitedValue = cleanedValue.slice(0, 16);

    const formattedValue = limitedValue.replace(/(\d{4})/g, "$1 ").trim();

    setValue(formattedValue);
    e.target.value = formattedValue;
    if (props.inputProps.onChange) {
      return props.inputProps.onChange(e);
    }
    return e;
  };

  return (
    <InputCreditCardFieldContainer>
      {!props.disableLabel && (
        <InputCreditCardFieldLabel>{props.label}</InputCreditCardFieldLabel>
      )}
      <InputCreditCardFieldLayout {...props.inputLayoutProps}>
        <Typography
          component="div"
          sx={{
            height: "100%",
            display: "flex",
            position: "relative",
            "&:hover": {
              ".fieldset-input": {
                borderColor:
                  theme.name === THEMES.DARK
                    ? "white"
                    : fieldStatus === "focus"
                    ? theme.palette.primaryTheme.main
                    : "black",
              },
            },
          }}
        >
          <Typography
            component="fieldset"
            className="fieldset-input"
            sx={{
              borderRadius: "4px",
              display: "block",
              width: "100%",
              height: "100%",
              position: "absolute",
              borderStyle: "solid",
              borderColor:
                fieldStatus === "focus"
                  ? theme.palette.primaryTheme.main
                  : theme.name === THEMES.DARK
                  ? "rgba(255,255,255,0.23)"
                  : "rgba(0,0,0,0.23)",
              borderWidth: fieldStatus === "focus" ? "2px" : "1px",
            }}
          />
          <TextField
            autoComplete="on"
            onFocus={() => setFieldStatus("focus")}
            onBlur={() => setFieldStatus("blur")}
            {...props.inputProps}
            size="small"
            InputLabelProps={{
              shrink: false,
            }}
            value={value}
            onChange={handleCreditCardChange}
            sx={{
              "& fieldset": { border: "none" },
              width: "100%",
              "& .MuiInputBase-root": {
                input: {
                  "&::placeholder": {
                    opacity: 1,
                    color: "#9F9F9F",
                  },
                },
              },
              "input[type='number']": {
                MozAppearance: "textfield",
              },

              "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
                {
                  WebkitAppearance: "none",
                },
              ...props.inputProps?.sx,
            }}
          />
          <Typography
            component="div"
            className="payment-icons"
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: "4px 0",
            }}
          >
            <Icons.VisaIcon style={{ height: "100%", margin: "0 -10px" }} />
            <Icons.MastercardIcon
              style={{ height: "100%", margin: "0 -10px" }}
            />
            <Icons.AmexIcon style={{ height: "100%", margin: "0 -10px" }} />
            <Icons.JcbIcon style={{ height: "100%", margin: "0 -10px" }} />
            <Icons.DinersIcon style={{ height: "100%", margin: "0 -10px" }} />
          </Typography>
        </Typography>
      </InputCreditCardFieldLayout>
    </InputCreditCardFieldContainer>
  );
};

export default InputCreditCardField;
