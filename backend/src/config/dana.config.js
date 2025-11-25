const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load private key
const privateKeyPath = path.join(__dirname, '../../', process.env.PRIVATE_KEY);
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

// Load DANA public key
const danaPublicKeyPath = path.join(__dirname, '../../', process.env.DANA_PUBLIC_KEY);
const danaPublicKey = fs.readFileSync(danaPublicKeyPath, 'utf8');

// DANA configuration
const danaConfig = {
    partnerId: process.env.X_PARTNER_ID,
    privateKey: privateKey,
    danaPublicKey: danaPublicKey,
    origin: process.env.ORIGIN,
    env: process.env.ENV.toLowerCase(), // "sandbox" or "production"
    clientSecret: process.env.CLIENT_SECRET
};

console.log('✅ DANA Config loaded');
console.log('   Partner ID:', danaConfig.partnerId);
console.log('   Origin:', danaConfig.origin);
console.log('   Environment:', danaConfig.env);

module.exports = danaConfig;