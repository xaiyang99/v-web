import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_GET_COMPANIES } from "../apollo";

const useSelectCompanies = () => {
  const [getCompanies, { data: dataCompanies }] = useLazyQuery(
    QUERY_GET_COMPANIES,
    {
      fetchPolicy: "no-cache",
    }
  );

  const customGetCompanies = React.useCallback(() => {
    getCompanies();
  }, [getCompanies]);

  React.useEffect(() => {
    customGetCompanies();
  }, [customGetCompanies]);

  return {
    options: dataCompanies?.getPartner?.data?.map((data) => ({
      label: data.name,
      value: data._id,
    })),
  };
};

export default useSelectCompanies;
