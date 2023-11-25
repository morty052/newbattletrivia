export interface user {
  username: string;
  turn_id: number;
  status: {
    ready: boolean;
    connected: boolean;
    dead: boolean;
  };
  points: number;
}
