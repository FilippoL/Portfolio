# Site Architecture & Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the single-page portfolio into a multi-page Eleventy site (Home / About / Articles) with a command-palette navigation system and a near-monochrome, monospace-accented "typewriter" visual language, while keeping the four existing advanced features (theme toggle, particle background, typing hero, skills carousel).

**Architecture:** Introduce Eleventy (11ty) as a zero-runtime static site generator (`input: "."`, `output: "_site"`), with a shared `_includes/base.njk` layout providing nav/command-palette/footer. `index.njk`, `about.njk`, and `articles/index.njk` become the three pages. Existing `assets/`, `images/`, `Curriculum/`, `Projects/`, `CNAME` are passthrough-copied unchanged. A GitHub Actions workflow builds and deploys `_site/` to GitHub Pages on push.

**Tech Stack:** Eleventy 2.x (`@11ty/eleventy`), Nunjucks templates, vanilla JS (no client framework), existing `assets/css/modern.css` (edited in place), GitHub Actions (`actions/upload-pages-artifact`, `actions/deploy-pages`).

## Global Constraints

- No client-side framework or SPA runtime — Eleventy must output plain static HTML, same deployment model as today (GitHub Pages).
- Exactly one accent color across both themes; no gradients, no per-icon brand colors left un-desaturated.
- Monospace font (`--font-mono`) is reserved for headings, nav, labels, and the typing-hero text; body copy stays on `--font-sans`.
- All four existing features (dark/light toggle, particle background, typing-animation hero, skills carousel) must still work after the redesign — none are removed.
- This plan does not touch Employment/Projects/Publications *content*, does not build the GitHub contribution graph widget, and does not write article content — those are separate sub-projects. Where this plan ports existing copy verbatim (e.g. the About paragraph), it is a structural move, not a content edit.
- Node 18+ (confirmed installed: v18.19.1) / npm 9+.

---

### Task 1: Eleventy scaffolding + Home page port

**Files:**
- Create: `package.json`
- Create: `.eleventy.js`
- Create: `.eleventyignore`
- Modify: `.gitignore`
- Create: `_data/nav.json`
- Create: `_includes/base.njk`
- Create: `index.njk`
- Delete: `index.html`

**Interfaces:**
- Produces: `_data/nav.json` — array of `{ label, href, type }`, consumed by Task 4 (command palette) and implicitly by anyone adding a nav destination later.
- Produces: `_includes/base.njk` layout, consumed by every page task (`index.njk`, `about.njk`, `articles/index.njk`) via `layout: base.njk` front matter, and providing front-matter variables `title`, `description`, `navIndicator`.
- Produces: DOM ids `#site-nav`, `#nav-indicator`, `#palette-trigger`, `#theme-toggle`, `#particle-canvas` — consumed by Tasks 4, 5, 7, 9.

- [ ] **Step 1: Write the failing check**

```bash
cd /home/filippo/Documents/Projects/Portfolio
test -f _site/index.html && echo FOUND || echo "MISSING (expected)"
```

