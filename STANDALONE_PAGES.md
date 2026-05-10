# Standalone Pages

Любая страница, которая должна открываться напрямую по URL без зависимости от React Router, хранится в `<slug>/index.html` в корне проекта.

Примеры:

- `signup/index.html` -> `/signup/`
- `newsletter/index.html` -> `/newsletter/`

Чтобы быстро создать новую отдельную страницу:

```bash
npm run new:page -- about "About Ruslan Kim"
```

После этого появится файл:

```text
about/index.html
```

И страница будет доступна по адресу:

```text
/about/
```

Правило на будущее:

- если страница должна жить как отдельная ссылка и открываться напрямую, создавай её в `<slug>/index.html`
- если это внутренняя навигация внутри SPA, можно оставлять её в React Router

Основа для всех standalone pages:

- общий стиль лежит в `public/standalone-page.css`
- генератор шаблона лежит в `scripts/new-page.mjs`
