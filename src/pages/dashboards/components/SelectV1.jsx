import { Box, styled, useTheme } from "@mui/material";
import Select from "react-select";
import { THEMES } from "../../../constants";

const SelectV1Container = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "100%",
});

const SelectV1Label = styled(Box)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
}));

const SelectV1Content = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  width: "100%",
}));

const SelectV1 = ({
  selectProps,
  selectStyle,
  containerStyle,
  controlStyle,
  LabelProps,
  ...props
}) => {
  const theme = useTheme();
  return (
    <SelectV1Container>
      {!props.disableLabel && (
        <SelectV1Label {...LabelProps}>{props.label}</SelectV1Label>
      )}
      <SelectV1Content
        sx={{
          ...(selectProps?.sx || {}),
        }}
      >
        <Select
          isDisabled={props?.isDisabled ? true : false}
          {...{
            ...selectProps,
            ...(!selectProps?.disableClear
              ? {
                  isClearable: true,
                }
              : {
                  isClearable: false,
                }),
          }}
          components={{
            IndicatorSeparator: () => null,
          }}
          menuPlacement="auto"
          menuPortalTarget={document.getElementById("dialog-v1")}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            input: (base) => ({
              ...base,
            }),
            menu: (base) => ({
              position: "absolute",
              ...base,
              zIndex: 30,
            }),
            container: (base) => ({
              ...base,
              ...(selectStyle || {}),
              ...(containerStyle || {}),
            }),
            option: (base, { isFocused, isSelected }) => ({
              ...base,
              ...(isSelected && {
                color: "white !important",
                backgroundColor: `${theme.palette.primaryTheme.main} !important`,
              }),
              ...(!isSelected && {
                ...(isFocused && {
                  color: "black",
                  backgroundColor: "rgba(0,0,0,0.13)",
                }),
                "&:active": {
                  color: "black",
                  backgroundColor: "rgba(0,0,0,0.13)",
                },
              }),
              overflowY: "auto",
            }),
            control: (base, { isFocused }) => ({
              ...base,
              width: "100%",
              ...(selectStyle || {}),
              backgroundColor: "transparent",
              border: `1px solid ${
                theme.name === THEMES.DARK
                  ? "rgba(255,255,255,0.23)"
                  : "rgba(0,0,0,0.23)"
              }`,
              boxShadow: "none",
              "&:hover": {
                borderColor: theme.name === THEMES.DARK ? "white" : "black",
              },
              ...(isFocused && {
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
              }),
              flexWrap: "nowrap",
              ...(controlStyle && {
                ...controlStyle(isFocused),
              }),
            }),
            placeholder: (base) => ({
              ...base,
              color: "#9F9F9F",
            }),
            singleValue: (base) => ({
              ...base,
              color: theme.name === THEMES.DARK ? "white" : "black",
            }),
            valueContainer: (base) => ({
              ...base,
              alignItems: "center",
              padding: "0 10px",
            }),
            indicatorsContainer: (base) => ({
              ...base,
              padding: "0 6px",
              height: "100%",
              "& > div": {
                alignItems: "center",
              },
            }),
            dropdownIndicator: (base) => ({
              ...base,
              padding: "0",
              height: "100%",
              minHeight: "100%",
            }),
          }}
        />
      </SelectV1Content>
    </SelectV1Container>
  );
};

export default SelectV1;