Expected: `MISSING (expected)` — `_site/` doesn't exist yet, no build tool installed.

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "eleventy",
    "serve": "eleventy --serve"
  },
  "devDependencies": {
    "@11ty/eleventy": "^2.0.1"
  }
}
```

- [ ] **Step 3: Create `.eleventy.js`**

```js
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("Curriculum");
  eleventyConfig.addPassthroughCopy("Projects");
  eleventyConfig.addPassthroughCopy("CNAME");

  eleventyConfig.addFilter("dump", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-GB", { year: "numeric", month: "long" });
  });

  eleventyConfig.addCollection("articles", (collectionApi) => {
    return collectionApi.getFilteredByGlob("articles/posts/*.md").sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
```

- [ ] **Step 4: Create `.eleventyignore`**

```
node_modules
_site
docs
README.md
```

- [ ] **Step 5: Modify `.gitignore`**

Current content:
```

\.idea/
\.vscode/
```

New content:
```

\.idea/
\.vscode/
node_modules/
_site/
```

- [ ] **Step 6: Create `_data/nav.json`**

```json
[
  { "label": "About", "href": "/about/", "type": "page" },
  { "label": "Employment", "href": "/#employment", "type": "section" },
  { "label": "Projects", "href": "/#projects", "type": "section" },
  { "label": "Publications", "href": "/#publications", "type": "section" },
  { "label": "Personal Projects", "href": "/#currently-working", "type": "section" },
  { "label": "Skills", "href": "/#skills", "type": "section" },
  { "label": "Articles", "href": "/articles/", "type": "page" },
  { "label": "Contact", "href": "/#contact", "type": "section" },
  { "label": "GitHub Profile", "href": "https://github.com/FilippoL", "type": "external" }
]
```

- [ ] **Step 7: Create `_includes/base.njk`**

```njk
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{{ description }}">
    <meta name="author" content="Filippo Maria Libardi">
    <title>{{ title }}</title>
    <link rel="icon" href="/images/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="/assets/css/modern.css">
</head>
<body>
    <nav id="site-nav">
        <div class="container">
            <a href="/" class="logo">FL</a>
            <span id="nav-indicator" class="nav-indicator">{{ navIndicator }}</span>
            <div class="nav-controls">
                <button id="palette-trigger" class="palette-trigger" aria-label="Open navigation (Cmd+K)">⌘K</button>
                <button id="theme-toggle" aria-label="Toggle dark/light mode">
                    <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </button>
            </div>
        </div>
    </nav>

    <canvas id="particle-canvas"></canvas>

    <main>
        {{ content | safe }}
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2026 Filippo Maria Libardi.</p>
            <p class="footer-links">
                <a href="https://github.com/FilippoL" target="_blank">GitHub</a> •
                <a href="https://www.researchgate.net/profile/Filippo-Libardi" target="_blank">ResearchGate</a> •
                <a href="/Curriculum/CV.pdf" target="_blank">CV</a>
            </p>
        </div>
    </footer>

    <script src="/assets/js/portfolio.js"></script>
</body>
</html>
```

- [ ] **Step 8: Port the Home page body into `index.njk`**

Extract the existing content (Hero through the end of Contact — excludes the old `<nav>`, particle canvas, footer, and script tag, which now live in `base.njk`) and fix asset paths to be root-absolute:

```bash
cd /home/filippo/Documents/Projects/Portfolio
sed -n '40,615p' index.html > /tmp/home-body.html
{
  cat <<'FRONTMATTER'
---
layout: base.njk
title: Filippo Libardi - AI Researcher & Graphics Programmer
description: Filippo Libardi - AI Researcher & Graphics Programmer. MSc in Artificial Intelligence specializing in computer vision, deep learning, and game development.
navIndicator: Home
---
FRONTMATTER
  cat /tmp/home-body.html
} > index.njk
sed -i \
  -e 's#src="images/#src="/images/#g' \
  -e 's#href="Curriculum/#href="/Curriculum/#g' \
  index.njk
rm /tmp/home-body.html
```

- [ ] **Step 9: Remove the old root `index.html`**

```bash
git rm index.html
```

- [ ] **Step 10: Install dependencies and run the check**

```bash
npm install
npm run build
test -f _site/index.html && echo "index.html exists"
grep -q 'id="site-nav"' _site/index.html && echo "nav ok"
grep -q 'id="hero"' _site/index.html && echo "hero ok"
grep -q 'id="contact"' _site/index.html && echo "contact ok"
grep -q '"/images/nrppg.png"' _site/index.html && echo "image path ok"
test -f _site/assets/css/modern.css && echo "css passthrough ok"
test -f _site/images/nrppg.png && echo "images passthrough ok"
test -f _site/Curriculum/CV.pdf && echo "curriculum passthrough ok"
! grep -q 'nav-links' _site/index.html && echo "old nav-links gone"
```

Expected: all nine `echo` lines print, no errors.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json .eleventy.js .eleventyignore .gitignore _data/nav.json _includes/base.njk index.njk
git commit -m "$(cat <<'EOF'
Migrate Home page to Eleventy with a shared layout

Introduces Eleventy as a zero-runtime static site generator so nav/
footer can be shared across the upcoming About and Articles pages,
without changing Home's content or deployment model.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: About page

**Files:**
- Create: `about.njk`
- Modify: `index.njk`

**Interfaces:**
- Consumes: `base.njk` layout from Task 1 (`layout: base.njk`, `title`, `description`, `navIndicator` front-matter vars).
- Produces: route `/about/`, linked from Task 4's command palette via the existing `_data/nav.json` "About" entry.

- [ ] **Step 1: Write the failing check**

```bash
npm run build
test -f _site/about/index.html && echo FOUND || echo "MISSING (expected)"
```

Expected: `MISSING (expected)`.

- [ ] **Step 2: Create `about.njk`**

```njk
---
layout: base.njk
title: About - Filippo Libardi
description: About Filippo Maria Libardi - AI researcher, graphics programmer, and co-founder.
navIndicator: About
---
<section id="about-page" class="wrapper">
    <div class="container">
        <div class="about-content">
            <div class="about-text">
                <h1>About Me</h1>
                <p>I'm an AI researcher and software engineer specializing in <strong>computer vision</strong>, <strong>deep learning</strong>, and <strong>graphics programming</strong>. My work bridges academic research with practical engineering, from developing neural networks for remote physiological monitoring to building custom game engines in DirectX and OpenGL.</p>
                <p>Currently exploring <strong>procedural 3D generation</strong> and co-founding <strong>Pecus Chain</strong> and <strong>ClusTEQ</strong>. My research has been published in academic venues, focusing on contactless health monitoring, NLP bias detection, and ethical AI systems.</p>
                <p><a href="/articles/">Read my articles &rarr;</a></p>
            </div>
            <div class="about-image">
                <img src="/images/filippo.jpg" alt="Filippo Libardi" class="profile-img">
            </div>
        </div>
    </div>
</section>
```

> Note: this paragraph is ported verbatim from the current homepage About section, including the "co-founding ClusTEQ" wording. Rewriting that wording (ClusTEQ is a past role) is a content edit that belongs to the separate content-refresh sub-project, not this one.

- [ ] **Step 3: Shrink the Home page's About section to a teaser**

In `index.njk`, replace:

```html
    <!-- About Section -->
    <section id="about" class="wrapper">
        <div class="container">
            <div class="about-content">
                <div class="about-text">
                    <h2>About Me</h2>
                    <p>I'm an AI researcher and software engineer specializing in <strong>computer vision</strong>, <strong>deep learning</strong>, and <strong>graphics programming</strong>. My work bridges academic research with practical engineering, from developing neural networks for remote physiological monitoring to building custom game engines in DirectX and OpenGL.</p>
                    <p>Currently exploring <strong>procedural 3D generation</strong> and co-founding <strong>Pecus Chain</strong> and <strong>ClusTEQ</strong>. My research has been published in academic venues, focusing on contactless health monitoring, NLP bias detection, and ethical AI systems.</p>
                </div>
                <div class="about-image">
                    <img src="/images/filippo.jpg" alt="Filippo Libardi" class="profile-img">
                </div>
            </div>
        </div>
    </section>
```

With:

```html
    <!-- About Teaser Section -->
    <section id="about" class="wrapper">
        <div class="container">
            <div class="about-teaser">
                <p>I'm an AI researcher and software engineer specializing in <strong>computer vision</strong>, <strong>deep learning</strong>, and <strong>graphics programming</strong>.</p>
                <a href="/about/" class="icon-link">More about me &rarr;</a>
            </div>
        </div>
    </section>
```

- [ ] **Step 4: Run the check**

```bash
npm run build
test -f _site/about/index.html && echo "about page exists"
grep -q 'Read my articles' _site/about/index.html && echo "articles link ok"
grep -q 'ClusTEQ' _site/about/index.html && echo "clusteq mention ok"
grep -q 'about-teaser' _site/index.html && echo "home teaser ok"
grep -q 'More about me' _site/index.html && echo "teaser link ok"
```

Expected: all five `echo` lines print.

- [ ] **Step 5: Commit**

```bash
git add about.njk index.njk
git commit -m "$(cat <<'EOF'
Add dedicated About page, shrink Home's About to a teaser

Full bio moves to /about/ (with a link to the new Articles section);
Home keeps a one-line teaser linking out to it.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Articles page shell

**Files:**
- Create: `articles/index.njk`
- Create: `_includes/layouts/article.njk`

**Interfaces:**
- Consumes: `collections.articles` (from Task 1's `.eleventy.js` collection config), each item exposing `.url`, `.date`, `.data.title`, `.data.description`.
- Produces: route `/articles/`; `_includes/layouts/article.njk` layout for future posts under `articles/posts/*.md` (none exist yet — this task only builds the empty-state listing and the layout they'll use).

- [ ] **Step 1: Write the failing check**

```bash
npm run build
test -f _site/articles/index.html && echo FOUND || echo "MISSING (expected)"
```

Expected: `MISSING (expected)`.

- [ ] **Step 2: Create `_includes/layouts/article.njk`**

```njk
---
layout: base.njk
---
<article class="wrapper article-post">
    <div class="container">
        <p class="article-meta"><a href="/articles/">&larr; All articles</a> &middot; {{ page.date | readableDate }}</p>
        <h1>{{ title }}</h1>
        {{ content | safe }}
    </div>
</article>
```

- [ ] **Step 3: Create `articles/index.njk`**

```njk
---
layout: base.njk
title: Articles - Filippo Libardi
description: Writing on AI, graphics programming, and engineering from Filippo Maria Libardi.
navIndicator: Articles
---
<section id="articles-page" class="wrapper">
    <div class="container">
        <header class="section-header">
            <h1>Articles</h1>
            <p>Thoughts on AI, graphics programming, and engineering</p>
        </header>

        {% if collections.articles.length > 0 %}
        <div class="articles-list">
            {% for post in collections.articles %}
            <article class="article-summary">
                <p class="article-meta">{{ post.date | readableDate }}</p>
                <h3><a href="{{ post.url }}">{{ post.data.title }}</a></h3>
                <p>{{ post.data.description }}</p>
            </article>
            {% endfor %}
        </div>
        {% else %}
        <p class="articles-empty">No articles yet &mdash; check back soon.</p>
        {% endif %}
    </div>
</section>
```

- [ ] **Step 4: Run the check**

```bash
npm run build
test -f _site/articles/index.html && echo "articles page exists"
grep -q 'No articles yet' _site/articles/index.html && echo "empty state ok"
```

Expected: both `echo` lines print.

- [ ] **Step 5: Commit**

```bash
git add articles/index.njk _includes/layouts/article.njk
git commit -m "$(cat <<'EOF'
Add Articles page shell with empty-state listing

Builds the /articles/ listing page and the layout future posts
(articles/posts/*.md) will use; no posts exist yet.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Command palette

**Files:**
- Modify: `_includes/base.njk`
- Create: `assets/js/command-palette.js`

**Interfaces:**
- Consumes: `_data/nav.json` (Task 1), read at runtime via an inline `<script type="application/json" id="nav-data">` tag rendered with the `dump` filter (Task 1's `.eleventy.js`).
- Produces: DOM id `#command-palette` and its open/close behavior — no other task depends on this one's internals, only on the `#palette-trigger` button existing (already true from Task 1).

- [ ] **Step 1: Write the failing check**

```bash
npm run build
grep -q 'id="command-palette"' _site/index.html && echo FOUND || echo "MISSING (expected)"
```

Expected: `MISSING (expected)`.

- [ ] **Step 2: Add palette markup and nav-data script to `_includes/base.njk`**

Replace:

```njk
    </nav>

    <canvas id="particle-canvas"></canvas>
```

With:

```njk
    </nav>

    <div id="command-palette" class="command-palette" hidden>
        <div class="command-palette-backdrop"></div>
        <div class="command-palette-panel" role="dialog" aria-modal="true" aria-label="Site navigation">
            <input type="text" id="command-palette-input" class="command-palette-input" placeholder="Jump to..." autocomplete="off">
            <ul id="command-palette-results" class="command-palette-results"></ul>
        </div>
    </div>
    <script type="application/json" id="nav-data">{{ nav | dump | safe }}</script>

    <canvas id="particle-canvas"></canvas>
```

Replace:

```njk
    <script src="/assets/js/portfolio.js"></script>
</body>
```

With:

```njk
    <script src="/assets/js/portfolio.js"></script>
    <script src="/assets/js/command-palette.js"></script>
</body>
```

- [ ] **Step 3: Create `assets/js/command-palette.js`**

```js
(function () {
    const palette = document.getElementById('command-palette');
    const input = document.getElementById('command-palette-input');
    const results = document.getElementById('command-palette-results');
    const trigger = document.getElementById('palette-trigger');
    const navDataEl = document.getElementById('nav-data');

    const destinations = navDataEl ? JSON.parse(navDataEl.textContent) : [];
    let activeIndex = 0;

    function renderResults(items) {
        results.innerHTML = items
            .map((item, index) => `
                <li class="command-palette-result${index === activeIndex ? ' is-active' : ''}" data-href="${item.href}" data-index="${index}">
                    <span class="command-palette-label">${item.label}</span>
                    <span class="command-palette-type">${item.type}</span>
                </li>
            `)
            .join('');
    }

    function filterDestinations(query) {
        const normalized = query.trim().toLowerCase();
        if (!normalized) {
            return destinations;
        }
        return destinations.filter((item) => item.label.toLowerCase().includes(normalized));
    }

    function currentMatches() {
        return filterDestinations(input.value);
    }

    function openPalette() {
        palette.hidden = false;
        input.value = '';
        activeIndex = 0;
        renderResults(destinations);
        input.focus();
    }

    function closePalette() {
        palette.hidden = true;
    }

    function goTo(href) {
        window.location.href = href;
    }

    trigger.addEventListener('click', openPalette);

    document.addEventListener('keydown', (e) => {
        const isMac = navigator.platform.toUpperCase().includes('MAC');
        const modifierPressed = isMac ? e.metaKey : e.ctrlKey;

        if (modifierPressed && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            palette.hidden ? openPalette() : closePalette();
            return;
        }

        if (!palette.hidden && e.key === 'Escape') {
            closePalette();
        }
    });

    palette.querySelector('.command-palette-backdrop').addEventListener('click', closePalette);

    input.addEventListener('input', () => {
        activeIndex = 0;
        renderResults(currentMatches());
    });

    input.addEventListener('keydown', (e) => {
        const matches = currentMatches();
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, matches.length - 1);
            renderResults(matches);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            renderResults(matches);
        } else if (e.key === 'Enter' && matches[activeIndex]) {
            goTo(matches[activeIndex].href);
        }
    });

    results.addEventListener('click', (e) => {
        const item = e.target.closest('.command-palette-result');
        if (item) {
            goTo(item.dataset.href);
        }
    });
})();
```

- [ ] **Step 4: Run the check**

```bash
npm run build
grep -q 'id="command-palette"' _site/index.html && echo "palette markup ok"
grep -q 'id="nav-data"' _site/index.html && echo "nav-data script ok"
test -f _site/assets/js/command-palette.js && echo "js passthrough ok"
node -e "
const fs = require('fs');
const html = fs.readFileSync('_site/index.html', 'utf8');
const m = html.match(/<script type=\"application\/json\" id=\"nav-data\">(.*?)<\/script>/s);
if (!m) throw new Error('nav-data script not found');
const parsed = JSON.parse(m[1]);
console.log('nav-data JSON valid, entries:', parsed.length);
"
```

Expected: three `echo` lines, then `nav-data JSON valid, entries: 9`.

- [ ] **Step 5: Manual verification**

```bash
npm run serve
```

Open `http://localhost:8080`, press `Cmd/Ctrl+K`, type "Projects", press Enter — confirm it navigates to `/#projects`. Press `Cmd/Ctrl+K` again and `Escape` — confirm it closes. Stop the server (`Ctrl+C`).

- [ ] **Step 6: Commit**

```bash
git add _includes/base.njk assets/js/command-palette.js
git commit -m "$(cat <<'EOF'
Add Cmd/Ctrl+K command palette for site navigation

Fuzzy-filterable overlay driven by _data/nav.json, opened via
keyboard shortcut or the nav bar's palette-trigger button.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Scroll-spy nav indicator

**Files:**
- Create: `assets/js/scroll-spy.js`
- Modify: `_includes/base.njk`

**Interfaces:**
- Consumes: `#nav-indicator` span (Task 1), `<section id="...">` elements directly inside `<main>`.
- Produces: nothing consumed by later tasks — this is a leaf behavior.

- [ ] **Step 1: Write the failing check**

```bash
npm run build
test -f _site/assets/js/scroll-spy.js && echo FOUND || echo "MISSING (expected)"
```

Expected: `MISSING (expected)`.

- [ ] **Step 2: Create `assets/js/scroll-spy.js`**

```js
(function () {
    const indicator = document.getElementById('nav-indicator');
    const sections = document.querySelectorAll('main > section[id]');

    if (!indicator || sections.length < 2) {
        return;
    }

    const labels = {
        hero: 'Home',
        about: 'About',
        employment: 'Employment',
        projects: 'Projects',
        publications: 'Publications',
        'currently-working': 'Personal Projects',
        skills: 'Skills',
        contact: 'Contact'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                indicator.textContent = labels[entry.target.id] || entry.target.id;
            }
        });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach((section) => observer.observe(section));
})();
```

> Guarded by `sections.length < 2` so single-section pages (About, Articles) keep their static `navIndicator` front-matter value instead of being overridden.

- [ ] **Step 3: Add the script tag to `_includes/base.njk`**

Replace:

```njk
    <script src="/assets/js/portfolio.js"></script>
    <script src="/assets/js/command-palette.js"></script>
</body>
```

With:

```njk
    <script src="/assets/js/portfolio.js"></script>
    <script src="/assets/js/command-palette.js"></script>
    <script src="/assets/js/scroll-spy.js"></script>
</body>
```

- [ ] **Step 4: Run the check**

```bash
npm run build
test -f _site/assets/js/scroll-spy.js && echo "js passthrough ok"
grep -q 'scroll-spy.js' _site/index.html && echo "home script tag ok"
grep -q 'scroll-spy.js' _site/about/index.html && echo "about script tag ok"
node -e "require('assert')(require('fs').readFileSync('assets/js/scroll-spy.js', 'utf8').includes('IntersectionObserver')); console.log('observer present')"
```

Expected: all four lines print.

- [ ] **Step 5: Manual verification**

```bash
npm run serve
```

Open `http://localhost:8080`, scroll from Hero to Contact — confirm the nav-bar indicator label updates through each section name (Home → Employment → Projects → Publications → Personal Projects → Skills → Contact). Open `/about/` — confirm the indicator stays "About" while scrolling. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add assets/js/scroll-spy.js _includes/base.njk
git commit -m "$(cat <<'EOF'
Add scroll-spy nav indicator for the Home page

Nav bar now shows which section is in view while scrolling Home;
single-section pages keep their static page name.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Design tokens & font loading

**Files:**
- Modify: `assets/css/modern.css:6-39`
- Modify: `assets/css/modern.css:53-67`
- Modify: `_includes/base.njk`

**Interfaces:**
- Produces: CSS custom properties `--font-mono`, `--font-sans`, and the redefined `--accent-primary` / `--bg-*` / `--text-*` / `--border-color` / `--shadow` / `--overlay` values, consumed by every subsequent CSS task (7, 8, 9).

- [ ] **Step 1: Write the failing check**

```bash
grep -q -- '--font-mono' assets/css/modern.css && echo FOUND || echo "MISSING (expected)"
```

Expected: `MISSING (expected)`.

- [ ] **Step 2: Replace the theme tokens in `assets/css/modern.css`**

Replace (lines 6-39):

```css
:root {
    /* Dark Theme (Default) */
    --bg-primary: #0a0a0a;
    --bg-secondary: #1a1a1a;
    --bg-tertiary: #2a2a2a;
    --text-primary: #e0e0e0;
    --text-secondary: #a0a0a0;
    --text-muted: #707070;
    --accent-primary: #3b82f6;
    --accent-secondary: #60a5fa;
    --accent-hover: #2563eb;
    --border-color: #333;
    --shadow: rgba(0, 0, 0, 0.3);
    --overlay: rgba(0, 0, 0, 0.7);
    --gradient-start: #1e3a8a;
    --gradient-end: #3b82f6;
}

[data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5f5;
    --bg-tertiary: #e5e5e5;
    --text-primary: #1a1a1a;
    --text-secondary: #4a4a4a;
    --text-muted: #8a8a8a;
    --accent-primary: #3b82f6;
    --accent-secondary: #2563eb;
    --accent-hover: #1d4ed8;
    --border-color: #ddd;
    --shadow: rgba(0, 0, 0, 0.1);
    --overlay: rgba(255, 255, 255, 0.9);
    --gradient-start: #3b82f6;
    --gradient-end: #60a5fa;
}
```

With:

```css
:root {
    /* Dark Theme (Default) */
    --bg-primary: #0d0d0d;
    --bg-secondary: #161616;
    --bg-tertiary: #1f1f1f;
    --text-primary: #f2f2f0;
    --text-secondary: #b5b5b0;
    --text-muted: #7a7a76;
    --accent-primary: #ffb454;
    --accent-secondary: #ffb454;
    --accent-hover: #e69f3f;
    --border-color: #2e2e2c;
    --shadow: rgba(0, 0, 0, 0.3);
    --overlay: rgba(0, 0, 0, 0.75);
    --font-mono: 'JetBrains Mono', 'IBM Plex Mono', ui-monospace, Menlo, monospace;
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

[data-theme="light"] {
    --bg-primary: #fafaf8;
    --bg-secondary: #f0f0ee;
    --bg-tertiary: #e6e6e3;
    --text-primary: #16160f;
    --text-secondary: #4a4a45;
    --text-muted: #83837c;
    --accent-primary: #b5730f;
    --accent-secondary: #b5730f;
    --accent-hover: #8f5c0c;
    --border-color: #d8d8d3;
    --shadow: rgba(0, 0, 0, 0.08);
    --overlay: rgba(250, 250, 248, 0.9);
}
```

- [ ] **Step 3: Update typography rules in `assets/css/modern.css`**

Replace (around lines 53-67):

```css
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    transition: background-color 0.3s ease, color 0.3s ease;
    overflow-x: hidden;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
}
```

With:

```css
body {
    font-family: var(--font-sans);
    background-color: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    transition: background-color 0.3s ease, color 0.3s ease;
    overflow-x: hidden;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-mono);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
}
```

- [ ] **Step 4: Load the fonts in `_includes/base.njk`**

Replace:

```njk
    <link rel="icon" href="/images/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="/assets/css/modern.css">
</head>
```

With:

```njk
    <link rel="icon" href="/images/favicon.ico" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/modern.css">
</head>
```

- [ ] **Step 5: Run the check**

```bash
grep -q -- '--font-mono' assets/css/modern.css && echo "mono token ok"
grep -q -- '--accent-primary: #ffb454' assets/css/modern.css && echo "accent token ok"
npm run build
grep -q 'JetBrains+Mono' _site/index.html && echo "font link ok"
```

Expected: all three lines print.

- [ ] **Step 6: Commit**

```bash
git add assets/css/modern.css _includes/base.njk
git commit -m "$(cat <<'EOF'
Introduce monochrome color tokens and monospace/sans font pairing

Single accent color across both themes; JetBrains Mono reserved for
headings/labels, Inter for body copy.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Nav, command palette, hero, and button restyle

**Files:**
- Modify: `assets/css/modern.css:96-176` (nav + theme toggle)
- Modify: `assets/css/modern.css:190-323` (hero, buttons)
- Modify: `assets/js/portfolio.js:427` (nav id rename)
- Append to: `assets/css/modern.css` (command palette styles)

**Interfaces:**
- Consumes: tokens from Task 6.

- [ ] **Step 1: Write the failing check**

```bash
grep -q '#site-nav {' assets/css/modern.css && echo FOUND || echo "MISSING (expected)"
```

Expected: `MISSING (expected)`.

- [ ] **Step 2: Replace the nav CSS block**

Replace (lines 95-135):

```css
/* Navigation */
#nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: var(--bg-secondary);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px var(--shadow);
    z-index: 1000;
    transition: background-color 0.3s ease;
}

#nav .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

#nav .logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent-primary);
}

#nav .nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

#nav .nav-links a {
    color: var(--text-primary);
    font-weight: 500;
    transition: color 0.3s ease;
}

#nav .nav-links a:hover {
    color: var(--accent-primary);
}
```

With:

```css
/* Navigation */
#site-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    z-index: 1000;
}

