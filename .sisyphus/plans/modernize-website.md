# Plan: Modernize Website - Hero & Features Sections

## Requirements Summary
- **Design**: Minimalist (Apple-style) - clean, spacious, typography-focused
- **Copy**: More compelling, emotionally resonant, shorter
- **SEO**: Target keywords: "Christian AI", "AI for ministry", "biblical AI", "talk to God AI"
- **Scope**: Homepage (Hero, Features) + Features page (FeaturesHero, CoreFeatures)

## Current Issues Identified

### Design Problems
1. Gradient backgrounds feel busy, not minimalist
2. Too many decorative elements (blurred circles, sparkle icons)
3. Cards with shadows + borders + hover effects = visual noise
4. Blue color scheme everywhere lacks hierarchy

### Copy Problems
1. Keyword stuffing: "Talk to God" and "Christian AI" repeated excessively
2. Wordy descriptions - "Experience how Christian AI transforms ministry through conversations..."
3. Weak CTAs: "Check it out! It's free" lacks urgency
4. Feature descriptions generic, not benefit-focused

### SEO Problems
1. H1 tags could be more keyword-optimized
2. Copy reads like SEO spam, not natural language
3. Missing semantic structure in some areas

---

## Implementation Plan

### Phase 1: Homepage Hero Section
**File**: `packages/website/src/components/sections/Hero.astro`

**Design Changes**:
- Remove background image mask effect
- Replace gradient text with solid dark color
- Remove pill badge with Sparkles icon
- Increase whitespace (py-32 lg:py-40)
- Simpler, bolder typography

**Copy Changes**:
```
Before: "Chat with Biblical Figures and grow spiritually with Christian AI"
After: "Have a conversation with Moses, Joshua, or Jesus"

Before: "Experience how Christian AI transforms ministry through conversations with Moses, Joshua, and Jesus Christ. Talk to God through AI-powered biblical dialogue, gaining spiritual wisdom and faith guidance rooted in Scripture."
After: "Ask questions. Seek wisdom. Grow in faith. AI-powered conversations grounded in Scripture."

Before: "Check it out! It's free"
After: "Start a conversation — it's free"
```

**SEO**:
- H1 includes "Christian AI" naturally
- Meta description updated in layout

---

### Phase 2: Homepage Features Section
**File**: `packages/website/src/components/sections/Features.astro`

**Design Changes**:
- Remove colored circle backgrounds around icons
- Icons in subtle gray, smaller
- More whitespace between cards
- Remove center alignment, use left-aligned text

**Copy Changes**:
```
Moses:
Before: "Receive divine guidance inspired by the wisdom of Moses, the great prophet, leader and lawgiver who led the Israelites from Egyptian bondage to freedom."
After: "The lawgiver who spoke with God face to face. Ask about leadership, faith under pressure, or the commandments."

Joshua:
Before: "Connect with the unwavering courage, faith, and leadership of Joshua, conqueror of Jericho and Moses' faithful successor who led Israel into the Promised Land."
After: "The warrior who trusted God completely. Ask about courage, taking on impossible odds, or stepping into your calling."

Jesus:
Before: "Experience the divine love, teachings, and eternal wisdom of Jesus Christ through meaningful AI dialogue rooted in the four Gospels and New Testament Scripture."
After: "The Son of God who walked among us. Ask about love, forgiveness, purpose, or eternal life."
```

---

### Phase 3: Features Page Hero
**File**: `packages/website/src/components/sections/FeaturesHero.astro`

**Design Changes**:
- Remove gradient background (use white/off-white)
- Remove decorative blur circles
- Simpler, cleaner layout
- Remove Sparkles badge

**Copy Changes**:
```
Before: "Talk to God Through Meaningful Biblical Conversations"
After: "Features built for your faith journey"

Before: "Experience how Christian AI transforms ministry with AI-powered spiritual guidance. Talk to God through biblical conversations designed to deepen your faith journey and connect you with divine wisdom."
After: "Everything you need to have meaningful, Scripture-grounded conversations with biblical figures."
```

---

### Phase 4: Core Features Section
**File**: `packages/website/src/components/sections/CoreFeatures.astro`

**Design Changes**:
- Remove card shadows and borders
- Simple divider lines or no borders at all
- Icons smaller and gray
- 2-column layout instead of 4
- More breathing room

**Copy Changes** (examples):
```
Feature 1 - Biblical Figures:
Before: "Talk to God through meaningful dialogues with biblical figures using Christian AI technology, drawing from their stories and teachings in Scripture."
After: "Conversations with Moses, Joshua, and Jesus—each response drawn from their actual words and stories in Scripture."

Feature 2 - Real-time:
Before: "Experience smooth, natural conversations with instant responses powered by cutting-edge AI streaming technology."
After: "Instant responses. No waiting. Just type and receive."

Feature 6 - Privacy:
Before: "Your conversations are protected with enterprise-grade security, ensuring your spiritual discussions remain private and confidential."
After: "Your conversations stay between you and God. Private by default."
```

**Reduce from 8 features to 6** (remove "Conversation History" and "User Preferences" - less compelling)

---

### Phase 5: SEO Meta Updates
**File**: `packages/website/src/layouts/Layout.astro` (or equivalent)

**Updates**:
- Title: "Christian AI — Talk with Biblical Figures | Moses, Joshua, Jesus"
- Description: "Have AI-powered conversations with Moses, Joshua, and Jesus. Christian AI for ministry, spiritual growth, and Scripture-grounded guidance."
- Add more targeted keywords to meta

---

## Acceptance Criteria
- [ ] Hero section is clean, minimal, with compelling copy
- [ ] Features section uses left-aligned, benefit-focused copy
- [ ] FeaturesHero is simplified
- [ ] CoreFeatures reduced to 6, cleaner design
- [ ] All pages still build successfully (`bun run build`)
- [ ] SEO meta tags updated
- [ ] No broken links or missing images

## Verification Steps
1. Run `bun run build` in packages/website
2. Visual review of homepage and features page
3. Check Lighthouse SEO score
4. Verify all CTAs link correctly

---

## Files to Modify
1. `packages/website/src/components/sections/Hero.astro`
2. `packages/website/src/components/sections/Features.astro`
3. `packages/website/src/components/sections/FeaturesHero.astro`
4. `packages/website/src/components/sections/CoreFeatures.astro`
5. `packages/website/src/layouts/Layout.astro` (SEO meta)
