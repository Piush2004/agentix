const fs = require('fs');
const https = require('https');
const path = require('path');

const screens = [
  {
    id: "a3f1c2d1dc06433c8c0b1655797fb4e6",
    route: "page.tsx", // Root Landing
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2ExMWEyOTliYzNiMDRkOGY4YzkxM2U1NjJkNzNjYTUxEgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "9f214866d93441ec83386ad2b080acc9",
    route: "(app)/dashboard/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzBhNTRiYTVmYmE4ZDQ2MDBhZDRhMGYzNTYzMmJiMjAzEgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "81303a853069414baea8786ee7ca7952",
    route: "(app)/agents/chat/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzg3MWJkNjYyOTMxNTRiNzZhNzA4YmEyMmMwZjExOGIzEgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "b84b781e03ea4fa2a7d9fe736425a4ed",
    route: "(app)/workspace/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzBiMjkwYzc1OTkyYzRlNjFhODI4ZDJiNjhkNTRmYzc2EgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "b444fefcb1344103a11fe432a6c5be3b",
    route: "(app)/settings/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzhhYjVkZjU5ZmRiYjRhOTJiMWIwNzFhZTc0YzY0N2E2EgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "cd1ff47c9fbb430d92b3fcde04afcb5c",
    route: "(app)/analysis/eda/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzVlZTg5MzdkMmVlNDRmOGVhNTJiMDg0NmUyNzIwZTY1EgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "bde5f68543ff493884d2c5f15ea4e478",
    route: "(app)/data/feature-engineering/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2RlZTJkN2UzY2QzYzQ0NWFiZGIwYTg5NzgxNDU5OTJkEgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "a0f2dc47df534cb99da23c2c76db763d",
    route: "(app)/data/ingestion/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2Q3MDY1OWIwNWNmODQwZTZiNTQyZGUxNzkyYTUyZWRjEgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "60bca3c88d4445f4bd7035ca2b921a1a",
    route: "(app)/data/cleaning/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2JlMTFlMjUwYmZkODRjMjg5YzhiZDlkZTc1MjAxZDIwEgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "264910fdc07948cdb76acf5726139562",
    route: "(app)/models/automl/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzg1OWRkMDFjOTI0ZTQ4ZmRiN2U2NzllZTc3NjIxNDE0EgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "3a3829f5a44d4e3cbf41017fd9a01361",
    route: "(app)/models/explainability/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2FlMGJhYjljZWIwYTQ4MGZhNTc3MDA5NWU5MWYwY2MwEgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "ef1d14c819f946aa8f86c591da88d16a",
    route: "(app)/agents/reports/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzM1ZTZhYzk0MzkwODQ0MDQ4YzliMTgzNDJkYzViZDA3EgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "845c9e7e63104f6facf2175e0dcaf4c7",
    route: "login/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzRlNzNmODZlMjA0YTRiNmI4OGI5M2IwZTQzYjE1ZTUxEgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "e1d818d07bd545eb820e54c316b2379d",
    route: "(app)/profile/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2M0MDM4NGZmZTU1MDRmOTQ5MWU0NjhmYzM2MDQyMDJjEgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "aba650c277c44f6d8817c8b063b3d59a",
    route: "(app)/monitoring/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzc2YThlNmJlYjk4ZDQxY2U5Zjc1OTc2ZDc1YWIyMWJiEgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "e7fa20fa2cac4f66bb3f07ecde8303f0",
    route: "(app)/registry/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzY1Yzg4OTc3YzBlODQ5ZWM4ZGQ1Yzg2N2IzOTI4NzZiEgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "973c4a30f2b54df3a6380a799cb480f0",
    route: "(app)/agents/brain/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2QxYzM2MWExMjQ2MzQ2YmRiNjFhMDJkYWZhMWM5MWE3EgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  },
  {
    id: "6852c805d6ee42018e08fa0020bfd242",
    route: "(app)/admin/page.tsx",
    url: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2ZiN2E1ODcyNzEwYjRiM2NiNmMyMTM5NmVkNDBjYzRiEgsSBxDe-9jzkh8YAZIBJAoKcHJvamVjdF9pZBIWQhQxMTg1MzcwMDU1MzU4NDE5MDcxNg&filename=&opi=89354086"
  }
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function convertHtmlToJsx(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : html;

  let scripts = [];
  bodyContent = bodyContent.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (match) => {
    scripts.push(match);
    return `__SCRIPT_TOKEN_${scripts.length - 1}__`;
  });

  let styles = [];
  bodyContent = bodyContent.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (match) => {
    styles.push(match);
    return `__STYLE_TOKEN_${styles.length - 1}__`;
  });

  bodyContent = bodyContent.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');

  bodyContent = bodyContent.replace(/__SCRIPT_TOKEN_(\d+)__/g, (match, i) => scripts[i]);
  bodyContent = bodyContent.replace(/__STYLE_TOKEN_(\d+)__/g, (match, i) => styles[i]);

  let jsx = bodyContent
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/viewbox/ig, 'viewBox')
    .replace(/stroke-width/g, 'strokeWidth')
    .replace(/stroke-linecap/g, 'strokeLinecap')
    .replace(/stroke-linejoin/g, 'strokeLinejoin')
    .replace(/fill-rule/g, 'fillRule')
    .replace(/clip-rule/g, 'clipRule')
    .replace(/stroke-miterlimit/g, 'strokeMiterlimit')
    .replace(/xmlns:xlink/g, 'xmlnsXlink')
    .replace(/xml:space/g, 'xmlSpace')
    .replace(/xlink:href/g, 'xlinkHref')
    .replace(/tabindex/ig, 'tabIndex')
    .replace(/onclick=/g, 'onClick=')
    .replace(/<!--[\s\S]*?-->/g, '');

  jsx = jsx.replace(/<(br|hr|img|input)([^>]*?)(?<!\/)>/g, '<$1$2 />');

  // Fix SVG specific attributes and elements that require camelCase in JSX
  jsx = jsx.replace(/<lineargradient/gi, '<linearGradient');
  jsx = jsx.replace(/<\/lineargradient>/gi, '</linearGradient>');
  jsx = jsx.replace(/stop-color/gi, 'stopColor');
  jsx = jsx.replace(/clip-path/gi, 'clipPath');
  jsx = jsx.replace(/stroke-width/gi, 'strokeWidth');
  jsx = jsx.replace(/stroke-dasharray/gi, 'strokeDasharray');
  jsx = jsx.replace(/stroke-dashoffset/gi, 'strokeDashoffset');
  jsx = jsx.replace(/stroke-linecap/gi, 'strokeLinecap');
  jsx = jsx.replace(/stroke-linejoin/gi, 'strokeLinejoin');
  jsx = jsx.replace(/fill-opacity/gi, 'fillOpacity');
  jsx = jsx.replace(/fill-rule/gi, 'fillRule');
  jsx = jsx.replace(/clip-rule/gi, 'clipRule');
  jsx = jsx.replace(/preserveaspectratio/gi, 'preserveAspectRatio');
  jsx = jsx.replace(/vector-effect/gi, 'vectorEffect');
  jsx = jsx.replace(/rows="(\d+)"/g, 'rows={$1}');
  jsx = jsx.replace(/checked=""/gi, 'defaultChecked');
  jsx = jsx.replace(/selected=""/gi, 'defaultValue="true"');
  jsx = jsx.replace(/disabled=""/gi, 'disabled={true}');
  jsx = jsx.replace(/readonly=""/gi, 'readOnly={true}');

  // Fix script and style tags for React
  jsx = jsx.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (match, content) => {
    if (!content.trim()) return match;
    const escaped = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    return `<script dangerouslySetInnerHTML={{ __html: \`${escaped}\` }} />`;
  });

  jsx = jsx.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (match, content) => {
    if (!content.trim()) return match;
    const escaped = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    return `<style dangerouslySetInnerHTML={{ __html: \`${escaped}\` }} />`;
  });

  jsx = jsx.replace(/style="([^"]+)"/g, (match, p1) => {
    const styleObj = p1.split(';').filter(s => s.trim()).map(s => {
      let [key, val] = s.split(':');
      if (!val) return '';
      key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      val = val.trim();
      return `${key}: "${val}"`;
    }).join(', ');
    return `style={{ ${styleObj} }}`;
  });

  return jsx;
}

async function run() {
  const baseDir = path.join(__dirname, 'frontend', 'src', 'app');
  
  for (const screen of screens) {
    console.log(`Processing ${screen.route}...`);
    const html = await fetchUrl(screen.url);
    const jsxContent = convertHtmlToJsx(html);
    
    const componentName = 'Screen_' + screen.id;
    let finalCode = `import React from 'react';\n\nexport default function ${componentName}() {\n  return (\n    <div className="min-h-screen bg-[#0a0a0b] text-white w-full h-full relative overflow-hidden">\n${jsxContent}\n    </div>\n  );\n}\n`;
    
    const outPath = path.join(baseDir, screen.route);
    const outDir = path.dirname(outPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.writeFileSync(outPath, finalCode, 'utf8');
    console.log(`Saved ${outPath}`);
  }
}

run().catch(console.error);
