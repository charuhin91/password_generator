/**
 * Secure Password Generator
 * Generates cryptographically secure passwords with customizable options
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
     * @param {number} options.length - Password length (default: 16)
     * @param {boolean} options.includeLowercase - Include lowercase letters (default: true)
     * @param {boolean} options.includeUppercase - Include uppercase letters (default: true)
     * @param {boolean} options.includeNumbers - Include numbers (default: true)
     * @param {boolean} options.includeSymbols - Include symbols (default: true)
     * @returns {string} Generated password
     */
    generatePassword(options = {}) {
        const {
            length = 16,
            includeLowercase = true,
            includeUppercase = true,
            includeNumbers = true,
            includeSymbols = true
        } = options;

        // Validate options
        this._validateOptions(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols);

        // Build character pool based on selected options
        let characterPool = '';
        if (includeLowercase) characterPool += this.characterSets.lowercase;
        if (includeUppercase) characterPool += this.characterSets.uppercase;
        if (includeNumbers) characterPool += this.characterSets.numbers;
        if (includeSymbols) characterPool += this.characterSets.symbols;

        // Ensure at least one character from each selected set is included
        let password = '';
        if (includeLowercase) password += this._getRandomChar(this.characterSets.lowercase);
        if (includeUppercase) password += this._getRandomChar(this.characterSets.uppercase);
        if (includeNumbers) password += this._getRandomChar(this.characterSets.numbers);
        if (includeSymbols) password += this._getRandomChar(this.characterSets.symbols);

        // Fill remaining length with random characters from the pool
        const remainingLength = length - password.length;
        for (let i = 0; i < remainingLength; i++) {
            password += this._getRandomChar(characterPool);
        }

        // Shuffle the password to randomize character positions
        return this._shuffleString(password);
    }

    /**
     * Validate generation options
     * @private
     */
    _validateOptions(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols) {
        if (length < 4) {
            throw new Error('Password length must be at least 4 characters');
        }

        if (length > 128) {
            throw new Error('Password length cannot exceed 128 characters');
        }

        if (!includeLowercase && !includeUppercase && !includeNumbers && !includeSymbols) {
            throw new Error('At least one character type must be selected');
        }

        const minRequiredChars = [includeLowercase, includeUppercase, includeNumbers, includeSymbols]
            .filter(Boolean).length;

        if (length < minRequiredChars) {
            throw new Error(`Password length must be at least ${minRequiredChars} to include all selected character types`);
        }
    }

    /**
     * Get a random character from a string
     * @private
     */
    _getRandomChar(characters) {
        const randomIndex = this._getSecureRandomInt(0, characters.length - 1);
        return characters[randomIndex];
    }

    /**
     * Generate cryptographically secure random integer
     * @private
     */
    _getSecureRandomInt(min, max) {
        const range = max - min + 1;
        const randomBuffer = new Uint32Array(1);
        crypto.getRandomValues(randomBuffer);
        return min + (randomBuffer[0] % range);
    }

    /**
     * Shuffle string characters using Fisher-Yates algorithm
     * @private
     */
    _shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = this._getSecureRandomInt(0, i);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    /**
     * Calculate password strength score (0-4)
     * @param {string} password - Password to evaluate
     * @returns {number} Strength score
     */
    calculateStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        
        return Math.min(4, Math.floor(score / 1.5));
    }

    /**
     * Get strength description based on score
     * @param {number} score - Strength score (0-4)
     * @returns {string} Strength description
     */
    getStrengthDescription(score) {
        const descriptions = [
            'Very Weak',
            'Weak',
            'Moderate',
            'Strong',
            'Very Strong'
        ];
        return descriptions[score] || 'Unknown';
    }
}

// Export for use in Node.js or browsers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PasswordGenerator;
} else {
    window.PasswordGenerator = PasswordGenerator;
}