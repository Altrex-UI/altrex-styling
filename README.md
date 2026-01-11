# Altrex Styling

A simple design token system for the Altrex design system. This package contains core design tokens for colors, spacing, typography, and more.

## Installation

```bash
npm install @altrex-ui/styling
```

## Usage

### CSS Variables

Import the CSS file in your main stylesheet or HTML:

```css
@import '@altrex-ui/styling/dist/tokens.css';
```

Then use the CSS variables in your styles:

```css
.button {
  background-color: var(--altrex-colors-primary-500);
  padding: var(--altrex-spacing-4);
  border-radius: var(--altrex-borderRadius-default);
  font-size: var(--altrex-fontSize-base);
}

.card {
  box-shadow: var(--altrex-shadow-md);
  border-radius: var(--altrex-borderRadius-lg);
}
```

### JavaScript/TypeScript

Import tokens directly in your JavaScript or TypeScript files:

```javascript
import { tokens, flatTokens, cssVarNames } from '@altrex-ui/styling';

// Access nested tokens
const primaryColor = tokens.colors.primary['500']; // '#007cff'

// Access flattened tokens
const primaryColor = flatTokens['colors.primary.500']; // '#007cff'

// Get CSS variable names
const cssVar = cssVarNames['colors.primary.500']; // '--altrex-colors-primary-500'

// Use in styled-components or other CSS-in-JS
const Button = styled.button`
  background-color: ${tokens.colors.primary['500']};
  padding: ${tokens.spacing['4']};
`;
```

## Available Tokens

### Colors

- `colors.primary.*` - Primary brand colors (50-900)
- `colors.secondary.*` - Secondary brand colors (50-900)
- `colors.neutral.*` - Neutral/gray colors (50-900)
- `colors.success.*` - Success state colors
- `colors.warning.*` - Warning state colors
- `colors.error.*` - Error state colors
- `colors.info.*` - Info state colors

### Spacing

Scale from `spacing.0` (0) to `spacing.24` (6rem)

### Typography

- `fontSize.*` - Font sizes from xs to 5xl
- `fontWeight.*` - Font weights (light, normal, medium, semibold, bold)
- `lineHeight.*` - Line heights (none, tight, snug, normal, relaxed, loose)

### Border Radius

- `borderRadius.*` - Border radius values (none, sm, default, md, lg, xl, 2xl, full)

### Shadows

- `shadow.*` - Box shadow values (sm, default, md, lg, xl, 2xl, inner)

### Breakpoints

- `breakpoints.*` - Responsive breakpoints (sm, md, lg, xl, 2xl)

## Development

### Editing Tokens

Edit the tokens in [src/tokens.json](src/tokens.json). The file structure is:

```json
{
  "colors": {
    "primary": {
      "500": "#007cff"
    }
  }
}
```

### Building

After editing tokens, run:

```bash
npm run build
```

This generates:
- `dist/tokens.css` - CSS custom properties
- `dist/tokens.js` - JavaScript exports
- `dist/tokens.d.ts` - TypeScript type definitions

## Token Naming Convention

All CSS variables follow the pattern: `--altrex-{category}-{name}-{variant}`

Examples:
- `--altrex-colors-primary-500`
- `--altrex-spacing-4`
- `--altrex-fontSize-lg`
- `--altrex-borderRadius-default`

## License

MIT
