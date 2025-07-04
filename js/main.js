
// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializePageSystem();
    initializeScrollAnimations();
    initializeContactForm();
    initializeAccessibility();
    
    // Add loading complete class
    document.body.classList.add('page-load-animation');
});

// Page Navigation System
function initializePageSystem() {
    // Show home page by default
    showPage('home');
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.page) {
            showPage(e.state.page, false);
        }
    });
    
    // Set initial state
    history.replaceState({page: 'home'}, '', '#home');
}

// Show specific page
window.showPage = function(pageId, addToHistory = true) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update navigation
        updateNavigation(pageId);
        
        // Add to browser history
        if (addToHistory) {
            history.pushState({page: pageId}, '', `#${pageId}`);
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Trigger animations for the new page
        setTimeout(() => {
            const elements = targetPage.querySelectorAll('.animate-on-scroll');
            elements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('animate-in');
                }, index * 100);
            });
        }, 100);
    }
};

// Update active navigation
function updateNavigation(activePageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === activePageId) {
            link.classList.add('active');
        }
    });
}

// Navigation functionality
function initializeNavigation() {
    const nav = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle scroll effects
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId);
            }
            
            // Close mobile menu
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animations
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animation elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
    const suffix = element.textContent.replace(/[0-9]/g, '');
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 30);
}

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Form validation
    const validators = {
        firstName: (value) => value.trim().length >= 2,
        lastName: (value) => value.trim().length >= 2,
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: (value) => value.trim().length >= 10,
        subject: (value) => value.trim().length > 0
    };
    
    function validateField(fieldName, value) {
        const validator = validators[fieldName];
        return validator ? validator(value) : true;
    }
    
    function showError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    function hideError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
    
    // Real-time validation
    const formFields = form.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            const isValid = validateField(this.name, this.value);
            if (!isValid) {
                const errorMessages = {
                    firstName: 'Please enter your first name (at least 2 characters)',
                    lastName: 'Please enter your last name (at least 2 characters)',
                    email: 'Please enter a valid email address',
                    message: 'Please enter a message (at least 10 characters)',
                    subject: 'Please select a subject'
                };
                showError(this.name, errorMessages[this.name]);
            } else {
                hideError(this.name);
            }
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                hideError(this.name);
                this.classList.remove('error');
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all required fields
        let isValid = true;
        const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field.name, field.value)) {
                isValid = false;
                field.classList.add('error');
                showError(field.name, 'This field is required');
            }
        });
        
        if (isValid) {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitButton.disabled = true;
            form.classList.add('loading');
            
            // Simulate form submission
            setTimeout(() => {
                showSuccessModal();
                form.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                form.classList.remove('loading');
            }, 2000);
        }
    });
}

// Smooth scrolling to sections within pages
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 100; // Account for fixed header
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
};

// Modal functionality
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            closeModal();
        }, 5000);
    }
}

window.closeModal = function() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

// Accessibility enhancements
function initializeAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Close modal on Escape
        if (e.key === 'Escape') {
            closeModal();
            
            // Close mobile menu
            const navToggle = document.getElementById('nav-toggle');
            const navMenu = document.getElementById('nav-menu');
            if (navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
        
        // Navigate between pages with arrow keys (when not in form)
        if (!e.target.matches('input, textarea, select')) {
            const pages = ['home', 'about', 'leadership', 'contact'];
            const currentPage = document.querySelector('.page.active').id;
            const currentIndex = pages.indexOf(currentPage);
            
            if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
                showPage(pages[currentIndex + 1]);
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                showPage(pages[currentIndex - 1]);
            }
        }
    });
    
    // Focus management for mobile menu
    const navToggle = document.getElementById('nav-toggle');
    navToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    // Announce page changes to screen readers
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.setAttribute('aria-live', 'polite');
    });
    
    // Add skip navigation for pages
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    skipLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.focus();
            }
        });
    });
}

// Utility functions
function debounce(func, wait) {
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

// Performance optimization
window.addEventListener('scroll', debounce(function() {
    // Throttled scroll events
    const scrollY = window.scrollY;
    
    // Parallax effect for hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        const parallaxSpeed = 0.5;
        const yPos = -(scrollY * parallaxSpeed);
        heroImage.style.transform = `translateY(${yPos}px)`;
    }
}, 16)); // ~60fps

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could send to error reporting service in production
});

// Initialize lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize on load
window.addEventListener('load', function() {
    initializeLazyLoading();
});

// Service worker registration (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for global use
window.initializePageSystem = initializePageSystem;
window.updateNavigation = updateNavigation;
