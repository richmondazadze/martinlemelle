
// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollAnimations();
    initializeContactForm();
    initializeMediaTabs();
    initializeScrollIndicators();
    initializeParallaxEffects();
    initializeAccessibility();
    
    // Add loading complete class
    document.body.classList.add('page-load-animation');
});

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
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNavigation() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavigation);
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
    const steps = document.querySelectorAll('.form-step');
    const progressFill = document.getElementById('progress-fill');
    const currentStepElement = document.getElementById('current-step');
    let currentStep = 1;
    
    // Form validation
    const validators = {
        name: (value) => value.trim().length >= 2,
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
                    name: 'Please enter your full name (at least 2 characters)',
                    email: 'Please enter a valid email address',
                    message: 'Please enter a message (at least 10 characters)',
                    subject: 'Please select a subject'
                };
                showError(this.name, errorMessages[this.name]);
            } else {
                hideError(this.name);
            }
        });
        
        field.addEventListener('focus', function() {
            this.classList.add('form-field-focus');
        });
        
        field.addEventListener('blur', function() {
            this.classList.remove('form-field-focus');
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        const formData = new FormData(form);
        
        for (let [key, value] of formData.entries()) {
            if (!validateField(key, value)) {
                isValid = false;
            }
        }
        
        if (isValid) {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showThankYouModal();
                form.reset();
                currentStep = 1;
                updateFormStep();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        }
    });
    
    function updateFormStep() {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep - 1);
        });
        
        const progressWidth = (currentStep / 3) * 100;
        progressFill.style.width = `${progressWidth}%`;
        currentStepElement.textContent = currentStep;
    }
    
    // Export step navigation functions to global scope
    window.nextStep = function() {
        if (currentStep < 3) {
            // Validate current step
            const currentStepElement = document.getElementById(`step-${currentStep}`);
            const requiredFields = currentStepElement.querySelectorAll('input[required], textarea[required], select[required]');
            let stepValid = true;
            
            requiredFields.forEach(field => {
                if (!validateField(field.name, field.value)) {
                    stepValid = false;
                    field.focus();
                }
            });
            
            if (stepValid) {
                currentStep++;
                updateFormStep();
            }
        }
    };
    
    window.prevStep = function() {
        if (currentStep > 1) {
            currentStep--;
            updateFormStep();
        }
    };
}

// Media tabs functionality
function initializeMediaTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    window.showTab = function(tabName) {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        event.target.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    };
}

// Smooth scrolling
window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed header
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
};

// Scroll indicators
function initializeScrollIndicators() {
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', function() {
            scrollToSection('meet-martin');
        });
    }
}

// Parallax effects
function initializeParallaxEffects() {
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            const yPos = -(scrolled * parallaxSpeed);
            heroImage.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Lightbox functionality
window.openLightbox = function(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
};

// Modal functionality
function showThankYouModal() {
    const modal = document.getElementById('thank-you-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.closeModal = function() {
    const modal = document.getElementById('thank-you-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

// Accessibility enhancements
function initializeAccessibility() {
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            closeModal();
        }
    });
    
    // Focus management for mobile menu
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    // Announce form step changes to screen readers
    const stepElements = document.querySelectorAll('.form-step');
    stepElements.forEach(step => {
        step.setAttribute('aria-live', 'polite');
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
}, 16)); // ~60fps

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could send to error reporting service
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
