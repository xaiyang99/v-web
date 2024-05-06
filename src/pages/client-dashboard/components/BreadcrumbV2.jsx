import React from "react";

import { styled as muiStyled } from "@mui/system";
import {
  Typography,
  Stack,
  Breadcrumbs,
  Tooltip,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { FaAngleRight } from "react-icons/fa";
import { capitalizeFirstLetter } from "../../../functions";
import { FiFolder } from "react-icons/fi";
import NormalButton from "../../../components/NormalButton";

const BreadcrumbV2Container = muiStyled("div")({
  p: {
    height: "auto",
  },
});

const iconFolderStyled = (
  <FiFolder
    fill="white"
    style={{
      minWidth: "1rem",
    }}
  />
);

const BreadcrumbV2 = (props) => {
  const [breadcrumbData, setBreadcrumbData] = React.useState(null);
  const [menuDropdownData, setMenuDropdownData] = React.useState(null);

  /* menu dropdown */
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    let breadcrumbNewData = [];
    let menuDropdownNewData = [];
    if (props.path?.length > 2) {
      props.path?.forEach((item, index) => {
        const genNewItem = capitalizeFirstLetter(item);
        if (index === 0) {
          if (props.title) {
            breadcrumbNewData.push({
              name: "...",
              isDot: true,
            });
          } else {
            if (props.path?.length > 3) {
              breadcrumbNewData.push({
                name: "...",
                isDot: true,
              });
            } else {
              breadcrumbNewData.push({
                name: genNewItem,
                link: props.path.slice(0, index + 1).join("/"),
              });
            }
          }
        }
        if (index === props.path.length - 2) {
          breadcrumbNewData.push({
            name: genNewItem,
            link: props.path.slice(0, index + 1).join("/"),
          });
        }
        if (index === props.path.length - 1) {
          breadcrumbNewData.push({
            name: genNewItem,
            isFile: true,
          });
        }

        if (index < props.path.length - 2) {
          menuDropdownNewData.unshift({
            name: genNewItem,
            link: props.path.slice(0, index + 1).join("/"),
          });
        }
      });
    } else {
      breadcrumbNewData = [
        ...(props?.title ? [{ name: props?.title, isTitle: true }] : []),
        ...(props.path?.map((data, index) => ({
          name: data,
          ...(index !== props.path.length - 1 && {
            link: props.path.slice(0, index + 1).join("/"),
          }),
          ...(index === props.path.length - 1 && {
            isFile: true,
          }),
        })) || []),
      ];
    }
    if (props?.title) {
      menuDropdownNewData.push({
        name: props.title,
        isTitle: true,
      });
    }
    setBreadcrumbData(breadcrumbNewData);
    setMenuDropdownData(menuDropdownNewData);
  }, [props.path]);

  // const breadcrumbAllTextLength = breadcrumbData?.reduce(
  //   (currentValue, data) => currentValue + data.name.length,
  //   0
  // );

  return (
    <BreadcrumbV2Container
      sx={{
        maxWidth: "fit-content",
      }}
    >
      <Stack spacing={2}>
        <Breadcrumbs
          separator={<FaAngleRight />}
          aria-label="breadcrumb"
          sx={{
            "& .MuiBreadcrumbs-ol": {
              border: "1px solid #C9C8CF",
              padding: "2px 8px",
              borderRadius: "6px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flexWrap: "nowrap",
            },
            "& .MuiBreadcrumbs-li": {
              overflow: "hidden",
            },
          }}
        >
          {breadcrumbData?.map((data, index) => {
            return (
              <div
                key={index + 1}
                style={{
                  width: "100%",
                  columnGap: "3px",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                {data.isDot ? (
                  <React.Fragment>
                    <Button
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                      sx={{
                        fontSize: "0.8rem",
                        color: "black",
                        padding: "0 1px 0 1px",
                        maxWidth: "20px",
                        minWidth: "20px",
                        minHeight: "15px",
                        maxHeight: "15px",
                      }}
                    >
                      ...
                    </Button>
                    <Menu
                      sx={{}}
                      PaperProps={{
                        style: {
                          position: "relative",
                          width: "max-content",
                          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
                        },
                      }}
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      {menuDropdownData.map((data, index) => {
                        return (
                          <MenuItem
                            key={index}
                            sx={{
                              overflow: "hidden",
                              padding: 0,
                              flex: "1 1 0%",
                            }}
                          >
                            <NormalButton
                              {...{
                                ...(data.link && {
                                  onClick: () =>
                                    props.handleFolderNavigate(data.link),
                                }),
                              }}
                              style={{
                                columnGap: "4px",
                                alignItems: "center",
                                display: "flex",
                                ...(!data.link && {
                                  cursor: "default",
                                }),
                                padding: "6px 8px",
                              }}
                            >
                              {data.isTitle ? (
                                <span
                                  style={{ minWidth: "1rem", display: "flex" }}
                                >
                                  {props.mainIcon}
                                </span>
                              ) : (
                                <>{iconFolderStyled}</>
                              )}
                              {data.name}
                            </NormalButton>
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Tooltip
                      title={data.name}
                      placement="bottom"
                      PopperProps={{
                        sx: {
                          zIndex: 9999999999999,
                        },
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          width: "100%",
                          alignItems: "center",
                          columnGap: "4px",
                          ...(data.isFile
                            ? {
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }
                            : {
                                display: "flex",
                              }),
                        }}
                        whiteSpace="nowrap"
                        color="black"
                        fontSize={"0.8rem"}
                      >
                        {data.link ? (
                          <NormalButton
                            onClick={() =>
                              props.handleFolderNavigate(data.link)
                            }
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              columnGap: "4px",
                              lineHeight: 1.5,
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                              },
                            }}
                          >
                            {data.isTitle ? (
                              <span
                                style={{ minWidth: "1rem", display: "flex" }}
                              >
                                {props.mainIcon}
                              </span>
                            ) : (
                              <>{!data.isFile && iconFolderStyled}</>
                            )}
                            <span
                              style={{
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {data.name}
                            </span>
                          </NormalButton>
                        ) : (
                          <>
                            {data.isTitle ? (
                              <span
                                style={{ minWidth: "1rem", display: "flex" }}
                              >
                                {props.mainIcon}
                              </span>
                            ) : (
                              <>{!data.isFile && iconFolderStyled}</>
                            )}
                            <span
                              style={{
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {data.name}
                            </span>
                          </>
                        )}
                      </Typography>
                    </Tooltip>
                  </React.Fragment>
                )}
              </div>
            );
          })}
        </Breadcrumbs>
      </Stack>
    </BreadcrumbV2Container>
  );
};

export default BreadcrumbV2;
