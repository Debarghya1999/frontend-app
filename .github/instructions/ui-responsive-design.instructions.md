# GitHub Copilot Instructions: UI & Responsive Design

## Priority Guidelines

When generating UI components and styling for this repository:

1. **Version Compatibility**: Always use Angular 21, TypeScript 5.9+, CSS3, PrimeNG 21.1+ patterns
2. **Context Files**: Follow patterns from this agent's scope
3. **Codebase Patterns**: Follow established component styling and layout patterns
4. **Architectural Consistency**: Maintain mobile-first responsive design approach
5. **Code Quality**: Prioritize accessibility, performance, and maintainability
6. **Design System**: All UI work MUST follow **"The Heritage Modernist"** design language defined below

---

## Technology Version Detection

### Language & Framework Versions
- **Angular**: 21.2.0 (standalone components with inline styles)
- **TypeScript**: 5.9.2
- **CSS3**: Grid, Flexbox, Media Queries
- **PrimeNG**: 21.1.6 (component library)
- **PrimeIcons**: 7.0.0 (icon library)

### Key Constraints
- CSS3 Grid and Flexbox for layouts
- Mobile-first approach (520px → tablet → desktop)
- Responsive images with lazy loading
- Accessible color contrast ratios
- CSS variables for theming
- No CSS frameworks except PrimeNG

---

## Design System: The Heritage Modernist

### Creative North Star: "The Modern Atelier"

This design system rejects the "e-commerce template" look in favour of a high-end editorial lookbook aesthetic. The digital space is treated like a physical boutique — spacious, tactile, and curated. Rigid, boxed-in layouts are replaced by **Intentional Asymmetry** and **Tonal Depth**. By overlapping high-fashion photography with sophisticated serif typography and subtle ethnic motifs, we create "Luxury in Motion."

The user must feel they are browsing a **bespoke collection**, not a product database.

---

### 1. Color Palette — Tonal Richness & The "No-Line" Rule

The palette is rooted in the deep, soulful reds of Indian heritage, balanced by the warmth of cream and the prestige of gold.

#### Brand Color Tokens
```css
:root {
  /* Primary — Deep Maroon */
  --primary:                 #570013;  /* High-impact brand authority */
  --primary-container:       #800020;  /* Slightly lighter maroon for hover/depth */
  --on-primary:              #ffffff;  /* Text/icons on primary background */

  /* Secondary — Craft Gold */
  --secondary:               #735c00;  /* Accent of craft; interactive highlights */
  --secondary-container:     #f5e6a3;  /* Muted gold for Add-to-Cart backgrounds */
  --secondary-fixed:         #c9a600;  /* Gold Inner Glow for primary buttons */
  --on-secondary:            #ffffff;
  --on-secondary-container:  #2b2000;  /* Dark text on gold container */

  /* Surface — Warm Cream Canvas */
  --surface:                 #fff8ef;  /* Main canvas — never use sterile white */
  --surface-variant:         #f0e6d6;  /* Slightly deeper cream for hover/fill */
  --surface-container-lowest: #fdf4e8; /* Elevated cards (lowest layer) */
  --surface-container-low:   #f5ead8;  /* Section backgrounds */
  --surface-container:       #eddfc8;  /* Mid-level containers */
  --surface-container-high:  #e5d4b8;  /* Product card hover background */
  --on-surface:              #1e1b13;  /* Primary text — warm near-black, NEVER #000 */
  --on-surface-variant:      #4a3f30;  /* Secondary text / de-emphasised labels */

  /* Outline — Ghost Tones Only */
  --outline:                 rgba(74, 63, 48, 0.2);   /* Ghost border, inputs only */
  --outline-variant:         rgba(74, 63, 48, 0.05);  /* Ethnic motif watermark tint */

  /* Background */
  --background:              #fff8ef;
  --on-background:           #1e1b13;  /* NEVER use pure #000 for text */

  /* Status — Heritage-tinted */
  --color-success:           #2d6a4f;  /* Deep forest green */
  --color-warning:           #b5620a;  /* Rust amber */
  --color-danger:            #8b0000;  /* Deep crimson — consistent with brand */
  --color-info:              #405780;  /* Muted sapphire */

  /* Gradients */
  --gradient-primary-silk:   linear-gradient(135deg, #570013 0%, #800020 100%);
  --gradient-surface-warm:   linear-gradient(135deg, #fff8ef 0%, #f5ead8 100%);
}
```

