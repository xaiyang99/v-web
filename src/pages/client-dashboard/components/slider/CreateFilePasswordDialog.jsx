import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import DialogV1 from "../../../../components/DialogV1";
import {
  Box,
  Button,
  TextField,
  Typography,
  createTheme,
  styled,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useMutation } from "@apollo/client";
import { UPDATE_FILES } from "../../../dashboards/manageFile/apollo";
import { errorMessage, successMessage } from "../../../../components/Alerts";
import { UPADATE_FOLDERS } from "../../folder/apollo/folder";
import { GetFileType, handleGraphqlErrors } from "../../../../functions";
import { FileIcon, defaultStyles } from "react-file-icon";
import CryptoJS from "crypto-js";

const theme = createTheme();

const HeaderPasswordContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  // justifyContent: "center",
  gap: "1rem",
  marginBottom: "0.5rem",
});

const HeaderTitle = styled("div")({
  display: "flex",
  alignItems: "center",
  maxWidth: "100%",
  h2: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",

    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8rem",
    },
  },
});

const HeaderForm = styled(Box)({
  margin: "0.5rem 0",
});

const FormInput = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
});

const FormLabel = styled("label")({
  display: "block",
  marginBottom: 1,
  fontSize: "0.9rem",
});

const FormAction = styled("div")({
  paddingTop: 10,
  marginTop: "1rem",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  justifyContent: "center",

  [theme.breakpoints.down("sm")]: {
    marginTop: "0.5rem",
  },
});

function CreateFilePasswordDialog(props) {
  const [isAction, setIsAction] = useState(false);
  const [lockPassword, setLockPassword] = useState("");
  const { dataValue, onClose, onConfirm, filename, checkType, isUpdate } =
    props;
  const [updateFile] = useMutation(UPDATE_FILES);
  const [updateFolder] = useMutation(UPADATE_FOLDERS);

  async function handleUpdateFile() {
    if (!lockPassword) {
      return;
    }

    let genCodePassword = CryptoJS.MD5(lockPassword).toString();

    if (checkType === "folder") {
      try {
        const result = await updateFolder({
          variables: {
            data: {
              access_password: lockPassword,
            },

            where: {
              _id: dataValue?._id,
            },
          },
        });

        if (result.data?.updateFolders?._id) {
          successMessage("Update folder successfully", 2000);
          onConfirm();
          handleCloseForm();
        }
      } catch (error) {
        let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
        errorMessage(
          handleGraphqlErrors(
            cutErr || "Something went wrong, Please try again",
          ),
          3000,
        );
      }
    } else {
      try {
        const result = await updateFile({
          variables: {
            data: {
              filePassword: genCodePassword,
            },

            where: {
              _id: dataValue?._id,
            },
          },
        });

        if (result.data?.updateFiles?._id) {
          successMessage("Update file successfully", 2000);
          handleCloseForm();
          onConfirm();
        }
      } catch (error) {
        let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
        errorMessage(
          handleGraphqlErrors(
            cutErr || "Something went wrong, Please try again",
          ),
          3000,
        );
      }
    }
  }

  async function removePassword() {
    if (checkType === "folder") {
      try {
        const result = await updateFolder({
          variables: {
            data: {
              access_password: "",
            },

            where: {
              _id: dataValue?._id,
            },
          },
        });

        if (result.data?.updateFolders?._id) {
          successMessage("Remove folder password successfully", 2000);
          onConfirm();
          handleCloseForm();
        }
      } catch (error) {
        let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
        errorMessage(
          handleGraphqlErrors(
            cutErr || "Something went wrong, Please try again",
          ),
          3000,
        );
      }
    } else {
      try {
        const result = await updateFile({
          variables: {
            data: {
              filePassword: "",
            },
            where: {
              _id: dataValue?._id,
            },
          },
        });

        if (result.data?.updateFiles?._id) {
          successMessage("Remove file successfully", 2000);
          handleCloseForm();
          onConfirm();
        }
      } catch (error) {
        let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
        errorMessage(
          handleGraphqlErrors(
            cutErr || "Something went wrong, Please try again",
          ),
          3000,
        );
      }
    }
  }

  const generateMainPassword = () => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setIsAction(true);
    setLockPassword(password);
  };

  function clearGenerate() {
    setIsAction(false);
    setLockPassword("");
  }

  function handleCloseForm() {
    clearGenerate();
    onClose();
  }

  useEffect(() => {}, [dataValue]);

  return (
    <Fragment>
      <DialogV1
        {...props}
        dialogProps={{
          PaperProps: {
            sx: {
              overflowY: "initial",
              maxWidth: "480px",
            },
          },
        }}
        dialogContentProps={{
          padding: "20px",
          sx: {
            backgroundColor: "white !important",
            borderRadius: "6px",
            padding: 0,
          },
        }}
        onClose={handleCloseForm}
      >
        <Box sx={{ padding: 10 }}>
          <HeaderPasswordContainer>
            {/* <FiLock /> */}
            <HeaderTitle>
              {checkType === "file" && (
                <Box sx={{ width: "30px", mr: 3 }}>
                  <FileIcon
                    extension={GetFileType(dataValue?.newFilename)}
                    {...defaultStyles[GetFileType(dataValue?.newFilename)]}
                  />
                </Box>
              )}
              <Typography variant="h2">{filename}</Typography>
            </HeaderTitle>
          </HeaderPasswordContainer>

          <HeaderForm>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateFile();
              }}
            >
              <FormLabel htmlFor="passwordLink">
                {/* <FiShare2
                        style={{
                          marginRight: "8",
                        }}
                      /> */}
                {isUpdate ? "Change password" : "Link password"}
              </FormLabel>
              <FormInput>
                <TextField
                  id="passwordLink"
                  type="text"
                  placeholder="Password"
                  fullWidth={true}
                  size="small"
                  onChange={(e) => setLockPassword(e.target.value)}
                  value={lockPassword}
                />

                {isAction ? (
                  <LockIcon
                    sx={{
                      fontSize: "18px",
                      cursor: "pointer",
                      color: "#17766B",
                    }}
                    onClick={clearGenerate}
                  />
                ) : (
                  <LockOpenIcon
                    sx={{ fontSize: "18px", cursor: "pointer" }}
                    onClick={generateMainPassword}
                  />
                )}
              </FormInput>

              <FormAction>
                {isUpdate && (
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    onClick={removePassword}
                  >
                    Remove password
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={lockPassword ? false : true}
                >
                  {isUpdate ? "Update password" : "Create password"}
                </Button>
              </FormAction>
            </form>
          </HeaderForm>
        </Box>
      </DialogV1>
    </Fragment>
  );
}

export default CreateFilePasswordDialog;
