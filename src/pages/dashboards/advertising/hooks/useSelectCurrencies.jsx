import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_GET_CURRENCIES } from "../apollo";

const useSelectCurrencies = () => {
  const [getCurrencies, { data: dataCurrencies }] = useLazyQuery(
    QUERY_GET_CURRENCIES,
    {
      fetchPolicy: "no-cache",
    }
  );

  const customGetCurrencies = React.useCallback(() => {
    getCurrencies();
  }, [getCurrencies]);

  React.useEffect(() => {
    customGetCurrencies();
  }, [customGetCurrencies]);

  return {
    options: dataCurrencies?.getCurrency?.data?.map((data) => ({
      label: data.name,
      value: data._id,
    })),
  };
};

export default useSelectCurrencies;
