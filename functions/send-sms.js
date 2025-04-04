const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = async (req, res) => {
  const { to, message } = req.body;

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("SMS error:", error);
    res.status(500).json({ error: error.message });
  }
};