# Filippo Libardi - Portfolio Website

Modern, responsive portfolio showcasing AI research, graphics programming, and game development work.

## 🚀 Live Site

Visit the portfolio at: [filippolibardi.co.uk](https://filippolibardi.co.uk)

## 📋 Overview

This is a modern single-page portfolio built with:
- **Pure HTML/CSS/JavaScript** (no frameworks)
- **Dark/Light theme toggle** with localStorage persistence
- **Dynamic GitHub integration** showing recent activity
- **Scroll animations** using Intersection Observer API
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

## ⚡ Performance

- **No dependencies**: Zero npm packages, no jQuery
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
