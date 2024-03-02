const express = require("express");
const { signUp, checkToken } = require("./controller");

const AuthRouter = express.Router();

AuthRouter.post("/signup", signUp);
AuthRouter.get("/verify/:token", checkToken);

module.exports = AuthRouter;
