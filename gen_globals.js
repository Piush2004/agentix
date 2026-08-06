const fs = require('fs');
const html = fs.readFileSync('sample.html', 'utf8');
const match = html.match(/tailwind\.config\s*=\s*(\{[\s\S]*?\});/);
if(!match) process.exit(1);

const cfg = new Function('return ' + match[1])();
const cols = cfg.theme.extend.colors;
const fonts = cfg.theme.extend.fontFamily;
const spacing = cfg.theme.extend.spacing;
const borderRadius = cfg.theme.extend.borderRadius;

let css = `@import "tailwindcss";\n\n@theme {\n`;
for(const [k,v] of Object.entries(cols)) {
  css += `  --color-${k}: ${v};\n`;
}
for(const [k,v] of Object.entries(fonts)) {
  css += `  --font-${k}: ${v[0].includes(' ') ? "'" + v[0] + "'" : v[0]};\n`;
}
for(const [k,v] of Object.entries(spacing)) {
  css += `  --spacing-${k}: ${v};\n`;
}
for(const [k,v] of Object.entries(borderRadius)) {
  css += `  --radius-${k === 'DEFAULT' ? 'md' : k}: ${v};\n`;
}
css += '}\n';

css += `
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background-color: var(--color-background);
  color: var(--color-on-background);
}
`;

fs.writeFileSync('agentix/app/globals.css', css, 'utf8');
