import { OutlinedInput, Select } from "@mui/material";
import * as Icon from "../../../../icons/icons";

const SelectStyled = (props) => {
  return (
    <Select
      displayEmpty
      input={<OutlinedInput />}
      sx={{
        height: 30,
        fontWeight: 600,
        color: (theme) => theme.palette.primary.main,
        backgroundColor: "rgba(23,118,107,0.15)",
        border: "none",
        ".MuiOutlinedInput-notchedOutline": {
          border: "0 !important",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {},
        "&:hover .MuiOutlinedInput-notchedOutline": {
          border: "0 !important",
        },
        ".MuiSvgIcon-root ": {
          fill: "white !important",
        },
      }}
      IconComponent={(props) => (
        <Icon.IoIosArrowDownIcon
          {...{
            ...props,
          }}
          fill="#17766B"
        />
      )}
      MenuProps={{
        PaperProps: {
          sx: {
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 5px",
          },
        },
      }}
      {...props}
    >
      {props.children}
    </Select>
  );
};

export default SelectStyled;
