const fs = require('fs');
const path = require('path');
const imagesRoot = path.join(__dirname, '..', 'public', 'images');
const companyDirs = [
  { key: 'jwapano', dir: path.join(imagesRoot, 'jwapano team'), logo: '/images/jwapano-logo.jpeg' },
  { key: 'unlock', dir: path.join(imagesRoot, 'unlock team'), logo: '/images/unlock-logo.jpeg' }
];

function looksLikeName(s) {
  if (!s) return false;
  const cleaned = s.replace(/[^A-Za-z\s\.]/g, '').replace(/\.+$/, '').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 1 && words.length <= 6 && /^[A-Z\.\s]+$/.test(cleaned)) return true;
  return false;
}

const teams = [];
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
        const last = lines.length ? lines[lines.length - 1] : '';
        if (looksLikeName(last)) {
          displayName = last.replace(/^[\.\-\s]+/, '').replace(/\.+$/, '').trim();
        } else {
          const firstLine = lines.length ? lines[0] : '';
          if (firstLine && !/\b(is|has|experience|director|manager|developer|co-founder|founder)\b/i.test(firstLine)) {
            displayName = firstLine.trim();
          }
        }
      }
      members.push({ folder: sub, displayName, image: img || null, bio: bio || null });
    }
  } catch (err) {
    // ignore
  }
  teams.push({ company: company.key, members });
}

console.log(JSON.stringify(teams, null, 2));
