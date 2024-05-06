import React from "react";

const useBreadcrumbData = (inputPath, filename) => {
  const data = React.useMemo(() => {
    if (inputPath || filename) {
      return [inputPath, filename]
        .join("/")
        .split("/")
        .filter((data) => data);
    }
  }, [inputPath, filename]);

  return data;
};

export default useBreadcrumbData;
