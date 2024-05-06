import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_PAYMENTS } from "../apollo";

const useManageTransaction = () => {
  const [getPayments, { data: transactionData }] = useLazyQuery(
    QUERY_PAYMENTS,
    {
      fetchPolicy: "no-cache",
    }
  );

  const customTransactions = () => {
    getPayments({
      variables: {
        orderBy: "createdAt_DESC",
        limit: 10,
      },
    });
  };

  React.useEffect(() => {
    customTransactions();
  }, [getPayments]);

  const latestPayment =
    transactionData?.getPayments?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })) || [];

  return {
    getPayments,
    data: {
      latestPayment,
      stripePayment: latestPayment.filter(
        (data) => data.paymentMethod === "Stripe"
      ),
    },
    total: transactionData?.getPayments?.total,
  };
};

export default useManageTransaction;
