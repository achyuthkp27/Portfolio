import { Fragment, type ReactNode } from "react";

/** Where an assistant link points: a section of the home page, a project page, or outside the site */
export type ChatLink =
  | { kind: "section"; id: string }
  | { kind: "project"; slug: string }
  | { kind: "external"; href: string };

/** Reads a link target the assistant wrote; anything that isn't one of these is dropped */
export const parseChatLink = (target: string): ChatLink | null => {
  const t = target.trim();
  let m = /^section:([a-z0-9-]+)$/i.exec(t);
  if (m) return { kind: "section", id: m[1] };
  m = /^project:([a-z0-9-]+)$/i.exec(t);
  if (m) return { kind: "project", slug: m[1] };
  if (/^(https:\/\/|mailto:)/i.test(t)) return { kind: "external", href: t };
  return null;
};

type RenderLink = (link: ChatLink, label: string, key: string) => ReactNode;

/** **bold**, [label](target) and bare https links inside one line, as React nodes (never HTML) */
const inline = (line: string, renderLink: RenderLink, keyBase: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(https:\/\/[^\s)]+[^\s).,;:!?])/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(line))) {
    if (match.index > last) nodes.push(line.slice(last, match.index));
    const key = `${keyBase}-${i++}`;
    if (match[1] !== undefined) {
      // Bold can wrap a link ("**[title](project:slug)**"), so its inside is read the same way
      nodes.push(<strong key={key}>{inline(match[1], renderLink, key)}</strong>);
    } else if (match[2] !== undefined) {
      const link = parseChatLink(match[3]);
      nodes.push(link ? renderLink(link, match[2], key) : match[2]);
    } else if (match[4] !== undefined) {
      nodes.push(renderLink({ kind: "external", href: match[4] }, match[4], key));
    }
    last = pattern.lastIndex;
  }
  if (last < line.length) nodes.push(line.slice(last));
  return nodes;
};

/**
 * The small Markdown the assistant is asked to write: paragraphs, "-" or "1." lists, **bold**
 * and links. Built as React elements, so nothing the model writes can inject HTML.
 */
export const renderChatMarkdown = (source: string, renderLink: RenderLink): ReactNode => {
  const bullet = /^\s*(?:[-*•]|\d+[.)])\s+/;
  // Group consecutive lines: list items into one list, anything else into one paragraph; a
  // blank line always ends a group
  type Group = { list: boolean; ordered: boolean; lines: string[] };
  const groups: Group[] = [];
  let current: Group | null = null;
  for (const raw of source.replace(/\r/g, "").split("\n")) {
    if (!raw.trim()) {
      current = null;
      continue;
    }
    const isItem = bullet.test(raw);
    if (!current || current.list !== isItem) {
      current = { list: isItem, ordered: isItem && /^\s*\d/.test(raw), lines: [] };
      groups.push(current);
    }
    current.lines.push(isItem ? raw.replace(bullet, "") : raw.replace(/^#+\s*/, ""));
  }
  return groups.map((group, g) => {
    if (group.list) {
      const Tag = group.ordered ? "ol" : "ul";
      return (
        <Tag key={g} className={group.ordered ? "list-decimal pl-5 space-y-1" : "list-disc pl-5 space-y-1"}>
          {group.lines.map((line, i) => (
            <li key={i}>{inline(line, renderLink, `${g}-${i}`)}</li>
          ))}
        </Tag>
      );
    }
    return (
      <p key={g}>
        {group.lines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {inline(line, renderLink, `${g}-${i}`)}
          </Fragment>
        ))}
      </p>
    );
  });
};
