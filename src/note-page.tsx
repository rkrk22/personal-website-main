import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { MarkdownContent } from "@/components/MarkdownContent";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { getSafeNotes } from "@/lib/notes";
import { usePageMeta } from "@/lib/page-meta";

export function NotePage() {
  const { slug } = useParams<{ slug: string }>();
  const notes = getSafeNotes();
  const note = notes.find((entry) => entry.slug === slug);
  const markdown = note?.markdown;
  const isMissing = !note || !slug || !markdown;

  usePageMeta({
    title: isMissing ? "Note Not Found — Ruslan Kim" : `${note.title} — Ruslan Kim`,
    description: isMissing
      ? "The note you're looking for doesn't exist or has been moved."
      : note.excerpt,
    ogTitle: isMissing ? "Note Not Found — Ruslan Kim" : `${note.title} — Ruslan Kim`,
    ogDescription: isMissing
      ? "The note you're looking for doesn't exist or has been moved."
      : note.excerpt,
  });

  if (isMissing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Note not found</h2>
          <p className="mt-2 text-base text-muted-foreground">
            The note you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-6">
            <Link
              to="/notes/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Back to notes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-6 sm:pt-8">
        <Link
          to="/notes/"
          className="inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to notes
        </Link>

        <section className="mt-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{note.date}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>{note.readTime}</span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {note.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {note.excerpt}
            </p>
          </div>

          <MarkdownContent markdown={markdown} />
        </section>

        <SiteFooter />
      </main>
    </>
  );
}

export default NotePage;
