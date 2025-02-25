const { WebClient } = require("@slack/web-api");

const token = "token_here";
const slack = new WebClient(token);

async function testSlack() {
  try {
    const result = await slack.auth.test();
    console.log("Authentication test result:", result);

    const channelResult = await slack.conversations.list({
      types: "public_channel,private_channel"
    });
    console.log(
      "\nAvailable channels:",
      channelResult.channels.map(c => ({ name: c.name, id: c.id }))
    );
  } catch (error) {
    console.error("Error details:", {
      error: error.message,
      code: error.code,
      data: error.data
    });
  }
}

testSlack();
