import { useLazyQuery } from "@apollo/client";
import { QUERY_USERS_CUSTOM } from "../apollo";
import { useCallback } from "react";
import { useEffect } from "react";

const useUser = () => {
  const [getUsers, { data: get_users }] = useLazyQuery(QUERY_USERS_CUSTOM, {
    fetchPolicy: "no-cache",
  });

  const customUsers = useCallback(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    customUsers();
  }, [customUsers]);

  return {
    options: get_users?.getUser?.data?.map((user, index) => ({
      value: user._id,
      label: user.email,
    })),
  };
};

export default useUser;
