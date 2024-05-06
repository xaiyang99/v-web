import { useLazyQuery } from "@apollo/client";
import React from "react";
import { useDispatch } from "react-redux";
import { setIsNewUser } from "../../../../redux/slices/statistics";
import { QUERY_CUSTOMER } from "../apollo";

const useUserSignup = (props) => {
  const dispatch = useDispatch();
  const [getUsers, { data: isUser }] = useLazyQuery(QUERY_CUSTOMER, {
    fetchPolicy: "no-cache",
  });
  const customProviderUsers = async () => {
    await getUsers({
      variables: {
        where: {
          createdAtBetween: [props?.endDate, props?.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customProviderUsers();
  }, [getUsers, props.startDate, props.endDate]);

  React.useEffect(() => {
    if (isUser) {
      dispatch(setIsNewUser(isUser?.getUser?.data));
    }
  }, [getUsers, dispatch, isUser]);
  return {
    customProviderUsers: customProviderUsers,
    data: isUser?.getUser?.data.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isUser?.getUser?.total || 0,
  };
};

export default useUserSignup;
