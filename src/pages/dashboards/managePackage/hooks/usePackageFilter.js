import { useMemo, useReducer } from "react";

const initialState = {
  id: null,
  search: null,
  pageLimit: 10,
  currentPageNumber: 1,
  pagination: 1,
};

const ACTION_TYPE = {
  ID: "id",
  SEARCH: "search",
  PAGE_LIMIT: "pageLimit",
  PAGINATION: "pagination",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.SEARCH:
      return {
        ...state,
        currentPageNumber: 1,
        search: action.payload,
      };

    case ACTION_TYPE.PAGE_LIMIT:
      return {
        ...state,
        currentPageNumber: 1,
        pageLimit: action.payload || null,
      };

    case ACTION_TYPE.PAGINATION:
      return {
        ...state,
        currentPageNumber: action.payload || null,
      };
  }
};

const usePackageFilter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const data = useMemo(() => {
    return { ...state };
  }, [state]);

  return { state, data, dispatch, ACTION_TYPE };
};

export default usePackageFilter;
