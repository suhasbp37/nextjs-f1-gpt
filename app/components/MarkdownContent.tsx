"use client";

import React from "react";

interface MarkdownContentProps {
  content: string;
  onSelectCitation?: (citationId: number) => void;
}

export default function MarkdownContent({ content, onSelectCitation }: MarkdownContentProps) {
  // Render inline formatting: **bold**, *italic*, `code`, and [1] citation pills
  const renderInline = (text: string): React.ReactNode => {
    // Regex splits text by citations like [1], [2], bold **text**, code `text`
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Pattern for citation [1] or [2]
    const citationRegex = /\[(\d+)\]/;
    const boldRegex = /\*\*([^*]+)\*\*/;
    const codeRegex = /`([^`]+)`/;

    while (remaining.length > 0) {
      // Find the earliest match among the patterns
      const citMatch = remaining.match(citationRegex);
      const boldMatch = remaining.match(boldRegex);
      const codeMatch = remaining.match(codeRegex);

      const matches = [
        citMatch ? { type: "citation", match: citMatch, index: citMatch.index! } : null,
        boldMatch ? { type: "bold", match: boldMatch, index: boldMatch.index! } : null,
        codeMatch ? { type: "code", match: codeMatch, index: codeMatch.index! } : null,
      ].filter(Boolean) as { type: string; match: RegExpMatchArray; index: number }[];

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      // Pick earliest match
      matches.sort((a, b) => a.index - b.index);
      const first = matches[0];

      // Add text before match
      if (first.index > 0) {
        parts.push(remaining.slice(0, first.index));
      }

      if (first.type === "citation") {
        const citationNum = parseInt(first.match[1], 10);
        parts.push(
          <button
            key={`cit-${keyIdx++}`}
            type="button"
            className="citation-pill"
            title={`View Source [${citationNum}]`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectCitation?.(citationNum);
            }}
          >
            [{citationNum}]
          </button>
        );
      } else if (first.type === "bold") {
        parts.push(
          <strong key={`b-${keyIdx++}`} className="f1-strong">
            {first.match[1]}
          </strong>
        );
      } else if (first.type === "code") {
        parts.push(
          <code key={`code-${keyIdx++}`} className="telemetry-mono">
            {first.match[1]}
          </code>
        );
      }

      remaining = remaining.slice(first.index + first.match[0].length);
    }

    return <>{parts}</>;
  };

  // Split lines and parse blocks: tables, headers, lists, code blocks, paragraphs
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 1. Code / Telemetry Block
    if (line.trim().startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={`code-block-${i}`} className="f1-code-block">
          <div className="f1-code-header">
            <span className="f1-code-tag">TELEMETRY DATA</span>
          </div>
          <pre>
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // 2. Table detection (starts with | and followed by separator | --- |)
    if (line.trim().startsWith("|") && i + 1 < lines.length && lines[i + 1].includes("---")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }

      const parseCells = (rowStr: string) =>
        rowStr
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());

      const headerCells = parseCells(tableLines[0]);
      const bodyRows = tableLines.slice(2).map(parseCells);

      elements.push(
        <div key={`table-${i}`} className="f1-table-wrapper">
          <table className="f1-table">
            <thead>
              <tr>
                {headerCells.map((h, hIdx) => (
                  <th key={`th-${hIdx}`}>{renderInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rIdx) => (
                <tr key={`tr-${rIdx}`}>
                  {row.map((cell, cIdx) => (
                    <td key={`td-${rIdx}-${cIdx}`}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // 3. Headings
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="f1-h3">
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="f1-h2">
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="f1-h1">
          {renderInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    // 4. Bullet lists
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const listItems: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))
      ) {
        listItems.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="f1-ul">
          {listItems.map((item, itemIdx) => (
            <li key={`li-${itemIdx}`}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // 5. Numbered lists
    if (/^\d+\.\s/.test(line.trim())) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="f1-ol">
          {listItems.map((item, itemIdx) => (
            <li key={`oli-${itemIdx}`}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // 6. Blank line or paragraph
    if (line.trim() === "") {
      i++;
      continue;
    }

    elements.push(
      <p key={`p-${i}`} className="f1-paragraph">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="f1-markdown-body">{elements}</div>;
}
