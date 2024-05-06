import { Drawer, Typography, IconButton, Box } from "@mui/material";
import * as MUI from "../css/chatStyle";
import { FaTimes } from "react-icons/fa";
import { EmailOutlined } from "@mui/icons-material";
import { PhoneOutlined } from "@mui/icons-material";

export default function DialogUserInfo(props) {
  const { isOpen, onClose, data: dataUser, imgSrc } = props;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        width: 280,
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
        },
      }}
    >
      <MUI.DrawerClose>
        <IconButton onClick={onClose} size="small">
          <FaTimes />
        </IconButton>
      </MUI.DrawerClose>

      <MUI.DrawerBodyContainer>
        <MUI.DrawerBodyHeader>
          <img src={imgSrc} alt={dataUser?.firstName} />
          <Box>
            <Typography variant="h2">
              {dataUser?.firstName} {dataUser?.lastName}
            </Typography>
            <Typography component="span">Customer</Typography>
          </Box>
        </MUI.DrawerBodyHeader>

        <MUI.DrawerInfoContainer>
          <MUI.DrawerInfoPersonal>
            <MUI.TextLabel>personal information</MUI.TextLabel>
            <MUI.DrawerContactContainer>
              <MUI.DrawerContactList>
                <EmailOutlined className="icon-contact" />
                <Typography variant="h4"> {dataUser?.email} </Typography>
              </MUI.DrawerContactList>
              <MUI.DrawerContactList>
                <PhoneOutlined className="icon-contact" />
                <Typography variant="h4"> {dataUser?.phone || "-"} </Typography>
              </MUI.DrawerContactList>
              {/* <MUI.DrawerContactList>
                <AccessTimeOutlined className="icon-contact" />
                <Typography variant="h4">Mon - Fri 10AM - 8PM</Typography>
              </MUI.DrawerContactList> */}
            </MUI.DrawerContactContainer>
          </MUI.DrawerInfoPersonal>
        </MUI.DrawerInfoContainer>
      </MUI.DrawerBodyContainer>
    </Drawer>
  );
}
