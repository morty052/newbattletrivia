import Player from "../../../classes/Player";
import { player } from "../../../types";

const SetSinglePlayer = (CurrentPlayer: player) => {
  const {
    character,
    characterAvatar,
    lives,
    ultimates,
    status,
    statuseffects,
    peeks,
    username,
    questions,
  } = CurrentPlayer;

  const player = new Player({
    character,
    characterAvatar,
    lives,
    ultimates,
    status,
    statuseffects,
    peeks,
    username,
    questions,
  });
  console.log(characterAvatar);

  return { player };
};

export default SetSinglePlayer;
