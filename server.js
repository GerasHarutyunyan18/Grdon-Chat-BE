const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const AuthRouter = require("./src/routers/auth/route");
const { saveMessage } = require("./src/messages/actions");
const MessageRouter = require("./src/routers/messages/route");

const mongoURI = "mongodb+srv://root:geras2004.@cluster0.p7ntirq.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "*",
  })
);

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", async (msg) => {
    const message = await saveMessage(msg);
    console.log("message: ", message);
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use("/auth", AuthRouter);
app.use("/message", MessageRouter);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
