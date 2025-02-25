#!/bin/bash
set -e

echo "Starting release notification process..."

# Check if SLACK_BOT_TOKEN is set
if [ -z "$SLACK_BOT_TOKEN" ]; then
    echo "Error: SLACK_BOT_TOKEN environment variable is not set"
    exit 1
fi

echo "Getting package information..."
# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
NAME=$(node -p "require('./package.json').name")

echo "Package: $NAME"
echo "Version: $VERSION"

# Read the changelog
echo "Reading changelog..."
if [ ! -f CHANGELOG.md ]; then
    echo "Warning: CHANGELOG.md not found"
    CHANGELOG="No changelog available"
else
    CHANGELOG=$(cat CHANGELOG.md)
fi

echo "Sending notification to Slack..."
# Execute the slack notifier with context
node -e "
const notifier = require('./slack-notifier');
notifier({
    version: '$VERSION',
    name: '$NAME',
    changelog: \`$CHANGELOG\`
}).then(() => {
    console.log('✅ Notification sent successfully');
    process.exit(0);
}).catch(error => {
    console.error('❌ Failed to send notification:', error);
    process.exit(1);
});"