import { useLazyQuery } from "@apollo/client";
import React from "react";
import {
  calculatePercentFromLastYearToThisYear,
  findTopValueInArray,
} from "../../../../functions";
import { isLastYear, isThisYear } from "../../../../utils/date";
import { QUERY_CUSTOMERS } from "../apollo";

const useManageSignupMostCountries = () => {
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
    customerData?.getUser?.data
      ?.filter((data) => data.countryId._id)
      .map((data, index) => ({
        ...data,
        no: index + 1,
      })) || [];

  const allCustomerData = findTopValueInArray(
    data.filter(
      (data) => isThisYear(data.createdAt) || isLastYear(data.createdAt)
    ),
    "countryId._id",
    "countryId.name",
    10
  );

  const allCustomerInThisYearData = findTopValueInArray(
    data.filter((data) => isThisYear(data.createdAt)),
    "countryId._id",
    "countryId.name",
    10
  );

  const allCustomerInLastYearData = findTopValueInArray(
    data.filter((data) => isLastYear(data.createdAt)),
    "countryId._id",
    "countryId.name",
    10
  );

  const reportResult = allCustomerData.map((data) => {
    const customerDataInThisYear = allCustomerInThisYearData.find(
      (innerData) => data._title === innerData._title
    );
    const customerDataInLastYear = allCustomerInLastYearData.find(
      (innerData) => data._title === innerData._title
    );
    if (customerDataInLastYear && customerDataInThisYear) {
      return {
        ...data,
        count: customerDataInLastYear.count + customerDataInThisYear.count,
        discrepancy: calculatePercentFromLastYearToThisYear(
          customerDataInThisYear.count,
          customerDataInLastYear.count
        ),
      };
    }
    return {
      ...data,
      discrepancy: calculatePercentFromLastYearToThisYear(
        customerDataInThisYear?.count || 0,
        customerDataInLastYear?.count || 0
      ),
    };
  });

  return {
    getCustomers,
    customCustomers,
    data: {
      reports: reportResult,
    },
    total: customerData?.getCustomer?.total,
  };
};

export default useManageSignupMostCountries;
