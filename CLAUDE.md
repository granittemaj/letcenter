# CLAUDE.md: LET Center WordPress build brief

This file tells Claude Code how to turn the static prototype in this repository into a production WordPress site: **one custom theme (`let-center`) and one companion plugin (`let-center-core`)**. Read the whole file before writing code, then work phase by phase (section 14). Ask the owner (Granit) before deviating from a decision marked **Decision**.

---

## 0. Sources of truth

| Question | Answer lives in |
|---|---|
| How must it look and behave? | `index.html`, `assets/css/style.css`, `assets/js/main.js` (the approved prototype; match it pixel for pixel) |
| What does it say, in both languages? | `content/strings.json` (every UI string, `sq` + `en`) and `content/seed-content.json` (structured content) |
| What do illustrations look like? | Inline SVG in `index.html`; standalone copies in `assets/illustrations/` |
| How is it built? | This file |

Never invent copy, prices, statistics, testimonials, staff names or opening days. Missing facts stay as clearly marked TODOs (section 16).

---

## 1. Client facts

| Field | Value |
|---|---|
| Name | LET Center (Learning Education Tree) |
| What | Education and care center for children 0 to 6 years, pre-primary (5-6, mandatory under MASHT since Sept 2024), and after-school day care for grades I to V |
| Address | **Rruga C, Prishtinë** (sq) / Rruga C, Prishtina (en), Kosovo (ISO country code `XK`) |
| Phone | `+383 48 166 143` (E.164 `+38348166143`) |
| Email (also form recipient) | `letcenterks@gmail.com` |
| Hours | 07:00 to 17:00, Monday to Friday (**Saturday unconfirmed**) |
| Coordinates | `42.647316648278846, 21.18307821035876` |
| Google Maps | `https://maps.app.goo.gl/wHBF2mgiEHpUCPoY7` (place name "LET Center") |
| Facebook | `https://www.facebook.com/letcenterks` |
| Instagram | unknown (TODO) |
| Languages | Albanian (default, `sq`) and English (`en`) |

Programs (in order): Çerdhe / Nursery 0-3, Kopsht / Kindergarten 3-4, Programi edukativ / Early learning 4-5, Parafillor / Pre-primary 5-6, Qendrim ditor / After-school care I-V.
Semester activities: coding and computer science, music therapy, chess, English, gymnastics and karate, dance. Also: psychologist sessions, pediatric checkups, summer camp (swimming, English, weekly "LET Code for Kids" technology classes).

---

## 2. Goals and non-goals

**Goals**
- Match the prototype's design, motion and accessibility exactly, in a maintainable WordPress build.
- Staff can edit every text, photo, program and activity in wp-admin without touching code, in both languages.
- Contact form that stores every message in wp-admin and emails it to the center; spam-resistant; privacy-compliant.
- Fast: Lighthouse mobile Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100.
- Separation of concerns: the **plugin owns data and logic** (post types, fields, form, schema), the **theme owns presentation**. Switching theme must never lose content.

**Non-goals (for v1)**
- No page builder, no WooCommerce, no online payments, no parent login area, no blog (can be added later with a standard `home.php`).

---

## 3. Stack and decisions

| Area | Decision | Why / trade-off |
|---|---|---|
| WordPress | 6.6+ (test on latest), PHP 8.1+ (target 8.2) | Current LTS-like baseline |
| Theme type | **Decision:** custom **classic PHP theme with `theme.json`** (hybrid) | Pixel-exact control of a bespoke design, simple PHP templates, editor still gets the palette and fonts. A pure block theme would make the staircase, diamond illustrations and motion harder to lock down. |
| Page builder | **Decision:** none (no Elementor) | Faster pages, no layout drift. Staff edit content through structured fields instead of free layout. |
| Custom fields | **Secure Custom Fields (SCF)** (free, wordpress.org, includes repeater, options pages, flexible content) | Field groups registered **in PHP** (`acf_add_local_field_group`) and mirrored to `acf-json/` so they are versioned. Code must also work with ACF Pro (same API). |
| Languages | **Polylang** (free) | `sq` default at `/`, `en` at `/en/`. Proper URLs + `hreflang` for SEO, unlike the prototype's JS switch. |
| Email delivery | **WP Mail SMTP** (free) + a transactional provider (Brevo, Mailgun or Gmail app password) | `wp_mail()` from shared hosting often lands in spam. |
| Spam | Honeypot + signed time-trap + IP rate limit (built in). Optional Cloudflare Turnstile (setting) | No third-party cookies by default |
| Build tooling | **None required.** Plain CSS and vanilla JS, copied from the prototype | Anyone can maintain it; no Node needed on the server |
| Coding standards | WordPress Coding Standards via PHPCS, prefix `let_` / `LET_`, text domains `let-center` (theme) and `let-center-core` (plugin) | |
| Local environment | `@wordpress/env` (Docker) | Reproducible, one command |

