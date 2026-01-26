# Homepage & Figures Page Redesign

## Requirements Summary

1. **New Homepage Layout**
   - Centered prompt box with placeholder "Ask anything"
   - Figure dropdown selector (default: Jesus) with avatar + name
   - 2x2 grid of featured figures below prompt (4 figures)
   - New horizontal card: image left, name + description right
   - "View more people" text link at bottom → `/figures`

2. **New Figures Page (`/figures`)**
   - Search bar filtering by name
   - Grid of all figures using existing `FigureCard`
   - Reuse `useFigures()` hook

3. **Prompt Submission Flow**
   - Create conversation with selected figure
   - Redirect to `/chats/{conversationId}` with initial message

---

## Acceptance Criteria

- [ ] Homepage shows centered prompt input with "Ask anything" placeholder
- [ ] Figure dropdown shows all figures with avatar + name, defaults to "jesus"
- [ ] 2x2 grid shows 4 figures with horizontal card layout (image left, text right)
- [ ] Clicking "View more people" navigates to `/figures`
- [ ] Submitting prompt creates conversation and redirects to chat
- [ ] `/figures` page has search bar filtering figures by name
- [ ] `/figures` page uses existing `FigureCard` in responsive grid

---

## Implementation Steps

### 1. Create FigureSelectDropdown component
**File:** `packages/app/src/components/figures/figure-select.tsx`

- Uses `Select` components from `@christianai/ui`
- Props: `figures`, `value`, `onValueChange`
- Each item shows Avatar + display_name
- Reuse Avatar component from ui package

### 2. Create HomeFigureCard component
**File:** `packages/app/src/components/figures/home-figure-card.tsx`

- Horizontal flex layout with outline border
- Left: figure avatar image (fixed width ~80px)
- Right: display_name (bold) + description (text-sm, line-clamp-2)
- onClick navigates to select that figure in dropdown (or direct to chat)
- Show lock icon if requires_pro && !userHasPro

### 3. Redesign HomePage
**File:** `packages/app/src/pages/home.tsx`

Structure:
```
<main centered>
  <h1>Welcome message</h1>

  <PromptInput with figure dropdown>
    - PromptInputHeader: FigureSelectDropdown
    - PromptInputTextarea: placeholder="Ask anything"
    - PromptInputFooter: Submit button
  </PromptInput>

  <section 2x2 grid>
    <HomeFigureCard /> x4 (first 4 figures, or filter featured)
  </section>

  <Link to="/figures">View more people</Link>
</main>
```

State:
- `selectedFigure` - defaults to "jesus" slug
- `input` - prompt text
- On submit: call `createConversation.mutateAsync(figureId)` then navigate

### 4. Create FiguresPage
**File:** `packages/app/src/pages/figures.tsx`

- Search input at top (controlled state)
- Filter figures by name (case-insensitive includes)
- Display filtered figures in `FigureGrid` using existing `FigureCard`
- Reuse `useFigures()` and `useSubscription()`

### 5. Add route for figures page
**File:** `packages/app/src/main.tsx`

- Import `FiguresPage`
- Add route: `<Route path="/figures" element={<FiguresPage />} />`
- Place inside protected routes with AppLayout

---

## File Changes Summary

| File | Action |
|------|--------|
| `packages/app/src/components/figures/figure-select.tsx` | Create |
| `packages/app/src/components/figures/home-figure-card.tsx` | Create |
| `packages/app/src/pages/home.tsx` | Rewrite |
| `packages/app/src/pages/figures.tsx` | Create |
| `packages/app/src/main.tsx` | Add route |

---

## Risks & Mitigations

1. **Jesus slug assumption** - Verify "jesus" exists in DB. Fallback: use first figure if not found
2. **PromptInput integration** - Homepage needs figure context before submission. Use controlled state pattern from `new.tsx`
3. **UI exports** - Verify Select, Avatar exported from `@christianai/ui`. Check `packages/ui/src/index.ts`

---

## Verification Steps

1. Navigate to `/home` - prompt box centered, dropdown defaults to Jesus
2. Change figure in dropdown - selected figure updates
3. Type message and submit - redirects to `/chats/{id}` with message
4. Click figure card - selects that figure in dropdown
5. Click "View more people" - navigates to `/figures`
6. `/figures` - search filters figures by name
7. Click figure on `/figures` - navigates to `/chats/new/{slug}`
