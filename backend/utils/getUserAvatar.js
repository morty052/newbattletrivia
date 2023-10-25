import client, { urlFor } from "../client";

/**
 * Retrieves the avatar of a user based on their username.
 *
 * @param {string} username - The username of the user.
 * @return {string} The URL of the user's avatar.
 */

export default async function getUserAvatar(username) {
  try {
    const userQuery = `*[_type == "users" && username == "${username}"]{character -> {avatar}}`;
    const queryData = await client.fetch(userQuery);
    const user = await queryData[0];

    const avatar = urlFor(user?.character?.avatar).url();

    if (!user) {
      throw new Error("user not found");
    }

    return avatar;
  } catch (error) {
    console.log(error);
  }
}
