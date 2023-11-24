import { Pressable, Text } from "react-native";

type labelNames = "Name" | "Animal" | "Place" | "Thing";

export const AnswerBar = ({
  answer,
  label,
  handleContest,
}: {
  handleContest: (answer: string, label: labelNames) => void;
  answer: string;
  label: labelNames;
}) => {
  let query = "";
  let baseUrl = "";

  return (
    <Pressable
      onPress={() => handleContest(answer, label)}
      className="flex flex-row justify-between my-6"
    >
      <Text className="text-white text-lg font-semibold text-center ">
        {label}
      </Text>
      <Text className="text-white text-lg font-semibold text-center ">
        {answer}
      </Text>
    </Pressable>
  );
};
