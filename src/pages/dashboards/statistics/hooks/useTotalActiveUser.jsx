import { useLazyQuery } from "@apollo/client";
import React from "react";
import { useDispatch } from "react-redux";
import { setIsUserData } from "../../../../redux/slices/statistics";
import { QUERY_CUSTOMER } from "../apollo";

const useTotalActiveUser = (props) => {
  const dispatch = useDispatch();
  const [getUsers, { data: isUser }] = useLazyQuery(QUERY_CUSTOMER, {
    fetchPolicy: "no-cache",
  });
  const customActiveUsers = async () => {
    await getUsers({
      variables: {
        where: {
          lastLoggedInAtBetween: [props?.endDate, props?.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customActiveUsers();
  }, [getUsers, props]);

  React.useEffect(() => {
    if (isUser) {
      dispatch(setIsUserData(isUser?.getUser?.data));
    }
  }, [getUsers, dispatch, isUser]);
  return {
    customActiveUsers: customActiveUsers,
    data: isUser?.getUser?.data.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isUser?.getUser?.total || 0,
  };
};

export default useTotalActiveUser;
