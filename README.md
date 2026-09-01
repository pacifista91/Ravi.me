# Personal Introduction website + Blog

I liked the design and simplicity of this website: https://nithinkamath.me/.

Hence, I copied the design, using vibe coding.

## How it works

A client-side blog: posts live as Markdown files in `posts/`, the browser renders them at runtime (`app.js` + `marked.min.js`). No build step at deploy.

## Adding a post

1. Create `posts/<slug>.md`:

```markdown
---
title: "My Post"
date: "2026-09-01"
description: "One-line excerpt"
---

Your markdown content here.
```

2. Regenerate the index:

```bash
node make
```

3. Commit and push.

The post appears at `blog.html#/<slug>`.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000/blog.html
```
