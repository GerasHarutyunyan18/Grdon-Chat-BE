const { Message } = require("../../models/message");

const getAll = async (req, res) => {
  try {
    const messages = await Message.find();

    res.send({ success: true, messages });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

module.exports = { getAll };
