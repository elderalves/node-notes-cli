const { WebClient } = require("@slack/web-api");

module.exports = async function(context) {
  if (!process.env.SLACK_BOT_TOKEN) {
    console.error("SLACK_BOT_TOKEN environment variable is required");
    return;
  }

  const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
  const { version, changelog, name } = context;
  const channel = process.env.SLACK_CHANNEL || "test-notify";

  try {
    await slack.chat.postMessage({
      channel,
      text: `:rocket: New Release: ${name} v${version}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `:rocket: New Release: ${name} v${version}`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: changelog || "No changelog available"
          }
        }
      ]
    });
  } catch (error) {
    console.error("Failed to send Slack notification:", error.message);
  }
};
