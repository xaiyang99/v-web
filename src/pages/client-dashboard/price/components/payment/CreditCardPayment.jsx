import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import { useMemo } from "react";
import CustomFormBody from "../../../../dashboards/components/CustomFormBody";

const CreditCardPaymentContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: 12,
}));

const CreditCardPayment = () => {
  const formFields = useMemo(() => {
    return [
      {
        name: "card_number",
        label: "Card number",
        value: "",
        type: "credit_card_number",
        gridColumn: "span 12",
      },
      {
        name: "name",
        label: "Name",
        value: "",
        type: "text",
        gridColumn: "span 8",
      },
      {
        name: "exp_date",
        label: "Exp. Date",
        value: "",
        type: "credit_card_exp_date",
        gridColumn: "span 2",
        placeholder: "MM/YY",
      },
      {
        name: "cvv_code",
        label: "CVV Code",
        value: "",
        type: "credit_card_cvv_code",
        gridColumn: "span 2",
        placeholder: "456",
      },
    ];
  }, []);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {},
    onSubmit: (values) => {},
  });
  return (
    <CreditCardPaymentContainer>
      <Typography component="form" onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: "grid",
            color: (theme) => theme.palette.primaryTheme.brown(),
          }}
          gridTemplateColumns="repeat(12, 1fr)"
          gap={4}
        >
          <CustomFormBody formFields={formFields} formik={formik} />
        </Box>
      </Typography>
    </CreditCardPaymentContainer>
  );
};

export default CreditCardPayment;
