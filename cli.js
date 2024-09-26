#!/usr/bin/env node

/**
 * Command Line Interface for Password Generator
 */

const PasswordGenerator = require('./passwordGenerator.js');

function displayHelp() {
    console.log(`
Secure Password Generator CLI

Usage:
  node cli.js [options]

Options:
  -l, --length <number>      Password length (default: 16)
  --no-lowercase            Exclude lowercase letters
  --no-uppercase            Exclude uppercase letters
  --no-numbers              Exclude numbers
  --no-symbols              Exclude symbols
  -c, --count <number>      Number of passwords to generate (default: 1)
  -s, --strength            Show password strength
  -h, --help                Display this help message

Examples:
  node cli.js -l 20
  node cli.js --no-symbols -c 5
  node cli.js -l 12 --no-lowercase --strength
    `);
}

function parseArguments() {
    const args = process.argv.slice(2);
    const options = {
        length: 16,
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true,
        count: 1,
        showStrength: false
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        switch (arg) {
            case '-l':
            case '--length':
                options.length = parseInt(args[++i], 10);
                break;
            case '--no-lowercase':
                options.includeLowercase = false;
                break;
            case '--no-uppercase':
                options.includeUppercase = false;
                break;
            case '--no-numbers':
                options.includeNumbers = false;
                break;
            case '--no-symbols':
                options.includeSymbols = false;
                break;
            case '-c':
            case '--count':
                options.count = parseInt(args[++i], 10);
                break;
            case '-s':
            case '--strength':
                options.showStrength = true;
                break;
            case '-h':
            case '--help':
                displayHelp();
                process.exit(0);
        }
    }

    return options;
}

function main() {
    try {
        const options = parseArguments();
        const generator = new PasswordGenerator();

        console.log('Generated Passwords:\n');

        for (let i = 0; i < options.count; i++) {
            const password = generator.generatePassword(options);
            
            if (options.showStrength) {
                const strengthScore = generator.calculateStrength(password);
                const strengthDesc = generator.getStrengthDescription(strengthScore);
                console.log(`${i + 1}. ${password} (${strengthDesc})`);
            } else {
                console.log(`${i + 1}. ${password}`);
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}