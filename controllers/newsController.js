const { featuredNews } = require('./siteController');

function index(req, res) {
  return res.render('pages/news', {
    title: 'News & Updates | GDBIT',
    description: 'Latest news, updates, and announcements from the Green Defence Bamboo Initiative Tanzania.',
    articles: featuredNews
  });
}

function show(req, res) {
  const article = featuredNews.find((item) => item.slug === req.params.slug);

  if (!article) {
    return res.status(404).render('pages/not-found', {
      title: 'Article not found',
      description: 'The requested article could not be found.'
    });
  }

  return res.render('pages/article', {
    title: `${article.title} | GDBIT`,
    description: article.summary,
    article
  });
}

module.exports = { index, show };
