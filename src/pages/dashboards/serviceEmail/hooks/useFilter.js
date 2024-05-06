import React from "react";

const initialState = {
  search: "",
  pageLimit: 10,
  currentPageNumber: null,
  pageRow: null,
};

const ACTION_TYPE = {
  SEARCH: "search",
  PAGE_LIMIT: "pageLimit",
  PAGE_ROW: "pageRow",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.SEARCH:
      return {
        ...state,
        currentPageNumber: 1,
        search: action.payload,
      };

    case ACTION_TYPE.PAGE_LIMIT: {
      return {
        ...state,
        currentPageNumber: 1,
        pageLimit: action.payload || null,
      };
    }

    case ACTION_TYPE.PAGE_ROW: {
      return {
        ...state,
        currentPageNumber: action.payload || null,
      };
    }

    default:
      return {
        ...state,
      };
  }
};

const useServiceFilter = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const data = React.useMemo(() => {
    return {
      ...state,
    };
  }, [state]);

  return { state, data, dispatch, ACTION_TYPE };
};

export default useServiceFilter;
