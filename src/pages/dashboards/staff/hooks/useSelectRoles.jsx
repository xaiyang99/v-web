import { useLazyQuery } from "@apollo/client";
import React from "react";
import { GET_ROLES } from "../apollo";

const useSelectRoles = () => {
  const [getRoles, { data: dataRoles }] = useLazyQuery(GET_ROLES, {
    fetchPolicy: "no-cache",
  });

  const customGetRoles = React.useCallback(() => {
    getRoles();
  }, [getRoles]);

  React.useEffect(() => {
    customGetRoles();
  }, [customGetRoles]);

  return {
    options: dataRoles?.role_staffs?.data?.map((data) => ({
      label: data.name,
      value: data._id,
    })),
  };
};

export default useSelectRoles;
