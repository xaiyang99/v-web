import { useEffect, useRef } from "react";
import isEqual from "lodash/isEqual";

// Custom hook for deep object comparison

const useDeepEqualEffect = (callback, obj) => {
  const prevObjRef = useRef();

  useEffect(() => {
    if (!isEqual(obj, prevObjRef.current)) {
      callback();
    }
    prevObjRef.current = obj;
  }, [obj, callback]);
};

export default useDeepEqualEffect;
