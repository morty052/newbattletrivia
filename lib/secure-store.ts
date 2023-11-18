import * as SecureStore from "expo-secure-store";

export async function save(key: string, value: any) {
  await SecureStore.setItemAsync(key, value);
}

export async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    alert("No values stored under that key.");
  }
}

export const checkForKey = async (): Promise<{
  _id: string;
  username: string | undefined;
} | null> => {
  const _id = await getValueFor("_id");
  const username = await getValueFor("username");
  if (_id) {
    return {
      _id,
      username,
    };
  } else {
    console.info("key not found");
    return null;
  }
};
