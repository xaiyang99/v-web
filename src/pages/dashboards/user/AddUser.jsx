import React, { useState } from "react";
import * as Yup from "yup";
import * as MUI from "../css/user";
import { Formik } from "formik";

// component
import Banner from "../components/Banner";
import profileImage from "../../../image/no_image.jpg";

// material icon and component
import SaveIcon from "@mui/icons-material/Save";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useLazyQuery, useMutation } from "@apollo/client";
import { QUERY_USER_TYPE } from "../userType/apollo";
import { QUERY_ROLES } from "../role&permission/apollo";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { useNavigate } from "react-router-dom";
import { MUTATION_CREATE_USER } from "./apollo";

function AddUser() {
  const naviage = useNavigate();
  const [preview, setPreview] = React.useState("");
  const [createUser] = useMutation(MUTATION_CREATE_USER);
  const [getUser_Type, { data: user_Type_data, refetch: user_typeRefetch }] =
    useLazyQuery(QUERY_USER_TYPE);
  const [getRole, { data: roleData, refetch: roleRefetch }] =
    useLazyQuery(QUERY_ROLES);
  const [role, setRole] = React.useState([]);
  const [listUserType, setListUserType] = useState([]);

  const preViewImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result);
    };
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

  // initial value
  const initialValues = {
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    usertype: "",
    role: "",
    username: "",
    password: "",
  };

  const handleCreateUser = async (
    firstName,
    lastName,
    gender,
    email,
    usertype,
    role,
    username,
    password
  ) => {
    try {
      const variables = {
        body: {
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          password: password,
          gender: gender,
          userTypeId: usertype,
          status: "active",
          roleId: role,
        },
      };
      const result = await createUser({ variables });
      if (result?.data?.createUser?._id) {
        successMessage("Add new user success !", 3000);
        roleRefetch();
        initialValues();
      }
    } catch (error) {
      if (error?.message === "Error: Password must be at least 8 characters") {
        errorMessage(`${error?.message}`, 3000);
      } else if (error?.message === "Error: Duplicate entry") {
        errorMessage("User already exists!", 3000);
      }
    }
  };
  return (
    <React.Fragment>
      <Container maxWidth="xl">
        <Banner />
        <h2>Add new user</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            firstName: Yup.string().max(255).required("Firstname is required"),
            lastName: Yup.string().max(255).required("Lastname is required"),
            gender: Yup.string().max(255).required("Gender is required"),
            email: Yup.string().max(255).required("Email is required"),
            usertype: Yup.string().max(255).required("User type is required"),
            role: Yup.string().max(255).required("Role type is required"),
            username: Yup.string()
              .max(255)
              .required("Username type is required"),
            password: Yup.string()
              .max(255)
              .required("Password type is required"),
          })}
          onSubmit={async (values, { setErrors, setStatus }) => {
            try {
              await handleCreateUser(
                values.firstName,
                values.lastName,
                values.gender,
                values.email,
                values.usertype,
                values.role,
                values.username,
                values.password
              );
            } catch (error) {
              const message = error.message || "Something went wrong";
              setStatus({ success: false });
              setErrors({ submit: message });
            }
          }}
        >
          {({ errors, handleChange, handleSubmit, touched, values }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item lg={8} md={8}>
                  <Grid container spacing={2}>
                    <Grid item lg={6} md={6}>
                      <TextField
                        type="text"
                        name="firstName"
                        label="Enter First Name...."
                        error={Boolean(touched.firstName && errors.firstName)}
                        fullWidth
                        helperText={touched.firstName && errors.firstName}
                        value={values.firstName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item lg={6} md={6}>
                      <TextField
                        type="text"
                        name="lastName"
                        label="Enter Last Name...."
                        error={Boolean(touched.lastName && errors.lastName)}
                        fullWidth
                        helperText={touched.lastName && errors.lastName}
                        value={values.lastName}
                        onChange={handleChange}
                        my={2}
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
                          error={Boolean(touched.gender && errors.gender)}
                          helperText={touched.gender && errors.gender}
                          name="gender"
                          value={values.gender}
                          label="Select gender...."
                          onChange={handleChange}
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Others</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6}>
                      <TextField
                        type="email"
                        name="email"
                        label="Enter Email...."
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        helperText={touched.email && errors.email}
                        value={values.email}
                        onChange={handleChange}
                        my={2}
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
                          error={Boolean(touched.usertype && errors.usertype)}
                          name="usertype"
                          value={values.usertype}
                          label="Select user type...."
                          onChange={handleChange}
                        >
                          {listUserType.map((option, index) => (
                            <MenuItem key={index} value={option._id}>
                              {option?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Select Role ....
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          error={Boolean(touched.role && errors.role)}
                          name="role"
                          value={values.role}
                          label="Select Role ...."
                          onChange={handleChange}
                        >
                          {role.map((item) => (
                            <MenuItem key={item._id} value={item?._id}>
                              {item?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6}>
                      <TextField
                        type="text"
                        name="username"
                        label="Enter Username ...."
                        error={Boolean(touched.username && errors.username)}
                        fullWidth
                        helperText={touched.username && errors.username}
                        value={values.username}
                        onChange={handleChange}
                        my={2}
                      />
                    </Grid>
                    <Grid item lg={6} md={6}>
                      <TextField
                        type="password"
                        name="password"
                        label="Enter Password ...."
                        error={Boolean(touched.password && errors.password)}
                        fullWidth
                        helperText={touched.password && errors.password}
                        value={values.password}
                        onChange={handleChange}
                        my={2}
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
                            preViewImage(e.target.files[0]);
                          }}
                        />
                      </Button>
                    </MUI.divShowPickerIcon>
                  </MUI.divShowPickImage>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                type="button"
                startIcon={<KeyboardBackspaceIcon />}
                color="error"
                sx={{ marginTop: "1rem", borderRadius: "6px" }}
                onClick={() => naviage("/dashboard/user")}
              >
                ກັບຄືນ
              </Button>
              &nbsp;&nbsp;
              <Button
                variant="contained"
                type="submit"
                startIcon={<SaveIcon />}
                color="primaryTheme"
                sx={{ marginTop: "1rem", borderRadius: "6px" }}
              >
                ບັນທຶກ
              </Button>
            </form>
          )}
        </Formik>
      </Container>
    </React.Fragment>
  );
}
export default AddUser;
