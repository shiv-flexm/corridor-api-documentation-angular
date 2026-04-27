// JSON syntax highlighter → returns HTML string with span tokens.
// Colors defined in styles.css (.tok-*)
export function highlightJson(input: string): string {
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escaped = escape(input);
  const pattern =
    /("(?:\\.|[^"\\])*"\s*:)|("(?:\\.|[^"\\])*")|(\b(?:true|false)\b)|(\bnull\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}\[\],:])/g;
  return escaped.replace(pattern, (match, key, str, bool, nul, num, punct) => {
    if (key) return `<span class="tok-key">${key}</span>`;
    if (str) return `<span class="tok-str">${str}</span>`;
    if (bool) return `<span class="tok-bool">${bool}</span>`;
    if (nul) return `<span class="tok-null">${nul}</span>`;
    if (num) return `<span class="tok-num">${num}</span>`;
    if (punct) return `<span class="tok-punct">${punct}</span>`;
    return match;
  });
}

// Generic shell / python / ts highlighter: very light — just comments + strings + keywords.
export function highlightCode(input: string, lang: 'bash' | 'ts' | 'py' | 'js'): string {
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let out = escape(input);

  if (lang === 'bash') {
    out = out
      .replace(/(#.*?$)/gm, '<span class="tok-null">$1</span>')
      .replace(/("(?:\\.|[^"\\])*")/g, '<span class="tok-str">$1</span>')
      .replace(/\b(curl|-X|-H|-d)\b/g, '<span class="tok-bool">$1</span>');
    return out;
  }

  const kwTs = /\b(import|from|const|let|var|async|await|return|new|export|function|if|else|for|of|in|true|false|null|undefined)\b/g;
  const kwPy = /\b(import|from|as|def|return|if|else|elif|for|in|True|False|None|os)\b/g;

  out = out
    .replace(/(#|\/\/)(.*?)$/gm, '<span class="tok-null">$1$2</span>')
    .replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g, '<span class="tok-str">$1</span>');

  if (lang === 'ts' || lang === 'js') out = out.replace(kwTs, '<span class="tok-bool">$1</span>');
  if (lang === 'py') out = out.replace(kwPy, '<span class="tok-bool">$1</span>');

  out = out.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>');
  return out;
}
