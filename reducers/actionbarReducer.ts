interface IStateProps {
  userTrayOpen: boolean;
  Lives: number;
  PowerBars: number;
  UltimateBars: number;
  CurrentPlayer?: any;
  statusEffects: "";
}

interface IActionTypes {
  type:
    | "INIT"
    | "OPEN_TRAY"
    | "CLOSE_TRAY"
    | "USE_POWER"
    | "USE_ULTIMATE"
    | "DEBUFF";
  payload: IpayLoad;
}

interface IpayLoad {
  lives?: number;
  powerBars?: number;
  name?: string;
  CurrentPlayer: {
    lives: number;
    powerBars: number;
  };
}

export const actionbarState: IStateProps = {
  userTrayOpen: false,
  Lives: 0,
  PowerBars: 0,
  UltimateBars: 0,
  CurrentPlayer: "",
  statusEffects: "",
};

export default function actionbarReducer(
  state: IStateProps,
  action: IActionTypes
) {
  const { PowerBars, UltimateBars, Lives, CurrentPlayer } = state;
  const { type, payload } = action;

  const { lives } = CurrentPlayer;

  function handleUltimate(): IStateProps {
    switch (action.payload.name) {
      case "Arhuanran":
        return {
          ...state,
          PowerBars: PowerBars - 1,
          UltimateBars: UltimateBars - 1,
        };
      case "Ife":
        if (!Lives) {
          return { ...state };
        }
        return {
          ...state,
          Lives: Lives + 1,
          PowerBars: PowerBars - 2,
          UltimateBars: UltimateBars - 1,
        };
      case "Washington":
        if (!action.payload) {
          return { ...state };
        }
        // @ts-ignore
        return { ...state, PowerBars: action.payload.powerBars };
      case "Da Vinci":
        console.log("da vinci don use ultimate");
        return {
          ...state,
          PowerBars: PowerBars - 1,
          UltimateBars: UltimateBars - 1,
        };
      default:
        return { ...state };
    }
  }

  //* SET UI DISPLAY VALUES FROM CURRENT PLAYER
  function handleInit(player: player) {
    const { lives, powerBars, ultimateBars } = player;
    return {
      ...state,
      Lives: lives,
      PowerBars: powerBars,
      UltimateBars: ultimateBars,
    };
  }

  switch (type) {
    case "INIT":
      return handleInit(payload.CurrentPlayer as player);
    case "OPEN_TRAY":
      return { ...state, userTrayOpen: true };
    case "CLOSE_TRAY":
      return { ...state, userTrayOpen: false };
    case "USE_ULTIMATE":
      return handleUltimate();
    case "USE_POWER":
      return { ...state };

    // * DISPLAY DEBUFF AND SENDER
    case "DEBUFF":
      // @ts-ignore
      message.info(`${action.payload.sender}  ${action.payload.debuff} you `);
      return { ...state, Lives: Lives - 1 };
    default:
      return { ...state };
  }
}