Required plugins: Secure Custom Fields, Polylang, WP Mail SMTP. Recommended in production: a caching plugin (LiteSpeed Cache or WP Super Cache), an SEO plugin is optional because the plugin outputs schema and the theme outputs meta (if Yoast/Rank Math is installed later, disable our meta output via the filter in section 7.7).

---

## 4. Target repository layout

Keep the static prototype at the root (it is also the GitHub Pages site). Add WordPress work under `wordpress/`:

```
let-center-website/
├── index.html, assets/, content/ ...           (static prototype, unchanged except bug fixes)
├── .wp-env.json
├── phpcs.xml.dist
├── composer.json                               (dev only: phpcs + wpcs)
└── wordpress/
    ├── plugins/let-center-core/                (section 6)
    └── themes/let-center/                      (section 7)
```

`.wp-env.json`:

```json
{
  "phpVersion": "8.2",
  "plugins": [
    "./wordpress/plugins/let-center-core",
    "https://downloads.wordpress.org/plugin/secure-custom-fields.zip",
    "https://downloads.wordpress.org/plugin/polylang.zip",
    "https://downloads.wordpress.org/plugin/wp-mail-smtp.zip"
  ],
  "themes": ["./wordpress/themes/let-center"],
  "config": { "WP_DEBUG": true, "WP_DEBUG_LOG": true, "SCRIPT_DEBUG": true },
  "mappings": { "wp-content/let-content": "./content" }
}
```

`phpcs.xml.dist`: ruleset `WordPress`, text domains `let-center` and `let-center-core`, prefixes `let`, `LET`, exclude `vendor`, `node_modules`, `*.min.*`.

---

## 5. Design system (port from `assets/css/style.css`)

Copy `style.css` into the theme as `assets/css/main.css` and keep the CSS variables as the single source of design tokens. Mirror the key tokens in `theme.json` so the editor matches.

### 5.1 Color tokens

| Token | Light | Dark (prefers-color-scheme) | Use |
|---|---|---|---|
| `--brand` | `#D91A36` | same | Logo red, primary buttons, red bands (white text passes 5:1) |
| `--brand-deep` | `#B3122A` | same | Hover |
| `--sun` | `#FFC93C` | same | Accent, stickers, secondary CTA (dark text only) |
| `--ink` / `--ink-2` / `--muted` | `#2A1B22` / `#4A3D45` / `#6A5E66` | `#FBEFF2` / `#E6D6DC` / `#C2B1B8` | Text |
| `--link` | `#C8102E` | `#FF8497` | Inline links |
| `--bg` / `--petal` / `--card` / `--field` | `#FFFFFF` / `#FFF5F3` / `#FFFFFF` / `#FFFBFA` | `#1C1417` / `#231A1E` / `#2C2126` / `#241A1E` | Surfaces |
| `--line` / `--hair` | `#F1DDE0` / `#F6E6E9` | `#44333A` / `#33262B` | Borders |
| Tints `--rose` `--butter` `--mint` `--sky` `--lilac` | `#FFE3E6` `#FFF1C7` `#DDF3E6` `#DCEBFF` `#ECE3FF` | `#4A2530` `#45391A` `#1E3A2B` `#1E2F48` `#33284A` | One tint per program/age group |
| `--footer` | `#2A1B22` | `#120C0E` | Footer |

Tint order is fixed and meaningful: 0-3 rose, 3-4 butter, 4-5 mint, 5-6 sky, I-V lilac.

### 5.2 Typography

Self-host the fonts (already subset to Latin + Latin Extended, which covers ë and ç): `assets/fonts/fredoka-var.woff2`, `assets/fonts/nunito-var.woff2`. **Never load Google Fonts from Google's servers** (EU/Kosovo privacy exposure).

| Role | Family | Weight | Size |
|---|---|---|---|
| H1 hero | Fredoka | 600 | `clamp(44px, 6vw, 76px)`, line-height 1.02 |
| H2 section | Fredoka | 600 | `clamp(34px, 4.2vw, 56px)` |
| Card titles | Fredoka | 600 | 19 to 24 px |
| Age numbers | Fredoka | 700 | 52 px desktop, 32 px mobile |
| Body | Nunito | 400 to 700 | 16 to 20 px, line-height 1.5 to 1.6 |
| Buttons, chips, labels | Nunito | 800 | 14 to 18 px |

No all-caps labels, no em dashes in copy, no single-word color accents in headlines.

### 5.3 Layout, shape, motion

