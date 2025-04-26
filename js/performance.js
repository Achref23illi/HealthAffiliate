/**
 * Performance optimizations for HealthCompare
 * Handles image loading, resource hints, and performance monitoring
 */
class PerformanceManager {
    constructor() {
        this.initImageOptimizations();
        this.initResourceHints();
        this.initPerformanceMetrics();
    }

    initImageOptimizations() {
        // Set up intersection observer for images
        const imageObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
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
            imageObserver.observe(img);
            
            // Add loading="lazy" for browsers that support it
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
        });
    }

    loadImage(img) {
        // Create a new image to preload
        const preloadImg = new Image();
        
        preloadImg.onload = () => {
            img.src = preloadImg.src;
            img.classList.add('loaded');
            
            // Handle srcset if available
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        };

        preloadImg.src = img.dataset.src;
    }

    initResourceHints() {
        // Preconnect to external domains
        const domains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });

        // Prefetch next pages on hover
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (link.href && 
                    link.href.startsWith(window.location.origin) && 
                    !link.prefetched) {
                    const prefetchLink = document.createElement('link');
                    prefetchLink.rel = 'prefetch';
                    prefetchLink.href = link.href;
                    document.head.appendChild(prefetchLink);
                    link.prefetched = true;
                }
            });
        });
    }

    initPerformanceMetrics() {
        if ('PerformanceObserver' in window) {
            // Observe LCP
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.info('LCP:', lastEntry.startTime);
                this.reportMetric('LCP', lastEntry.startTime);
            });
            
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Observe FID
            const fidObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.info('FID:', entry.processingStart - entry.startTime);
                    this.reportMetric('FID', entry.processingStart - entry.startTime);
                });
            });
            
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Observe CLS
            let clsValue = 0;
            let clsEntries = [];

            const clsObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        clsEntries.push(entry);
                    }
                });
                
                console.info('CLS:', clsValue);
                this.reportMetric('CLS', clsValue);
            });
            
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }

    reportMetric(name, value) {
        // Send metrics to analytics
        if (window.healthCompareAnalytics) {
            window.healthCompareAnalytics.trackPerformance(name, value);
        }
    }

    // Static method to get performance data
    static getNavigationTiming() {
        if (performance.getEntriesByType) {
            const navigation = performance.getEntriesByType('navigation')[0];
            const timing = {
                dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcpConnection: navigation.connectEnd - navigation.connectStart,
                serverResponse: navigation.responseEnd - navigation.requestStart,
                domInteractive: navigation.domInteractive,
                domComplete: navigation.domComplete,
                loadComplete: navigation.loadEventEnd,
                firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
                firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
            };
            return timing;
        }
        return null;
    }
}

// Initialize performance optimizations
window.performanceManager = new PerformanceManager();