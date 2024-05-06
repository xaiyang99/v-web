import { useLazyQuery } from "@apollo/client";
import React from "react";
import { useDispatch } from "react-redux";
import { setIsNewUser } from "../../../../redux/slices/statistics";
import { QUERY_CUSTOMER } from "../apollo";

const useNewUser = (props) => {
  const dispatch = useDispatch();
  const [getUsers, { data: isUser }] = useLazyQuery(QUERY_CUSTOMER, {
    fetchPolicy: "no-cache",
  });

  const customTotalUsers = async () => {
    await getUsers({
      variables: {
        where: {
          createdAtBetween: [props?.endDate, props?.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customTotalUsers();
  }, [getUsers, props]);
  React.useEffect(() => {
    if (isUser) {
      dispatch(setIsNewUser(isUser?.getUser?.data));
    }
  }, [getUsers, dispatch, isUser]);
  return {
    customTotalUsers: customTotalUsers,
    data: isUser?.getUser?.data.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isUser?.getUser?.total || 0,
  };
};

export default useNewUser;
