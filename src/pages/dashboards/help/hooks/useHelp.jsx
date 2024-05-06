import React from "react";

const initialState = {
  pageLimit: 10,
  title: null,
  pageRow: null,
  currentPageNumber: 1,
};
const ACTION_TYPE = {
  PAGE_ROW: "page_row",
  TITLE: "title",
  PAGINATION: "pagination",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.PAGE_ROW:
      return {
        ...state,
        pageRow: action.payload || null,
        ...(action.payload && {
          pageLimit: action.payload,
        }),
        currentPageNumber: 1,
      };
    case ACTION_TYPE.TITLE:
      return {
        ...state,
        title: action.payload || null,
        currentPageNumber: 1,
      };
    case ACTION_TYPE.PAGINATION:
      return {
        ...state,
        currentPageNumber: action.payload || null,
      };
    default:
      return;
  }
};
const useHelp = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const data = React.useMemo(() => {
    return { ...state };
  }, [state]);
  return { data, state, dispatch, ACTION_TYPE };
};
export default useHelp;
