export type Product = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  kind: string;
  iconUrl?: string;
  ribbonLabel?: string;
  featuredOnHome?: boolean;
  homeTitle?: string;
  homeSubtitle?: string;
};

export const products: Product[] = [
  {
    id: "game-art-guidebook",
    title: "Digital Artist's Survival Kit",
    subtitle: "Честный гид по цифровому рисованию и старту в игровой индустрии",
    description:
      "Книга для начинающих и развивающихся художников: о рисовании, нужных навыках, поиске фокуса, выгорании, работе в CG и том, как войти в индустрию без лишних иллюзий.",
    href: "/artist-kit/",
    kind: "Book",
    featuredOnHome: true,
    homeTitle: "Набор для выживания Digital художника",
    homeSubtitle: "PDF книга о рисовании и карьере художника",
    iconUrl: "https://ik.imagekit.io/71jz3gcgav/book-icon-2_NeoEDakmU.gif?updatedAt=1781682017926",
    ribbonLabel: "New",
  },
  {
    id: "game-art-guidebook-shop",
    title: "Game Art Guidebook",
    subtitle: "Практическое руководство по карьере в гейм-арте",
    description:
      "Практическая книга для будущих game artist'ов о ключевых навыках, профессиональном направлении и построении пути в индустрию.",
    href: "/books/game-art-guidebook",
    kind: "Book",
    iconUrl: "https://ik.imagekit.io/71jz3gcgav/book_icons_all_nK58XFLPK.gif",
  },
];
