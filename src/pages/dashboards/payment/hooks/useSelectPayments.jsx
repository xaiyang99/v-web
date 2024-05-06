import { useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { QUERY_PAYMENTS_OPTIONS } from "../apollo";

const useSelectPayments = () => {
  const [getPayments, { data: dataPackages }] = useLazyQuery(
    QUERY_PAYMENTS_OPTIONS,
    {
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    getPayments({
      variables: {
        limit: 200,
      },
    });
  }, []);

  const data = React.useMemo(() => {
    return dataPackages?.getPayments?.data;
  }, [dataPackages]);

  return {
    getPayments,
    data,
    options:
      data?.map((data) => ({
        label: data.paymentId,
        value: data.paymentId,
      })) || [],
  };
};

export default useSelectPayments;
