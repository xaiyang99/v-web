import { useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { GET_USERS } from "../apollo";

const useSelectUsers = () => {
  const [getUsers, { data: dataUsers }] = useLazyQuery(GET_USERS, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    getUsers({
      variables: {
        limit: 10,
      },
    });
  }, []);

  const data = React.useMemo(() => {
    return dataUsers?.getUser?.data;
  }, [dataUsers]);

  return {
    getUsers,
    data,
    options:
      data
        ?.filter((data) => data.username)
        .map((data) => ({
          label: data.username,
          value: data._id,
        })) || [],
  };
};

export default useSelectUsers;
