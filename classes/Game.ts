import Player from "./Player";
import alphabets from "../constants/alphabets";

export class Game {
  players: Player[] = [];
  alphabets: string[] = alphabets;
  tallying: boolean = false;
  waiting: boolean = true;
  currentTurn: number = 0;
  maxTurns: number = 0;
  activeLetter: string = "A";
  currentPlayer: Player = {} as Player;
  playing: boolean = true;
  selectingLetter: boolean = true;
  index: number = 0;

  constructor({
    players,
    currentUsername,
  }: {
    players: Player[];
    currentUsername: string;
  }) {
    this.players = players;
    this.maxTurns = players.length;
    this.currentPlayer = players.find(
      (player) => player.username == currentUsername
    ) as Player;
  }

  nextTurn = () => {
    this.currentTurn++;
    console.log(this.currentTurn);
  };
}
