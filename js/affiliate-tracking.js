// Affiliate Link and Conversion Tracking
class AffiliateTracker {
    constructor() {
        this.initTracking();
        this.handleUtmParams();
        this.initConversionTracking();
    }

    initTracking() {
        // Track affiliate link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[rel="sponsored"]');
            if (!link) return;

            // Prevent default to handle the click
            e.preventDefault();

            const trackingData = {
                url: link.href,
                text: link.textContent.trim(),
                location: this.getPageSection(link),
                timestamp: new Date().toISOString(),
                sessionId: this.getSessionId()
            };

            // Log the click
            this.logAffiliateClick(trackingData);

            // Add tracking parameters
            const enrichedUrl = this.enrichUrl(link.href, trackingData);
            
            // Navigate after brief delay to ensure tracking
            setTimeout(() => {
                window.open(enrichedUrl, '_blank', 'noopener');
            }, 100);
        });
    }

    handleUtmParams() {
        // Store UTM parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
        
        const utmData = {};
        utmParams.forEach(param => {
            const value = urlParams.get(param);
            if (value) {
                utmData[param] = value;
                sessionStorage.setItem(param, value);
            }
        });

        if (Object.keys(utmData).length > 0) {
            this.logUtmData(utmData);
        }
    }

    initConversionTracking() {
        // Track successful form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('newsletter-form')) {
                this.trackConversion('newsletter_signup');
            } else if (e.target.id === 'contactForm') {
                this.trackConversion('contact_form');
            }
        });

        // Track service comparisons
        document.querySelectorAll('.comparison-table .btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.trackConversion('comparison_click', {
                    service: btn.closest('td').previousElementSibling.textContent.trim()
                });
            });
        });
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('affiliate_session_id');
        if (!sessionId) {
            sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('affiliate_session_id', sessionId);
        }
        return sessionId;
    }

    getPageSection(element) {
        const sections = ['hero', 'featured-comparisons', 'featured-services', 'recent-articles'];
        for (const section of sections) {
            if (element.closest(`.${section}`)) {
                return section;
            }
        }
        return 'other';
    }

    enrichUrl(url, data) {
        const enrichedUrl = new URL(url);
        
        // Add tracking parameters
        enrichedUrl.searchParams.set('ref', 'healthcompare');
        enrichedUrl.searchParams.set('session', data.sessionId);
        
        // Add stored UTM parameters
        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
        utmParams.forEach(param => {
            const value = sessionStorage.getItem(param);
            if (value) {
                enrichedUrl.searchParams.set(param, value);
            }
        });

        return enrichedUrl.toString();
    }

    logAffiliateClick(data) {
        console.info('Affiliate Click:', data);
        
        // Send to analytics
        if (window.healthCompareAnalytics) {
            window.healthCompareAnalytics.trackEvent('affiliate_click', data);
        }
    }

    logUtmData(data) {
        console.info('UTM Data:', data);
    }

    trackConversion(type, data = {}) {
        const conversionData = {
            type,
            ...data,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId(),
            path: window.location.pathname
        };

        console.info('Conversion:', conversionData);
        
        // Send to analytics
        if (window.healthCompareAnalytics) {
            window.healthCompareAnalytics.trackEvent('conversion', conversionData);
        }
    }
}

// Initialize affiliate tracking
window.affiliateTracker = new AffiliateTracker();
