import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Instagram,
  Pencil,
  RotateCcw,
  Send,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import avatar from "@/assets/avatar.jpg";
import bookGameArtGuidebookMarkdown from "@/content/book-game-art-guidebook.md?raw";
import { markdownToHtml } from "@/lib/markdown";

type MetaDefinition = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

function usePageMeta({ title, description, ogTitle, ogDescription }: MetaDefinition) {
  useEffect(() => {
    document.title = title;

    const upsertMeta = (selector: string, attributes: Record<string, string>, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);

      if (!element) {
        element = document.createElement("meta");
        Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    upsertMeta('meta[name="description"]', { name: "description" }, description);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, ogTitle ?? title);
    upsertMeta(
      'meta[property="og:description"]',
      { property: "og:description" },
      ogDescription ?? description,
    );
  }, [description, ogDescription, ogTitle, title]);
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.94a8.16 8.16 0 0 0 4.77 1.52V7.05a4.85 4.85 0 0 1-1.84-.36z" />
    </svg>
  );
}

const socials = [
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "TikTok", href: "https://tiktok.com", Icon: TikTokIcon },
  { label: "YouTube", href: "https://youtube.com", Icon: Youtube },
  { label: "Telegram", href: "https://t.me", Icon: Send },
];

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
}

function HomePage() {
  usePageMeta({
    title: "Ruslan Kim — Digital Artist & Game Art Educator",
    description:
      "Digital artist, game art educator, author of Game Art Guidebook. Portfolio, books, courses and creative process.",
    ogTitle: "Ruslan Kim — Digital Artist",
    ogDescription: "Digital artist, game art educator, author of Game Art Guidebook.",
  });

  return (
    <main className="mx-auto max-w-xl px-6 pb-24 pt-16 sm:pt-20">
      <section className="flex flex-col items-center text-center">
        <img
          src={avatar}
          alt="Ruslan Kim"
          width={144}
          height={144}
          className="h-32 w-32 rounded-full object-cover sm:h-36 sm:w-36"
        />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Ruslan Kim</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Digital artist • Game art educator • Author of Game Art Guidebook
        </p>

        <div className="mt-6 flex items-center gap-5">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <Link
          to="/books/game-art-guidebook/"
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/30 hover:shadow-sm"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <BookOpen className="h-5 w-5 text-foreground" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold tracking-tight">Game Art Guidebook</div>
            <div className="text-xs text-muted-foreground">
              A practical guide to a career in game art
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
        </Link>

        <a
          href="https://example.com/portfolio"
          target="_blank"
          rel="noreferrer"
          className="group mt-3 flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/30 hover:shadow-sm"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold">
            P
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold tracking-tight">Portfolio</div>
            <div className="text-xs text-muted-foreground">Selected works and projects</div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
        </a>
      </section>

      <section className="mt-10">
        <div className="rounded-2xl bg-foreground px-6 py-8 text-background sm:px-10 sm:py-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/10">
              <Send className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Signup</h2>
            <p className="mt-2 max-w-sm text-sm text-background/70">
              Notes on game art, digital painting and the creative process.
            </p>
            <a
              href="/signup/"
              className="mt-5 inline-flex items-center justify-center rounded-md bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
            >
              Sign up
            </a>
          </div>
        </div>
      </section>

      <footer className="mt-16 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ruslan Kim
      </footer>
    </main>
  );
}

type EditorMode = "preview" | "edit";
const isLocalEditorEnabled = import.meta.env.DEV;

