

const BASE = 'https://api.relay.dev';

export function toJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function hasBody(ep: any): boolean {
  return !!ep.requestBody && ['POST', 'PUT', 'PATCH'].includes(ep.method);
}

export function buildCurl(ep: any): string {
  const lines: string[] = [];
  lines.push(`curl -X ${ep.method} "${BASE}${ep.route}" \\`);
  if (ep.requiresAuth) lines.push(`  -H "Authorization: Bearer $RELAY_API_KEY" \\`);
  if (hasBody(ep)) lines.push(`  -H "Content-Type: application/json" \\`);
  ep.headers
    .filter((h: any) => h.name.toLowerCase() !== 'authorization' && h.name.toLowerCase() !== 'content-type')
    .forEach((h: any) => lines.push(`  -H "${h.name}: ${h.example ?? '<' + h.type + '>'}" \\`));
  if (hasBody(ep)) {
    lines.push(`  -d '${JSON.stringify(ep.requestBody)}'`);
  } else {
    // remove trailing backslash on last line
    const last = lines.pop();
    if (last) lines.push(last.replace(/\s*\\\s*$/, ''));
  }
  return lines.join('\n');
}

export function buildTypeScript(ep: any): string {
  const body = hasBody(ep) ? `,\n  body: JSON.stringify(${JSON.stringify(ep.requestBody, null, 2).replace(/\n/g, '\n  ')})` : '';
  const auth = ep.requiresAuth ? `\n    Authorization: \`Bearer \${process.env.RELAY_API_KEY}\`,` : '';
  const ct = hasBody(ep) ? `\n    "Content-Type": "application/json",` : '';
  return `import { fetch } from "undici";

const res = await fetch("${BASE}${ep.route}", {
  method: "${ep.method}",
  headers: {${auth}${ct}
  }${body}
});

const data = await res.json();
console.log(data);`;
}

export function buildNode(ep: any): string {
  const body = hasBody(ep) ? `,\n  body: JSON.stringify(${JSON.stringify(ep.requestBody, null, 2).replace(/\n/g, '\n  ')})` : '';
  const auth = ep.requiresAuth ? `\n    Authorization: \`Bearer \${process.env.RELAY_API_KEY}\`,` : '';
  const ct = hasBody(ep) ? `\n    "Content-Type": "application/json",` : '';
  return `// Node 20+ (built-in fetch)
const res = await fetch("${BASE}${ep.route}", {
  method: "${ep.method}",
  headers: {${auth}${ct}
  }${body}
});

const data = await res.json();
console.log(data);`;
}

export function buildPython(ep: any): string {
  const headers: string[] = [];
  if (ep.requiresAuth) headers.push(`"Authorization": f"Bearer {os.environ['RELAY_API_KEY']}"`);
  if (hasBody(ep)) headers.push(`"Content-Type": "application/json"`);
  const headersStr = headers.length ? `{\n        ${headers.join(',\n        ')}\n    }` : '{}';
  const body = hasBody(ep) ? `,\n    json=${pyJson(ep.requestBody!)}` : '';
  return `import os
import requests

resp = requests.${ep.method.toLowerCase()}(
    "${BASE}${ep.route}",
    headers=${headersStr}${body}
)
print(resp.json())`;
}

function pyJson(v: unknown, indent = 1): string {
  const pad = '    '.repeat(indent);
  const padEnd = '    '.repeat(indent - 1);
  if (v === null) return 'None';
  if (typeof v === 'boolean') return v ? 'True' : 'False';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    return '[\n' + v.map((x) => pad + pyJson(x, indent + 1)).join(',\n') + '\n' + padEnd + ']';
  }
  if (typeof v === 'object') {
    const entries = Object.entries(v as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return '{\n' + entries.map(([k, val]) => pad + JSON.stringify(k) + ': ' + pyJson(val, indent + 1)).join(',\n') + '\n' + padEnd + '}';
  }
  return JSON.stringify(v);
}
