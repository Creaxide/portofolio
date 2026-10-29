# portofolio

The personal portfolio of **Joseph Mario Danubio (Creax)** — a Computer Science / Software Engineering student at BINUS in Bekasi.

It is one static page: plain HTML, CSS, and JavaScript. There is no framework, package manager, or build step. The design is a transit map: one station board for Creax, three coloured lines for three public projects, and every stop is a real capability. A compact **Other work** list covers concept, interface, and home-lab projects; the hoax-detection notebook is linked, while no public repository or hosted demo exists.

## What is here

| Path | Purpose |
| --- | --- |
| `index.html` | The whole page: About, Projects, Contact |
| `assets/css/style.css` | Layout, palette, light/dark themes, motion, responsive rules |
| `assets/js/main.js` | Theme toggle, clock, copy-email, line isolation, section navigation |
| `assets/fonts/` | Self-hosted Overpass and Overpass Mono (SIL OFL) |
| `assets/img/favicon.svg` | The three-line mark |

No analytics, no tracking, no third-party scripts, and no remote font requests.

## Preview locally

From this folder, run one of these:

```powershell
py -m http.server 8000
```

Then open <http://localhost:8000>. If `py` is not available, use `python -m http.server 8000`.

Any static file server works. Opening `index.html` directly with `file://` also renders the page, but a local server is closer to GitHub Pages and lets the clipboard API work normally.

## Edit the content

- **Name and education:** the page title, About lede, facts, and footer use `Joseph Mario Danubio`; `Creax` remains the short display name and brand.
- **Email:** search `josephmario360@gmail.com` in `index.html`. It appears in the contact link, the copy button, and the mailto action.
- **GitHub:** search `github.com/Creaxide`.
- **Project copy:** each public project is an `<article>` in the Projects section. The line colour is set by the `.project--verso`, `.project--graduation`, and `.project--jitu` classes. The three smaller entries under **Other work** are `<li>` elements in `.other-list`.
- **Palette:** the design tokens are at the top of `assets/css/style.css` (`:root` for day service, `[data-theme="dark"]` for night service).
- **Theme default:** on a first visit the page follows the operating system. A manual choice is saved in `localStorage` under `creax-theme`.

### Replace the portrait

The About section uses `assets/img/portrait.png`, displayed in a 4:5 frame with `object-fit: cover`. To change it, overwrite that file and update the `alt` text and caption in `index.html`. A source of at least 800 × 1000 px will stay sharp on high-density screens.

### Add a demo link

Graduation Monitor already links to its live demo. Verso and Jitu still mark the demo as unavailable. When one exists, replace the `<p class="demo-missing">…</p>` block with a secondary demo link:

```html
<a class="button button--outline" href="https://example.com/demo" target="_blank" rel="noopener">Open demo</a>
```

Do not add a demo link for a project that has no public deployment.

## Publish on GitHub Pages

The site is published as a GitHub Pages project site from the public **`portofolio`** repository:

**<https://creaxide.github.io/portofolio/>**

1. On GitHub, create a **public** repository named `portofolio` under the `Creaxide` account. Do not add a README or `.gitignore` if you are pushing this folder.
2. In this folder, run:

   ```powershell
   git init
   git add .
   git commit -m "Build portfolio"
   git branch -M main
   git remote add origin https://github.com/Creaxide/portofolio.git
   git push -u origin main
   ```

3. Open the repository on GitHub: **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Set **Branch** to `main` and the folder to **`/ (root)`**, then click **Save**.
6. Wait for the Pages deployment to finish. The site will be at <https://creaxide.github.io/portofolio/>.

No GitHub Actions workflow is required. This repository includes a `.nojekyll` file so GitHub Pages serves the files as-is instead of running Jekyll. All asset paths are relative, so the page works from the `/portofolio/` subpath.

### Updating the live site

After the first deployment, each push to `main` updates the site:

```powershell
git add .
git commit -m "Update portfolio"
git push
```

## Honest notes

- **Verso** is a native Rust desktop app. There is no hosted demo.
- **Graduation Monitor** is a Supabase-backed advisor dashboard. Live demo: `https://creaxide.github.io/graduation-monitor/`. Access depends on the deployed Supabase environment; no credentials are listed here.
- **Jitu** is a team project for Kelompok 7, HCI LA83. The public repository is a fork of `lutanoraorvis/Jitu`, and the current public build is a front-end prototype: its verdict is simulated in the browser rather than produced by a trained model.
- **Other work** entries come from the attached CV. The hoax-detection concept reports 98.94% test accuracy and links to its public Colab notebook; it has no public repository or hosted demo. The Figma prototype and the home-lab deployment have no public link, and are marked accordingly. The phone number on the CV is intentionally not published.
- The portrait is Joseph’s supplied photo at `assets/img/portrait.png`. Do not replace it with a stock image.

## Type and licence

Overpass and Overpass Mono are self-hosted from `assets/fonts/`. Both are licensed under the SIL Open Font License 1.1; the licence text is in `assets/fonts/OFL.txt`.

The page code and written content are © Joseph Mario Danubio (Creax). The three project repositories keep their own licences.
