/**
 * Form Manager
 * Handles form validation, submission, and user feedback
 */
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFloatingLabels();
        this.setupCharacterCounters();
    }

    setupFormValidation() {
        document.querySelectorAll('form').forEach(form => {
            // Add custom validation styles
            const style = document.createElement('style');
            style.textContent = `
                .form-group {
                    position: relative;
                    margin-bottom: 1.5rem;
                }

                .form-control {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 2px solid var(--light-dark);
                    border-radius: var(--border-radius);
                    transition: all 0.3s ease;
                }

                .form-control:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px var(--primary-light);
                    outline: none;
                }

                .form-control.is-valid {
                    border-color: var(--secondary-color);
                }

                .form-control.is-invalid {
                    border-color: var(--accent-color);
                }

                .validation-message {
                    position: absolute;
                    bottom: -20px;
                    left: 0;
                    font-size: 0.875rem;
                    color: var(--accent-color);
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }

                .validation-message.show {
                    opacity: 1;
                    transform: translateY(0);
                }

                .floating-label {
                    position: absolute;
                    top: 50%;
                    left: 1rem;
                    transform: translateY(-50%);
                    transition: all 0.3s ease;
                    pointer-events: none;
                    color: var(--text-light);
                }

                .form-control:focus ~ .floating-label,
                .form-control:not(:placeholder-shown) ~ .floating-label {
                    top: 0;
                    transform: translateY(-50%) scale(0.85);
                    background: white;
                    padding: 0 0.5rem;
                }

                .character-counter {
                    position: absolute;
                    right: 1rem;
                    bottom: -20px;
                    font-size: 0.75rem;
                    color: var(--text-light);
                }

                .submit-button {
                    position: relative;
                    overflow: hidden;
                }

                .submit-button .spinner {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    display: none;
                }

                .submit-button.loading .spinner {
                    display: block;
                }

                .submit-button.loading .button-text {
                    visibility: hidden;
                }
            `;
            document.head.appendChild(style);

            // Setup form validation
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (this.validateForm(form)) {
                    await this.handleSubmit(form);
                }
            });

            // Real-time validation
            form.querySelectorAll('input, textarea, select').forEach(input => {
                input.addEventListener('input', () => this.validateInput(input));
                input.addEventListener('blur', () => this.validateInput(input));
            });
        });
    }

    setupFloatingLabels() {
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
            const label = document.createElement('label');
            label.className = 'floating-label';
            label.textContent = input.placeholder;
            input.parentNode.appendChild(label);
            
            // Remove placeholder to show floating label
            input.placeholder = '';
        });
    }

    setupCharacterCounters() {
        document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            
            const updateCounter = () => {
                const remaining = parseInt(textarea.maxLength) - textarea.value.length;
                counter.textContent = `${remaining} caractères restants`;
            };
            
            textarea.parentNode.appendChild(counter);
            textarea.addEventListener('input', updateCounter);
            updateCounter();
        });
    }

    validateInput(input) {
        const group = input.closest('.form-group');
        if (!group) return true;

        let isValid = input.checkValidity();
        const message = group.querySelector('.validation-message') || document.createElement('div');
        message.className = 'validation-message';

        // Custom validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(input.value);
            if (!isValid) {
                message.textContent = 'Veuillez entrer une adresse email valide';
            }
        }

        if (input.hasAttribute('minlength') && input.value) {
            const minLength = parseInt(input.getAttribute('minlength'));
            if (input.value.length < minLength) {
                isValid = false;
                message.textContent = `Minimum ${minLength} caractères requis`;
            }
        }

        // Update UI
        input.classList.toggle('is-valid', isValid && input.value);
        input.classList.toggle('is-invalid', !isValid && input.value);
        
        if (!isValid && input.value) {
            message.classList.add('show');
            group.appendChild(message);
        } else {
            message.classList.remove('show');
        }

        return isValid;
    }

    validateForm(form) {
        let isValid = true;
        form.querySelectorAll('input, textarea, select').forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        return isValid;
    }

    async handleSubmit(form) {
        const submitButton = form.querySelector('[type="submit"]');
        if (!submitButton) return;

        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            window.notificationManager.success('Formulaire envoyé avec succès !');
            form.reset();

            // Trigger success callback if defined
            if (typeof form.onSubmitSuccess === 'function') {
                form.onSubmitSuccess();
            }
        } catch (error) {
            window.notificationManager.error('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }
}

// Ensure buttons with href navigate correctly
const buttonsWithHref = document.querySelectorAll('.btn[href]');
buttonsWithHref.forEach(button => {
    button.addEventListener('click', (event) => {
        const href = button.getAttribute('href');
        if (href && href !== '#') {
            window.location.href = href;
        }
    });
});

// Initialize form manager
window.formManager = new FormManager();