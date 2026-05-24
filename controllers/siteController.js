const fs = require('fs');
const path = require('path');
const Contact = require('../models/Contact');
const { featuredNews, pageMap } = require('../content/siteContent');

function renderPage(req, res, pageKey) {
  const page = pageMap[pageKey];

  if (!page) {
    return res.status(404).render('pages/not-found', {
      title: 'Page not found',
      description: 'The page requested could not be found.'
    });
  }

  return res.render('pages/page', {
    page,
    featuredNews,
    language: req.query.lang === 'sw' ? 'sw' : 'en'
  });
}

function home(req, res) { renderPage(req, res, 'home'); }
function about(req, res) { renderPage(req, res, 'about'); }
function partnership(req, res) { renderPage(req, res, 'partnership'); }
function bambooguard(req, res) { renderPage(req, res, 'bambooguard'); }
function manufacturing(req, res) { renderPage(req, res, 'manufacturing'); }
function impact(req, res) { renderPage(req, res, 'impact'); }
function investment(req, res) { renderPage(req, res, 'investment'); }
function phases(req, res) { renderPage(req, res, 'phases'); }
function innovation(req, res) { renderPage(req, res, 'innovation'); }

function contact(req, res) {
  return res.render('pages/contact', {
    title: 'Contact | GDBIT',
    description: 'Send partnership, investor, and media inquiries to the Green Defence Bamboo Initiative Tanzania team.',
    sent: req.query.sent === '1'
  });
}

async function submitContact(req, res) {
  const { name, email, subject, message } = req.body;

  try {
    await Contact.create({ name, email, subject, message, source: 'website' });
  } catch (error) {
    console.warn('Contact submission could not be saved:', error.message);
  }

  return res.redirect('/contact?sent=1');
}

function investImpactContact(req, res) {
  // Render a single long-scrolling page combining Investment, Impact, and Contact
  const investmentPage = pageMap.investment;
  const impactPage = pageMap.impact;

  return res.render('pages/invest-impact-contact', {
    title: 'Investment & Impact | GDBIT',
    investment: investmentPage,
    impact: impactPage,
    featuredNews,
    sent: req.query.sent === '1'
  });
}

async function team(req, res) {
  const imagesRoot = path.join(__dirname, '..', 'public', 'images');
  const teams = [];

  const companyDirs = [
    { key: 'jwapano', dir: path.join(imagesRoot, 'jwapano team'), logo: '/images/jwapano-logo.jpeg' },
    { key: 'unlock', dir: path.join(imagesRoot, 'unlock team'), logo: '/images/unlock-logo.jpeg' }
  ];

  for (const company of companyDirs) {
    const members = [];
    try {
      const subdirs = fs.readdirSync(company.dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
      for (const sub of subdirs) {
        const memberDir = path.join(company.dir, sub);
        const files = fs.readdirSync(memberDir);
        const img = files.find(f => /\.(png|jpe?g|webp|gif)$/i.test(f));
        const bioFile = files.find(f => /summary\.txt|salim\.txt|\.txt$/i.test(f));
        let bio = '';
        try { if (bioFile) bio = fs.readFileSync(path.join(memberDir, bioFile), 'utf8').trim(); } catch (e) { bio = ''; }
        let displayName = sub.replace(/[-_]/g, ' ');
        if (bio) {
          const lines = bio.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          // prefer a short last line that looks like a name (uppercase or few words)
          // first try to find any all-caps name-like matches anywhere in the bio
          // find uppercase name-like tokens allowing leading punctuation
          const upMatches = [];
          const upRegex = /[^A-Za-z0-9]*([A-Z][A-Z\.\-]{1,40}(?:\s+[A-Z][A-Z\.\-]{1,40})+)/g;
          let m;
          while ((m = upRegex.exec(bio)) !== null) upMatches.push(m[1]);
          if (upMatches.length) {
            displayName = upMatches[upMatches.length - 1].replace(/^[\.\-\s]+/, '').replace(/[\.\-\s]+$/, '').trim();
          } else {
            // fallback: find capitalized name-like phrases (e.g., 'Mohamed Lawrence Lwanji')
            const capRegex = /([A-Z][A-Za-z\.\-']+(?:\s+[A-Z][A-Za-z\.\-']+){0,5})/g;
            const caps = [];
            let cm;
            while ((cm = capRegex.exec(bio)) !== null) caps.push(cm[1]);
            if (caps.length) {
              // filter out obvious role phrases
              const filtered = caps.filter(c => !/\b(Director|Co-founder|Co|Founder|Team|Company|Group|Ltd|Limited|Directorate)\b/i.test(c));
              if (filtered.length) {
                displayName = filtered[filtered.length - 1].replace(/^[\.\-\s]+/, '').replace(/[\.\-\s]+$/, '').trim();
              }
            }
          // look from bottom to top for a short line that looks like a name
          const looksLikeName = (s) => {
            if (!s) return false;
            const cleaned = s.replace(/[^A-Za-z\-\.\s]/g, '').trim();
            const words = cleaned.split(/\s+/).filter(Boolean);
            if (words.length < 1 || words.length > 6) return false;
            if (!/[A-Za-z]/.test(cleaned)) return false;
            // exclude obvious role/verb lines
            if (/\b(is|has|experience|director|manager|developer|co-founder|founder|team|group|company|limited)\b/i.test(cleaned)) return false;
            // accept lines that contain uppercase letters or capitalized words
            return /[A-Z]/.test(cleaned);
          };

          let nameFound = '';
          for (let i = lines.length - 1; i >= 0; i--) {
            const candidate = lines[i];
            if (looksLikeName(candidate)) { nameFound = candidate; break; }
          }
          if (nameFound) {
            displayName = nameFound.replace(/^[\.\-\s]+/, '').replace(/[\.\-\s]+$/, '').trim();
          } else {
            const firstLine = lines.length ? lines[0] : '';
            if (firstLine && !/\b(is|has|experience|director|manager|developer|co-founder|founder|team|group)\b/i.test(firstLine)) {
              displayName = firstLine.trim();
            }
          }
          }
        }
        members.push({ name: sub.replace(/[-_]/g, ' '), displayName, image: img ? `/images/${encodeURIComponent(path.relative(imagesRoot, path.join(memberDir, img)).replace(/\\/g, '/'))}` : null, bio });
      }
    } catch (err) {
      // ignore if directory missing
    }
    // Allow specific ordering for known teams (unlock: mohamed, frank, baraka)
    if (company.key === 'unlock' && members && members.length) {
      const order = ['mohamed', 'frank', 'baraka'];
      members.sort((a, b) => {
        const an = (a.name || '').toLowerCase();
        const bn = (b.name || '').toLowerCase();
        const ai = order.indexOf(an);
        const bi = order.indexOf(bn);
        if (ai === -1 && bi === -1) return an.localeCompare(bn);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
    }

    teams.push({ company: company.key, logo: company.logo, members });
  }

  return res.render('pages/team', {
    title: 'Our Team | GDBIT',
    teams
  });
}

module.exports = {
  home,
  about,
  partnership,
  bambooguard,
  manufacturing,
  impact,
  investment,
  phases,
  innovation,
  contact,
  submitContact,
  investImpactContact,
  team,
  featuredNews
};