function MarkdownEditor({
  storageKey,
  initialMarkdown,
  filePath,
}: {
  storageKey: string;
  initialMarkdown: string;
  filePath: string;
}) {
  const [markdown, setMarkdown] = useState(() => {
    if (typeof window === "undefined") {
      return initialMarkdown;
    }

    return window.localStorage.getItem(storageKey) ?? initialMarkdown;
  });
  const [mode, setMode] = useState<EditorMode>("preview");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    window.localStorage.setItem(storageKey, markdown);
  }, [markdown, storageKey]);

  useEffect(() => {
    if (saveState !== "saved") {
      return;
    }

    const timeoutId = window.setTimeout(() => setSaveState("idle"), 1500);
    return () => window.clearTimeout(timeoutId);
  }, [saveState]);

  const updateMarkdown = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  const wrapSelection = (before: string, after = "") => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.slice(start, end);
    const nextValue = markdown.slice(0, start) + before + selected + after + markdown.slice(end);

    setMarkdown(nextValue);

    window.requestAnimationFrame(() => {
      textarea.focus();
      const cursorStart = start + before.length;
      const cursorEnd = cursorStart + selected.length;
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const insertBlock = (block: string) => {
    const textarea = textareaRef.current;
    const insertion = `\n\n${block}\n\n`;

    if (!textarea) {
      setMarkdown((current) => `${current}${insertion}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = markdown.slice(0, start) + insertion + markdown.slice(end);

    setMarkdown(nextValue);

    window.requestAnimationFrame(() => {
      textarea.focus();
      const position = start + insertion.length;
      textarea.setSelectionRange(position, position);
    });
  };

  const resetMarkdown = () => {
    setMarkdown(initialMarkdown);
    window.localStorage.removeItem(storageKey);
    setSaveState("idle");
    setSaveMessage("");
  };

  const saveMarkdown = async () => {
    setSaveState("saving");
    setSaveMessage("");

    try {
      const response = await fetch("/__save-markdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath,
          content: markdown,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Failed to save markdown");
      }

      setSaveState("saved");
      setSaveMessage("Saved to file");
    } catch (error) {
      setSaveState("error");
      setSaveMessage(error instanceof Error ? error.message : "Failed to save markdown");
    }
  };

  if (!isLocalEditorEnabled) {
    return (
      <article
        className="markdown-content rounded-3xl border border-border bg-card p-8 sm:p-10"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(initialMarkdown) }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold tracking-tight">Editor</div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={mode === "preview" ? "default" : "outline"}
              onClick={() => setMode("preview")}
            >
              Preview
            </Button>
            <Button
              variant={mode === "edit" ? "default" : "outline"}
              onClick={() => setMode("edit")}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" onClick={resetMarkdown}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={saveMarkdown} disabled={saveState === "saving"}>
              {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        {saveMessage ? (
          <p
            className={`mt-3 text-sm ${
              saveState === "error" ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {saveMessage}
          </p>
        ) : null}

        {mode === "edit" ? (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => wrapSelection("**", "**")}>
                Bold
              </Button>
              <Button size="sm" variant="outline" onClick={() => wrapSelection("*", "*")}>
                Italic
              </Button>
              <Button size="sm" variant="outline" onClick={() => insertBlock("# Heading")}>
                H1
              </Button>
              <Button size="sm" variant="outline" onClick={() => insertBlock("## Section")}>
                H2
              </Button>
              <Button size="sm" variant="outline" onClick={() => insertBlock("- List item")}>
                List
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertBlock("[Link text](https://example.com)")}
              >
                Link
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  insertBlock(
                    '<iframe title="widget" style="border: none" width="180" height="80" src="https://example.com"></iframe>',
                  )
                }
              >
                Iframe
              </Button>
            </div>

            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={updateMarkdown}
              spellCheck={false}
              className="min-h-[360px] w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-7 outline-none ring-0"
            />
          </div>
        ) : null}
      </div>

      <article
        className="markdown-content rounded-3xl border border-border bg-card p-8 sm:p-10"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }}
      />
    </div>
  );
}

export function BookPage() {
  usePageMeta({
    title: "Game Art Guidebook — Ruslan Kim",
    description:
      "Game Art Guidebook by Ruslan Kim. Learn what a game artist does, how to build skills, and where to start your career path.",
    ogTitle: "Game Art Guidebook — Ruslan Kim",
    ogDescription:
      "A practical guide to a career in game art, with an overview of the book and purchase options.",
  });

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <section className="mt-8">
        <MarkdownEditor
          storageKey="page:/books/game-art-guidebook"
          initialMarkdown={bookGameArtGuidebookMarkdown}
          filePath="src/content/book-game-art-guidebook.md"
        />
      </section>
    </main>
  );
}

function NotFoundPage() {
  usePageMeta({
    title: "Page Not Found — Ruslan Kim",
    description: "The page you're looking for doesn't exist or has been moved.",
    ogTitle: "Page Not Found — Ruslan Kim",
    ogDescription: "The page you're looking for doesn't exist or has been moved.",
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/game-art-guidebook" element={<BookPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
