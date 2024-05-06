import { useEffect, useRef } from "react";

// Custom hook to get the previous value of a prop or state

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePrevious;
