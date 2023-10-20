import { shuffle } from "lodash";
import Choice from "./Choice";
import { useSocketcontext } from "../../../hooks/useSocketContext";
import { useEffect, useState } from "react";
import { Debuffs } from "../../../types";
import { useUser } from "@clerk/clerk-expo";
import { View } from "react-native";
import { fBox } from "../../../styles/utility";
// import { message } from "antd";

type Props = {
  choices: string[];
  handleAnswer: (c: string) => void;
  correct_answer: string;
  setconfused: (c: boolean) => void;
  confused: boolean;
  statusEffects: TstatusTypes | undefined;
  setStatusEffects: (e: TstatusTypes) => void | undefined;
};

export type TstatusTypes =
  | "empowered"
  | "enranged"
  | "concertrated"
  | "brainstorming"
  | "shocked"
  | "none";

const ChoiceList = ({
  choices,
  handleAnswer,
  correct_answer,
  confused,
  setconfused,
  statusEffects,
  setStatusEffects,
}: Props) => {
  const l = choices ? [correct_answer, ...choices] : [];
  const [revealed, setRevealed] = useState(true);

  const list = shuffle(l);
  const { socket } = useSocketcontext();
  const { user } = useUser();
  const username = user?.username;

  let status: null | TstatusTypes = null;

  switch (statusEffects) {
    case "brainstorming":
      console.log(statusEffects);
      status = "concertrated";
      break;
    default:
      break;
  }

  // * HANDLE PLAYER DEBUFF
  useEffect(() => {
    console.log(statusEffects);

    socket?.on(
      "DEBUFF_USED",
      (res: {
        debuff: Debuffs;
        target_name: string;
        room_id: string;
        sender: string;
      }) => {
        // GET TARGET NAME , TYPE OF DEBUFF AND SENDER FROM RESPONSE
        const { debuff, target_name, sender } = res;
        console.log(debuff);
        console.log(username);

        // APPLY DEBUFF IF TARGERT USERNAME EQUALS TARGET
        if (username == target_name) {
          console.log("This you buddy", target_name);
          console.info(`${sender} ${debuff} you from choicelist`);

          // APPLY DEBUFF
          setconfused(true);
          setStatusEffects("brainstorming");
        }
      }
    );
  }, [statusEffects, socket]);

  const shitText = "bola";

  /* 
  
  * HANDLE ANSWER
  * CLEAR STATUS EFFECTS IF ANY
  */
  const handleAnswerinteraction = (i: string) => {
    // *STATUS EFFECT CHECK
    if (confused || status) {
      setconfused(false);
      setStatusEffects("none");
      status = null;
    }
    handleAnswer(i);
  };

  function handleShowAnswer(params: type) {}

  return (
    <View style={fBox}>
      {list?.map((i: string, index: number) => (
        <Choice
          revealed={revealed}
          correct_answer={correct_answer}
          statusEffects={status}
          func={() => handleAnswerinteraction(i)}
          text={!status ? i : shitText}
          // text={!revealed ? i : correct_answer}
          key={index}
        />
      ))}
    </View>
  );
};

export default ChoiceList;
