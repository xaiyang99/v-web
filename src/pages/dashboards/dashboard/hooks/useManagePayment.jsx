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

const useManagePayment = ({ labels }) => {
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

  const freePaymentData = data.filter(
    (data) =>
      data.packageId.name?.toLowerCase() === "free" &&
      data.status === "successful"
  );

  const proPaymentData = data.filter(
    (data) =>
      data.packageId.name?.toLowerCase() === "pro" &&
      data.status === "successful"
  );
  const premiumPaymentData = data.filter(
    (data) =>
      data.packageId.name?.toLowerCase() === "premium" &&
      data.status === "successful"
  );

  const reportResult = useMemo(() => {
    switch (labels) {
      case "weekly": {
        const paymentDataByWeekly = weekly.map((weekly, index) => {
          return {
            current: {
              name: weekly,
              free: freePaymentData.filter((paymentData) =>
                isWhichWeekWhichDay(paymentData.orderedAt, 0, index)
              ).length,
              pro: proPaymentData.filter((paymentData) =>
                isWhichWeekWhichDay(paymentData.orderedAt, 0, index)
              ).length,
              premium: proPaymentData.filter((paymentData) =>
                isWhichWeekWhichDay(paymentData.orderedAt, 0, index)
              ).length,
              proAmount: accumulateArray(
                proPaymentData.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
                ),
                "amount"
              ),
              premiumAmount: accumulateArray(
                premiumPaymentData.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
                ),
                "amount"
              ),
            },
            old: {
              name: weekly,
              free: freePaymentData.filter((paymentData) =>
                isWhichWeekWhichDay(paymentData.orderedAt, 1, index)
              ).length,
              pro: proPaymentData.filter((paymentData) =>
                isWhichWeekWhichDay(paymentData.orderedAt, 1, index)
              ).length,
              premium: proPaymentData.filter((paymentData) =>
                isWhichWeekWhichDay(paymentData.orderedAt, 1, index)
              ).length,
              proAmount: accumulateArray(
                proPaymentData.filter((paymentData) =>
                  isWhichWeekWhichDay(paymentData.orderedAt, 1, index)
                ),
                "amount"
              ),
              premiumAmount: accumulateArray(
                premiumPaymentData.filter((paymentData) =>
                  isWhichWeekWhichDay(paymentData.orderedAt, 1, index)
                ),
                "amount"
              ),
            },
          };
        });

        const { current, old } = {
          current: {
            free: accumulateArray(paymentDataByWeekly, "current.free"),
            pro: accumulateArray(paymentDataByWeekly, "current.pro"),
            premium: accumulateArray(paymentDataByWeekly, "current.premium"),
          },
          old: {
            free: accumulateArray(paymentDataByWeekly, "old.free"),
            pro: accumulateArray(paymentDataByWeekly, "old.pro"),
            premium: accumulateArray(paymentDataByWeekly, "old.premium"),
          },
        };

        const freePaymentDiscrepancy = calculatePercentFromLastYearToThisYear(
          current.free,
          old.free
        );

        const proPaymentDiscrepancy = calculatePercentFromLastYearToThisYear(
          current.pro,
          old.pro
        );

        const premiumPaymentDiscrepancy =
          calculatePercentFromLastYearToThisYear(current.premium, old.premium);

        return {
          labels: weekly,
          labelName: "weekly",
          amount: {
            current: {
              free: current.free,
              pro: current.pro,
              premium: current.premium,
            },
            old: {
              free: old.free,
              pro: old.pro,
              premium: old.premium,
            },

            total: {
              all:
                current.free +
                current.pro +
                current.premium -
                old.free +
                old.pro +
                old.premium,
              free: current.free - old.free,
              pro: current.pro - old.pro,
              premium: current.premium - old.premium,
            },
          },
          discrepancy: {
            freeList: paymentDataByWeekly.map(({ current, old }) => {
              const result = current.free - old.free;
              return result > 0 ? result : 0;
            }),
            proList: paymentDataByWeekly.map(({ current, old }) => {
              const result = current.pro - old.pro;
              return result > 0 ? result : 0;
            }),
            premiumList: paymentDataByWeekly.map(({ current, old }) => {
              const result = current.premium - old.premium;
              return result > 0 ? result : 0;
            }),
            freeAmount: 0,
            proAmount:
              accumulateArray(paymentDataByWeekly, "current.proAmount") -
              accumulateArray(paymentDataByWeekly, "old.proAmount"),
            premiumAmount:
              accumulateArray(paymentDataByWeekly, "current.premiumAmount") -
              accumulateArray(paymentDataByWeekly, "old.premiumAmount"),
            freePercent: freePaymentDiscrepancy,
            proPercent: proPaymentDiscrepancy,
            premiumPercent: premiumPaymentDiscrepancy,
            totalPercent:
              freePaymentDiscrepancy +
              proPaymentDiscrepancy +
              premiumPaymentDiscrepancy,
          },
        };
      }
      case "monthly": {
        const paymentDataByMonthly = monthly.map((monthly, index) => {
          return {
            current: {
              name: monthly,
              free: freePaymentData.filter((paymentData) =>
                isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
              ).length,
              pro: proPaymentData.filter((paymentData) =>
                isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
              ).length,
              premium: premiumPaymentData.filter((paymentData) =>
                isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
              ).length,
              proAmount: accumulateArray(
                proPaymentData.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
                ),
                "amount"
              ),
              premiumAmount: accumulateArray(
                premiumPaymentData.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
                ),
                "amount"
              ),
            },
            old: {
              name: monthly,
              free: freePaymentData.filter((paymentData) =>
                isWhichYearWhichMonth(paymentData.orderedAt, 1, index)
              ).length,
              pro: proPaymentData.filter((paymentData) =>
                isWhichYearWhichMonth(paymentData.orderedAt, 1, index)
              ).length,
              premium: premiumPaymentData.filter((paymentData) =>
                isWhichYearWhichMonth(paymentData.orderedAt, 1, index)
              ).length,
              proAmount: accumulateArray(
                proPaymentData.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 1, index)
                ),
                "amount"
              ),
              premiumAmount: accumulateArray(
                premiumPaymentData.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 1, index)
                ),
                "amount"
              ),
            },
          };
        });

        const { current, old } = {
          current: {
            free: accumulateArray(paymentDataByMonthly, "current.free"),
            pro: accumulateArray(paymentDataByMonthly, "current.pro"),
            premium: accumulateArray(paymentDataByMonthly, "current.premium"),
          },
          old: {
            free: accumulateArray(paymentDataByMonthly, "old.free"),
            pro: accumulateArray(paymentDataByMonthly, "old.pro"),
            premium: accumulateArray(paymentDataByMonthly, "old.premium"),
          },
        };

        const freePaymentDiscrepancy = calculatePercentFromLastYearToThisYear(
          current.free,
          old.free
        );

        const proPaymentDiscrepancy = calculatePercentFromLastYearToThisYear(
          current.pro,
          old.pro
        );

        const premiumPaymentDiscrepancy =
          calculatePercentFromLastYearToThisYear(current.premium, old.premium);

        return {
          labels: monthly,
          labelName: "monthly",
          amount: {
            current: {
              free: current.free,
              pro: current.pro,
              premium: current.premium,
            },
            old: {
              free: old.free,
              pro: old.pro,
              premium: old.premium,
            },

            total: {
              all:
                current.free +
                current.pro +
                current.premium -
                old.free +
                old.pro +
                old.premium,
              free: current.free - old.free,
              pro: current.pro - old.pro,
              premium: current.premium - old.premium,
            },
          },
          discrepancy: {
            freeList: paymentDataByMonthly.map(({ current, old }) => {
              const result = current.free - old.free;
              return result;
            }),
            proList: paymentDataByMonthly.map(({ current, old }) => {
              const result = current.pro - old.pro;
              return result;
            }),
            premiumList: paymentDataByMonthly.map(({ current, old }) => {
              const result = current.premium - old.premium;
              return result;
            }),
            freeAmount: 0,
            proAmount:
              accumulateArray(paymentDataByMonthly, "current.proAmount") -
              accumulateArray(paymentDataByMonthly, "old.proAmount"),
            premiumAmount:
              accumulateArray(paymentDataByMonthly, "current.premiumAmount") -
              accumulateArray(paymentDataByMonthly, "old.premiumAmount"),
            freePercent: freePaymentDiscrepancy,
            proPercent: proPaymentDiscrepancy,
            premiumPercent: premiumPaymentDiscrepancy,
            totalPercent:
              freePaymentDiscrepancy +
              proPaymentDiscrepancy +
              premiumPaymentDiscrepancy,
          },
        };
      }
      case "yearly": {
        const paymentDataByYearly = yearly.map((yearly, index) => {
          return {
            current: {
              name: yearly,
              free: freePaymentData.filter((paymentData) =>
                isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
              ).length,
              pro: proPaymentData.filter((paymentData) =>
                isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
              ).length,
              premium: premiumPaymentData.filter((paymentData) =>
                isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
              ).length,
              proAmount: accumulateArray(
                proPaymentData.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
                ),
                "amount"
              ),
              premiumAmount: accumulateArray(
                premiumPaymentData.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 0, index)
                ),
                "amount"
              ),
            },
            old: {
              name: yearly,
              free: freePaymentData.filter((paymentData) =>
                isWhichYearWhichMonth(paymentData.orderedAt, 1, index)
              ).length,
              pro: proPaymentData.filter((paymentData) =>
                isWhichYearWhichMonth(paymentData.orderedAt, 1, index)
              ).length,
              premium: premiumPaymentData.filter((paymentData) =>
                isWhichYearWhichMonth(paymentData.orderedAt, 1, index)
              ).length,
              proAmount: accumulateArray(
                proPaymentData.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 1, index)
                ),
                "amount"
              ),
              premiumAmount: accumulateArray(
                premiumPaymentData.filter((paymentData) =>
                  isWhichYearWhichMonth(paymentData.orderedAt, 1, index)
                ),
                "amount"
              ),
            },
          };
        });

        const { current, old } = {
          current: {
            free: accumulateArray(paymentDataByYearly, "current.free"),
            pro: accumulateArray(paymentDataByYearly, "current.pro"),
            premium: accumulateArray(paymentDataByYearly, "current.premium"),
          },
          old: {
            free: accumulateArray(paymentDataByYearly, "old.free"),
            pro: accumulateArray(paymentDataByYearly, "old.pro"),
            premium: accumulateArray(paymentDataByYearly, "old.premium"),
          },
        };

        const freePaymentDiscrepancy = calculatePercentFromLastYearToThisYear(
          current.free,
          old.free
        );

        const proPaymentDiscrepancy = calculatePercentFromLastYearToThisYear(
          current.pro,
          old.pro
        );

        const premiumPaymentDiscrepancy =
          calculatePercentFromLastYearToThisYear(current.premium, old.premium);

        return {
          labels: yearly,
          labelName: "yearly",
          amount: {
            current: {
              free: current.free,
              pro: current.pro,
              premium: current.premium,
            },
            old: {
              free: old.free,
              pro: old.pro,
              premium: old.premium,
            },

            total: {
              all:
                current.free +
                current.pro +
                current.premium -
                old.free +
                old.pro +
                old.premium,
              free: current.free - old.free,
              pro: current.pro - old.pro,
              premium: current.premium - old.premium,
            },
          },
          discrepancy: {
            freeList: paymentDataByYearly.map(({ current, old }) => {
              const result = current.free - old.free;
              return result;
            }),
            proList: paymentDataByYearly.map(({ current, old }) => {
              const result = current.pro - old.pro;
              return result;
            }),
            premiumList: paymentDataByYearly.map(({ current, old }) => {
              const result = current.premium - old.premium;
              return result;
            }),
            freeAmount: 0,
            proAmount:
              accumulateArray(paymentDataByYearly, "current.proAmount") -
              accumulateArray(paymentDataByYearly, "old.proAmount"),
            premiumAmount:
              accumulateArray(paymentDataByYearly, "current.premiumAmount") -
              accumulateArray(paymentDataByYearly, "old.premiumAmount"),
            freePercent: freePaymentDiscrepancy,
            proPercent: proPaymentDiscrepancy,
            premiumPercent: premiumPaymentDiscrepancy,
            totalPercent:
              freePaymentDiscrepancy +
              proPaymentDiscrepancy +
              premiumPaymentDiscrepancy,
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

export default useManagePayment;