#site-nav .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

#site-nav .logo {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
}

.nav-indicator {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.nav-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.palette-trigger {
    font-family: var(--font-mono);
    background: none;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-secondary);
    padding: 0.35rem 0.6rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease;
}

.palette-trigger:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
}
```

- [ ] **Step 3: Rename the nav id reference in `assets/js/portfolio.js`**

Replace:

```js
            const navHeight = document.getElementById('nav').offsetHeight;
```

With:

```js
            const navHeight = document.getElementById('site-nav').offsetHeight;
```

- [ ] **Step 4: Restyle the hero**

Replace:

```css
/* Hero Section */
#hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-top: 80px;
    background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%);
}

.hero-content {
    text-align: center;
    z-index: 1;
}

.hero-content h1 {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: #fff;
}

.typing-container {
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
}

#typed-text {
    font-size: 2rem;
    color: #fff;
    font-weight: 500;
}

.cursor {
    display: inline-block;
    font-size: 2rem;
    color: #fff;
    animation: blink 1s infinite;
    margin-left: 0.2rem;
}
```

With:

```css
/* Hero Section */
#hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-top: 80px;
    background-color: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
}

.hero-content {
    text-align: center;
    z-index: 1;
}

.hero-content h1 {
    font-family: var(--font-mono);
    font-size: 3.5rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.typing-container {
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
}

#typed-text {
    font-family: var(--font-mono);
    font-size: 1.5rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.cursor {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 1.5rem;
    color: var(--accent-primary);
    animation: blink 1s infinite;
    margin-left: 0.2rem;
}
```

- [ ] **Step 5: Fix the subtitle color (no longer on a colored gradient)**

Replace:

```css
.subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2rem;
}
```

With:

```css
.subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
}
```

- [ ] **Step 6: Restyle buttons (restrained hover, no colored-bg assumptions)**

Replace:

```css
/* Buttons */
.btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
}

