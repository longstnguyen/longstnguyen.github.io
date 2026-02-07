# longstnguyen.github.io

Personal website (static) hosted on GitHub Pages.

## Local preview

From the repo root:

- `python3 -m http.server 8000`
- Open `http://localhost:8000`

(Use a local server to avoid CORS/path quirks that can happen when opening `index.html` directly.)

## Structure

```text
.
├── index.html
├── publications/
│   └── index.html
├── files/
│   ├── papers/            # publication PDFs
│   └── bib/               # BibTeX entries
├── assets/
│   ├── css/
│   │   ├── app/           # site-specific CSS
│   │   └── vendor/        # third-party CSS + font-face bundles
│   ├── js/
│   │   ├── app/           # site-specific JS
│   │   └── vendor/        # third-party JS
│   └── img/
├── robots.txt
├── sitemap.xml
├── .nojekyll
└── README.md
```
