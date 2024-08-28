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
     * @param {boolean} options.lowercase - Include lowercase letters (default: true)
     * @param {boolean} options.uppercase - Include uppercase letters (default: true)
     * @param {boolean} options.numbers - Include numbers (default: true)
     * @param {boolean} options.symbols - Include symbols (default: true)
     * @returns {string} Generated password
     */
    generatePassword(options = {}) {
        const {
            length = 12,
            lowercase = true,
            uppercase = true,
            numbers = true,
            symbols = true
        } = options;

        // Validate options
        this._validateOptions(length, { lowercase, uppercase, numbers, symbols });

        // Build character pool based on selected options
        let characterPool = '';
        if (lowercase) characterPool += this.characterSets.lowercase;
        if (uppercase) characterPool += this.characterSets.uppercase;
        if (numbers) characterPool += this.characterSets.numbers;
        if (symbols) characterPool += this.characterSets.symbols;

        // Ensure at least one character type is selected
        if (characterPool.length === 0) {
            throw new Error('At least one character type must be selected');
        }

        // Generate password using cryptographically secure random values
        let password = '';
        const randomValues = new Uint32Array(length);
        
        // Use crypto.getRandomValues for secure randomness
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(randomValues);
        } else {
            throw new Error('Crypto API not available in this environment');
        }

        for (let i = 0; i < length; i++) {
            const randomIndex = randomValues[i] % characterPool.length;
            password += characterPool[randomIndex];
        }

        return password;
    }

    /**
     * Validate generation options
     * @private
     */
    _validateOptions(length, charOptions) {
        if (length < 4) {
            throw new Error('Password length must be at least 4 characters');
        }
        
        if (length > 128) {
            throw new Error('Password length cannot exceed 128 characters');
        }

        if (!Number.isInteger(length)) {
            throw new Error('Password length must be an integer');
        }

        // Check if at least one character type is enabled
        const hasCharacterType = Object.values(charOptions).some(value => value === true);
        if (!hasCharacterType) {
            throw new Error('At least one character type must be enabled');
        }
    }

    /**
     * Generate multiple passwords at once
     * @param {number} count - Number of passwords to generate
     * @param {Object} options - Password generation options
     * @returns {string[]} Array of generated passwords
     */
    generateMultiplePasswords(count = 5, options = {}) {
        if (count < 1 || count > 50) {
            throw new Error('Count must be between 1 and 50');
        }

        const passwords = [];
        for (let i = 0; i < count; i++) {
            passwords.push(this.generatePassword(options));
        }
        return passwords;
    }

    /**
     * Calculate password strength score (0-100)
     * @param {string} password - Password to evaluate
     * @returns {number} Strength score
     */
    calculateStrength(password) {
        if (!password) return 0;

        let score = 0;
        const length = password.length;

        // Length score (max 40 points)
        score += Math.min(length * 2, 40);

        // Character variety score (max 60 points)
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[^a-zA-Z0-9]/.test(password);

        const varietyCount = [hasLowercase, hasUppercase, hasNumbers, hasSymbols]
            .filter(Boolean).length;
        
        score += varietyCount * 15; // 15 points per character type

        return Math.min(score, 100);
    }

    /**
     * Get strength description based on score
     * @param {number} score - Strength score (0-100)
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

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PasswordGenerator;
} else if (typeof window !== 'undefined') {
    window.PasswordGenerator = PasswordGenerator;
}