/**
 * Main JavaScript file for HealthCompare
 */
document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initScrollBehavior();
    setupLazyLoading();
    initAnimations();
    setupTestimonialSlider();

    // Ensure default behavior for anchor tags with href
    const anchorTags = document.querySelectorAll('a[href]');
    anchorTags.forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            const href = anchor.getAttribute('href');
            if (href && href !== '#') {
                // Allow default navigation
            }
        });
    });
    
    // Track buttons for ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--x', `${x}px`);
            this.style.setProperty('--y', `${y}px`);
        });
    });
    
    // Setup form interactions
    setupForms();
});

function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    
    if (!navToggle || !nav) return;
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        document.body.classList.toggle('nav-open');
    });
    
    // Close mobile nav when clicking on links
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', (event) => {
        if (nav.classList.contains('active') && 
            !event.target.closest('nav') && 
            !event.target.closest('.nav-toggle')) {
            navToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
}

function initScrollBehavior() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScroll = 0;
    let scrollThreshold = 50;
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class for header styling
        header.classList.toggle('scrolled', currentScroll > 50);

        // Hide/show header based on scroll direction
        if (Math.abs(currentScroll - lastScroll) > scrollThreshold) {
            if (currentScroll > lastScroll && currentScroll > headerHeight) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            lastScroll = currentScroll;
        }
    }, { passive: true });
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        // Create a new image to preload
                        const preloadImg = new Image();
                        
                        preloadImg.onload = () => {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                            
                            // Handle srcset if available
                            if (img.dataset.srcset) {
                                img.srcset = img.dataset.srcset;
                                img.removeAttribute('data-srcset');
                            }
                        };
                        
                        preloadImg.src = src;
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

function initAnimations() {
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.dataset.animation;
                    const delay = element.dataset.delay || '0';
                    
                    if (animation) {
                        element.style.animationDelay = `${delay}s`;
                        element.classList.add(`animate-${animation}`);
                    }
                    
                    animationObserver.unobserve(element);
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });
        
        document.querySelectorAll('[data-animation]').forEach(el => {
            animationObserver.observe(el);
        });
        
        document.querySelectorAll('.animate-on-scroll').forEach(section => {
            const elements = section.querySelectorAll('[data-animation]');
            elements.forEach((el, index) => {
                if (!el.dataset.delay) {
                    el.dataset.delay = (index * 0.1).toFixed(1);
                }
                animationObserver.observe(el);
            });
        });
    }
}

function setupTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    const testimonials = slider.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.transform = `translateX(${100 * (i - index)}%)`;
            testimonial.style.opacity = i === index ? '1' : '0';
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    // Initialize first testimonial
    showTestimonial(0);
    
    // Add click event to dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showTestimonial(i);
        });
    });
    
    // Auto-rotate testimonials
    let intervalId;
    
    function startAutoRotate() {
        intervalId = setInterval(() => {
            const nextIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(nextIndex);
        }, 5000);
    }
    
    function stopAutoRotate() {
        clearInterval(intervalId);
    }
    
    startAutoRotate();
    
    slider.addEventListener('mouseenter', stopAutoRotate);
    slider.addEventListener('mouseleave', startAutoRotate);
    
    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoRotate();
    }, { passive: true });
    
    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoRotate();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) < swipeThreshold) return;
        
        if (diff > 0) {
            // Swipe left
            const nextIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(nextIndex);
        } else {
            // Swipe right
            const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            showTestimonial(prevIndex);
        }
    }
}

function setupForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (isValid) {
                const submitButton = form.querySelector('[type="submit"]');
                if (submitButton) {
                    submitButton.classList.add('loading');
                    submitButton.disabled = true;
                }
                
                // Simulate form submission (replace with actual form submission)
                setTimeout(() => {
                    form.reset();
                    
                    if (submitButton) {
                        submitButton.classList.remove('loading');
                        submitButton.disabled = false;
                    }
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success-message';
                    successMessage.textContent = 'Merci pour votre inscription !';
                    
                    form.appendChild(successMessage);
                    
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                }, 1500);
            }
        });
        
        // Real-time validation feedback
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('is-invalid') && this.value.trim()) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    });
}