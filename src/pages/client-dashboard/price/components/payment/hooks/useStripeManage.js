import { useLazyQuery } from "@apollo/client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { paymentState } from "../../../../../../redux/slices/paymentSlice";
import { QUERY_PAYMENT } from "../../../apollo";

const useStripeManage = (id) => {
  const dispatch = useDispatch();
  const dataPayment = useSelector(paymentState);
  const [payment, { data: isPaymentId }] = useLazyQuery(QUERY_PAYMENT, {
    fetchPolicy: "no-cache",
  });

  const customQueryPayment = () => {};

  React.useEffect(() => {
    customQueryPayment();
  }, [dataPayment, dispatch, payment]);

  return {
    customQueryPayment,
    data: isPaymentId?.getPayments?.data[0]?._id || null,
  };
};
export default useStripeManage;
