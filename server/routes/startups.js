const express = require('express');
const supabaseAdmin = require('../lib/supabaseAdmin');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Public: list visible startups
router.get('/', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('startups')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin: list all startups (visible + hidden)
router.get('/all', requireAuth, async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('startups')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Public: single startup + its founders
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data: startup, error: sErr } = await supabaseAdmin
    .from('startups')
    .select('*')
    .eq('id', id)
    .single();
  if (sErr) return res.status(404).json({ error: 'Startup not found' });

  const { data: founders, error: fErr } = await supabaseAdmin
    .from('founders')
    .select('*')
    .eq('startup_id', id)
    .order('created_at', { ascending: true });
  if (fErr) return res.status(500).json({ error: fErr.message });

  res.json({ ...startup, founders: founders || [] });
});

// Admin: create
router.post('/', requireAuth, async (req, res) => {
  const payload = sanitize(req.body);
  const { data, error } = await supabaseAdmin
    .from('startups')
    .insert(payload)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Admin: update
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const payload = sanitize(req.body);
  const { data, error } = await supabaseAdmin
    .from('startups')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Admin: delete (cascades founders via FK)
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabaseAdmin.from('startups').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});

// Admin: toggle visibility
router.patch('/:id/visibility', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { is_visible } = req.body;
  if (typeof is_visible !== 'boolean') {
    return res.status(400).json({ error: 'is_visible must be a boolean' });
  }
  const { data, error } = await supabaseAdmin
    .from('startups')
    .update({ is_visible })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

function sanitize(body = {}) {
  const allowed = [
    'name',
    'logo_url',
    'sector',
    'stage',
    'revenue',
    'valuation',
    'ask',
    'metrics',
    'metrics_list',
    'moat',
    'traction',
    'description',
    'investor_backers',
    'pitch_deck_url',
    'linkedin_url',
    'website_url',
    'calendly_url',
    'is_visible',
  ];
  const out = {};
  for (const k of allowed) {
    if (body[k] !== undefined) out[k] = body[k];
  }
  if (Array.isArray(out.metrics_list)) {
    out.metrics_list = out.metrics_list
      .map((m) => ({
        label: String(m?.label ?? '').trim(),
        value: String(m?.value ?? '').trim(),
      }))
      .filter((m) => m.label || m.value);
  }
  return out;
}

module.exports = router;
