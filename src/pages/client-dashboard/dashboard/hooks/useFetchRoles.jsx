import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_GET_ROLE } from "../apollo";

const useFetchRoles = ({ user }) => {
  const [getData, { data: dataFetching, loading, refetch }] = useLazyQuery(
    QUERY_GET_ROLE,
    {
      fetchPolicy: "no-cache",
    }
  );

  React.useEffect(() => {
    getData({
      variables: {
        where: {
          _id: user.roleId._id,
        },
      },
    });
  }, []);

  const [queryData] = dataFetching?.getRole?.data || [];

  const data = queryData;

  return data;
};

export default useFetchRoles;
