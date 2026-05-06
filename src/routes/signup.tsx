import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Signup — Ruslan Kim" },
      {
        name: "description",
        content:
          "Subscribe for updates about game art, digital painting, books, courses, and creative process.",
      },
      { property: "og:title", content: "Signup — Ruslan Kim" },
      {
        property: "og:description",
        content: "Updates about game art, digital painting, books, courses, and creative process.",
      },
    ],
  }),
  component: Signup,
});

function Signup() {
  return (
    <main className="mx-auto max-w-xl px-6 pb-24 pt-10 sm:pt-14">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <section className="mt-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Sign up for updates</h1>
        <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
          Updates about game art, digital painting, books, courses, and the creative process.
        </p>
      </section>

      <section className="mt-10">
        <div
          id="brevo-form"
          className="overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <iframe
            title="Brevo signup form"
            width="100%"
            height="420"
            src="https://ec954df0.sibforms.com/serve/MUIFAD-KhSiskQ-zzFycjRMfxHFcxfXG9f9U4dN06yByW-GhK05yP33OnUcUL-gkl19lxI60LWfaM0OnH0C0Tmn71Ta3R2LJ-5UOnS8oBVlCirhaS-85n4jLc45sQg97EOphELb2CpZ2FQW6sKxIBddTP_2Z5R7_f_FOSg0uj7fBa7LffFmQYZrFBBNubHyvK9cR4MOC5ElGFDV45g=="
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            className="mx-auto block w-full max-w-[540px]"
            style={{ border: 0 }}
          />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          No spam. Unsubscribe anytime.
        </p>
      </section>
    </main>
  );
}
