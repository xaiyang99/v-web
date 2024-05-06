import { Box, Button, useMediaQuery } from "@mui/material";
import MenuDropdownContainer from "../components/menu/MenuDropdownContainer";

import { MdOutlineExpandMore } from "react-icons/md";
import MenuDropdownItem from "../components/menu/MenuDropdownItem";
import { roleShareMenu } from "../components/menu/MenuItems";
export default function ShareAction(props) {
  const { statusshare, handleStatus } = props;
  const isSmallMobile = useMediaQuery("(max-width:768px)");
  return (
    <div style={{ position: "relative" }}>
      <MenuDropdownContainer
        customButton={{
          element: (
            <Box
              sx={{
                padding: isSmallMobile ? "10px 0px 0 0" : "0px 0 0 10px",
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  minWidth: "120px",
                  padding: "12px 10px",
                }}
                endIcon={<MdOutlineExpandMore />}
              >
                {statusshare === "view" ? "Can view" : "Can edit"}
              </Button>
            </Box>
          ),
        }}
      >
        {roleShareMenu.map((menuItem, index) => {
          return (
            <MenuDropdownItem
              statusshare={statusshare}
              key={index}
              title={menuItem.title}
              icon={menuItem.icon}
              onClick={() => handleStatus(menuItem.action)}
            />
          );
        })}
      </MenuDropdownContainer>
    </div>
  );
}
