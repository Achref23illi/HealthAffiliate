/**
 * Testimonial Slider Manager
 * Handles testimonial display and transitions with auto-rotation
 */
class TestimonialManager {
    constructor() {
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 seconds between slides
        this.isTransitioning = false;
        this.init();
    }

    init() {
        // Get elements
        this.slider = document.querySelector('.testimonial-slider');
        if (!this.slider) return;
        
        this.testimonials = this.slider.querySelectorAll('.testimonial');
        if (!this.testimonials.length) return;
        
        this.dots = document.querySelectorAll('.testimonial-dot');
        
        // Set up dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Initialize first slide
        this.updateSlides();
        
        // Set up autoplay
        this.startAutoplay();
        
        // Pause autoplay on hover or focus
        this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
        this.slider.addEventListener('mouseleave', () => this.startAutoplay());
        this.slider.addEventListener('focusin', () => this.stopAutoplay());
        this.slider.addEventListener('focusout', () => this.startAutoplay());
        
        // Add touch support
        this.setupTouchSupport();
        
        // Add resize handling for responsiveness
        window.addEventListener('resize', () => this.handleResize());
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.currentIndex++;
        if (this.currentIndex >= this.testimonials.length) {
            this.currentIndex = 0;
        }
        
        this.updateSlides();
        setTimeout(() => { this.isTransitioning = false; }, 500); // Match the CSS transition time
    }
    
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        this.isTransitioning = true;
        
        this.currentIndex = index;
        this.updateSlides();
        
        setTimeout(() => { this.isTransitioning = false; }, 500); // Match the CSS transition time
    }
    
    updateSlides() {
        // Set position of all slides
        this.testimonials.forEach((testimonial, index) => {
            const offset = (index - this.currentIndex) * 100;
            testimonial.style.transform = `translateX(${offset}%)`;
            testimonial.setAttribute('aria-hidden', index !== this.currentIndex);
        });
        
        // Update active dot
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
            dot.setAttribute('aria-selected', index === this.currentIndex);
        });
        
        // Announce to screen readers
        this.announceSlideChange();
    }
    
    startAutoplay() {
        if (this.autoplayInterval) return;
        
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }
    
    stopAutoplay() {
        if (!this.autoplayInterval) return;
        
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
    }
    
    setupTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.slider.addEventListener('touchstart', (event) => {
            touchStartX = event.changedTouches[0].screenX;
            this.stopAutoplay();
        }, false);
        
        this.slider.addEventListener('touchend', (event) => {
            touchEndX = event.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
            this.startAutoplay();
        }, false);
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50; // Minimum distance for swipe
        
        if (startX - endX > threshold) {
            // Swipe left
            this.nextSlide();
        } else if (endX - startX > threshold) {
            // Swipe right
            this.prevSlide();
        }
    }
    
    prevSlide() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.testimonials.length - 1;
        }
        
        this.updateSlides();
        setTimeout(() => { this.isTransitioning = false; }, 500); // Match the CSS transition time
    }
    
    handleResize() {
        // Reset position of current slide in case layout changes
        this.updateSlides();
    }
    
    announceSlideChange() {
        // Create or update a live region for screen readers
        let liveRegion = document.getElementById('testimonial-live');
        
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'testimonial-live';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'visually-hidden';
            document.body.appendChild(liveRegion);
        }
        
        // Get the testimonial information
        const currentTestimonial = this.testimonials[this.currentIndex];
        const testimonialText = currentTestimonial.querySelector('p').textContent;
        const authorName = currentTestimonial.querySelector('.testimonial-author strong').textContent;
        
        // Update the live region with new information
        liveRegion.textContent = `Témoignage ${this.currentIndex + 1} sur ${this.testimonials.length}: ${testimonialText} - ${authorName}`;
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialManager();
});