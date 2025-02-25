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

    // Clean up changelog by removing initial newlines and getting first section
    const cleanChangelog = changelog ? changelog.trim() : "";
    const sections = cleanChangelog.split("\n\n## ");
    const latestSection =
      sections.length > 1 ? "## " + sections[1] : sections[0];

    // Ensure we have some content
    const truncatedChangelog =
      latestSection || "No changelog details available";

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
            text: `:rocket: New Release: ${name} v${version}`,
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: finalChangelog
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `<https://github.com/elderalves/node-notes-cli/releases/tag/v${version}|View full release on GitHub>`
            }
          ]
        }
      ]
    });

    console.log("✅ Slack notification sent successfully:", result.ts);
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