#### Color Usage Rules

| Token | Use Case |
| :--- | :--- |
| `--primary` | CTAs, brand statement elements, active nav indicators |
| `--primary-container` | Hover/pressed state on primary surfaces |
| `--secondary` | Interactive cues, price highlights, floating labels on focus |
| `--secondary-container` | "Add to Cart" / "Book Appointment" button backgrounds |
| `--surface` | Page canvas — the default background |
| `--surface-container-lowest` | Product cards (no shadow, no border) |
| `--surface-container-low` | Section-level backgrounds |
| `--surface-container-high` | Product card `:hover` state |
| `--on-background` | ALL body text — never `#000000` |
| `--outline` | Input underlines / ghost borders only (max 20% opacity) |
| `--outline-variant` | Ethnic SVG watermark patterns at 5% opacity |

#### The "No-Line" Rule — STRICTLY ENFORCED
> **1px borders are PROHIBITED for sectioning content.** They read as "cheap" and "mechanical."

- **Tonal Transitions**: Use background-color shifts between adjacent sections (`surface-container-low` → `surface`) to create soft architectural breaks.
- **Layering Principle**: Treat the UI as stacked sheets of fine handmade paper. A `surface-container-lowest` card on a `surface-container-low` section creates a natural lift.
- **Ghost Border Fallback**: If a border is required for accessibility (input fields), use `--outline` at 20% opacity. Never 100% opaque lines.
- **Dividers**: NEVER use 1px `<hr>` or `border-bottom` as list dividers. Use 24px–32px vertical spacing instead.

#### Glassmorphism Rule (Floating Elements)
```css
/* Applied to: sticky headers, product image overlays, floating nav */
.glass {
  background: rgba(255, 248, 239, 0.80); /* --surface at 80% */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
```

#### Signature CTA Gradient
```css
/* Applied to all primary CTAs */
.btn-primary {
  background: var(--gradient-primary-silk); /* 135deg maroon silk sheen */
  color: var(--on-primary);
  box-shadow: inset 0 0 0 1px var(--secondary-fixed); /* Gold inner glow */
}
```

---

### 2. Typography — The Editorial Voice

The typeface pairing bridges ancient craftsmanship with contemporary fashion.

