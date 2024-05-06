import { useLazyQuery } from "@apollo/client";
import _ from "lodash";
import React from "react";
import { GET_PERMISSION_STAFFS } from "../apollo";

const useManagePermission = () => {
  const [getPermissions, { data: dataPermissions }] = useLazyQuery(
    GET_PERMISSION_STAFFS,
    {
      fetchPolicy: "no-cache",
    }
  );

  const customGetPermissions = React.useCallback(() => {
    getPermissions({ variables: { noLimit: true } });
  }, [getPermissions]);

  React.useEffect(() => {
    customGetPermissions();
  }, [customGetPermissions]);

  const data = dataPermissions?.permissions_staffs?.data?.map(
    (data, index) => ({
      ...data,
      no: index + 1,
    })
  );

  return {
    getPermissions,
    customGetPermissions,
    data: _.uniqBy(data, "groupName"),
    permissions: _.chain(data).groupBy("groupName").value(),
    total: dataPermissions?.permissions_staffs?.total,
  };
};

export default useManagePermission;
