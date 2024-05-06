import { useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { QUERY_CUSTOMERS } from "../apollo";

const useSelectCustomers = () => {
  const [getCustomers, { data: dataCustomers }] = useLazyQuery(
    QUERY_CUSTOMERS,
    {
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    getCustomers();
  }, []);

  const data = React.useMemo(() => {
    return dataCustomers?.getCustomer?.data;
  }, [dataCustomers]);

  return {
    getCustomers,
    data,
    options:
      data?.map((data) => ({
        label: `${data.firstName} ${data.lastName}`,
        value: data._id,
      })) || [],
  };
};

export default useSelectCustomers;
