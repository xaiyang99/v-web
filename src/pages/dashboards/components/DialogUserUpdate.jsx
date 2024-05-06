import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useLazyQuery, useMutation } from "@apollo/client";

// component
import * as MUI from "../../dashboards/css/user";
import profileImage from "../../../image/no_image.jpg";

import { QUERY_ROLES } from "../role&permission/apollo";

import { errorMessage, successMessage } from "../../../components/Alerts";

// material icon and component
import AddIcon from "@mui/icons-material/Add";
import { QUERY_USER_TYPE } from "../userType/apollo";
import { MUTATION_UPDATE_USER } from "../user/apollo";

export default function FormUserDialog(props) {
  const {
    open,
    onClose,
    onData,
    OriginalName,
    newName,
    userUpdate,
    userRefetch,
  } = props;
  const [name, setName] = React.useState(newName);
  const [file, setFile] = React.useState({});
  const [updateName, setUpdateName] = React.useState(OriginalName);
  const [preview, setPreview] = React.useState("");
  const [userUpdateData, setUserUpdateData] = React.useState([]);
  const [getUser_Type, { data: user_Type_data, refetch: user_typeRefetch }] =
    useLazyQuery(QUERY_USER_TYPE);
  const [getRole, { data: roleData, refetch: roleRefetch }] =
    useLazyQuery(QUERY_ROLES);
  const [updateUser] = useMutation(MUTATION_UPDATE_USER);
  const [role, setRole] = React.useState([]);
  const [listUserType, setListUserType] = React.useState([]);
  const [gender, setGender] = React.useState("");
  const preViewImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result);
    };
  };
  React.useEffect(() => {
    setName(newName);
    setUpdateName(OriginalName);
    setUserUpdateData({
      firstName: userUpdate?.firstName,
      lastName: userUpdate?.lastName,
      username: userUpdate?.username,
      email: userUpdate?.email,
      profile: userUpdate?.profile,
      userTypeName: userUpdate?.userTypeId?.name,
      userTypeId: userUpdate?.userTypeId?._id,
      roleName: userUpdate?.roleId?.name,
      roleId: userUpdate?.roleId?._id,
    });
    setGender(userUpdate?.gender);
  }, [newName, OriginalName, userUpdate, userRefetch]);

  const handleClose = () => {
    onClose(false);
  };

  const updateState = async () => {
    try {
      const updated = await updateUser({
        variables: {
          body: {
            firstName: userUpdateData?.firstName,
            lastName: userUpdateData?.lastName,
            username: userUpdateData?.username,
            userTypeId: userUpdateData?.userTypeId,
            roleId: userUpdateData?.roleId,
            profile: userUpdateData?.profile,
            gender: gender,
            email: userUpdateData?.email,
          },

          id: userUpdate?._id,
        },
      });

      if (updated?.data?.updateUser === true) {
        successMessage("Update User Success", 3000);
        onClose();
        userRefetch();
      }
    } catch (error) {
      errorMessage("Update User Failed!", 3000);
    }
  };

  // get user type
  React.useEffect(() => {
    const queryUserType = async () => {
      const userType = await getUser_Type({
        variables: {
          where: {
            status: "active",
          },
        },
      });
      if (userType) {
        setListUserType(userType?.data?.getUserType?.data);
      }
    };
    queryUserType();
    user_typeRefetch();
  }, [user_Type_data, getUser_Type]);

  // get role
  React.useEffect(() => {
    const queryRole = async () => {
      const roles = await getRole({
        variables: {
          where: {
            status: "active",
          },
        },
      });
      setRole(roles?.data?.getRole?.data);
    };
    queryRole();
    roleRefetch();
  }, [roleData]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        backdropFilter: "blur(1px) sepia(5%)",
        "& .MuiDialog-paper": {
          borderRadius: "8px",
        },
      }}
    >
      <DialogContent>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 3, mt: 3 }}>
          Update User Information
        </Typography>
        <Grid container spacing={4} sx={{ mt: 3 }}>
          <Grid item lg={8} md={8}>
            <Grid container spacing={2}>
              <Grid item lg={6} md={6}>
                <TextField
                  type="text"
                  name="firstName"
                  label="Enter First Name...."
                  fullWidth
                  value={userUpdateData?.firstName}
                  onChange={(e) =>
                    setUserUpdateData({
                      ...userUpdateData,
                      firstName: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item lg={6} md={6}>
                <TextField
                  type="text"
                  name="lastName"
                  label="Enter Last Name...."
                  fullWidth
                  my={2}
                  value={userUpdateData?.lastName}
                  onChange={(e) =>
                    setUserUpdateData({
                      ...userUpdateData,
                      lastName: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item lg={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Gender ....
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Select gender...."
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Others</MenuItem>
                  </Select>
                </FormControl>
                {gender && <Typography>{gender}</Typography>}
              </Grid>
              <Grid item lg={6} md={6}>
                <TextField
                  type="email"
                  name="email"
                  label="Enter Email...."
                  fullWidth
                  my={2}
                  value={userUpdateData?.email}
                  onChange={(e) =>
                    setUserUpdateData({
                      ...userUpdateData,
                      email: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item lg={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select User Type ....
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Select user type...."
                    value={userUpdateData?.userTypeId}
                    onChange={(e) =>
                      setUserUpdateData({
                        ...userUpdateData,
                        userTypeId: e.target.value,
                      })
                    }
                  >
                    {listUserType.map((option, key) => (
                      <MenuItem value={option._id} key={key}>
                        {option?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {userUpdateData?.userTypeName && (
                  <Typography>{userUpdateData?.userTypeName}</Typography>
                )}
              </Grid>
              <Grid item lg={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Role ....
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Select Role ...."
                    onChange={(e) =>
                      setUserUpdateData({
                        ...userUpdateData,
                        roleId: e.target.value,
                      })
                    }
                  >
                    {role?.map((item) => (
                      <MenuItem value={item?._id}>{item?.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {userUpdateData?.roleName && (
                  <Typography>{userUpdateData?.roleName}</Typography>
                )}
              </Grid>
              <Grid item lg={6} md={6}>
                <TextField
                  type="text"
                  label="Enter Username ...."
                  fullWidth
                  my={2}
                  value={userUpdateData?.username}
                  onChange={(e) =>
                    setUserUpdateData({
                      ...userUpdateData,
                      username: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={4} md={4}>
            <MUI.divShowPickImage>
              <MUI.divPreviewImage>
                {Object.keys(preview).length > 0 ? (
                  <img src={preview} alt="image" />
                ) : (
                  <img src={profileImage} alt="previewImage" />
                )}
              </MUI.divPreviewImage>
              <MUI.divShowPickerIcon>
                <Button
                  startIcon={<AddIcon />}
                  sx={{ cursor: "pointer" }}
                  component="label"
                >
                  Upload Image
                  <input
                    type="file"
                    name="image"
                    hidden
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      preViewImage(e.target.files[0]);
                    }}
                  />
                </Button>
              </MUI.divShowPickerIcon>
            </MUI.divShowPickImage>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 5, mb: 3 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          color="error"
          sx={{ borderRadius: "6px" }}
        >
          Cancel
        </Button>
        <Button
          onClick={updateState}
          variant="contained"
          color="secondaryTheme"
          sx={{ borderRadius: "6px" }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
