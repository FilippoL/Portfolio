// ===================================
// GitHub Activity Heatmap
// ===================================
(function () {
    const GITHUB_USERNAME = 'FilippoL';
    const CACHE_KEY = 'github_heatmap_cache_v1';
    const CACHE_TIMESTAMP_KEY = 'github_heatmap_timestamp_v1';
    const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
    const WEEKS = 13; // ~90 days, matches the Events API's practical window

    const container = document.getElementById('github-activity');
    if (!container) {
        return;
    }

    const timestampElement = document.getElementById('activity-timestamp');
    const refreshButton = document.getElementById('refresh-activity');

    function dateKey(date) {
        return date.toISOString().slice(0, 10);
    }

    function buildEmptyDayMap() {
        const days = new Map();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 0; i < WEEKS * 7; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            days.set(dateKey(d), { commits: 0, prs: 0 });
        }
        return days;
    }

    async function fetchHeatmapData() {
        const cached = localStorage.getItem(CACHE_KEY);
        const cachedAt = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const now = Date.now();

        if (cached && cachedAt && (now - parseInt(cachedAt, 10)) < CACHE_DURATION) {
            return { days: new Map(JSON.parse(cached)), fromCache: true, fetchedAt: new Date(parseInt(cachedAt, 10)) };
        }

        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`);
        if (!response.ok) {
            throw new Error('GitHub events request failed');
        }
        const events = await response.json();
        const days = buildEmptyDayMap();

        events.forEach((event) => {
            const key = dateKey(new Date(event.created_at));
            if (!days.has(key)) {
                return;
            }
            const entry = days.get(key);
            if (event.type === 'PushEvent') {
                entry.commits += (event.payload && event.payload.commits) ? event.payload.commits.length : 0;
            } else if (event.type === 'PullRequestEvent' && event.payload && event.payload.action === 'opened') {
                entry.prs += 1;
            }
        });

        const serializable = JSON.stringify(Array.from(days.entries()));
        localStorage.setItem(CACHE_KEY, serializable);
        localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());

        return { days, fromCache: false, fetchedAt: new Date(now) };
    }

    function intensityBucket(count) {
        if (count <= 0) return 0;
        if (count <= 2) return 1;
        if (count <= 4) return 2;
        if (count <= 7) return 3;
        return 4;
    }

    function computeStreak(orderedDays) {
        let streak = 0;
        for (let i = orderedDays.length - 1; i >= 0; i--) {
            if (orderedDays[i].commits > 0) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    function render(days) {
        const orderedKeys = Array.from(days.keys()).sort();
        const orderedDays = orderedKeys.map((key) => ({ key, ...days.get(key) }));

        // Pad the front so the grid starts on a Sunday, like GitHub's calendar.
        const firstDay = new Date(orderedKeys[0]);
        const leadingBlanks = firstDay.getDay();

        const totalCommits = orderedDays.reduce((sum, d) => sum + d.commits, 0);
        const totalPRs = orderedDays.reduce((sum, d) => sum + d.prs, 0);
        const streak = computeStreak(orderedDays);
        const activeDays = orderedDays.filter((d) => d.commits > 0).length;

        const cells = [];
        for (let i = 0; i < leadingBlanks; i++) {
            cells.push('<span class="heatmap-cell heatmap-cell--blank" aria-hidden="true"></span>');
        }
        orderedDays.forEach((day, index) => {
            const bucket = intensityBucket(day.commits);
            const label = day.commits === 0
                ? `No commits on ${day.key}`
                : `${day.commits} commit${day.commits === 1 ? '' : 's'} on ${day.key}${day.prs > 0 ? ` · ${day.prs} PR${day.prs === 1 ? '' : 's'} opened` : ''}`;
            cells.push(
                `<span class="heatmap-cell heatmap-cell--${bucket}" style="transition-delay:${Math.min(index, 90) * 6}ms" title="${label}" data-count="${day.commits}"></span>`
            );
        });

        container.innerHTML = `
            <p class="heatmap-prompt">$ git log --since="${WEEKS * 7} days ago" --oneline | wc -l &nbsp;<span class="heatmap-prompt-result">${totalCommits}</span></p>
            <div class="heatmap-grid" role="img" aria-label="GitHub commit activity for the last ${WEEKS * 7} days">
                ${cells.join('')}
            </div>
            <div class="heatmap-summary">
                <span>${activeDays} active day${activeDays === 1 ? '' : 's'}</span>
                <span>${totalPRs} PR${totalPRs === 1 ? '' : 's'} opened</span>
                <span>${streak > 0 ? `🔥 ${streak}-day streak` : 'no active streak right now'}</span>
                <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="icon-link">Full profile &rarr;</a>
            </div>
        `;

        // Stagger the reveal so the grid "types itself in" instead of popping.
        requestAnimationFrame(() => {
            container.querySelectorAll('.heatmap-cell:not(.heatmap-cell--blank)').forEach((cell) => {
                cell.classList.add('is-visible');
            });
        });
    }

    function renderFallback() {
        container.innerHTML = `
            <p class="heatmap-prompt">$ git log --oneline</p>
            <p class="heatmap-error">Couldn't reach the GitHub API right now. <a href="https://github.com/${GITHUB_USERNAME}" target="_blank">Check the profile directly</a>.</p>
        `;
    }

    function updateTimestamp(date) {
        if (timestampElement) {
            timestampElement.textContent = `Last updated: ${date.toLocaleString()}`;
        }
    }

    function load() {
        fetchHeatmapData()
            .then(({ days, fetchedAt }) => {
                render(days);
                updateTimestamp(fetchedAt);
            })
            .catch((error) => {
                console.error('Error fetching GitHub heatmap data:', error);
                renderFallback();
            });
    }

    load();

    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(CACHE_TIMESTAMP_KEY);
            container.innerHTML = '<p class="heatmap-prompt">Loading&hellip;</p>';
            load();
        });
    }
})();
