import { useLazyQuery } from "@apollo/client";
import React from "react";
import { GET_ROLES } from "../apollo";

const useManageRoles = ({ filter }) => {
  const [getRoles, { data: dataRoles }] = useLazyQuery(GET_ROLES, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);

  const customGetRoles = React.useCallback(() => {
    const { pageLimit, name, currentPageNumber } = filter;
    const skip = (currentPageNumber - 1) * pageLimit;

    getRoles({
      variables: {
        orderby: "createdAt_DESC",
        limit: pageLimit,
        skip,
        where: {
          ...(name && {
            name,
          }),
        },
      },
    });
  }, [filter, getRoles]);

  React.useEffect(() => {
    customGetRoles();
  }, [filter, customGetRoles]);

  return {
    selectedRow,
    setSelectedRow,
    getRoles,
    customGetRoles,
    data: dataRoles?.role_staffs?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: dataRoles?.role_staffs?.total,
  };
};

export default useManageRoles;
