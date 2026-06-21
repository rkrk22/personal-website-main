import { markdownToHtml } from "@/lib/markdown";

export function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <article className="markdown-content rounded-3xl border border-border bg-card px-8 pb-8 pt-0 sm:px-10 sm:pb-10 sm:pt-0">
      <div dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }} />
    </article>
  );
}
