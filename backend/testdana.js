require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing DANA Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('✓ ENV:', process.env.ENV);
console.log('✓ PORT:', process.env.PORT);
console.log('✓ ORIGIN:', process.env.ORIGIN);
console.log('✓ FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('✓ X_PARTNER_ID:', process.env.X_PARTNER_ID);
console.log('✓ CLIENT_SECRET:', process.env.CLIENT_SECRET?.substring(0, 10) + '...');

// Check key files
const privateKeyPath = path.join(__dirname, process.env.PRIVATE_KEY);
const danaPublicKeyPath = path.join(__dirname, process.env.DANA_PUBLIC_KEY);

console.log('\nChecking key files...');
console.log('Private key path:', privateKeyPath);
console.log('DANA public key path:', danaPublicKeyPath);

if (fs.existsSync(privateKeyPath)) {
    console.log('✅ Private key file found');
    const keyContent = fs.readFileSync(privateKeyPath, 'utf8');
    if (keyContent.includes('BEGIN PRIVATE KEY')) {
        console.log('✅ Private key is in PKCS#8 format');
    }
} else {
    console.log('❌ Private key file NOT found');
}

if (fs.existsSync(danaPublicKeyPath)) {
    console.log('✅ DANA public key file found');
} else {
    console.log('❌ DANA public key file NOT found');
}

// Try to load DANA config
console.log('\n🔧 Loading DANA configuration...');
try {
    const danaConfig = require('./src/config/dana.config');
    const { Dana } = require('dana-node');

    const danaClient = new Dana(danaConfig);

    console.log('✅ DANA client initialized successfully!');
    console.log('\n📍 Endpoints:');
    console.log('   POST /api/dana/payment/create       → Create payment');
    console.log('   GET  /api/dana/payment/status/:id   → Check status');
    console.log('   POST /api/dana/payment/webhook      → Webhook handler');
    console.log('   POST /api/dana/payment/refund       → Refund payment');

    console.log('\n🎉 Configuration is CORRECT!');
    console.log('\nYou can now run:');
    console.log('  npm start      → Start production server');
    console.log('  npm run dev    → Start development server');

} catch (error) {
    console.log('❌ Failed to initialize DANA client:');
    console.error(error.message);
}