import moment from "moment";
import React, { useMemo } from "react";

const initialState = {
  id: null,
  pageLimit: 10,
  currentPageNumber: 1,
  search: null,
  status: null,
  department: null,
  pageRow: null,
  email: null,
  customer: null,
  createdAt: {
    startDate: null,
    endDate: null,
  },
  createdBy: null,
};

const ACTION_TYPE = {
  ID: "id",
  PAGE_LIMIT: "limit",
  CREATED_BY: "createdBy",
  SEARCH: "search",
  STATUS: "status",
  PAGE_ROW: "page_row",
  PAGINATION: "pagination",
  CUSTOMER: "customer",
  CREATED_AT_START_DATE: "created_at_start_date",
  CREATED_AT_END_DATE: "created_at_end_date",
};

const reducer = (state, action) => {
  const startDate = moment(state.createdAt.startDate);
  const endDate = moment(state.createdAt.endDate);
  switch (action.type) {
    case ACTION_TYPE.CREATED_AT_START_DATE:
      return {
        ...state,
        createdAt: {
          ...state.createdAtStart,
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

    case ACTION_TYPE.CREATED_BY:
      return { ...state, createdBy: action.payload, currentPageNumber: 1 };

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

    case ACTION_TYPE.ID:
      return {
        ...state,
        id: action.payload,
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

    case ACTION_TYPE.STATUS:
      return { ...state, currentPageNumber: 1, status: action.payload };

    case ACTION_TYPE.CUSTOMER:
      return { ...state, currentPageNumber: 1, status: action.payload };

    case ACTION_TYPE.PAGINATION:
      return {
        ...state,
        currentPageNumber: action.payload || null,
      };

    case ACTION_TYPE.PAGE_LIMIT:
      return {
        ...state,
        currentPageNumber: 1,
        pageLimit: action.payload || null,
      };

    case ACTION_TYPE.SEARCH:
      return { ...state, currentPageNumber: 1, search: action.payload || null };

    default:
      return;
  }
};

const useTicket = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const data = useMemo(() => {
    return { ...state };
  }, [state]);
  return { state, data, dispatch, ACTION_TYPE };
};

export default useTicket;
