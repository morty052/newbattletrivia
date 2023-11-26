import { Dispatch, SetStateAction } from "react";
import { checkForKey } from "../../../lib/secure-store";
import { playerClass } from "../../../types/player";

export async function getPlayer(players: any) {
  const { username } = (await checkForKey()) ?? {};

  const currentPlayer = players.find(
    (player: any) => player.username === username
  );

  return currentPlayer;
}
export function isCurrentPlayer(
  currentPlayer: playerClass,
  username: string
): boolean {
  if (currentPlayer.username == username) {
    return true;
  } else {
    return false;
  }
}

type labelNames = "Name" | "Animal" | "Place" | "Thing";

type fact = {
  description: string;
  isReal: boolean;
};

type handleContestProps = {
  setContesting: Dispatch<SetStateAction<boolean>>;
  setFacts: Dispatch<SetStateAction<fact | null>>;
  // currentPlayer: null | playerClass;
};

export async function handleAnswerContest(
  answer: string,
  label: labelNames,
  props: handleContestProps
) {
  const { setContesting, setFacts } = props;
  setContesting(true);

  const queryLabel = label.toLowerCase();
  const query = `check${queryLabel}?${queryLabel}=${answer}`;
  const baseUrl = `http://192.168.100.16:3000/ai/${query}`;

  try {
    const response = await fetch(baseUrl);
    const data = await response.json();
    setFacts(data);
    const { isReal } = data;

    if (!isReal) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
  }
}
