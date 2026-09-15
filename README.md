# Filippo Libardi - Portfolio Website

Modern, responsive portfolio showcasing AI research, graphics programming, and game development work.

## 🚀 Live Site

Visit the portfolio at: [filippolibardi.co.uk](https://filippolibardi.co.uk)

## 📋 Overview

This is a multi-page portfolio (Home, About, Articles) built with:
- **Eleventy** as a zero-runtime static site generator (build-time only — the browser still gets plain HTML/CSS/JS)
- **Cmd/Ctrl+K command palette** for navigation, backed by a single `_data/nav.json` source of truth
- **Dark/Light theme toggle** with localStorage persistence
- **Dynamic GitHub integration** showing recent activity
- **Scroll animations** and a scroll-spy nav indicator using Intersection Observer API
- **Particle background** with Canvas API
- **Responsive design** for all devices

## 🎯 Featured Projects

- **NrPPG-NNET**: Master's thesis on remote heart rate estimation via neural networks
- **FaceManager**: Real-time face detection and tracking system
- **Multimedia Retrieval**: Content-based search engine
- **Unity Hunting Game**: AI steering behaviors and FSM implementation
- **Zombie Holocaust**: Custom DirectX 11 game engine
- **Bremen Hackathon 2019**: 48-hour collaborative challenge

## 📚 Academic Publications

- "NrPPG-NNET: End to End Deep Learning for Remote Heart Rate Estimation" (2021)
- "Visualising Language Bias Over Time Using Reddit Data" (2021)
- "The Rise of Decentralised Systems" (2020)

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (Custom Properties for theming)
- Vanilla JavaScript (ES6+)

### APIs
- GitHub REST API (recent activity)
- Formspree (contact form)

### Features
- Theme persistence with localStorage
- GitHub activity caching (1-hour TTL)
- Typing animation effect
- Particle background animation
- Scroll-triggered animations
- Smooth scroll navigation
- Responsive grid layouts

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

## 🎨 Customization

### Theme Colors
Edit CSS custom properties in `assets/css/modern.css`:
```css
:root {
    --accent-primary: #3b82f6;    /* Primary blue */
    --accent-hover: #2563eb;      /* Hover state */
    /* ... more variables */
}
```

### GitHub Integration
Update username in `assets/js/portfolio.js`:
```javascript
const GITHUB_USERNAME = 'FilippoL';
```

### Contact Form
Update Formspree endpoint in `index.html`:
```html
<form method="POST" action="https://formspree.io/f/your-email">
```

## 🖼️ Image Placeholders

The following placeholder images need to be added to the `images/` directory:
- `rppg-project.jpg` - rPPG neural network visualization
- `face-manager.jpg` - Face detection system screenshot
- `multimedia-retrieval.jpg` - Search interface screenshot
- `hackathon.jpg` - Hackathon project photo

Existing images are used for Unity Hunting Game and Zombie Holocaust.

## 📄 Publication PDFs

Add your publication PDFs to `Curriculum/papers/`:
- `libardi_2021_nrppg.pdf`
- `mattas_libardi_2021_bias.pdf`
- `libardi_2020_decentralised.pdf`

Download from [ResearchGate](https://www.researchgate.net/profile/Filippo-Libardi/research)

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

## ⚡ Performance

- **Minimal dependencies**: Eleventy is the only build-time dependency; zero client-side runtime frameworks
- **Lazy loading**: Images load on demand
- **API caching**: GitHub data cached for 1 hour
- **Optimized animations**: 60fps with requestAnimationFrame
- **Minimal CSS**: Single stylesheet, no preprocessor needed

## 🔒 Privacy & Analytics

- No tracking cookies
- No analytics (add Google Analytics if desired)
- Contact form uses Formspree (GDPR compliant)

## 📝 License

Portfolio template structure: Custom design
Content & Projects: © 2026 Filippo Maria Libardi

## 👤 Contact

- **Email**: pippo.libardi@gmail.com
- **GitHub**: [@FilippoL](https://github.com/FilippoL)
- **ResearchGate**: [Filippo Libardi](https://www.researchgate.net/profile/Filippo-Libardi)
- **LinkedIn**: [Filippo Libardi](https://linkedin.com/in/filippo-libardi)

---

Built with ❤️ for AI and graphics programming • Last updated: January 2026
