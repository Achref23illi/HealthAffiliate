/**
 * Simple Mobile Navigation Menu
 * Handles the mobile navigation toggle
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get required elements
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    
    if (!navToggle || !nav) return;
    
    // Toggle menu when nav button is clicked
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });
    
    // Close menu when a nav link is clicked
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        // Only if menu is open and click is outside menu and toggle button
        if (nav.classList.contains('active') && 
            !event.target.closest('nav') && 
            !event.target.closest('.nav-toggle')) {
            
            navToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
});