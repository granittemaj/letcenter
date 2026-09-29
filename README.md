# LET Center website

Bilingual (Albanian / English) website for **LET Center, Learning Education Tree**, an education and care center for children in **Prishtina, Kosovo**.

This repository contains two things:

1. **A static, production-quality prototype** (`index.html` + `assets/`) that runs as-is on GitHub Pages.
2. **The build brief for the WordPress version** (`CLAUDE.md`), written so Claude Code can build the WordPress theme and plugin from it.

---

## Repository structure

```
let-center-website/
├── index.html                 Homepage (Albanian by default, English via the SQ/EN switch or ?lang=en)
├── 404.html                   Branded "page not found" page (GitHub Pages uses it automatically)
├── assets/
│   ├── css/style.css          All styles, design tokens, responsive rules, motion
│   ├── js/main.js             Language switch, menu, form validation + delivery, scroll reveals
│   ├── fonts/                 Self-hosted Fredoka + Nunito (woff2, OFL licensed)
│   ├── img/                   Logo mark, icons, favicon, Open Graph image, original social tile
│   └── illustrations/         Standalone SVGs of every illustration (for design and WordPress)
├── content/
│   ├── strings.json           Every UI string in sq + en (116 keys, exported from the page)
│   └── seed-content.json      Structured content (programs, activities, contact data...) for WordPress seeding
├── site.webmanifest           App icons and theme color
├── robots.txt
├── .nojekyll                  Tells GitHub Pages to serve files as-is
├── CLAUDE.md                  WordPress build brief for Claude Code (theme + plugin)
└── README.md                  This file
```

---

## Deploy to GitHub Pages

### Option A: git command line (recommended)

```bash
cd let-center-website
git init
git add .
git commit -m "LET Center static site"
git branch -M main
git remote add origin https://github.com/<your-user>/let-center-website.git
git push -u origin main

# Publish the same files on a gh-pages branch
git checkout -b gh-pages
git push -u origin gh-pages
git checkout main
```

Then in GitHub: **Settings -> Pages -> Build and deployment -> Source: Deploy from a branch -> Branch: `gh-pages` / `(root)` -> Save.**

The site will be live after about a minute at:
`https://<your-user>.github.io/let-center-website/`

To update later:

```bash
git checkout gh-pages && git merge main && git push && git checkout main
```

### Option B: GitHub web upload (no git needed)

1. Create a new repository named `let-center-website` on GitHub.
2. Click **Add file -> Upload files** and drag in the **contents** of this folder (not the folder itself). Hidden files like `.nojekyll` are included when you drag the folder contents from a file manager that shows hidden files; if not, create an empty file named `.nojekyll` with **Add file -> Create new file**.
3. Commit to `main`.
4. **Settings -> Pages -> Source: Deploy from a branch -> `main` / `(root)`.**

### Custom domain (optional)

1. Add a file named `CNAME` in the root containing only the domain, for example `letcenter-ks.com`.
2. At the DNS provider, point the domain to GitHub Pages (A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, or a `CNAME` record for `www` to `<your-user>.github.io`).
3. In **Settings -> Pages**, enter the domain and enable **Enforce HTTPS**.

---

## Preview locally

```bash
cd let-center-website
python3 -m http.server 8080
# open http://localhost:8080
```

Opening `index.html` directly also works.

---

## Make the contact form send messages

GitHub Pages is static hosting and cannot send email by itself. Out of the box the form runs in **demo mode**: it validates and shows the success message, but sends nothing.

To receive real messages, pick a free form service and set the endpoint at the top of `assets/js/main.js`:

```js
// Formspree (has a free tier)
var FORM = { endpoint: 'https://formspree.io/f/XXXXXXXX', extra: {} };

// or Web3Forms (has a free tier)
var FORM = { endpoint: 'https://api.web3forms.com/submit', extra: { access_key: 'YOUR-ACCESS-KEY' } };
```

Register the service with **letcenterks@gmail.com** as the receiving address. The form already sends a subject line like `[LET] Regjistrim, Arta Krasniqi`, a reply-to address, the page language and a honeypot field against spam. If sending fails, visitors see a message with the phone number and email instead.

In the WordPress version this is replaced by the plugin's own REST endpoint (see `CLAUDE.md`).

---

## Editing content

| What | Where |
|---|---|
| Albanian text | Directly in `index.html` |
| English text | The `EN` dictionary at the top of `assets/js/main.js` (keys match the `data-i18n` attributes in `index.html`) |
| Colors, fonts, spacing | CSS variables at the top of `assets/css/style.css` |
| Contact details, map link | `index.html` (search for `+383`, `letcenterks`, `maps.app.goo.gl`) and the JSON-LD block in `<head>` |
| Illustrations | Inline SVG in `index.html`; standalone copies in `assets/illustrations/` |

When you add a new translatable element, give it `data-i18n="some.key"` (text), `data-i18n-ph` (placeholder) or `data-i18n-aria` (aria-label), then add the English value under the same key in `EN`.

To swap an illustration for a real photo, replace the `<svg class="illo" ...>...</svg>` with:

```html
<img class="illo" src="assets/img/photos/pool.webp" alt="Fëmijët në pishinë gjatë kampit veror" style="object-fit:cover">
```

---

## Features

- Albanian by default, English via the header switch; the choice is remembered, and `?lang=en` links straight to English.
- Responsive from 320 px phones to wide desktops (breakpoints 1240, 960 and 640 px).
- Automatic dark mode that follows the device setting.
- Accessibility: skip link, visible keyboard focus, real form labels, 44 px touch targets, `aria` labels, reduced-motion support.
- Motion: growing program cards, scroll reveals, animated illustrations, map pin drop. All of it switches off for visitors who prefer reduced motion.
- SEO: `ChildCare` structured data (phone, email, hours, geo, country `XK`), Open Graph image, meta descriptions in both languages.
- Privacy: fonts are self-hosted, so the page makes no Google Fonts requests. The map is an illustration; nothing from Google loads until the visitor clicks through.

---

## Before going live

- [ ] Set up form delivery (Formspree or Web3Forms, see above) and send a test message.
- [ ] Replace the Instagram link (`href="#"`, 2 places: top bar and footer) or remove the icon.
- [ ] Confirm opening days (currently Monday to Friday, 07:00 to 17:00).
- [ ] Add the street address if there is one (Google Maps listing currently has none).
- [ ] Replace illustrations with real photos where wanted (ask parents for consent before publishing photos of children).
- [ ] Add a privacy policy page and link it in the footer (`Politika e privatësisë`).
- [ ] Once the final URL is known, make `og:image` absolute (for example `https://<domain>/assets/img/og-image.png`) so Facebook and WhatsApp previews show the image.

---

## Next step: WordPress

`CLAUDE.md` contains the complete brief for building the WordPress version: a custom theme (`let-center`) and a companion plugin (`let-center-core`) with custom post types, Secure Custom Fields, Polylang for Albanian/English, a secure contact endpoint that stores and emails messages, structured data, and a content seeder that imports `content/seed-content.json`.

Open the repository in Claude Code and start with:

```
Read CLAUDE.md and start Phase 1.
```

---

## Credits and licenses

- Content, logo and brand: © LET Center. All rights reserved.
- Fonts: [Fredoka](https://fonts.google.com/specimen/Fredoka) and [Nunito](https://fonts.google.com/specimen/Nunito), SIL Open Font License 1.1 (license files in `assets/fonts/`).
- Illustrations and icons: original work drawn for this project.
