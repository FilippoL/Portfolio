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
