import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_LOG } from "../apollo";

const useUserActive = (props) => {
  const [getUsers, { data: isUser }] = useLazyQuery(QUERY_LOG, {
    fetchPolicy: "no-cache",
  });

  const customUserActive = async () => {
    await getUsers({
      variables: {
        where: {
          name: "login",
          createdAt: [props?.endDate, props?.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customUserActive();
  }, [getUsers, props]);

  return {
    customUserActive: customUserActive,
    data: isUser?.getLogs?.data.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isUser?.getLogs?.total || 0,
  };
};

export default useUserActive;
