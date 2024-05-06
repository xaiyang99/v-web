import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_TICKET } from "../apollo";

const useTicket = (props) => {
  const [getTicket, { data: isTicket }] = useLazyQuery(QUERY_TICKET, {
    fetchPolicy: "no-cache",
  });

  const customeTicket = async () => {
    await getTicket({
      variables: {
        where: {
          createdAtBetween: [props?.endDate, props?.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customeTicket();
  }, [getTicket, props]);

  return {
    customeTicket: customeTicket,
    data: isTicket?.tickets?.data.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isTicket?.tickets?.total || 0,
  };
};

export default useTicket;