#### Google Fonts Import
```html
<!-- Always include in index.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### Font Variables
```css
:root {
  --font-display:  'Noto Serif', 'Georgia', serif;   /* Brand storytelling, product titles */
  --font-body:     'Manrope', 'Segoe UI', sans-serif; /* UI, descriptions, price points */
  --font-mono:     'Monaco', 'Courier New', monospace;
}
```

#### Type Scale

| Role | Font | Size | Weight | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **display-lg** | Noto Serif | 3.5rem | 700 | letter-spacing: -0.02em — masthead feel |
| **display-sm** | Noto Serif | 2.25rem | 700 | Mobile full-screen nav links |
| **headline-md** | Noto Serif | 1.75rem | 600 | Section headings, product category titles |
| **title-lg** | Manrope | 1.375rem | 600 | Product card names, sub-section headers |
| **body-lg** | Manrope | 1rem | 400 | Product descriptions, paragraph copy |
| **label-md** | Manrope | 0.75rem | 700 | Buttons, tags — UPPERCASE, 0.05em letter-spacing |

```css
:root {
  /* Type sizes */
  --text-display-lg: 3.5rem;
  --text-display-sm: 2.25rem;
  --text-headline-md: 1.75rem;
  --text-title-lg: 1.375rem;
  --text-body-lg: 1rem;
  --text-label-md: 0.75rem;

  /* Legacy size aliases (retained for compatibility) */
  --text-h1: 3.5rem;
  --text-h2: 1.75rem;
  --text-h3: 1.375rem;
  --text-base: 1rem;
  --text-sm: 0.875rem;
  --text-xs: 0.75rem;

  /* Weights */
  --font-normal:   400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;

  /* Letter spacing */
  --tracking-display: -0.02em;  /* Display headings — high fashion */
  --tracking-label:    0.05em;  /* Buttons/tags — luxury branding */
}
```

---

### 3. Spacing System (8px base unit)

```css
:root {
  --spacing-xs:  4px;    /* 0.5 unit */
  --spacing-sm:  8px;    /* 1 unit */
  --spacing-md:  16px;   /* 2 units */
  --spacing-lg:  24px;   /* 3 units — minimum gap between list items (No-Line Rule) */
  --spacing-xl:  32px;   /* 4 units — preferred gap between list items */
  --spacing-2xl: 48px;   /* 6 units */
  --spacing-3xl: 64px;   /* 8 units — section breathing room */
  --spacing-4xl: 96px;   /* 12 units — major hero sections */
}
```

> **Whitespace First**: Luxury brands "breathe." Apply `--spacing-3xl` or `--spacing-4xl` as section padding.  
> **NEVER** use `--spacing-sm` alone as the separator between list items — use `--spacing-lg` or `--spacing-xl`.

---

### 4. Elevation & Depth — "Felt, Not Seen"

Depth must feel organic — like cloth layering on cloth. Avoid the standard harsh drop-shadow look.

```css
:root {
  /* Ambient shadow — main floating element shadow */
  --shadow-ambient: 0px 20px 40px rgba(88, 65, 65, 0.08);

  /* Subtle lift — product cards, panels */
  --shadow-lift:    0px 8px 24px rgba(88, 65, 65, 0.06);

  /* Deep lift — modal, drawer overlays */
  --shadow-deep:    0px 32px 64px rgba(88, 65, 65, 0.12);

  /* Legacy aliases */
  --shadow-sm:   0 1px 3px rgba(88, 65, 65, 0.06);
  --shadow-md:   0 4px 12px rgba(88, 65, 65, 0.08);
  --shadow-lg:   var(--shadow-lift);
  --shadow-xl:   var(--shadow-ambient);
  --shadow-2xl:  var(--shadow-deep);
  --shadow-hover: var(--shadow-lift);
}
```

> **Ethnic Motifs as Depth**: Use ultra-faint inline SVG (Mandana or Paisley) in `--outline-variant` (5% opacity) behind product card sections to create a "watermark" depth effect.

---

### 5. Border Radius — Tailored, Not Casual

```css
:root {
  --radius-none: 0;
  --radius-sm:   4px;
  --radius-md:   6px;   /* PRIMARY radius — tailored, professional */
  --radius-lg:   12px;
  --radius-full: 9999px; /* AVOID — pill shapes feel too casual/tech */
}
```

> **Rule**: Use `--radius-md` (6px) for all buttons, cards, and inputs. Never use `--radius-full` for CTAs.

---

### 6. Components

#### Buttons — The Jewel Element

```css
/* ── Base button ── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: 12px 28px;
  font-family: var(--font-body);
  font-size: var(--text-label-md);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-label);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
}

/* ── Primary CTA (Maroon Silk) ── */
.btn-primary {
  background: var(--gradient-primary-silk);
  color: var(--on-primary);
  box-shadow: inset 0 0 0 1px var(--secondary-fixed); /* Gold inner glow */
}

