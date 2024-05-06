import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_CUSTOMER } from "../apollo";

const useAllUser = (props) => {
  const [getUsers, { data: isUser }] = useLazyQuery(QUERY_CUSTOMER, {
    fetchPolicy: "no-cache",
  });
  const customTotalUsers = async () => {
    await getUsers({
      variables: {
        where: { status: "active" },
      },
    });
  };
  React.useEffect(() => {
    customTotalUsers();
  }, [getUsers, props]);

  return {
    customTotalUsers: customTotalUsers,
    data: isUser?.getUser?.data.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isUser?.getUser?.total || 0,
  };
};

export default useAllUser;