.btn-primary {
    background-color: var(--accent-primary);
    color: #fff;
}

.btn-primary:hover {
    background-color: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px var(--shadow);
}

.btn-secondary {
    background-color: transparent;
    color: #fff;
    border: 2px solid #fff;
}

.btn-secondary:hover {
    background-color: #fff;
    color: var(--accent-primary);
}
```

With:

```css
/* Buttons */
.btn {
    display: inline-block;
    padding: 0.65rem 1.75rem;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-weight: 500;
    font-size: 0.9rem;
    transition: opacity 0.2s ease, border-color 0.2s ease;
    cursor: pointer;
    border: none;
}

.btn-primary {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
}

.btn-primary:hover {
    opacity: 0.85;
}

.btn-secondary {
    background-color: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: var(--text-primary);
    color: var(--bg-primary);
}
```

- [ ] **Step 7: Append command palette styles to `assets/css/modern.css`**

Add at the end of the file:

```css

/* Command Palette */
.command-palette {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 15vh;
}

.command-palette[hidden] {
    display: none;
}

.command-palette-backdrop {
    position: absolute;
    inset: 0;
    background-color: var(--overlay);
}

.command-palette-panel {
    position: relative;
    width: min(560px, 90vw);
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 20px 60px var(--shadow);
    overflow: hidden;
}

