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
     * Generate a secure password
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

        // Generate password using cryptographically secure random values
        const passwordArray = new Array(length);
        const randomValues = new Uint32Array(length);
        
        // Use crypto.getRandomValues for secure randomness
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(randomValues);
        } else {
            throw new Error('Cryptographically secure random number generator not available');
        }

        for (let i = 0; i < length; i++) {
            const randomIndex = randomValues[i] % characterPool.length;
            passwordArray[i] = characterPool[randomIndex];
        }

        // Ensure at least one character from each selected character set is included
        this._ensureCharacterVariety(passwordArray, options, characterPool);

        return passwordArray.join('');
    }

    /**
     * Validate generation options
     * @param {number} length - Password length
     * @param {Object} characterOptions - Character type options
     */
    _validateOptions(length, characterOptions) {
        if (length < 4 || length > 128) {
            throw new Error('Password length must be between 4 and 128 characters');
        }

        const hasSelectedCharacters = Object.values(characterOptions).some(value => value);
        if (!hasSelectedCharacters) {
            throw new Error('At least one character type must be selected');
        }
    }

    /**
     * Ensure password contains at least one character from each selected character set
     * @param {Array} passwordArray - Password character array
     * @param {Object} options - Character type options
     * @param {string} characterPool - Available character pool
     */
    _ensureCharacterVariety(passwordArray, options, characterPool) {
        const selectedSets = [];
        if (options.lowercase) selectedSets.push(this.characterSets.lowercase);
        if (options.uppercase) selectedSets.push(this.characterSets.uppercase);
        if (options.numbers) selectedSets.push(this.characterSets.numbers);
        if (options.symbols) selectedSets.push(this.characterSets.symbols);

        // For each required character set, ensure at least one character is present
        selectedSets.forEach(charSet => {
            const hasCharFromSet = passwordArray.some(char => charSet.includes(char));
            if (!hasCharFromSet) {
                // Replace a random position with a character from the missing set
                const randomPosition = Math.floor(Math.random() * passwordArray.length);
                const randomChar = charSet[Math.floor(Math.random() * charSet.length)];
                passwordArray[randomPosition] = randomChar;
            }
        });
    }

    /**
     * Generate multiple passwords at once
     * @param {number} count - Number of passwords to generate
     * @param {Object} options - Password generation options
     * @returns {string[]} Array of generated passwords
     */
    generateMultiplePasswords(count = 5, options = {}) {
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
        let score = 0;
        
        // Length score (max 40 points)
        score += Math.min(password.length * 2, 40);
        
        // Character variety score (max 60 points)
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
        
        const varietyCount = [hasLowercase, hasUppercase, hasNumbers, hasSymbols].filter(Boolean).length;
        score += varietyCount * 15; // 15 points per character type
        
        return Math.min(score, 100);
    }
}

// Export for use in Node.js and browsers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PasswordGenerator;
} else {
    window.PasswordGenerator = PasswordGenerator;
}