import { useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { QUERY_PACKAGES_OPTIONS } from "../apollo";

const useSelectPackageForInvoices = () => {
  const [getPackages, { data: dataPackages, refetch }] = useLazyQuery(
    QUERY_PACKAGES_OPTIONS,
    {
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    getPackages();
  }, []);

  const data = React.useMemo(() => {
    return dataPackages?.getPackage?.data;
  }, [dataPackages]);

  return {
    getPackages,
    data,
    options:
      data?.map((data) => ({
        label: data.name,
        value: data.packageId,
      })) || [],
  };
};

export default useSelectPackageForInvoices;
