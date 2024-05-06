import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_BROADCAST_STATISTICS } from "../apollo";

const useBroadcastStatic = (props) => {
  const [getBroadcast, { data: isBroadcast }] = useLazyQuery(
    QUERY_BROADCAST_STATISTICS,
    {
      fetchPolicy: "no-cache",
    }
  );

  const customBrodcast = async () => {
    await getBroadcast({
      variables: {
        where: {
          status: "published",
          createdAtBetween: [props?.endDate, props?.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customBrodcast();
  }, [getBroadcast, props]);

  return {
    customBrodcast: customBrodcast,
    data: isBroadcast?.getBroadcasts?.data.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isBroadcast?.getBroadcasts?.total || 0,
  };
};

export default useBroadcastStatic;