.btn-primary:hover {
  filter: brightness(1.1);
  box-shadow:
    inset 0 0 0 1px var(--secondary-fixed),
    var(--shadow-ambient);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ── Secondary (Gold Accent) — Add to Cart / Book Appointment ── */
.btn-secondary {
  background: var(--secondary-container);
  color: var(--on-secondary-container);
  box-shadow: none;
}

.btn-secondary:hover {
  background: color-mix(in srgb, var(--secondary-container) 85%, var(--secondary));
  box-shadow: var(--shadow-lift);
}

/* ── Size Variants ── */
.btn-sm {
  padding: 8px 18px;
  font-size: calc(var(--text-label-md) * 0.9);
}

.btn-lg {
  padding: 16px 40px;
  font-size: var(--text-xs);
}
```

---

#### Product Cards — The Curated Frame

```css
/* ── Card container — no borders, no shadows ── */
.product-card {
  background: var(--surface-container-lowest);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: none;
  box-shadow: none;
  transition: background 0.3s ease;
  position: relative;
}

.product-card:hover {
  background: var(--surface-container-high);
}

/* ── Image — Portrait 4:5, warm desaturation ── */
.product-card__image {
  width: 100%;
  aspect-ratio: 4 / 5;       /* Portrait — mandatory */
  overflow: hidden;
  background: var(--surface-container-low);
}

.product-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.88) sepia(0.08); /* Warm desaturation */
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              filter 0.5s ease;
}

.product-card:hover .product-card__image img {
  transform: scale(1.05); /* Subtle zoom — no divider between img and info */
  filter: saturate(0.95) sepia(0.04);
}

/* ── Product Info — no divider line ── */
.product-card__info {
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-lg);
}

.product-card__name {
  font-family: var(--font-display);
  font-size: var(--text-title-lg);
  font-weight: var(--font-semibold);
  color: var(--on-surface);
  margin-bottom: var(--spacing-xs);
}

.product-card__price {
  font-family: var(--font-body);
  font-size: var(--text-body-lg);
  font-weight: var(--font-semibold);
  color: var(--secondary);
}
```

> **Overlap Rule**: Allow product images to slightly "hang over" adjacent text containers using negative margins or absolute positioning for depth.

---

#### Product Grid Layout

```css
.product-grid {
  display: grid;
  grid-template-columns: 1fr;                              /* Mobile: 1 col */
  gap: var(--spacing-xl);
  padding: var(--spacing-2xl) var(--spacing-lg);
}

@media (min-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-2xl);
    padding: var(--spacing-3xl) var(--spacing-2xl);
  }
}

@media (min-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

#### Inputs & Text Fields — Underline Style

```css
/* ── Input base — underline only, no full border ── */
.input-field {
  position: relative;
  margin-bottom: var(--spacing-xl);
}

.input-field input,
.input-field textarea,
.input-field select {
  width: 100%;
  padding: 12px 0 8px;
  font-family: var(--font-body);
  font-size: var(--text-body-lg);
  color: var(--on-surface);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--outline); /* Ghost underline only */
  border-radius: 0;
  outline: none;
  transition: border-color 0.3s ease;
}

/* Floating Label */
.input-field label {
  position: absolute;
  top: 12px;
  left: 0;
  font-family: var(--font-body);
  font-size: var(--text-body-lg);
  color: var(--on-surface-variant);
  pointer-events: none;
  transition: top 0.25s ease, font-size 0.25s ease, color 0.25s ease;
}

/* Float label on focus or when filled */
.input-field input:focus ~ label,
.input-field input:not(:placeholder-shown) ~ label {
  top: -12px;
  font-size: var(--text-xs);
  color: var(--secondary); /* Gold — craft accent */
}

/* Underline expands from center on focus */
.input-field::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--secondary);
  transition: left 0.3s ease, width 0.3s ease;
}

.input-field:focus-within::after {
  left: 0;
  width: 100%;
}

/* Error state */
.input-field.error input {
  border-bottom-color: var(--color-danger);
}

.input-field.error::after {
  background: var(--color-danger);
}

/* Filled/Surface variant alternative */
.input-field--filled input {
  background: var(--surface-variant);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  padding: 12px var(--spacing-md) 8px;
  border-bottom: 1px solid var(--outline);
}
```

---

#### Form Layout

```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.form-group small {
  font-size: var(--text-xs);
  color: var(--on-surface-variant);
}

.form-group.error small {
  color: var(--color-danger);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}

@media (min-width: 768px) {
  .form-row-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

#### Navigation — The Floating Silk

```css
/* ── Desktop: Centered floating glassmorphism bar ── */
.navbar {
  position: sticky;
  top: var(--spacing-md);
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  justify-content: center;
  padding: 0 var(--spacing-lg);
}

.navbar__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: var(--spacing-md) var(--spacing-xl);
  background: rgba(255, 248, 239, 0.80); /* --surface at 80% */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  border: none; /* No-Line Rule */
  box-shadow: var(--shadow-ambient);
}

