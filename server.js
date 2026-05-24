require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { connectDatabase } = require('./config/database');

const indexRoutes = require('./routes/indexRoutes');
const newsRoutes = require('./routes/newsRoutes');
const adminRoutes = require('./routes/adminRoutes');

async function bootstrap() {
  await connectDatabase();

  const app = express();
  const publicDir = path.join(__dirname, 'public');

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(morgan('dev'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(methodOverride('_method'));
  app.use(express.static(publicDir));
  app.use(session({
    secret: process.env.SESSION_SECRET || 'gdbi-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false
    }
  }));

  app.use((req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    res.locals.siteName = 'Green Defence Bamboo Initiative Tanzania';
    res.locals.requestPath = req.path;
    next();
  });

  app.use('/', indexRoutes);
  app.use('/news', newsRoutes);
  app.use('/admin', adminRoutes);

  app.use((req, res) => {
    res.status(404).render('pages/not-found', {
      title: 'Page not found | GDBIT',
      description: 'The page requested could not be found.'
    });
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`GDBIT website running on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Server bootstrap failed:', error);
  process.exit(1);
});
