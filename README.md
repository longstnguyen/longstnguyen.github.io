# longstnguyen.github.io

Personal website (static) hosted on GitHub Pages.

## Local preview

From the repo root:

- `python3 -m http.server 8000`
- Open `http://localhost:8000`

(Use a local server to avoid CORS/path quirks that can happen when opening `index.html` directly.)

## Structure

- `index.html`: main page
- `files/`: downloadable files (e.g., CV PDF)
- `assets/`
  - `css/vendor/`: third-party CSS (Bootstrap, Animate.css, font-face bundles)
  - `css/app/`: site-specific CSS
  - `js/vendor/`: third-party JS (jQuery, Bootstrap, Waypoints, Modernizr)
  - `js/app/`: site-specific JS
  - `img/`: images

## Notes

- `.nojekyll` is present to disable Jekyll processing on GitHub Pages.
