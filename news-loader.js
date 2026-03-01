/**
 * News Loader — Markdown CMS for Everything's AI
 *
 * How to add a new article:
 * 1. Create a .md file in /news/ (e.g. news/2026-03-15-new-post.md)
 * 2. Add frontmatter: title, date, author, summary, image
 * 3. Add an entry to news/index.json with the same slug (filename without .md)
 *
 * The loader reads index.json, renders cards on news.html,
 * and renders full articles on news-article.html?slug=...
 */

(function () {
  'use strict';

  // ---- Minimal Markdown Parser ----
  function parseMarkdown(md) {
    var html = md
      // headings
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // bold & italic
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // unordered lists
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // paragraphs (blank-line separated)
      .replace(/\n\n/g, '</p><p>')
      // line breaks
      .replace(/\n/g, '<br>');

    // wrap list items in <ul>
    html = html.replace(/(<li>.*?<\/li>)/gs, function (match) {
      return '<ul>' + match + '</ul>';
    });
    // collapse consecutive <ul> tags
    html = html.replace(/<\/ul><br><ul>/g, '');
    html = html.replace(/<\/ul><ul>/g, '');

    return '<p>' + html + '</p>';
  }

  // ---- Parse Frontmatter ----
  function parseFrontmatter(content) {
    var match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: content };

    var meta = {};
    match[1].split('\n').forEach(function (line) {
      var idx = line.indexOf(':');
      if (idx > -1) {
        var key = line.slice(0, idx).trim();
        var val = line.slice(idx + 1).trim();
        meta[key] = val;
      }
    });

    return { meta: meta, body: match[2].trim() };
  }

  // ---- Format Date ----
  function formatDate(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    var months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  // ---- Render News Grid (news.html) ----
  function renderNewsGrid() {
    var grid = document.getElementById('newsGrid');
    if (!grid) return;

    fetch('news/index.json')
      .then(function (res) { return res.json(); })
      .then(function (posts) {
        if (posts.length === 0) {
          grid.innerHTML = '<p class="news-grid__empty">No news articles yet. Check back soon!</p>';
          return;
        }

        // Sort by date descending
        posts.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date);
        });

        var html = posts.map(function (post) {
          var imgSrc = post.image || 'icon-incubator.png';
          return (
            '<a href="news-article.html?slug=' + post.slug + '" class="news-card">' +
              '<div class="news-card__img-wrap">' +
                '<img src="' + imgSrc + '" alt="' + post.title + '" class="news-card__img" />' +
              '</div>' +
              '<div class="news-card__content">' +
                '<time class="news-card__date">' + formatDate(post.date) + '</time>' +
                '<h3 class="news-card__title">' + post.title + '</h3>' +
                '<p class="news-card__summary">' + post.summary + '</p>' +
                '<span class="news-card__read">Read More &rarr;</span>' +
              '</div>' +
            '</a>'
          );
        }).join('');

        grid.innerHTML = html;
      })
      .catch(function () {
        grid.innerHTML = '<p class="news-grid__empty">Unable to load news. Please try again later.</p>';
      });
  }

  // ---- Render Single Article (news-article.html) ----
  function renderArticle() {
    var header = document.getElementById('articleHeader');
    var body = document.getElementById('articleBody');
    if (!header || !body) return;

    var params = new URLSearchParams(window.location.search);
    var slug = params.get('slug');
    if (!slug) {
      header.innerHTML = '<h1>Article not found</h1>';
      body.innerHTML = '<p><a href="news.html">&larr; Back to News</a></p>';
      return;
    }

    fetch('news/' + slug + '.md')
      .then(function (res) {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(function (text) {
        var parsed = parseFrontmatter(text);
        var meta = parsed.meta;

        // Update page title
        document.title = (meta.title || 'Article') + ' — Everything\'s AI';

        // Render header
        var imgHtml = meta.image
          ? '<img src="' + meta.image + '" alt="' + (meta.title || '') + '" class="article__hero-img" />'
          : '';

        header.innerHTML =
          imgHtml +
          '<time class="article__date">' + formatDate(meta.date || '') + '</time>' +
          '<h1 class="article__title">' + (meta.title || 'Untitled') + '</h1>' +
          (meta.author ? '<p class="article__author">By ' + meta.author + '</p>' : '');

        // Render body
        body.innerHTML = parseMarkdown(parsed.body);
      })
      .catch(function () {
        header.innerHTML = '<h1>Article not found</h1>';
        body.innerHTML = '<p>This article could not be loaded. <a href="news.html">Back to News</a></p>';
      });
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', function () {
    renderNewsGrid();
    renderArticle();
  });
})();
