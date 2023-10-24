import client from "../client.js";

async function tallyScore() {
  try {
    const userQuery = `*[_type == "users" && username == "${username}"]`;
    const queryData = await client.fetch(userQuery);
    const user = await queryData[0];

    if (!user) {
      throw new Error("user not found");
    }

    const { _id: user_id, alltimescore, highscore } = user;

    const { alltimescore: NewScore } = await client
      .patch(user_id)
      .set({
        alltimescore: alltimescore + points,
        highscore: points > highscore ? points : highscore,
      })
      .commit();

    console.log("tallying single game", points);
    console.log("new score", NewScore);

    return {
      NewScore,
      alltimescore,
    };
  } catch (error) {
    console.log(error);
  }
}

export default tallyScore;
