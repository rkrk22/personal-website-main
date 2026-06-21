import { useEffect } from "react";

export type MetaDefinition = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

export function usePageMeta({ title, description, ogTitle, ogDescription }: MetaDefinition) {
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
