/**
 * NGO Website JavaScript
 * Handles navigation, form submissions, and interactive features
 */

// ===== NAVIGATION FUNCTIONALITY =====
class Navigation {
    constructor() {
        this.header = document.getElementById('header');
        this.navMenu = document.getElementById('nav-menu');
        this.navToggle = document.getElementById('nav-toggle');
        this.navClose = document.getElementById('nav-close');
        this.navLinks = document.querySelectorAll('.nav__link');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.handleScroll();
        this.setActiveLink();
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.showMenu());
        }
        
        if (this.navClose) {
            this.navClose.addEventListener('click', () => this.hideMenu());
        }
        
        // Close menu when clicking on nav links (mobile)
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.hideMenu());
        });
        
        // Scroll event for header background
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Active link on scroll
        window.addEventListener('scroll', () => this.setActiveLink());
    }
    
    showMenu() {
        this.navMenu.classList.add('show-menu');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    
    hideMenu() {
        this.navMenu.classList.remove('show-menu');
        document.body.style.overflow = 'auto'; // Restore scroll
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        
        if (scrollY >= 50) {
            this.header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            this.header.style.backdropFilter = 'blur(10px)';
        } else {
            this.header.style.backgroundColor = '#ffffff';
            this.header.style.backdropFilter = 'none';
        }
    }
    
    setActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active-link'));
                if (navLink) {
                    navLink.classList.add('active-link');
                }
            }
        });
    }
}

// ===== FORM HANDLING =====
class FormHandler {
    constructor() {
        this.contactForm = document.getElementById('contact-form');
        this.newsletterForm = document.getElementById('newsletter-form');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }
        
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterForm(e));
        }
    }
    
    handleContactForm(e) {
        e.preventDefault();
        
        const formData = new FormData(this.contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form data
        if (!this.validateContactForm(data)) {
            return;
        }
        
        // Simulate form submission
        this.showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
        this.contactForm.reset();
        
        // In a real application, you would send this data to your server
        console.log('Contact form submitted:', data);
    }
    
    handleNewsletterForm(e) {
        e.preventDefault();
        
        const formData = new FormData(this.newsletterForm);
        const email = formData.get('email') || this.newsletterForm.querySelector('input[type="email"]').value;
        
        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate newsletter subscription
        this.showMessage('Thank you for subscribing to our newsletter!', 'success');
        this.newsletterForm.reset();
        
        // In a real application, you would send this data to your server
        console.log('Newsletter subscription:', { email });
    }
    
    validateContactForm(data) {
        if (!data.name.trim()) {
            this.showMessage('Please enter your name.', 'error');
            return false;
        }
        
        if (!this.validateEmail(data.email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return false;
        }
        
        if (!data.subject.trim()) {
            this.showMessage('Please enter a subject.', 'error');
            return false;
        }
        
        if (!data.message.trim()) {
            this.showMessage('Please enter your message.', 'error');
            return false;
        }
        
        return true;
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message--${type}`;
        messageElement.textContent = message;
        
        // Style the message
        messageElement.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        `;
        
        if (type === 'success') {
            messageElement.style.backgroundColor = '#38a169';
        } else if (type === 'error') {
            messageElement.style.backgroundColor = '#e53e3e';
        }
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(messageElement);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageElement.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 300);
        }, 5000);
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Handle smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== ANIMATIONS ON SCROLL =====
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        // Create intersection observer for animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);
        
        // Observe elements for animation
        this.observeElements();
        this.addAnimationStyles();
    }
    
    observeElements() {
        const elementsToAnimate = document.querySelectorAll(`
            .hero__content,
            .impact__card,
            .about__content,
            .team__member,
            .project__card,
            .contact__form
        `);
        
        elementsToAnimate.forEach(el => {
            el.classList.add('animate-element');
            this.observer.observe(el);
        });
    }
    
    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-element {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .animate-element.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Stagger animation for grid items */
            .impact__card:nth-child(1) { transition-delay: 0.1s; }
            .impact__card:nth-child(2) { transition-delay: 0.2s; }
            .impact__card:nth-child(3) { transition-delay: 0.3s; }
            .impact__card:nth-child(4) { transition-delay: 0.4s; }
            
            .team__member:nth-child(1) { transition-delay: 0.1s; }
            .team__member:nth-child(2) { transition-delay: 0.2s; }
            .team__member:nth-child(3) { transition-delay: 0.3s; }
            
            .project__card:nth-child(1) { transition-delay: 0.1s; }
            .project__card:nth-child(2) { transition-delay: 0.2s; }
            .project__card:nth-child(3) { transition-delay: 0.3s; }
            .project__card:nth-child(4) { transition-delay: 0.4s; }
        `;
        document.head.appendChild(style);
    }
}

// ===== DONATION BUTTON FUNCTIONALITY =====
class DonationHandler {
    constructor() {
        this.donateButtons = document.querySelectorAll('.btn--donate');
        this.init();
    }
    
    init() {
        this.donateButtons.forEach(button => {
            button.addEventListener('click', () => this.handleDonation());
        });
    }
    
    handleDonation() {
        // In a real application, this would redirect to a payment processor
        // or open a donation modal
        alert('Thank you for your interest in donating! This would redirect to a secure payment page.');
        
        // Example: window.location.href = 'https://donate.hopefoundation.org';
        console.log('Donation button clicked');
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.handleKeyboardNavigation();
        this.addSkipLink();
        this.enhanceFocusManagement();
    }
    
    handleKeyboardNavigation() {
        // Handle escape key for mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('nav-menu');
                if (navMenu.classList.contains('show-menu')) {
                    navMenu.classList.remove('show-menu');
                    document.body.style.overflow = 'auto';
                    document.getElementById('nav-toggle').focus();
                }
            }
        });
    }
    
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        
        const style = document.createElement('style');
        style.textContent = `
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--primary-color);
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 1000;
                transition: top 0.3s;
            }
            
            .skip-link:focus {
                top: 6px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    enhanceFocusManagement() {
        // Add focus indicators for better keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            .nav__link:focus,
            .btn:focus,
            .form__input:focus,
            .form__textarea:focus {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Navigation();
    new FormHandler();
    new SmoothScroll();
    new ScrollAnimations();
    new DonationHandler();
    new AccessibilityEnhancements();
    
    // Add main id to main element for skip link
    const main = document.querySelector('.main');
    if (main) {
        main.id = 'main';
    }
    
    console.log('NGO Website initialized successfully!');
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy load images when they come into view
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    // Observe all images for lazy loading
    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// ===== UTILITY FUNCTIONS =====
const utils = {
    // Debounce function for performance optimization
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Navigation, FormHandler, SmoothScroll, ScrollAnimations, DonationHandler, AccessibilityEnhancements, utils };
}