.navbar__menu {
  display: flex;
  gap: var(--spacing-xl);
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar__menu a {
  font-family: var(--font-body);
  font-size: var(--text-label-md);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-label);
  color: var(--on-surface);
  text-decoration: none;
  transition: color 0.3s ease;
}

.navbar__menu a:hover,
.navbar__menu a.active {
  color: var(--secondary); /* Gold — NEVER blue */
}

/* ── Mobile: Full-screen overlay with ethnic pattern ── */
@media (max-width: 768px) {
  .navbar__menu {
    display: none;
  }

  .navbar__menu.mobile-open {
    display: flex;
    flex-direction: column;
    position: fixed;
    inset: 0;
    background: var(--surface);
    background-image: url("data:image/svg+xml,..."); /* Paisley/Mandana SVG at 5% opacity */
    z-index: 300;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2xl);
  }

  .navbar__menu.mobile-open a {
    font-family: var(--font-display);
    font-size: var(--text-display-sm); /* display-sm */
    font-weight: var(--font-bold);
    color: var(--on-surface);
    letter-spacing: var(--tracking-display);
  }

  .navbar__menu.mobile-open a:hover {
    color: var(--secondary);
  }
}
```

---

## Global Styles Pattern

### Base CSS Setup

```css
/* styles.css */

/* ── Import Heritage Modernist fonts ── */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@400;500;600;700&display=swap');

