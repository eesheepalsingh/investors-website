const express = require('express');
const supabaseAdmin = require('../lib/supabaseAdmin');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Public: founders for a startup
router.get('/:startup_id', async (req, res) => {
  const { startup_id } = req.params;
  const { data, error } = await supabaseAdmin
    .from('founders')
    .select('*')
    .eq('startup_id', startup_id)
    .order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin: create
router.post('/', requireAuth, async (req, res) => {
  const payload = sanitize(req.body);
  if (!payload.startup_id || !payload.name) {
    return res.status(400).json({ error: 'startup_id and name are required' });
  }
  const { data, error } = await supabaseAdmin
    .from('founders')
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
    .from('founders')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Admin: delete
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabaseAdmin.from('founders').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});

function sanitize(body = {}) {
  const allowed = ['startup_id', 'name', 'title', 'linkedin_url', 'photo_url'];
  const out = {};
  for (const k of allowed) {
    if (body[k] !== undefined) out[k] = body[k];
  }
  return out;
}

module.exports = router;
