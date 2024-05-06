import React from "react";
import { useLazyQuery } from "@apollo/client";

// functions and components
import ChagneUserPassword from "./changePassword";
import TwoFactor from "./2FA";

// apollo
import { QUERY_STAFF_ACCOUNT } from "./apollo";
import useAuth from "../../../hooks/useAuth";

function Setting() {
  const { user } = useAuth();
  const [userAccount, setUserAccount] = React.useState({});
  const [queryStaffInfo, { refetch }] = useLazyQuery(QUERY_STAFF_ACCOUNT, {
    fetchPolicy: "no-cache",
  });

  const handleQueryStaff = async () => {
    await queryStaffInfo({
      variables: {
        where: {
          _id: user?._id,
        },
      },
      onCompleted: (data) => {
        if (data?.queryStaffs?.data.length > 0) {
          setUserAccount(data?.queryStaffs?.data[0]);
        }
      },
    });
  };

  React.useEffect(() => {
    handleQueryStaff();
  }, []);

  return (
    <React.Fragment>
      <ChagneUserPassword />
      <TwoFactor data={userAccount} refetch={refetch} />
    </React.Fragment>
  );
}

export default Setting;
