const fs = require('fs');

const htmlFile = 'index.html';
const versionFile = 'data/version.json';
const sha = process.env.GITHUB_SHA?.substring(0, 7) || 'dev';
let version = '0.0.0';

// Read version from JSON
try {
  const json = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
  version = json.version || version;
} catch (err) {
  console.warn('⚠️  No valid version.json found, using default version.');
}

// Replace placeholders in index.html
fs.readFile(htmlFile, 'utf8', (err, data) => {
  if (err) throw err;

  // Use placeholders {{VERSION}} and {{HASH}} in your HTML
  const result = data
    .replace(/{{VERSION}}/g, `v${version}`)
    .replace(/{{HASH}}/g, `#${sha}`);

  fs.writeFile(htmlFile, result, 'utf8', (err) => {
    if (err) throw err;
    console.log(`✅ Injected version: v${version} (${sha})`);
  });
});
