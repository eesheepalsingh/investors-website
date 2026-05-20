import { useState } from 'react';
import { api } from '../lib/axios.js';

export default function FounderFieldGroup({ index, founder, onChange, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const set = (key, value) => onChange({ ...founder, [key]: value });

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post('/upload/founder-photo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set('photo_url', data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card relative p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-ia-ink">
          Founder #{index + 1}
        </h4>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="label">Name *</label>
          <input
            className="input"
            value={founder.name || ''}
            onChange={(e) => set('name', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Title</label>
          <input
            className="input"
            placeholder="CEO & Co-Founder"
            value={founder.title || ''}
            onChange={(e) => set('title', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="label">LinkedIn URL</label>
          <input
            className="input"
            placeholder="https://linkedin.com/in/…"
            value={founder.linkedin_url || ''}
            onChange={(e) => set('linkedin_url', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="label">Photo</label>
          <div className="flex items-center gap-4">
            {founder.photo_url ? (
              <img
                src={founder.photo_url}
                alt=""
                className="h-14 w-14 rounded-full border border-ia-line object-cover"
              />
            ) : (
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[#f3f3f3] text-[10px] font-semibold uppercase tracking-wider text-ia-muted">
                No photo
              </div>
            )}
            <label className="btn-secondary cursor-pointer">
              {uploading ? 'Uploading…' : 'Upload photo'}
              <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </label>
            {founder.photo_url && (
              <button
                type="button"
                onClick={() => set('photo_url', '')}
                className="btn-ghost"
              >
                Clear
              </button>
            )}
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
