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

    // 1. Clean & extract only the relevant version section
    const cleanChangelog = (changelog || "").trim();
    const versionRegex = new RegExp(
      `(## \\[?${version}\\]?[^]*?)(?=## \\[|$)`,
      "i"
    );
    const match = cleanChangelog.match(versionRegex);
    let relevantChangelog = match
      ? match[1].trim()
      : "No details found for this version in the changelog.";

    // 2. Convert GitHub markdown headings to Slack-friendly text
    relevantChangelog = relevantChangelog
      .replace(/^###?\s+(.*)$/gm, "*$1*")
      .replace(/^\*\s+/gm, "• ")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<$2|$1>");

    // 3. Truncate if too large
    const maxLength = 2900;
    if (relevantChangelog.length > maxLength) {
      relevantChangelog =
        relevantChangelog.substring(0, maxLength) +
        "...\n\n_Note: Changelog truncated. See full release notes on GitHub._";
    }

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
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Changelog*\n\n${relevantChangelog}`
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
