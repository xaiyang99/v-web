import { useLazyQuery } from "@apollo/client";
import React, { useCallback } from "react";
import { GET_COUNTRIES } from "../apollo";

const useSelectCountries = () => {
  const [getCountries, { data: dataCountries }] = useLazyQuery(GET_COUNTRIES, {
    fetchPolicy: "no-cache",
  });

  const customGetCountries = useCallback(() => {
    getCountries();
  }, [getCountries]);

  React.useEffect(() => {
    customGetCountries();
  }, [customGetCountries]);

  const options = React.useMemo(() => {
    if (!dataCountries?.getCountries?.data) {
      return [];
    }

    return dataCountries.getCountries.data.map((data) => ({
      label: data.name,
      value: data.name,
    }));
  }, [dataCountries]);

  return {
    options,
  };
};

export default useSelectCountries;
