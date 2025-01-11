const bcryptjs = require('bcryptjs');

const password = 'Password123';
console.log('Password being hashed:', password);

const salt = bcryptjs.genSaltSync(10);
const hash = bcryptjs.hashSync(password, salt);

// Create escaped version for .env.local
const escapedHash = hash.replace(/\$/g, '\\$');

console.log('\nGenerated hash (for reference):', hash);
console.log('\nAdd this EXACT line to your .env.local file:');
console.log(`ADMIN_PASSWORD_HASH=${escapedHash}`);

// Verify both versions work
Promise.all([
  bcryptjs.compare(password, hash),
  bcryptjs.compare(password, escapedHash.replace(/\\\$/g, '$'))
]).then(([originalValid, escapedValid]) => {
  console.log('\nVerification tests:');
  console.log('Original hash:', originalValid ? 'PASSED' : 'FAILED');
  console.log('Escaped hash:', escapedValid ? 'PASSED' : 'FAILED');
}); 