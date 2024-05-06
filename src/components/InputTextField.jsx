import { Box, TextField, styled } from "@mui/material";
import { useEffect, useState } from "react";

const InputTextFieldContainer = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "100%",
});

const InputTextFieldLabel = styled(Box)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
}));

const InputTextFieldLayout = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  width: "100%",
}));

const InputTextField = (props) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    let value = props.inputProps.value;
    if (props.isCreditCardExpDate) {
      let cleanedValue = value.replace(/[^\d]/g, "");
      let limitedValue = cleanedValue.slice(0, 4);

      if (limitedValue.length >= 2) {
        value = `${limitedValue.slice(0, 2)}/${limitedValue.slice(2)}`;
      }
    }
    if (props.isCreditCardCVVCode) {
      const cleanedValue = value.replace(/[^\d]/g, "");

      value = cleanedValue.slice(0, 3);
    }
    setValue(value);
  }, [
    props.inputProps.value,
    props.isCreditCardCVVCode,
    props.isCreditCardExpDate,
  ]);

  const handleChange = (e) => {
    if (!props.readOnly) {
      const value = e.target.value;
      if (props.isCreditCardExpDate) {
        const cleanedValue = value.replace(/[^\d]/g, "");

        const limitedValue = cleanedValue.slice(0, 4);

        if (limitedValue.length >= 2) {
          const formattedValue = `${limitedValue.slice(
            0,
            2,
          )}/${limitedValue.slice(2)}`;
          setValue(formattedValue);
          e.target.value = formattedValue;
        } else {
          setValue(limitedValue);
          e.target.value = limitedValue;
        }
        if (props.inputProps.onChange) {
          return props.inputProps.onChange(e);
        }
        return e;
      } else if (props.isCreditCardCVVCode) {
        const value = e.target.value;
        const cleanedValue = value.replace(/[^\d]/g, "");

        const limitedValue = cleanedValue.slice(0, 3);
        setValue(limitedValue);
        e.target.value = limitedValue;
        if (props.inputProps.onChange) {
          return props.inputProps.onChange(e);
        }
        return e;
      } else {
        setValue(value);
        e.target.value = value;
        if (props.inputProps.onChange) {
          return props.inputProps.onChange(e);
        }
        return e;
      }
    }
  };

  return (
    <InputTextFieldContainer>
      {!props.disableLabel && (
        <InputTextFieldLabel>{props.label}</InputTextFieldLabel>
      )}
      <InputTextFieldLayout {...props.inputLayoutProps}>
        <TextField
          autoComplete="on"
          {...props.inputProps}
          size="small"
          InputLabelProps={{
            shrink: false,
          }}
          onChange={handleChange}
          value={value}
          sx={{
            width: "100%",
            height: "100%",
            "& .MuiInputBase-root": {
              height: "100%",
              input: {
                height: "100%",
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
      </InputTextFieldLayout>
    </InputTextFieldContainer>
  );
};

export default InputTextField;
