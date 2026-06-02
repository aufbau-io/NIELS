# Josephine Shen

Personal index site. Static, bilingual (EN / 中), content-driven. Newspaper /
archival layout: a masthead, then numbered sections — About, Themes, Artefacts,
Projects, Contact — with expanding dropdown entries. One lilac accent on paper.

## Stack

Plain HTML + CSS + a single small vanilla-JS module. Bundled with Rollup; all
visible text lives in `src/content/content.json`. No framework, no Three.js.

## Develop

```bash
npm install
npm run dev      # live server + reload at http://localhost:5173
npm run build    # one-off production build into dist/
npm run preview  # serve the built dist/ locally to check the production build
```

Deploys on Vercel as a static build (`outputDirectory: dist`).

## Structure

```
src/
  index.html            # the index page (shell; lists are rendered from JSON)
  404.html              # self-contained error page (own inline styles)
  content/content.json  # ALL text, EN + ZH — edit here
  js/main.js            # i18n toggle, dropdowns, render, font gate
  styles/
    main.css            # all styling
public/                 # favicon, square.png, other static assets
```

## Editing content

Open `src/content/content.json`. Every entry has `en` and `zh` — keep both
filled. Simple HTML is allowed in values (`<br/>`, `<b>…</b>`, `&amp;`,
`<sup>…</sup>`). Don't rename keys. Sections:

- `ui.*` — fixed labels, masthead, marginalia, footer mark.
- `themes` (3), `artefacts` (2), `projects` (6) — the dropdown lists. Each item
  has `title`, `venue`, optional `yr`, optional `hot: true` (lilac star), and a
  `body`. (Adding a `url` to an item would render a "Read in full →" link.)
- `contact.email` — used everywhere the email appears.

To add a list item, copy one object in the array (mind the commas). To remove
one, delete its object. The numbering and language toggle update automatically.

## Add the portrait

In `src/index.html`, inside `.portrait`, drop in an image:

```html
<figure class="portrait" aria-label="Josephine Shen">
  <img src="/josephine.jpg" alt="Josephine Shen" />
</figure>
```

Put `josephine.jpg` in `public/`. It inherits the frame and alignment.

## Notes

- Language choice persists in `localStorage`.
- The site reveals once webfonts load (no fallback-font reflow), with a 2s safety net.
- There is intentionally no background graphic; the design carries on type + grid.
