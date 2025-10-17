const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

const SendSmS = async (to, message) => {
  await client.messages.create({
    from: to,
    body: message,
  });
};

module.exports= SendSmS;