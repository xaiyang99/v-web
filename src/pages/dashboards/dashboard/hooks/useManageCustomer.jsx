import { useLazyQuery } from "@apollo/client";
import React, { useMemo } from "react";
import {
  accumulateArray,
  calculatePercentFromLastYearToThisYear,
} from "../../../../functions";
import {
  isWhichMonthWhichWeek,
  isWhichWeekWhichDay,
  isWhichYearWhichMonth,
} from "../../../../utils/date";
import { QUERY_CUSTOMERS } from "../apollo";

const useManageCustomer = ({ labels }) => {
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

  const [getCustomers, { data: customerData }] = useLazyQuery(QUERY_CUSTOMERS, {
    fetchPolicy: "no-cache",
  });

  const customCustomers = () => {
    getCustomers({
      variables: {
        noLimit: true,
      },
    });
  };

  React.useEffect(() => {
    customCustomers();
  }, [getCustomers]);

  const data =
    customerData?.getUser?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })) || [];

  const anonymousCustomerData = data.filter((data) => !data.gender);
  const maleCustomerData = data.filter((data) => data.gender === "male");
  const femaleCustomerData = data.filter((data) => data.gender === "female");

  const reportResult = useMemo(() => {
    switch (labels) {
      case "weekly": {
        const customerDataByWeekly = weekly.map((weekly, index) => {
          return {
            current: {
              name: weekly,
              anonymous: anonymousCustomerData.filter((customer) =>
                isWhichWeekWhichDay(customer.createdAt, 0, index)
              ).length,
              male: maleCustomerData.filter((customer) =>
                isWhichWeekWhichDay(customer.createdAt, 0, index)
              ).length,
              female: femaleCustomerData.filter((customer) =>
                isWhichWeekWhichDay(customer.createdAt, 0, index)
              ).length,
            },
            old: {
              name: weekly,
              anonymous: anonymousCustomerData.filter((customer) =>
                isWhichWeekWhichDay(customer.createdAt, 1, index)
              ).length,
              male: maleCustomerData.filter((customer) =>
                isWhichWeekWhichDay(customer.createdAt, 1, index)
              ).length,
              female: femaleCustomerData.filter((customer) =>
                isWhichWeekWhichDay(customer.createdAt, 1, index)
              ).length,
            },
          };
        });

        const { current, old } = {
          current: {
            anonymous: accumulateArray(
              customerDataByWeekly,
              "current.anonymous"
            ),
            male: accumulateArray(customerDataByWeekly, "current.male"),
            female: accumulateArray(customerDataByWeekly, "current.female"),
          },
          old: {
            anonymous: accumulateArray(customerDataByWeekly, "old.anonymous"),
            male: accumulateArray(customerDataByWeekly, "old.male"),
            female: accumulateArray(customerDataByWeekly, "old.female"),
          },
        };

        const anonymousCustomerDiscrepancy =
          calculatePercentFromLastYearToThisYear(
            current.anonymous,
            old.anonymous
          );

        const maleCustomerDiscrepancy = calculatePercentFromLastYearToThisYear(
          current.male,
          old.male
        );

        const femaleCustomerDiscrepancy =
          calculatePercentFromLastYearToThisYear(current.female, old.female);

        return {
          labels: weekly,
          amount: {
            current: {
              anonymous: current.anonymous,
              male: current.male,
              female: current.female,
            },
            old: {
              anonymous: old.anonymous,
              male: old.male,
              female: old.female,
            },

            total: {
              all:
                current.anonymous +
                current.male +
                current.female -
                old.anonymous +
                old.male +
                old.female,
              anonymous: current.anonymous - old.anonymous,
              male: current.male - old.male,
              female: current.female - old.female,
            },
          },
          discrepancy: {
            list: customerDataByWeekly.map(({ current, old }) => {
              const result =
                current.anonymous +
                current.male +
                current.female -
                (old.anonymous + old.male + old.female);
              return result;
            }),
            anonymousList: customerDataByWeekly.map(({ current, old }) => {
              const result = current.anonymous - old.anonymous;
              return result;
            }),
            maleList: customerDataByWeekly.map(({ current, old }) => {
              const result = current.male - old.male;
              return result;
            }),
            femaleList: customerDataByWeekly.map(({ current, old }) => {
              const result = current.female - old.female;
              return result;
            }),
            anonymousPercent: anonymousCustomerDiscrepancy,
            malePercent: maleCustomerDiscrepancy,
            femalePercent: femaleCustomerDiscrepancy,
            totalPercent:
              anonymousCustomerDiscrepancy +
              maleCustomerDiscrepancy +
              femaleCustomerDiscrepancy,
          },
        };
      }
      case "monthly": {
        const customerDataByMonthly = monthly.map((monthly, index) => {
          return {
            current: {
              name: monthly,
              anonymous: anonymousCustomerData.filter((customer) =>
                isWhichMonthWhichWeek(customer.createdAt, 0, index)
              ).length,
              male: maleCustomerData.filter((customer) =>
                isWhichMonthWhichWeek(customer.createdAt, 0, index)
              ).length,
              female: femaleCustomerData.filter((customer) =>
                isWhichMonthWhichWeek(customer.createdAt, 0, index)
              ).length,
            },
            old: {
              name: monthly,
              anonymous: anonymousCustomerData.filter((customer) =>
                isWhichMonthWhichWeek(customer.createdAt, 1, index)
              ).length,
              male: maleCustomerData.filter((customer) =>
                isWhichMonthWhichWeek(customer.createdAt, 1, index)
              ).length,
              female: femaleCustomerData.filter((customer) =>
                isWhichMonthWhichWeek(customer.createdAt, 1, index)
              ).length,
            },
          };
        });

        const { current, old } = {
          current: {
            anonymous: accumulateArray(
              customerDataByMonthly,
              "current.anonymous"
            ),
            male: accumulateArray(customerDataByMonthly, "current.male"),
            female: accumulateArray(customerDataByMonthly, "current.female"),
          },
          old: {
            anonymous: accumulateArray(customerDataByMonthly, "old.anonymous"),
            male: accumulateArray(customerDataByMonthly, "old.male"),
            female: accumulateArray(customerDataByMonthly, "old.female"),
          },
        };

        const anonymousCustomerDiscrepancy =
          calculatePercentFromLastYearToThisYear(
            current.anonymous,
            old.anonymous
          );

        const maleCustomerDiscrepancy = calculatePercentFromLastYearToThisYear(
          current.male,
          old.male
        );

        const femaleCustomerDiscrepancy =
          calculatePercentFromLastYearToThisYear(current.female, old.female);

        return {
          labels: monthly,
          amount: {
            current: {
              anonymous: current.anonymous,
              male: current.male,
              female: current.female,
            },
            old: {
              anonymous: old.anonymous,
              male: old.male,
              female: old.female,
            },

            total: {
              all:
                current.anonymous +
                current.male +
                current.female -
                old.anonymous +
                old.male +
                old.female,
              anonymous: current.anonymous - old.anonymous,
              male: current.male - old.male,
              female: current.female - old.female,
            },
          },
          discrepancy: {
            list: customerDataByMonthly.map(({ current, old }) => {
              const result =
                current.anonymous +
                current.male +
                current.female -
                (old.anonymous + old.male + old.female);
              return result;
            }),
            anonymousList: customerDataByMonthly.map(({ current, old }) => {
              const result = current.anonymous - old.anonymous;
              return result;
            }),
            maleList: customerDataByMonthly.map(({ current, old }) => {
              const result = current.male - old.male;
              return result;
            }),
            femaleList: customerDataByMonthly.map(({ current, old }) => {
              const result = current.female - old.female;
              return result;
            }),
            anonymousPercent: anonymousCustomerDiscrepancy,
            malePercent: maleCustomerDiscrepancy,
            femalePercent: femaleCustomerDiscrepancy,
            totalPercent:
              anonymousCustomerDiscrepancy +
              maleCustomerDiscrepancy +
              femaleCustomerDiscrepancy,
          },
        };
      }
      case "yearly": {
        const customerDataByYearly = yearly.map((yearly, index) => {
          return {
            current: {
              name: yearly,
              anonymous: anonymousCustomerData.filter((customer) =>
                isWhichYearWhichMonth(customer.createdAt, 0, index)
              ).length,
              male: maleCustomerData.filter((customer) =>
                isWhichYearWhichMonth(customer.createdAt, 0, index)
              ).length,
              female: femaleCustomerData.filter((customer) =>
                isWhichYearWhichMonth(customer.createdAt, 0, index)
              ).length,
            },
            old: {
              name: yearly,
              anonymous: anonymousCustomerData.filter((customer) =>
                isWhichYearWhichMonth(customer.createdAt, 1, index)
              ).length,
              male: maleCustomerData.filter((customer) =>
                isWhichYearWhichMonth(customer.createdAt, 1, index)
              ).length,
              female: femaleCustomerData.filter((customer) =>
                isWhichYearWhichMonth(customer.createdAt, 1, index)
              ).length,
            },
          };
        });

        const { current, old } = {
          current: {
            anonymous: accumulateArray(
              customerDataByYearly,
              "current.anonymous"
            ),
            male: accumulateArray(customerDataByYearly, "current.male"),
            female: accumulateArray(customerDataByYearly, "current.female"),
          },
          old: {
            anonymous: accumulateArray(customerDataByYearly, "old.anonymous"),
            male: accumulateArray(customerDataByYearly, "old.male"),
            female: accumulateArray(customerDataByYearly, "old.female"),
          },
        };

        const anonymousCustomerDiscrepancy =
          calculatePercentFromLastYearToThisYear(
            current.anonymous,
            old.anonymous
          );

        const maleCustomerDiscrepancy = calculatePercentFromLastYearToThisYear(
          current.male,
          old.male
        );

        const femaleCustomerDiscrepancy =
          calculatePercentFromLastYearToThisYear(current.female, old.female);
        return {
          labels: yearly,
          amount: {
            current: {
              anonymous: current.anonymous,
              male: current.male,
              female: current.female,
            },
            old: {
              anonymous: old.anonymous,
              male: old.male,
              female: old.female,
            },

            total: {
              all:
                current.anonymous +
                current.male +
                current.female -
                old.anonymous +
                old.male +
                old.female,
              anonymous: current.anonymous - old.anonymous,
              male: current.male - old.male,
              female: current.female - old.female,
            },
          },
          discrepancy: {
            list: customerDataByYearly.map(({ current, old }) => {
              const result =
                current.anonymous +
                current.male +
                current.female -
                (old.anonymous + old.male + old.female);
              return result;
            }),
            anonymousList: customerDataByYearly.map(({ current, old }) => {
              const result = current.anonymous - old.anonymous;
              return result;
            }),
            maleList: customerDataByYearly.map(({ current, old }) => {
              const result = current.male - old.male;
              return result;
            }),
            femaleList: customerDataByYearly.map(({ current, old }) => {
              const result = current.female - old.female;
              return result;
            }),
            anonymousPercent: anonymousCustomerDiscrepancy,
            malePercent: maleCustomerDiscrepancy,
            femalePercent: femaleCustomerDiscrepancy,
            totalPercent:
              anonymousCustomerDiscrepancy +
              maleCustomerDiscrepancy +
              femaleCustomerDiscrepancy,
          },
        };
      }
      default:
        return;
    }
  }, [labels, data]);

  return {
    getCustomers,
    customCustomers,
    data: {
      reports: {
        ...reportResult,
      },
    },
    total: customerData?.getCustomer?.total,
  };
};

export default useManageCustomer;
