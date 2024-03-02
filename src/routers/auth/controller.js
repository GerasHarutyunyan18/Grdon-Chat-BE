const { User } = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const secretKey = "grdon";

const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    // checking parameters
    if (!username || !password) {
      return res.send({
        success: false,
        message: "Not all parameters are provided.",
      });
    }

    // checking is user exist under provided username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.send({
        success: false,
        message: "User with that username already exist.",
      });
    }

    // hashing password
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ username, password: hash });

    // generating jwt token for cre
    const payload = { user_id: user._id };
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    res.send({ success: true, user, token });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

const checkToken = async (req, res) => {
  try {
    const { token } = req.params;

    let userId;
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error("Error decoding token:", err);
      } else {
        userId = decoded.user_id;
        // You can access the payload properties here
      }
    });

    if (!userId) {
      return res.send({ success: false, message: "Wrong verification token." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.send({ success: false, message: "User not found." });
    }

    res.send({ success: true, user });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

module.exports = { signUp, checkToken };
