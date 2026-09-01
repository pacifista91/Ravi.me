const fs = require('fs');
const path = require('path');

const POSTS_DIR = './posts';

const parseFrontMatter = (content) => {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const meta = {};
  let body = content;

  if (match) {
    body = content.slice(match[0].length);
    match[1].split('\n').forEach((line) => {
      const parts = line.match(/^([\w-]+):\s*["']?(.*?)["']?\s*$/);
      if (parts) meta[parts[1]] = parts[2];
    });
  }

  return { meta, body };
};

const details = (file) => {
  const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
  const { meta, body } = parseFrontMatter(content);
  const slug = file.replace(/\.md$/, '');

  return {
    title: meta.title || slug.replace(/-/g, ' '),
    date: meta.date || fs.statSync(path.join(POSTS_DIR, file)).mtime.toISOString().slice(0, 10),
    description: meta.description || '',
    size: body.length,
    content: body,
  };
};

const posts = fs
  .readdirSync(POSTS_DIR)
  .filter((file) => file.endsWith('.md'))
  .reduce((acc, file) => {
    const slug = file.replace(/\.md$/, '');
    acc[slug] = details(file);
    return acc;
  }, {});

fs.writeFileSync('./posts.json', JSON.stringify(posts));
console.log(`Generated posts.json with ${Object.keys(posts).length} posts.`);