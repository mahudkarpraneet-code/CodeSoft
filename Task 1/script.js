// ========================================
// DATA CONFIGURATION
// ========================================
const CONFIG = {
    skills: ['C++', 'Python', 'Java', 'SQL', 'HTML', 'CSS', 'JavaScript', 'GitHub', 'VS Code'],
    roles: ['Web Developer', 'Student', 'Tech Enthusiast', 'Problem Solver'],
    projects: [
        { title: 'Portfolio Website', description: 'Responsive personal portfolio with modern design.', category: 'web' },
        { title: 'Calculator', description: 'Interactive calculator using HTML, CSS & JavaScript.', category: 'web' },
        { title: 'Weather Forecast', description: 'Real-time weather website using API integration.', category: 'web' },
        { title: 'Library Management', description: 'Full-stack tool using React.js and Node.js.', category: 'app' }
    ],
    validation: {
        nameMinLength: 2,
        messageMinLength: 10,
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    timing: {
        typeSpeed: 100,
        deleteSpeed: 50,
        pauseAfterType: 2000,
        pauseAfterDelete: 500,
        tooltipDuration: 2000,
        successMessageDuration: 3000
    }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
const Utils = {
    validateEmail(email) {
        return CONFIG.validation.emailRegex.test(email);
    },

    scrollTo(element) {
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    createElement(tag, className, content = '') {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (content) el.textContent = content;
        return el;
    }
};

// ========================================
// DOM MANIPULATION
// ========================================
const DOM = {
    renderSkills() {
        const container = document.getElementById('skillsContainer');
        if (!container) return;

        container.innerHTML = CONFIG.skills.map(skill => `
            <div class="col-md-3 col-6">
                <div class="skill-box zoom" data-skill="${skill}">${skill}</div>
            </div>
        `).join('');
    },

    renderProjects() {
        const container = document.getElementById('projectsContainer');
        if (!container) return;

        container.innerHTML = CONFIG.projects.map(project => `
            <div class="col-md-6 col-lg-3 mb-4 project-item" data-category="${project.category}">
                <div class="card project-card">
                    <div class="card-body">
                        <h5>${project.title}</h5>
                        <p>${project.description}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }
};

// ========================================
// FORM VALIDATION
// ========================================
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            message: document.getElementById('message')
        };
        this.errors = {
            name: document.getElementById('nameError'),
            email: document.getElementById('emailError'),
            message: document.getElementById('messageError')
        };
        this.successMsg = document.getElementById('formSuccess');
    }

    showError(field, message) {
        const input = this.fields[field];
        const error = this.errors[field];
        
        input.classList.add('invalid');
        error.textContent = message;
        error.classList.add('show');
    }

    clearError(field) {
        const input = this.fields[field];
        const error = this.errors[field];
        
        input.classList.remove('invalid');
        error.textContent = '';
        error.classList.remove('show');
    }

    validateField(field) {
        const value = this.fields[field].value.trim();
        
        const validators = {
            name: () => value.length >= CONFIG.validation.nameMinLength,
            email: () => Utils.validateEmail(value),
            message: () => value.length >= CONFIG.validation.messageMinLength
        };

        return validators[field]();
    }

    validate() {
        let isValid = true;

        const validations = {
            name: { message: `Name must be at least ${CONFIG.validation.nameMinLength} characters long` },
            email: { message: 'Please enter a valid email address' },
            message: { message: `Message must be at least ${CONFIG.validation.messageMinLength} characters long` }
        };

        Object.entries(validations).forEach(([field, { message }]) => {
            if (!this.validateField(field)) {
                this.showError(field, message);
                isValid = false;
            } else {
                this.clearError(field);
            }
        });

        return isValid;
    }

    showSuccess() {
        this.successMsg.textContent = '✓ Message sent successfully! I will get back to you soon.';
        this.successMsg.classList.add('show');

        setTimeout(() => {
            this.form.reset();
            this.successMsg.classList.remove('show');
        }, CONFIG.timing.successMessageDuration);
    }

    init() {
        // Real-time validation
        Object.keys(this.fields).forEach(field => {
            this.fields[field].addEventListener('input', () => {
                if (this.validateField(field)) {
                    this.clearError(field);
                }
            });
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate()) {
                this.showSuccess();
            }
        });
    }
}

// ========================================
// THEME MANAGER
// ========================================
class ThemeManager {
    constructor() {
        this.toggle = document.getElementById('themeToggle');
        this.body = document.body;
        this.storageKey = 'theme';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem(this.storageKey);
        if (savedTheme === 'light') {
            this.setLightTheme();
        }
    }

    setLightTheme() {
        this.body.classList.add('light-theme');
        this.toggle.textContent = '🌙';
    }

    setDarkTheme() {
        this.body.classList.remove('light-theme');
        this.toggle.textContent = '☀️';
    }

    toggleTheme() {
        const isLight = this.body.classList.toggle('light-theme');
        
        if (isLight) {
            this.toggle.textContent = '🌙';
            localStorage.setItem(this.storageKey, 'light');
        } else {
            this.toggle.textContent = '☀️';
            localStorage.setItem(this.storageKey, 'dark');
        }
    }

    init() {
        this.loadTheme();
        this.toggle.addEventListener('click', () => this.toggleTheme());
    }
}

// ========================================
// TYPING ANIMATION
// ========================================
class TypingAnimation {
    constructor(elementId, texts) {
        this.element = document.getElementById(elementId);
        this.texts = texts;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let speed = this.isDeleting ? CONFIG.timing.deleteSpeed : CONFIG.timing.typeSpeed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            speed = CONFIG.timing.pauseAfterType;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            speed = CONFIG.timing.pauseAfterDelete;
        }

        setTimeout(() => this.type(), speed);
    }

    init() {
        this.type();
    }
}

// ========================================
// PROJECT FILTER
// ========================================
class ProjectFilter {
    constructor() {
        this.buttons = document.querySelectorAll('.filter-btn');
        this.items = document.querySelectorAll('.project-item');
    }

    filterProjects(category) {
        this.items.forEach(item => {
            const itemCategory = item.dataset.category;
            item.classList.toggle('hidden', category !== 'all' && category !== itemCategory);
        });
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                this.buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter projects
                this.filterProjects(btn.dataset.filter);
            });
        });
    }
}

// ========================================
// SCROLL EFFECTS
// ========================================
class ScrollEffects {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.scrollBtn = document.getElementById('scrollToTop');
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('.nav-link');
    }

    initScrollToTop() {
        window.addEventListener('scroll', () => {
            this.scrollBtn.classList.toggle('visible', window.pageYOffset > 300);
        });

        this.scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    initActiveNav() {
        window.addEventListener('scroll', () => {
            let current = '';

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    initNavbarScroll() {
        window.addEventListener('scroll', () => {
            this.navbar.classList.toggle('scrolled', window.pageYOffset > 100);
        });
    }

    initSmoothScroll() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    Utils.scrollTo(document.querySelector(href));
                }
            });
        });
    }

    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        this.sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 0.8s ease';
            observer.observe(section);
        });
    }

    init() {
        this.initScrollToTop();
        this.initActiveNav();
        this.initNavbarScroll();
        this.initSmoothScroll();
        this.initScrollAnimations();
    }
}

// ========================================
// SKILL INTERACTION
// ========================================
class SkillInteraction {
    showTooltip(skillName) {
        const tooltip = Utils.createElement('div', '', `${skillName} - Click to learn more!`);
        tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 40px;
            border-radius: 15px;
            font-size: 1.2rem;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.5);
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(tooltip);

        setTimeout(() => {
            tooltip.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => tooltip.remove(), 300);
        }, CONFIG.timing.tooltipDuration);
    }

    init() {
        document.addEventListener('click', (e) => {
            const skillBox = e.target.closest('.skill-box');
            if (skillBox) {
                this.showTooltip(skillBox.dataset.skill);
            }
        });
    }
}

// ========================================
// APPLICATION INITIALIZATION
// ========================================
class App {
    constructor() {
        this.components = {
            theme: new ThemeManager(),
            scroll: new ScrollEffects(),
            form: new FormValidator('contactForm'),
            typing: new TypingAnimation('roleText', CONFIG.roles),
            filter: new ProjectFilter(),
            skills: new SkillInteraction()
        };
    }

    init() {
        console.log('Portfolio loaded successfully! 🚀');

        // Render dynamic content
        DOM.renderSkills();
        DOM.renderProjects();

        // Initialize all components
        Object.values(this.components).forEach(component => component.init());

        console.log('All interactive features initialized! ✨');
    }
}

// ========================================
// START APPLICATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});