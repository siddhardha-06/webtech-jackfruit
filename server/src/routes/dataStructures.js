import express from 'express';
import fs from 'fs';
import path from 'path';

// Read local seed file as the data source so server works without a DB
const seedPath = path.resolve(process.cwd(), 'seed', 'data-structures.json');
let data = [];
try {
  const raw = fs.readFileSync(seedPath, 'utf-8');
  data = JSON.parse(raw);
} catch (e) {
  console.error('Failed to read seed data:', e.message);
  data = [];
}

export const router = express.Router();

// GET /api/ds - list minimal info (served from seed file)
router.get('/', (_req, res) => {
  try {
    const list = data
      .map(({ slug, name, tags, order }) => ({ slug, name, tags, order }))
      .sort((a, b) => (a.order || 0) - (b.order || 0) || a.name.localeCompare(b.name || ''));
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

// GET /api/ds/:slug - full details including snippets (from seed)
router.get('/:slug', (req, res) => {
  try {
    const ds = data.find(d => d.slug === req.params.slug);
    if (!ds) return res.status(404).json({ error: 'Not found' });
    res.json(ds);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

// GET /api/ds/:slug/snippets?lang=c
router.get('/:slug/snippets', (req, res) => {
  try {
    const { slug } = req.params;
    const { lang } = req.query;
    const ds = data.find(d => d.slug === slug);
    if (!ds) return res.status(404).json({ error: 'Not found' });
    let snippets = ds.codeSnippets || [];
    if (lang) snippets = snippets.filter(s => s.language?.toLowerCase() === String(lang).toLowerCase());
    res.json(snippets);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load snippets' });
  }
});
