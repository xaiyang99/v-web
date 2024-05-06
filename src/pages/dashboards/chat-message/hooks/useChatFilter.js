import { useMemo, useReducer } from "react";

const initialState = {
  id: null,
};

const ACTION_TYPE = {
  ID: "id",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPE.ID:
      return {
        ...state,
        id: action.payload,
      };
  }
};

const useChatFilter = () => {
  const [state, disaptch] = useReducer(reducer, initialState);
  const data = useMemo(() => {
    return { ...state };
  }, [state]);

  return {
    state,
    data,
    ACTION_TYPE,
    disaptch,
  };
};

export default useChatFilter;
