import { Link, NavLink } from "react-router-dom";

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
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative transition-colors hover:text-foreground ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`
            }
          >
            Home
          </NavLink>
          <a
            href="/signup"
            className="relative text-muted-foreground transition-colors hover:text-foreground"
          >
            Newsletter
          </a>
        </div>
      </nav>
    </header>
  );
}
