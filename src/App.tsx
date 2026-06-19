import { type ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Image as ImageIcon,
  Instagram,
  Mail,
  Pencil,
  RotateCcw,
  Send,
  ShoppingBag,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import avatar from "@/assets/avatar.jpg";
import artistPathInGamedevMarkdown from "@/content/artist-path-in-gamedev.md?raw";
import bookGameArtGuidebookMarkdown from "@/content/book-game-art-guidebook.md?raw";
import gamedevArtistBundleMarkdown from "@/content/gamedev-artist-bundle.md?raw";
import digitalArtistSurvivalKitMarkdown from "@/content/digital-artist-survival-kit.md?raw";
import { homeSettings } from "@/data/home-settings";
import { type Product, products } from "@/data/products";
import {
  type ImageAlignment,
  formatImageBlock,
  markdownToHtml,
  parseImageBlock,
} from "@/lib/markdown";

type MetaDefinition = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

type LegalSection = {
  heading: string;
  paragraphs: string[];
};

type SelectedImage = {
  lineIndex: number;
  value: ReturnType<typeof parseImageBlock>;
};

type PendingTextareaRestore = {
  end: number;
  scrollLeft: number;
  scrollTop: number;
  start: number;
  windowScrollX: number;
  windowScrollY: number;
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
  { label: "Instagram", href: "https://www.instagram.com/cgcamp.school", Icon: Instagram },
  { label: "TikTok", href: "https://www.tiktok.com/@ruslankim2d", Icon: TikTokIcon },
  { label: "YouTube", href: "https://www.youtube.com/@RuslanKim2d", Icon: Youtube },
  { label: "Telegram", href: "https://t.me/cgotter", Icon: Send },
];

const featuredProducts = products.filter((product) => product.featuredOnHome);
const portfolioHref = "https://www.behance.net/ruslankim";
const portfolioCardStyles = getProductCardStyles("#F7F7F7");
const defaultSignupBackgroundColor = "#455761";
const defaultSignupButtonColor = "#FFFFFF";

function normalizeHexColor(value: string) {
  const trimmed = value.trim();
  return /^#(?:[0-9a-fA-F]{6})$/.test(trimmed) ? trimmed.toUpperCase() : null;
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = normalizeHexColor(hex) ?? defaultSignupBackgroundColor;
  const red = Number.parseInt(normalized.slice(1, 3), 16);
  const green = Number.parseInt(normalized.slice(3, 5), 16);
  const blue = Number.parseInt(normalized.slice(5, 7), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getContrastingTextColor(hex: string) {
  const normalized = normalizeHexColor(hex) ?? defaultSignupButtonColor;
  const red = Number.parseInt(normalized.slice(1, 3), 16);
  const green = Number.parseInt(normalized.slice(3, 5), 16);
  const blue = Number.parseInt(normalized.slice(5, 7), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.62 ? "#1B2328" : "#FFFFFF";
}

function getProductCardStyles(cardBackgroundColor?: string) {
  const backgroundColor = normalizeHexColor(cardBackgroundColor ?? "");

  if (!backgroundColor) {
    return null;
  }

  const textColor = getContrastingTextColor(backgroundColor);

  return {
    backgroundColor,
    borderColor: hexToRgba(textColor, 0.14),
    kindColor: hexToRgba(textColor, 0.72),
    mutedColor: hexToRgba(textColor, 0.76),
    textColor,
  };
}

function getTagBadgeStyles(kind: string) {
  const normalizedKind = kind.trim().toLowerCase();

  if (normalizedKind === "book") {
    return {
      backgroundColor: "oklch(0.92 0.06 240)",
      color: "oklch(0.38 0.12 245)",
      borderColor: "oklch(0.84 0.05 240)",
    };
  }

  if (normalizedKind === "курс") {
    return {
      backgroundColor: "oklch(0.92 0.08 145)",
      color: "oklch(0.42 0.12 150)",
      borderColor: "oklch(0.84 0.06 145)",
    };
  }

  if (normalizedKind === "бандл") {
    return {
      backgroundColor: "oklch(0.95 0.04 85)",
      color: "oklch(0.45 0.08 68)",
      borderColor: "oklch(0.89 0.04 85)",
    };
  }

  if (normalizedKind === "выгодно") {
    return {
      backgroundColor: "oklch(0.94 0.05 12)",
      color: "oklch(0.5 0.11 18)",
      borderColor: "oklch(0.88 0.04 12)",
    };
  }

  if (normalizedKind === "portfolio") {
    return {
      backgroundColor: "oklch(0.94 0.08 85)",
      color: "oklch(0.48 0.1 70)",
      borderColor: "oklch(0.88 0.06 85)",
    };
  }

  return {
    backgroundColor: "oklch(0.95 0.01 255)",
    color: "oklch(0.44 0.03 255)",
    borderColor: "oklch(0.88 0.01 255)",
  };
}

function getSiteIconUrl(href: string) {
  try {
    const { hostname } = new URL(href);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return null;
  }
}

function ExternalSiteIcon({
  href,
  fallback,
  iconUrlOverride,
}: {
  href: string;
  fallback: string;
  iconUrlOverride?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const iconUrl = iconUrlOverride?.trim() || getSiteIconUrl(href);

  useEffect(() => {
    setHasError(false);
  }, [href]);

  if (!iconUrl || hasError) {
    return (
      <div className="relative mt-1 flex h-24 w-14 shrink-0 items-center justify-center text-sm font-semibold">
        {fallback}
      </div>
    );
  }

  return (
    <div className="relative mt-1 flex h-24 w-14 shrink-0 items-center justify-center overflow-visible">
      <img
        src={iconUrl}
        alt=""
        className="h-48 w-48 rounded-[3rem] object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

function PortfolioIconEditor({
  value,
  signupBackgroundImageUrl,
  signupBackgroundColor,
  signupButtonColor,
  onChange,
}: {
  value: string;
  signupBackgroundImageUrl: string;
  signupBackgroundColor: string;
  signupButtonColor: string;
  onChange: (value: string) => void;
}) {
  const [draftValue, setDraftValue] = useState(value);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  const resetValue = () => {
    const nextValue = homeSettings.portfolioIconUrl ?? "";
    setDraftValue(nextValue);
    onChange(nextValue);
    setSaveState("idle");
    setSaveMessage("");
  };

  const saveValue = async () => {
    setSaveState("saving");
    setSaveMessage("");

    try {
      const response = await fetch("/__save-home-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signupBackgroundImageUrl,
          signupBackgroundColor,
          signupButtonColor,
          portfolioIconUrl: draftValue,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Failed to save portfolio icon");
      }

      onChange(draftValue.trim());
      setSaveState("saved");
      setSaveMessage("Saved to src/data/home-settings.ts");
    } catch (error) {
      setSaveState("error");
      setSaveMessage(error instanceof Error ? error.message : "Failed to save portfolio icon");
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Portfolio Icon</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Ссылка на картинку для иконки Portfolio. Работает только в localhost.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={resetValue}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={saveValue} disabled={saveState === "saving"}>
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

      <Input
        value={draftValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          setDraftValue(nextValue);
          onChange(nextValue.trim());
          setSaveState("idle");
          setSaveMessage("");
        }}
        placeholder="https://example.com/portfolio-icon.png"
        className="mt-4"
      />
    </section>
  );
}

function CardTagBadge({ label }: { label: string }) {
  const badgeStyles = getTagBadgeStyles(label);

  return (
    <div
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
      style={badgeStyles}
    >
      {label}
    </div>
  );
}

function ProductCard({
  title,
  subtitle,
  href,
  kind,
  iconUrl,
  cardBackgroundColor,
}: {
  title: string;
  subtitle: string;
  href: string;
  kind: string;
  iconUrl?: string;
  cardBackgroundColor?: string;
  ribbonLabel?: string;
}) {
  const location = useLocation();
  const targetHref = location.pathname === "/shop/" ? `${href}?from=shop` : href;
  const cardStyles = getProductCardStyles(cardBackgroundColor);

  return (
    <a
      href={targetHref}
      className="group relative flex min-h-[9rem] items-center gap-5 overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/30 hover:shadow-sm"
    >
      <div className="relative mt-1 flex h-14 w-14 shrink-0 items-center justify-center overflow-visible rounded-[1.75rem] bg-secondary/70">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            className="pointer-events-none h-[7rem] w-[7rem] scale-[1.35] rounded-[1.5rem] object-contain"
          />
        ) : (
          <BookOpen className="h-6 w-6 text-foreground" />
        )}
      </div>
      <div className="flex-1 text-left">
        <div
          className="flex h-24 items-center gap-3 rounded-2xl px-4 py-3"
          style={
            cardStyles
              ? {
                  backgroundColor: cardStyles.backgroundColor,
                  color: cardStyles.textColor,
                }
              : undefined
          }
        >
          <div className="min-w-0 flex-1">
            <div className="break-words text-lg leading-tight font-semibold tracking-tight">
              {title}
            </div>
            <div
              className="mt-0.5 break-words text-[15px] leading-tight text-muted-foreground"
              style={cardStyles ? { color: cardStyles.mutedColor } : undefined}
            >
              {subtitle}
            </div>
          </div>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
            style={cardStyles ? { color: cardStyles.kindColor } : undefined}
          />
        </div>
      </div>
    </a>
  );
}

function ShopProductCard({
  title,
  subtitle,
  href,
  kind,
  iconUrl,
  cardBackgroundColor,
  ribbonLabel,
}: {
  title: string;
  subtitle: string;
  href: string;
  kind: string;
  iconUrl?: string;
  cardBackgroundColor?: string;
  ribbonLabel?: string;
}) {
  const location = useLocation();
  const targetHref = location.pathname === "/shop/" ? `${href}?from=shop` : href;
  const cardStyles = getProductCardStyles(cardBackgroundColor);

  return (
    <a
      href={targetHref}
      className="group relative flex items-center gap-5 overflow-hidden rounded-xl border border-border bg-card p-6 pt-14 transition-all hover:border-foreground/30 hover:shadow-sm"
    >
      <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-2">
        {ribbonLabel ? <CardTagBadge label={ribbonLabel} /> : null}
        <CardTagBadge label={kind} />
      </div>
      <div className="relative mt-1 flex h-16 w-16 shrink-0 items-center justify-center overflow-visible rounded-[2rem] bg-secondary/70">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            className="pointer-events-none h-[10rem] w-[10rem] scale-[1.4] rounded-[1.9rem] object-contain"
          />
        ) : (
          <BookOpen className="h-7 w-7 text-foreground" />
        )}
      </div>
      <div className="flex-1 text-left">
        <div
          className="flex items-center gap-4 rounded-[1.6rem] px-5 py-5"
          style={
            cardStyles
              ? {
                  backgroundColor: cardStyles.backgroundColor,
                  color: cardStyles.textColor,
                }
              : undefined
          }
        >
          <div className="min-w-0 flex-1">
            <div className="text-xl font-semibold tracking-tight">{title}</div>
            <div
              className="mt-3 text-base leading-tight text-muted-foreground"
              style={cardStyles ? { color: cardStyles.mutedColor } : undefined}
            >
              {subtitle}
            </div>
          </div>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
            style={cardStyles ? { color: cardStyles.kindColor } : undefined}
          />
        </div>
      </div>
    </a>
  );
}

function ProductTile({
  title,
  subtitle,
  href,
  kind,
  iconUrl,
  cardBackgroundColor,
  ribbonLabel,
}: {
  title: string;
  subtitle: string;
  href: string;
  kind: string;
  iconUrl?: string;
  cardBackgroundColor?: string;
  ribbonLabel?: string;
}) {
  const location = useLocation();
  const targetHref = location.pathname === "/shop/" ? `${href}?from=shop` : href;
  const cardStyles = getProductCardStyles(cardBackgroundColor);

  return (
    <a
      href={targetHref}
      className="group relative flex min-h-64 flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-sm"
    >
      <div className="absolute right-5 top-5 z-10 flex flex-wrap justify-end gap-2">
        {ribbonLabel ? <CardTagBadge label={ribbonLabel} /> : null}
        <CardTagBadge label={kind} />
      </div>
      <div className="relative mt-3 flex h-16 w-16 items-center justify-center overflow-visible rounded-[2rem] bg-secondary/70">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            className="pointer-events-none h-[10rem] w-[10rem] scale-[1.4] rounded-[1.9rem] object-contain"
          />
        ) : (
          <BookOpen className="h-7 w-7 text-foreground" />
        )}
      </div>
      <div
        className="mt-8 flex flex-1 flex-col rounded-[1.6rem] px-5 py-5"
        style={
          cardStyles
            ? {
                backgroundColor: cardStyles.backgroundColor,
                color: cardStyles.textColor,
              }
            : undefined
        }
      >
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p
          className="mt-3 flex-1 text-base leading-tight text-muted-foreground"
          style={cardStyles ? { color: cardStyles.mutedColor } : undefined}
        >
          {subtitle}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 text-base font-medium">
          Open
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            style={cardStyles ? { color: cardStyles.kindColor } : undefined}
          />
        </div>
      </div>
    </a>
  );
}

function ProductIconEditor({
  draftProducts,
  onChange,
}: {
  draftProducts: Product[];
  onChange: (products: Product[]) => void;
}) {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const updateIconUrl = (id: string, iconUrl: string) => {
    onChange(
      draftProducts.map((product) => (product.id === id ? { ...product, iconUrl } : product)),
    );
  };

  const updateCardBackgroundColor = (id: string, cardBackgroundColor: string) => {
    onChange(
      draftProducts.map((product) =>
        product.id === id ? { ...product, cardBackgroundColor } : product,
      ),
    );
  };

  const resetProducts = () => {
    onChange(products);
    setSaveState("idle");
    setSaveMessage("");
  };

  const saveProducts = async () => {
    setSaveState("saving");
    setSaveMessage("");

    try {
      const response = await fetch("/__save-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: draftProducts }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Failed to save products");
      }

      setSaveState("saved");
      setSaveMessage("Saved to src/data/products.ts");
    } catch (error) {
      setSaveState("error");
      setSaveMessage(error instanceof Error ? error.message : "Failed to save products");
    }
  };

  return (
    <section className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Product Icons</h2>
          <p className="mt-2 text-base text-muted-foreground">
            Вставь ссылку на картинку и при необходимости выбери цвет всей плашки товара.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={resetProducts}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={saveProducts} disabled={saveState === "saving"}>
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

      <div className="mt-6 space-y-4">
        {draftProducts.map((product) =>
          (() => {
            const cardStyles = getProductCardStyles(product.cardBackgroundColor);

            return (
              <div
                key={product.id}
                className="rounded-2xl border border-border bg-background/60 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative mt-1 flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-visible rounded-[2rem] bg-secondary">
                    {product.iconUrl ? (
                      <img
                        src={product.iconUrl}
                        alt=""
                        className="pointer-events-none h-[10rem] w-[10rem] scale-[1.4] rounded-[1.9rem] object-contain"
                      />
                    ) : (
                      <BookOpen className="h-7 w-7 text-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {product.kind}
                    </div>
                    <div
                      className="mt-2 rounded-2xl px-4 py-3"
                      style={
                        cardStyles
                          ? {
                              backgroundColor: cardStyles.backgroundColor,
                              color: cardStyles.textColor,
                            }
                          : undefined
                      }
                    >
                      <div className="text-base font-semibold tracking-tight">{product.title}</div>
                      <div
                        className="mt-1 text-sm text-muted-foreground"
                        style={cardStyles ? { color: cardStyles.mutedColor } : undefined}
                      >
                        {product.id}
                      </div>
                    </div>
                    <Input
                      value={product.iconUrl ?? ""}
                      onChange={(event) => updateIconUrl(product.id, event.target.value)}
                      placeholder="https://example.com/icon.png"
                      className="mt-3"
                    />
                    <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
                      <input
                        type="color"
                        value={normalizeHexColor(product.cardBackgroundColor ?? "") ?? "#E8EDF3"}
                        onChange={(event) =>
                          updateCardBackgroundColor(product.id, event.target.value.toUpperCase())
                        }
                        className="h-10 w-16 cursor-pointer rounded-md border border-input bg-transparent p-1"
                      />
                      <Input
                        value={product.cardBackgroundColor ?? ""}
                        onChange={(event) =>
                          updateCardBackgroundColor(product.id, event.target.value)
                        }
                        placeholder="#E8EDF3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })(),
        )}
      </div>
    </section>
  );
}

function SignupBackgroundEditor({
  value,
  color,
  buttonColor,
  onChange,
  onColorChange,
  onButtonColorChange,
}: {
  value: string;
  color: string;
  buttonColor: string;
  onChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onButtonColorChange: (value: string) => void;
}) {
  const [draftValue, setDraftValue] = useState(value);
  const [draftColor, setDraftColor] = useState(color);
  const [draftButtonColor, setDraftButtonColor] = useState(buttonColor);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  useEffect(() => {
    setDraftColor(color);
  }, [color]);

  useEffect(() => {
    setDraftButtonColor(buttonColor);
  }, [buttonColor]);

  const resetValue = () => {
    const nextValue = homeSettings.signupBackgroundImageUrl ?? "";
    const nextColor = homeSettings.signupBackgroundColor ?? defaultSignupBackgroundColor;
    const nextButtonColor = homeSettings.signupButtonColor ?? defaultSignupButtonColor;
    setDraftValue(nextValue);
    setDraftColor(nextColor);
    setDraftButtonColor(nextButtonColor);
    onChange(nextValue);
    onColorChange(nextColor);
    onButtonColorChange(nextButtonColor);
    setSaveState("idle");
    setSaveMessage("");
  };

  const saveValue = async () => {
    setSaveState("saving");
    setSaveMessage("");

    try {
      const response = await fetch("/__save-home-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signupBackgroundImageUrl: draftValue,
          signupBackgroundColor: normalizeHexColor(draftColor) ?? defaultSignupBackgroundColor,
          signupButtonColor: normalizeHexColor(draftButtonColor) ?? defaultSignupButtonColor,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Failed to save signup background");
      }

      onChange(draftValue.trim());
      onColorChange(normalizeHexColor(draftColor) ?? defaultSignupBackgroundColor);
      onButtonColorChange(normalizeHexColor(draftButtonColor) ?? defaultSignupButtonColor);
      setSaveState("saved");
      setSaveMessage("Saved to src/data/home-settings.ts");
    } catch (error) {
      setSaveState("error");
      setSaveMessage(error instanceof Error ? error.message : "Failed to save signup background");
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Signup Background</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Ссылка на картинку для фона плашки. Работает только в localhost.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={resetValue}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={saveValue} disabled={saveState === "saving"}>
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

      <Input
        value={draftValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          setDraftValue(nextValue);
          onChange(nextValue.trim());
          setSaveState("idle");
          setSaveMessage("");
        }}
        placeholder="https://example.com/signup-background.jpg"
        className="mt-4"
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
        <input
          type="color"
          value={normalizeHexColor(draftColor) ?? defaultSignupBackgroundColor}
          onChange={(event) => {
            const nextColor = event.target.value.toUpperCase();
            setDraftColor(nextColor);
            onColorChange(nextColor);
            setSaveState("idle");
            setSaveMessage("");
          }}
          className="h-10 w-16 cursor-pointer rounded-md border border-input bg-transparent p-1"
        />
        <Input
          value={draftColor}
          onChange={(event) => {
            const nextColor = event.target.value;
            setDraftColor(nextColor);
            const normalizedColor = normalizeHexColor(nextColor);
            if (normalizedColor) {
              onColorChange(normalizedColor);
            }
            setSaveState("idle");
            setSaveMessage("");
          }}
          placeholder="#455761"
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
        <input
          type="color"
          value={normalizeHexColor(draftButtonColor) ?? defaultSignupButtonColor}
          onChange={(event) => {
            const nextColor = event.target.value.toUpperCase();
            setDraftButtonColor(nextColor);
            onButtonColorChange(nextColor);
            setSaveState("idle");
            setSaveMessage("");
          }}
          className="h-10 w-16 cursor-pointer rounded-md border border-input bg-transparent p-1"
        />
        <Input
          value={draftButtonColor}
          onChange={(event) => {
            const nextColor = event.target.value;
            setDraftButtonColor(nextColor);
            const normalizedColor = normalizeHexColor(nextColor);
            if (normalizedColor) {
              onButtonColorChange(normalizedColor);
            }
            setSaveState("idle");
            setSaveMessage("");
          }}
          placeholder="#FFFFFF"
        />
      </div>
    </section>
  );
}

function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <article className="markdown-content rounded-3xl border border-border bg-card px-8 pb-8 pt-0 sm:px-10 sm:pb-10 sm:pt-0">
      <div dangerouslySetInnerHTML={{ __html: markdownToHtml(markdown) }} />
    </article>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
}

function SiteFooter() {
  return (
    <footer className="mt-16 flex flex-col items-center gap-3 text-center text-sm text-muted-foreground">
      <div className="flex items-center gap-4">
        <a href="/privacy-policy" className="transition-colors hover:text-foreground">
          Политика конфиденциальности
        </a>
        <a href="/terms-of-service" className="transition-colors hover:text-foreground">
          Условия использования
        </a>
      </div>
      <div>© {new Date().getFullYear()} Ruslan Kim</div>
    </footer>
  );
}

function LegalPage({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: LegalSection[];
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад на главную
      </a>

      <section className="mt-8 rounded-3xl border border-border bg-card p-8 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">{description}</p>
        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <article key={section.heading}>
              <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
              <div className="mt-4 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-tight text-muted-foreground sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

const privacyPolicySections: LegalSection[] = [
  {
    heading: "Введение",
    paragraphs: [
      "Эта Политика конфиденциальности объясняет, какие данные могут собираться, как они используются и как защищаются при посещении этого сайта или покупке цифровых обучающих материалов по рисованию и искусству.",
    ],
  },
  {
    heading: "Какие данные мы собираем",
    paragraphs: [
      "Мы можем собирать данные, которые вы предоставляете напрямую: адрес электронной почты, сообщения, которые вы отправляете, а также информацию, связанную с покупкой цифровых продуктов.",
      "Также автоматически может собираться базовая техническая информация: тип браузера, данные об устройстве и общая информация об использовании сайта.",
    ],
  },
  {
    heading: "Как мы используем данные",
    paragraphs: [
      "Собранная информация используется для предоставления доступа к продуктам, ответа на вопросы, улучшения сайта, отправки запрошенных обновлений и организации доставки цифровых обучающих материалов.",
    ],
  },
  {
    heading: "Email-рассылка",
    paragraphs: [
      "Если вы подписываетесь на рассылку, ваш email может использоваться для отправки новостей о книгах, курсах, новых материалах и другом связанном контенте. Вы можете отписаться в любой момент по ссылке в письме.",
    ],
  },
  {
    heading: "Обработка платежей",
    paragraphs: [
      "Оплата цифровых продуктов может обрабатываться сторонними платёжными сервисами. Этот сайт не хранит полные данные банковских карт. Платёжная информация обрабатывается непосредственно соответствующим платёжным провайдером.",
    ],
  },
  {
    heading: "Cookies / аналитика",
    paragraphs: [
      "На сайте могут использоваться cookies и базовые инструменты аналитики для понимания посещаемости, оценки работы сайта и улучшения пользовательского опыта.",
    ],
  },
  {
    heading: "Сторонние сервисы",
    paragraphs: [
      "Сайт может использовать сторонние сервисы для обработки платежей, отправки рассылок, работы встроенных виджетов, хостинга, аналитики и социальных ссылок. Эти сервисы могут обрабатывать данные в соответствии со своими собственными политиками конфиденциальности.",
    ],
  },
  {
    heading: "Контакты",
    paragraphs: [
      "Если у вас есть вопросы по этой Политике конфиденциальности или по вашим данным, вы можете написать на: squidcg@gmail.com",
    ],
  },
  {
    heading: "Последнее обновление",
    paragraphs: ["16 мая 2026"],
  },
];

const termsOfServiceSections: LegalSection[] = [
  {
    heading: "Принятие условий",
    paragraphs: [
      "Используя этот сайт или приобретая цифровые продукты через него, вы соглашаетесь с настоящими Условиями использования.",
    ],
  },
  {
    heading: "Цифровые продукты",
    paragraphs: [
      "Продукты, предлагаемые через этот сайт, могут включать гайдбуки, курсы, загружаемые файлы и другие обучающие материалы, связанные с рисованием и искусством.",
    ],
  },
  {
    heading: "Оплата",
    paragraphs: [
      "Все цены, способы оплаты и оформление покупки осуществляются через доступные платёжные сервисы, указанные на момент оформления заказа.",
    ],
  },
  {
    heading: "Доступ и доставка",
    paragraphs: [
      "Цифровые продукты предоставляются в электронном виде. Доступ может быть предоставлен через ссылку на скачивание, email, встроенную платёжную систему или иным цифровым способом в зависимости от конкретного продукта.",
    ],
  },
  {
    heading: "Возвраты",
    paragraphs: [
      "Поскольку цифровые продукты доставляются в электронном виде, возврат средств после предоставления доступа или возможности скачивания, как правило, не гарантируется, если иное не указано для конкретного продукта или не требуется законом.",
    ],
  },
  {
    heading: "Интеллектуальная собственность",
    paragraphs: [
      "Все материалы сайта, продукты, тексты, изображения, элементы брендинга и обучающие материалы остаются интеллектуальной собственностью соответствующего правообладателя, если не указано иное.",
    ],
  },
  {
    heading: "Лицензия для личного использования",
    paragraphs: [
      "При покупке цифрового продукта вы получаете личную, неисключительную и непередаваемую лицензию на его использование для собственного обучения и личного ознакомления.",
    ],
  },
  {
    heading: "Запрещённое использование",
    paragraphs: [
      "Вы не можете перепродавать, распространять, передавать другим лицам, публиковать, загружать в общий доступ или использовать купленные цифровые материалы в коммерческих целях без прямого письменного разрешения.",
    ],
  },
  {
    heading: "Ограничение ответственности",
    paragraphs: [
      "Этот сайт и цифровые продукты предоставляются по принципу «как есть». В максимально допустимой законом степени исключается ответственность за косвенные, случайные или последующие убытки.",
    ],
  },
  {
    heading: "Контакты",
    paragraphs: [
      "Если у вас есть вопросы по этим Условиям использования, напишите на: squidcg@gmail.com",
    ],
  },
  {
    heading: "Последнее обновление",
    paragraphs: ["16 мая 2026"],
  },
];

function HomePage() {
  const [signupBackgroundImageUrl, setSignupBackgroundImageUrl] = useState(
    homeSettings.signupBackgroundImageUrl ?? "",
  );
  const [signupBackgroundColor, setSignupBackgroundColor] = useState(
    homeSettings.signupBackgroundColor ?? defaultSignupBackgroundColor,
  );
  const [signupButtonColor, setSignupButtonColor] = useState(
    homeSettings.signupButtonColor ?? defaultSignupButtonColor,
  );
  const [portfolioIconUrl, setPortfolioIconUrl] = useState(homeSettings.portfolioIconUrl ?? "");

  usePageMeta({
    title: "Ruslan Kim — Digital Artist & Game Art Educator",
    description:
      "Digital artist, game art educator, author of Game Art Guidebook. Portfolio, books, courses and creative process.",
    ogTitle: "Ruslan Kim — Digital Artist",
    ogDescription: "Digital artist, game art educator, author of Game Art Guidebook.",
  });

  return (
    <main className="mx-auto max-w-xl px-6 pb-24 pt-16 sm:pt-20">
      <div className="flex justify-end">
        <a
          href="/shop/"
          className="inline-flex items-center gap-2 rounded-full border border-transparent bg-amber-200 px-4 py-2 text-sm font-medium text-stone-900 transition-all hover:bg-amber-300 hover:shadow-sm"
        >
          <ShoppingBag className="h-4 w-4" />
          Shop
        </a>
      </div>

      <section className="flex flex-col items-center text-center">
        <img
          src={avatar}
          alt="Ruslan Kim"
          width={144}
          height={144}
          className="h-32 w-32 rounded-full object-cover sm:h-36 sm:w-36"
        />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Ruslan Kim</h1>
        <p className="mt-3 text-lg text-muted-foreground">
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
        <div className="space-y-3">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              title={product.homeTitle ?? product.title}
              subtitle={product.homeSubtitle ?? product.subtitle}
              href={product.href}
              kind={product.kind}
              iconUrl={product.iconUrl}
              cardBackgroundColor={product.cardBackgroundColor}
              ribbonLabel={product.ribbonLabel}
            />
          ))}
        </div>

        <a
          href={portfolioHref}
          target="_blank"
          rel="noreferrer"
          className="group relative mt-3 flex min-h-[9rem] items-center gap-5 overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/30 hover:shadow-sm"
        >
          <ExternalSiteIcon href={portfolioHref} fallback="P" iconUrlOverride={portfolioIconUrl} />
          <div className="flex-1 text-left">
            <div
              className="flex h-24 items-center gap-3 px-4 py-3"
              style={
                portfolioCardStyles
                  ? {
                      color: portfolioCardStyles.textColor,
                    }
                  : undefined
              }
            >
              <div className="min-w-0 flex-1">
                <div className="break-words text-lg leading-tight font-semibold tracking-tight">
                  Портфолио
                </div>
                <div
                  className="mt-0.5 break-words text-[15px] leading-tight text-muted-foreground"
                  style={
                    portfolioCardStyles ? { color: portfolioCardStyles.mutedColor } : undefined
                  }
                >
                  Если вам интересно посмотреть на мои работы
                </div>
              </div>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                style={portfolioCardStyles ? { color: portfolioCardStyles.kindColor } : undefined}
              />
            </div>
          </div>
        </a>
        {isLocalEditorEnabled ? (
          <PortfolioIconEditor
            value={portfolioIconUrl}
            signupBackgroundImageUrl={signupBackgroundImageUrl}
            signupBackgroundColor={signupBackgroundColor}
            signupButtonColor={signupButtonColor}
            onChange={setPortfolioIconUrl}
          />
        ) : null}
      </section>

      <section className="mt-10">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-[oklch(0.34_0.025_235)] px-6 py-5 text-white sm:px-10 sm:py-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundColor:
                  normalizeHexColor(signupBackgroundColor) ?? defaultSignupBackgroundColor,
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(180deg, ${hexToRgba(signupBackgroundColor, 0)}, ${hexToRgba(signupBackgroundColor, 0)})`,
              }}
            />
            <div className="relative grid gap-4 md:min-h-[15.5rem] md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-0">
              <div className="relative z-10 min-w-0 text-left">
                <h2 className="text-[1.4rem] font-semibold tracking-tight text-black">
                  <span className="leading-[1.05]">
                  У меня есть рассылка
                  </span>
                </h2>
                <p className="mt-2 text-[15px] leading-snug text-black">
                  Если подпишетесь, то мы с вами никогда не потеряемся из виду. Я буду присылать
                  вам полезности для художников, давать поддержку и иногда предлагать скидки 💛
                </p>
                <a
                  href="/signup/"
                  className="mt-5 inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor:
                      normalizeHexColor(signupButtonColor) ?? defaultSignupButtonColor,
                    color: getContrastingTextColor(signupButtonColor),
                  }}
                >
                  Sign up
                </a>
              </div>
              {signupBackgroundImageUrl ? (
                <div className="flex justify-center md:-mr-12 md:-ml-10 md:justify-end">
                  <img
                    aria-hidden="true"
                    alt=""
                    src={signupBackgroundImageUrl}
                    className="h-52 w-full min-w-[17rem] max-w-[19rem] object-contain md:h-[15rem] md:w-[16.5rem] md:max-w-none"
                  />
                </div>
              ) : null}
            </div>
          </div>
          {isLocalEditorEnabled ? (
            <SignupBackgroundEditor
              value={signupBackgroundImageUrl}
              color={signupBackgroundColor}
              buttonColor={signupButtonColor}
              onChange={setSignupBackgroundImageUrl}
              onColorChange={setSignupBackgroundColor}
              onButtonColorChange={setSignupButtonColor}
            />
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

export function ShopPage() {
  const [shopProducts, setShopProducts] = useState<Product[]>(products);

  usePageMeta({
    title: "Shop — Ruslan Kim",
    description: "Books, products, and resources by Ruslan Kim.",
    ogTitle: "Shop — Ruslan Kim",
    ogDescription: "Browse books, products, and resources by Ruslan Kim.",
  });

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-8 sm:pt-10">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </a>

      <section className="mt-5">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Shop</h1>
        <p className="mt-2 text-base text-muted-foreground sm:text-lg">
          Books, products, and resources in one place.
        </p>
      </section>

      <section className="mt-5 grid gap-4 sm:grid-cols-2">
        {shopProducts.map((product) =>
          product.kind === "Курс" || product.id === "gamedev-artist-bundle" ? (
            <div key={product.id} className="sm:col-span-2">
              <div className="shop-course-card-portrait">
                <ProductTile
                  title={product.title}
                  subtitle={product.description}
                  href={product.href}
                  kind={product.kind}
                  iconUrl={product.iconUrl}
                  cardBackgroundColor={product.cardBackgroundColor}
                  ribbonLabel={product.ribbonLabel}
                />
              </div>
              <div className="shop-course-card-default">
                <ShopProductCard
                  title={product.title}
                  subtitle={product.description}
                  href={product.href}
                  kind={product.kind}
                  iconUrl={product.iconUrl}
                  cardBackgroundColor={product.cardBackgroundColor}
                  ribbonLabel={product.ribbonLabel}
                />
              </div>
            </div>
          ) : (
            <ProductTile
              key={product.id}
              title={product.title}
              subtitle={product.description}
              href={product.href}
              kind={product.kind}
              iconUrl={product.iconUrl}
              cardBackgroundColor={product.cardBackgroundColor}
              ribbonLabel={product.ribbonLabel}
            />
          ),
        )}
      </section>

      {isLocalEditorEnabled ? (
        <ProductIconEditor draftProducts={shopProducts} onChange={setShopProducts} />
      ) : null}

      <SiteFooter />
    </main>
  );
}

export function PrivacyPolicyPage() {
  usePageMeta({
    title: "Политика конфиденциальности — Ruslan Kim",
    description:
      "Политика конфиденциальности для этого сайта и цифровых обучающих материалов Ruslan Kim.",
    ogTitle: "Политика конфиденциальности — Ruslan Kim",
    ogDescription:
      "Политика конфиденциальности для этого сайта и цифровых обучающих материалов Ruslan Kim.",
  });

  return (
    <LegalPage
      title="Privacy Policy"
      description="Информация о конфиденциальности для этого сайта и цифровых обучающих материалов."
      sections={privacyPolicySections}
    />
  );
}

export function TermsOfServicePage() {
  usePageMeta({
    title: "Условия использования — Ruslan Kim",
    description:
      "Условия использования для цифровых продуктов, гайдбуков, курсов и обучающих материалов.",
    ogTitle: "Условия использования — Ruslan Kim",
    ogDescription:
      "Условия использования для цифровых продуктов, гайдбуков, курсов и обучающих материалов.",
  });

  return (
    <LegalPage
      title="Terms of Service"
      description="Условия использования цифровых продуктов, гайдбуков, курсов и обучающих материалов."
      sections={termsOfServiceSections}
    />
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
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [mode, setMode] = useState<EditorMode>("preview");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pendingTextareaRestoreRef = useRef<PendingTextareaRestore | null>(null);

  const getImageSelection = (value: string, cursorPosition: number): SelectedImage | null => {
    const lines = value.split("\n");
    let offset = 0;

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const nextOffset = offset + line.length + 1;

      if (cursorPosition <= nextOffset) {
        const image = parseImageBlock(line);
        return image ? { lineIndex: index, value: image } : null;
      }

      offset = nextOffset;
    }

    return null;
  };

  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(() =>
    getImageSelection(initialMarkdown, 0),
  );

  useEffect(() => {
    window.localStorage.setItem(storageKey, markdown);
  }, [markdown, storageKey]);

  useEffect(() => {
    if (!textareaRef.current) {
      setSelectedImage(null);
      return;
    }

    if (document.activeElement !== textareaRef.current) {
      return;
    }

    const nextSelection = getImageSelection(markdown, textareaRef.current.selectionStart);
    setSelectedImage(nextSelection);
  }, [markdown]);

  useEffect(() => {
    if (saveState !== "saved") {
      return;
    }

    const timeoutId = window.setTimeout(() => setSaveState("idle"), 1500);
    return () => window.clearTimeout(timeoutId);
  }, [saveState]);

  useLayoutEffect(() => {
    const pendingRestore = pendingTextareaRestoreRef.current;
    const textarea = textareaRef.current;

    if (!pendingRestore || !textarea) {
      return;
    }

    textarea.scrollTop = pendingRestore.scrollTop;
    textarea.scrollLeft = pendingRestore.scrollLeft;
    window.scrollTo(pendingRestore.windowScrollX, pendingRestore.windowScrollY);

    if (document.activeElement === textarea) {
      textarea.setSelectionRange(pendingRestore.start, pendingRestore.end);
    }

    pendingTextareaRestoreRef.current = null;
  }, [markdown]);

  const updateMarkdown = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  const syncSelectedImageFromTextarea = () => {
    const textarea = textareaRef.current;

    if (!textarea) {
      setSelectedImage(null);
      return;
    }

    setSelectedImage(getImageSelection(markdown, textarea.selectionStart));
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

  const replaceLine = (lineIndex: number, nextLine: string) => {
    const lines = markdown.split("\n");
    const currentLine = lines[lineIndex];

    if (currentLine === undefined) {
      return;
    }

    const textarea = textareaRef.current;
    const activeElement = document.activeElement;
    const shouldRestoreTextareaSelection = activeElement === textarea;
    const previousScrollTop = textarea?.scrollTop ?? 0;
    const previousScrollLeft = textarea?.scrollLeft ?? 0;
    let position = 0;

    for (let index = 0; index < lineIndex; index += 1) {
      position += lines[index].length + 1;
    }

    pendingTextareaRestoreRef.current = {
      end: position + nextLine.length,
      scrollLeft: previousScrollLeft,
      scrollTop: previousScrollTop,
      start: position,
      windowScrollX: window.scrollX,
      windowScrollY: window.scrollY,
    };

    lines[lineIndex] = nextLine;
    const nextMarkdown = lines.join("\n");
    setMarkdown(nextMarkdown);

    const nextImage = parseImageBlock(nextLine);
    setSelectedImage(nextImage ? { lineIndex, value: nextImage } : null);
  };

  const updateSelectedImage = (
    updater: (current: NonNullable<SelectedImage["value"]>) => string,
  ) => {
    if (!selectedImage?.value) {
      return;
    }

    replaceLine(selectedImage.lineIndex, updater(selectedImage.value));
  };

  const setSelectedImageWidth = (width: number) => {
    updateSelectedImage((image) => formatImageBlock({ ...image, width }));
  };

  const setSelectedImageAlignment = (align: ImageAlignment) => {
    updateSelectedImage((image) => formatImageBlock({ ...image, align }));
  };

  const resetMarkdown = () => {
    setMarkdown(initialMarkdown);
    window.localStorage.removeItem(storageKey);
    setSaveState("idle");
    setSaveMessage("");
    setSelectedImage(getImageSelection(initialMarkdown, 0));
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
    return <MarkdownContent markdown={initialMarkdown} />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="sticky top-4 z-20 -mx-2 rounded-2xl border border-border bg-card/95 px-2 py-2 backdrop-blur supports-[backdrop-filter]:bg-card/85 sm:-mx-3 sm:px-3">
          <div className="text-base font-semibold tracking-tight">Editor</div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
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

          {saveMessage ? (
            <p
              className={`mt-3 text-sm ${
                saveState === "error" ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {saveMessage}
            </p>
          ) : null}
        </div>

        <div className="mt-4 min-w-0">
          <div className="text-base font-semibold tracking-tight">Content</div>

          {mode === "edit" ? (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="min-w-16"
                  onClick={() => wrapSelection("**", "**")}
                >
                  Bold
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-w-16"
                  onClick={() => wrapSelection("*", "*")}
                >
                  Italic
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-w-16"
                  onClick={() => insertBlock("# Heading")}
                >
                  H1
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-w-16"
                  onClick={() => insertBlock("## Section")}
                >
                  H2
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-w-16"
                  onClick={() => insertBlock("- List item")}
                >
                  List
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-w-16"
                  onClick={() => insertBlock("[Link text](https://example.com)")}
                >
                  Link
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-w-20"
                  onClick={() => insertBlock("![Image alt](https://example.com/image.jpg)")}
                >
                  <ImageIcon className="h-4 w-4" />
                  Image
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-w-20"
                  onClick={() =>
                    insertBlock(
                      '<iframe title="widget" style="border: none" width="180" height="80" src="https://example.com"></iframe>',
                    )
                  }
                >
                  Embed
                </Button>
              </div>

              {selectedImage?.value ? (
                <div className="rounded-xl border border-border bg-secondary/30 p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Image
                      </div>
                      <div className="truncate text-base text-foreground">
                        {selectedImage.value.url}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={selectedImage.value.align === "left" ? "default" : "outline"}
                        onClick={() => setSelectedImageAlignment("left")}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedImage.value.align === "center" ? "default" : "outline"}
                        onClick={() => setSelectedImageAlignment("center")}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedImage.value.align === "right" ? "default" : "outline"}
                        onClick={() => setSelectedImageAlignment("right")}
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label className="text-base text-muted-foreground">Width</label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="1"
                      value={selectedImage.value.width}
                      onChange={(event) => setSelectedImageWidth(Number(event.target.value))}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      min="20"
                      max="100"
                      step="1"
                      value={selectedImage.value.width}
                      onChange={(event) => setSelectedImageWidth(Number(event.target.value || 100))}
                      className="w-20 rounded-md border border-border bg-background px-3 py-2 text-sm"
                    />
                    <div className="text-base text-muted-foreground">%</div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-secondary/20 px-4 py-3 text-base text-muted-foreground">
                  Поставь курсор на строку с картинкой, чтобы менять ширину и выравнивание.
                </div>
              )}

              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={updateMarkdown}
                onClick={syncSelectedImageFromTextarea}
                onKeyUp={syncSelectedImageFromTextarea}
                onSelect={syncSelectedImageFromTextarea}
                spellCheck={false}
                className="min-h-[360px] w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-tight outline-none ring-0"
              />
            </div>
          ) : (
            <div className="mt-4">
              <MarkdownContent markdown={markdown} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BookPage({
  productSlug,
}: {
  productSlug?:
    | "artist-kit"
    | "game-art-guidebook"
    | "artist-path-in-gamedev"
    | "gamedev-artist-bundle";
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const normalizedPath = location.pathname.endsWith("/")
    ? location.pathname
    : `${location.pathname}/`;
  const resolvedProductSlug =
    productSlug ??
    (normalizedPath === "/artist-kit/"
      ? "artist-kit"
      : normalizedPath === "/courses/artist-path-in-gamedev/"
        ? "artist-path-in-gamedev"
        : normalizedPath === "/bundles/gamedev-artist/"
          ? "gamedev-artist-bundle"
        : "game-art-guidebook");
  const searchParams = new URLSearchParams(location.search);
  const fromShop = searchParams.get("from") === "shop";

  let backHref = "/";
  let backLabel = "Back to home";
  let shouldUseHistoryBack = false;

  if (fromShop) {
    backHref = "/shop/";
    backLabel = "Back to shop";
    shouldUseHistoryBack = true;
  } else if (typeof document !== "undefined" && document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer);
      const isSameOrigin = referrerUrl.origin === window.location.origin;
      const normalizedReferrerPath = referrerUrl.pathname.endsWith("/")
        ? referrerUrl.pathname
        : `${referrerUrl.pathname}/`;

      if (isSameOrigin && normalizedReferrerPath === "/shop/") {
        backHref = "/shop/";
        backLabel = "Back to shop";
        shouldUseHistoryBack = true;
      }
    } catch {
      // Ignore malformed referrers and keep the home fallback.
    }
  }

  const pageContent =
    resolvedProductSlug === "artist-kit"
      ? {
          title: "Digital Artist's Survival Kit — Ruslan Kim",
          description:
            "Книга Ruslan Kim о цифровом рисовании, навыках художника, старте в игровой индустрии и карьерном развитии без лишних иллюзий.",
          ogTitle: "Digital Artist's Survival Kit — Ruslan Kim",
          ogDescription:
            "Практическая книга для digital-художников о навыках, фокусе, выгорании, карьере и работе в CG.",
          storageKey: "page:/artist-kit",
          initialMarkdown: digitalArtistSurvivalKitMarkdown,
          filePath: "src/content/digital-artist-survival-kit.md",
        }
      : resolvedProductSlug === "artist-path-in-gamedev"
        ? {
            title: "Путь художника в геймдев — Ruslan Kim",
            description:
              "Практический мини курс из 6 уроков. Видео + текст. Для начинающих художников которые хотят в игровую индустрию.",
            ogTitle: "Путь художника в геймдев — Ruslan Kim",
            ogDescription:
              "Мини курс для начинающих художников: 6 уроков, видео и текст про вход в игровую индустрию.",
            storageKey: "page:/courses/artist-path-in-gamedev",
            initialMarkdown: artistPathInGamedevMarkdown,
            filePath: "src/content/artist-path-in-gamedev.md",
          }
        : resolvedProductSlug === "gamedev-artist-bundle"
          ? {
              title: "Бандл для художника в геймдев — Ruslan Kim",
              description:
                "Бандл из трех продуктов для художников: Game Art Guidebook, Набор для выживания диджитал художника и мини-курс «Путь художника в геймдев».",
              ogTitle: "Бандл для художника в геймдев — Ruslan Kim",
              ogDescription:
                "Комплект для старта и развития в game art: книга, guidebook и мини-курс в одном наборе.",
              storageKey: "page:/bundles/gamedev-artist",
              initialMarkdown: gamedevArtistBundleMarkdown,
              filePath: "src/content/gamedev-artist-bundle.md",
            }
        : {
            title: "Game Art Guidebook — Ruslan Kim",
            description:
              "Game Art Guidebook by Ruslan Kim. Learn what a game artist does, how to build skills, and where to start your career path.",
            ogTitle: "Game Art Guidebook — Ruslan Kim",
            ogDescription:
              "A practical guide to a career in game art, with an overview of the book and purchase options.",
            storageKey: "page:/books/game-art-guidebook",
            initialMarkdown: bookGameArtGuidebookMarkdown,
            filePath: "src/content/book-game-art-guidebook.md",
          };

  usePageMeta({
    title: pageContent.title,
    description: pageContent.description,
    ogTitle: pageContent.ogTitle,
    ogDescription: pageContent.ogDescription,
  });

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12 sm:pt-16">
      {shouldUseHistoryBack ? (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>
      ) : (
        <a
          href={backHref}
          className="inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </a>
      )}

      <section className="mt-8">
        <MarkdownEditor
          key={pageContent.storageKey}
          storageKey={pageContent.storageKey}
          initialMarkdown={pageContent.initialMarkdown}
          filePath={pageContent.filePath}
        />
      </section>

      <SiteFooter />
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
        <p className="mt-2 text-base text-muted-foreground">
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
        <Route path="/shop/" element={<ShopPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/artist-kit" element={<BookPage productSlug="artist-kit" />} />
        <Route path="/artist-kit/" element={<BookPage productSlug="artist-kit" />} />
        <Route
          path="/bundles/gamedev-artist"
          element={<BookPage productSlug="gamedev-artist-bundle" />}
        />
        <Route
          path="/bundles/gamedev-artist/"
          element={<BookPage productSlug="gamedev-artist-bundle" />}
        />
        <Route
          path="/books/game-art-guidebook"
          element={<BookPage productSlug="game-art-guidebook" />}
        />
        <Route
          path="/books/game-art-guidebook/"
          element={<BookPage productSlug="game-art-guidebook" />}
        />
        <Route
          path="/courses/artist-path-in-gamedev"
          element={<BookPage productSlug="artist-path-in-gamedev" />}
        />
        <Route
          path="/courses/artist-path-in-gamedev/"
          element={<BookPage productSlug="artist-path-in-gamedev" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
