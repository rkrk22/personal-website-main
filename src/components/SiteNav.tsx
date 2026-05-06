import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <header className="w-full">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6 sm:py-8">
        <Link
          to="/"
          className="font-serif text-base italic tracking-tight text-foreground/80 transition-colors hover:text-foreground"
        >
          rk.
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="relative transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/newsletter"
            activeProps={{ className: "text-foreground" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="relative transition-colors hover:text-foreground"
          >
            Newsletter
          </Link>
        </div>
      </nav>
    </header>
  );
}
