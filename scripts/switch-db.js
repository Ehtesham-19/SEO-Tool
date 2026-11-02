const fs = require('fs');
const path = require('path');

const target = (process.argv[2] || 'sqlite').toLowerCase();
const root = process.cwd();
const envPath = path.join(root, '.env');
const envExamplePath = path.join(root, '.env.example');

function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function writeEnvFile(content) {
  fs.writeFileSync(envPath, content, 'utf8');
}

const envContent = readFileIfExists(envPath) || readFileIfExists(envExamplePath);

if (!envContent) {
  console.log('No .env or .env.example file found. Nothing to update.');
  process.exit(0);
}

const nextDatabaseUrl =
  target === 'postgresql'
    ? 'DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/shopify_seo?schema=public"'
    : 'DATABASE_URL="file:./dev.db"';

const updated = envContent
  .split(/\r?\n/)
  .map((line) => (line.startsWith('DATABASE_URL=') ? nextDatabaseUrl : line))
  .join('\n');

writeEnvFile(updated + '\n');
console.log(`Database configuration switched to ${target}.`);
