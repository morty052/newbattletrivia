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

type labelNames = "Name" | "Animal" | "Place" | "Thing";

type fact = {
  description: string;
  isReal: boolean;
};

type handleContestProps = {
  setContesting: Dispatch<SetStateAction<boolean>>;
  setFacts: Dispatch<SetStateAction<fact | null>>;
  currentPlayer: playerClass;
};

export async function handleAnswerContest(
  answer: string,
  label: labelNames,
  props: handleContestProps
) {
  const { setContesting, setFacts, currentPlayer } = props;
  setContesting(true);

  const queryLabel = label.toLowerCase();
  const query = `check${queryLabel}?${queryLabel}=${answer}`;
  const baseUrl = `http://192.168.100.16:3000/ai/${query}`;

  try {
    console.log("this is label", label);
    console.log("this is url", baseUrl);
    const response = await fetch(baseUrl);
    const data = await response.json();
    console.log(data);
    setFacts(data);
    const { isReal } = data;

    if (!isReal) {
      console.log("check came back as", isReal);
      currentPlayer;
    }
  } catch (error) {
    console.error(error);
  }
}
