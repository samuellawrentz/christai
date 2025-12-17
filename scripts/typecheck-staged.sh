#!/bin/bash

# Get all staged TypeScript/JavaScript files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$')

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

# Track which packages need type checking (space-separated list)
PACKAGES_TO_CHECK=""

# Identify which packages have changes
for FILE in $STAGED_FILES; do
  if [[ $FILE == packages/app/* ]] && [[ ! $PACKAGES_TO_CHECK =~ "app" ]]; then
    PACKAGES_TO_CHECK="$PACKAGES_TO_CHECK app"
  elif [[ $FILE == packages/api/* ]] && [[ ! $PACKAGES_TO_CHECK =~ "api" ]]; then
    PACKAGES_TO_CHECK="$PACKAGES_TO_CHECK api"
  elif [[ $FILE == packages/website/* ]] && [[ ! $PACKAGES_TO_CHECK =~ "website" ]]; then
    PACKAGES_TO_CHECK="$PACKAGES_TO_CHECK website"
  elif [[ $FILE == packages/ui/* ]] && [[ ! $PACKAGES_TO_CHECK =~ "@christianai/ui" ]]; then
    PACKAGES_TO_CHECK="$PACKAGES_TO_CHECK @christianai/ui"
  fi
done

# Run type check for each affected package
EXIT_CODE=0

for PACKAGE in $PACKAGES_TO_CHECK; do
  echo "Running type check for $PACKAGE..."
  
  if ! bun run --filter "$PACKAGE" typecheck; then
    echo "❌ Type check failed for $PACKAGE"
    EXIT_CODE=1
  else
    echo "✅ Type check passed for $PACKAGE"
  fi
done

exit $EXIT_CODE
