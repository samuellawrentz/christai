#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TOPICS_FILE="$SCRIPT_DIR/blog-topics.json"
BLOG_DIR="$PROJECT_DIR/packages/website/src/content/blog"
ASSETS_DIR="$PROJECT_DIR/packages/website/src/assets/blog"
IMAGE_GEN_DIR="$PROJECT_DIR/image-gen"

cd "$PROJECT_DIR"

# Load .env file
if [ -f "$PROJECT_DIR/.env" ]; then
  set -a
  source "$PROJECT_DIR/.env"
  set +a
fi

# Check dependencies
command -v claude >/dev/null 2>&1 || { echo "Error: claude CLI not found"; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "Error: jq not found"; exit 1; }
command -v bun >/dev/null 2>&1 || { echo "Error: bun not found"; exit 1; }
command -v gh >/dev/null 2>&1 || { echo "Error: gh CLI not found"; exit 1; }

# Check env vars
[ -z "$GOOGLE_AI_API_KEY" ] && { echo "Error: GOOGLE_AI_API_KEY not set"; exit 1; }

# Check blog-topics.json exists
[ ! -f "$TOPICS_FILE" ] && { echo "Error: $TOPICS_FILE not found"; exit 1; }

# Cleanup function for failures
cleanup() {
  local exit_code=$?
  if [ $exit_code -ne 0 ] && [ -n "$TOPIC_ID" ]; then
    echo "Script failed, resetting status to unpublished"
    jq --arg id "$TOPIC_ID" '(.topics[] | select(.id == $id)).status = "unpublished"' "$TOPICS_FILE" > "$TOPICS_FILE.tmp" && mv "$TOPICS_FILE.tmp" "$TOPICS_FILE"
    git checkout main 2>/dev/null || true
  fi
  exit $exit_code
}
trap cleanup EXIT

# Set git user
git config user.name "samuellawrentz"
git config user.email "samuellawrentz@gmail.com"

# Ensure we're on main and up to date
git checkout main
git pull origin main

# Get first unpublished topic
TOPIC=$(jq -r '.topics[] | select(.status == "unpublished") | @json' "$TOPICS_FILE" | head -1)

if [ -z "$TOPIC" ] || [ "$TOPIC" = "null" ]; then
  echo "No unpublished topics found"
  exit 0
fi

# Parse topic details
TOPIC_ID=$(echo "$TOPIC" | jq -r '.id')
TOPIC_TITLE=$(echo "$TOPIC" | jq -r '.title')
TOPIC_DESC=$(echo "$TOPIC" | jq -r '.description')
# Format tags as JSON array string: ["AI", "Prayer", "Spiritual Growth"]
TOPIC_TAGS=$(echo "$TOPIC" | jq -c '.tags')

echo "Processing topic: $TOPIC_TITLE"
echo "ID: $TOPIC_ID"

# Mark as in_progress
jq --arg id "$TOPIC_ID" '(.topics[] | select(.id == $id)).status = "in_progress"' "$TOPICS_FILE" > "$TOPICS_FILE.tmp" && mv "$TOPICS_FILE.tmp" "$TOPICS_FILE"

# Create slug from id
SLUG="$TOPIC_ID"
BLOG_FILE="$BLOG_DIR/$SLUG.mdx"
TODAY=$(date +%Y-%m-%d)

# Create branch (delete if exists from failed run)
BRANCH="blog/$SLUG"
git branch -D "$BRANCH" 2>/dev/null || true
git checkout -b "$BRANCH"

# Generate blog content and image with Claude
echo "Generating blog and image with Claude..."
claude -p "You are creating a blog post for ChristianAI (christianai.world), an AI platform for spiritual conversations with biblical figures.

TASK 1: Create the blog post file at: $BLOG_FILE

Use this exact frontmatter:
---
title: \"$TOPIC_TITLE\"
description: \"$TOPIC_DESC\"
pubDate: $TODAY
author: \"ChristianAI Team\"
image: \"../../assets/blog/$SLUG.png\"
tags: $TOPIC_TAGS
draft: false
---

Then write engaging, SEO-optimized content (1500-2000 words) that:
- Opens with a compelling hook
- Uses H2 and H3 headers for structure
- Includes relevant Bible verse references as links to biblegateway.com
- Links to ChristianAI app (https://app.christianai.world) where relevant
- Ends with a short prayer
- Links to related blog posts at the end (use /blog/how-moses-spoke-with-god/, /blog/how-to-talk-to-god-in-this-ai-era/, etc)

Write in a warm, accessible tone. No emojis.

TASK 2: Generate a featured image

Run this command to generate an image (create your own prompt based on the blog title, max 50 words, painterly style, warm golden and blue tones, biblical imagery with subtle digital/AI elements, no text):
bun $SCRIPT_DIR/generate-image.ts \"<your-prompt>\" --type blog --name $SLUG

TASK 3: Move the generated image

Move the image from $IMAGE_GEN_DIR/$SLUG.png to $ASSETS_DIR/$SLUG.png

TASK 4: Review the changes

Read the blog file and verify:
- Frontmatter is correct (title, date, image path, tags)
- Content has proper H2/H3 structure
- Bible verse links are valid biblegateway.com URLs
- ChristianAI app links are correct
- Image file exists at $ASSETS_DIR/$SLUG.png

Fix any issues found.

Complete all 4 tasks." --allowedTools "Write,Bash,Read,Edit"

# Update status before committing (so it's included in PR)
jq --arg id "$TOPIC_ID" '(.topics[] | select(.id == $id)).status = "pr_created"' "$TOPICS_FILE" > "$TOPICS_FILE.tmp" && mv "$TOPICS_FILE.tmp" "$TOPICS_FILE"

# Commit all changes
git add "$BLOG_FILE" "$ASSETS_DIR/$SLUG.png" "$TOPICS_FILE"
git commit -m "$(cat <<EOF
Add blog post: $TOPIC_TITLE

Auto-generated blog post with AI-generated featured image.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"

# Push and create PR
git push -u origin "$BRANCH" --force

# Unset GITHUB_TOKEN to let gh use its own auth
unset GITHUB_TOKEN
gh auth switch --user samuellawrentz

PR_URL=$(gh pr create \
  --title "Blog: $TOPIC_TITLE" \
  --body "$(cat <<EOF
## New Blog Post

**Title:** $TOPIC_TITLE
**Description:** $TOPIC_DESC
**Tags:** $TOPIC_TAGS

Auto-generated blog post with AI-generated featured image.

## Checklist
- [ ] Review blog content for accuracy
- [ ] Check image quality
- [ ] Verify all links work

Generated with [Claude Code](https://claude.ai/claude-code)
EOF
)" \
  --base main)

echo "PR created: $PR_URL"

# Return to main
git checkout main

# Sync topics file to main (so next run knows this topic is done)
git checkout "$BRANCH" -- "$TOPICS_FILE"
git add "$TOPICS_FILE"
git commit -m "Update blog topics status" || true
git push origin main

echo "Done! PR: $PR_URL"
