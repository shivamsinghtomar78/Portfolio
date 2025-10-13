// Modern Portfolio JavaScript with Glassmorphism & Cyberpunk Effects

/*
 * EmailJS Setup Instructions:
 * 1. Go to https://www.emailjs.com/ and create a free account
 * 2. Create an email service (Gmail, Outlook, etc.)
 * 3. Create an email template with these variables:
 *    - {{from_name}} - sender's name
 *    - {{from_email}} - sender's email
 *    - {{subject}} - email subject
 *    - {{message}} - email message
 *    - {{to_email}} - your email (ss93134041@gmail.com)
 * 4. Replace the following placeholders in the code:
 *    - YOUR_EMAILJS_PUBLIC_KEY (from EmailJS dashboard)
 *    - YOUR_SERVICE_ID (from your email service)
 *    - YOUR_TEMPLATE_ID (from your email template)
 * 
 * If EmailJS is not configured, the form will fallback to mailto links.
 */

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.isMobile = this.detectMobile();
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
        this.optimizeForMobile();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0);
    }

    setupEventListeners() {
        window.addEventListener('load', () => this.handlePageLoad());
        window.addEventListener('scroll', this.debounce(() => this.handleScroll(), 16));
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));

        if (!this.isMobile) {
            document.addEventListener('mousemove', (e) => this.updateCursor(e));
        }
        document.addEventListener('click', (e) => this.createRipple(e));
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Custom Cursor
    initCustomCursor() {
        // Hide cursor on mobile devices
        if (this.isMobile) {
            const cursor = document.querySelector('.cursor');
            const cursorFollower = document.querySelector('.cursor-follower');
            if (cursor) cursor.style.display = 'none';
            if (cursorFollower) cursorFollower.style.display = 'none';
            return;
        }

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
        // Disable magnetic effects on mobile for better performance
        if (this.isMobile) return;

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
            // Check if input has value on load
            if (input.value.trim()) {
                input.parentElement.classList.add('focused');
            }

            input.addEventListener('focus', () => this.handleInputFocus(input));
            input.addEventListener('blur', () => this.handleInputBlur(input));
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.parentElement.classList.add('focused');
                } else {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    handleInputFocus(input) {
        input.parentElement.classList.add('focused');
    }

    handleInputBlur(input) {
        if (!input.value.trim()) {
            input.parentElement.classList.remove('focused');
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const submitBtn = e.target.querySelector('.submit-btn');
        const form = e.target;

        // Get form data
        const formData = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim()
        };

        // Enhanced validation
        const validation = this.validateForm(formData);
        if (!validation.isValid) {
            this.showNotification(validation.message, 'error');
            this.highlightInvalidFields(form, validation.invalidFields);
            return;
        }

        // Show loading state
        this.setButtonState(submitBtn, 'loading');

        try {
            // Initialize EmailJS if not already done
            if (typeof emailjs !== 'undefined' && !this.emailjsInitialized) {
                // Replace with your EmailJS public key
                emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");
                this.emailjsInitialized = true;
            }

            let success = false;
            let errorMessage = '';

            // Send to Flask backend
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData)
            });

            const result = await response.json();
            
            if (result.success) {
                success = true;
            } else {
                throw new Error(result.message || 'Failed to send message');
            }

            if (success) {
                this.handleFormSuccess(submitBtn, form);
            } else {
                throw new Error(errorMessage + 'Please try again or contact directly.');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.handleFormError(submitBtn, error.message);
        }
    }

    validateForm(data) {
        const invalidFields = [];
        let message = '';

        // Check required fields
        if (!data.name) {
            invalidFields.push('name');
            message = 'Please enter your name';
        } else if (data.name.length < 2) {
            invalidFields.push('name');
            message = 'Name must be at least 2 characters long';
        }

        if (!data.email) {
            invalidFields.push('email');
            message = 'Please enter your email address';
        } else if (!this.isValidEmail(data.email)) {
            invalidFields.push('email');
            message = 'Please enter a valid email address';
        }

        if (!data.subject) {
            invalidFields.push('subject');
            message = 'Please enter a subject';
        } else if (data.subject.length < 3) {
            invalidFields.push('subject');
            message = 'Subject must be at least 3 characters long';
        }

        if (!data.message) {
            invalidFields.push('message');
            message = 'Please enter your message';
        } else if (data.message.length < 10) {
            invalidFields.push('message');
            message = 'Message must be at least 10 characters long';
        }

        // Check for potential spam
        if (this.isSpamContent(data)) {
            message = 'Message appears to be spam. Please write a genuine message.';
            return { isValid: false, message, invalidFields: ['message'] };
        }

        return {
            isValid: invalidFields.length === 0,
            message,
            invalidFields
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    isSpamContent(data) {
        const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here', 'free money'];
        const content = (data.name + ' ' + data.subject + ' ' + data.message).toLowerCase();

        // Check for spam keywords
        const hasSpamKeywords = spamKeywords.some(keyword => content.includes(keyword));

        // Check for excessive links
        const linkCount = (content.match(/http[s]?:\/\//g) || []).length;

        // Check for excessive repetition
        const words = content.split(' ');
        const uniqueWords = new Set(words);
        const repetitionRatio = words.length / uniqueWords.size;

        return hasSpamKeywords || linkCount > 2 || repetitionRatio > 3;
    }

    highlightInvalidFields(form, invalidFields) {
        // Remove previous error states
        form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });

        // Add error state to invalid fields
        invalidFields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.parentElement.classList.add('error');
            }
        });
    }

    createMailtoLink(data) {
        const subject = encodeURIComponent(`Portfolio Contact: ${data.subject}`);
        const body = encodeURIComponent(
            `Name: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Subject: ${data.subject}\n\n` +
            `Message:\n${data.message}\n\n` +
            `---\nSent from portfolio contact form`
        );
        return `mailto:ss93134041@gmail.com?subject=${subject}&body=${body}`;
    }

    setButtonState(button, state) {
        // Remove all states
        button.classList.remove('loading', 'success', 'error');

        // Add new state
        if (state !== 'default') {
            button.classList.add(state);
        }

        // Update button text and disable/enable
        const textSpan = button.querySelector('.btn-text');
        const loadingSpan = button.querySelector('.btn-loading');
        const successSpan = button.querySelector('.btn-success');

        switch (state) {
            case 'loading':
                button.disabled = true;
                if (textSpan) textSpan.style.display = 'none';
                if (loadingSpan) loadingSpan.style.display = 'flex';
                if (successSpan) successSpan.style.display = 'none';
                break;
            case 'success':
                button.disabled = true;
                if (textSpan) textSpan.style.display = 'none';
                if (loadingSpan) loadingSpan.style.display = 'none';
                if (successSpan) successSpan.style.display = 'flex';
                break;
            case 'error':
            case 'default':
            default:
                button.disabled = false;
                if (textSpan) textSpan.style.display = 'flex';
                if (loadingSpan) loadingSpan.style.display = 'none';
                if (successSpan) successSpan.style.display = 'none';
                break;
        }
    }

    handleFormSuccess(submitBtn, form) {
        this.setButtonState(submitBtn, 'success');
        this.createConfetti();
        this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');

        // Reset form after delay
        setTimeout(() => {
            this.setButtonState(submitBtn, 'default');
            form.reset();

            // Reset floating labels
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('focused', 'error');
            });
        }, 3000);
    }

    handleFormError(submitBtn, errorMessage) {
        this.setButtonState(submitBtn, 'error');
        this.showNotification(errorMessage || 'Failed to send message. Please try again.', 'error');

        // Reset button state after delay
        setTimeout(() => {
            this.setButtonState(submitBtn, 'default');
        }, 3000);
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

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 'rgba(33, 150, 243, 0.9)'};
            backdrop-filter: blur(20px);
            border: 1px solid ${type === 'success' ? 'rgba(76, 175, 80, 0.3)' : type === 'error' ? 'rgba(244, 67, 54, 0.3)' : 'rgba(33, 150, 243, 0.3)'};
            border-radius: 15px;
            padding: 1rem 1.5rem;
            color: white;
            z-index: 10001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
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
        if (!this.isMobile) return;

        // Reduce animations on mobile for better performance
        document.documentElement.style.setProperty('--transition-smooth', 'all 0.2s ease');

        // Disable heavy animations
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .floating-shapes { display: none; }
                .bg-gradient-mesh { opacity: 0.3; }
                * { animation-duration: 0.3s !important; }
                .aos-animate { animation: none !important; }
            }
        `;
        document.head.appendChild(style);

        // Add touch-friendly improvements
        document.body.classList.add('mobile-optimized');

        // Improve touch targets
        const buttons = document.querySelectorAll('button, .btn, .magnetic-btn');
        buttons.forEach(btn => {
            if (btn.offsetHeight < 44) {
                btn.style.minHeight = '44px';
                btn.style.padding = '12px 16px';
            }
        });
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

// Resume Section Enhancements
document.addEventListener('DOMContentLoaded', function () {
    // Add click tracking for resume buttons
    const resumeButtons = document.querySelectorAll('.resume-btn');

    resumeButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Add ripple effect
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                ripple.style.animation = 'none';
                ripple.offsetHeight; // Trigger reflow
                ripple.style.animation = 'ripple 0.6s ease-out';
            }

            // Add success feedback for download button
            if (this.hasAttribute('download')) {
                const originalText = this.querySelector('span').innerHTML;
                this.querySelector('span').innerHTML = '<i class="fas fa-check"></i> Downloaded!';

                setTimeout(() => {
                    this.querySelector('span').innerHTML = originalText;
                }, 2000);
            }
        });
    });

    // Add loading state for PDF iframe
    const resumeIframe = document.querySelector('.resume-embed iframe');
    if (resumeIframe) {
        resumeIframe.addEventListener('load', function () {
            this.style.opacity = '1';
        });

        // Initially hide iframe until loaded
        resumeIframe.style.opacity = '0';
        resumeIframe.style.transition = 'opacity 0.5s ease';
    }
});