const { WebClient } = require("@slack/web-api");

module.exports = async function(context) {
  if (!process.env.SLACK_BOT_TOKEN) {
    console.error("Error: SLACK_BOT_TOKEN environment variable is missing");
    return;
  }

  console.log("Starting Slack notification for release...");
  console.log(`Context received:`, JSON.stringify(context, null, 2));

  const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
  const { version, changelog, name } = context;

  if (!version || !name) {
    console.error("Error: Missing required release context (version or name)");
    return;
  }

  try {
    console.log(`Sending notification to #test-notify for ${name} v${version}`);

    // 1. Clean up changelog
    const cleanChangelog = (changelog || "").trim();

    // 2. (Optional) You might want to parse out certain sections or headings.
    //    For example, if you have "## [2.9.0] ..." or "### New Features",
    //    you can do a simple replacement to make them bold or remove them:
    const slackFriendlyChangelog = cleanChangelog
      // Slack does not support # headings, so remove them or make them bold:
      .replace(/^###?\s+(.*)$/gm, "*$1*")
      // Or bullet points if you want
      .replace(/^\*\s+/gm, "• ");

    // 3. Truncate if too large (Slack has a 3001-char limit per text block).
    const maxLength = 2900; // Leave some room for formatting
    let finalChangelog =
      slackFriendlyChangelog.length > maxLength
        ? slackFriendlyChangelog.substring(0, maxLength) +
          "...\n\n_Note: Changelog truncated. See full release notes on GitHub._"
        : slackFriendlyChangelog;

    // 4. Build an array of blocks
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `:rocket: New Release: ${name} v${version}`,
          emoji: true
        }
      },
      // Optional divider for visual separation
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          // You can label this however you want:
          text: `*Changelog*\n\n${finalChangelog}`
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
    ];

    // 5. Post message
    const result = await slack.chat.postMessage({
      channel: "#test-notify",
      text: `:rocket: New Release: ${name} v${version}`, // Fallback text
      blocks
    });

    console.log("✅ Slack notification sent successfully:", result.ts);
    return result;
  } catch (error) {
    console.error("Failed to send Slack notification:");
    console.error("Error message:", error.message);
    if (error.data) {
      console.error("Error details:", JSON.stringify(error.data, null, 2));
    }
    return;
  }
};
