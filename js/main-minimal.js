/**
 * Minimal JavaScript file for HealthCompare
 * This version ensures links work properly with only essential functionality
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // Optional visual enhancements that don't affect navigation
    initScrollBehavior();
    setupTestimonialSlider();
    
    // EMERGENCY FIX: Make "En savoir plus" buttons work properly
    document.querySelectorAll('a[href="#service-details"], a[href="#how-it-works"], a.btn-outline').forEach(button => {
        button.onclick = function(event) {
            const href = this.getAttribute('href');
            
            // If it's a hash link, handle smooth scrolling
            if (href && href.startsWith('#')) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    event.preventDefault();
                    const offsetTop = targetElement.offsetTop - 20;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    return;
                }
            }
            
            // For ALL other links - let them work naturally without interference
            return true;
        };
    });
    
    // Handle in-page navigation links (#links) with smooth scrolling
    document.querySelectorAll('a[href^="#"]:not([href="#service-details"]):not([href="#how-it-works"]):not(.btn-outline)').forEach(anchor => {
        // Only add special handling to hash links
        anchor.addEventListener('click', (event) => {
            const href = anchor.getAttribute('href');
            
            // Skip empty hash links (just #)
            if (href === '#') {
                event.preventDefault();
                return;
            }
            
            // Handle in-page navigation with smooth scrolling
            if (href.length > 1) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    event.preventDefault();
                    const offsetTop = targetElement.offsetTop - 20;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // IMPORTANT: We don't add any event handlers to normal links
    // This ensures they work with default browser behavior
});


function initScrollBehavior() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        // Just visual effects for the header on scroll
        header.classList.toggle('scrolled', window.pageYOffset > 50);
    }, { passive: true });
}

function setupTestimonialSlider() {
    // Basic testimonial slider functionality
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    // Simple implementation that doesn't interfere with links
}
