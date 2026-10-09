# Attila Hegyeli — Personal Portfolio

A static, single-page developer portfolio with a dark aesthetic, blood-red accents, parallax scrolling, and a continuous scroll experience (no navigation bar).

## Stack

- Plain HTML, CSS, and JavaScript
- No build step or backend
- Compatible with [GitHub Pages](https://pages.github.com/)

## Project structure

```
├── index.html              # Single-page site
├── css/styles.css          # Theme, layout, animations
├── js/
│   ├── config.js           # Contact links & project data (edit this)
│   └── main.js             # Parallax, reveals, smooth scroll
├── assets/images/
│   └── profile.jpg         # Add your photo here (optional)
└── .nojekyll               # Ensures GitHub Pages serves files as-is
```

## Customize

### 1. Contact details

Edit `js/config.js` and replace the placeholders:

```js
contact: {
  email: "you@example.com",
  github: "https://github.com/your-username",
  instagram: "https://instagram.com/your-username",
  whatsapp: "https://wa.me/40123456789",  // country code + number, digits only
},
```

Also update the visible hints in `index.html` under the contact cards if you want (e.g. `@your_handle`).

### 2. Profile photo

Place your photo at:

```
assets/images/profile.jpg
```

If the file is missing, the site shows a styled “AH” fallback automatically.

### 3. Project links

In `js/config.js`, set each project’s `github` and `demo` URLs. Leave `"#"` until you have a real link — placeholder links are disabled in the UI.

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
# Python
python -m http.server 8080

# Node (if you have npx)
npx serve .
```

Then visit `http://localhost:8080`.

## Deploy to GitHub Pages

This repository is set up for **project pages** at:

`https://AttilaHegyeli.github.io/personal_website/`

### Option A — GitHub Settings (recommended)

1. Push this site to the `main` branch.
2. On GitHub: **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch `main` and folder `/ (root)`.
5. Save. After a minute or two, the site will be live.

All asset paths are relative (`css/…`, `js/…`, `assets/…`), so they work both locally and on GitHub Pages without a custom base URL.

### Option B — GitHub Actions (optional)

If you prefer Actions, add a simple static deploy workflow later. For a plain HTML site, Option A is enough.

## Accessibility & performance

- Respects `prefers-reduced-motion` (disables parallax and softens animations)
- Semantic landmarks and keyboard-focusable controls
- Lightweight: no frameworks, minimal third-party requests (Google Fonts only)

## License

Personal portfolio — © Attila Hegyeli.
