import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, Youtube, Send, BookOpen, ExternalLink } from "lucide-react";
import avatar from "@/assets/avatar.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ruslan Kim — Digital Artist & Game Art Educator" },
      {
        name: "description",
        content:
          "Digital artist, game art educator, author of Game Art Guidebook. Portfolio, books, courses and creative process.",
      },
      { property: "og:title", content: "Ruslan Kim — Digital Artist" },
      {
        property: "og:description",
        content: "Digital artist, game art educator, author of Game Art Guidebook.",
      },
    ],
  }),
  component: Home,
});

// Simple TikTok glyph (lucide doesn't ship one)
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

function Home() {
  return (
    <main className="mx-auto max-w-xl px-6 pb-24 pt-16 sm:pt-20">
      {/* Profile */}
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

        {/* Social icons row */}
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

      {/* Featured: Game Art Guidebook */}
      <section className="mt-12">
        <a
          href="https://example.com/book"
          target="_blank"
          rel="noreferrer"
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
          <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
        </a>

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

      {/* Signup card */}
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
            <Link
              to="/signup"
              className="mt-5 inline-flex items-center justify-center rounded-md bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
            >
              Sign up
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-16 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ruslan Kim
      </footer>
    </main>
  );
}