.command-palette-input {
    width: 100%;
    padding: 1rem 1.25rem;
    background: none;
    border: none;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 1rem;
}

.command-palette-input:focus {
    outline: none;
}

.command-palette-results {
    list-style: none;
    max-height: 320px;
    overflow-y: auto;
}

.command-palette-result {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    cursor: pointer;
    color: var(--text-secondary);
}

.command-palette-result.is-active,
.command-palette-result:hover {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
}

.command-palette-type {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
}
```

- [ ] **Step 8: Run the check**

```bash
grep -q '#site-nav {' assets/css/modern.css && echo "nav css ok"
grep -q "getElementById('site-nav')" assets/js/portfolio.js && echo "nav js ok"
! grep -q 'gradient-start' assets/css/modern.css && echo "gradient removed"
grep -q '.command-palette-panel' assets/css/modern.css && echo "palette css ok"
npm run build && echo "build ok"
```

Expected: all five lines print.

- [ ] **Step 9: Manual verification**

```bash
npm run serve
```

Open `http://localhost:8080` in both themes — confirm the nav bar, hero, and buttons read as monochrome + one accent color, and the command palette (Cmd/Ctrl+K) is styled consistently. Stop the server.

- [ ] **Step 10: Commit**

```bash
git add assets/css/modern.css assets/js/portfolio.js
git commit -m "$(cat <<'EOF'
Restyle nav, hero, buttons, and command palette to the new tokens

Removes the blue gradient hero and shadow/lift button hovers in
favor of the monochrome + single-accent, hairline-border look.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Content section restyle

**Files:**
- Modify: `assets/css/modern.css` (employment-card, project-card, tag, publication-card, form inputs, profile-img)
- Append to: `assets/css/modern.css` (articles/about-teaser styles)

**Interfaces:**
- Consumes: tokens from Task 6.
- Explicitly does NOT touch `.activity-card` / `.stats-banner` / `.language-badge` / `.skeleton-card` — that widget is rebuilt wholesale in the GitHub-activity-visualization sub-project, so restyling it now would be wasted work.

- [ ] **Step 1: Write the failing check**

```bash
grep -q 'articles-empty' assets/css/modern.css && echo FOUND || echo "MISSING (expected)"
```

Expected: `MISSING (expected)`.

- [ ] **Step 2: Restyle employment cards**

Replace:

```css
.employment-card {
    background-color: var(--bg-tertiary);
    border-radius: 12px;
    padding: 1.5rem;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 1.5rem;
    align-items: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.employment-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px var(--shadow);
}
```

With:

```css
.employment-card {
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 1.5rem;
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 1.5rem;
    align-items: center;
    transition: border-color 0.2s ease;
}

