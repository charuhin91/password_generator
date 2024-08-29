/**
 * Command Line Interface for Password Generator
 * Usage: node cli.js [options]
 */

const PasswordGenerator = require('./passwordGenerator.js');

function parseArguments() {
    const args = process.argv.slice(2);
    const options = {
        length: 12,
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: true,
        count: 1
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        switch (arg) {
            case '--length':
            case '-l':
                options.length = parseInt(args[++i], 10);
                break;
            case '--no-lowercase':
                options.lowercase = false;
                break;
            case '--no-uppercase':
                options.uppercase = false;
                break;
            case '--no-numbers':
                options.numbers = false;
                break;
            case '--no-symbols':
                options.symbols = false;
                break;
            case '--count':
            case '-c':
                options.count = parseInt(args[++i], 10);
                break;
            case '--help':
            case '-h':
                showHelp();
                process.exit(0);
            default:
                if (arg.startsWith('--')) {
                    console.error(`Unknown option: ${arg}`);
                    showHelp();
                    process.exit(1);
                }
        }
    }

    return options;
}

function showHelp() {
    console.log(`
Secure Password Generator - CLI Tool

Usage: node cli.js [options]

Options:
  -l, --length <number>    Password length (default: 12)
  -c, --count <number>     Number of passwords to generate (default: 1)
  --no-lowercase          Exclude lowercase letters
  --no-uppercase          Exclude uppercase letters
  --no-numbers            Exclude numbers
  --no-symbols            Exclude symbols
  -h, --help              Show this help message

Examples:
  node cli.js --length 16
  node cli.js -l 20 --no-symbols
  node cli.js --count 5 --length 8 --no-uppercase
    `);
}

function main() {
    try {
        const options = parseArguments();
        const generator = new PasswordGenerator();

        if (options.count === 1) {
            // Generate single password
            const password = generator.generatePassword(options);
            const strength = generator.calculateStrength(password);
            const description = generator.getStrengthDescription(strength);
            
            console.log(`\n🔐 Generated Password: ${password}`);
            console.log(`📊 Strength: ${description} (${strength}/100)`);
        } else {
            // Generate multiple passwords
            const passwords = generator.generateMultiplePasswords(options.count, options);
            console.log(`\n🔐 Generated ${options.count} passwords:`);
            passwords.forEach((password, index) => {
                const strength = generator.calculateStrength(password);
                const description = generator.getStrengthDescription(strength);
                console.log(`${index + 1}. ${password} (${description})`);
            });
        }

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    main();
}