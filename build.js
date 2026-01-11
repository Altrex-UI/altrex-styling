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

// Write files
const cssContent = generateCSS(tokens);
writeFileSync(join(distDir, 'tokens.css'), cssContent);

const jsContent = generateJS(tokens);
writeFileSync(join(distDir, 'tokens.js'), jsContent);

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
console.log(`  → dist/tokens.d.ts`);
console.log(`  → dist/index.js`);