.employment-card:hover {
    border-color: var(--accent-primary);
}
```

- [ ] **Step 3: Restyle project cards and tags**

Replace:

```css
.project-card {
    background-color: var(--bg-tertiary);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
}

.project-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px var(--shadow);
}
```

With:

```css
.project-card {
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
    transition: border-color 0.2s ease;
    cursor: pointer;
}

.project-card:hover {
    border-color: var(--accent-primary);
}
```

Replace:

```css
.tag {
    background-color: var(--accent-primary);
    color: #fff;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}
```

With:

```css
.tag {
    font-family: var(--font-mono);
    background: none;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
}
```

- [ ] **Step 4: Restyle publication cards**

Replace:

```css
.publication-card {
    background-color: var(--bg-tertiary);
    border-radius: 12px;
    padding: 2rem;
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 2rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.publication-card:hover {
    transform: translateX(10px);
    box-shadow: 0 10px 30px var(--shadow);
}
```

With:

```css
.publication-card {
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 2rem;
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 2rem;
    transition: border-color 0.2s ease;
}

.publication-card:hover {
    border-color: var(--accent-primary);
}
```

- [ ] **Step 5: Restyle the profile image and contact form inputs**

Replace:

```css
.profile-img {
    width: 100%;
    border-radius: 16px;
    box-shadow: 0 10px 30px var(--shadow);
}
```

With:

```css
.profile-img {
    width: 100%;
    border-radius: 4px;
    border: 1px solid var(--border-color);
}
```

Replace:

```css
.form-group input,
.form-group textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.3s ease;
}
```

With:

```css
.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: transparent;
    color: var(--text-primary);
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s ease;
}
```

- [ ] **Step 6: Append Articles and About-teaser styles**

Add at the end of `assets/css/modern.css`:

```css

