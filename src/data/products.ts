export type Product = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  kind: string;
  iconUrl?: string;
  cardBackgroundColor?: string;
  ribbonLabel?: string;
  featuredOnHome?: boolean;
  homeTitle?: string;
  homeSubtitle?: string;
};

export const products: Product[] = [
  {
    id: "gamedev-artist-bundle",
    title: "Бандл",
    subtitle: "Три продукта в одном наборе для старта и системного развития",
    description: "В бандл входят Game Art Guidebook, Набор для выживания диджитал художника и мини-курс «Путь художника в геймдев».",
    href: "/bundles/gamedev-artist/",
    kind: "Бандл",
    ribbonLabel: "Выгодно",
    iconUrl: "https://ik.imagekit.io/71jz3gcgav/book-icon2_ZNy-2EuWF.gif",
    cardBackgroundColor: "#EEE7D8"
  },
  {
    id: "game-art-guidebook",
    title: "Digital Artist's Survival Kit",
    subtitle: "Честный гид по цифровому рисованию и старту в игровой индустрии",
    description: "Книга для начинающих и развивающихся художников: о рисовании, нужных навыках, поиске фокуса, выгорании, работе в CG и том, как войти в индустрию без лишних иллюзий.",
    href: "/artist-kit/",
    kind: "Book",
    featuredOnHome: true,
    homeTitle: "Набор для выживания Digital художника",
    homeSubtitle: "PDF книга о рисовании и карьере художника",
    iconUrl: "https://ik.imagekit.io/71jz3gcgav/book-icon-2_Tb0lux1uA.gif",
    cardBackgroundColor: "#F4F5EB"
  },
  {
    id: "game-art-guidebook-shop",
    title: "Game Art Guidebook",
    subtitle: "Практическое руководство по карьере в гейм-арте",
    description: "Практическое руководство для художников в игровой индустрии. Пошаговые уроки, видео-примеры, кисти и исходники",
    href: "/books/game-art-guidebook",
    kind: "Book",
    iconUrl: "https://ik.imagekit.io/71jz3gcgav/book_icons_all_nK58XFLPK.gif",
    cardBackgroundColor: "#FFFFFF"
  },
  {
    id: "artist-path-in-gamedev",
    title: "Путь художника в геймдев",
    subtitle: "Практический курс для художников, которые хотят войти в игровую индустрию",
    description: "Практический мини курс из 6 уроков. Видео + текст. Для начинающих художников которые хотят в игровую индустрию",
    href: "/courses/artist-path-in-gamedev/",
    kind: "Курс",
    iconUrl: "https://ik.imagekit.io/71jz3gcgav/%D1%81ourse_icon_Sd4Y4uRyt.gif",
    cardBackgroundColor: "#54784A"
  }
];
