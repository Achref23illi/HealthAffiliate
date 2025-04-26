/**
 * Loading Management System
 * Handles resource loading and provides visual feedback
 */
class ResourceLoadingManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingIndicators();
        this.optimizeImageLoading();
        this.handleDynamicContent();
    }

    setupLoadingIndicators() {
        // Create loading bar at the top of the page
        const loadingBar = document.createElement('div');
        loadingBar.className = 'page-loading-bar';
        document.body.appendChild(loadingBar);

        // Add loading bar styles
        const style = document.createElement('style');
        style.textContent = `
            .page-loading-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: #3498db;
                transform: scaleX(0);
                transform-origin: left;
                transition: transform 0.3s ease;
                z-index: 1000;
            }

            .page-loading-bar.loading {
                animation: loading-progress 2s ease infinite;
            }

            @keyframes loading-progress {
                0% { transform: scaleX(0); }
                50% { transform: scaleX(0.7); }
                100% { transform: scaleX(0.95); }
            }

            .loading-skeleton {
                background: linear-gradient(
                    90deg,
                    #f0f0f0 25%,
                    #f8f8f8 37%,
                    #f0f0f0 63%
                );
                background-size: 400% 100%;
                animation: skeleton-loading 1.4s ease infinite;
            }

            @keyframes skeleton-loading {
                0% { background-position: 100% 50%; }
                100% { background-position: 0 50%; }
            }

            .content-placeholder {
                min-height: 200px;
                border-radius: 8px;
                overflow: hidden;
            }

            .lazy-load {
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .lazy-load.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    optimizeImageLoading() {
        // Set up intersection observer for images
        const imageObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            this.loadImage(img);
                        }
                        observer.unobserve(img);
                    }
                });
            },
            {
                rootMargin: '50px 0px',
                threshold: 0.01
            }
        );

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.classList.add('lazy-load');
            imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const tempImage = new Image();
        
        tempImage.onload = () => {
            img.src = tempImage.src;
            img.classList.add('loaded');
            
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        };

        tempImage.src = img.dataset.src;
    }

    handleDynamicContent() {
        // Create skeleton screens for dynamic content
        document.querySelectorAll('[data-dynamic-content]').forEach(element => {
            const placeholder = this.createLoadingPlaceholder(element);
            element.parentNode.insertBefore(placeholder, element);
            element.style.display = 'none';

            // Simulate content loading (remove in production)
            setTimeout(() => {
                placeholder.remove();
                element.style.display = '';
                element.classList.add('lazy-load');
                requestAnimationFrame(() => {
                    element.classList.add('loaded');
                });
            }, Math.random() * 1000 + 500);
        });
    }

    createLoadingPlaceholder(element) {
        const placeholder = document.createElement('div');
        placeholder.className = 'content-placeholder loading-skeleton';
        placeholder.style.height = element.offsetHeight + 'px';
        return placeholder;
    }

    showPageLoadingBar() {
        const bar = document.querySelector('.page-loading-bar');
        bar.classList.add('loading');
    }

    hidePageLoadingBar() {
        const bar = document.querySelector('.page-loading-bar');
        bar.style.transform = 'scaleX(1)';
        setTimeout(() => {
            bar.style.transform = 'scaleX(0)';
            bar.classList.remove('loading');
        }, 200);
    }

    // Call this when starting an AJAX request
    startLoading() {
        this.showPageLoadingBar();
    }

    // Call this when AJAX request completes
    finishLoading() {
        this.hidePageLoadingBar();
    }
}

// Initialize the loading manager
window.loadingManager = new ResourceLoadingManager();