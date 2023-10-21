import express from "express";
import http from "http";
import { createServer } from "http";
import { Server } from "socket.io";
import client, { urlFor } from "./client.js";
import { LobbyEvents, MatchEvents } from "./events.js";

const app = express();
const server = createServer(app);
app.use(express.json());
// const io = new Server(server);
const io = new Server("5000", {
  cors: {
    origin: "*",
  },
});
const userNamespace = io.of("/user");

userNamespace.on("connect", (socket) => {
  console.log("Hanshake received");
  socket.on("handshake", async (data) => {
    const { username, isGuest } = data;

    console.log("Hanshake received");

    if (isGuest) {
      console.log("its a guest");
      return;
    }

    console.log(username);
    const query = `*[_type == "users" && username == "${username}"]`;
    try {
      const user = await client
        .fetch(query)
        .then((res) => res[0])
        .catch((error) => {
          throw console.log(error);
        });

      const user_id = user._id;

      if (!user) {
        throw "something went wrong";
      }

      socket.join(`user_${username}`);

      await client
        .patch(user_id)
        .set({ socket: socket.id, online: true })
        .commit()
        .then(() => console.log(`user_${username} is now online`))
        .catch((error) => {
          throw console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("MESSAGE", (data) => {
    const { _id } = data;
    userNamespace.to(`user_${_id}`).emit("NEW_MESSAGE", "HELLO CODER");
  });

  socket.on("USER_CONNECTED", async (data, cb) => {
    console.log("user connected");
    const { username } = data;
    const query = `*[_type == "users" && username == "${username}"]`;
    const id = await client.fetch(query).then((res) => res[0]._id);

    cb(id);
  });

  MatchEvents(socket, userNamespace);

  LobbyEvents(socket, userNamespace);
});

// Socket.IO event handlers
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });

//   // Handle custom events
//   socket.on('chat message', (message) => {
//     console.log('Received message:', message);
//     // Broadcast the message to all connected clients
//     io.emit('chat message', message);
//   });
// });

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/characters", async (req, res) => {
  console.log("request received");
  const query = `*[_type == "characters"]`;
  const characters = await client.fetch(query).then((res) => res);

  // map through list to replace avatar with readable url
  const list = characters.map((character) => ({
    ...character,
    avatar: urlFor(character.avatar).url(),
  }));

  res.send({
    characters: list,
  });
});

app.post("/friends", async (req, res) => {
  const body = req.body;

  try {
    console.log(body);
    const { username } = body;
    console.log("this is", username);
    if (!username) {
      throw new Error("username not found");
    }
    const playerQuery = `*[_type == "users" && username == "${username}"]{friends[] -> {...}}`;
    const players = await client.fetch(playerQuery).then((res) => res[0]);
    if (!players) {
      throw new Error("user not found");
    }
    const { friends } = players;
    const onlineFriends = friends.filter((friend) => friend.online);

    res.send({
      onlineFriends,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/players", async (req, res) => {
  const body = req.body;
  console.log("request for players received");

  if (!body || !body.username) {
    const playerQuery = `*[_type == "users" && online]`;

    const list = await client.fetch(playerQuery).then((res) => res);

    res.send({
      players: list,
    });
    return;
  }

  // * GET USERNAME FROM BODY
  const username = body.username;

  // * SEARCH FOR ONLINE PLAYERS
  const playerQuery = `*[_type == "users" && online]`;

  const list = await client.fetch(playerQuery).then((res) => res);

  /*
   * FILTER OUT CURRENT PLAYER
   * FROM LIST TO SEND BACK TO CLIENT SIDE
   */
  const players = list.filter((player) => player.username != username);

  res.send({
    players,
  });
});

app.get("/leaderboard", async (req, res) => {
  console.log("request for players received");

  const playerQuery = `*[_type == "users"] | order(alltimescore asc)`;

  const list = await client.fetch(playerQuery).then((res) => res);

  res.send({
    players: list,
  });
});

export { io };
