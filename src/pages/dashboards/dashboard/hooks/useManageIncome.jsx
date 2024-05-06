import { useLazyQuery } from "@apollo/client";
import React, { useMemo } from "react";
import {
  accumulateArray,
  calculatePercentFromLastYearToThisYear,
} from "../../../../functions";
import {
  isWhichWeekWhichDay,
  isWhichYearWhichMonth,
} from "../../../../utils/date";
import { QUERY_PAYMENTS } from "../apollo";

const useManageIncome = ({ labels }) => {
  const weekly = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const monthly = ["1st", "2nd", "3rd", "4th"];
  const yearly = [
    "Jan",
    "Feb",
    "Mar",
    "Api",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [getPayments, { data: paymentData }] = useLazyQuery(QUERY_PAYMENTS, {
    fetchPolicy: "no-cache",
  });

  const customPayments = () => {
    getPayments({
      variables: {
        noLimit: true,
      },
    });
  };

  React.useEffect(() => {
    customPayments();
  }, [getPayments]);

  const data =
    paymentData?.getPayments?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })) || [];

  const reportResult = useMemo(() => {
    switch (labels) {
      case "weekly": {
        const paymentDataByWeekly = weekly.map((weekly, index) => {
          return {
            current: {
              name: weekly,
              total: accumulateArray(
                data.filter((paymentData) =>
                  isWhichWeekWhichDay(paymentData.orderedAt, 0, index)
                ),
                "amount"
              ),
            },
            old: {
              name: weekly,
              total: accumulateArray(
                data.filter((paymentData) =>
                  isWhichWeekWhichDay(paymentData.orderedAt, 1, index)
                ),
                "amount"
              ),
            },
          };
        });

        const { current, old } = {
          current: {
            total: accumulateArray(paymentDataByWeekly, "current.total"),
          },
          old: {
            total: accumulateArray(paymentDataByWeekly, "old.total"),
          },
        };

        const totalPaymentDiscrepancy = calculatePercentFromLastYearToThisYear(
          current.total,
          old.total
        );

        return {
          labels: weekly,
          labelName: "weekly",
          amount: {
            current: {
              total: current.total,
            },
            old: {
              total: old.total,
            },

            total: {
              all: current.total - old.total,
              income:
                current.total - old.total > 0 ? current.total - old.total : 0,
              profit:
                current.total - old.total > 0 ? current.total - old.total : 0,
            },
          },
          discrepancy: {
            list: paymentDataByWeekly.map(({ current, old }) => {
              const result = current.total - old.total;
              return result;
            }),
            totalAmount:
              accumulateArray(paymentDataByWeekly, "current.total") -
              accumulateArray(paymentDataByWeekly, "old.total"),
            totalPercent: totalPaymentDiscrepancy,
            incomePercent:
              totalPaymentDiscrepancy > 0 ? totalPaymentDiscrepancy : 0,
            profitPercent:
              totalPaymentDiscrepancy > 0 ? totalPaymentDiscrepancy : 0,
          },
        };
      }
      case "monthly": {
        const paymentDataByMonthly = monthly.map((monthly, index) => {
          return {
            current: {
              name: monthly,
              total: accumulateArray(
                data.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
                ),
                "amount"
              ),
            },
            old: {
              name: monthly,
              total: accumulateArray(
                data.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 1, index)
                ),
                "amount"
              ),
            },
          };
        });

        const { current, old } = {
          current: {
            total: accumulateArray(paymentDataByMonthly, "current.total"),
          },
          old: {
            total: accumulateArray(paymentDataByMonthly, "old.total"),
          },
        };

        const totalPaymentDiscrepancy = calculatePercentFromLastYearToThisYear(
          current.total,
          old.total
        );

        return {
          labels: monthly,
          labelName: "monthly",
          amount: {
            current: {
              total: current.total,
            },
            old: {
              total: old.total,
            },

            total: {
              all: current.total - old.total,
              income:
                current.total - old.total > 0 ? current.total - old.total : 0,
              profit:
                current.total - old.total > 0 ? current.total - old.total : 0,
            },
          },
          discrepancy: {
            list: paymentDataByMonthly.map(({ current, old }) => {
              const result = current.total - old.total;
              return result;
            }),
            totalAmount:
              accumulateArray(paymentDataByMonthly, "current.total") -
              accumulateArray(paymentDataByMonthly, "old.total"),
            totalPercent: totalPaymentDiscrepancy,
            incomePercent:
              totalPaymentDiscrepancy > 0 ? totalPaymentDiscrepancy : 0,
            profitPercent:
              totalPaymentDiscrepancy > 0 ? totalPaymentDiscrepancy : 0,
          },
        };
      }
      case "yearly": {
        const paymentDataByYearly = yearly.map((yearly, index) => {
          return {
            current: {
              name: yearly,
              total: accumulateArray(
                data.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
                ),
                "amount"
              ),
            },
            old: {
              name: yearly,
              total: accumulateArray(
                data.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 1, index)
                ),
                "amount"
              ),
            },
          };
        });

        const { current, old } = {
          current: {
            total: accumulateArray(paymentDataByYearly, "current.total"),
          },
          old: {
            total: accumulateArray(paymentDataByYearly, "old.total"),
          },
        };

        const totalPaymentDiscrepancy = calculatePercentFromLastYearToThisYear(
          current.total,
          old.total
        );

        return {
          labels: yearly,
          labelName: "yearly",
          amount: {
            current: {
              total: current.total,
            },
            old: {
              total: old.total,
            },

            total: {
              all: current.total - old.total,
              income:
                current.total - old.total > 0 ? current.total - old.total : 0,
              profit:
                current.total - old.total > 0 ? current.total - old.total : 0,
            },
          },
          discrepancy: {
            list: paymentDataByYearly.map(({ current, old }) => {
              const result = current.total - old.total;
              return result;
            }),
            totalAmount:
              accumulateArray(paymentDataByYearly, "current.total") -
              accumulateArray(paymentDataByYearly, "old.total"),
            totalPercent: totalPaymentDiscrepancy,
            incomePercent:
              totalPaymentDiscrepancy > 0 ? totalPaymentDiscrepancy : 0,
            profitPercent:
              totalPaymentDiscrepancy > 0 ? totalPaymentDiscrepancy : 0,
          },
        };
      }
      default:
        return;
    }
  }, [labels, data]);

  return {
    getPayments,
    customPayments,
    data: {
      reports: {
        ...reportResult,
      },
    },
    total: paymentData?.getPayments?.total,
  };
};

export default useManageIncome;
