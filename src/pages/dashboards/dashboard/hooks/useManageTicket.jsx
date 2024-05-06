import { useLazyQuery } from "@apollo/client";
import _ from "lodash";
import React, { useMemo } from "react";
import { isDateLastMonth, isDateLastWeek } from "../../../../utils/date";
import { QUERY_TICKETS } from "../apollo";

const useManageTicket = ({ labels }) => {
  const [getTickets, { data: ticketData }] = useLazyQuery(QUERY_TICKETS, {
    fetchPolicy: "no-cache",
  });

  const customTickets = () => {
    getTickets({
      variables: {
        noLimit: true,
      },
    });
  };

  React.useEffect(() => {
    customTickets();
  }, [getTickets]);

  const data =
    ticketData?.tickets?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })) || [];

  const reportResult = useMemo(() => {
    switch (labels) {
      case "lastSevenDays": {
        const newTickets = data.filter(
          (data) =>
            data.typeTicketID.status === "new" && isDateLastWeek(data.createdAt)
        ).length;
        const pendingTickets = data.filter(
          (data) =>
            data.typeTicketID.status === "pending" &&
            isDateLastWeek(data.createdAt)
        ).length;
        const closedTickets = data.filter(
          (data) =>
            data.typeTicketID.status === "close" &&
            isDateLastWeek(data.createdAt)
        ).length;
        const percentCompletedTask = Math.round(
          (closedTickets / (newTickets + pendingTickets)) * 100
        );
        return {
          amount: {
            total: newTickets + pendingTickets + closedTickets,
            newTickets,
            pendingTickets,
            closedTickets,
          },
          percent: {
            completedTask: !_.isNaN(percentCompletedTask)
              ? percentCompletedTask
              : 0,
          },
        };
      }
      case "latestMonth": {
        const newTickets = data.filter(
          (data) =>
            data.typeTicketID.status === "new" &&
            isDateLastMonth(data.createdAt)
        ).length;
        const pendingTickets = data.filter(
          (data) =>
            data.typeTicketID.status === "pending" &&
            isDateLastMonth(data.createdAt)
        ).length;
        const closedTickets = data.filter(
          (data) =>
            data.typeTicketID.status === "close" &&
            isDateLastMonth(data.createdAt)
        ).length;
        const percentCompletedTask = Math.round(
          (closedTickets / (newTickets + pendingTickets)) * 100
        );
        return {
          amount: {
            total: newTickets + pendingTickets + closedTickets,
            newTickets,
            pendingTickets,
            closedTickets,
          },
          percent: {
            completedTask: !_.isNaN(percentCompletedTask)
              ? percentCompletedTask
              : 0,
          },
        };
      }
      default:
        return;
    }
  }, [labels, data]);

  return {
    getTickets,
    data: {
      reports: {
        ...reportResult,
      },
    },
    total: ticketData?.tickets?.total,
  };
};

export default useManageTicket;
