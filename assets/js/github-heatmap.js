// ===================================
// GitHub Activity Heatmap - reveal animation
// ===================================
// The heatmap itself is rendered server-side at build time from
// _data/github-activity.json (refreshed daily by a GitHub Action).
// This script only adds a staggered fade-in for JS-enabled visitors;
// without it, the grid is fully visible immediately.
(function () {
    const grid = document.querySelector('#github-activity .heatmap-grid');
    if (!grid) {
        return;
    }

    const cells = grid.querySelectorAll('.heatmap-cell');
    cells.forEach((cell) => cell.classList.add('pre-reveal'));

    // setTimeout (rather than a single requestAnimationFrame) so the reveal
    // still fires in backgrounded/throttled tabs, where rAF can stall indefinitely.
    setTimeout(() => {
        cells.forEach((cell) => cell.classList.add('is-visible'));
    }, 50);
})();
