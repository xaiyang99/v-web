import { useLazyQuery } from "@apollo/client";
import { QUERY_TICKET_BY_TYPE } from "../apollo";
import { useEffect, useState } from "react";

const useManageReply = (props) => {
  const { pathID } = props;
  const [reloading, setReloading] = useState(false);
  const [getTicketTYPE, { data: get_ticket_type }] = useLazyQuery(
    QUERY_TICKET_BY_TYPE,
    {
      fetchPolicy: "no-cache",
    }
  );

  const handleReloading = () => setReloading((prev) => !prev);

  const customTicketTypes = () => {
    getTicketTYPE({
      variables: {
        where: {
          typeTicketID: parseInt(pathID),
        },
        orderBy: "createdAt_DESC",
      },
    });
  };

  useEffect(() => {
    customTicketTypes();
  }, [pathID, getTicketTYPE, reloading]);

  return {
    data: get_ticket_type?.tickets?.data.map((ticket) => ({
      ...ticket,
    })),
    dataStatus: get_ticket_type?.tickets?.data[0]?.typeTicketID?.status,
    reloading,

    customTicketTypes,
    getTicketTYPE,
    handleReloading,
  };
};

export default useManageReply;
