export function SiteFooter() {
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
