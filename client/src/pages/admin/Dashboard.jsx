import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios.js';
import AdminTable from '../../components/AdminTable.jsx';
import AdminTableSkeleton from '../../components/skeleton/AdminTableSkeleton.jsx';
import { Highlight, SectionEyebrow } from '../../components/brand.jsx';

const STAT_BAR_COLORS = ['bg-ia-blue', 'bg-ia-green', 'bg-ia-orange'];

export default function AdminDashboard() {
  const [startups, setStartups] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/startups/all');
      setStartups(data);
      setRowCount(data.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = startups.length;
    const visible = startups.filter((s) => s.is_visible).length;
    return [
      { label: 'Total startups', value: total },
      { label: 'Visible to public', value: visible },
      { label: 'Hidden', value: total - visible },
    ];
  }, [startups]);

  const toggleVisible = async (s) => {
    const prev = startups;
    setStartups((cur) =>
      cur.map((x) => (x.id === s.id ? { ...x, is_visible: !x.is_visible } : x))
    );
    try {
      await api.patch(`/startups/${s.id}/visibility`, { is_visible: !s.is_visible });
    } catch (err) {
      setStartups(prev);
      setError(err.message);
    }
  };

  const onDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/startups/${confirmDelete.id}`);
      setStartups((cur) => {
        const next = cur.filter((x) => x.id !== confirmDelete.id);
        setRowCount(next.length);
        return next;
      });
      setConfirmDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#f3f3f3]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <SectionEyebrow>Admin</SectionEyebrow>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tightish sm:text-5xl">
              Cohort <Highlight>dashboard</Highlight>.
            </h1>
            <p className="mt-2 text-sm text-ia-muted">
              Manage startups, founders, and visibility on the public investor site.
            </p>
          </div>
          <Link to="/admin/startups/new" className="btn-primary">
            + Add new startup
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div key={s.label} className="card p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ia-muted">
                {s.label}
              </div>
              <div className="mt-2 text-4xl font-extrabold tracking-tightish text-ia-ink">
                {s.value}
              </div>
              <span className={`stat-bar ${STAT_BAR_COLORS[i]}`} />
            </div>
          ))}
        </div>

        {error && (
          <div className="card mb-6 border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <AdminTableSkeleton rows={startups.length || rowCount} />
        ) : (
          <AdminTable
            startups={startups}
            onToggleVisible={toggleVisible}
            onDelete={(s) => setConfirmDelete(s)}
          />
        )}

        {confirmDelete && (
          <Modal onClose={() => setConfirmDelete(null)}>
            <h3 className="text-xl font-extrabold tracking-tightish text-ia-ink">
              Delete startup?
            </h3>
            <p className="mt-2 text-sm text-ia-muted">
              This will permanently delete{' '}
              <span className="font-semibold text-ia-ink">{confirmDelete.name}</span>{' '}
              and all of its founders. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-ia-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ia-ink-2"
                onClick={onDelete}
              >
                Delete permanently
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="card-soft w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
