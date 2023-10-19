// @ts-nocheck

import { StyleSheet } from "react-native";

const primary = StyleSheet.create({
  basicText: {
    color: "#000000",
  },
  layout: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 10,
    backgroundColor: "grey",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 25,
    fontWeight: "600",
    color: "white",
  },
});

export const tw = {
  layout: " flex-1  bg-[#000000] py-28 ",
};

const { basicText, layout, button, buttonText } = primary;

export { basicText, layout, button, buttonText };

export default primary;
