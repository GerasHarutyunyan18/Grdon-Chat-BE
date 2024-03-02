const { Message } = require("../models/message");

const saveMessage = async (data) => {
  try {
    if (!data.text || !data.actor) {
      return {
        success: false,
        message: "Not all paramaters provided.",
      };
    }

    const message = await Message.create({ ...data });

    return { success: true, message };
  } catch {
    return {
      success: false,
      message: "Something went wrong when trying to create message.",
    };
  }
};

module.exports = { saveMessage };
