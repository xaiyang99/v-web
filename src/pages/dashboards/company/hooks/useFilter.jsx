import React, { useMemo } from "react";

const initialState = {
  pageLimit: 10,
  search: null,
};

const ACTION_TYPE = {
  PAGE_LIMIT: "limit",
  SEARCH: "search",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.PAGE_LIMIT:
      return { ...state, pageLimit: action.payload || null };
    case ACTION_TYPE.SEARCH:
      return { ...state, search: action.payload || null };
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
