import { useLazyQuery } from "@apollo/client";
import { QUERY_RECIPIENT } from "../apollo";
import React, { useState } from "react";
import useAuth from "../../../../hooks/useAuth";

const useRecipient = () => {
  const { user } = useAuth();
  const [listRecipient, { data: isRecipeint }] = useLazyQuery(QUERY_RECIPIENT, {
    fetchPolicy: "no-cache",
  });

  const [dataForAnnountcement, setDataForAnnountcement] = useState(null);
  const customQueryRecipient = () => {
    listRecipient({
      variables: {
        orderBy: "createdAt_DESC",
        where: {
          userId: parseInt(user?._id),
        },
      },
    });
  };
  React.useEffect(() => {
    customQueryRecipient();
  }, [listRecipient]);

  return {
    dataForAnnountcement,
    setDataForAnnountcement,
    customQueryRecipient,
    data: isRecipeint?.getRecipientAnnouncementByUserId?.data?.map(
      (data, index) => ({
        ...data,
        no: index + 1,
      }),
    ),
    total: isRecipeint?.getRecipientAnnouncementByUserId?.total,
  };
};
export default useRecipient;
