import { Link, NavLink } from "react-router-dom";

export function SiteNav() {
  return (
    <header className="w-full">
      <nav className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6 py-6 sm:py-8">
        <Link
          to="/"
          className="font-serif text-base italic tracking-tight text-foreground/80 transition-colors hover:text-foreground"
        >
          kimruslan.art
        </Link>
        <div className="flex items-center gap-5 text-sm sm:text-base">
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
          <NavLink
            to="/notes/"
            className={({ isActive }) =>
              `relative transition-colors hover:text-foreground ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`
            }
          >
            Notes
          </NavLink>
          <a
            href="/signup/"
            className="relative text-muted-foreground transition-colors hover:text-foreground"
          >
            Newsletter
          </a>
          <a
            href="/shop/"
            className="inline-flex items-center rounded-full bg-amber-200 px-3 py-1.5 text-sm font-medium text-stone-900 transition-all hover:bg-amber-300 hover:shadow-sm"
          >
            Shop
          </a>
        </div>
      </nav>
    </header>
  );
}
