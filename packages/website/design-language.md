# ChristianAI Design Language

## Direction: Sacred Editorial

A refined, timeless aesthetic that evokes ancient manuscripts and sacred texts while remaining modern and accessible.

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-parchment` | #f7f3eb | Background, base |
| `--color-ink` | #1a1612 | Primary text, dark sections |
| `--color-ochre` | #c4a35a | Accents, highlights, buttons |
| `--color-ochre-light` | #d4b876 | Light accent variant |
| `--color-terracotta` | #b85c38 | Secondary accent, gradients |
| `--color-forest` | #2d4a3e | Tertiary accent |
| `--color-stone` | #8b8577 | Muted text, dividers |
| `--color-warm-gray` | #6b6459 | Body text |
| `--color-cream` | #faf8f3 | Card backgrounds, sections |

## Typography

- **Headlines**: Baskervville (serif) - elegant, editorial
- **Body**: Esteban (serif) - readable, warm
- **Tracking**: Wide letter-spacing (0.3em) for eyebrow text
- **Italics**: Used for emphasis in headlines ("Biblical *Figures*")

## Visual Elements

### Ornamental Dividers
```css
.sacred-divider /* Gradient lines with centered symbol (✹) */
```

### Texture Overlay
Subtle noise texture at 3% opacity for depth.

### Corner Accents
L-shaped borders on hover states for figure cards.

### Gradient Sacred
```css
--gradient-sacred: linear-gradient(135deg, var(--color-ochre) 0%, var(--color-terracotta) 100%);
```

## Components

### Buttons
- `.btn-sacred` - Gradient background, no border-radius, shine animation on hover
- Baskervville font, 1.125rem

### Figure Cards
- 3:4 aspect ratio
- Gradient overlay from bottom
- Scale + corner accent animation on hover
- Radial gradient mask for faded hero images

### FAQ
- Two-column layout (sticky header left, items right)
- Expandable details with chevron rotation
- Border with ochre tint

### Section Headers
- Eyebrow text (uppercase, ochre, wide tracking)
- Large headline with italic accent word
- Optional ornamental divider below

## Animation

### Fade In Up
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Staggered Children
Sequential delays (0.1s increments) for grid items.

### Hover States
- Cards: translateY(-8px) + scale(1.02)
- Images: scale(1.1) over 700ms
- Buttons: translateY(-2px) + box-shadow

## Layout Patterns

- Full-bleed hero with contained content
- Alternating background colors (parchment → cream → parchment → ink)
- Container max-widths: 3xl-6xl depending on content
- Generous vertical padding (py-24 lg:py-32)

## Responsive

- Mobile: Horizontal scroll for figure gallery
- Desktop: 7-column grid for figures
- Text scales from 4xl → 5xl → 6xl/7xl for headlines
