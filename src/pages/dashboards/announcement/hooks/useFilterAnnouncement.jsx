import moment from "moment";
import React from "react";

const initialState = {
  pageLimit: 10,
  title: null,
  pageRow: null,
  status: null,
  id: null,
  currentPageNumber: 1,
  createdAt: {
    startDate: null,
    endDate: null,
  },
};
const ACTION_TYPE = {
  PAGE_ROW: "page_row",
  TITLE: "title",
  PAGINATION: "pagination",
  STATUS: "status",
  ID: "id",
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
    case ACTION_TYPE.STATUS:
      return { ...state, status: action.payload || null, currentPageNumber: 1 };
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
    case ACTION_TYPE.TITLE:
      return {
        ...state,
        title: action.payload || null,
        currentPageNumber: 1,
      };
    case ACTION_TYPE.ID:
      return {
        ...state,
        id: action.payload,
      };
    default:
      return;
  }
};

const useFilterAnnouncement = () => {
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
export default useFilterAnnouncement;
