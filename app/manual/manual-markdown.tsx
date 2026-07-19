import { createElement, Fragment, type ReactNode } from "react";
import { ExpandableImage } from "../expandable-image";
import { sitePath } from "../i18n";

const inlineTokenPattern = /(!?\[([^\]]*)\]\(([^)]+)\)|`([^`]+)`)/g;
const imageLinePattern = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const listItemPattern = /^(?:([-*])|(\d+)\.)\s+(.+)$/;
const tableSeparatorPattern = /^\|?(?:\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/;

function slugify(value: string) {
  return value
    .toLocaleLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function manualAssetPath(value: string) {
  const normalized = value.replace(/^\.\//, "");
  if (normalized.startsWith("images/pages/") && !normalized.includes("..")) {
    return sitePath(`/product-manual/${normalized}`);
  }

  return "";
}

function safeLink(value: string) {
  if (value.startsWith("#")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/") && !value.startsWith("//")) return sitePath(value);
  return "";
}

function renderInline(value: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let sequence = 0;

  for (const match of value.matchAll(inlineTokenPattern)) {
    const index = match.index ?? 0;
    if (index > cursor) nodes.push(value.slice(cursor, index));

    const key = `${keyPrefix}-${sequence++}`;
    if (match[4] !== undefined) {
      nodes.push(<code key={key}>{match[4]}</code>);
    } else if (match[1].startsWith("!")) {
      const src = manualAssetPath(match[3]);
      if (src) nodes.push(<img key={key} src={src} alt={match[2]} loading="lazy" />);
    } else {
      const href = safeLink(match[3]);
      nodes.push(href ? <a key={key} href={href}>{match[2]}</a> : match[2]);
    }

    cursor = index + match[0].length;
  }

  if (cursor < value.length) nodes.push(value.slice(cursor));
  return nodes;
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTable(lines: string[], index: number) {
  return lines[index]?.trim().startsWith("|") && tableSeparatorPattern.test(lines[index + 1]?.trim() ?? "");
}

function startsBlock(lines: string[], index: number) {
  const line = lines[index]?.trim() ?? "";
  return !line ||
    /^#{1,6}\s+/.test(line) ||
    imageLinePattern.test(line) ||
    listItemPattern.test(line) ||
    isTable(lines, index);
}

export function ManualMarkdown({
  markdown,
  locale = "ja",
}: {
  markdown: string;
  locale?: "ja" | "en";
}) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;
  let sequence = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      const text = heading[2].trim();
      const tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      const id = level === 1 ? undefined : slugify(text);
      blocks.push(createElement(tag, { id, key: `heading-${sequence}` }, renderInline(text, `heading-${sequence}`)));
      sequence += 1;
      index += 1;
      continue;
    }

    const image = imageLinePattern.exec(line);
    if (image) {
      const src = manualAssetPath(image[2]);
      if (src) {
        blocks.push(
          <figure className="manualFigure" key={`image-${sequence++}`}>
            <ExpandableImage
              src={src}
              alt={image[1]}
              expandLabel={locale === "en" ? `Expand ${image[1]}` : `${image[1]}を拡大表示`}
              closeLabel={locale === "en" ? "Close expanded image" : "拡大表示を閉じる"}
            />
            <figcaption>{image[1]}</figcaption>
          </figure>,
        );
      }
      index += 1;
      continue;
    }

    if (isTable(lines, index)) {
      const header = splitTableRow(lines[index]);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }

      const tableKey = `table-${sequence++}`;
      blocks.push(
        <div className="manualTableWrap" key={tableKey}>
          <table>
            <thead>
              <tr>{header.map((cell, cellIndex) => <th key={`${tableKey}-h-${cellIndex}`}>{renderInline(cell, `${tableKey}-h-${cellIndex}`)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${tableKey}-r-${rowIndex}`}>
                  {row.map((cell, cellIndex) => <td key={`${tableKey}-${rowIndex}-${cellIndex}`}>{renderInline(cell, `${tableKey}-${rowIndex}-${cellIndex}`)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const listMatch = listItemPattern.exec(line);
    if (listMatch) {
      const ordered = Boolean(listMatch[2]);
      const items: string[] = [];
      while (index < lines.length) {
        const item = listItemPattern.exec(lines[index].trim());
        if (!item || Boolean(item[2]) !== ordered) break;
        items.push(item[3]);
        index += 1;
      }

      const listKey = `list-${sequence++}`;
      const children = items.map((item, itemIndex) => (
        <li key={`${listKey}-${itemIndex}`}>{renderInline(item, `${listKey}-${itemIndex}`)}</li>
      ));
      blocks.push(ordered ? <ol key={listKey}>{children}</ol> : <ul key={listKey}>{children}</ul>);
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (index < lines.length && !startsBlock(lines, index)) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    const paragraphKey = `paragraph-${sequence++}`;
    blocks.push(
      <p key={paragraphKey}>
        {renderInline(paragraphLines.join(" "), paragraphKey).map((node, nodeIndex) => (
          <Fragment key={`${paragraphKey}-${nodeIndex}`}>{node}</Fragment>
        ))}
      </p>,
    );
  }

  return <div className="manualArticle">{blocks}</div>;
}
