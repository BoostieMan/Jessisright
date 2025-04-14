const fs = require('fs');

const htmlFile = 'index.html';
const versionFile = 'data/version.json';
const sha = process.env.GITHUB_SHA?.substring(0, 7) || 'unknown';

let version = '0.0.0';
try {
  const json = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
  version = json.version || '0.0.0';
} catch (err) {
  console.warn('No valid version.json found. Using fallback.');
}

fs.readFile(htmlFile, 'utf8', (err, data) => {
  if (err) throw err;

  const result = data
    .replace('{{VERSION}}', v${version})
    .replace('{{HASH}}', #${sha});

  fs.writeFile(htmlFile, result, 'utf8', (err) => {
    if (err) throw err;
    console.log(✅ Injected version: v${version} (${sha}));
  });
});
