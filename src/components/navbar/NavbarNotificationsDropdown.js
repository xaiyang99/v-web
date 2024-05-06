import styled from "@emotion/styled";
import React, { useRef, useState } from "react";

import { useMutation } from "@apollo/client";
import {
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar as MuiAvatar,
  Popover as MuiPopover,
  Tooltip,
  Typography,
} from "@mui/material";
import { Bell } from "react-feather";
import { BsCheck } from "react-icons/bs";
import { TbSpeakerphone } from "react-icons/tb";
import { DateOfNumber, handleGraphqlErrors } from "../../functions";
import useAuth from "../../hooks/useAuth";
import DialogDetails from "../../pages/dashboards/announcement/DialogDetial";
import {
  CRATE_RECIPIENT_ANNOUCEMENTS,
  UPDATE_RECIPIENT_ANNOUNCEMENTS,
} from "../../pages/dashboards/announcement/apollo";
import useManageAnnouncement from "../../pages/dashboards/announcement/hooks/useQueryAnnouncement";
import useRecipient from "../../pages/dashboards/announcement/hooks/useRecipient";
import { errorMessage } from "../Alerts";

const Popover = styled(MuiPopover)`
  .MuiPaper-root {
    width: 300px;
    ${(props) => props.theme.shadows[1]};
    border: 1px solid ${(props) => props.theme.palette.divider};
  }
`;

const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${(props) => props.theme.header.indicator.background};
    color: ${(props) => props.theme.palette.common.white};
  }
`;

const Avatar = styled(MuiAvatar)`
  background: ${(props) => props.theme.palette.primary.main};
`;

const NotificationHeader = styled(Box)`
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",

    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: "''",
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));
const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));
const ListDateItem = styled(Typography)({
  position: "absolute",
  top: "2%",
  left: "80%",
  fontSize: "0.6rem",
  color: "rgba(0, 0, 0, 0.8)",
});
function NavbarNotificationsDropdown() {
  const { user } = useAuth();
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const manageAnnouncement = useManageAnnouncement();
  const manageRecipient = useRecipient();
  const [createRecipientAnnouncement] = useMutation(
    CRATE_RECIPIENT_ANNOUCEMENTS,
  );
  const [updateRecipentAnnouncement] = useMutation(
    UPDATE_RECIPIENT_ANNOUNCEMENTS,
  );
  const [read, setRead] = useState(false);
  const handleOpen = () => {
    handleCreateRecipentAnnouncemenst();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const closeRead = () => {
    setRead(false);
    setOpen(false);
  };

  const matchingCount = manageAnnouncement.data
    ?.filter((dataItem) => {
      return !manageRecipient.data?.some(
        (row) => row.announcementId._id === dataItem._id,
      );
    })
    .map((dataItem) => dataItem);

  const handleCreateRecipentAnnouncemenst = async () => {
    try {
      for (let i = 0; i < matchingCount.length; i++) {
        await createRecipientAnnouncement({
          variables: {
            input: {
              announcementId: parseInt(matchingCount[i]._id),
            },
          },
          onCompleted: () => {
            manageAnnouncement.customQueryPulishedAnnouncement();
            manageRecipient.customQueryRecipient();
          },
        });
      }
    } catch (error) {
      let cutErr = error.message?.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };

  const hadleUpdateRecipentAnnouncements = async (data) => {
    try {
      await updateRecipentAnnouncement({
        variables: {
          id: parseInt(data._id),
          input: {
            _id: parseInt(user?._id),
            announcementId: parseInt(data.announcementId._id),
            status: "read",
          },
        },
        onCompleted: () => {
          manageAnnouncement.customQueryPulishedAnnouncement();
          manageRecipient.customQueryRecipient();
        },
      });
    } catch (error) {
      let cutErr = error.message?.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  };
  const publishedCount = (manageRecipient?.data || []).filter(
    (item) => item.announcementId.status === "published",
  ).length;
  return (
    <React.Fragment>
      <Tooltip title="Announcements">
        <IconButton color="inherit" ref={ref} onClick={handleOpen} size="large">
          <Indicator badgeContent={matchingCount?.length}>
            <Bell />
          </Indicator>
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <NotificationHeader p={2}>
          <Typography variant="subtitle2" color="textPrimary">
            {publishedCount} New Notifications
          </Typography>
        </NotificationHeader>
        <React.Fragment>
          <List disablePadding sx={{ maxHeight: "500px" }}>
            {manageRecipient?.data?.map((item, index) => {
              if (item.announcementId.status === "published") {
                return (
                  <ListItem
                    key={index}
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setRead(true);
                      hadleUpdateRecipentAnnouncements(item);
                      manageRecipient.setDataForAnnountcement(item);
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: "30px" }}>
                      {item.status === "read" ? (
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          badgeContent={
                            <SmallAvatar
                              sx={{
                                "&.MuiAvatar-circular": {
                                  background: "#44b700",
                                  width: "16px",
                                  height: "16px",
                                },
                              }}
                            >
                              <BsCheck size="12" color="#fff" />
                            </SmallAvatar>
                          }
                        >
                          <TbSpeakerphone size="20" color="grey" />
                        </Badge>
                      ) : (
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                        >
                          <TbSpeakerphone size="20" color="grey" />
                        </StyledBadge>
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.announcementId?.title}
                      primaryTypographyProps={{
                        variant: "subtitle2",
                        color: "textPrimary",
                      }}
                    />
                    <ListDateItem>{DateOfNumber(item.createdAt)}</ListDateItem>
                  </ListItem>
                );
              }
            })}
          </List>
        </React.Fragment>
        {read && (
          <DialogDetails
            isOpen={read}
            onClose={closeRead}
            data={manageRecipient.dataForAnnountcement}
          />
        )}
      </Popover>
    </React.Fragment>
  );
}

export default NavbarNotificationsDropdown;
