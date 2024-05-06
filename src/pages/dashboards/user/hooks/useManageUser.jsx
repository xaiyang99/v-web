import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_USERS } from "../apollo";

const useManageUser = ({ filter }) => {
  const [getUsers, { data: userData }] = useLazyQuery(QUERY_USERS, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);
  const { pageLimit, status, username, currentPageNumber, createdAt } = filter;

  const customUsers = () => {
    const skip = (currentPageNumber - 1) * pageLimit;

    getUsers({
      variables: {
        orderBy: "createdAt_DESC",
        limit: pageLimit,
        skip,
        where: {
          ...(status && {
            status,
          }),
          ...(username && {
            firstName: username,
          }),
          ...(createdAt.startDate &&
            createdAt.endDate && {
              createdAtBetween: [createdAt.startDate, createdAt.endDate],
            }),
        },
      },
    });
  };

  React.useEffect(() => {
    customUsers();
  }, [filter, getUsers]);

  return {
    selectedRow,
    setSelectedRow,
    getUsers,
    customUsers,
    data: userData?.getUser?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: userData?.getUser?.total,
  };
};

export default useManageUser;
