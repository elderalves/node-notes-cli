const { WebClient } = require("@slack/web-api");

class SlackNotifier {
  constructor() {
    this.slack = null;
  }

  init() {
    return new Promise((resolve, reject) => {
      if (!process.env.SLACK_BOT_TOKEN) {
        return reject(
          new Error("SLACK_BOT_TOKEN environment variable is required")
        );
      }
      this.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
      resolve();
    });
  }

  async afterRelease(context) {
    if (!this.slack) return;

    const { version, changelog, name } = context;
    const channel = process.env.SLACK_CHANNEL || "test-notify";

    try {
      await this.slack.chat.postMessage({
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
  }
}

module.exports = SlackNotifier;
