import { Box } from "@mui/material";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";

import { useMutation } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SETTING_KEYS } from "../../../../../constants";
import useAuth from "../../../../../hooks/useAuth";
import {
  PACKAGE_TYPE,
  paymentState,
  setActiveStep,
  setPaymentStatus,
  setRecentPayment,
} from "../../../../../redux/slices/paymentSlice";
import useManageSetting from "../../../../dashboards/settings/hooks/useManageSetting";
import { MUTATION_CHECKOUT, MUTATION_CREATE_PAYMENT } from "../../apollo";

const CheckoutForm = () => {
  const dataSetting = useManageSetting();
  const [stripePublicKey, setStripePublicKey] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const dispatch = useDispatch();
  const paymentSelector = useSelector(paymentState);
  const { user, generateNewToken } = useAuth();
  const [createCheckout] = useMutation(MUTATION_CHECKOUT, {
    fetchPolicy: "no-cache",
  });
  const [createPayment] = useMutation(MUTATION_CREATE_PAYMENT, {
    fetchPolicy: "no-cache",
  });

  const stripePromise = loadStripe(stripePublicKey);

  useEffect(() => {
    if (dataSetting.data?.length > 0) {
      const stripePublicKeyDataSetting = dataSetting.data?.find(
        (data) => data?.productKey === SETTING_KEYS.PUBLIC_STRIPE,
      );
      if (stripePublicKeyDataSetting) {
        setStripePublicKey(stripePublicKeyDataSetting.action);
      }
    }
  }, [dataSetting.data]);

  const handleComplete = (res) => {
    createPayment({
      variables: {
        input: {
          type: paymentSelector.activePackageType,
          packageId: paymentSelector.activePackageData.packageId,
          amount:
            paymentSelector.activePackageType === PACKAGE_TYPE.annual
              ? paymentSelector.activePackageData.annualPrice
              : paymentSelector.activePackageData.monthlyPrice,
          payerId: user._id,
          paymentMethod: "stripe",
          couponCode: null,
          status: "success",
        },
      },
      onCompleted: (data) => {
        dispatch(setPaymentStatus("success"));
        generateNewToken();
        dispatch(setRecentPayment(data.createPayment));
        dispatch(setActiveStep(3));
      },
    });
  };

  useEffect(() => {
    createCheckout({
      variables: {
        input: {
          packageId: paymentSelector.activePackageData.packageId,
          payerId: user._id,
        },
      },
      onCompleted: (data) => {
        setClientSecret(data.checkout.secret);
        dispatch(setPaymentStatus("processing"));
      },
    });
  }, []);

  return (
    <>
      {stripePublicKey && (
        <Box id="checkout">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{
              clientSecret: clientSecret,
              onComplete: handleComplete,
            }}
          >
            <EmbeddedCheckout className="embedded-checkout" />
          </EmbeddedCheckoutProvider>
        </Box>
      )}
    </>
  );
};

const StripePayment = () => {
  return <CheckoutForm />;
};

export default StripePayment;
