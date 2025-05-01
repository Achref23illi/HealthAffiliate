document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('promotion-popup');
    const closeButton = document.getElementById('close-popup');
    const ctaButton = document.getElementById('popup-cta');
    
    if (!popup || !closeButton || !ctaButton) {
        console.error('Popup elements not found');
        return;
    }
    
    // Show popup when page loads (with delay for better UX)
    if (!sessionStorage.getItem('popupClosed')) {
        setTimeout(() => {
            popup.classList.add('show');
        }, 1500); // Show after 1.5 second delay
    }
    
    // Close popup when close button is clicked
    closeButton.addEventListener('click', function() {
        popup.classList.remove('show');
        // Save in sessionStorage to prevent showing again in this session
        sessionStorage.setItem('popupClosed', 'true');
    });
    
    // Close popup when CTA button is clicked
    ctaButton.addEventListener('click', function() {
        popup.classList.remove('show');
        // Save in sessionStorage
        sessionStorage.setItem('popupClosed', 'true');
    });
    
    // Close popup when clicking outside
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            popup.classList.remove('show');
            sessionStorage.setItem('popupClosed', 'true');
        }
    });
});
