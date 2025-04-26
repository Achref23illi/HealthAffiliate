// Performance and Analytics Tracking
class Analytics {
    constructor() {
        this.initPerformanceTracking();
        this.initInteractionTracking();
    }

    initPerformanceTracking() {
        // Track page load performance
        if (window.performance) {
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
                
                // Log performance metrics
                console.info('Page Load Time:', pageLoadTime);
                console.info('DOM Ready Time:', domReadyTime);
                
                // Track Core Web Vitals
                if ('web-vital' in window) {
                    webVitals.getLCP(metric => this.logWebVital('LCP', metric));
                    webVitals.getFID(metric => this.logWebVital('FID', metric));
                    webVitals.getCLS(metric => this.logWebVital('CLS', metric));
                }
            });
        }
    }

    initInteractionTracking() {
        // Track user interactions
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, .card-content');
            if (!target) return;

            const interactionData = {
                type: target.tagName.toLowerCase(),
                location: this.getElementPath(target),
                timestamp: new Date().toISOString()
            };

            // Track specific interactions
            if (target.classList.contains('btn-primary')) {
                this.trackCTA(interactionData);
            } else if (target.closest('.comparison-card')) {
                this.trackComparison(interactionData);
            }
        });

        // Track scroll depth
        this.initScrollTracking();
    }

    initScrollTracking() {
        let maxScroll = 0;
        const scrollThresholds = [25, 50, 75, 90];
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                scrollThresholds.forEach(threshold => {
                    if (scrollPercent >= threshold) {
                        console.info(`Scroll depth: ${threshold}%`);
                        scrollThresholds.splice(scrollThresholds.indexOf(threshold), 1);
                    }
                });
            }
        }, 1000));
    }

    trackCTA(data) {
        console.info('CTA Interaction:', data);
    }

    trackComparison(data) {
        console.info('Comparison Interaction:', data);
    }

    logWebVital(name, metric) {
        console.info(`${name}:`, metric.value);
    }

    getElementPath(element) {
        const path = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.nodeName.toLowerCase();
            if (element.id) {
                selector += `#${element.id}`;
            } else if (element.className) {
                selector += `.${element.className.replace(/\s+/g, '.')}`;
            }
            path.unshift(selector);
            element = element.parentNode;
        }
        return path.join(' > ');
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize analytics
window.healthCompareAnalytics = new Analytics();
