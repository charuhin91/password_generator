/**
 * Utility functions for password operations
 */

class PasswordUtils {
    /**
     * Validate password against common requirements
     * @param {string} password - Password to validate
     * @param {Object} requirements - Validation requirements
     * @returns {Object} Validation result
     */
    static validatePassword(password, requirements = {}) {
        const {
            minLength = 8,
            requireLowercase = true,
            requireUppercase = true,
            requireNumbers = true,
            requireSymbols = false
        } = requirements;

        const errors = [];

        if (password.length < minLength) {
            errors.push(`Password must be at least ${minLength} characters long`);
        }

        if (requireLowercase && !/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }

        if (requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }

        if (requireNumbers && !/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }

        if (requireSymbols && !/[^a-zA-Z0-9]/.test(password)) {
            errors.push('Password must contain at least one symbol');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    static async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    }

    /**
     * Generate multiple passwords at once
     * @param {number} count - Number of passwords to generate
     * @param {Object} options - Password generation options
     * @returns {string[]} Array of generated passwords
     */
    static generateMultiplePasswords(count, options) {
        const generator = new (require('./passwordGenerator.js'))();
        const passwords = [];
        
        for (let i = 0; i < count; i++) {
            passwords.push(generator.generatePassword(options));
        }
        
        return passwords;
    }
}

// Export for use in Node.js or browsers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PasswordUtils;
}