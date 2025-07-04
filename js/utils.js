
// Utility functions and helpers
class Utils {
    // DOM manipulation utilities
    static createElement(tag, className, content) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    }
    
    static query(selector, context = document) {
        return context.querySelector(selector);
    }
    
    static queryAll(selector, context = document) {
        return context.querySelectorAll(selector);
    }
    
    static addClass(element, className) {
        if (element && className) {
            element.classList.add(className);
        }
    }
    
    static removeClass(element, className) {
        if (element && className) {
            element.classList.remove(className);
        }
    }
    
    static toggleClass(element, className) {
        if (element && className) {
            element.classList.toggle(className);
        }
    }
    
    static hasClass(element, className) {
        return element && element.classList.contains(className);
    }
    
    // Event handling utilities
    static on(element, event, handler, options = {}) {
        if (element && event && handler) {
            element.addEventListener(event, handler, options);
        }
    }
    
    static off(element, event, handler) {
        if (element && event && handler) {
            element.removeEventListener(event, handler);
        }
    }
    
    static once(element, event, handler) {
        if (element && event && handler) {
            element.addEventListener(event, handler, { once: true });
        }
    }
    
    static delegate(parent, selector, event, handler) {
        if (parent && selector && event && handler) {
            parent.addEventListener(event, function(e) {
                if (e.target.matches(selector)) {
                    handler.call(e.target, e);
                }
            });
        }
    }
    
    // Throttle and debounce utilities
    static throttle(func, limit) {
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
    
    static debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Animation utilities
    static fadeIn(element, duration = 300) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    static fadeOut(element, duration = 300) {
        if (!element) return;
        
        const start = performance.now();
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = initialOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    static slideDown(element, duration = 300) {
        if (!element) return;
        
        element.style.display = 'block';
        element.style.height = '0';
        element.style.overflow = 'hidden';
        
        const fullHeight = element.scrollHeight;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.height = `${fullHeight * progress}px`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.height = 'auto';
                element.style.overflow = 'visible';
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    static slideUp(element, duration = 300) {
        if (!element) return;
        
        const fullHeight = element.scrollHeight;
        element.style.height = `${fullHeight}px`;
        element.style.overflow = 'hidden';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.height = `${fullHeight * (1 - progress)}px`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // Validation utilities
    static isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    static isPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    static isNotEmpty(value) {
        return value && value.trim().length > 0;
    }
    
    static isMinLength(value, minLength) {
        return value && value.length >= minLength;
    }
    
    static isMaxLength(value, maxLength) {
        return value && value.length <= maxLength;
    }
    
    // URL utilities
    static getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    
    static setUrlParam(param, value) {
        const url = new URL(window.location.href);
        url.searchParams.set(param, value);
        window.history.replaceState({}, '', url);
    }
    
    static removeUrlParam(param) {
        const url = new URL(window.location.href);
        url.searchParams.delete(param);
        window.history.replaceState({}, '', url);
    }
    
    // Local storage utilities
    static setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error setting localStorage:', e);
        }
    }
    
    static getStorage(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            console.error('Error getting localStorage:', e);
            return defaultValue;
        }
    }
    
    static removeStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing localStorage:', e);
        }
    }
    
    // Cookie utilities
    static setCookie(name, value, days = 30) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }
    
    static getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    static deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    
    // Device detection utilities
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    static isTablet() {
        return /iPad|Android|Tablet/i.test(navigator.userAgent);
    }
    
    static isDesktop() {
        return !this.isMobile() && !this.isTablet();
    }
    
    static getViewportWidth() {
        return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    }
    
    static getViewportHeight() {
        return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    }
    
    // Performance utilities
    static requestIdleCallback(callback) {
        if (window.requestIdleCallback) {
            window.requestIdleCallback(callback);
        } else {
            setTimeout(callback, 1);
        }
    }
    
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // String utilities
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    static slugify(str) {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    
    static truncate(str, length) {
        return str.length > length ? str.substring(0, length) + '...' : str;
    }
    
    // Number utilities
    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    static formatCurrency(num, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(num);
    }
    
    static randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Date utilities
    static formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    }
    
    static timeAgo(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'just now';
    }
    
    // Loading utilities
    static showLoader(element) {
        const loader = this.createElement('div', 'loading-spinner');
        loader.innerHTML = '<div class="spinner"></div>';
        element.appendChild(loader);
    }
    
    static hideLoader(element) {
        const loader = element.querySelector('.loading-spinner');
        if (loader) {
            loader.remove();
        }
    }
    
    // Error handling utilities
    static handleError(error, context = 'Application') {
        console.error(`${context} Error:`, error);
        
        // Could send to error reporting service
        if (window.errorReporting) {
            window.errorReporting.report(error, context);
        }
    }
    
    // Accessibility utilities
    static announceToScreenReader(message) {
        const announcement = this.createElement('div', 'sr-only');
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    static trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
}

// Form validation utilities
class FormValidator {
    constructor(form) {
        this.form = form;
        this.rules = {};
        this.errors = {};
    }
    
    addRule(field, rule, message) {
        if (!this.rules[field]) {
            this.rules[field] = [];
        }
        this.rules[field].push({ rule, message });
    }
    
    validate() {
        this.errors = {};
        let isValid = true;
        
        for (const field in this.rules) {
            const element = this.form.querySelector(`[name="${field}"]`);
            if (!element) continue;
            
            const value = element.value;
            
            for (const validation of this.rules[field]) {
                if (!validation.rule(value)) {
                    this.errors[field] = validation.message;
                    isValid = false;
                    break;
                }
            }
        }
        
        return isValid;
    }
    
    showErrors() {
        for (const field in this.errors) {
            const errorElement = this.form.querySelector(`#${field}-error`);
            if (errorElement) {
                errorElement.textContent = this.errors[field];
                errorElement.classList.add('show');
            }
        }
    }
    
    clearErrors() {
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(el => {
            el.textContent = '';
            el.classList.remove('show');
        });
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }
    
    init() {
        this.measurePageLoad();
        this.measureLCP();
        this.measureFID();
        this.measureCLS();
    }
    
    measurePageLoad() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.metrics.pageLoadTime = perfData.loadEventEnd - perfData.loadEventStart;
        });
    }
    
    measureLCP() {
        if ('web-vitals' in window) {
            window.webVitals.getLCP((metric) => {
                this.metrics.lcp = metric.value;
            });
        }
    }
    
    measureFID() {
        if ('web-vitals' in window) {
            window.webVitals.getFID((metric) => {
                this.metrics.fid = metric.value;
            });
        }
    }
    
    measureCLS() {
        if ('web-vitals' in window) {
            window.webVitals.getCLS((metric) => {
                this.metrics.cls = metric.value;
            });
        }
    }
    
    getMetrics() {
        return this.metrics;
    }
}

// Export utilities
window.Utils = Utils;
window.FormValidator = FormValidator;
window.PerformanceMonitor = PerformanceMonitor;

// Initialize performance monitoring
if (window.location.hostname !== 'localhost') {
    const performanceMonitor = new PerformanceMonitor();
}
