export const levelState = {
  index: 0,
  activeLetter: "",
  selectingLetter: true,
  finished: false,
  playing: false,
  currentTurn: 1,
  players: [],
  userId: null,
  maxTurns: 0,
};

export const levelReducer = (state: any, action: any) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        ...action.payload,
        userId: action.payload.turn_id,
      };

    case "SET_LETTER":
      return {
        ...state,
        ...action.payload,
        selectingLetter: false,
        // currentTurn: state.currentTurn + 1,
      };

    case "SET_TURN":
      return {
        ...state,
        ...action.payload,
      };

    case "END_ROUND":
      return {
        ...state,
        selectingLetter: true,
      };
    default:
      return state;
  }
};
