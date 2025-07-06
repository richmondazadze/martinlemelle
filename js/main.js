// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeContactForm();
    initializeAccessibility();
    initializeLazyLoading();
    initializeGalleryOptimizations();
});

// Navigation functionality
function initializeNavigation() {
    const nav = document.querySelector('.nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Handle scroll behavior
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', 
            navToggle.classList.contains('active').toString());
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const fields = {
        firstName: { required: true, minLength: 2 },
        lastName: { required: true, minLength: 2 },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        subject: { required: true, minLength: 5 },
        message: { required: true, minLength: 20 }
    };
    
    function validateField(fieldName, value) {
        const rules = fields[fieldName];
        if (!rules) return true;
        if (rules.required && !value) return false;
        if (rules.minLength && value.length < rules.minLength) return false;
        if (rules.pattern && !rules.pattern.test(value)) return false;
        return true;
    }
    
    function showError(fieldName, message) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const errorDiv = field.parentElement.querySelector('.error-message') || 
            document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        if (!field.parentElement.querySelector('.error-message')) {
            field.parentElement.appendChild(errorDiv);
        }
    }
    
    function hideError(fieldName) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const errorDiv = field.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    // Validate on blur
    Object.keys(fields).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        field.addEventListener('blur', function() {
            const value = this.value.trim();
            if (!validateField(fieldName, value)) {
                showError(fieldName, `Please enter a valid ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            } else {
                hideError(fieldName);
            }
        });
        
        // Clear error on input
        field.addEventListener('input', function() {
            hideError(fieldName);
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // Validate all fields
        Object.keys(fields).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field) return;

            const value = field.value.trim();
            if (!validateField(fieldName, value)) {
                isValid = false;
                showError(fieldName, `Please enter a valid ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            } else {
                hideError(fieldName);
            }
        });
        
        if (isValid) {
            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
                showSuccessModal();
                form.reset();
        }
    });
}

// Modal functionality
function showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Message Sent!</h3>
            <p>Thank you for your message. We'll get back to you soon.</p>
            <button onclick="closeModal()" class="btn-primary">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    }

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Accessibility enhancements
function initializeAccessibility() {
    // Keyboard navigation for mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Make navigation toggle keyboard accessible
    const navToggle = document.getElementById('nav-toggle');
    navToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
}

// Lazy loading for images
function initializeLazyLoading() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        loadAllImages();
        return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img); // Stop observing once loaded
            }
        });
    }, {
        rootMargin: '50px 0px', // Start loading 50px before image comes into view
        threshold: 0.01
    });

    // Observe all images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Hide loading indicator after a short delay to show the grid
    setTimeout(() => {
        const loadingIndicator = document.getElementById('gallery-loading');
        const galleryGrid = document.getElementById('gallery-grid');
        if (loadingIndicator && galleryGrid) {
            loadingIndicator.style.display = 'none';
            galleryGrid.classList.add('loaded');
        }
    }, 500);
}

function loadImage(img) {
    if (!img.dataset.src) return;

    // Add loading state
    img.classList.add('loading');

    // Create a temporary image to preload
    const tempImage = new Image();
    
    tempImage.onload = function() {
        img.src = this.src;
        img.classList.remove('loading');
        img.classList.add('loaded');
        img.removeAttribute('data-src');
        
        // Trigger layout recalculation for masonry if needed
        if (typeof applyMasonry === 'function') {
            setTimeout(applyMasonry, 100);
        }
    };

    tempImage.onerror = function() {
        // Handle loading error
        img.classList.remove('loading');
        handleGalleryError(img);
    };

    tempImage.src = img.dataset.src;
}

function loadAllImages() {
    // Fallback for browsers without Intersection Observer
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        }
    });

    // Hide loading indicator for fallback
    setTimeout(() => {
        const loadingIndicator = document.getElementById('gallery-loading');
        const galleryGrid = document.getElementById('gallery-grid');
        if (loadingIndicator && galleryGrid) {
            loadingIndicator.style.display = 'none';
            galleryGrid.classList.add('loaded');
        }
    }, 500);
}

// Gallery-specific optimizations
function initializeGalleryOptimizations() {
    // Preload critical images (first few visible ones)
    const criticalImages = document.querySelectorAll('.gallery-grid img[data-src]:nth-child(-n+4)');
    criticalImages.forEach(img => {
        if (img.dataset.src) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.dataset.src;
            document.head.appendChild(link);
        }
    });

    // Add loading priority for above-the-fold images
    const aboveFoldImages = document.querySelectorAll('.gallery-grid img[data-src]:nth-child(-n+6)');
    aboveFoldImages.forEach(img => {
        img.setAttribute('loading', 'eager'); // Load immediately
    });

    // Debounce masonry updates for better performance
    let masonryTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(masonryTimeout);
        masonryTimeout = setTimeout(() => {
            if (typeof applyMasonry === 'function') {
                applyMasonry();
            }
        }, 200);
    });
}

// Debounce function for performance
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

// Enhanced error handling for gallery
function handleGalleryError(img) {
    img.classList.add('error');
    img.classList.remove('loaded');
    
    // Add retry functionality
    img.addEventListener('click', () => {
        if (img.classList.contains('error')) {
            img.classList.remove('error');
            img.classList.add('loading');
            loadImage(img);
        }
    });
    
    console.error('Failed to load image:', img.dataset.src);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message);
        });

// Initialize on load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
            });