/* Articles page */
.articles-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.article-summary {
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1.5rem;
}

.article-summary h3 {
    margin-bottom: 0.5rem;
}

.article-meta {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
}

.articles-empty {
    color: var(--text-secondary);
    text-align: center;
    padding: 3rem 0;
}

/* About teaser on Home */
.about-teaser {
    text-align: center;
}

.about-teaser p {
    max-width: 640px;
    margin: 0 auto 1rem;
    color: var(--text-secondary);
}
```

- [ ] **Step 7: Run the check**

```bash
grep -q 'articles-empty' assets/css/modern.css && echo "articles css ok"
! grep -q 'translateY(-10px)' assets/css/modern.css && echo "project shadow removed"
! grep -q 'translateX(10px)' assets/css/modern.css && echo "publication shadow removed"
npm run build && echo "build ok"
```

Expected: all four lines print.

- [ ] **Step 8: Commit**

```bash
git add assets/css/modern.css
git commit -m "$(cat <<'EOF'
Restyle content cards to hairline borders

Employment/project/publication cards, tags, the profile image, and
form inputs drop shadows and lift-on-hover for flat, bordered
treatment consistent with the new visual language. The GitHub
activity widget is intentionally left untouched (rebuilt in a
separate sub-project).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Particle background and skills carousel restyle

**Files:**
- Modify: `assets/js/portfolio.js` (Particle class, particle count)
- Modify: `assets/css/modern.css` (`#particle-canvas`, `.skill-tag`, `.skill-tag .skill-icon`)

**Interfaces:**
- Consumes: no new interfaces; purely visual.

- [ ] **Step 1: Write the failing check**

```bash
grep -q 'grayscale(1)' assets/css/modern.css && echo FOUND || echo "MISSING (expected)"
```

Expected: `MISSING (expected)`.

- [ ] **Step 2: Restyle particles in `assets/js/portfolio.js`**

Replace:

```js
    draw() {
        const theme = htmlElement.getAttribute('data-theme');
        ctx.fillStyle = theme === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
```

With:

```js
    draw() {
        const theme = htmlElement.getAttribute('data-theme');
        ctx.fillStyle = theme === 'dark' ? 'rgba(180, 180, 176, 0.35)' : 'rgba(80, 80, 76, 0.25)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
```

Replace:

```js
            if (distance < 100) {
                const theme = htmlElement.getAttribute('data-theme');
                ctx.strokeStyle = theme === 'dark' 
                    ? `rgba(59, 130, 246, ${0.2 - distance / 500})` 
                    : `rgba(59, 130, 246, ${0.1 - distance / 1000})`;
```

With:

```js
            if (distance < 100) {
                const theme = htmlElement.getAttribute('data-theme');
                ctx.strokeStyle = theme === 'dark' 
                    ? `rgba(180, 180, 176, ${0.15 - distance / 700})` 
                    : `rgba(80, 80, 76, ${0.08 - distance / 1200})`;
```

Replace:

```js
const particlesArray = [];
const numberOfParticles = 100;
```

With:

```js
const particlesArray = [];
const numberOfParticles = 45;
```

- [ ] **Step 3: Lower particle canvas opacity**

Replace:

```css
#particle-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.3;
}
```

With:

```css
#particle-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.25;
}
```

- [ ] **Step 4: Desaturate skills carousel icons**

Replace:

```css
.skill-tag {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
}
```

With:

```css
.skill-tag {
    background: none;
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: border-color 0.2s ease, color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
}
```

Replace:

```css
.skill-tag .skill-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
    transition: transform 0.3s ease;
    font-size: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
```

With:

```css
.skill-tag .skill-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
    filter: grayscale(1);
    transition: transform 0.3s ease, filter 0.3s ease;
    font-size: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
```

Replace:

```css
.skill-tag:hover {
    background-color: var(--accent-primary);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px var(--shadow);
}

.skill-tag:hover .skill-icon {
    transform: scale(1.2) rotate(5deg);
}
```

With:

```css
.skill-tag:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
}

.skill-tag:hover .skill-icon {
    transform: scale(1.15);
    filter: grayscale(0.4);
}
```

- [ ] **Step 5: Run the check**

```bash
grep -q 'grayscale(1)' assets/css/modern.css && echo "icon grayscale ok"
grep -q 'const numberOfParticles = 45' assets/js/portfolio.js && echo "particle count ok"
grep -q 'rgba(180, 180, 176' assets/js/portfolio.js && echo "particle color ok"
npm run build && echo "build ok"
```

Expected: all four lines print.

- [ ] **Step 6: Manual verification**

```bash
npm run serve
```

Open `http://localhost:8080` — confirm the particle background reads as subtle gray texture (not blue), and skill icons in the carousel are grayscale at rest, gaining a slight accent tint on hover. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add assets/js/portfolio.js assets/css/modern.css
git commit -m "$(cat <<'EOF'
Desaturate particle background and skills carousel

Both features stay, but the particle canvas is now monochrome and
lower-density, and skill icons are grayscale with a subtle accent
tint on hover instead of full brand colors.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Build & deploy workflow, README update

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: `npm run build` (Task 1) producing `_site/`.

- [ ] **Step 1: Write the failing check**

```bash
test -f .github/workflows/deploy.yml && echo FOUND || echo "MISSING (expected)"
```

Expected: `MISSING (expected)`.

