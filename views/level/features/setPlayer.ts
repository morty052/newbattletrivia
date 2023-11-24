import { playerClass } from "../../../types/player";
import Player from "../../../classes/Player";

interface user {
  username: string;
  turn_id: number;
  status: {
    ready: boolean;
    connected: boolean;
    dead: boolean;
  };
  points: number;
}

export const setPlayer = (user: user): playerClass => {
  return new Player({
    username: user.username,
    turn_id: user.turn_id,
    status: user.status,
    points: user.points,
  });
};
