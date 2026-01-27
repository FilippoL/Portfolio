// ===================================
// Modern Portfolio JavaScript
// ===================================

// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Initialize theme from localStorage or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ===================================
// Typing Animation
// ===================================
const phrases = [
    'AI Researcher & Graphics Programmer',
    'Deep Learning Enthusiast',
    'Custom Engine Developer',
    'Computer Vision Specialist',
    'Procedural Generation Explorer'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextElement = document.getElementById('typed-text');
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeText() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let timeout = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
        timeout = pauseTime;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    setTimeout(typeText, timeout);
}

// Start typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeText, 500);
});

// ===================================
// Particle Background Animation
// ===================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }

    draw() {
        const theme = htmlElement.getAttribute('data-theme');
        ctx.fillStyle = theme === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particlesArray = [];
const numberOfParticles = 100;

function initParticles() {
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Connect particles with lines
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const theme = htmlElement.getAttribute('data-theme');
                ctx.strokeStyle = theme === 'dark' 
                    ? `rgba(59, 130, 246, ${0.2 - distance / 500})` 
                    : `rgba(59, 130, 246, ${0.1 - distance / 1000})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ===================================
// Intersection Observer for Scroll Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
});

// ===================================
// GitHub Activity Fetcher
// ===================================
const GITHUB_USERNAME = 'FilippoL';
const CACHE_KEY = 'github_activity_cache';
const CACHE_TIMESTAMP_KEY = 'github_activity_timestamp';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

async function fetchGitHubActivity() {
    const activityContainer = document.getElementById('github-activity');
    const timestampElement = document.getElementById('activity-timestamp');
    
    try {
        // Check cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const now = Date.now();
        
        if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_DURATION) {
            const data = JSON.parse(cachedData);
            renderActivity(data);
            updateTimestamp(new Date(parseInt(cacheTimestamp)));
            return;
        }
        
        // Fetch all repos for the user
        const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        
        if (!reposResponse.ok) {
            throw new Error('GitHub API request failed');
        }
        
        const allRepos = await reposResponse.json();
        
        // Calculate statistics
        const totalStars = allRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
        const totalForks = allRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
        const publicRepos = allRepos.filter(repo => !repo.fork).length;
        
        // Language distribution
        const languageCount = {};
        allRepos.forEach(repo => {
            if (repo.language && !repo.fork) {
                languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
            }
        });
        const topLanguages = Object.entries(languageCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([lang]) => lang);
        
        // Get last 4 updated repos (excluding forks if desired)
        const recentRepos = allRepos
            .filter(repo => !repo.fork) // Optional: exclude forks
            .slice(0, 4)
            .map(repo => ({
                name: repo.name,
                fullName: repo.name,
                url: repo.html_url,
                description: repo.description || 'No description available',
                language: repo.language || 'Unknown',
                stars: repo.stargazers_count || 0,
                updatedAt: new Date(repo.updated_at)
            }));
        
        // Fetch recent commit for each repo
        const repoDetails = await Promise.all(
            recentRepos.map(async (repo) => {
                try {
                    const commitsResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=1`);
                    if (commitsResponse.ok) {
                        const commits = await commitsResponse.json();
                        if (commits && commits.length > 0) {
                            return {
                                ...repo,
                                lastCommitMessage: commits[0].commit.message.split('\n')[0], // First line only
                                lastCommitDate: new Date(commits[0].commit.committer.date)
                            };
                        }
                    }
                    return {
                        ...repo,
                        lastCommitMessage: 'Recent activity',
                        lastCommitDate: repo.updatedAt
                    };
                } catch (error) {
                    console.error(`Error fetching commits for ${repo.name}:`, error);
                    return {
                        ...repo,
                        lastCommitMessage: 'Recent activity',
                        lastCommitDate: repo.updatedAt
                    };
                }
            })
        );
        
        const activityData = {
            repos: repoDetails,
            totalStars: totalStars,
            publicRepos: publicRepos,
            totalForks: totalForks,
            topLanguages: topLanguages
        };
        
        // Cache the results
        localStorage.setItem(CACHE_KEY, JSON.stringify(activityData));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
        
        renderActivity(activityData);
        updateTimestamp(new Date());
        
    } catch (error) {
        console.error('Error fetching GitHub activity:', error);
        renderFallback(activityContainer);
    }
}

