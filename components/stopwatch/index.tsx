import { View, Text } from "react-native";
import { useState, useEffect } from "react";

type Props = {
  playing: boolean;
  timeUp: boolean;
  setTimeUp: React.Dispatch<React.SetStateAction<boolean>>;
};

export const StopWatch = ({ playing, timeUp, setTimeUp }: Props) => {
  const [time, setTime] = useState(30);
  // const [timeUp, setTimeUp] = useState(false);

  const decTimer = () => {
    if (time == 0) {
      return;
    }
    setTime((prev) => prev - 1);
  };

  // useEffect(() => {
  //   if (!playing) {
  //     return;
  //   }

  //   setTime(30);
  // }, [playing]);

  useEffect(() => {
    if (!playing) {
      // setTime(30);
      return;
    }

    const time = setInterval(decTimer, 1000);
    return () => {
      clearInterval(time);
    };
  }, [time, playing]);

  return (
    <View>
      <Text>{!timeUp ? time : "TimeUp"}</Text>
    </View>
  );
};

export const useStopWatch = (playing: boolean) => {
  const [time, setTime] = useState(10);
  const [timeUp, setTimeUp] = useState(false);

  const decTimer = () => {
    if (time == 0) {
      setTimeUp(true);
      return;
    }
    setTime((prev) => prev - 1);
  };

  // useEffect(() => {
  //   if (!playing) {
  //     return;
  //   }

  //   setTime(30);
  // }, [playing]);

  useEffect(() => {
    if (!playing) {
      setTime(10);
      setTimeUp(false);
      return;
    }

    const time = setInterval(decTimer, 1000);
    return () => {
      clearInterval(time);
    };
  }, [time, playing]);

  return {
    time,
    timeUp,
    setTimeUp,
  };
};

export default StopWatch;
