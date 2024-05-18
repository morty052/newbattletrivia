const state = {
  inspecting: null,
  contesting: false,
  facts: null,
  tally: null,
  viewingFinalTally: false,
  score: 0,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "INSPECTING":
      return {
        ...state,
        inspecting: true,
      };
    case "CONTESTING":
      return {
        ...state,
        inspecting: true,
      };
    case "VIEW_FINAL_TALLY":
      return {
        ...state,
        inspecting: true,
      };
    default:
      return state;
  }
};
