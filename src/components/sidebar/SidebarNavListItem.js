import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

import { Chip, Collapse, ListItemButton, ListItemText } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { capitalizeFirstLetter } from "../../functions";
// eslint-disable-next-line react/display-name
const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref}>
    <NavLink {...props} />
  </div>
));

const Item = styled(ListItemButton)`
  color: ${(props) => props.theme.sidebar.color};
  padding-top: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 2 : 3)};
  padding-bottom: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 2 : 3)};
  padding-left: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 8 : 8)};
  padding-right: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 4 : 7)};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  svg {
    font-size: 20px;
    width: 20px;
    height: 20px;
    color: "#FFF";
  }
  &:hover {
    opacity: 1;
  }
`;

const Title = styled(ListItemText)`
  margin: 0;
  span {
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
    font-weight: ${(props) => props.theme.typography.fontWeightBold};
    padding: 0 ${(props) => props.theme.spacing(4)};
    color: ${(props) => props.theme.sidebar.color};
  }
`;

const Badge = styled(Chip)`
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  height: 20px;
  position: absolute;
  right: 26px;
  top: 12px;
  background: ${(props) => props.theme.sidebar.badge.background};
  z-index: 1;
  span.MuiChip-label,
  span.MuiChip-label:hover {
    font-size: 11px;
    cursor: pointer;
    color: ${(props) => props.theme.sidebar.badge.color};
    padding-left: ${(props) => props.theme.spacing(2)};
    padding-right: ${(props) => props.theme.spacing(2)};
  }
`;

const DotLayout = styled("div")({
  width: "20px",
  minWidth: "20px",
  height: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const Dot = styled("div")({
  width: "7px",
  height: "7px",
  border: `1px solid ${(props) => props.theme.sidebar.color}`,
  borderRadius: "50%",
});

const ExpandLessIcon = styled(KeyboardArrowDown)``;

const ExpandMoreIcon = styled(KeyboardArrowRight)``;

const SidebarNavListItem = (props) => {
  const {
    title,
    href,
    depth = 0,
    children,
    icon: Icon,
    badge,
    open: openProp = false,
  } = props;

  const [open, setOpen] = React.useState(openProp);
  const handleToggle = () => {
    setOpen((state) => !state);
  };
  if (children) {
    return (
      <React.Fragment>
        {props.permission && props.permission !== undefined && (
          <Item depth={depth} onClick={handleToggle}>
            {Icon && <Icon />}
            <Title depth={depth}>
              {capitalizeFirstLetter(title)}
              {badge && <Badge label={badge} />}
            </Title>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Item>
        )}

        <Collapse in={open}>{children}</Collapse>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {props.permission && props.permission !== undefined && (
        <Item
          depth={depth}
          component={CustomRouterLink}
          to={href}
          activeclassname="active"
        >
          {depth > 0 && (
            <DotLayout>
              <Dot />
            </DotLayout>
          )}
          {Icon && <Icon />}
          <Title depth={depth}>
            {capitalizeFirstLetter(title)}
            {badge && <Badge label={badge} />}
          </Title>
        </Item>
      )}
    </React.Fragment>
  );
};

export default SidebarNavListItem;
