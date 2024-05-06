import React from "react";

const initialState = {
  pageRow: null,
  createdAt: {
    startDate: null,
    endDate: null,
  },
  owner: null,
  status: null,
  pageLimit: 10,
  currentPageNumber: 1,
};

const ACTION_TYPE = {
  STATUS: "status",
  COUNTRY_NAME: "country_name",
  PAGE_ROW: "page_row",
  PAGINATION: "pagination",
  FIRST_NAME: "first_name",
  ROLE: "role",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.STATUS:
      return { ...state, status: action.payload || null, currentPageNumber: 1 };
    case ACTION_TYPE.ROLE:
      return { ...state, role: action.payload || null, currentPageNumber: 1 };
    case ACTION_TYPE.FIRST_NAME:
      return {
        ...state,
        firstName: action.payload || null,
        currentPageNumber: 1,
      };
    case ACTION_TYPE.COUNTRY_NAME:
      return {
        ...state,
        country_name: action.payload || null,
      };
    case ACTION_TYPE.PAGE_ROW:
      return {
        ...state,
        pageRow: action.payload || null,
        ...(action.payload && {
          pageLimit: action.payload,
        }),
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

const useFilter = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const data = React.useMemo(() => {
    return {
      ...state,
    };
  }, [state]);

  return {
    state,
    data,
    dispatch,
    ACTION_TYPE,
  };
};

export default useFilter;
