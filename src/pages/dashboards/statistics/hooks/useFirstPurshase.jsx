import { useLazyQuery } from "@apollo/client";
import React from "react";
import {
  QUERY_FIRSTPURCHASE,
  QUERY_REBILLSPURCHASE,
  QUERY_TOTALPURCHASE,
  QUERY_REFUNDS,
} from "../apollo";

const useFirstPurchase = (props) => {
  const [getFirtPurchase, { data: isData }] = useLazyQuery(
    QUERY_FIRSTPURCHASE,
    {
      fetchPolicy: "no-cache",
    }
  );

  const customQuerypurchase = async () => {
    await getFirtPurchase({
      variables: {
        where: {
          orderedAtBetween: [props.endDate, props.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customQuerypurchase();
  }, [getFirtPurchase, props.startDate, props.endDate]);

  return {
    customQuerypurchase: customQuerypurchase,
    data: isData && isData?.queryPurchases?.firstPurchaseAccount,
  };
};

const useRebillsPurchase = (props) => {
  const [getRebills, { data: isData }] = useLazyQuery(QUERY_REBILLSPURCHASE, {
    fetchPolicy: "no-cache",
  });
  const customQueryRebills = async () => {
    await getRebills({
      variables: {
        where: {
          orderedAtBetween: [props.endDate, props.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customQueryRebills();
  }, [getRebills, props.startDate, props.endDate]);

  return {
    customQueryRebills: customQueryRebills,
    data: isData && isData?.queryPurchases?.RebillsCount,
  };
};
const useTotalPurchase = (props) => {
  const [getTotalPurchase, { data: isData }] = useLazyQuery(
    QUERY_TOTALPURCHASE,
    {
      fetchPolicy: "no-cache",
    }
  );
  const customTotalPurchase = async () => {
    await getTotalPurchase({
      variables: {
        where: {
          orderedAtBetween: [props.endDate, props.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customTotalPurchase();
  }, [getTotalPurchase, props.endDate, props.startDate]);

  return {
    customTotalPurchase: customTotalPurchase,
    data: isData && isData?.queryPurchases?.TotalPurchaseCount,
  };
};
const useRefundPurchase = (props) => {
  const [getRefund, { data: isData }] = useLazyQuery(QUERY_REFUNDS, {
    fetchPolicy: "no-cache",
  });
  const customRefund = async () => {
    await getRefund({
      variables: {
        where: {
          orderedAtBetween: [props.endDate, props.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customRefund();
  }, [getRefund, props.endDate, props.startDate]);

  return {
    customRefund: customRefund,
    data: isData && isData?.queryPurchases?.RefundsCount,
  };
};
export {
  useFirstPurchase,
  useRebillsPurchase,
  useTotalPurchase,
  useRefundPurchase,
};