:root {
  /* — Color Tokens — */
  --primary:                  #570013;
  --primary-container:        #800020;
  --on-primary:               #ffffff;
  --secondary:                #735c00;
  --secondary-container:      #f5e6a3;
  --secondary-fixed:          #c9a600;
  --on-secondary-container:   #2b2000;
  --surface:                  #fff8ef;
  --surface-variant:          #f0e6d6;
  --surface-container-lowest: #fdf4e8;
  --surface-container-low:    #f5ead8;
  --surface-container:        #eddfc8;
  --surface-container-high:   #e5d4b8;
  --on-surface:               #1e1b13;
  --on-surface-variant:       #4a3f30;
  --outline:                  rgba(74, 63, 48, 0.20);
  --outline-variant:          rgba(74, 63, 48, 0.05);
  --background:               #fff8ef;
  --on-background:            #1e1b13;
  --color-success:            #2d6a4f;
  --color-warning:            #b5620a;
  --color-danger:             #8b0000;
  --color-info:               #405780;
  --gradient-primary-silk:    linear-gradient(135deg, #570013 0%, #800020 100%);

  /* — Typography — */
  --font-display:  'Noto Serif', 'Georgia', serif;
  --font-body:     'Manrope', 'Segoe UI', sans-serif;
  --font-mono:     'Monaco', 'Courier New', monospace;
  --text-display-lg:  3.5rem;
  --text-display-sm:  2.25rem;
  --text-headline-md: 1.75rem;
  --text-title-lg:    1.375rem;
  --text-body-lg:     1rem;
  --text-label-md:    0.75rem;
  --text-sm:          0.875rem;
  --text-xs:          0.75rem;
  --font-normal:      400;
  --font-medium:      500;
  --font-semibold:    600;
  --font-bold:        700;
  --tracking-display: -0.02em;
  --tracking-label:    0.05em;

  /* — Spacing — */
  --spacing-xs:  4px;
  --spacing-sm:  8px;
  --spacing-md:  16px;
  --spacing-lg:  24px;
  --spacing-xl:  32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 96px;

  /* — Shadows — */
  --shadow-ambient: 0px 20px 40px rgba(88, 65, 65, 0.08);
  --shadow-lift:    0px 8px 24px rgba(88, 65, 65, 0.06);
  --shadow-deep:    0px 32px 64px rgba(88, 65, 65, 0.12);
  --shadow-sm:      0 1px 3px rgba(88, 65, 65, 0.06);
  --shadow-md:      0 4px 12px rgba(88, 65, 65, 0.08);
  --shadow-lg:      var(--shadow-lift);
  --shadow-xl:      var(--shadow-ambient);
  --shadow-2xl:     var(--shadow-deep);
  --shadow-hover:   var(--shadow-lift);

  /* — Border Radius — */
  --radius-none: 0;
  --radius-sm:   4px;
  --radius-md:   6px;
  --radius-lg:   12px;
  --radius-full: 9999px;

  /* — Breakpoints (reference only — use in @media) — */
  --breakpoint-xs:  320px;
  --breakpoint-sm:  520px;
  --breakpoint-md:  768px;
  --breakpoint-lg:  1024px;
  --breakpoint-xl:  1280px;
  --breakpoint-2xl: 1536px;
}

/* ── Reset ── */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-body-lg);
  color: var(--on-background);       /* Warm near-black — NEVER #000 */
  background-color: var(--surface);  /* Cream canvas — NEVER #fff */
  line-height: 1.6;
}

/* ── Headings — Noto Serif display voice ── */
h1, h2, h3 {
  font-family: var(--font-display);
  color: var(--on-surface);
}

h1 { font-size: var(--text-display-lg); font-weight: var(--font-bold);     letter-spacing: var(--tracking-display); }
h2 { font-size: var(--text-headline-md); font-weight: var(--font-semibold); }
h3 { font-size: var(--text-title-lg);    font-weight: var(--font-semibold); }

/* ── Links — NEVER blue; use gold or maroon ── */
a {
  color: var(--secondary);
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--primary);
}

/* ── Accessibility: reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Breakpoints

### Breakpoint Strategy (Mobile-First)
```css
/* Mobile First */
@media (min-width: 520px)  { /* Early mobile fixes */ }
@media (min-width: 640px)  { /* Landscape phone / small tablet */ }
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large desktop */ }
@media (min-width: 1536px) { /* Extra large desktop */ }
```

---

## Layout Patterns

### Standard Grid
```css
.grid {
  display: grid;
  gap: var(--spacing-xl);
}

.grid-cols-1 { grid-template-columns: 1fr; }

@media (min-width: 768px) {
  .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}

