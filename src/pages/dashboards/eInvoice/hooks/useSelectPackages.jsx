import { useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { QUERY_PACKAGES_OPTIONS } from "../apollo";

const useSelectPackages = () => {
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
    return _.uniqBy(dataPackages?.getPackage?.data, "name");
  }, [dataPackages]);

  return {
    getPackages,
    data,
    options:
      data?.map((data) => ({
        label: data.name,
        value: data.name,
      })) || [],
  };
};

export default useSelectPackages;
