import { useLazyQuery } from "@apollo/client";
import React from "react";
import {
  QUERY_FILES_STATISTICS,
  QUERY_FILE_COUNTRY,
  QUERY_LOG,
} from "../apollo";

const useUploadCount = (props) => {
  const [getUploadCount, { data: isUploadCount }] = useLazyQuery(
    QUERY_FILES_STATISTICS,
    {
      fetchPolicy: "no-cache",
    }
  );

  const customUploadCount = async () => {
    await getUploadCount({
      variables: {
        where: {
          actionStatus: "upload",
          updatedAtBetween: [props?.endDate, props?.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customUploadCount();
  }, [getUploadCount, props.startDate, props.endDate]);

  return {
    customUploadCount: customUploadCount,
    data: isUploadCount?.files?.data.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isUploadCount?.files?.total ?? 0,
  };
};
const useUploadSize = (props) => {
  const [getUploadSize, { data: isData }] = useLazyQuery(QUERY_LOG, {
    fetchPolicy: "no-cache",
  });
  const customUploadSize = async () => {
    await getUploadSize({
      variables: {
        where: {
          createdAt: [props.endDate, props.startDate],
          name: "upload",
        },
      },
    });
  };
  React.useEffect(() => {
    customUploadSize();
  }, [getUploadSize, props.endDate, props.startDate]);
  return {
    customUploadSize: customUploadSize,
    data: isData && isData?.getLogs?.data,
  };
};
const useUploadSuccess = (props) => {
  const [getUploadSuccess, { data: isData }] = useLazyQuery(QUERY_LOG, {
    fetchPolicy: "no-cache",
  });
  const customUploadSuccess = async () => {
    await getUploadSuccess({
      variables: {
        where: {
          createdAt: [props.endDate, props.startDate],
          name: "upload",
          status: "success",
        },
      },
    });
  };
  React.useEffect(() => {
    customUploadSuccess();
  }, [getUploadSuccess, props.endDate, props.startDate]);
  return {
    customUploadSuccess: customUploadSuccess,
    data: isData && isData?.getLogs?.data,
  };
};
const useUploadFailed = (props) => {
  const [getUploadFailed, { data: isData }] = useLazyQuery(QUERY_LOG, {
    fetchPolicy: "no-cache",
  });
  const customUploadFailed = async () => {
    await getUploadFailed({
      variables: {
        where: {
          createdAt: [props.endDate, props.startDate],
          name: "upload",
          status: "error",
        },
      },
    });
  };
  React.useEffect(() => {
    customUploadFailed();
  }, [getUploadFailed, props.endDate, props.startDate]);
  return {
    customUploadFailed: customUploadFailed,
    data: isData && isData?.getLogs?.data,
  };
};
const useUploadCountry = (props) => {
  const [getUploadContry, { data: isData }] = useLazyQuery(QUERY_FILE_COUNTRY, {
    fetchPolicy: "no-cache",
  });
  const customUploadCountry = async () => {
    await getUploadContry({
      variables: {
        where: {
          createdAtBetween: [props.endDate, props.startDate],
        },
        noLimit: true,
      },
    });
  };

  React.useEffect(() => {
    customUploadCountry();
  }, [getUploadContry, props.endDate, props.startDate]);
  return {
    customUploadCountry: customUploadCountry,
    data: isData && isData?.files?.data,
  };
};
export {
  useUploadCount,
  useUploadCountry,
  useUploadFailed,
  useUploadSize,
  useUploadSuccess,
};
