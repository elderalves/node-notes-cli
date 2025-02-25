const { WebClient } = require("@slack/web-api");
const notifier = require("./slack-notifier");

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

// Mock release-it context
const testContext = {
  name: "notes-node",
  version: "2.4.1-test",
  changelog: "## Test Release\n\n* Test notification system"
};

// Run the test
console.log("Testing Slack notification system...");
notifier(testContext)
  .then(() => console.log("Test completed"))
  .catch(error => console.error("Test failed:", error));