- Container 1200 px + 24 px gutters (20 px under 640 px). Section padding 96 px desktop, 64 px under 960 px.
- Breakpoints: **1240** (nav collapses to menu button), **960** (single-column hero, stacked programs), **640** (phone).
- Radii: pills 999 px; big cards 32 to 44 px; tiles 22 to 28 px; fields 16 px.
- Brand motif: **the diamond** (a rounded square rotated 45°), taken from the client's social tile. Used for photo frames, "leaves", the 404 page and the map pin label.
- Signature component: the **programs staircase**. Five cards rising in height (310, 350, 390, 430, 470 px) like a growing tree; on mobile they stack with widths 78%, 84%, 90%, 95%, 100%.
- Motion (all inside `@media (prefers-reduced-motion: no-preference)`): hero pop-in and floating badges, canopy sway, programs "grow" reveal (clip-path), staggered reveals, looping illustration details, map pin drop. Reveals are added by JS only, so content is visible without JS.
- Accessibility: skip link, visible focus (`3px solid var(--sun)`), real `<label>`s, 44 px touch targets, `aria-live` errors, text contrast ≥ 4.5:1.

---

## 6. Plugin: `let-center-core`

### 6.1 File tree

```
wordpress/plugins/let-center-core/
├── let-center-core.php              Plugin header, constants (LET_CORE_VERSION, LET_CORE_PATH, LET_CORE_URL), requires, bootstrap
├── uninstall.php                    Delete options only if the "delete data on uninstall" setting is on
├── includes/
│   ├── class-let-plugin.php         Singleton, wires hooks, dependency notice (SCF/Polylang missing)
│   ├── class-let-post-types.php     let_program, let_activity, let_message
│   ├── class-let-fields.php         SCF options page + all field groups (PHP) + acf-json save/load paths
│   ├── class-let-settings.php       let_setting( $key, $default ) helper with per-language fallback
│   ├── class-let-contact.php        REST route, validation, anti-spam, storage, mail
│   ├── class-let-messages-admin.php List columns, filters, status, CSV export, unread bubble in menu
│   ├── class-let-schema.php         JSON-LD ChildCare output in wp_head
│   ├── class-let-polylang.php       Translatable post types, string registration, helpers
│   ├── class-let-privacy.php        Retention cron, personal data exporter + eraser, privacy policy text
│   ├── class-let-seeder.php         Imports content/seed-content.json
│   ├── class-let-cli.php            `wp let seed`, `wp let purge-messages`
│   └── functions.php                Public template helpers (see 6.8)
├── acf-json/                        Mirrored field group JSON (committed)
├── assets/admin.css
└── languages/let-center-core.pot    + let-center-core-sq.po/.mo
```

Every PHP file starts with `defined( 'ABSPATH' ) || exit;`.

### 6.2 Post types

| Post type | Public | Translated (Polylang) | Supports | Notes |
|---|---|---|---|---|
| `let_program` | yes, single pages, no archive | yes | title, editor, thumbnail, page-attributes (menu_order), excerpt | Rewrite slug `program`. Order by `menu_order`. |
| `let_activity` | no (`show_ui` true) | yes | title, page-attributes | Rendered only on the homepage |
| `let_message` | no, `show_in_rest` false, excluded from search | **no** | title | Contact submissions. Custom capabilities mapped to `manage_options` and `edit_others_posts` (admins + editors can read; only admins delete). |

Admin menu: a top-level **"LET Center"** menu (dashicon `dashicons-palmtree` or a custom SVG of the tree) grouping Programs, Activities, Messages (with unread count bubble) and Settings.

### 6.3 Fields (SCF, registered in PHP)

**Program** (`let_program`)

| Field | Key | Type | Notes |
|---|---|---|---|
| Age label | `age_label` | text | "0-3", "3-4", "4-5", "5-6", "I-V" |
| Unit | `unit` | select `years` / `grades` | Rendered as vjeç/years or klasa/grades via translated strings |
| Tint | `tint` | select `rose butter mint sky lilac` | |
| Card text | `card_text` | textarea, max 120 chars | Staircase card copy |
| Badge | `badge` | text, optional | e.g. "Obligueshëm nga MASHT" |
| Detail page content | post editor | | For `single-let_program.php` |

**Activity** (`let_activity`): `icon` (select: code, music, chess, chat, gym, spark, heart, shield, users, book, sun), `tint`, `text` (textarea, 100 chars).

