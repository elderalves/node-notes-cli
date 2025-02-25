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

    // Get the first section of the changelog (usually current release notes)
    const truncatedChangelog = changelog
      ? changelog.split("\n\n## ")[0].trim()
      : "No changelog available";

    // Ensure the changelog doesn't exceed Slack's limit
    const maxLength = 2900; // Leave some room for formatting
    const finalChangelog =
      truncatedChangelog.length > maxLength
        ? truncatedChangelog.substring(0, maxLength) +
          "...\n\n_Note: Changelog truncated. See full release notes on GitHub._"
        : truncatedChangelog;

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
            text: finalChangelog
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
