import axios from "axios";
import CryptoJS from "crypto-js";
import React from "react";
import * as MUI from "../../client-dashboard/css/accountStyle";

// component
import useAuth from "../../../hooks/useAuth";

// apollo
import { useLazyQuery, useMutation } from "@apollo/client";
import { MUTATION_UPDATE_STAFF_PROFILE, QUERY_STAFF_ACCOUNT } from "./apollo";

// material ui
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// functions
import { errorMessage, successMessage } from "../../../components/Alerts";
import { EventUploadTriggerContext } from "../../../contexts/EventUploadTriggerContext";
import { generateUniqueBase64 } from "../../../functions";
import my_profile_null from "../../client-dashboard/clound/icons/Icon_no_profile.svg";

function Profile() {
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [userAccount, setUserAccount] = React.useState({});
  const [files, setFiles] = React.useState(null);
  const [preview, setPreview] = React.useState("");
  const [fileNewName, setFileNewName] = React.useState(null);
  const eventUploadTrigger = React.useContext(EventUploadTriggerContext);
  const matchImage = ["image/png", "image/jpeg", "image/jpg"];
  const [selectedImageType, setSelectedImageType] = React.useState("");

  const BUNNY_URL = process.env.REACT_APP_BUNNY_URL;
  const STORAGE_ZONE = process.env.REACT_APP_STORAGE_ZONE;
  const ACCESS_KEY = process.env.REACT_APP_ACCESSKEY_BUNNY;
  const SECRET_KEY = process.env.REACT_APP_BUNNY_SECRET_KEY;

  const [updateStaffInfo] = useMutation(MUTATION_UPDATE_STAFF_PROFILE);
  const [queryStaffInfo, { refetch: staffRefetch }] = useLazyQuery(
    QUERY_STAFF_ACCOUNT,
    {
      fetchPolicy: "no-cache",
    },
  );

  function handleFile(e) {
    let file = e.target.files[0];
    if (file) {
      setSelectedImageType("image");
      let matchFileSize = 800 * 1024;
      if (matchImage.indexOf(file?.type) === -1) {
        errorMessage(
          "Format file is not valid, file support only jpg, jpeg, png",
          3000,
        );
      } else if (file.size > matchFileSize) {
        errorMessage(
          "File size is large more than 800 kb, Please select file again",
          2000,
        );
      } else {
        setFiles(file);
        preViewImage(file);
      }
    }
  }

  const handleQueryStaff = async () => {
    await queryStaffInfo({
      variables: {
        where: {
          _id: user?._id,
        },
      },
      onCompleted: (data) => {
        if (data?.queryStaffs?.data.length > 0) {
          setUserAccount(data?.queryStaffs?.data[0]);
          setFileNewName(data?.queryStaffs?.data[0]?.addProfile);
        }
      },
    });
  };

  const preViewImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result);
    };
  };

  const handleUpdateStaff = async () => {
    try {
      let profileName = generateUniqueBase64();
      const selectedFile =
        files && selectedImageType === "image" ? files : null;
      const selectedFileExtension = `.${selectedFile?.name?.split(".")?.pop()}`;

      const userData = await updateStaffInfo({
        variables: {
          data: {
            firstname: userAccount?.firstname,
            lastname: userAccount?.lastname,
            gender: userAccount?.gender,
            username: userAccount?.username,
            phone: userAccount?.phone,
            birthday: userAccount?.birthday,
            address: userAccount?.address,
            addProfile:
              selectedFile instanceof File
                ? profileName + selectedFileExtension
                : userAccount?.addProfile,
          },
          where: {
            _id: user?._id,
          },
        },
      });

      if (userData?.data?.updateStaff) {
        if (selectedFile instanceof File) {
          const url = `${userAccount?.newName}-${userAccount?._id}/${process.env.REACT_APP_ZONE_PROFILE}`;
          const headers = {
            REGION: "sg",
            BASE_HOSTNAME: "storage.bunnycdn.com",
            STORAGE_ZONE_NAME: STORAGE_ZONE,
            ACCESS_KEY: ACCESS_KEY,
            PATH: url,
            FILENAME: profileName + selectedFileExtension,
            PATH_FOR_THUMBNAIL:
              user.newName +
              "-" +
              user._id +
              "/" +
              process.env.REACT_APP_ZONE_PROFILE,
          };
          const secretKey = SECRET_KEY;
          const encryptedHeaders = CryptoJS.AES.encrypt(
            JSON.stringify(headers),
            secretKey,
          ).toString();
          const blob = new Blob([selectedFile], {
            type: selectedFile.type,
          });
          const newFile = new File([blob], selectedFile.name, {
            type: selectedFile.type,
          });
          const formData = new FormData();
          formData.append("file", newFile);
          const response = await axios.post(
            "https://load.vshare.net/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                encryptedHeaders,
              },
            },
          );

          // delete old profile from bunny
          if (response.status === 200) {
            setFiles(null);
            if (fileNewName) {
              const path = `${userAccount?.newName}-${userAccount?._id}/${process.env.REACT_APP_ZONE_PROFILE}`;
              const thumbnail_path = `${userAccount?.newName}-${userAccount?._id}/${process.env.REACT_APP_ZONE_PROFILE}`;
              handleDeletePreviousImage(path, fileNewName, thumbnail_path);
            }
          }
        }
        successMessage("Update profile success", 2000);
        staffRefetch();
        handleQueryStaff();
        eventUploadTrigger.trigger();
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      if (cutErr == "LOGIN_IS_REQUIRED") {
        errorMessage("Please login to continue!", 2000);
      } else if (cutErr == "PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS") {
        errorMessage("Password must be longer than 8 characters", 3000);
      } else {
        errorMessage("Something wrong please try again!", 2000);
      }
    }
  };

  const handleDeletePreviousImage = async (path, filename, thumbnail_path) => {
    try {
      const headers = {
        REGION: "sg",
        BASE_HOSTNAME: "storage.bunnycdn.com",
        STORAGE_ZONE_NAME: STORAGE_ZONE,
        ACCESS_KEY: ACCESS_KEY,
        PATH: path,
        FILENAME: filename,
        PATH_FOR_THUMBNAIL: thumbnail_path,
      };
      const encryptedHeaders = CryptoJS.AES.encrypt(
        JSON.stringify(headers),
        SECRET_KEY,
      ).toString();
      await axios.delete("https://load.vshare.net/delete", {
        headers: {
          "Content-Type": "multipart/form-data",
          encryptedHeaders,
        },
      });
    } catch (error) {
      errorMessage("Error deleting file:" + error, 3000);
    }
  };

  const handleReset = () => {
    setFiles(null);
    setPreview("");
  };

  React.useEffect(() => {
    handleQueryStaff();
  }, []);

  return (
    <React.Fragment>
      <MUI.PaperGlobal elevation={6}>
        <Typography variant={isMobile ? "h6" : "h4"} sx={{ color: "#5D596C" }}>
          Profile Details
        </Typography>
        <MUI.BoxShowAccountHeader>
          {Object.keys(preview)?.length > 0 ? (
            <img
              src={preview}
              alt="image"
              style={{
                objectFit: "fill",
                borderRadius: "8px",
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
              }}
            />
          ) : (
            <>
              {userAccount?.addProfile ? (
                <img
                  src={
                    process.env.REACT_APP_BUNNY_PULL_ZONE +
                    userAccount?.newName +
                    "-" +
                    userAccount?._id +
                    "/" +
                    process.env.REACT_APP_ZONE_PROFILE +
                    "/" +
                    userAccount?.addProfile
                  }
                  alt="addProfile"
                  style={{
                    objectFit: "fill",
                    borderRadius: "8px",
                    boxShadow:
                      "brgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                  }}
                />
              ) : (
                <img
                  src={my_profile_null}
                  alt="user_no_image"
                  style={{
                    objectFit: "fill",
                    borderRadius: "8px",
                    boxShadow:
                      "brgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                  }}
                />
              )}
            </>
          )}

          <MUI.BoxShowHeaderDetail>
            <MUI.BoxShowButtons>
              <MUI.ButtonUploadProfile
                component="label"
                variant="contained"
                color="primaryTheme"
              >
                Upload new photo
                <input type="file" name="image" hidden onChange={handleFile} />
              </MUI.ButtonUploadProfile>
              <MUI.ButtonReset onClick={handleReset}>Reset</MUI.ButtonReset>
            </MUI.BoxShowButtons>
            <Typography variant="h6">
              Allowed JPG, JPEG and PNG. Max sie of 800 k
            </Typography>
          </MUI.BoxShowHeaderDetail>
        </MUI.BoxShowAccountHeader>
        <Divider sx={{ margin: isMobile ? "1rem 0" : "2rem 0" }} />
        <MUI.BoxShowUserDetail>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <InputLabel
                shrink
                htmlFor="bootstrap-input"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  color: "#5D596C",
                  marginTop: "0.8rem",
                }}
              >
                First name
              </InputLabel>
              <FormControl fullWidth>
                <OutlinedInput
                  placeholder="Please enter text"
                  size="small"
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#5D596C",
                    padding: isMobile ? "0" : "0.2rem 0",
                  }}
                  value={userAccount?.firstname || ""}
                  onChange={(e) =>
                    setUserAccount({
                      ...userAccount,
                      firstname: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel
                shrink
                htmlFor="bootstrap-input"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  color: "#5D596C",
                  marginTop: "0.8rem",
                }}
              >
                Last name
              </InputLabel>
              <FormControl fullWidth>
                <OutlinedInput
                  placeholder="Please enter text"
                  size="small"
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#5D596C",
                    padding: isMobile ? "0" : "0.2rem 0",
                  }}
                  value={userAccount?.lastname || ""}
                  onChange={(e) =>
                    setUserAccount({
                      ...userAccount,
                      lastname: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel
                shrink
                htmlFor="bootstrap-input"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  color: "#5D596C",
                  marginTop: "0.8rem",
                }}
              >
                Email
              </InputLabel>
              <FormControl fullWidth>
                <OutlinedInput
                  placeholder="Please enter text"
                  size="small"
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#5D596C",
                    padding: isMobile ? "0" : "0.2rem 0",
                  }}
                  disabled={true}
                  value={userAccount?.email || ""}
                  onChange={(e) =>
                    setUserAccount({
                      ...userAccount,
                      email: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel
                shrink
                htmlFor="bootstrap-input"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  color: "#5D596C",
                  marginTop: "0.8rem",
                }}
              >
                Username
              </InputLabel>
              <FormControl fullWidth>
                <OutlinedInput
                  placeholder="Please enter text"
                  size="small"
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#5D596C",
                    padding: isMobile ? "0" : "0.2rem 0",
                  }}
                  value={userAccount?.username || ""}
                  onChange={(e) =>
                    setUserAccount({
                      ...userAccount,
                      username: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel
                shrink
                htmlFor="bootstrap-input"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  color: "#5D596C",
                  marginTop: "0.8rem",
                }}
              >
                Phone number
              </InputLabel>
              <FormControl fullWidth>
                <OutlinedInput
                  placeholder="Please enter text"
                  size="small"
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#5D596C",
                    padding: isMobile ? "0" : "0.2rem 0",
                  }}
                  value={userAccount?.phone || ""}
                  onChange={(e) =>
                    setUserAccount({
                      ...userAccount,
                      phone: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel
                shrink
                htmlFor="bootstrap-input"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  color: "#5D596C",
                  marginTop: "0.8rem",
                }}
              >
                Address
              </InputLabel>
              <FormControl fullWidth>
                <OutlinedInput
                  placeholder="Please enter text"
                  size="small"
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#5D596C",
                    padding: isMobile ? "0" : "0.2rem 0",
                  }}
                  value={userAccount?.address || ""}
                  onChange={(e) =>
                    setUserAccount({
                      ...userAccount,
                      address: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel
                shrink
                htmlFor="bootstrap-input"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                  color: "#5D596C",
                  marginTop: "0.8rem",
                }}
              >
                Position
              </InputLabel>
              <FormControl fullWidth>
                <OutlinedInput
                  placeholder="Please enter text"
                  size="small"
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#5D596C",
                    padding: isMobile ? "0" : "0.2rem 0",
                  }}
                  value={userAccount?.position || ""}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel
                shrink
                htmlFor="bootstrap-input"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  color: "#5D596C",
                  marginTop: "0.8rem",
                }}
              >
                Birthday
              </InputLabel>
              <FormControl fullWidth>
                <OutlinedInput
                  type="date"
                  placeholder="Please enter text"
                  size="small"
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#5D596C",
                    padding: isMobile ? "0" : "0.2rem 0",
                  }}
                  // value={DateOfNumberFormat(userAccount?.birthday) || ""}
                  value={userAccount?.birthday || ""}
                  onChange={(e) =>
                    setUserAccount({
                      ...userAccount,
                      birthday: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel
                shrink
                htmlFor="bootstrap-input"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  color: "#5D596C",
                  marginTop: "0.8rem",
                }}
              >
                Gender
              </InputLabel>
              <FormControl size="small" fullWidth>
                <Select
                  displayEmpty
                  value={userAccount?.gender || ""}
                  onChange={(e) =>
                    setUserAccount({
                      ...userAccount,
                      gender: e.target.value,
                    })
                  }
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: "500",
                    color: "#5D596C",
                    padding: isMobile ? "0" : "0.2rem 0",
                  }}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <InputLabel
                shrink
                htmlFor="bootstrap-input"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  color: "#5D596C",
                  marginTop: "0.8rem",
                }}
              >
                {/* Gender */}
              </InputLabel>
              <MUI.BoxShowActionButton>
                <Button
                  color="primaryTheme"
                  variant="contained"
                  sx={{
                    padding: isMobile ? "0.3rem 0.5rem" : "0.5rem 2rem",
                    fontSize: isMobile ? "0.8rem" : "",
                  }}
                  fullWidth={isMobile ? true : false}
                  onClick={handleUpdateStaff}
                >
                  Save Change
                </Button>
                <Button
                  color="greyTheme"
                  variant="contained"
                  sx={{
                    marginLeft: "1.5rem",
                    padding: isMobile ? "0.3rem 0.5rem" : "0.5rem 4rem",
                    fontSize: isMobile ? "0.8rem" : "",
                  }}
                  fullWidth={isMobile ? true : false}
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
              </MUI.BoxShowActionButton>
            </Grid>
          </Grid>
        </MUI.BoxShowUserDetail>
      </MUI.PaperGlobal>
    </React.Fragment>
  );
}

export default Profile;
