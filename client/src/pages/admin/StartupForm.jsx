import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/axios.js';
import FounderFieldGroup from '../../components/FounderFieldGroup.jsx';
import { Highlight, SectionEyebrow } from '../../components/brand.jsx';

const emptyStartup = {
  name: '',
  logo_url: '',
  sector: '',
  stage: '',
  revenue: '',
  ask: '',
  investor_backers: [],
  pitch_deck_url: '',
  linkedin_url: '',
  website_url: '',
  calendly_url: '',
  short_description: '',
  is_visible: true,
};

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
    return (
      <div className="bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="card h-96 animate-pulse bg-ia-cream" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper">
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
              Changes save when you click{' '}
              <span className="font-semibold text-ia-ink">
                {isEdit ? '"Save changes"' : '"Create startup"'}
              </span>
              .
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
            <Field label="Sector">
              <input className="input" placeholder="FinTech, HealthTech…" value={startup.sector} onChange={(e) => set('sector', e.target.value)} />
            </Field>
            <Field label="Stage">
              <input className="input" placeholder="Pre-Seed, Seed, Series A…" value={startup.stage} onChange={(e) => set('stage', e.target.value)} />
            </Field>
            <Field label="Revenue">
              <input className="input" placeholder="₹50L ARR" value={startup.revenue} onChange={(e) => set('revenue', e.target.value)} />
            </Field>
            <Field label="Ask">
              <input className="input" placeholder="₹2Cr for 10%" value={startup.ask} onChange={(e) => set('ask', e.target.value)} />
            </Field>
            <Field label="Visible on public site">
              <label className="flex h-11 items-center gap-3">
                <button
                  type="button"
                  onClick={() => set('is_visible', !startup.is_visible)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    startup.is_visible ? 'bg-ia-orange' : 'bg-ia-line-2'
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

          <div className="mt-4">
            <Field label="Short description (1–2 sentences)">
              <textarea
                className="input min-h-[96px]"
                maxLength={280}
                value={startup.short_description}
                onChange={(e) => set('short_description', e.target.value)}
              />
            </Field>
          </div>
        </Section>

        {/* Investor backers */}
        <Section title="Investor backers">
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
                  <div className="grid h-16 w-16 place-items-center rounded-xl border border-ia-line bg-ia-cream text-[10px] font-semibold uppercase tracking-wider text-ia-muted">
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
                    className="text-sm font-semibold text-ia-orange hover:text-ia-orange-2"
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
          title="Founders"
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
