const { WebClient } = require("@slack/web-api");

async function testSlack() {
  const token = process.env.SLACK_BOT_TOKEN;
  const slack = new WebClient(token);

  console.log("Testing Slack connection...");

  try {
    // First, list all channels
    const result = await slack.conversations.list({
      types: "public_channel,private_channel"
    });

    console.log("Available channels:");
    result.channels.forEach(channel => {
      console.log(`- ${channel.name} (${channel.id})`);
    });

    // Try to send a test message
    const channel = "#test-notify";
    console.log(`\nTrying to send message to ${channel}`);

    const message = await slack.chat.postMessage({
      channel,
      text: "Test message"
    });

    console.log("Message sent successfully!", message.ts);
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Full error:", JSON.stringify(error, null, 2));
  }
}

testSlack().catch(console.error);
