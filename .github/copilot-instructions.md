# Portfolio Website - AI Agent Instructions

## Project Overview
This is a static personal portfolio website built with the "Miniport" HTML5 UP template, showcasing game development and software projects. The site is hosted on GitHub Pages at `filippolibardi.co.uk`.

## Architecture & File Structure

### Core Pages
- `being_maintained.html` - Primary portfolio page with full project showcase
- `index.html` - Simple maintenance placeholder page
- Both files are complete standalone HTML documents (not templates)

### Assets Organization
- `assets/css/main.css` - Compiled from SCSS, do NOT edit directly
- `assets/sass/main.scss` - Source styles using Skel framework
- `assets/sass/libs/` - Skel framework utilities (_vars, _mixins, _functions, _skel)
- `assets/js/main.js` - jQuery-based interactions using Skel breakpoints and scrolly plugin

### Projects
- `Projects/` contains project builds and documentation
- Project cards in HTML link to: online versions (WebGL builds), downloadable executables (.zip), GitHub repos, and PDFs
- Each project has multiple CTA buttons styled with inline background colors

### Memory Bank
- `memory-bank/` contains AI agent context files (activeContext, architect, decisionLog, etc.)
- These are project management artifacts, not part of the website itself

## Key Technical Patterns

### Responsive Design with Skel Framework
The site uses Skel (legacy framework) with defined breakpoints:
- `desktop: '(min-width: 737px)'`
- `tablet: '(min-width: 737px) and (max-width: 1200px)'`
- `mobile: '(max-width: 736px)'`

Grid system uses class syntax like `4u 12u(mobile)` meaning "4 units on desktop, 12 units on mobile"

### Styling Approach
- SCSS source files compile to CSS (no build process in repo, manual compilation)
- Heavy use of inline styles for project-specific button colors (e.g., `background-color:#ff0000`)
- IE8/IE9 compatibility with conditional stylesheets and polyfills

### Project Card Structure
Standard pattern for each project:
```html
<article class="box style1">
    <a href="[link]" class="image featured"><img src="images/[project].png" /></a>
    <h3>[Project Name]</h3>
    <a href="[link]" class="button" style="padding: 0em 0.5em 0em 0.5em; background-color:#ff0000">[Action]</a>
    <p>[Description]</p>
</article>
```

## Development Workflow

### CSS Changes
1. Edit `assets/sass/main.scss` or files in `assets/sass/libs/`
2. Compile SCSS to CSS manually (no package.json or build scripts present)
3. Never directly edit `assets/css/main.css`

### Adding Projects
1. Add project files to `Projects/[ProjectName]/`
2. Add project images to `images/` directory
3. Add project card to `being_maintained.html` in the `#portfolio` section
4. Follow the existing grid layout pattern with `row` and column classes

### Testing
- Open HTML files directly in browser (no server required for basic testing)
- Test responsive breakpoints at 736px and 1200px widths
- Verify IE compatibility if needed (IE polyfills in `assets/js/ie/`)

## Important Conventions

### HTML Structure
- Navigation uses anchor links (`#top`, `#portfolio`, `#contact`)
- Sections wrapped in `<div class="wrapper style[1-4]">` for different background styles
- Container classes control responsive widths

### External Links
- GitHub repos linked with `target="_blank"`
- Contact form uses Formspree service: `action="https://formspree.io/pippo.libardi@gmail.com"`

### License
- HTML5 UP template uses CCA 3.0 license (see LICENSE.txt)
- Attribution required for template usage

## Critical Files
- [being_maintained.html](being_maintained.html) - Main portfolio content
- [assets/sass/main.scss](assets/sass/main.scss) - Style source of truth
- [assets/js/main.js](assets/js/main.js) - Interactive behaviors (scrolly, prioritize)

## Common Tasks

**Add a new project:** Insert `<article class="box style1">` block in [being_maintained.html](being_maintained.html#L53) portfolio section, following the 3-column grid pattern with `4u 12u(mobile)` classes.

**Update contact email:** Modify form action in [being_maintained.html](being_maintained.html) contact section (search for `formspree.io`).

**Modify styling:** Edit SCSS files in `assets/sass/`, then compile to CSS. Variables are in `assets/sass/libs/_vars.scss`.
