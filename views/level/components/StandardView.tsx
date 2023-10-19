import { player } from "../../../types";
import { ActionBar, ChoiceList, Screen } from ".";
import { Socket } from "socket.io-client";
import { TstatusTypes } from "./ChoiceList";
import { View } from "react-native";
import { layout } from "../../../styles/primary";

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
  setconfused: (c: boolean) => void;
  confused: boolean;
  PowerParams: {
    answer: string;
    nextQuestion: string;
    thirdQuestion: string;
    socket: Socket;
    roomID: string;
    func: (lives: number, powerBars: number) => void;
  };
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
  PowerParams,
  room_id,
  level,
  confused,
  setconfused,
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
        confused={confused}
        setconfused={setconfused}
        correct_answer={correct_answer}
        handleAnswer={handleAnswer}
        choices={choices}
      />
      <ActionBar
        setStatusEffects={setStatusEffects}
        statusEffects={statusEffects}
        confused={confused}
        setconfused={setconfused}
        level={level}
        room_id={room_id}
        PowerParams={PowerParams}
        // correct_answer={correct_answer}
        CurrentPlayer={CurrentPlayer}
        OtherPlayers={OtherPlayers}
        scoreBoard={scoreBoard}
      />
    </>
  );
};

export default StandardView;
