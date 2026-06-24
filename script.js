/**
 * PT. Kualiti Solusi Edukasi - JavaScript
 * Professional company profile website functionality
 */

// ========================================
// Utility Functions
// ========================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function for performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ========================================
// Mobile Navigation
// ========================================

class MobileNavigation {
    constructor() {
        this.navToggle = $('#navToggle');
        this.navMenu = $('#navMenu');
        this.navLinks = $$('.nav-link');
        this.header = $('.header');
        this.lastScroll = 0;

        this.init();
    }

    init() {
        // Toggle mobile menu
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Handle scroll effects
        window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));

        // Smooth scroll for anchor links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e, link));
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;

        // Add shadow to header on scroll
        if (currentScroll > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        this.lastScroll = currentScroll;
    }

    handleSmoothScroll(e, link) {
        const href = link.getAttribute('href');

        if (href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerHeight = this.header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active state
                this.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    }
}

// ========================================
// Back to Top Button
// ========================================

class BackToTop {
    constructor() {
        this.button = $('#backToTop');
        this.scrollThreshold = 300;

        this.init();
    }

    init() {
        if (!this.button) return;

        window.addEventListener('scroll', debounce(() => this.toggleVisibility(), 100));

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    toggleVisibility() {
        if (window.pageYOffset > this.scrollThreshold) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
}

// ========================================
// Contact Form Handling
// ========================================

class ContactForm {
    constructor() {
        this.form = $('#contactForm');
        this.submitButton = this.form ? this.form.querySelector('button[type="submit"]') : null;

        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Add input validation feedback
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearError(field);

        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Field ini wajib diisi';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Email tidak valid';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Nomor telepon tidak valid';
            }
        }

        // Show error if not valid
        if (!isValid) {
            this.showError(field, errorMessage);
        }

        return isValid;
    }

    showError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';