.grid-auto {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
```

### Flexbox Utilities
```css
.flex         { display: flex; }
.flex-col     { flex-direction: column; }
.flex-center  { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.gap-md       { gap: var(--spacing-md); }
.gap-lg       { gap: var(--spacing-lg); }

@media (max-width: 768px) {
  .flex-row-to-col { flex-direction: column; }
}
```

---

## Animation & Motion Design

### Heritage Animation Tokens
```typescript
// animations.config.ts
export const ANIMATIONS = {
  fadeInUp: {
    duration: 500,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'  /* Luxury deceleration */
  },
  scaleReveal: {
    duration: 400,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'     /* Organic spring */
  },
  silk: {
    duration: 300,
    easing: 'ease-in-out'
  }
};
```

### Recommended Libraries for Angular 21

#### 1. **AOS (Animate On Scroll)** — Scroll-triggered reveals
```typescript
import AOS from 'aos';
import 'aos/dist/aos.css';

ngOnInit() {
  AOS.init({ once: true, duration: 700, easing: 'ease-out' });
}
```
```html
<div data-aos="fade-up" data-aos-delay="100">Reveals on scroll</div>
```

#### 2. **Angular Animations** — State transitions
```typescript
import { trigger, state, style, transition, animate } from '@angular/animations';

animations: [
  trigger('fadeInUp', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(24px)' }),
      animate('500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        style({ opacity: 1, transform: 'translateY(0)' }))
    ])
  ])
]
```

#### 3. **GSAP** — Complex sequences (hero, overlapping elements)
```typescript
import gsap from 'gsap';

ngAfterViewInit() {
  gsap.from('.product-card', {
    duration: 0.7,
    opacity: 0,
    y: 32,
    stagger: 0.1,
    ease: 'power2.out'
  });
}
```

#### 4. **Lottie-Web** — Loading states & micro-animations
```typescript
import lottie from 'lottie-web';
// Free animations: https://lottiefiles.com
```

### Utility Keyframes
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}

/* Heritage shimmer skeleton */
@keyframes shimmer {
  0%   { background-position: -1000px 0; }
  100% { background-position:  1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-container-low) 25%,
    var(--surface-container-lowest) 50%,
    var(--surface-container-low) 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

.fade-in    { animation: fadeIn    0.4s ease-in; }
.slide-up   { animation: slideInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.scale-in   { animation: scaleIn   0.4s ease-out; }
```

---

## Utility Classes

### Spacing
```css
.m-0  { margin: 0; }
.m-sm { margin: var(--spacing-sm); }
.m-md { margin: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }
.mx-auto { margin-left: auto; margin-right: auto; }
.my-md   { margin-top: var(--spacing-md); margin-bottom: var(--spacing-md); }
.p-0  { padding: 0; }
.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
```

### Text
```css
.text-left    { text-align: left; }
.text-center  { text-align: center; }
.text-right   { text-align: right; }
.text-primary { color: var(--primary); }
.text-success { color: var(--color-success); }
.text-danger  { color: var(--color-danger); }
.text-muted   { color: var(--on-surface-variant); }
.font-display { font-family: var(--font-display); }
.font-body    { font-family: var(--font-body); }
.font-light   { font-weight: var(--font-normal); }
.font-normal  { font-weight: var(--font-normal); }
.font-bold    { font-weight: var(--font-bold); }
.uppercase    { text-transform: uppercase; letter-spacing: var(--tracking-label); }
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Visibility
```css
.hidden       { display: none; }
.block        { display: block; }
.inline       { display: inline; }
.inline-block { display: inline-block; }

@media (max-width: 768px)  { .hidden-mobile  { display: none; } }
@media (min-width: 769px)  { .hidden-desktop { display: none; } }
```

---

## Accessibility Guidelines

### Color Contrast
```
WCAG AA Compliance: 4.5:1 for normal text, 3:1 for large text.

