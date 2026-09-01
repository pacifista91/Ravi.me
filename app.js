const appEl = document.getElementById('app');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getPosts = () =>
  fetch('posts.json')
    .then((r) => r.json())
    .catch(() => ({}));

const getPost = (slug) =>
  fetch(`posts/${slug}.md`)
    .then((r) => {
      if (!r.ok) throw new Error('Not found');
      return r.text();
    })
    .then((md) => {
      const body = md.replace(/^---[\s\S]*?---\r?\n?/, '').replace(/^# .+\n+/, '');
      return marked.parse(body);
    });

const formatDate = (iso) => {
  const d = new Date(iso);
  return { day: d.getDate(), year: `${MONTHS[d.getMonth()]} ${d.getFullYear()}` };
};

const renderListing = (posts) => {
  const entries = Object.entries(posts).sort(
    (a, b) => new Date(b[1].date) - new Date(a[1].date)
  );

  const items = entries
    .map(([slug, meta]) => {
      const { day, year } = formatDate(meta.date);
      return `
        <div class="post">
          <div class="date">
            <span class="day">${day}</span>
            <span class="year">${year}</span>
          </div>
          <div class="body">
            <h4 class="title"><a href="#/${slug}">${meta.title}</a></h4>
            ${meta.description ? `<div class="description">${meta.description}</div>` : ''}
          </div>
        </div>
      `;
    })
    .join('');

  appEl.innerHTML = `
    <section class="page">
      <h3 class="title kind-section">Musings</h3>
      <p>An assorted collection of thoughts on technology, business, and life.</p>
      <div class="posts">${items}</div>
    </section>
  `;
};

const renderPost = async (slug) => {
  appEl.innerHTML = `<p class="loading">Loading...</p>`;
  try {
    const [html, posts] = await Promise.all([getPost(slug), getPosts()]);
    const meta = posts[slug] || {};
    const { day, year } = formatDate(meta.date || Date.now());
    appEl.innerHTML = `
      <article class="post">
        <div class="post-header">
          <h1 class="title">${meta.title || ''}</h1>
          <div class="meta"><span class="date">${day} ${year}</span></div>
        </div>
        <div class="body">${html}</div>
      </article>
    `;
    if (meta.title) document.title = `${meta.title} - Ravi Raj`;
  } catch (e) {
    appEl.innerHTML = `<p class="loading">Post not found.</p>
      <p><a href="blog.html">Back to musings</a></p>`;
  }
};

const route = () => {
  const hash = location.hash.replace(/^#\/?/, '');
  if (!hash) {
    getPosts().then(renderListing);
  } else {
    renderPost(hash);
  }
};

window.addEventListener('hashchange', route);
route();