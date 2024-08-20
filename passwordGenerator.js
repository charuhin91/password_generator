/**
 * Secure Password Generator
 * Generates cryptographically secure random passwords
 */

class PasswordGenerator {
    constructor() {
        this.characterSets = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
    }

    /**
     * Generate a secure random password
     * @param {Object} options - Password generation options
     * @param {number} options.length - Password length (default: 12)
     * @param {boolean} options.includeLowercase - Include lowercase letters
     * @param {boolean} options.includeUppercase - Include uppercase letters
     * @param {boolean} options.includeNumbers - Include numbers
     * @param {boolean} options.includeSymbols - Include symbols
     * @returns {string} Generated password
     */
    generatePassword(options = {}) {
        const {
            length = 12,
            includeLowercase = true,
            includeUppercase = true,
            includeNumbers = true,
            includeSymbols = true
        } = options;

        // Validate input
        if (length < 4) {
            throw new Error('Password length must be at least 4 characters');
        }

        // Build character pool based on selected options
        let characterPool = '';
        if (includeLowercase) characterPool += this.characterSets.lowercase;
        if (includeUppercase) characterPool += this.characterSets.uppercase;
        if (includeNumbers) characterPool += this.characterSets.numbers;
        if (includeSymbols) characterPool += this.characterSets.symbols;

        if (characterPool.length === 0) {
            throw new Error('At least one character type must be selected');
        }

        // Generate password using cryptographically secure random values
        const passwordArray = new Array(length);
        const randomValues = new Uint32Array(length);
        
        // Get secure random values
        crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            const randomIndex = randomValues[i] % characterPool.length;
            passwordArray[i] = characterPool[randomIndex];
        }

        // Ensure at least one character from each selected type is included
        this._ensureCharacterTypes(passwordArray, options, characterPool);

        return passwordArray.join('');
    }

    /**
     * Ensure password contains at least one character from each selected type
     * @private
     */
    _ensureCharacterTypes(passwordArray, options, characterPool) {
        const types = [
            { enabled: options.includeLowercase, set: this.characterSets.lowercase },
            { enabled: options.includeUppercase, set: this.characterSets.uppercase },
            { enabled: options.includeNumbers, set: this.characterSets.numbers },
            { enabled: options.includeSymbols, set: this.characterSets.symbols }
        ].filter(type => type.enabled);

        types.forEach(type => {
            const hasType = passwordArray.some(char => type.set.includes(char));
            if (!hasType) {
                // Replace a random position with a character from the missing type
                const randomIndex = Math.floor(Math.random() * passwordArray.length);
                const randomCharIndex = Math.floor(Math.random() * type.set.length);
                passwordArray[randomIndex] = type.set[randomCharIndex];
            }
        });
    }

    /**
     * Calculate password strength score (0-100)
     * @param {string} password - Password to evaluate
     * @returns {number} Strength score
     */
    calculateStrength(password) {
        let score = 0;
        
        // Length bonus
        score += Math.min(password.length * 4, 25);
        
        // Character variety bonuses
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^a-zA-Z0-9]/.test(password)) score += 20;
        
        // Deductions for patterns
        if (/(.)\1{2,}/.test(password)) score -= 15; // Repeated characters
        if (/^[a-zA-Z]+$/.test(password)) score -= 10; // Letters only
        if (/^\d+$/.test(password)) score -= 20; // Numbers only
        
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Get strength description based on score
     * @param {number} score - Strength score
     * @returns {string} Strength description
     */
    getStrengthDescription(score) {
        if (score >= 80) return 'Very Strong';
        if (score >= 60) return 'Strong';
        if (score >= 40) return 'Good';
        if (score >= 20) return 'Weak';
        return 'Very Weak';
    }
}

// Export for use in Node.js or browsers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PasswordGenerator;
}