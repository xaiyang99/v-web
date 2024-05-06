import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_PACKAGE } from "../apollo";

const useManagePackage = (props) => {
  const [selectedRow, setSelectedRow] = useState([]);
  const { filter } = props;
  const [getPackages, { data: isData }] = useLazyQuery(QUERY_PACKAGE, {
    fetchPolicy: "no-cache",
  });

  const { search, currentPageNumber, pageLimit } = filter;

  const customPackage = () => {
    const skip = (currentPageNumber - 1) * pageLimit;
    getPackages({
      variables: {
        skip,
        limit: pageLimit,
        where: {
          ...(search && { name: search }),
        },
      },
    });
  };

  useEffect(() => {
    customPackage();
  }, [filter, getPackages]);

  return {
    selectedRow,
    data: isData?.getPackages?.data?.map((values, index) => ({
      ...values,
      index: index + 1,
    })),
    total: isData?.getPackages?.total,

    setSelectedRow,
    getPackages,
    customPackage,
  };
};

export default useManagePackage;
