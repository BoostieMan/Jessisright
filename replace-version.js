const fs = require('fs');

const htmlFile = 'index.html';
const versionFile = 'data/version.json';
const sha = process.env.GITHUB_SHA?.substring(0, 7) || 'unknown';

const version = fs.existsSync(versionFile) ? fs.readFileSync(versionFile, 'utf8').trim() : '0.0';

fs.readFile(htmlFile, 'utf8', (err, data) => {
  if (err) throw err;

  const result = data.replace('{{VERSION}}', `Version: ${version} (#${sha})`);

  fs.writeFile(htmlFile, result, 'utf8', (err) => {
    if (err) throw err;
    console.log(`Version injected: Version: ${version} (#${sha})`);
  });
});
