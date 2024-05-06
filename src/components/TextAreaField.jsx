import { Box, Typography, styled, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { THEMES } from "../constants";
const InputTextFieldLabel = styled(Box)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  marginBottom: "2px",
}));
const TextAreaField = (props) => {
  const theme = useTheme();
  const { label, sx: customStyles, ...otherProps } = props;
  const [value, setValue] = useState("");

  useEffect(() => {
    const value = props.value;
    setValue(value);
  }, [props.value]);

  const onChange = (e) => {
    const value = e.target.value;
    setValue(value);
    e.target.value = value;
    return props.onChange(e);
  };
  return (
    <div>
      {label && <InputTextFieldLabel>{label}</InputTextFieldLabel>}
      <Typography
        component="textarea"
        {...otherProps}
        value={value}
        onChange={onChange}
        sx={{
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingTop: "5px",
          paddingBottom: "5px",
          resize: "none",
          width: "100%",
          borderRadius: "4px",
          borderColor: "hsl(0, 0%, 80%)",
          "&::placeholder": {
            color: "#9F9F9F",
          },
          "&:hover": {
            borderColor: theme.name === THEMES.DARK ? "white" : "black",
          },
          "&:focus": {
            outline: `1px solid ${
              theme.name === THEMES.DARK
                ? theme.palette.primary.main
                : theme.palette.primaryTheme.main
            } !important`,
            borderColor: `${
              theme.name === THEMES.DARK
                ? theme.palette.primary.main
                : theme.palette.primaryTheme.main
            } !important`,
          },
          ...customStyles,
        }}
      />
    </div>
  );
};

export default TextAreaField;
