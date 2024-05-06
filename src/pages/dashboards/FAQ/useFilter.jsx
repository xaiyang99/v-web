import React, { useMemo } from "react";

const initialState = {
  pageLimit: 10,
  question: null,
};

const ACTION_TYPE = {
  PAGE_LIMIT: "limit",
  SEARCH_QUESTION: "question",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.PAGE_LIMIT:
      return { ...state, pageLimit: action.payload || null };
    case ACTION_TYPE.SEARCH_QUESTION:
      return { ...state, question: action.payload || null };
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
