import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useMemo } from "react";
import { QUERY_PACKAGES } from "../apollo";
import { PACKAGE_TYPE } from "../../../../redux/slices/paymentSlice";

const useManagePackages = ({ filter } = {}) => {
  const [listPackage, { data: packageData }] = useLazyQuery(QUERY_PACKAGES, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);
  const customQueryPackage = React.useCallback(() => {
    listPackage({
      variables: {
        where: {
          excluded: true,
        },
      },
    });
  }, [listPackage]);

  useEffect(() => {
    customQueryPackage();
  }, [filter, customQueryPackage]);

  const data = useMemo(() => {
    return {
      selectedRow,
      setSelectedRow,
      customQueryPackage,
      data: packageData?.getPackage?.data?.map((data, index) => ({
        ...data,
        no: index + 1,
      })),
      filteredData: packageData?.getPackage?.data?.map((data, index) => ({
        ...data,
        no: index + 1,
      })),
      filteredAnnualData: packageData?.getPackage?.data?.map((data, index) => ({
        ...data,
        no: index + 1,
        _type: "annual",
        _price: data.annualPrice,
      })),
      annualData: packageData?.getPackage?.data?.map((data, index) => ({
        ...data,
        no: index + 1,
        _type: "annual",
        _price: data.annualPrice,
      })),
      filteredMonthlyData: packageData?.getPackage?.data?.map(
        (data, index) => ({
          ...data,
          no: index + 1,
          _type: "monthly",
          _price: data.monthlyPrice,
        }),
      ),
      monthlyData: packageData?.getPackage?.data?.map((data, index) => ({
        ...data,
        no: index + 1,
        _type: "monthly",
        _price: data.monthlyPrice,
      })),
      total: packageData?.getPackage?.total,
    };
  }, [packageData, selectedRow, customQueryPackage, filter]);

  return data;
};
export default useManagePackages;
