const fs = require('fs');

const filePath = 'index.html';
const sha = process.env.GITHUB_SHA?.substring(0, 7) || 'unknown';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) throw err;

  const result = data.replace('{{VERSION}}', `#${sha}`);

  fs.writeFile(filePath, result, 'utf8', (err) => {
    if (err) throw err;
    console.log(`Version injected: #${sha}`);
  });
});
