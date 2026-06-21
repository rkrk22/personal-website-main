import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { createDefaultNoteMarkdown, type CreateNotePayload, getSafeNotes } from "@/lib/notes";
import { usePageMeta } from "@/lib/page-meta";
import { useState } from "react";

function FeaturedNoteCard({
  slug,
  title,
  excerpt,
  date,
  readTime,
}: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}) {
  return (
    <Link
      to={`/notes/${slug}/`}
      className="group block rounded-[2rem] border border-border bg-[linear-gradient(180deg,rgba(247,244,236,0.95),rgba(255,255,255,1))] px-6 py-8 transition-all hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-sm sm:px-8 sm:py-10"
    >
      <div className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="uppercase tracking-[0.18em]">Notes</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{date}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{readTime}</span>
        </div>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-tight text-muted-foreground sm:text-lg">{excerpt}</p>
        <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
          Open note
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

function NoteCard({
  slug,
  title,
  excerpt,
  date,
  readTime,
}: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}) {
  return (
    <Link
      to={`/notes/${slug}/`}
      className="group block rounded-[1.75rem] border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-sm"
    >
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>{date}</span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span>{readTime}</span>
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-3 max-w-2xl text-base leading-tight text-muted-foreground">{excerpt}</p>
      <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground">
        Read note
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function CreateNoteCard() {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const createNote = async () => {
    setSaveState("saving");
    setSaveMessage("");

    try {
      const payload: CreateNotePayload = {
        title: "Untitled",
        excerpt: "Draft note.",
        readTime: "1 min read",
        markdown: createDefaultNoteMarkdown("Untitled"),
      };
      const response = await fetch("/__create-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseBody = (await response.json().catch(() => null)) as
        | {
            error?: string;
            slug?: string;
          }
        | null;

      if (!response.ok || !responseBody?.slug) {
        throw new Error(responseBody?.error ?? "Failed to create note");
      }

      window.location.assign(`/notes/${responseBody.slug}/`);
    } catch (error) {
      setSaveState("error");
      setSaveMessage(error instanceof Error ? error.message : "Failed to create note");
    }
  };

  return (
    <section className="rounded-[1.75rem] border border-border bg-card p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">New note</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Работает только на localhost. По нажатию сразу создаёт `untitled.md` или следующий
            свободный вариант в `src/content/`.
          </p>
        </div>
        <Button onClick={createNote} disabled={saveState === "saving"}>
          {saveState === "saving" ? "Creating..." : "Create note"}
        </Button>
      </div>

      {saveMessage ? <p className="mt-3 text-sm text-destructive">{saveMessage}</p> : null}
    </section>
  );
}

const isLocalEditorEnabled = import.meta.env.DEV;

export function NotesPage() {
  const notes = getSafeNotes();
  const featuredNotes = notes.filter((note) => note.indexLayout === "feature");
  const regularNotes = notes.filter((note) => note.indexLayout !== "feature");

  usePageMeta({
    title: "Notes — Ruslan Kim",
    description: "Thoughts, essays, and practical notes on drawing, game art, and creative work.",
    ogTitle: "Notes — Ruslan Kim",
    ogDescription:
      "Thoughts, essays, and practical notes on drawing, game art, and creative work.",
  });

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-6 sm:pt-8">
        <section className="mt-8 space-y-4">
          {isLocalEditorEnabled ? <CreateNoteCard /> : null}
          {featuredNotes.map((note) => (
            <FeaturedNoteCard key={note.slug} {...note} />
          ))}
          {regularNotes.map((note) => (
            <NoteCard key={note.slug} {...note} />
          ))}
        </section>

        <SiteFooter />
      </main>
    </>
  );
}

export default NotesPage;
