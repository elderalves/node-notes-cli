const { WebClient } = require("@slack/web-api");

module.exports = async function(context) {
  if (!process.env.SLACK_BOT_TOKEN) {
    throw new Error("SLACK_BOT_TOKEN environment variable is required");
  }

  const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
  const { version, changelog, name } = context;

  try {
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

    return result;
  } catch (error) {
    // Log the full error object for debugging
    console.error(
      "Slack Error:",
      JSON.stringify(
        {
          message: error.message,
          code: error.code,
          data: error.data
        },
        null,
        2
      )
    );
    throw error;
  }
};
