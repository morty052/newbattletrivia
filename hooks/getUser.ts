import { checkForKey } from "../lib/secure-store";

export async function getUser() {
  const { _id, username } = (await checkForKey()) ?? {};
}