**Front page** field group (location: page type is front page; each language's front page has its own values):

| Tab | Fields |
|---|---|
| Hero | `hero_title`, `hero_text`, `hero_cta_primary` (default "Regjistro fëmijën"), `hero_cta_secondary`, `hero_age_chips` (repeater: `label`, `tint`), `hero_badges` (repeater max 3: `label`, `icon`, `tint`), `hero_image` (image, optional: replaces the illustration inside the diamond) |
| Trust | `trust_items` (repeater exactly 4: `icon`, `title`, `text`) |
| Programs | `programs_title`, `programs_text` (cards come from `let_program`) |
| Activities | `activities_title`, `activities_text` (tiles come from `let_activity`) |
| LET Code | `code_title`, `code_text`, `code_tags` (repeater), `code_cta`, `code_sticker`, `code_image` (optional override) |
| Camp | `camp_label`, `camp_title`, `camp_text`, `camp_checks` (repeater), `camp_cta`, `camp_images` (3 optional overrides: pool, class, yard) |
| Gallery | `gallery_title`, `gallery_text`, `gallery_cta`, `gallery_items` (repeater max 8: `image`, `caption`, `fallback_illustration` select autumn/chess/gymnastics/dance) |
| Contact | `contact_title`, `contact_intro`, `contact_privacy`, `contact_topics` (repeater: `value` slug, `label`), `contact_success`, `contact_failure` |
| Map | `map_title` |

A `header_cta_label` text field (default "Na kontaktoni" / "Contact us") also lives on the front page group (Hero tab), so each language has its own label.

**Options page** "LET Center -> Settings" (not per language; language-specific text uses `_sq` / `_en` suffixes and `let_setting()` picks the current language):

| Tab | Fields |
|---|---|
| Contact | `phone_display`, `phone_e164`, `email`, `address_sq` ("Rruga C, Prishtinë"), `address_en` ("Rruga C, Prishtina"), `street_address` ("Rruga C", used in schema), `hours_days` (checkbox Mon to Sun), `hours_opens`, `hours_closes` |
| Location | `lat`, `lng`, `map_url`, `map_embed_consent` (true/false, default true) |
| Social | `facebook_url`, `instagram_url` (icon hidden when empty) |
| Form | `form_recipient` (default `letcenterks@gmail.com`), `form_cc` (optional), `retention_months` (default 12), `turnstile_site_key`, `turnstile_secret` (optional), `autoreply_enabled` (default false) |
| Advanced | `delete_data_on_uninstall` (default false), `output_schema` (default true), `output_meta` (default true) |

### 6.4 Contact endpoint

`POST /wp-json/let/v1/contact` (public, `permission_callback` returns true; security comes from the checks below, not cookies, so it works with full-page caching).

Request (form-encoded or JSON):

| Field | Rule |
|---|---|
| `topic` | required, one of the configured topic values (`general`, `enroll`, `visit`, `programs`, `code`, `camp`, `other`) |
| `name` | required, 3 to 100 chars, `sanitize_text_field` |
| `email` | optional, `is_email` |
| `phone` | optional, `/^[+0-9 ()-]{8,20}$/` |
| at least one of email / phone | required |
| `age` | optional, one of `0-3 3-4 4-5 5-6 I-V` |
| `message` | required, 3 to 3000 chars, `sanitize_textarea_field` |
| `lang` | `sq` or `en` |
| `_gotcha` | honeypot; must be empty (if filled, return 200 success and store nothing) |
| `_ts` | signed render timestamp `time() . '.' . wp_hash( time() . 'let-form' )`; reject if invalid, older than 24 h, or younger than 3 s |
| `cf-turnstile-response` | verified server-side only when Turnstile keys are set |

Rate limit: max 5 submissions per IP per hour (transient keyed by `wp_hash( $ip )`; never store the raw IP).

Responses:

| Status | Body |
|---|---|
| 200 | `{ "ok": true }` |
| 422 | `{ "ok": false, "errors": { "name": "required", "contact": "invalid", "message": "required" } }` |
| 429 | `{ "ok": false, "error": "rate_limited" }` |
| 500 | `{ "ok": false, "error": "server" }` |

Processing order: validate -> **save `let_message` first** (so nothing is lost if mail fails) -> send mail -> store `mail_sent` meta.

`let_message` meta: `topic`, `name`, `email`, `phone`, `age`, `message`, `lang`, `source_url`, `status` (`new` / `read` / `replied`), `mail_sent` (bool). Title: `[{Topic label}] {Name}`.

Email to `form_recipient` (+ `form_cc`):
- Subject: `[LET] {Topic label}, {Name}` (topic label in Albanian, since staff read Albanian).
- `Reply-To:` the visitor's email when given.
- Body: plain text and a simple HTML version listing all fields, the page language, the date in `Europe/Belgrade` time zone (same as Kosovo, CET/CEST), and a link to the message in wp-admin.
- Optional auto-reply to the visitor in their language (off by default).

Filters for extensibility: `let_contact_topics`, `let_contact_validate`, `let_contact_mail_args`, `let_contact_rate_limit`.

### 6.5 Messages admin

List table columns: Date, Name, Topic, Email, Phone, Age, Language, Status. Filters by topic and status. Row action "Mark as replied". Opening a message marks it `read`. Bulk action "Export CSV" (UTF-8 with BOM so Excel shows ë and ç). Unread count bubble on the menu.

### 6.6 Structured data

Output in `wp_head` on the front page (and a minimal version on program pages):

```json
{
  "@context": "https://schema.org",
  "@type": "ChildCare",
  "name": "LET Center",
  "alternateName": "Learning Education Tree",
  "url": "<home_url in current language>",
  "logo": "<theme logo URL>",
  "image": "<og image URL>",
  "telephone": "+38348166143",
  "email": "letcenterks@gmail.com",
  "address": { "@type": "PostalAddress", "streetAddress": "Rruga C", "addressLocality": "Prishtinë", "addressCountry": "XK" },
  "geo": { "@type": "GeoCoordinates", "latitude": 42.647316648278846, "longitude": 21.18307821035876 },
  "hasMap": "https://maps.app.goo.gl/wHBF2mgiEHpUCPoY7",
  "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "07:00", "closes": "17:00" }],
  "sameAs": ["https://www.facebook.com/letcenterks"]
}
```

All values come from settings. Add Instagram to `sameAs` only when set.

### 6.7 Polylang integration

- Register `let_program` and `let_activity` as translatable (`pll_get_post_types` filter); `let_message` is not.
- Register theme UI strings with `pll_register_string()` under group "LET Center" (everything in `content/strings.json` that is not a field value: nav labels fallback, form labels, errors, units, aria labels, "Më shumë", map texts, footer texts).
- Helper `let_lang()` returns `pll_current_language()` or `sq` when Polylang is missing.
- Polylang setup (document it in the plugin's admin notice, do not automate settings the user should see): languages Shqip (`sq`, locale `sq`, default) and English (`en`, locale `en_US`); URL mode "directory"; hide default language code; detect browser language **off** (Albanian stays default).
- Polylang free cannot translate the `program` slug; that is acceptable (English URLs become `/en/program/nursery/`).

### 6.8 Public helpers (used by the theme, all guarded with `function_exists`)

`let_setting( $key, $default = '' )`, `let_lang()`, `let_t( $key )` (translated UI string from strings registry), `let_get_programs()`, `let_get_activities()`, `let_contact_topics()`, `let_form_timestamp()`, `let_phone_link()`.

### 6.9 Privacy

- Daily cron `let_purge_messages` deletes `let_message` posts older than `retention_months`.
- Register a personal data exporter and eraser (by email) with WordPress privacy tools.
- Suggested privacy-policy paragraph via `wp_add_privacy_policy_content()` in Albanian and English (what the form collects, why, how long, who receives it).
- Map iframe loads only after the visitor clicks (section 7.6). Fonts are local. No analytics by default.
- Legal basis: Kosovo's Law on Protection of Personal Data (No. 06/L-082) is modeled on the GDPR; the client should confirm the final policy text with their advisor.

### 6.10 Seeder

`wp let seed [--force]` reads `content/seed-content.json` (path filterable; in wp-env it is mapped to `wp-content/let-content/seed-content.json`) and:

1. Creates the two front pages (Albanian "Ballina", English "Home"), links them as translations (`pll_set_post_language`, `pll_save_post_translations`), sets the Albanian one as `page_on_front` (Polylang then serves the English one at `/en/`).
2. Fills all front-page fields for each language.
3. Creates 5 programs and 6 activities in both languages with `menu_order`, links translations, fills fields.
4. Fills the options page from `site`.
5. Creates menus `primary` in both languages (anchor links: `#programet`, `#aktivitetet`, `#letcode`, `#kampi`, `#galeria`; no "Kontakt" item, because the header button covers it) and footer menus.
6. Creates an empty "Politika e privatësisë" / "Privacy policy" page pair and sets it as the WP privacy page.

Idempotent: find existing posts by slug + language; skip unless `--force`.

---

## 7. Theme: `let-center`

### 7.1 File tree

```
wordpress/themes/let-center/
├── style.css                        Theme header only (Name: LET Center, Text Domain: let-center, Requires PHP: 8.1)
├── theme.json                       Palette, fonts, font sizes, layout (contentSize 760px, wideSize 1200px)
├── functions.php                    Requires inc/*
├── screenshot.png                   1200x900, from the prototype hero
├── inc/
│   ├── setup.php                    Theme supports, menus (primary, footer_programs, footer_center), image sizes
│   ├── enqueue.php                  CSS/JS, font preloads, localized strings, remove emoji + jQuery on front
│   ├── template-tags.php            let_the_button(), let_icon(), let_illustration(), let_section_open()
│   ├── icons.php                    The SVG sprite from index.html, printed once in wp_footer
│   ├── language-switcher.php        SQ/EN pill using pll_the_languages( [ 'raw' => 1 ] )
│   ├── meta.php                     Title, description, Open Graph (skips if an SEO plugin is active)
│   └── compat.php                   Graceful fallbacks + admin notice when let-center-core is inactive
├── header.php                       Top bar, sticky header, mobile nav (from index.html)
├── footer.php                       Footer (from index.html), sprite, scripts
├── front-page.php                   Calls the section parts in order
├── page.php                         Simple content page (privacy policy etc.) in the site style
├── single-let_program.php           Program detail: tinted hero with age badge, content, CTA to contact with topic preselected
├── index.php                        Fallback
├── 404.php                          Port of 404.html
├── template-parts/
│   ├── sections/hero.php
│   ├── sections/trust.php
│   ├── sections/programs.php
│   ├── sections/activities.php
│   ├── sections/let-code.php
│   ├── sections/camp.php
│   ├── sections/gallery.php
│   ├── sections/contact.php
│   ├── sections/map.php
│   ├── components/program-card.php
│   ├── components/activity-card.php
│   └── illustrations/{kid-symbols,hero-tree,let-code,camp-pool,camp-english,camp-yard,gallery-autumn,gallery-chess,gallery-gymnastics,gallery-dance,map}.php
├── assets/
│   ├── css/main.css                 From assets/css/style.css (font URLs adjusted)
│   ├── js/main.js                   Rewritten per 7.5
│   ├── fonts/                       Copied as-is, keep the OFL files
│   └── img/                         Logo mark, icons, og-image
└── languages/let-center.pot         + let-center-sq.po/.mo
```

### 7.2 Section map (prototype -> WordPress)

| Prototype block (id) | Template part | Data source | Notes |
|---|---|---|---|
| Top bar | `header.php` | settings: address, hours, phone, social | Hidden under 640 px |
| Header + mobile nav | `header.php` | menu `primary`, language switcher, `header_cta` | Header button is **"Na kontaktoni" / "Contact us"** with `data-interest="general"`, never an enrollment label: the form handles questions of every kind. The menu has no separate "Kontakt" link. |
| Hero | `sections/hero.php` | front page Hero tab | Illustration unless `hero_image` is set; image keeps the diamond frame. Primary button "Regjistro fëmijën" preselects topic `enroll`. |
| Trust strip | `sections/trust.php` | `trust_items` | |
| Programs `#programet` | `sections/programs.php` + `components/program-card.php` | `let_program` query | Heights and mobile widths by position (310 + 40n px; 78/84/90/95/100%) |
| Activities `#aktivitetet` | `sections/activities.php` | `let_activity` | |
| LET Code `#letcode` | `sections/let-code.php` | Code tab | CTA preselects topic `code` |
| Camp `#kampi` | `sections/camp.php` | Camp tab | CTA preselects topic `camp` |
| Gallery `#galeria` | `sections/gallery.php` | `gallery_items` | Image if set, else fallback illustration; captions always shown |
| Contact `#kontakt` | `sections/contact.php` | Contact tab + settings | Form posts to REST (7.5) |
| Map `#harta` | `sections/map.php` | settings: address, lat/lng, map_url | Title + one address line (pin icon + "Rruga C, Prishtinë", linking to Google Maps). No buttons. Click-to-load embed (7.6) |
| Footer | `footer.php` | menus + settings | |

Escape everything late: `esc_html`, `esc_attr`, `esc_url`, `wp_kses_post` for rich text. Illustrations are trusted theme files and can be included directly.

### 7.3 Illustrations

Each illustration becomes a PHP template part containing its SVG exactly as in `assets/illustrations/*.svg` **without** the `<defs>` (the `kid` and `kid-up` symbols are printed once by `illustrations/kid-symbols.php` inside the icon sprite). Keep the animation classes (`sway`, `hop-loop`, `bob-a`, `bob-b`, `twinkle`, `typebar`, `drift`, `drift-slow`, `fall`, `map-pulse`, `pin-drop`). `let_illustration( 'camp-pool' )` prints it. When an override image exists, print `<img class="illo" ... style="object-fit:cover">` in the same wrapper with `wp_get_attachment_image()` (sizes attribute set per slot).

### 7.4 Language switcher

Replace the prototype's JS dictionary switch with real Polylang links. The header pill shows the **other** language code (`EN` on Albanian pages, `SQ` on English pages), links to the translation of the current page (fallback: that language's home), and has `lang` + `hreflang` + `aria-label` ("Switch to English" / "Kalo në shqip"). No JS needed. Remove `EN` dictionary and `applyLang` from the theme JS.

### 7.5 JavaScript (`assets/js/main.js`, vanilla, `defer`, no jQuery)

Keep from the prototype: mobile menu (Esc closes, focus returns, `aria-expanded`), CTA topic preselect (`data-interest`), client-side validation with the same rules and messages, scroll reveals, reduced-motion checks.

Change: form submission uses `fetch( LET.restUrl + 'contact', { method: 'POST', body: FormData } )`, reads the JSON response, maps 422 field errors to the inline error slots, shows the success box on 200 and the failure box (phone + email) on anything else, disables the button with `aria-busy` while sending.

Localize with `wp_add_inline_script( 'let-center', 'window.LET = ' . wp_json_encode( [...] ), 'before' )`:

```php
[
  'restUrl' => esc_url_raw( rest_url( 'let/v1/' ) ),
  'lang'    => let_lang(),
  'i18n'    => [ 'errName' => ..., 'errContact' => ..., 'errMsg' => ..., 'menuOpen' => ..., 'menuClose' => ... ],
]
```

The form also contains hidden `_ts` (from `let_form_timestamp()`), `lang`, and the `_gotcha` honeypot.

### 7.6 Map

Default: the illustrated map (`illustrations/map.php`) linking to `map_url`. Beside it only the title and the address line (pin icon + address, also linking to `map_url`). **No "Get directions" or "Open in Google Maps" buttons** (client decision). When `map_embed_consent` is on, add a button "Shfaq hartën interaktive" / "Show interactive map" that replaces the illustration with:

```html
<iframe src="https://maps.google.com/maps?q={lat},{lng}&z=17&output=embed" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade" title="LET Center në hartë"
        style="border:0;width:100%;height:100%"></iframe>
```

Nothing from Google loads before that click.

### 7.7 Head, performance and SEO

- Enqueue `main.css` (no `?ver` cache issues: use `filemtime` as version) and `main.js` with `defer` (`wp_script_add_data( ..., 'strategy', 'defer' )`).
- Preload both woff2 fonts. Remove emoji scripts, `wp-embed`, jQuery on the front end, block library CSS if unused (`wp_dequeue_style( 'wp-block-library' )` except on `page.php` content).
- Image sizes: `let-card` 800x800 crop, `let-wide` 1200x750 crop, `let-hero` 900x900 crop; always output `srcset`, `sizes`, `loading="lazy"` (except hero), `decoding="async"`.
- Meta: title + description per language (from `seed-content.json` `seo`), Open Graph (`og:image` absolute), `og:locale` `sq_AL` / `en_US`, canonical. Skip our meta when Yoast or Rank Math is active (`apply_filters( 'let_output_meta', ! defined( 'WPSEO_VERSION' ) && ! defined( 'RANK_MATH_VERSION' ) )`).
- `hreflang` comes from Polylang; verify it outputs `sq`, `en` and `x-default` (Albanian).
- Budgets: HTML < 60 KB gzipped, CSS < 20 KB gzipped, JS < 10 KB gzipped, LCP < 2.5 s on 4G, CLS < 0.05.

### 7.8 Graceful degradation

If `let-center-core` or SCF is inactive, the theme must still render the homepage using the seed defaults bundled in `inc/compat.php` (read from a copy of `seed-content.json`) and show an admin notice. No fatal errors if Polylang is missing (Albanian only).

---

## 8. Translation workflow

- Page and post content: translated through Polylang (each language has its own post, linked).
- Field values: per translated post (front page, programs, activities).
- Theme and plugin UI strings: `__( 'Më shumë', 'let-center' )` style calls use **English source strings** in code (WordPress convention), with Albanian provided in `let-center-sq.po`. Generate the `.po` from `content/strings.json` (write a small script `bin/strings-to-po.php`). Also register them with Polylang so staff can tweak wording in **Languages -> Translations** without a developer.
- Settings with language variants use `_sq` / `_en` suffixes via `let_setting()`.

---

## 9. Email deliverability

- Configure WP Mail SMTP with a transactional provider; the From address should be on the site's own domain (e.g. `no-reply@<domain>`), never the Gmail address, with SPF, DKIM and DMARC set on the domain.
- Reply-To is the visitor, so staff can answer directly from Gmail.
- Add a "Send test message" button on the settings page that submits a fake message through the same code path.

---

## 10. Security checklist

- Sanitize on input, escape on output, `$wpdb->prepare` for any raw SQL (none expected).
- Capability checks on every admin action; nonces on admin forms and CSV export.
- REST route validates `args` schema; no sensitive data in responses.
- No raw IPs stored; hashed only for rate limiting (transients expire).
- Do not expose `let_message` via REST, search, sitemaps or feeds (`exclude_from_search`, `show_in_rest` false, filter `wp_sitemaps_post_types`).
- Files: `index.php` "Silence is golden" in plugin folders.

---

## 11. Accessibility checklist (must pass)

- Keyboard: every interactive element reachable, visible focus, menu closes with Esc, no keyboard traps.
- Landmarks: `header`, `nav` (labelled), `main`, `footer`; one H1 per page; heading order logical.
- Forms: labels bound to inputs, errors announced (`aria-live="polite"`), `aria-invalid` on failing fields, success uses `role="status"`, failure `role="alert"`.
- Decorative SVG `aria-hidden="true"`; informative images have Albanian/English `alt`.
- Contrast ≥ 4.5:1 for text (check both light and dark mode).
- `prefers-reduced-motion: reduce` disables all animation and smooth scrolling.
- `lang` attribute correct per language (Polylang sets it); inline English text on Albanian pages gets `lang="en"`.

---

## 12. Testing

- PHPCS (WPCS) clean: `composer run lint`.
- Manual matrix: Chrome, Firefox, Safari (macOS + iOS), Chrome Android; widths 360, 390, 768, 1024, 1280, 1440.
- Visual comparison: take screenshots of `index.html` and the WordPress front page at 1440 and 390 in both languages; differences must be intentional.
- Form: happy path (email only, phone only, both), each validation error, honeypot, too-fast submit, rate limit, mail failure (message still stored), CSV export with ë/ç.
- Lighthouse (mobile) on the front page in both languages: targets in section 2.
- Axe DevTools: zero violations.

---

## 13. Deployment

- Build release zips: `wordpress/themes/let-center` -> `let-center.zip`, `wordpress/plugins/let-center-core` -> `let-center-core.zip` (exclude dev files: `.git*`, `node_modules`, `composer.*`, `phpcs.xml.dist`, `bin/`). Add a script `bin/build-zips.sh`.
- Production: install SCF, Polylang, WP Mail SMTP, a cache plugin; upload the two zips; activate plugin then theme; run the seeder once (`wp let seed`) or import via **LET Center -> Settings -> Import seed content** (admin button that runs the same seeder).
- Set permalinks to "Post name". Set the timezone to Europe/Belgrade (UTC+1/+2, same as Prishtina).
- Keep the GitHub Pages prototype online as the design reference until launch.

---

## 14. Phased plan for Claude Code

Work in this order. After each phase: run PHPCS, test in wp-env, summarize what changed, and wait for approval before the next phase.

**Phase 1: Environment**
- Add `.wp-env.json`, `composer.json` (dev: `squizlabs/php_codesniffer`, `wp-coding-standards/wpcs`, `dealerdirect/phpcodesniffer-composer-installer`), `phpcs.xml.dist`.
- Scaffold empty plugin and theme that activate without errors.
- Done when: `npx @wordpress/env start` gives a working site with both activated and the three required plugins active.

**Phase 2: Plugin data model**
- Post types, admin menu, SCF options page and field groups (PHP + `acf-json`), helpers, Polylang registration, dependency notices.
- Done when: all fields visible in wp-admin in both languages; no PHP notices with `WP_DEBUG`.

**Phase 3: Theme shell**
- `theme.json`, enqueue, fonts, header, footer, icon sprite, language switcher, `front-page.php` rendering every section from **static defaults** first.
- Done when: the WordPress homepage matches `index.html` visually at 1440 and 390 px.

**Phase 4: Wire content + seeder**
- Replace static defaults with field and CPT data; build `wp let seed`; seed both languages.
- Done when: `/` shows Albanian and `/en/` shows English, identical to the prototype's two languages, with all text editable in wp-admin.

**Phase 5: Contact + map**
- REST endpoint, anti-spam, storage, mail, messages admin, CSV export, JS submission, click-to-load map.
- Done when: every case in section 12 "Form" passes and a test email arrives.

**Phase 6: Program pages, SEO, privacy**
- `single-let_program.php`, meta/OG/schema, privacy tools and retention cron, privacy page template, 404.
- Done when: Rich Results Test validates `ChildCare`; Polylang `hreflang` present; privacy exporter returns messages by email.

**Phase 7: QA + release**
- Accessibility and Lighthouse passes, cross-browser check, `.pot`/`.po`/`.mo`, `bin/build-zips.sh`, update README with install steps.
- Done when: section 2 targets are met and the zips install cleanly on a fresh WordPress.

---

## 15. Commands

```bash
# Local environment
npx @wordpress/env start
npx @wordpress/env run cli wp plugin list
npx @wordpress/env run cli wp let seed
npx @wordpress/env stop

# Lint
composer install
composer run lint            # phpcs
composer run lint:fix        # phpcbf

# Static prototype preview
python3 -m http.server 8080
```

Default wp-env login: `admin` / `password` at `http://localhost:8888/wp-admin`.

---

## 16. Open questions (do not guess; leave TODOs and ask)

1. Is Saturday a working day? (Hours currently Monday to Friday, 07:00 to 17:00.)
2. ~~Street address~~ Resolved: Rruga C, Prishtinë.
3. Instagram account.
4. Real photos: which ones, and written parental consent for publishing children's photos.
5. Domain name and hosting provider (affects SMTP setup and the absolute `og:image`).
6. Who else should receive form emails besides `letcenterks@gmail.com`?
7. Should program pages show fees, schedules or enrollment periods? (Not in scope until the client provides them.)
8. Final privacy policy text (client/legal).

---

## 17. Style rules for any copy Claude writes

- Albanian first, English second; plain, warm, parent-friendly language.
- No em dashes. No all-caps labels. No invented facts.
- Program names exactly as in `seed-content.json`.
- Brand name always "LET Center"; the activity brand "LET Code for Kids" is not translated; the sticker "We are the future" stays in English in both languages (it comes from the client's own posts).
