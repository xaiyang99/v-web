import React from "react";
import moment from "moment";

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
  username: null,
  comment: null,
  search: null,
  fileDrop: null,
};

const ACTION_TYPE = {
  CREATED_AT_START_DATE: "created_at_start_date",
  CREATED_AT_END_DATE: "created_at_end_date",
  OWNER: "owner",
  STATUS: "status",
  FILE_TYPE: "file_type",
  FILE_NAME: "file_name",
  PAGE_ROW: "page_row",
  PAGINATION: "pagination",
  ORDERBY_MOST_DOWNLOAD: "orderBy_most_download",
  USER_NAME: "username",
  COMMENT: "comment",
  SEARCH: "search",
  FILE_DROP: "file_drop",
};

const reducer = (state, action) => {
  const startDate = moment(state.createdAt.startDate);
  const endDate = moment(state.createdAt.endDate);
  switch (action.type) {
    case ACTION_TYPE.CREATED_AT_START_DATE:
      return {
        ...state,
        createdAt: {
          ...state.createdAt,
          startDate: action.payload,
          ...(endDate.isValid() &&
            moment(action.payload).isAfter(endDate) && {
              endDate: action.payload,
            }),
          ...(!action.payload && {
            endDate: null,
          }),
        },
        ...(action.payload &&
          state.createdAt.endDate && {
            currentPageNumber: 1,
          }),
      };
    case ACTION_TYPE.CREATED_AT_END_DATE:
      return {
        ...state,
        createdAt: {
          ...state.createdAt,
          endDate: action.payload,
          ...(startDate.isValid() &&
            startDate.isAfter(action.payload) && {
              startDate: action.payload,
            }),
          ...(!startDate.isValid() && {
            startDate: action.payload,
          }),
        },
        ...(action.payload &&
          state.createdAt.startDate && {
            currentPageNumber: 1,
          }),
      };
    case ACTION_TYPE.OWNER:
      return { ...state, owner: action.payload || null, currentPageNumber: 1 };
    case ACTION_TYPE.FILE_DROP:
      return {
        ...state,
        fileDrop: action.payload || null,
        currentPageNumber: 1,
      };
    case ACTION_TYPE.STATUS:
      return { ...state, status: action.payload || null, currentPageNumber: 1 };
    case ACTION_TYPE.FILE_TYPE:
      return {
        ...state,
        fileType: action.payload || null,
        currentPageNumber: 1,
      };
    case ACTION_TYPE.FILE_NAME:
      return {
        ...state,
        filename: action.payload || null,
        currentPageNumber: 1,
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
    case ACTION_TYPE.ORDERBY_MOST_DOWNLOAD:
      return { ...state, orderByMostDownload: action.payload || null };
    case ACTION_TYPE.USER_NAME:
      return {
        ...state,
        username: action.payload || null,
        currentPageNumber: 1,
      };
    case ACTION_TYPE.COMMENT:
      return {
        ...state,
        comment: action.payload || null,
        currentPageNumber: 1,
      };
    case ACTION_TYPE.SEARCH:
      return {
        ...state,
        search: action.payload || null,
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
    const startDate = moment(state.createdAt.startDate);
    const endDate = moment(state.createdAt.endDate);
    return {
      ...state,
      createdAt: {
        ...state.createdAt,
        startDate: startDate.isValid() ? startDate.format("YYYY-MM-DD") : null,
        endDate: endDate.isValid() ? endDate.format("YYYY-MM-DD") : null,
      },
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