- [ ] **Step 2: Create `.github/workflows/deploy.yml`**

```yaml
name: Build and Deploy

on:
  push:
    branches: [gh-pages]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          lfs: true
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Update the Tech Stack section of `README.md`**

Replace:

```
This is a modern single-page portfolio built with:
- **Pure HTML/CSS/JavaScript** (no frameworks)
- **Dark/Light theme toggle** with localStorage persistence
- **Dynamic GitHub integration** showing recent activity
- **Scroll animations** using Intersection Observer API
- **Particle background** with Canvas API
- **Responsive design** for all devices
```

With:

```
This is a multi-page portfolio (Home, About, Articles) built with:
- **Eleventy** as a zero-runtime static site generator (build-time only — the browser still gets plain HTML/CSS/JS)
- **Cmd/Ctrl+K command palette** for navigation, backed by a single `_data/nav.json` source of truth
- **Dark/Light theme toggle** with localStorage persistence
- **Dynamic GitHub integration** showing recent activity
- **Scroll animations** and a scroll-spy nav indicator using Intersection Observer API
- **Particle background** with Canvas API
- **Responsive design** for all devices
```

- [ ] **Step 4: Update the Project Structure section of `README.md`**

Replace:

```
## 📁 Project Structure

```
Portfolio/
├── index.html                  # Main portfolio page
├── assets/
│   ├── css/
│   │   ├── modern.css         # Main stylesheet with theming
│   │   └── font-awesome.min.css
│   └── js/
│       ├── portfolio.js       # All interactive functionality
│       └── util.js
├── images/                     # Project screenshots and assets
├── Curriculum/
│   ├── papers/                # Academic publication PDFs
│   └── CV.pdf
├── Projects/                   # Project files and documentation
├── archive/                    # Old portfolio versions
└── README.md
```
```

With:

```
## 📁 Project Structure

```
Portfolio/
├── .eleventy.js                # Eleventy config (passthrough copies, collections, filters)
├── _includes/
│   ├── base.njk                 # Shared layout: nav, command palette, footer
│   └── layouts/article.njk      # Layout for individual article posts
├── _data/nav.json               # Single source of truth for nav + command palette links
├── index.njk                    # Home page
├── about.njk                    # About page
├── articles/
│   ├── index.njk                 # Articles listing
│   └── posts/                     # Individual article markdown files (none yet)
├── assets/
│   ├── css/modern.css           # Main stylesheet with theming
│   └── js/
│       ├── portfolio.js          # Theme toggle, typing animation, particles, forms
│       ├── command-palette.js     # Cmd/Ctrl+K navigation palette
│       └── scroll-spy.js          # Home page nav indicator
├── images/                      # Project screenshots and assets
├── Curriculum/
│   ├── papers/                 # Academic publication PDFs
│   └── CV.pdf
├── Projects/                    # Project files and documentation
└── README.md
```
```

- [ ] **Step 5: Update the Deployment section of `README.md`**

Replace:

```
## 🚀 Deployment

### GitHub Pages
1. Push changes to the `gh-pages` branch
2. Ensure `CNAME` file contains: `filippolibardi.co.uk`
3. GitHub Pages will auto-deploy

### Local Development
Simply open `index.html` in a browser. No build process required.

For live reload during development, use:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```
```

With:

```
## 🚀 Deployment

### GitHub Pages
1. Push to the `gh-pages` branch — `.github/workflows/deploy.yml` builds the site with Eleventy and deploys the `_site/` output to GitHub Pages automatically.
2. One-time setup: in the repo's Settings → Pages, set **Source** to "GitHub Actions" (instead of "Deploy from a branch").
3. `CNAME` passes through the build unchanged; it must contain `filippolibardi.co.uk`.

### Local Development
```bash
npm install
npm run serve   # http://localhost:8080, rebuilds on file change
```

To produce a production build without serving:
```bash
npm run build   # outputs to _site/
```
```

- [ ] **Step 6: Update the Performance section's dependency claim in `README.md`**

Replace:

```
- **No dependencies**: Zero npm packages, no jQuery
```

With:

```
- **Minimal dependencies**: Eleventy is the only build-time dependency; zero client-side runtime frameworks
```

- [ ] **Step 7: Run the check**

```bash
test -f .github/workflows/deploy.yml && echo "workflow exists"
grep -q 'upload-pages-artifact' .github/workflows/deploy.yml && echo "artifact step ok"
grep -q 'Eleventy' README.md && echo "readme mentions eleventy"
npm run build && test -d _site && echo "full build ok"
test -f _site/index.html && test -f _site/about/index.html && test -f _site/articles/index.html && echo "all three pages built"
```

Expected: all five lines print.

- [ ] **Step 8: Commit**

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "$(cat <<'EOF'
Add GitHub Actions build/deploy workflow, update README

Replaces the branch-is-the-output deploy model with a CI build that
runs Eleventy and publishes _site/ via GitHub Pages' native Actions
deployment. Requires a one-time Settings > Pages source change to
"GitHub Actions" (documented in README; not done by this commit).

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 9: Final full-site manual verification**

```bash
npm run serve
```

Walk through: Home page (all sections present, nav indicator updates on scroll), `/about/` (ClusTEQ mention present, Articles link works), `/articles/` (empty-state message shows), Cmd/Ctrl+K palette from all three pages, theme toggle on all three pages, particle background and skills carousel both rendering, at mobile (375px) and desktop widths. Stop the server.

Then tell the user: the repository Settings → Pages source must be switched to "GitHub Actions" before the next push will actually deploy — this is a one-time manual step in GitHub's UI that this plan does not perform.

---

## Post-plan note

`assets/css/main.css`, `assets/js/main.js`, `assets/js/util.js`, `assets/js/jquery.scrolly.min.js`, `assets/css/font-awesome.min.css`, and `assets/sass/**` are leftovers from a pre-"modern" template and are not referenced by `index.njk`/`about.njk`/`articles/index.njk` or `base.njk`. They're unrelated to this redesign and are left in place; consider a separate cleanup pass to remove them.
