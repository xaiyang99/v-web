import React from "react";

const useResizeObserver = (inputRef) => {
  const [resizeValue, setResizeValue] = React.useState({});

  React.useEffect(() => {
    const element = inputRef.current;

    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const computedStyle = window.getComputedStyle(element);
        const result = {
          width: parseFloat(computedStyle.width),
          paddingLeft: parseFloat(computedStyle.paddingLeft),
          paddingRight: parseFloat(computedStyle.paddingRight),
        };
        if (result !== result.width) {
          setResizeValue(result);
        }
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [resizeValue]);

  return resizeValue;
};

export default useResizeObserver;
