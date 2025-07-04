// Utility Functions

// Device detection
const DeviceUtils = {
    isMobile: () => window.innerWidth <= 768,
    isTablet: () => window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: () => window.innerWidth > 1024,

    // Touch device detection
    isTouch: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,

    // Browser detection
    getBrowser: () => {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Chrome')) return 'chrome';
        if (userAgent.includes('Firefox')) return 'firefox';
        if (userAgent.includes('Safari')) return 'safari';
        if (userAgent.includes('Edge')) return 'edge';
        return 'unknown';
    }
};

// Local Storage utilities
const StorageUtils = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },

    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
};

// URL utilities
const UrlUtils = {
    getParams: () => new URLSearchParams(window.location.search),

    getParam: (name, defaultValue = null) => {
        const params = new URLSearchParams(window.location.search);
        return params.get(name) || defaultValue;
    },

    setParam: (name, value) => {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        history.pushState({}, '', url);
    },

    removeParam: (name) => {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        history.pushState({}, '', url);
    }
};

// Validation utilities
const ValidationUtils = {
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    phone: (phone) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    },

    name: (name) => {
        return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name);
    },

    required: (value) => {
        return value && value.toString().trim().length > 0;
    },

    minLength: (value, min) => {
        return value && value.toString().trim().length >= min;
    },

    maxLength: (value, max) => {
        return !value || value.toString().trim().length <= max;
    }
};

// Date utilities
const DateUtils = {
    format: (date, format = 'MM/DD/YYYY') => {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();

        return format
            .replace('MM', month)
            .replace('DD', day)
            .replace('YYYY', year);
    },

    timeAgo: (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }
};

// DOM utilities
const DomUtils = {
    createElement: (tag, attributes = {}, children = []) => {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        return element;
    },

    addClass: (element, className) => {
        if (element && className) {
            element.classList.add(className);
        }
    },

    removeClass: (element, className) => {
        if (element && className) {
            element.classList.remove(className);
        }
    },

    toggleClass: (element, className) => {
        if (element && className) {
            element.classList.toggle(className);
        }
    },

    hasClass: (element, className) => {
        return element && className && element.classList.contains(className);
    }
};

// Animation utilities
const AnimationUtils = {
    fadeIn: (element, duration = 300) => {
        if (!element) return;

        element.style.opacity = '0';
        element.style.display = 'block';

        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            element.style.opacity = progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    },

    fadeOut: (element, duration = 300) => {
        if (!element) return;

        const startOpacity = parseFloat(window.getComputedStyle(element).opacity);
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            element.style.opacity = startOpacity * (1 - progress);

            if (progress >= 1) {
                element.style.display = 'none';
            } else {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    },

    slideDown: (element, duration = 300) => {
        if (!element) return;

        element.style.display = 'block';
        element.style.height = '0';
        element.style.overflow = 'hidden';

        const targetHeight = element.scrollHeight;
        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            element.style.height = `${targetHeight * progress}px`;

            if (progress >= 1) {
                element.style.height = 'auto';
                element.style.overflow = 'visible';
            } else {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    },

    slideUp: (element, duration = 300) => {
        if (!element) return;

        const startHeight = element.offsetHeight;
        const startTime = performance.now();

        element.style.overflow = 'hidden';

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            element.style.height = `${startHeight * (1 - progress)}px`;

            if (progress >= 1) {
                element.style.display = 'none';
                element.style.height = 'auto';
                element.style.overflow = 'visible';
            } else {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }
};

// Performance utilities
const PerformanceUtils = {
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

    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    measurePerformance: (name, func) => {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    }
};

// Analytics utilities
const AnalyticsUtils = {
    trackPageView: (page) => {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: page,
                page_location: window.location.href
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'PageView');
        }

        console.log(`Page view tracked: ${page}`);
    },

    trackEvent: (eventName, parameters = {}) => {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, parameters);
        }

        console.log(`Event tracked: ${eventName}`, parameters);
    },

    trackFormSubmission: (formName) => {
        AnalyticsUtils.trackEvent('form_submit', {
            form_name: formName,
            timestamp: new Date().toISOString()
        });
    }
};

// Error handling utilities
const ErrorUtils = {
    handleError: (error, context = '') => {
        console.error(`Error in ${context}:`, error);

        // Send to error reporting service (e.g., Sentry)
        if (typeof Sentry !== 'undefined') {
            Sentry.captureException(error, {
                tags: { context }
            });
        }
    },

    showUserError: (message, type = 'error') => {
        // Create and show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = `alert alert-${type}`;
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : '#10b981'};
            color: white;
            padding: 16px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
};

// Export utilities
window.DeviceUtils = DeviceUtils;
window.StorageUtils = StorageUtils;
window.UrlUtils = UrlUtils;
window.ValidationUtils = ValidationUtils;
window.DateUtils = DateUtils;
window.DomUtils = DomUtils;
window.AnimationUtils = AnimationUtils;
window.PerformanceUtils = PerformanceUtils;
window.AnalyticsUtils = AnalyticsUtils;
window.ErrorUtils = ErrorUtils;

// Global error handler
window.addEventListener('error', (event) => {
    ErrorUtils.handleError(event.error, 'Global error handler');
});

window.addEventListener('unhandledrejection', (event) => {
    ErrorUtils.handleError(event.reason, 'Unhandled promise rejection');
});