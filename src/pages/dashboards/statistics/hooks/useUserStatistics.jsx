import { useLazyQuery } from "@apollo/client";
import React from "react";
import { useDispatch } from "react-redux";
import { setIsUserData } from "../../../../redux/slices/statistics";
import { QUERY_CUSTOMER } from "../apollo";

const useUserStatistics = (props) => {
  const dispatch = useDispatch();
  const [getUsers, { data: isUser }] = useLazyQuery(QUERY_CUSTOMER, {
    fetchPolicy: "no-cache",
  });
  const customUsers = async () => {
    await getUsers({
      variables: {
        where: {
          lastLoggedInAtBetween: [props?.endDate, props?.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customUsers();
  }, [getUsers, props]);

  React.useEffect(() => {
    if (isUser) {
      dispatch(setIsUserData(isUser?.getUser?.data));
    }
  }, [getUsers, dispatch, isUser]);
  return {
    customUsers: customUsers,
    data: isUser?.getUser?.data.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isUser?.getUser?.total || 0,
  };
};

export default useUserStatistics;
