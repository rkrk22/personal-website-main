export type CreateNotePayload = {
  title?: string;
  excerpt?: string;
  readTime?: string;
  markdown?: string;
};

export type NoteFrontmatter = {
  collection: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  indexLayout: "card" | "feature";
};

export type NoteDocument = NoteFrontmatter & {
  slug: string;
  markdown: string;
};

const noteMarkdownModules = import.meta.glob("./../content/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export function createDefaultNoteMarkdown(title: string) {
  const safeTitle = title.trim() || "Untitled";

  return `---
collection: notes
title: ${safeTitle}
excerpt: Draft note.
date: ${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date())}
readTime: 1 min read
indexLayout: card
---

## ${safeTitle}

Напиши здесь основную мысль заметки.

## Draft

- тезис
- ссылка
- наблюдение
`;
}

function parseFrontmatter(markdown: string) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    return { data: {}, content: markdown };
  }

  const data: Record<string, string> = {};

  for (const line of match[1].split("\n")) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (key) {
      data[key] = value;
    }
  }

  return {
    data,
    content: markdown.slice(match[0].length),
  };
}

function getNotesFromMarkdownModules(): NoteDocument[] {
  return Object.entries(noteMarkdownModules)
    .map(([modulePath, rawMarkdown]) => {
      const { data, content } = parseFrontmatter(rawMarkdown);

      if (data.collection !== "notes") {
        return null;
      }

      const slug = modulePath.split("/").pop()?.replace(/\.md$/, "");

      if (!slug || !data.title || !data.excerpt || !data.date || !data.readTime) {
        return null;
      }

      return {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        readTime: data.readTime,
        indexLayout: data.indexLayout === "feature" ? "feature" : "card",
        collection: data.collection,
        markdown: content,
      } satisfies NoteDocument;
    })
    .filter((note): note is NoteDocument => note !== null)
    .sort((left, right) => {
      const leftTimestamp = Date.parse(left.date);
      const rightTimestamp = Date.parse(right.date);

      if (Number.isNaN(leftTimestamp) || Number.isNaN(rightTimestamp)) {
        return right.date.localeCompare(left.date);
      }

      return rightTimestamp - leftTimestamp;
    });
}

export function getSafeNotes() {
  try {
    return getNotesFromMarkdownModules();
  } catch (error) {
    console.error("Failed to parse notes markdown", error);
    return [];
  }
}
