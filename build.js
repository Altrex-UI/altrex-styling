const { readFileSync, existsSync, mkdirSync, writeFileSync } = require('fs')
const { join } = require('path')

// Read tokens
const tokensPath = join(__dirname, 'src', 'tokens.json');
const tokens = JSON.parse(readFileSync(tokensPath, 'utf8'));

// Create dist directory
const distDir = join(__dirname, 'dist');
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

/**
 * Flatten nested object into dot notation keys
 * Example: { colors: { primary: { 500: '#007cff' } } }
 * becomes: { 'colors.primary.500': '#007cff' }
 */
function flattenTokens(obj, prefix = '') {
  let result = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenTokens(value, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

/**
 * Convert dot notation to kebab-case CSS variable name
 * Example: 'colors.primary.500' becomes '--altrex-colors-primary-500'
 */
function toCssVarName(key) {
  return `--altrex-${key.replace(/\./g, '-')}`;
}

// Generate CSS variables
function generateCSS(tokens) {
  const flattened = flattenTokens(tokens);

  let css = '/**\n';
  css += ' * Altrex Design System Tokens\n';
  css += ' * Generated automatically - do not edit\n';
  css += ' */\n\n';
  css += ':root {\n';

  for (const [key, value] of Object.entries(flattened)) {
    css += `  ${toCssVarName(key)}: ${value};\n`;
  }

  css += '}\n';

  return css;
}

// Generate JavaScript/TypeScript exports
function generateJS(tokens) {
  let js = '/**\n';
  js += ' * Altrex Design System Tokens\n';
  js += ' * Generated automatically - do not edit\n';
  js += ' */\n\n';
  js += `export const tokens = ${JSON.stringify(tokens, null, 2)};\n\n`;

  // Also export flattened version for convenience
  const flattened = flattenTokens(tokens);
  js += `export const flatTokens = ${JSON.stringify(flattened, null, 2)};\n\n`;

  // Export CSS variable names map
  const cssVarNames = {};
  for (const key of Object.keys(flattened)) {
    cssVarNames[key] = toCssVarName(key);
  }
  js += `export const cssVarNames = ${JSON.stringify(cssVarNames, null, 2)};\n`;

  return js;
}

// Generate Stylus variables
function generateStylus(tokens) {
  const flattened = flattenTokens(tokens);

  let stylus = '/**\n';
  stylus += ' * Altrex Design System Tokens\n';
  stylus += ' * Generated automatically - do not edit\n';
  stylus += ' */\n\n';

  // Generate Stylus variables with actual values for compile-time operations
  for (const [key, value] of Object.entries(flattened)) {
    const stylusVarName = `$altrex-${key.replace(/\./g, '-')}`;
    stylus += `${stylusVarName} = ${value}\n`;
  }

  stylus += '\n';
  stylus += '// Component-specific tokens\n';
  stylus += '$altrex-border-radius-button-default = $altrex-borderRadius-default\n';
  stylus += '$altrex-border-radius-button-pill = $altrex-borderRadius-full\n\n';

  stylus += '// Typography\n';
  stylus += '$altrex-font-family-body = -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif\n';
  stylus += '$altrex-font-size-body-1 = $altrex-fontSize-base\n';
  stylus += '$altrex-font-size-body-2 = $altrex-fontSize-sm\n';
  stylus += '$altrex-font-size-caption = $altrex-fontSize-xs\n\n';

  stylus += '// Transitions\n';
  stylus += '$altrex-transition-default = 0.2s ease-in-out\n\n';

  stylus += '// Icon size mixins\n';
  stylus += 'altrex-icon-s()\n';
  stylus += '  height: 16px\n';
  stylus += '  width: 16px\n\n';

  stylus += 'altrex-icon-m()\n';
  stylus += '  height: 24px\n';
  stylus += '  width: 24px\n\n';

  stylus += 'altrex-icon-l()\n';
  stylus += '  height: 32px\n';
  stylus += '  width: 32px\n\n';

  stylus += 'altrex-icon-xl()\n';
  stylus += '  height: 48px\n';
  stylus += '  width: 48px\n\n';

  stylus += 'altrex-icon-xxl()\n';
  stylus += '  height: 64px\n';
  stylus += '  width: 64px\n\n';

  // Mobile-first responsive mixins
  stylus += '// Mobile-first breakpoint mixin\n';
  stylus += '// Usage: +above(\'md\') { /* styles */ }\n';
  stylus += 'above(breakpoint)\n';
  stylus += '  @media (min-width: lookup(\'$altrex-breakpoints-\' + breakpoint))\n';
  stylus += '    {block}\n\n';

  stylus += '// Touch-first interaction detection\n';
  stylus += '// Usage: +touch-device() { /* styles */ }\n';
  stylus += 'touch-device()\n';
  stylus += '  @media (hover: none) and (pointer: coarse)\n';
  stylus += '    {block}\n\n';

  stylus += '// Touch target sizing (WCAG 2.1 Level AAA)\n';
  stylus += '// Usage: touch-target() or touch-target(\'comfortable\')\n';
  stylus += 'touch-target(size = \'minimum\')\n';
  stylus += '  min-width: lookup(\'$altrex-touchTarget-\' + size)\n';
  stylus += '  min-height: lookup(\'$altrex-touchTarget-\' + size)\n';
  stylus += '  display: inline-flex\n';
  stylus += '  align-items: center\n';
  stylus += '  justify-content: center\n\n';

  stylus += '// Container with mobile padding\n';
  stylus += '// Usage: container-width() or container-width($altrex-breakpoints-lg)\n';
  stylus += 'container-width(max-width = \'100%\')\n';
  stylus += '  width: 100%\n';
  stylus += '  max-width: max-width\n';
  stylus += '  margin-left: auto\n';
  stylus += '  margin-right: auto\n';
  stylus += '  padding-left: $altrex-spacing-4\n';
  stylus += '  padding-right: $altrex-spacing-4\n\n';
  stylus += '  +above(\'md\')\n';
  stylus += '    padding-left: $altrex-spacing-6\n';
  stylus += '    padding-right: $altrex-spacing-6\n\n';

  stylus += '// Stack to row pattern\n';
  stylus += '// Usage: stack-to-row() or stack-to-row(\'lg\')\n';
  stylus += 'stack-to-row(breakpoint = \'md\')\n';
  stylus += '  display: flex\n';
  stylus += '  flex-direction: column\n';
  stylus += '  gap: $altrex-spacing-4\n\n';
  stylus += '  +above(breakpoint)\n';
  stylus += '    flex-direction: row\n';

  return stylus;
}

// Write files
const cssContent = generateCSS(tokens);
writeFileSync(join(distDir, 'tokens.css'), cssContent);

const jsContent = generateJS(tokens);
writeFileSync(join(distDir, 'tokens.js'), jsContent);

const stylusContent = generateStylus(tokens);
writeFileSync(join(distDir, 'tokens.styl'), stylusContent);

// Also write TypeScript declaration file
const dtsContent = `/**
 * Altrex Design System Tokens
 * Generated automatically - do not edit
 */

export const tokens: {
  colors: Record<string, Record<string, string>>;
  spacing: Record<string, string>;
  fontSize: Record<string, string>;
  fontWeight: Record<string, string>;
  lineHeight: Record<string, string>;
  borderRadius: Record<string, string>;
  shadow: Record<string, string>;
  breakpoints: Record<string, string>;
  touchTarget: Record<string, string>;
  fluidSpacing: Record<string, string>;
  fluidTypography: Record<string, string>;
};

export const flatTokens: Record<string, string>;
export const cssVarNames: Record<string, string>;
`;

writeFileSync(join(distDir, 'tokens.d.ts'), dtsContent);

// Create index file for easier imports
const indexContent = `export * from './tokens.js';\n`;
writeFileSync(join(distDir, 'index.js'), indexContent);

console.log('✓ Build complete!');
console.log(`  Generated ${Object.keys(flattenTokens(tokens)).length} design tokens`);
console.log(`  → dist/tokens.css`);
console.log(`  → dist/tokens.js`);
console.log(`  → dist/tokens.styl`);
console.log(`  → dist/tokens.d.ts`);
console.log(`  → dist/index.js`);
