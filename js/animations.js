
// Animation utilities and effects
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupTextRevealAnimations();
        this.setupCounterAnimations();
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: [0.1, 0.5, 0.9],
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, observerOptions);
        
        this.observers.set('main', observer);
        
        // Observe all animation elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
    
    triggerAnimation(element) {
        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
            element.classList.add('animate-in');
            
            // Trigger specific animations
            if (element.classList.contains('stat-number')) {
                this.animateCounter(element);
            }
            
            if (element.classList.contains('text-reveal')) {
                this.animateTextReveal(element);
            }
            
            if (element.classList.contains('progress-bar')) {
                this.animateProgressBar(element);
            }
        }, delay);
    }
    
    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        const suffix = element.textContent.replace(/[0-9]/g, '');
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    animateTextReveal(element) {
        const text = element.textContent;
        const letters = text.split('');
        
        element.innerHTML = '';
        
        letters.forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = `all 0.3s ease ${index * 0.05}s`;
            element.appendChild(span);
        });
        
        setTimeout(() => {
            element.querySelectorAll('span').forEach(span => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            });
        }, 100);
    }
    
    animateProgressBar(element) {
        const targetWidth = element.dataset.width || '100%';
        const bar = element.querySelector('.progress-fill');
        
        if (bar) {
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 200);
        }
    }
    
    setupScrollAnimations() {
        let ticking = false;
        
        const updateScrollAnimations = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Parallax backgrounds
            document.querySelectorAll('.parallax-bg').forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            // Fade elements based on scroll
            document.querySelectorAll('.fade-on-scroll').forEach(element => {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top;
                const elementHeight = rect.height;
                const fadeStart = windowHeight;
                const fadeEnd = -elementHeight;
                
                let opacity = 1;
                if (elementTop > fadeStart) {
                    opacity = 0;
                } else if (elementTop < fadeEnd) {
                    opacity = 0;
                } else {
                    const fadeDistance = fadeStart - fadeEnd;
                    const currentDistance = elementTop - fadeEnd;
                    opacity = currentDistance / fadeDistance;
                }
                
                element.style.opacity = opacity;
            });
            
            ticking = false;
        };
        
        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestScrollUpdate);
    }
    
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        if (parallaxElements.length > 0) {
            let ticking = false;
            
            const updateParallax = () => {
                const scrollY = window.scrollY;
                
                parallaxElements.forEach(element => {
                    const speed = parseFloat(element.dataset.speed) || 0.5;
                    const yPos = -(scrollY * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            };
            
            const requestParallaxUpdate = () => {
                if (!ticking) {
                    requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            };
            
            window.addEventListener('scroll', requestParallaxUpdate);
        }
    }
    
    setupTextRevealAnimations() {
        const textRevealElements = document.querySelectorAll('.text-reveal');
        
        textRevealElements.forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateTextReveal(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            observer.observe(element);
        });
    }
    
    setupCounterAnimations() {
        const counterElements = document.querySelectorAll('.counter-animation');
        
        counterElements.forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        if (entry.target.classList.contains('stat-number')) {
                            this.animateCounter(entry.target);
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5
            });
            
            observer.observe(element);
        });
    }
    
    // Public methods for manual animation triggering
    triggerManualAnimation(element, animationType) {
        element.classList.add(`animate-${animationType}`);
    }
    
    resetAnimation(element) {
        element.classList.remove('animate-in');
        element.style.transform = '';
        element.style.opacity = '';
    }
    
    // Stagger animations for groups of elements
    staggerAnimation(elements, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-in');
            }, index * delay);
        });
    }
    
    // Animation chains
    chainAnimations(animations) {
        let delay = 0;
        
        animations.forEach(animation => {
            setTimeout(() => {
                animation.element.classList.add(animation.class);
                if (animation.callback) {
                    animation.callback();
                }
            }, delay);
            
            delay += animation.delay || 300;
        });
    }
}

// Page transition animations
class PageTransitions {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupPageLoad();
        this.setupSectionTransitions();
    }
    
    setupPageLoad() {
        window.addEventListener('load', () => {
            document.body.classList.add('page-loaded');
            
            // Animate hero section
            const heroElements = document.querySelectorAll('.hero .animate-on-scroll');
            animationController.staggerAnimation(heroElements, 200);
        });
    }
    
    setupSectionTransitions() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('section-visible');
                        
                        // Trigger animations for elements in this section
                        const sectionElements = entry.target.querySelectorAll('.animate-on-scroll');
                        sectionElements.forEach((element, index) => {
                            setTimeout(() => {
                                element.classList.add('animate-in');
                            }, index * 100);
                        });
                    }
                });
            }, {
                threshold: 0.2
            });
            
            observer.observe(section);
        });
    }
}

// Smooth scroll enhancements
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupSmoothScrolling();
        this.setupScrollToTop();
    }
    
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed header
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupScrollToTop() {
        // Create scroll to top button
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: var(--gold-primary);
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        document.body.appendChild(scrollToTopBtn);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
            }
        });
        
        // Scroll to top on click
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize animation system
let animationController;
let pageTransitions;
let smoothScroll;

document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        animationController = new AnimationController();
        pageTransitions = new PageTransitions();
        smoothScroll = new SmoothScroll();
    }
});

// Export for use in other modules
window.AnimationController = AnimationController;
window.PageTransitions = PageTransitions;
window.SmoothScroll = SmoothScroll;
