import React, { useMemo } from "react";

const initialState = {
  page: 0,
};

const ACTION_TYPE = {
  PAGE: "id",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.PAGE:
      return { ...state, page: action.payload || null };
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
