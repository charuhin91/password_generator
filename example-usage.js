/**
 * Example usage of the password generator
 */

// For Node.js environment
// const PasswordGenerator = require('./passwordGenerator');
// const PasswordUtils = require('./passwordUtils');

// For browser environment, include the scripts in HTML first

// Example 1: Basic password generation
function exampleBasic() {
    const generator = new PasswordGenerator();
    
    // Generate a simple password with default settings (12 characters, all types)
    const password1 = generator.generatePassword();
    console.log('Basic password:', password1);
    
    // Generate password with custom length
    const password2 = generator.generatePassword({ length: 16 });
    console.log('16-character password:', password2);
    
    // Calculate strength
    const strength = generator.calculateStrength(password2);
    const description = generator.getStrengthDescription(strength);
    console.log(`Strength: ${strength}/100 (${description})`);
}

// Example 2: Custom character types
function exampleCustomTypes() {
    const generator = new PasswordGenerator();
    
    // Only letters and numbers
    const alphanumeric = generator.generatePassword({
        length: 14,
        includeSymbols: false
    });
    console.log('Alphanumeric password:', alphanumeric);
    
    // Only numbers (for PIN codes)
    const numeric = generator.generatePassword({
        length: 6,
        includeLowercase: false,
        includeUppercase: false,
        includeSymbols: false
    });
    console.log('Numeric PIN:', numeric);
}

// Example 3: Password validation
function exampleValidation() {
    const testPassword = 'Weak123';
    
    const validation = PasswordUtils.validatePassword(testPassword, {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: true
    });
    
    console.log('Password validation:', validation);
}

// Example 4: Generate multiple passwords
function exampleMultiple() {
    const passwords = PasswordUtils.generateMultiplePasswords(5, {
        length: 10,
        includeSymbols: true
    });
    
    console.log('Multiple passwords:');
    passwords.forEach((pwd, index) => {
        console.log(`${index + 1}. ${pwd}`);
    });
}

// Run examples
console.log('=== Password Generator Examples ===');
exampleBasic();
console.log('\n=== Custom Types Example ===');
exampleCustomTypes();
console.log('\n=== Validation Example ===');
exampleValidation();
console.log('\n=== Multiple Passwords Example ===');
exampleMultiple();