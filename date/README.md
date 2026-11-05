# Joudy & Eyad — a cute moment with you

A small, English-only Valentine's Day page made with plain HTML, CSS, and JavaScript. The snapshot captions and images are included locally, so they load without a third-party image service. The layout is tuned for narrow phone screens, including iPhone 14 size.

## Run it locally

Open PowerShell in this folder and run:

```powershell
py -m http.server 8000
```

Then open **http://127.0.0.1:8000/** in your browser. Keep the PowerShell window open while viewing the page. Press **Ctrl+C** in that window to stop the server.

## Personalize it

Edit `content.js` to change the names, English copy, reasons, love letter, and snapshot titles/captions. The relationship start date is stored as `YYYY-MM-DD` in `togetherSince`.

Your five photos are in `images/`. Each snapshot's `image`, `alt`, `width`, and `height` fields are grouped together in `content.js`, followed by the caption displayed below its photo.

## Deploy for free

### GitHub Pages

1. Create a GitHub repository and add the project files, including the `images/` folder.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Open the Pages URL shown in that section.

### Netlify

1. Sign in to Netlify and choose **Add new site → Deploy manually**.
2. Drag the project folder into the drop zone.
3. Netlify publishes the static site; no build command is needed.

## Project files

- `index.html` — page sections and accessible controls
- `styles.css` — colors, responsive layouts, and motion
- `script.js` — photo lightbox, flip cards, typewriter note, and Valentine interaction
- `content.js` — editable English content and image captions
- `images/` — optimized copies of the five supplied photos