Verified pairs:
- --on-surface (#1e1b13) on --surface (#fff8ef):        ≥ 10:1 ✅
- --on-primary (#ffffff) on --primary (#570013):         ≥ 10:1 ✅
- --secondary (#735c00) on --surface (#fff8ef):          ≥ 4.5:1 ✅
- --on-secondary-container (#2b2000) on --secondary-container (#f5e6a3): ≥ 7:1 ✅
```

### Focus States
```css
/* Visible focus — gold underline cue, no blue */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid var(--secondary);
  outline-offset: 3px;
}

:focus-visible {
  outline: 2px dashed var(--secondary);
  outline-offset: 4px;
}
```

### Skip Navigation
```html
<a href="#main-content" class="skip-to-main">Skip to Main Content</a>

<style>
.skip-to-main {
  position: absolute;
  left: -9999px;
  z-index: 999;
}
.skip-to-main:focus {
  left: 0;
  top: 0;
  background: var(--primary);
  color: var(--on-primary);
  padding: var(--spacing-md);
  font-family: var(--font-body);
  font-size: var(--text-label-md);
  text-transform: uppercase;
  letter-spacing: var(--tracking-label);
}
</style>
```

---

## Performance Optimization

### Image Optimization
```html
<!-- Portrait 4:5 product images — lazy loaded -->
<img
  src="product-1024.jpg"
  alt="Product name"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  srcset="product-320.jpg 320w, product-640.jpg 640w, product-1024.jpg 1024w"
  loading="lazy"
  style="width: 100%; aspect-ratio: 4/5; object-fit: cover;">

<!-- Art direction — mobile crops -->
<picture>
  <source media="(max-width: 640px)"  srcset="product-mobile.jpg">
  <source media="(max-width: 1024px)" srcset="product-tablet.jpg">
  <img src="product-desktop.jpg" alt="Product">
</picture>
```

### CSS Optimization
```css
/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* CSS containment for product cards */
.product-card {
  contain: layout style paint;
}

/* GPU compositing for animated elements */
.animated {
  will-change: transform;
  transform: translateZ(0);
}
```

---

## Do's and Don'ts — Quick Reference

### ✅ DO
- **DO** use `--surface` (#fff8ef) as the page background — never sterile white
- **DO** use `--on-background` (#1e1b13) for all text — never `#000000`
- **DO** use `--secondary` (Gold) or `--primary` (Maroon) for all interactive cues — never blue
- **DO** use whitespace aggressively — `--spacing-3xl` / `--spacing-4xl` between sections
- **DO** overlap elements — let images hang over text containers for editorial depth
- **DO** use "Cream on Maroon" (`--surface` text on `--primary` bg) for high-impact hero sections
- **DO** apply the Glassmorphism rule to sticky nav bars and floating elements
- **DO** use Noto Serif for headings and product names; Manrope for all UI text
- **DO** apply `4:5` portrait aspect ratio to all primary product images
- **DO** use `--radius-md` (6px) — never pill shapes for brand CTAs

### ❌ DON'T
- **DON'T** use pure black (`#000`) or pure white (`#fff`) anywhere
- **DON'T** use 1px `border` or `border-bottom` to separate sections or list items
- **DON'T** use `--radius-full` (pill shapes) for buttons — feels too casual/tech
- **DON'T** use standard blue for links or interactive elements
- **DON'T** use `<hr>` tags as visual dividers — use vertical spacing instead
- **DON'T** use harsh, opaque shadows — only the warm ambient shadow spec

---

## Code Quality Standards

### Naming Conventions
- Classes: `.component-name`, `.component__element`, `.component--modifier` (BEM)
- CSS Variables: `--semantic-token-name`
- Utilities: `.text-center`, `.flex-col`, `.gap-md`

### Documentation Template
```css
/**
 * Component: ProductCard
 * Description: Curated product frame with portrait imagery and tonal hover.
 *
 * Variants:
 * - .product-card (base)
 * - .product-card--featured (overlapping image treatment)
 *
 * Rules:
 * - No border, no shadow. Depth via background color shift only.
 * - Image must be 4:5 portrait with warm desaturation filter.
 *
 * Usage:
 * <div class="product-card">
 *   <div class="product-card__image"><img ...></div>
 *   <div class="product-card__info">...</div>
 * </div>
 */
```

---

## Related Guidelines
- See: `src/styles.css` for global styles and Heritage Modernist CSS variable definitions
- See: `src/app/app.css` for app shell styling
- See: Individual component CSS files for component-specific styles
- See: `.github/instructions/` for complementary Copilot instruction sets