function renderActivity(data) {
    const activityContainer = document.getElementById('github-activity');
    
    // Handle both old cached format (array) and new format (object with repos and totalStars)
    const repos = Array.isArray(data) ? data : data.repos;
    const totalStars = data.totalStars || 0;
    const publicRepos = data.publicRepos || 0;
    const totalForks = data.totalForks || 0;
    const topLanguages = data.topLanguages || [];
    
    if (!repos || repos.length === 0) {
        renderFallback(activityContainer);
        return;
    }
    
    const html = `
        ${!Array.isArray(data) ? `
            <div class="stats-banner">
                <div class="stat-item">
                    <span class="stat-number">★ ${totalStars}</span>
                    <span class="stat-label">Total Stars</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${publicRepos}</span>
                    <span class="stat-label">Public Repos</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${totalForks}</span>
                    <span class="stat-label">Total Forks</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${topLanguages.join(', ')}</span>
                    <span class="stat-label">Top Languages</span>
                </div>
            </div>
        ` : ''}
        ${repos.map(repo => {
            const timeAgo = getTimeAgo(repo.lastCommitDate || repo.updatedAt || repo.date);
            return `
                <article class="activity-card">
                    <h3>
                        <a href="${repo.url}" target="_blank">${repo.fullName}</a>
                        ${repo.stars > 0 ? `<span class="star-count">★ ${repo.stars}</span>` : ''}
                    </h3>
                    <span class="language-badge">${repo.language}</span>
                    <p class="last-updated">Last commit ${timeAgo}</p>
                    <p class="description">${repo.description}</p>
                    <p class="commit-preview">"${repo.lastCommitMessage}"</p>
                </article>
            `;
        }).join('')}
    `;
    
    activityContainer.innerHTML = html;
}

function renderFallback(container) {
    container.innerHTML = `
        <div style="text-align: center; grid-column: 1 / -1;">
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                Unable to load recent activity. Check my latest work on GitHub.
            </p>
            <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="btn btn-outline">
                Visit GitHub Profile
            </a>
        </div>
    `;
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    
    return 'just now';
}

function updateTimestamp(date) {
    const timestampElement = document.getElementById('activity-timestamp');
    timestampElement.textContent = `Last updated: ${date.toLocaleString()}`;
}

// Refresh button functionality and initial fetch
document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch - do this first
    fetchGitHubActivity();
    
    // Set up refresh button
    const refreshButton = document.getElementById('refresh-activity');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            // Clear cache and fetch fresh data
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(CACHE_TIMESTAMP_KEY);
            
            const activityContainer = document.getElementById('github-activity');
            if (activityContainer) {
                activityContainer.innerHTML = `
                    <div class="activity-skeleton">
                        <div class="skeleton-card"></div>
                        <div class="skeleton-card"></div>
                        <div class="skeleton-card"></div>
                        <div class="skeleton-card"></div>
                    </div>
                `;
            }
            
            fetchGitHubActivity();
        });
    }
});

// ===================================
// Smooth Scroll Enhancement
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.getElementById('nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Form Submission Enhancement
// ===================================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// Check for success parameter in URL
if (window.location.search.includes('success=true')) {
    formStatus.textContent = '✓ Message sent successfully! Thank you for getting in touch.';
    formStatus.style.display = 'block';
    formStatus.style.color = 'var(--accent-primary)';
    
    // Remove success parameter from URL
    const url = new URL(window.location);
    url.searchParams.delete('success');
    window.history.replaceState({}, '', url);
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    formStatus.style.display = 'none';
    
    try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            submitButton.textContent = '✓ Sent Successfully!';
            formStatus.textContent = '✓ Your message has been sent! I\'ll get back to you soon.';
            formStatus.style.display = 'block';
            formStatus.style.color = 'var(--accent-primary)';
            contactForm.reset();
            
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                formStatus.style.display = 'none';
            }, 5000);
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        submitButton.textContent = '✗ Failed - Try Again';
        formStatus.textContent = '✗ Something went wrong. Please try again or email me directly.';
        formStatus.style.display = 'block';
        formStatus.style.color = '#ef4444';
        
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 3000);
    }
});

// ===================================
// Placeholder Images Handler
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Create a placeholder gradient
            const theme = htmlElement.getAttribute('data-theme');
            const bgColor = theme === 'dark' ? '#2a2a2a' : '#e5e5e5';
            this.style.backgroundColor = bgColor;
            this.alt = 'Image placeholder';
        });
    });
});

console.log('🚀 Portfolio initialized successfully!');
