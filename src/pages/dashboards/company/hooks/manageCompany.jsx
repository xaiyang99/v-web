import React from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_COMPANY } from "../apollo";

const useManageCompany = ({ filter }) => {
  const [getCompany, { data }] = useLazyQuery(QUERY_COMPANY, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);
  const { pageLimit, currentPageNumber, search } = filter;

  const customCompany = () => {
    const skip = (currentPageNumber - 1) * pageLimit;
    getCompany({
      variables: {
        orderBy: "createdAt_DESC",
        limit: pageLimit,
        skip,
        where: {
          ...(search && { name: search }),
        },
      },
    });
  };

  React.useEffect(() => {
    customCompany();
  }, [filter, getCompany]);

  return {
    selectedRow,
    setSelectedRow,
    getCompany,
    customCompany,
    data: data?.getPartner?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: data?.getPartner?.total,
  };
};

export default useManageCompany;
