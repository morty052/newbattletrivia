import Player from "../classes/Player";
import { player } from "../types";

export const singlePlayerLevelState = {
  questions: [],
  level: 0,
  playing: false,
  ended: false,
  CurrentPlayer: "",
};

type Tstate = {
  questions: string[];
  level: number;
  playing: boolean;
  ended: boolean;
  CurrentPlayer: string | Player;
  scoreBoard: string;
};

type TpayloadProps = {
  tally?: string;
  CurrentPlayer?: string | Player;
  OtherPlayers?: player | player[];
  questions?: string[];
  name?: string;
  scores?: string;
  func?: () => void;
  winner?: [];
  powerUsed?: string;
};
export type IActionProps =
  | { type: "START_GAME"; payload: TpayloadProps }
  | { type: "FETCH_QUESTIONS"; payload: TpayloadProps }
  | { type: "POWER_USED"; payload: TpayloadProps }
  | { type: "PROGRESS_LEVEL"; payload: TpayloadProps }
  | { type: "PLAYER_DEATH"; payload: TpayloadProps }
  | { type: "END_GAME"; payload: TpayloadProps };

const singlePlayerLevelreducer = (state: Tstate, action: IActionProps) => {
  const { level } = state;
  const { type, payload } = action;
  let remainingPlayers;

  const removePlayer = (res: string) => {
    const remainingPlayers = allPlayers.filter((p) => p.username != res);
    console.log(remainingPlayers);
    return remainingPlayers;
  };

  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        playing: true,
        CurrentPlayer: action.payload.CurrentPlayer,
        questions: action.payload.questions,
      };

    case "FETCH_QUESTIONS":
      return { ...state, questions: action.payload.questions };

    case "POWER_USED":
      // action.payload.func();
      return { ...state };

    case "PROGRESS_LEVEL":
      return { ...state, level: level + 1 };

    case "PLAYER_DEATH":
      remainingPlayers = removePlayer(action.payload.name as string);
      return { ...state, allPlayers: remainingPlayers };

    case "END_GAME":
      return {
        ...state,
        ended: true,
      };
    default:
      return { ...state };
  }
};

export default singlePlayerLevelreducer;