        field.style.borderColor = '#ef4444';
        field.parentNode.appendChild(errorDiv);
    }

    clearError(field) {
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = '';
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const inputs = this.form.querySelectorAll('input, select, textarea');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showMessage('Silakan perbaiki error pada formulir', 'error');
            return;
        }

        // Disable submit button
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

        // Simulate form submission (replace with actual API call)
        try {
            await this.simulateSubmission();

            // Show success message
            this.showMessage('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.', 'success');

            // Reset form
            this.form.reset();
        } catch (error) {
            this.showMessage('Terjadi kesalahan. Silakan coba lagi.', 'error');
        } finally {
            // Re-enable submit button
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = 'Kirim Pesan';
        }
    }

    simulateSubmission() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    showMessage(message, type) {
        // Remove existing message
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.padding = '1rem';
        messageDiv.style.marginTop = '1rem';
        messageDiv.style.borderRadius = '0.5rem';
        messageDiv.style.textAlign = 'center';

        if (type === 'success') {
            messageDiv.style.background = '#d1fae5';
            messageDiv.style.color = '#065f46';
            messageDiv.style.border = '1px solid #10b981';
        } else {
            messageDiv.style.background = '#fee2e2';
            messageDiv.style.color = '#991b1b';
            messageDiv.style.border = '1px solid #ef4444';
        }

        this.form.appendChild(messageDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// ========================================
// Scroll Animations
// ========================================

class ScrollAnimations {
    constructor() {
        this.elements = $$('.section, .service-card, .team-card, .stat-card');
        this.threshold = 0.1;

        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            this.elements.forEach(el => el.classList.add('animate-fade-in'));
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: this.threshold
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.elements.forEach(el => {
            el.style.opacity = '0';
            this.observer.observe(el);
        });
    }
}

// ========================================
// Statistics Counter Animation
// ========================================

class CounterAnimation {
    constructor() {
        this.counters = $$('.stat-number, .stat-number-big');
        this.animated = new Set();

        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateCounter(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, observerOptions);

        this.counters.forEach(counter => {
            this.observer.observe(counter);
        });
    }

    animateCounter(element) {
        const text = element.textContent;
        const match = text.match(/(\d+)/);

        if (!match) return;

        const targetValue = parseInt(match[0]);
        const suffix = text.replace(match[0], '');
        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepDuration = duration / steps;
        let currentValue = 0;
        const increment = targetValue / steps;

        const updateCounter = () => {
            currentValue += increment;
            if (currentValue < targetValue) {
                element.textContent = Math.floor(currentValue) + suffix;
                setTimeout(updateCounter, stepDuration);
            } else {
                element.textContent = targetValue + suffix;
            }
        };

        updateCounter();
    }
}

// ========================================
// Lazy Loading Images
// ========================================

class LazyLoading {
    constructor() {
        this.images = $$('img[data-src]');

        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window) || this.images.length === 0) {
            this.loadAllImages();
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.images.forEach(img => {
            this.observer.observe(img);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
        }
    }

    loadAllImages() {
        this.images.forEach(img => this.loadImage(img));
    }
}

// ========================================
// Cookie Consent (GDPR Compliance)
// ========================================

class CookieConsent {
    constructor() {
        this.consentKey = 'qs399-cookie-consent';
        this.banner = null;

        this.init();
    }

    init() {
        // Check if user already consented
        if (localStorage.getItem(this.consentKey)) {
            return;
        }

        this.createBanner();
    }

    createBanner() {
        this.banner = document.createElement('div');
        this.banner.className = 'cookie-banner';
        this.banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(31, 41, 55, 0.95);
            color: white;
            padding: 1.5rem;
            z-index: 9999;
            box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
        `;

        this.banner.innerHTML = `
            <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div style="flex: 1; min-width: 300px;">
                    <h4 style="color: white; margin-bottom: 0.5rem;">Cookie Consent</h4>
                    <p style="color: rgba(255, 255, 255, 0.8); font-size: 0.875rem; margin-bottom: 0;">
                        Kami menggunakan cookie untuk meningkatkan pengalaman Anda. Dengan melanjutkan browsing, Anda setuju dengan kebijakan privasi kami.
                    </p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-accept-cookies" style="padding: 0.5rem 1.5rem; background: #10b981; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
                        Terima
                    </button>
                    <button class="btn-reject-cookies" style="padding: 0.5rem 1.5rem; background: transparent; color: white; border: 1px solid white; border-radius: 0.5rem; cursor: pointer;">
                        Tolak
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(this.banner);
        document.body.style.paddingBottom = this.banner.offsetHeight + 'px';

        // Add event listeners
        this.banner.querySelector('.btn-accept-cookies').addEventListener('click', () => this.accept());
        this.banner.querySelector('.btn-reject-cookies').addEventListener('click', () => this.reject());
    }

    accept() {
        localStorage.setItem(this.consentKey, 'accepted');
        this.removeBanner();
    }

    reject() {
        localStorage.setItem(this.consentKey, 'rejected');
        this.removeBanner();
    }

    removeBanner() {
        if (this.banner) {
            document.body.style.paddingBottom = '';
            this.banner.remove();
        }
    }
}

// ========================================
// SEO Enhancements
// ========================================

class SEOEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.addStructuredData();
        this.optimizeImages();
        this.addMetaTags();
    }

    addStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PT. Kualiti Solusi Edukasi",
            "description": "Perusahaan konsultan pendidikan profesional di Indonesia",
            "url": "https://www.kualitisolusiedukasi.com",
            "logo": "Logo QS399.png",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+62-813-1046-2982",
                "contactType": "customer service",
                "email": "qualityedsolutions@gmail.com"
            },
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Perum Alam Sinasari, Jl. Anyelir D29",
                "addressLocality": "Dramaga, Bogor",
                "addressRegion": "Jawa Barat",
                "addressCountry": "ID"
            }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    optimizeImages() {
        const images = $$('img');
        images.forEach(img => {
            if (!img.alt) {
                img.alt = 'PT. Kualiti Solusi Edukasi - Konsultan Pendidikan';
            }
        });
    }

    addMetaTags() {
        // Add additional meta tags for better SEO
        const metaTags = [
            { name: 'theme-color', content: '#1e40af' },
            { name: 'msapplication-TileColor', content: '#1e40af' },
            { property: 'og:locale', content: 'id_ID' },
            { property: 'og:site_name', content: 'PT. Kualiti Solusi Edukasi' }
        ];

        metaTags.forEach(tag => {
            const meta = document.createElement('meta');
            if (tag.name) {
                meta.name = tag.name;
            } else {
                meta.property = tag.property;
            }
            meta.content = tag.content;
            document.head.appendChild(meta);
        });
    }
}

// ========================================
// Performance Monitoring
// ========================================

class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor page load time
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page Load Time:', pageLoadTime + 'ms');
        });

        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            this.monitorCoreWebVitals();
        }
    }

    monitorCoreWebVitals() {
        // LCP (Largest Contentful Paint)
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.warn('LCP monitoring not supported');
        }

        // FID (First Input Delay)
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.warn('FID monitoring not supported');
        }

        // CLS (Cumulative Layout Shift)
        try {
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                list.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log('CLS:', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.warn('CLS monitoring not supported');
        }
    }
}

// ========================================
// Initialize All Components
// ========================================

class App {
    constructor() {
        this.components = [];
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            this.components = [
                new MobileNavigation(),
                new BackToTop(),
                new ContactForm(),
                new ScrollAnimations(),
                new CounterAnimation(),
                new SEOEnhancements(),
                new PerformanceMonitor()
            ];

            // Initialize cookie consent after a delay
            setTimeout(() => {
                new CookieConsent();
            }, 2000);

            console.log('PT. Kualiti Solusi Edukasi website initialized successfully');
        } catch (error) {
            console.error('Error initializing website:', error);
        }
    }
}

// ========================================
// Start the Application
// ========================================

new App();

// ========================================
// Export for potential module usage
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MobileNavigation,
        BackToTop,
        ContactForm,
        ScrollAnimations,
        CounterAnimation,
        CookieConsent
    };
}