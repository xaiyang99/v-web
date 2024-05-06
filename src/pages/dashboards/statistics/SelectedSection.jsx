import { OutlinedInput, Select } from "@mui/material";
import * as Icon from "../../../pages/client-dashboard/dashboard/icons";

const SelectdSection = (props) => {
  return (
    <Select
      displayEmpty
      input={<OutlinedInput />}
      sx={{
        width: 100,
        height: 30,
        fontWeight: 600,
        color: (theme) => theme.palette.primary.main,
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: (theme) => theme.palette.primary.main,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: (theme) => theme.palette.primary.main,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: (theme) => theme.palette.primary.main,
          bgColor: "#17766B",
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
            "& .MuiMenuItem-root .Mui-selected": {
              backgroundColor: (theme) => theme.palette.primaryTheme.main,
              color: (theme) => theme.palette.greyTheme.main,
            },
            "& .MuiMenuItem-root:active": {
              backgroundColor: (theme) => theme.palette.primaryTheme.main,
              color: (theme) => theme.palette.greyTheme.main,
            },
            "& .MuiMenuItem-root:hover": {
              backgroundColor: (theme) => theme.palette.greyTheme.main,
              color: (theme) => theme.palette.primary.main,
            },
          },
        },
      }}
      {...props}
    >
      {props.children}
    </Select>
  );
};

export default SelectdSection;
