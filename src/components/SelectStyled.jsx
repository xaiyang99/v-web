import { OutlinedInput, Select, useMediaQuery } from "@mui/material";
import * as Icon from "../icons/icons";

const SelectStyled = (props) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <Select
      displayEmpty
      input={<OutlinedInput />}
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
      sx={{
        width: 100,
        height: 30,
        fontWeight: 600,
        ...(isMobile && {
          width: 90,
          height: 30,
          fontSize: "0.7rem !important",
        }),
        color: (theme) => theme.palette.primary.main,
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: (theme) => theme.palette.primary.main,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: (theme) => theme.palette.primary.main,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: (theme) => theme.palette.primary.main,
        },
        ".MuiSvgIcon-root ": {
          fill: "white !important",
        },
        ...props.sx,
      }}
    >
      {props.children}
    </Select>
  );
};

export default SelectStyled;
