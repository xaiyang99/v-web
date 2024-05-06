import React, { useEffect, useState } from "react";
import styled from "@emotion/styled/macro";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useLocation, useParams } from "react-router-dom";
import { Base64 } from "js-base64";

//style
import { BreadcrumbExtendFolderContainer } from "./css/breadcrumbStyle";

const Breadcrumb = (props) => {
  const location = useLocation();
  const params = useParams();
  const [pathSegments, setPathSegments] = useState([]);
  const [breadcrumbState, setBreadcrumbState] = useState([]);
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      MUI
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href="/material-ui/getting-started/installation/"
    >
      Core
    </Link>,
    <Typography key="3" color="text.primary">
      Breadcrumb
    </Typography>,
  ];
  useEffect(() => {
    if (props.data?.length > 0) {
      setPathSegments((_) => {
        const { path, url } = location.state || props.data[0];
        const pathSegments = path?.split("/");
        const base_path = location.pathname.slice(
          0,
          location.pathname.lastIndexOf("/")
        );
        const result = pathSegments.map((data, index) => {
          return {
            name: data,
            link: [base_path, url].join("/"),
            ...(index === pathSegments.length && {
              isLast: true,
            }),
          };
        });
        result.unshift({ name: props.home || "My-folder", link: base_path });
        return result;
      });
    }
  }, [location, props.data]);

  return (
    <BreadcrumbExtendFolderContainer>
      <Stack spacing={props.spacing || 2}>
        <Breadcrumbs separator={props.separator || ">"} aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
    </BreadcrumbExtendFolderContainer>
  );
};

export default Breadcrumb;
