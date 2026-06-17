function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export type ImageAlignment = "left" | "center" | "right";

export type ImageBlock = {
  alt: string;
  url: string;
  width: number;
  align: ImageAlignment;
  indent: number;
};

const defaultImageWidth = 100;
const defaultImageAlignment: ImageAlignment = "center";
const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
const markdownImageLinePattern = /^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)(?:\s*\{([^}]+)\})?$/i;
const bareImageLinePattern = /^(https?:\/\/\S+?)(?:\s*\{([^}]+)\})?$/i;
const markdownLinkPattern = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/i;
const bareLinkLinePattern = /^https?:\/\/\S+$/i;

function clampImageWidth(width: number) {
  return Math.min(100, Math.max(20, Math.round(width)));
}

function parseImageAttributes(attributes?: string) {
  const parsed = {
    width: defaultImageWidth,
    align: defaultImageAlignment,
  };

  if (!attributes) {
    return parsed;
  }

  const widthMatch = attributes.match(/width\s*=\s*(\d{1,3})/i);

  if (widthMatch) {
    parsed.width = clampImageWidth(Number(widthMatch[1]));
  }

  const alignMatch = attributes.match(/align\s*=\s*(left|center|right)/i);

  if (alignMatch) {
    parsed.align = alignMatch[1].toLowerCase() as ImageAlignment;
  }

  return parsed;
}

function isImageUrl(url: string) {
  try {
    const normalizedUrl = new URL(url);
    const pathname = normalizedUrl.pathname.toLowerCase();

    return [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg"].some((extension) =>
      pathname.endsWith(extension),
    );
  } catch {
    return false;
  }
}

export function parseImageBlock(text: string): ImageBlock | null {
  const indent = text.match(/^\s*/)?.[0].length ?? 0;
  const line = text.trim();
  const markdownImageMatch = line.match(markdownImageLinePattern);

  if (markdownImageMatch) {
    const [, alt, url, attributes] = markdownImageMatch;

    if (!isImageUrl(url)) {
      return null;
    }

    const parsedAttributes = parseImageAttributes(attributes);

    return {
      alt,
      url,
      width: parsedAttributes.width,
      align: parsedAttributes.align,
      indent,
    };
  }

  const bareImageMatch = line.match(bareImageLinePattern);

  if (bareImageMatch) {
    const [, url, attributes] = bareImageMatch;

    if (!isImageUrl(url)) {
      return null;
    }

    const parsedAttributes = parseImageAttributes(attributes);

    return {
      alt: "",
      url,
      width: parsedAttributes.width,
      align: parsedAttributes.align,
      indent,
    };
  }

  return null;
}

export function formatImageBlock(image: ImageBlock) {
  const width = clampImageWidth(image.width);
  const align = image.align;
  const indent = " ".repeat(Math.max(0, image.indent));
  const suffix =
    width === defaultImageWidth && align === defaultImageAlignment
      ? ""
      : ` {width=${width} align=${align}}`;

  if (image.alt) {
    return `${indent}![${image.alt}](${image.url})${suffix}`;
  }

  return `${indent}${image.url}${suffix}`;
}

function renderImageBlock(image: ImageBlock) {
  const safeUrl = escapeHtml(image.url);
  const safeAlt = escapeHtml(image.alt);
  const safeAlign = escapeHtml(image.align);
  const indentOffset = Math.max(0, image.indent) * 0.75;

  return `<div class="markdown-image markdown-image--${safeAlign}" style="--markdown-image-width:${image.width}%;--markdown-image-indent:${indentOffset}rem"><img src="${safeUrl}" alt="${safeAlt}" loading="lazy" decoding="async" /></div>`;
}

function isGumroadUrl(url: string) {
  try {
    const normalizedUrl = new URL(url);
    return (
      normalizedUrl.hostname === "gumroad.com" || normalizedUrl.hostname.endsWith(".gumroad.com")
    );
  } catch {
    return false;
  }
}

function parseGumroadButton(line: string) {
  const trimmed = line.trim();

  if (bareLinkLinePattern.test(trimmed) && isGumroadUrl(trimmed)) {
    return {
      href: trimmed,
      label: "Купить на Gumroad",
    };
  }

  const markdownLinkMatch = trimmed.match(markdownLinkPattern);

  if (!markdownLinkMatch) {
    return null;
  }

  const [, label, href] = markdownLinkMatch;

  if (!isGumroadUrl(href)) {
    return null;
  }

  return {
    href,
    label: label.trim() || "Купить на Gumroad",
  };
}

function renderGumroadButton(href: string, label: string) {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);

  return `<div class="markdown-button-row"><a class="markdown-button markdown-button--gumroad" href="${safeHref}" target="_blank" rel="noreferrer">${safeLabel}</a></div>`;
}

function renderInline(text: string) {
  return escapeHtml(text)
    .replace(imagePattern, '<img src="$2" alt="$1" loading="lazy" decoding="async" />')
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

export function markdownToHtml(markdown: string) {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let blankLineCount = 0;

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }

    const content = paragraph.join(" ").trim();
    const image = parseImageBlock(content);

    if (image) {
      html.push(renderImageBlock(image));
      paragraph = [];
      return;
    }

    const gumroadButton = parseGumroadButton(content);

    if (gumroadButton) {
      html.push(renderGumroadButton(gumroadButton.href, gumroadButton.label));
      paragraph = [];
      return;
    }

    html.push(`<p>${paragraph.map((line) => renderInline(line)).join(" ")}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) {
      return;
    }

    html.push(`<ul>${listItems.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
    listItems = [];
  };

  const flushBlankSpace = () => {
    if (blankLineCount < 1) {
      blankLineCount = 0;
      return;
    }

    html.push(
      `<div class="markdown-spacer" style="--markdown-spacer-lines:${blankLineCount}"></div>`,
    );
    blankLineCount = 0;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      blankLineCount += 1;
      continue;
    }

    flushBlankSpace();

    if (line.startsWith("<") && line.endsWith(">")) {
      flushParagraph();
      flushList();
      html.push(line);
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);

    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const listItem = line.match(/^[-*]\s+(.+)$/);

    if (listItem) {
      flushParagraph();
      listItems.push(listItem[1]);
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  flushBlankSpace();

  return html.join("\n");
}
