import { checkForKey } from "../../../lib/secure-store";
import { setPlayer } from "./setPlayer";

interface initLevelProps {
  room_id: string;
  init: any;
  // setUserId: React.Dispatch<React.SetStateAction<number | null>>;
  // setMaxTurns: React.Dispatch<React.SetStateAction<number>>;
}

async function getRoom(room_id: string) {
  try {
    const url = `http://192.168.100.16:3000/users/getroom?room_id=${room_id}`;
    const res = await fetch(url);
    const data = await res.json();
    const { room } = data;
    return room;
  } catch (error) {
    console.error(error);
  }
}

async function getCurrentPlayer(players: any) {
  try {
    const { username } = (await checkForKey()) ?? {};
    if (!username) {
      throw "No username found";
    }

    const currentPlayer = players.find(
      (player: any) => player.username === username
    );

    return currentPlayer;
  } catch (error) {
    console.log(error);
  }
}

export const initLevel = async (room_id: string) => {
  try {
    const room = await getRoom(room_id);
    const { players: playersData } = room;

    // TODO: MOVE PLAYERS MAP LOGIC TO SERVER SIDE

    const players = playersData
      .map((player: any) => ({
        points: player.points,
        username: player.controller.username,
        status: player.status,
        turn_id: player.turn_id,
      }))
      .map((player: any) => {
        return setPlayer(player);
      });

    const maxTurns = players.length;
    // setMaxTurns(maxTurns);

    const currentPlayer = await getCurrentPlayer(players);
    const { turn_id: rawTurn_id } = currentPlayer;
    const turn_id = rawTurn_id + 1;
    // setUserId(turn_id + 1);

    return {
      players,
      maxTurns,
      turn_id,
      currentPlayer,
    };
  } catch (error) {
    console.error(error);
  }
};
