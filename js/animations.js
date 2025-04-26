/**
 * Animation Manager
 * Handles scroll-based animations and transitions
 */
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupParallaxEffects();
        this.addDynamicStyles();
    }

    setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation attributes
        document.querySelectorAll('[data-animation]').forEach(element => {
            observer.observe(element);
        });

        // Stagger animations for grid items
        document.querySelectorAll('.comparison-grid, .services-grid, .articles-grid').forEach(grid => {
            const items = grid.querySelectorAll('.comparison-card, .service-card, .article-card');
            items.forEach((item, index) => {
                if (!item.dataset.delay) {
                    item.dataset.delay = (index * 0.1).toFixed(1);
                }
                observer.observe(item);
            });
        });
    }

    setupHoverEffects() {
        // Card hover effects
        document.querySelectorAll('.card, .service-card, .article-card, .comparison-card').forEach(card => {
            card.addEventListener('mouseenter', this.createHoverEffect);
            card.addEventListener('mouseleave', this.removeHoverEffect);
        });

        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                btn.style.setProperty('--x', `${x}px`);
                btn.style.setProperty('--y', `${y}px`);
            });
        });
    }

    createHoverEffect(e) {
        // Create overlay for 3D effect
        const overlay = document.createElement('div');
        overlay.className = 'card-hover-overlay';
        this.appendChild(overlay);
        
        // Calculate hover position for 3D effect
        const updateEffect = (e) => {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 5;
            const rotateX = -((y - centerY) / centerY) * 5;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            overlay.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%)`;
        };
        
        this.addEventListener('mousemove', updateEffect);
        this.dataset.hoverEnabled = true;
        
        // Store event handler reference to remove it later
        this.updateEffectHandler = updateEffect;
    }

    removeHoverEffect() {
        // Reset transform
        this.style.transform = '';
        
        // Remove overlay
        const overlay = this.querySelector('.card-hover-overlay');
        if (overlay) {
            this.removeChild(overlay);
        }
        
        // Remove event handler
        this.removeEventListener('mousemove', this.updateEffectHandler);
        this.dataset.hoverEnabled = false;
    }

    setupParallaxEffects() {
        if (window.matchMedia('(min-width: 768px)').matches && 'ontouchstart' in window === false) {
            // Parallax for hero section background
            const hero = document.querySelector('.hero');
            if (hero) {
                window.addEventListener('scroll', () => {
                    const scrollPosition = window.pageYOffset;
                    const heroHeight = hero.offsetHeight;
                    
                    if (scrollPosition <= heroHeight) {
                        const parallaxOffset = scrollPosition * 0.4;
                        hero.style.backgroundPosition = `50% ${parallaxOffset}px`;
                        
                        // Move hero content in opposite direction for enhanced effect
                        const heroContent = hero.querySelector('.container');
                        if (heroContent) {
                            heroContent.style.transform = `translateY(${scrollPosition * 0.2}px)`;
                        }
                    }
                }, { passive: true });
            }
            
            // Parallax for floating shapes
            const shapes = document.querySelectorAll('.shape');
            if (shapes.length) {
                window.addEventListener('scroll', () => {
                    const scrollPosition = window.pageYOffset;
                    
                    shapes.forEach((shape, index) => {
                        const factor = 0.1 * (index + 1);
                        shape.style.transform = `translate(${scrollPosition * factor * 0.1}px, ${scrollPosition * factor * 0.05}px)`;
                    });
                }, { passive: true });
            }
        }
    }

    animateElement(element) {
        const animation = element.dataset.animation;
        const delay = element.dataset.delay || '0';
        
        element.style.animationDelay = `${delay}s`;
        element.classList.add(`animate-${animation}`);
    }
    
    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Card hover effect overlay */
            .card-hover-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                pointer-events: none;
                border-radius: inherit;
            }
            
            /* Smooth transitions for cards */
            .comparison-card,
            .service-card,
            .article-card {
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                            box-shadow 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            /* Ink ripple effect for buttons */
            .btn {
                overflow: hidden;
            }
            
            .btn::before {
                content: '';
                position: absolute;
                top: var(--y, 50%);
                left: var(--x, 50%);
                width: 0;
                height: 0;
                background: radial-gradient(circle closest-side, rgba(255, 255, 255, 0.2), transparent);
                transform: translate(-50%, -50%);
                transition: width 0.5s ease, height 0.5s ease;
            }
            
            .btn:hover::before {
                width: 200%;
                height: 200%;
            }
            
            /* Enhanced form control animations */
            .form-control {
                transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
            }
            
            .form-control:focus {
                transform: translateY(-2px);
            }
            
            /* Social icon hover animation */
            .social-icon {
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                            background-color 0.3s ease, color 0.3s ease;
            }
            
            /* Form success message animation */
            .form-success-message {
                background-color: #10b981;
                color: white;
                padding: 10px;
                border-radius: 8px;
                margin-top: 16px;
                animation: slideDown 0.5s ease forwards;
                text-align: center;
                font-weight: 500;
            }
            
            @keyframes slideDown {
                from { 
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1; 
                    transform: translateY(0);
                }
            }
            
            /* Add shine effect to cards on hover */
            .card-img-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 50%;
                height: 100%;
                background: linear-gradient(
                    to right,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.3) 100%
                );
                transform: skewX(-25deg);
                z-index: 2;
                transition: left 0.7s ease;
            }
            
            .comparison-card:hover .card-img-container::before,
            .service-card:hover .card-img-container::before,
            .article-card:hover .card-img-container::before {
                left: 100%;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize animation manager
window.animationManager = new AnimationManager();