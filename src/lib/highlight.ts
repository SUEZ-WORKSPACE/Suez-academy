export type Token = { text: string; cls: string };

const KEYWORDS =
  /^(const|let|var|function|return|export|import|from|async|await|new|type|interface|class|if|else|for|of|in|on|jobs|steps|resource|interface|router|no|ip|SELECT|FROM|GROUP|BY|COUNT|WHERE|true|false|null|runs-on)\b/;

/**
 * A tiny, forgiving highlighter for the snippets on the site: comments, strings,
 * numbers, keywords, calls and capitalised types. Not a parser, just colour.
 */
export function highlight(line: string): Token[] {
  const out: Token[] = [];
  let rest = line;
  const push = (text: string, cls: string) => {
    const last = out[out.length - 1];
    if (last && last.cls === cls) last.text += text;
    else out.push({ text, cls });
  };

  while (rest.length) {
    let m: RegExpMatchArray | null;
    if ((m = rest.match(/^(\/\/.*|#\s.*|\[[✓!]\].*|✔.*|→.*)/))) {
      const t = m[0];
      push(t, t.startsWith("//") || t.startsWith("#") ? "tok-cm" : t.startsWith("[!]") ? "tok-num" : "tok-str");
    } else if ((m = rest.match(/^\$\s/))) {
      push(m[0], "tok-str");
    } else if ((m = rest.match(/^("[^"]*"|'[^']*'|`[^`]*`)/))) {
      push(m[0], "tok-str");
    } else if ((m = rest.match(/^\d[\d./]*/))) {
      push(m[0], "tok-num");
    } else if ((m = rest.match(KEYWORDS))) {
      push(m[0], "tok-kw");
    } else if ((m = rest.match(/^[A-Za-z_][\w-]*(?=\()/))) {
      push(m[0], "tok-fn");
    } else if ((m = rest.match(/^[A-Z][\w]*/))) {
      push(m[0], "tok-type");
    } else if ((m = rest.match(/^[A-Za-z_][\w-]*/))) {
      push(m[0], "");
    } else if ((m = rest.match(/^[{}()[\];,.:=<>/+*&|!?-]+/))) {
      push(m[0], "tok-pun");
    } else {
      push(rest[0], "");
      rest = rest.slice(1);
      continue;
    }
    rest = rest.slice(m[0].length);
  }
  return out;
}

/** Canvas colours for the same token classes (the tunnel draws code on textures). */
export const tokenColor: Record<string, string> = {
  "tok-kw": "#c792ea",
  "tok-str": "#7ee7a8",
  "tok-num": "#ffb86b",
  "tok-fn": "#82aaff",
  "tok-type": "#ffd866",
  "tok-cm": "#5c6b82",
  "tok-pun": "#93a3b8",
  "": "#e8eef6",
};
