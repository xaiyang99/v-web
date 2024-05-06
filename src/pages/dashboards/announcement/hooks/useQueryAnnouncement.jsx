import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { QUERY_ANOUNCEMENT } from "../apollo";

const useQueryAnnouncemenct = () => {
  const [listAnouncement, { data: isAnouncement }] = useLazyQuery(
    QUERY_ANOUNCEMENT,
    {
      fetchPolicy: "no-cache",
    },
  );
  const [dataForAnnountcement, setDataForAnnountcement] = useState(null);
  const customQueryPulishedAnnouncement = () => {
    listAnouncement({
      variables: {
        orderBy: "updatedAt_DESC",
        where: {
          status: "published",
        },
      },
    });
  };
  React.useEffect(() => {
    customQueryPulishedAnnouncement();
  }, [listAnouncement]);

  return {
    customQueryPulishedAnnouncement,
    setDataForAnnountcement,
    dataForAnnountcement,
    data: isAnouncement?.getAnnouncements?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isAnouncement?.getAnnouncements?.total,
  };
};

export default useQueryAnnouncemenct;
