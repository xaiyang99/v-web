import React, { useMemo } from "react";

const initialState = {
  type: "monthly",
};

const ACTION_TYPE = {
  TYPE: "type",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.TYPE:
      return { ...state, type: action.payload || null };
    default:
      return;
  }
};

const useFilter = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const data = useMemo(() => {
    return { ...state };
  }, [state]);
  return { state, data, dispatch, ACTION_TYPE };
};

export default useFilter;
