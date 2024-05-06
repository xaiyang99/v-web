import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import NormalButton from "../../../../../components/NormalButton";
import { isValueOrNull } from "../../../../../functions";
import useAuth from "../../../../../hooks/useAuth";
import { setPaymentSteps } from "../../../../../redux/slices/paymentSlice";
import PackageDetails from "../PackageDetails";
import AddressForm from "../address/AddressForm";

const AddressContainer = styled("div")({});

const AddresFormWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: 32,
});

const PackageDetailsWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
});

const Address = (props) => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setPaymentSteps({
        number: 1,
        value: true,
      })
    );
  }, []);

  const formFields = useMemo(() => {
    return [
      {
        name: "first_name",
        label: "First Name",
        value: isValueOrNull(user.firstName),
        type: "text",
        readOnly: true,
      },
      {
        name: "last_name",
        label: "Last Name",
        value: isValueOrNull(user.lastName),
        type: "text",
        readOnly: true,
      },
      {
        name: "email",
        label: "Email",
        value: isValueOrNull(user.email),
        type: "text",
        readOnly: true,
      },
      {
        name: "tel",
        label: "Tel",
        value: isValueOrNull(user.phone),
        type: "text",
      },
      {
        name: "billing_country",
        label: "Biling Country",
        value: isValueOrNull(user.billCountry),
        type: "text",
      },
      {
        name: "billing_zip_postal_code",
        label: "Biling Zip/Postal Code",
        value: isValueOrNull(user.zipCode),
        type: "text",
      },
    ];
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...Object.assign(
        {},
        ...(formFields?.map((field) => {
          return {
            [field.name]: field.value || "",
          };
        }) || [])
      ),
    },
    onSubmit: (values) => props.onSubmit(values),
  });

  return (
    <AddressContainer>
      <Typography component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={5}>
          <Grid item md={9} sm={12} width={"100%"}>
            <AddresFormWrapper>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                }}
              >
                Select your preferable address
              </Typography>
              <AddressForm formFields={formFields} formik={formik} />
            </AddresFormWrapper>
          </Grid>
          <Grid item md={3} sm={12} width={"100%"}>
            <PackageDetailsWrapper>
              <PackageDetails isAddress />
              <NormalButton
                type="submit"
                sx={{
                  marginTop: 3,
                  width: "auto",
                  height: "35px",
                  padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
                  borderRadius: (theme) => theme.spacing(1),
                  backgroundColor: (theme) => theme.palette.primaryTheme.main,
                  textAlign: "center",
                  display: "block",
                  color: "white !important",
                }}
              >
                Next Payment
              </NormalButton>
            </PackageDetailsWrapper>
          </Grid>
        </Grid>
      </Typography>
    </AddressContainer>
  );
};

export default Address;
