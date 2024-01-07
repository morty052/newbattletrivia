export const levelState = {
  index: 0,
  activeLetter: null,
  selectingLetter: true,
  finished: false,
  playing: false,
  tallying: false,
  currentTurn: 1,
  players: [],
  userId: null,
  maxTurns: 0,
  currentPlayer: [],
  game: null,
};

export const levelReducer = (state: any, action: any) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        game: action.payload,
      };

    case "SWITCH_LETTER":
      return {
        ...state,
        activeLetter: action.payload,
        selectingLetter: false,
        tallying: false,
        playing: true,
        // currentTurn: state.currentTurn + 1,
      };

    case "SWITCH_TURN":
      if (action.payload > state.maxTurns) {
        return {
          ...state,
          currentTurn: 1,
          selectingLetter: true,
        };
      } else {
        return {
          ...state,
          selectingLetter: true,
          currentTurn: action.payload,
        };
      }

    case "END_ROUND":
      return {
        ...state,
        playing: false,
        currentTurn: action.payload,
      };

    case "ROUND_ENDED":
      return {
        ...state,
        playing: false,
        tallying: true,
        currentTurn: action.payload,
      };
    case "START_TALLY":
      return {
        ...state,
        playing: false,
        tallying: true,
      };
    case "FINISH_TALLY":
      return {
        ...state,
        tallying: false,
        selectingLetter: true,
      };
    default:
      return state;
  }
};
