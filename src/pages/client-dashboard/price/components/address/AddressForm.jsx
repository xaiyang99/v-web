import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import CustomFormBody from "../../../../dashboards/components/CustomFormBody";

const AddressFormContainer = styled("div")({});

const AddressForm = (props) => {
  return (
    <AddressFormContainer>
      <Box
        sx={{
          display: "grid",
          color: (theme) => theme.palette.primaryTheme.brown(),
        }}
        gridTemplateColumns="repeat(12, 1fr)"
        gap={4}
      >
        <CustomFormBody formFields={props.formFields} formik={props.formik} />
      </Box>
    </AddressFormContainer>
  );
};

export default AddressForm;
