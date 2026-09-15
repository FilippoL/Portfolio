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
