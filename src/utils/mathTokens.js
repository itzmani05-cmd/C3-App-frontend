// Finds LaTeX in question text: $$display$$, $inline$ (no space just inside the dollar signs and not followed by a digit,
// so "$5 and $10" stays plain unless the formula starts with a \command), and **bold**. Same rule as the website.
const TOKEN_RE = /\$\$([\s\S]+?)\$\$|\$(?!\s)((?:\\[\s\S]|[^$\\])+?)(?<!\s)\$(?!\d)|\*\*([\s\S]+?)\*\*|\$(?=\\)((?:\\[\s\S]|[^$\\])+?)(?<!\s)\$/g;

/** Splits text into plain runs, formulas and bold runs. Returns null when there is nothing special. */
export function tokenizeMath(text) {
  if (!text || (!text.includes('$') && !text.includes('**'))) return null;
  const parts = [];
  let last = 0;
  const re = new RegExp(TOKEN_RE.source, 'g');
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ kind: 'text', value: text.slice(last, m.index) });
    if (m[1] !== undefined) parts.push({ kind: 'display', value: m[1] });
    else if (m[2] !== undefined || m[4] !== undefined) parts.push({ kind: 'inline', value: m[2] !== undefined ? m[2] : m[4] });
    else parts.push({ kind: 'bold', value: m[3] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ kind: 'text', value: text.slice(last) });
  return parts;
}

/** True when the text has a formula that needs typesetting (bold alone is handled without it). */
export function hasMath(text) {
  const parts = tokenizeMath(text);
  return !!parts && parts.some((p) => p.kind === 'inline' || p.kind === 'display');
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The HTML body for a piece of text: plain runs escaped, formulas as placeholders the page typesets with KaTeX. */
export function toMathHtml(text) {
  const parts = tokenizeMath(text) || [{ kind: 'text', value: text }];
  return parts
    .map((p) => {
      if (p.kind === 'text') return escapeHtml(p.value);
      if (p.kind === 'bold') return `<b>${escapeHtml(p.value)}</b>`;
      const display = p.kind === 'display';
      // Until KaTeX has typeset it (or if it can't load), the formula's own source is shown.
      const source = escapeHtml(display ? `$$${p.value}$$` : `$${p.value}$`);
      return `<span class="m" data-d="${display ? 1 : 0}" data-t="${encodeURIComponent(p.value)}">${source}</span>`;
    })
    .join('');
}
