interface playerClass {
  turn_id: number;
  username: string;
  status: {
    ready: boolean;
    connected: boolean;
    dead: boolean;
  };
  points: number;
}

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

class Player {
  turn_id;
  username;
  status;
  points;
  choices = [];
  constructor({ username, turn_id, status, points }: user) {
    this.turn_id = turn_id;
    this.username = username;
    this.status = status;
    this.points = points;
  }
}

export const setPlayer = (user: user): playerClass => {
  return new Player({
    username: user.username,
    turn_id: user.turn_id,
    status: user.status,
    points: user.points,
  });
};
