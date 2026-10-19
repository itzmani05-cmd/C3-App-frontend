// Recognises the question layouts that are best shown as structure instead of one paragraph. Each parser works whether
// the lists are on separate lines or flattened onto one line ("List I A. … B. … List II 1. … 2. …"), and returns null
// when the text is not that kind of question. (Same rules as the website's QuestionRenderer.)

// "List I", "List-II", "Group (1)", "Column II": the headers that start each list. II is tried before I.
const LIST_HEADER_RE = /\b(?:List|Group|Column)[\s-]*\(?(II|I|2|1)\)?(?![A-Za-z0-9])/gi;
// "A.", "B)", "(P)", "1.", "(iii)", "iv." when they start a word: the labels in front of list entries.
const ITEM_MARKER_RE = /(?:^|\s)(\([A-Za-z0-9]{1,4}\)|[A-Z][.)]|\d{1,2}[.)]|(?:i{1,3}|iv|vi{0,3}|ix|x)[.)])(?=\s|$)/g;
const TRAILER_RE = /\s+(?=(?:Select|Choose|Which|Identify|Codes?\s*:|The correct)\b)/;
const ASSERTION_RE = /(?:assertion\s*\(A\)|assertion|கூற்று\s*(?:\([Aஅ]\))?)\s*:/i;
const REASON_RE = /(?:reason\s*\(R\)|reason|காரணம்\s*(?:\([Rக]\))?)\s*:/i;
const NUMBER_MARKER_RE = /(?:^|\s)(\d{1,2})[.)](?=\s)/g;

function allMatches(text, regex) {
  const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : `${regex.flags}g`);
  const found = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    found.push(m);
    if (m[0] === '') re.lastIndex += 1;
  }
  return found;
}

/** Splits text at its first line break or instruction sentence ("Select the correct answer…"): [body, trailer]. */
function splitTrailer(text) {
  const newline = text.indexOf('\n');
  const sentence = text.search(TRAILER_RE);
  const cut = [newline, sentence].filter((n) => n > 0).sort((a, b) => a - b)[0];
  return cut === undefined ? [text.trim(), ''] : [text.slice(0, cut).trim(), text.slice(cut).trim()];
}

/** One list's text -> its optional title (e.g. "(Crop Type)") and labelled entries. */
function parseList(segment) {
  const marks = allMatches(segment, ITEM_MARKER_RE);
  let title = '';
  let items;

  if (marks.length === 0) {
    const lines = segment.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines[0] && /^\(.*\)$/.test(lines[0])) title = lines.shift();
    items = lines.map((text) => ({ marker: '', text }));
  } else {
    title = segment.slice(0, marks[0].index).trim();
    items = marks.map((m, i) => {
      const start = m.index + m[0].length;
      const end = marks[i + 1] ? marks[i + 1].index : segment.length;
      return { marker: m[1], text: segment.slice(start, end).trim() };
    });
    // A first entry that is only a parenthesised caption, e.g. "1. (Characteristic/Example)", is really the title.
    if (items.length > 1 && /^\(.*\)$/.test(items[0].text)) {
      title = [title, items[0].text].filter(Boolean).join(' ');
      items = items.slice(1);
    }
  }
  return { title, items };
}

export function parseMatchTheFollowing(text) {
  if (!text) return null;
  const headers = allMatches(text, LIST_HEADER_RE).map((m) => ({ at: m.index, end: m.index + m[0].length, isFirst: /^(I|1)$/i.test(m[1]) }));

  // The prompt can mention "Group I" and "Group II" in passing; use the first I-then-II pair followed by real entries.
  for (let i = 0; i < headers.length; i++) {
    const first = headers[i];
    const second = headers.slice(i + 1).find((h) => !h.isFirst);
    if (!first.isFirst || !second) continue;

    const left = parseList(text.slice(first.end, second.at));
    const right = parseList(text.slice(second.end));
    if (left.items.length < 2 || right.items.length < 2) continue;

    const last = right.items[right.items.length - 1];
    const [body, trailer] = splitTrailer(last.text);
    last.text = body;

    return { prompt: text.slice(0, first.at).trim(), titleI: left.title, titleII: right.title, listI: left.items, listII: right.items, trailer };
  }
  return null;
}

export function parseAssertionReason(text) {
  if (!text) return null;
  const a = ASSERTION_RE.exec(text);
  if (!a) return null;
  const afterAssertion = a.index + a[0].length;
  const r = REASON_RE.exec(text.slice(afterAssertion));
  if (!r) return null;
  const reasonStart = afterAssertion + r.index;

  const [reason, trailer] = splitTrailer(text.slice(reasonStart + r[0].length));
  return {
    header: text.slice(0, a.index).trim(),
    assertionLabel: a[0].replace(/\s*:\s*$/, ''),
    assertion: text.slice(afterAssertion, reasonStart).trim(),
    reasonLabel: r[0].replace(/\s*:\s*$/, ''),
    reason,
    trailer,
  };
}

export function parseStatements(text) {
  if (!text || !/\bstatements?\b/i.test(text)) return null;

  // Take the numbers 1, 2, 3… in order; any other "5." inside a statement is ordinary text.
  const marks = [];
  allMatches(text, NUMBER_MARKER_RE).forEach((m) => {
    if (Number(m[1]) === marks.length + 1) marks.push(m);
  });
  if (marks.length < 2) return null;

  const statements = marks.map((m, i) => {
    const start = m.index + m[0].length;
    const end = marks[i + 1] ? marks[i + 1].index : text.length;
    return text.slice(start, end).trim();
  });
  const [lastStatement, question] = splitTrailer(statements[statements.length - 1]);
  statements[statements.length - 1] = lastStatement;

  return { intro: text.slice(0, marks[0].index).trim(), statements, question };
}
