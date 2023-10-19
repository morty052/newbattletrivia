import { View, Text } from "react-native";
import { useState, useEffect } from "react";

type Props = {};

const InfoPopup = (props: Props) => {
  const [visible, setvisible] = useState(true);
  const [completed, setcompleted] = useState(false);

  useEffect(() => {
    if (completed) {
      return;
    }

    setTimeout(() => {
      setvisible(false);
      setcompleted(true);
    }, 5000);
  }, []);

  return (
    <>
      {visible && (
        <View
          style={{
            position: "absolute",
            top: 50,
            width: "100%",
            backgroundColor: "red",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "50%",
              marginHorizontal: "auto",
              padding: 10,
            }}
          >
            <Text>InfoPopup</Text>
          </View>
        </View>
      )}
    </>
  );
};

export default InfoPopup;
