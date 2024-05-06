import { useLazyQuery } from "@apollo/client";
import React from "react";
import { GET_STAFFS } from "../apollo";

const useManageStaffs = ({ filter }) => {
  const [getStaffs, { data: dataStaffs }] = useLazyQuery(GET_STAFFS, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);

  const customGetStaffs = React.useCallback(() => {
    const {
      pageLimit,
      role,
      firstName,
      currentPageNumber,
      status,
      country_name,
    } = filter;
    const skip = (currentPageNumber - 1) * pageLimit;

    getStaffs({
      variables: {
        orderby: "createdAt_DESC",
        limit: pageLimit,
        skip,
        where: {
          ...(status && {
            status: status,
          }),
          ...(country_name && {
            country: country_name,
          }),
          ...(role && {
            role,
          }),
          ...(firstName && {
            firstname: firstName,
          }),
        },
      },
    });
  }, [filter, getStaffs]);

  React.useEffect(() => {
    customGetStaffs();
  }, [filter, customGetStaffs]);

  return {
    selectedRow,
    setSelectedRow,
    getStaffs,
    customGetStaffs,
    data: dataStaffs?.queryStaffs?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: dataStaffs?.queryStaffs?.total,
  };
};

export default useManageStaffs;
