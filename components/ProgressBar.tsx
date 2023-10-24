import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";

const ProgressBar = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const { user, isLoaded } = useUser();
  const username = user?.username;

  const ranks = {
    base: 100,
    beginner: 200,
    rookie: 300,
    intermediate: 600,
    expert: 400,
  };

  /**
   * Divides a number by ten and returns the ten percent and remainder.
   *
   * @param {number} number - The number to be divided.
   * @return {{tenPercent: number, remainder: number}} - An object containing the ten percent and remainder.
   */
  function divideByTenAndGetTenPercent(number: number): {
    tenPercent: number;
    remainder: number;
  } {
    const result = number / 10;
    const remainder = Math.floor(result % 10);

    const tenPercent = Math.floor(result * 0.1);
    return {
      tenPercent,
      remainder,
    };
  }

  /**
   * Calculates the player level based on the number of points.
   *
   * @param {number} points - The number of points earned by the player.
   * @return {Object} - An object containing the current level and the next level.
   */

  function handlePlayerLevel(points: number) {
    const { tenPercent: level, remainder } =
      divideByTenAndGetTenPercent(points);
    const nextLevel = level + 1;
    let percentToNextLevel;

    switch (true) {
      case remainder === 0:
        percentToNextLevel = 0;
        break;
      case remainder > 0 && remainder <= 1:
        percentToNextLevel = 10;
        break;
      case remainder > 1 && remainder <= 2:
        percentToNextLevel = 20;
        break;
      case remainder > 2 && remainder <= 3:
        percentToNextLevel = 30;
        break;
      case remainder > 3 && remainder <= 4:
        percentToNextLevel = 40;
        break;
      case remainder > 4 && remainder <= 5:
        percentToNextLevel = 50;
        break;
      case remainder > 5 && remainder <= 6:
        percentToNextLevel = 60;
      case remainder > 6 && remainder <= 7:
        percentToNextLevel = 70;
        break;
      case remainder > 7 && remainder <= 8:
        percentToNextLevel = 80;
        break;
      case remainder > 8 && remainder <= 9:
        percentToNextLevel = 90;
        break;
      case remainder > 9:
        percentToNextLevel = 100;

      default:
        break;
    }

    return {
      level,
      nextLevel,
      percentToNextLevel,
    };
  }

  async function fetchUser() {
    if (!username) {
      console.log("username not found");
      return;
    }
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{"username":"${username}"}`,
    };

    const { user } = await fetch(
      "https://snapdragon-cerulean-pulsar.glitch.me/user",
      options
    )
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => console.log(err));

    setCurrentUser(user);
  }

  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  const { level, nextLevel, percentToNextLevel } = handlePlayerLevel(
    currentUser?.alltimescore
  );

  if (!currentUser || !isLoaded) {
    return null;
  }

  return (
    <View className=" bg-blue-400/90 rounded-xl shadow-xl py-2   px-2  flex mb-2">
      {/* BOOST ICON AND BUTTON */}
      <View className="flex items-center  justify-between  pb-4 flex-row ">
        <Pressable>
          <Text className="text-xl font-bold text-white">
            Boost your rank now
          </Text>
          <Text className="text-xl font-bold text-white">
            Points {currentUser?.alltimescore}
          </Text>
        </Pressable>
        <MaterialCommunityIcons
          name="chevron-double-up"
          size={35}
          color="gold"
        />
      </View>

      {/* NUMBERS */}
      <View className=" flex flex-row justify-between pr-1.5 ">
        <Text className="text-white font-bold text-xl">Level {level}</Text>
        <Text className="text-white font-bold text-xl"> {nextLevel}</Text>
      </View>

      {/* BAR CONTAINER */}
      <View className="flex flex-row items-center justify-between   pb-2">
        {/* PROGRESS BAR */}
        <View className="h-4 flex-1 flex-shrink-0 bg-gray-700/90 rounded-lg relative  ">
          {/* PROGRESS INDICATOR */}
          <View
            style={{ width: currentUser ? `${percentToNextLevel}%` : 0 }}
            className={`bg-yellow-200 h-4 rounded-lg absolute top-0 left-0 `}
          >
            <Text className="text-yellow-200">m</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProgressBar;
