const { WebClient } = require("@slack/web-api");

module.exports = async function(context) {
  console.log("Starting Slack notification process...");
  console.log("Context received:", JSON.stringify(context, null, 2));

  if (!process.env.SLACK_BOT_TOKEN) {
    throw new Error("SLACK_BOT_TOKEN environment variable is required");
  }

  if (!context || !context.version || !context.name) {
    throw new Error(
      `Invalid context provided. Required: version and name. Received: ${JSON.stringify(
        context
      )}`
    );
  }

  const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
  const { version, changelog, name } = context;
  const channel = process.env.SLACK_CHANNEL || "test-notify";

  console.log(`Attempting to send notification to channel: ${channel}`);

  try {
    const result = await slack.chat.postMessage({
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

    console.log("Slack notification sent successfully:", result.ts);
    return result;
  } catch (error) {
    console.error("Failed to send Slack notification:", error);
    throw error; // Re-throw to ensure the error is visible in the release process
  }
};
