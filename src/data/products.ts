export type Product = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  kind: string;
  featuredOnHome?: boolean;
  homeTitle?: string;
  homeSubtitle?: string;
};

export const products: Product[] = [
  {
    id: "game-art-guidebook",
    title: "Game Art Guidebook",
    subtitle: "A practical guide to a career in game art",
    description:
      "A practical book for aspiring game artists about skills, direction, and building a path into the industry.",
    href: "/artist-kit/",
    kind: "Book",
    featuredOnHome: true,
    homeTitle: "Набор для выживания Digital художника",
    homeSubtitle: "PDF книга о рисовании и карьере художника",
  },
];
