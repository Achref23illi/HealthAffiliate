/**
 * Toast Notification System
 * Provides user feedback for actions and events
 */
class NotificationManager {
    constructor() {
        this.init();
    }

    init() {
        // Create notification container
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .toast {
                padding: 12px 24px;
                border-radius: 8px;
                background: white;
                color: #333;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                transform: translateX(120%);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                max-width: 400px;
            }

            .toast.show {
                transform: translateX(0);
                opacity: 1;
            }

            .toast.success {
                border-left: 4px solid #2ecc71;
            }

            .toast.error {
                border-left: 4px solid #e74c3c;
            }

            .toast.info {
                border-left: 4px solid #3498db;
            }

            .toast-icon {
                width: 20px;
                height: 20px;
                flex-shrink: 0;
            }

            .toast-content {
                flex: 1;
                font-size: 0.95rem;
            }

            .toast-close {
                width: 16px;
                height: 16px;
                opacity: 0.5;
                cursor: pointer;
                flex-shrink: 0;
                transition: opacity 0.2s ease;
            }

            .toast-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Create icon based on type
        const icon = this.createIcon(type);
        
        // Create content
        const content = document.createElement('div');
        content.className = 'toast-content';
        content.textContent = message;
        
        // Create close button
        const close = this.createCloseButton();
        
        toast.appendChild(icon);
        toast.appendChild(content);
        toast.appendChild(close);
        
        // Add to container
        this.container.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Set up auto-dismiss
        const dismissTimeout = setTimeout(() => {
            this.dismiss(toast);
        }, duration);
        
        // Handle click to dismiss
        toast.addEventListener('click', () => {
            clearTimeout(dismissTimeout);
            this.dismiss(toast);
        });
        
        return toast;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    dismiss(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }

    createIcon(type) {
        const icon = document.createElement('div');
        icon.className = 'toast-icon';
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        
        let path;
        switch (type) {
            case 'success':
                path = 'M20 6L9 17l-5-5';
                svg.style.color = '#2ecc71';
                break;
            case 'error':
                path = 'M18 6L6 18M6 6l12 12';
                svg.style.color = '#e74c3c';
                break;
            default:
                path = 'M12 8v4m0 4h.01M22 12a10 10 0 11-20 0 10 10 0 0120 0z';
                svg.style.color = '#3498db';
        }
        
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path);
        svg.appendChild(pathElement);
        icon.appendChild(svg);
        
        return icon;
    }

    createCloseButton() {
        const close = document.createElement('div');
        close.className = 'toast-close';
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M18 6L6 18M6 6l12 12');
        svg.appendChild(path);
        close.appendChild(svg);
        
        return close;
    }
}

// Initialize notification system
window.notificationManager = new NotificationManager();