const { WebClient } = require("@slack/web-api");

module.exports = async function(context) {
  if (!process.env.SLACK_BOT_TOKEN) {
    console.error("Error: SLACK_BOT_TOKEN environment variable is missing");
    // Don't throw error to avoid failing the release process
    return;
  }

  console.log("Starting Slack notification for release...");
  console.log(`Context received:`, JSON.stringify(context, null, 2));

  const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
  const { version, changelog, name } = context;

  if (!version || !name) {
    console.error("Error: Missing required release context (version or name)");
    console.log("Context received:", context);
    return;
  }

  try {
    console.log(`Sending notification to #test-notify for ${name} v${version}`);

    const result = await slack.chat.postMessage({
      channel: "#test-notify",
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
    console.error("Failed to send Slack notification:");
    console.error("Error message:", error.message);
    if (error.data) {
      console.error("Error details:", JSON.stringify(error.data, null, 2));
    }
    // Don't throw error to avoid failing the release process
    return;
  }
};
