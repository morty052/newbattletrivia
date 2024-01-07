import { playerClass } from "../../../types/player";
import Player from "../../../classes/Player";
import { user } from "../../../types/user";

export const setPlayer = (user: user) => {
  return new Player({
    username: user.username,
    turn_id: user.turn_id,
    status: user.status,
    points: user.points,
  });
};
