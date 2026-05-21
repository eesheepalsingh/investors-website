import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/axios.js';
import FounderFieldGroup from '../../components/FounderFieldGroup.jsx';
import MarkdownEditor from '../../components/MarkdownEditor.jsx';
import { Highlight, SectionEyebrow } from '../../components/brand.jsx';
import { STARTUP_LABELS } from '../../data/startupLabels.js';
import StartupFormSkeleton from '../../components/skeleton/StartupFormSkeleton.jsx';

const emptyStartup = {
  name: '',
  logo_url: '',
  sector: '',
  stage: '',
  metrics: '',
  metrics_list: [],
  moat: '',
  traction: '',
  description: '',
  investor_backers: [],
  pitch_deck_url: '',
  linkedin_url: '',
  website_url: '',
  calendly_url: '',
  is_visible: true,
};

const emptyMetric = () => ({
  _localId: crypto.randomUUID(),
  label: '',
  value: '',
});

const emptyFounder = () => ({
  _localId: crypto.randomUUID(),
  id: null,
  name: '',
  title: '',
  linkedin_url: '',
  photo_url: '',
});

export default function StartupForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === 'edit';

  const [startup, setStartup] = useState(emptyStartup);
  const [founders, setFounders] = useState([emptyFounder()]);
  const [originalFounderIds, setOriginalFounderIds] = useState([]);
  const [backerInput, setBackerInput] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [founderCount, setFounderCount] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingDeck, setUploadingDeck] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    let alive = true;
    api
      .get(`/startups/${id}`)
      .then(({ data }) => {
        if (!alive) return;
        const { founders: fs, ...rest } = data;
        setStartup({
          ...emptyStartup,
          ...rest,
          investor_backers: Array.isArray(rest.investor_backers) ? rest.investor_backers : [],
          metrics_list: Array.isArray(rest.metrics_list)
            ? rest.metrics_list.map((m) => ({
                _localId: crypto.randomUUID(),
                label: m?.label ?? '',
                value: m?.value ?? '',
              }))
            : [],
        });
        if (fs && fs.length) {
          setFounders(
            fs.map((f) => ({
              _localId: crypto.randomUUID(),
              id: f.id,
              name: f.name || '',
              title: f.title || '',
              linkedin_url: f.linkedin_url || '',
              photo_url: f.photo_url || '',
            }))
          );
          setOriginalFounderIds(fs.map((f) => f.id));
          setFounderCount(fs.length);
        }
      })
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id, isEdit]);

  const set = (k, v) => setStartup((s) => ({ ...s, [k]: v }));

  const addBacker = () => {
    const v = backerInput.trim();
    if (!v) return;
    if (startup.investor_backers.includes(v)) {
      setBackerInput('');
      return;
    }
    set('investor_backers', [...startup.investor_backers, v]);
    setBackerInput('');
  };

  const removeBacker = (b) => {
    set('investor_backers', startup.investor_backers.filter((x) => x !== b));
  };

  const addMetric = () => {
    set('metrics_list', [...startup.metrics_list, emptyMetric()]);
  };

  const updateMetric = (localId, patch) => {
    set(
      'metrics_list',
      startup.metrics_list.map((m) => (m._localId === localId ? { ...m, ...patch } : m))
    );
  };

  const removeMetric = (localId) => {
    set(
      'metrics_list',
      startup.metrics_list.filter((m) => m._localId !== localId)
    );
  };

  const onLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post('/upload/logo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set('logo_url', data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const onDeck = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDeck(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post('/upload/pitch-deck', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set('pitch_deck_url', data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingDeck(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!startup.name.trim()) errs.name = 'Name is required';
    if (startup.website_url && !isUrl(startup.website_url)) errs.website_url = 'Invalid URL';
    if (startup.linkedin_url && !isUrl(startup.linkedin_url)) errs.linkedin_url = 'Invalid URL';
    if (startup.calendly_url && !isUrl(startup.calendly_url)) errs.calendly_url = 'Invalid URL';
    const foundersWithName = founders.filter((f) => f.name.trim());
    foundersWithName.forEach((f) => {
      if (f.linkedin_url && !isUrl(f.linkedin_url)) {
        errs[`founder_${f._localId}_linkedin`] = 'Invalid URL';
      }
    });
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setError(null);

    try {
      let startupId = id;
      const payload = {
        ...startup,
        investor_backers: startup.investor_backers || [],
        metrics_list: (startup.metrics_list || [])
          .map(({ label, value }) => ({
            label: (label || '').trim(),
            value: (value || '').trim(),
          }))
          .filter((m) => m.label || m.value),
      };

      if (isEdit) {
        await api.put(`/startups/${startupId}`, payload);
      } else {
        const { data } = await api.post('/startups', payload);
        startupId = data.id;
      }

      const keep = founders.filter((f) => f.name.trim());
      const currentIds = new Set(keep.filter((f) => f.id).map((f) => f.id));

      const toDelete = originalFounderIds.filter((oid) => !currentIds.has(oid));
      await Promise.all(toDelete.map((fid) => api.delete(`/founders/${fid}`)));

      await Promise.all(
        keep.map((f) => {
          const body = {
            startup_id: startupId,
            name: f.name,
            title: f.title || null,
            linkedin_url: f.linkedin_url || null,
            photo_url: f.photo_url || null,
          };
          if (f.id) return api.put(`/founders/${f.id}`, body);
          return api.post('/founders', body);
        })
      );

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <StartupFormSkeleton founderCount={founderCount} />;
  }

  return (
    <div className="bg-[#f3f3f3]">
      <form onSubmit={onSubmit} className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <SectionEyebrow>{isEdit ? 'Edit' : 'New'}</SectionEyebrow>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tightish sm:text-5xl">
              {isEdit ? (
                <>Edit <Highlight>startup</Highlight></>
              ) : (
                <>Add a <Highlight>new startup</Highlight></>
              )}
            </h1>
            <p className="mt-2 text-sm text-ia-muted">
              Rich-text fields ({STARTUP_LABELS.description}, {STARTUP_LABELS.moat},{' '}
              {STARTUP_LABELS.traction}) support markdown — use the toolbar
              or write it directly. Switch to <span className="font-semibold text-ia-ink">Preview</span> to
              see how it'll render.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="card mb-6 border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Basics */}
        <Section title="Basics">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Startup name *" error={fieldErrors.name}>
              <input className="input" value={startup.name} onChange={(e) => set('name', e.target.value)} required />
            </Field>
            <Field label={STARTUP_LABELS.sector}>
              <input className="input" placeholder="Space-Tech, FinTech, HealthTech…" value={startup.sector} onChange={(e) => set('sector', e.target.value)} />
            </Field>
            <Field label={STARTUP_LABELS.stage}>
              <input className="input" placeholder="Pre-Seed, Seed, Series A…" value={startup.stage} onChange={(e) => set('stage', e.target.value)} />
            </Field>
            <Field label="Visible on public site">
              <label className="flex h-11 items-center gap-3">
                <button
                  type="button"
                  onClick={() => set('is_visible', !startup.is_visible)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    startup.is_visible ? 'bg-ia-ink' : 'bg-ia-line-2'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                      startup.is_visible ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-ia-muted">
                  {startup.is_visible ? 'Public' : 'Hidden from public'}
                </span>
              </label>
            </Field>
          </div>
        </Section>

        {/* Description — markdown */}
        <Section title={STARTUP_LABELS.description}>
          <p className="mb-3 text-xs text-ia-muted">
            Long-form company summary — shown on the public detail page under{' '}
            <span className="font-semibold text-ia-ink">{STARTUP_LABELS.description}</span>.
          </p>
          <MarkdownEditor
            value={startup.description}
            onChange={(v) => set('description', v)}
            rows={8}
            placeholder={`India is developing more than 100 satellites every year… **BAAS** is addressing this gap by developing a family of launch vehicles capable of carrying payloads ranging from small CubeSats to medium commercial satellites.`}
          />
        </Section>

        {/* Metrics — markdown bullets + structured label/value rows */}
        <Section
          title={STARTUP_LABELS.metrics}
          right={
            <button type="button" className="btn-secondary" onClick={addMetric}>
              + Add metric
            </button>
          }
        >
          <p className="mb-3 text-xs text-ia-muted">
            Add structured metrics below — any label, any value (Revenue, MRR, Users, NPS,
            Burn, Runway…). You can also use the markdown editor for free-form bullets.
          </p>

          {startup.metrics_list.length > 0 && (
            <div className="mb-5 space-y-2">
              {startup.metrics_list.map((m) => (
                <div key={m._localId} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input
                    className="input"
                    placeholder="Label (e.g. Revenue)"
                    value={m.label}
                    onChange={(e) => updateMetric(m._localId, { label: e.target.value })}
                  />
                  <input
                    className="input"
                    placeholder="Value (e.g. 6.7 L)"
                    value={m.value}
                    onChange={(e) => updateMetric(m._localId, { value: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => removeMetric(m._localId)}
                    aria-label="Remove metric"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <MarkdownEditor
            value={startup.metrics}
            onChange={(v) => set('metrics', v)}
            rows={5}
            placeholder={`- Revenue: 6.7 L\n- Valuation: 40 Cr\n- Ask: 8 Cr`}
          />
        </Section>

        {/* MOAT — markdown */}
        <Section title={STARTUP_LABELS.moat}>
          <p className="mb-3 text-xs text-ia-muted">
            What's defensible about this startup. Use bullet points for clarity.
          </p>
          <MarkdownEditor
            value={startup.moat}
            onChange={(v) => set('moat', v)}
            rows={5}
            placeholder={`- Indigenous small-launch vehicle development\n- Modular rocket architecture\n- Cost advantage over foreign launch providers`}
          />
        </Section>

        {/* Traction — markdown */}
        <Section title={STARTUP_LABELS.traction}>
          <p className="mb-3 text-xs text-ia-muted">
            Recent milestones, contracts, pilots, partnerships, revenue moments.
          </p>
          <MarkdownEditor
            value={startup.traction}
            onChange={(v) => set('traction', v)}
            rows={5}
            placeholder={`- Conducted a paid pilot mission with nominal flight results\n- Signed a Joint Application Form with a Brazilian partner`}
          />
        </Section>

        {/* Investor backers */}
        <Section title={STARTUP_LABELS.investorBackers}>
          <div className="flex flex-wrap items-center gap-2">
            {startup.investor_backers.map((b) => (
              <span key={b} className="badge gap-1.5">
                {b}
                <button
                  type="button"
                  className="text-ia-muted hover:text-ia-ink"
                  onClick={() => removeBacker(b)}
                  aria-label={`Remove ${b}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="input flex-1"
              placeholder="Type a backer name and press Enter"
              value={backerInput}
              onChange={(e) => setBackerInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addBacker();
                }
              }}
            />
            <button type="button" className="btn-secondary" onClick={addBacker}>
              Add
            </button>
          </div>
        </Section>

        {/* Links */}
        <Section title="Links">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Website URL" error={fieldErrors.website_url}>
              <input className="input" placeholder="https://…" value={startup.website_url} onChange={(e) => set('website_url', e.target.value)} />
            </Field>
            <Field label="Company LinkedIn URL" error={fieldErrors.linkedin_url}>
              <input className="input" placeholder="https://linkedin.com/company/…" value={startup.linkedin_url} onChange={(e) => set('linkedin_url', e.target.value)} />
            </Field>
            <Field label="Calendly URL" error={fieldErrors.calendly_url}>
              <input className="input" placeholder="https://calendly.com/…" value={startup.calendly_url} onChange={(e) => set('calendly_url', e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* Uploads */}
        <Section title="Assets">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="label">Logo</label>
              <div className="flex items-center gap-4">
                {startup.logo_url ? (
                  <img src={startup.logo_url} alt="" className="h-16 w-16 rounded-xl border border-ia-line bg-white object-contain p-1.5" />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-xl border border-ia-line bg-[#f3f3f3] text-[10px] font-semibold uppercase tracking-wider text-ia-muted">
                    No logo
                  </div>
                )}
                <label className="btn-secondary cursor-pointer">
                  {uploadingLogo ? 'Uploading…' : 'Upload logo'}
                  <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
                </label>
                {startup.logo_url && (
                  <button type="button" className="btn-ghost" onClick={() => set('logo_url', '')}>
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="label">Pitch deck (PDF)</label>
              <div className="flex items-center gap-4">
                {startup.pitch_deck_url ? (
                  <a
                    href={startup.pitch_deck_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-ia-ink hover:text-ia-ink-2"
                  >
                    View current deck →
                  </a>
                ) : (
                  <span className="text-sm text-ia-muted">No deck uploaded</span>
                )}
                <label className="btn-secondary cursor-pointer">
                  {uploadingDeck ? 'Uploading…' : 'Upload PDF'}
                  <input type="file" accept="application/pdf" className="hidden" onChange={onDeck} />
                </label>
                {startup.pitch_deck_url && (
                  <button type="button" className="btn-ghost" onClick={() => set('pitch_deck_url', '')}>
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* Founders */}
        <Section
          title={STARTUP_LABELS.founders}
          right={
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setFounders((f) => [...f, emptyFounder()])}
            >
              + Add founder
            </button>
          }
        >
          <div className="space-y-4">
            {founders.map((f, i) => (
              <FounderFieldGroup
                key={f._localId}
                index={i}
                founder={f}
                onChange={(updated) =>
                  setFounders((cur) =>
                    cur.map((x) =>
                      x._localId === f._localId
                        ? { ...updated, _localId: f._localId, id: f.id }
                        : x
                    )
                  )
                }
                onRemove={() =>
                  setFounders((cur) =>
                    cur.length > 1
                      ? cur.filter((x) => x._localId !== f._localId)
                      : [emptyFounder()]
                  )
                }
              />
            ))}
          </div>
        </Section>

        {/* Sticky save bar */}
        <div className="sticky bottom-0 mt-10 flex justify-end gap-2 border-t border-ia-line bg-white/95 py-4 backdrop-blur">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/admin/dashboard')}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes →' : 'Create startup →'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, right, children }) {
  return (
    <section className="card mb-6 p-6 sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tightish text-ia-ink">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function isUrl(s) {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
