// Modern Portfolio JavaScript with Glassmorphism & Cyberpunk Effects

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initCustomCursor();
        this.initLoadingScreen();
        this.initScrollProgress();
        this.initFloatingNav();
        this.initTypewriter();
        this.initAOS();
        this.initMagneticButtons();
        this.initProjectFilters();
        this.initSkillTabs();
        this.initSkillAnimations();
        this.initContactForm();
        this.initBackToTop();
        this.initCounterAnimations();
        this.initThemeToggle();
    }

    setupEventListeners() {
        window.addEventListener('load', () => this.handlePageLoad());
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('mousemove', (e) => this.updateCursor(e));
        document.addEventListener('click', (e) => this.createRipple(e));
    }

    // Custom Cursor
    initCustomCursor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorFollower = document.querySelector('.cursor-follower');
        
        if (!this.cursor || !this.cursorFollower) return;

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        const updateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            this.cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
            requestAnimationFrame(updateFollower);
        };

        updateFollower();

        // Cursor interactions
        document.querySelectorAll('a, button, .magnetic-btn').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(1.5)';
                this.cursorFollower.style.transform += ' scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursorFollower.style.transform = this.cursorFollower.style.transform.replace(' scale(1.5)', '');
            });
        });
    }

    updateCursor(e) {
        if (!this.cursor) return;
        
        this.cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        
        // Update follower position for smooth animation
        window.mouseX = e.clientX;
        window.mouseY = e.clientY;
    }

    // Loading Screen
    initLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (!loadingScreen) return;

        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 2000);
    }

    handlePageLoad() {
        document.body.style.overflow = 'visible';
        this.animateOnLoad();
    }

    animateOnLoad() {
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero-section [data-aos]');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('aos-animate');
            }, index * 200);
        });
    }

    // Scroll Progress
    initScrollProgress() {
        this.scrollProgress = document.querySelector('.scroll-progress');
    }

    handleScroll() {
        this.updateScrollProgress();
        this.updateFloatingNav();
        this.updateBackToTop();
    }

    updateScrollProgress() {
        if (!this.scrollProgress) return;
        
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        this.scrollProgress.style.width = `${scrolled}%`;
    }

    // Floating Navigation
    initFloatingNav() {
        this.navLinks = document.querySelectorAll('.floating-nav a');
        this.navIndicator = document.querySelector('.nav-indicator');
        this.sections = document.querySelectorAll('.section, .hero-section');

        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    updateFloatingNav() {
        if (!this.sections || !this.navIndicator) return;

        let currentSection = '';
        const scrollPos = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        this.navLinks.forEach((link, index) => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
                this.navIndicator.style.transform = `translateX(-50%) translateY(${index * 48}px)`;
            }
        });
    }

    // Typewriter Effect
    initTypewriter() {
        const typewriterElement = document.querySelector('.typewriter-text');
        if (!typewriterElement) return;

        const texts = [
            'AI Developer',
            'Full Stack Developer',
            'Machine Learning Engineer',
            'Problem Solver',
            'Aspiring Leader'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeWriter = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(typeWriter, typeSpeed);
        };

        typeWriter();
    }

    // AOS (Animate On Scroll)
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }
    }

    // Magnetic Buttons
    initMagneticButtons() {
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.magneticEffect(e, btn));
            btn.addEventListener('mouseleave', () => this.resetMagnetic(btn));
        });
    }

    magneticEffect(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    }

    resetMagnetic(element) {
        element.style.transform = 'translate(0px, 0px)';
    }

    // Ripple Effect
    createRipple(e) {
        if (!e.target.classList.contains('magnetic-btn')) return;

        const button = e.target;
        const ripple = button.querySelector('.btn-ripple');
        if (!ripple) return;

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.transform = 'scale(0)';

        requestAnimationFrame(() => {
            ripple.style.transform = 'scale(4)';
            ripple.style.opacity = '0';
        });

        setTimeout(() => {
            ripple.style.transform = 'scale(0)';
            ripple.style.opacity = '1';
        }, 600);
    }

    // Project Filters
    initProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category');
                    
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Skill Tabs
    initSkillTabs() {
        const skillTabs = document.querySelectorAll('.skill-tab');
        const skillCategories = document.querySelectorAll('.skill-category');

        skillTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetCategory = tab.getAttribute('data-tab');
                
                // Update active tab
                skillTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show target category
                skillCategories.forEach(category => {
                    category.classList.remove('active');
                    if (category.getAttribute('data-category') === targetCategory) {
                        category.classList.add('active');
                        this.animateSkillBars(category);
                    }
                });
            });
        });
    }

    // Skill Animations
    initSkillAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBars(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.skill-category').forEach(category => {
            observer.observe(category);
        });
    }

    animateSkillBars(container) {
        // Animate circular progress
        const progressCircles = container.querySelectorAll('.progress-circle');
        progressCircles.forEach(circle => {
            const percent = circle.getAttribute('data-percent');
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (percent / 100) * circumference;
            
            setTimeout(() => {
                circle.style.strokeDashoffset = offset;
            }, 500);
        });

        // Animate linear progress bars
        const progressBars = container.querySelectorAll('.skill-progress-bar');
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }

    // Counter Animations
    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // Contact Form
    initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Floating labels
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => this.handleInputFocus(input));
            input.addEventListener('blur', () => this.handleInputBlur(input));
        });
    }

    handleInputFocus(input) {
        input.parentElement.classList.add('focused');
    }

    handleInputBlur(input) {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('.submit-btn');
        const formData = new FormData(e.target);
        
        // Show loading state
        submitBtn.classList.add('loading');
        
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success state
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            
            // Create confetti effect
            this.createConfetti();
            
            // Reset form after delay
            setTimeout(() => {
                submitBtn.classList.remove('success');
                e.target.reset();
            }, 3000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            submitBtn.classList.remove('loading');
        }
    }

    createConfetti() {
        // Simple confetti effect
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${['#00d4ff', '#bb86fc', '#cf6679'][Math.floor(Math.random() * 3)]};
                top: 50%;
                left: 50%;
                z-index: 10000;
                pointer-events: none;
                animation: confetti 3s ease-out forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    // Back to Top
    initBackToTop() {
        this.backToTopBtn = document.getElementById('backToTop');
        if (!this.backToTopBtn) return;

        this.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    updateBackToTop() {
        if (!this.backToTopBtn) return;
        
        if (window.scrollY > 300) {
            this.backToTopBtn.classList.add('visible');
        } else {
            this.backToTopBtn.classList.remove('visible');
        }
    }

    // Theme Toggle
    initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            // Save preference
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            // Animate toggle
            themeToggle.style.transform = 'scale(0.8)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    }

    handleResize() {
        // Handle responsive changes
        if (window.innerWidth <= 1024) {
            // Mobile optimizations
            this.optimizeForMobile();
        }
    }

    optimizeForMobile() {
        // Reduce animations on mobile for better performance
        if (window.innerWidth <= 768) {
            document.documentElement.style.setProperty('--transition-smooth', 'all 0.2s ease');
        }
    }
}

// Additional CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes confetti {
        0% {
            transform: translate(-50%, -50%) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 + 200}px) rotate(720deg);
            opacity: 0;
        }
    }
    
    .aos-animate {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add SVG gradient for circular progress
document.addEventListener('DOMContentLoaded', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    
    svg.innerHTML = `
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#bb86fc;stop-opacity:1" />
            </linearGradient>
        </defs>
    `;
    
    document.body.appendChild(svg);
});

// Performance optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Load non-critical animations
        console.log('Portfolio loaded successfully!');
    });
}

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}