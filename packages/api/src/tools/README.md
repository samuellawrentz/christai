# Bible Tools

AI SDK tools for fetching and searching Bible verses.

## Overview

Three tools for biblical content:
- `getBibleVerse` - Fetch specific verse/passage
- `searchBible` - Search for verses by keyword
- `getRandomVerse` - Get random verse

## Usage

```typescript
import { createBibleTools } from './tools';

// Create tools with preferred translation
const tools = createBibleTools('kjv'); // or 'web', 'asv'

// Use with AI SDK streamText/generateText
import { streamText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const result = streamText({
  model: openrouter.chat('openai/gpt-4o'),
  messages: [
    { role: 'user', content: 'What does John 3:16 say?' }
  ],
  tools: tools,
});
```

## Tools

### getBibleVerse

Fetch a specific Bible verse or passage.

```typescript
// Input
{ reference: "John 3:16" }
{ reference: "Psalm 23" }
{ reference: "Romans 8:28-39" }

// Output
{
  reference: "John 3:16",
  text: "For God so loved the world...",
  translation: "KJV"
}
```

### searchBible

Search Bible for verses containing keywords.

```typescript
// Input
{ query: "love neighbor" }
{ query: "faith hope" }

// Output
{
  query: "love neighbor",
  results: [
    {
      reference: "1:22:2",
      text: "And he said, Take now thy son..."
    }
  ],
  translation: "KJV"
}
```

### getRandomVerse

Get a random Bible verse.

```typescript
// Input
{}

// Output
{
  reference: "Proverbs 3:5",
  text: "Trust in the LORD with all thine heart...",
  translation: "KJV"
}
```

## APIs Used

- **bible-api.com** - Verse fetching & random verses
- **bolls.life** - Verse search

## Features

- 5 second timeout on all API calls
- Graceful error handling
- Translation fallbacks (NIV/ESV/NLT → WEB)
- HTML & Strong's number stripping
- Type-safe with TypeScript

## Testing

```bash
bun test src/tools/bible.test.ts
```
