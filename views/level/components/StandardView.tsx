import { player } from "../../../types";
import ActionBar from "./actionbar/ActionBar";
import ChoiceList from "./ChoiceList";
import Screen from "./Screen";
import { Socket } from "socket.io-client";
import { TstatusTypes } from "./ChoiceList";

type IViewProps = {
  CurrentPlayer: player;
  OtherPlayers: player[];
  choices: string[];
  question: string;
  handleAnswer: (a: string) => void;
  correct_answer: string;
  scoreBoard: [];
  room_id: string;
  level: number;
  statusEffects: TstatusTypes | undefined;
  setStatusEffects: (e: TstatusTypes) => void | undefined;
};

const StandardView = ({
  CurrentPlayer,
  OtherPlayers,
  choices,
  question,
  handleAnswer,
  correct_answer,
  scoreBoard,
  room_id,
  level,
  setStatusEffects,
  statusEffects,
}: IViewProps) => {
  // TODO: REMOVE USELESS PARAMETERS
  return (
    <>
      <Screen question={question} CurrentPlayer={CurrentPlayer} />
      <ChoiceList
        setStatusEffects={setStatusEffects}
        statusEffects={statusEffects}
        correct_answer={correct_answer}
        handleAnswer={handleAnswer}
        choices={choices}
      />
      <ActionBar
        level={level}
        room_id={room_id}
        CurrentPlayer={CurrentPlayer}
        OtherPlayers={OtherPlayers}
        scoreBoard={scoreBoard}
      />
    </>
  );
};

export default StandardView;
