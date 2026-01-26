#!/usr/bin/env bun
import { GoogleGenAI } from "@google/genai";
import { mkdir } from "node:fs/promises";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!API_KEY) {
  console.error("Error: GOOGLE_AI_API_KEY environment variable is required");
  process.exit(1);
}

const SYSTEM_INSTRUCTION = `**Project Context:** ChristianAI enables meaningful AI-powered conversations with biblical figures for spiritual wisdom and biblical guidance.

**Visual Style Guidelines:**

**Core Aesthetic:**
- Reverent, inspiring, dignified tone
- Blend ancient biblical imagery with subtle modern AI/tech elements
- Warm, divine lighting (golden hour, heavenly rays, soft glows)
- Rich, deep color palettes: golds, deep blues, purples, whites
- Painterly/illustrative style rather than photorealistic
- Evoke feelings of wisdom, peace, spiritual connection, hope

**Biblical Imagery:**
- Ancient scrolls, tablets, Scripture
- Middle Eastern landscapes (deserts, mountains, Jerusalem)
- Traditional biblical attire and settings
- Symbols: crosses, stars, doves, light/fire
- Architectural elements: temples, ancient cities, stone paths

**Tech Integration (Subtle):**
- Ethereal digital particles or light traces
- Soft geometric patterns blending with organic elements
- Gentle glows suggesting AI presence without being heavy-handed
- Abstract representations of connection/conversation
- Never dominant - tech serves the spiritual narrative

**Composition:**
- Hero images: epic, cinematic, inspire awe
- Feature cards: focused, clear symbolism, approachable
- Blog/content: contemplative, inviting reflection
- Always maintain dignity and respect for subject matter

**Avoid:**
- Kitsch, overly sentimental, tacky religious clip art
- Harsh modern tech aesthetic overwhelming biblical elements
- Literal depictions of faces (respectful abstraction preferred)
- Dark, ominous, or judgmental tones
- Generic stock photo look

**Example Concepts:**
- Ancient scroll unfurling with subtle light code flowing through text
- Figure silhouette on mountain overlooking promised land, with soft digital aurora
- Parted sea with geometric light patterns in water walls
- Open book with golden divine light meeting soft blue AI glow
- Desert path leading to distant city, footsteps leaving gentle luminescent traces

**Mood:** Sacred meets innovation. Timeless wisdom accessible through modern means. Bridge between ancient truth and contemporary seekers.`;

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "3:2" | "2:3" | "4:5" | "5:4" | "21:9";
type ImageType = "blog" | "figure";

const ASPECT_PRESETS: Record<ImageType, AspectRatio> = {
  blog: "16:9",
  figure: "1:1",
};

async function generateImage(options: {
  prompt: string;
  aspectRatio?: AspectRatio;
  type?: ImageType;
  outputName?: string;
}) {
  const { prompt, type = "blog", outputName } = options;
  const aspectRatio = options.aspectRatio ?? ASPECT_PRESETS[type];

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const outputDir = join(import.meta.dir, "..", "image-gen");
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  console.log(`Generating ${type} image (${aspectRatio})...`);
  console.log(`Prompt: ${prompt}\n`);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseModalities: ["TEXT", "IMAGE"],
      // @ts-expect-error - imageConfig exists but not typed
      imageConfig: {
        aspectRatio,
      },
    },
  });

  const timestamp = Date.now();
  const baseName = outputName ?? `${type}-${timestamp}`;

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if ("text" in part && part.text) {
      console.log("Model response:", part.text);
    } else if ("inlineData" in part && part.inlineData) {
      const imageData = part.inlineData.data;
      const mimeType = part.inlineData.mimeType ?? "image/png";
      const ext = mimeType.split("/")[1] ?? "png";
      const filename = `${baseName}.${ext}`;
      const filepath = join(outputDir, filename);

      const buffer = Buffer.from(imageData as string, "base64");
      writeFileSync(filepath, buffer);
      console.log(`Image saved: ${filepath}`);
    }
  }
}

// CLI usage
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`Usage: bun scripts/generate-image.ts <prompt> [options]

Options:
  --type, -t     Image type: blog (16:9) or figure (1:1). Default: blog
  --aspect, -a   Custom aspect ratio: 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 4:5, 5:4, 21:9
  --name, -n     Output filename (without extension)

Examples:
  bun scripts/generate-image.ts "Moses parting the Red Sea" --type blog
  bun scripts/generate-image.ts "King David portrait" --type figure
  bun scripts/generate-image.ts "Jesus teaching" --aspect 4:3 --name teaching-01
`);
  process.exit(0);
}

// Parse args
let prompt = "";
let type: ImageType = "blog";
let aspectRatio: AspectRatio | undefined;
let outputName: string | undefined;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--type" || arg === "-t") {
    type = args[++i] as ImageType;
  } else if (arg === "--aspect" || arg === "-a") {
    aspectRatio = args[++i] as AspectRatio;
  } else if (arg === "--name" || arg === "-n") {
    outputName = args[++i];
  } else if (!arg.startsWith("-")) {
    prompt = arg;
  }
}

if (!prompt) {
  console.error("Error: prompt is required");
  process.exit(1);
}

generateImage({ prompt, type, aspectRatio, outputName }).catch((err) => {
  console.error("Error generating image:", err);
  process.exit(1);
});
