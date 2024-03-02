const express = require("express");
const { getAll } = require("./controller");

const MessageRouter = express.Router();

MessageRouter.get("/all", getAll);

module.exports = MessageRouter;
