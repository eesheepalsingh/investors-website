import { useRef, useState } from 'react';
import MarkdownView from './MarkdownView.jsx';

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write in markdown — **bold**, *italic*, lists, links…',
  rows = 8,
}) {
  const [tab, setTab] = useState('write');
  const ref = useRef(null);

  const wrap = (before, after = before) => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const v = value || '';
    const selected = v.slice(start, end) || 'text';
    const next = v.slice(0, start) + before + selected + after + v.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const prefixLines = (prefix) => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const v = value || '';
    const before = v.slice(0, start);
    const sel = v.slice(start, end) || 'item';
    const after = v.slice(end);
    const prefixed = sel
      .split('\n')
      .map((l) => (l ? `${prefix}${l}` : l))
      .join('\n');
    onChange(before + prefixed + after);
  };

  return (
    <div className="rounded-xl border border-ia-line bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-ia-line px-3 py-2">
        <div className="flex items-center gap-1">
          <ToolBtn title="Bold (⌘B)" onClick={() => wrap('**')}>
            <b>B</b>
          </ToolBtn>
          <ToolBtn title="Italic (⌘I)" onClick={() => wrap('*')}>
            <i>I</i>
          </ToolBtn>
          <ToolBtn title="Heading" onClick={() => prefixLines('## ')}>
            H
          </ToolBtn>
          <Sep />
          <ToolBtn title="Bullet list" onClick={() => prefixLines('- ')}>
            •
          </ToolBtn>
          <ToolBtn title="Numbered list" onClick={() => prefixLines('1. ')}>
            1.
          </ToolBtn>
          <Sep />
          <ToolBtn title="Link" onClick={() => wrap('[', '](https://)')}>
            🔗
          </ToolBtn>
          <ToolBtn title="Inline code" onClick={() => wrap('`')}>
            {'</>'}
          </ToolBtn>
        </div>

        <div className="inline-flex rounded-full bg-[#f3f3f3] p-0.5 text-xs font-semibold">
          <TabBtn active={tab === 'write'} onClick={() => setTab('write')}>
            Write
          </TabBtn>
          <TabBtn active={tab === 'preview'} onClick={() => setTab('preview')}>
            Preview
          </TabBtn>
        </div>
      </div>

      {tab === 'write' ? (
        <textarea
          ref={ref}
          rows={rows}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
              e.preventDefault();
              wrap('**');
            }
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
              e.preventDefault();
              wrap('*');
            }
          }}
          placeholder={placeholder}
          className="block w-full resize-y rounded-b-xl bg-white px-4 py-3 text-sm font-mono leading-relaxed text-ia-ink placeholder:text-ia-muted-2 focus:outline-none"
        />
      ) : (
        <div className="min-h-[8rem] px-4 py-3">
          <MarkdownView md={value} empty="Nothing to preview yet." />
        </div>
      )}
    </div>
  );
}

function ToolBtn({ children, onClick, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="grid h-7 w-8 place-items-center rounded-md text-xs text-ia-ink/80 transition hover:bg-[#f3f3f3] hover:text-ia-ink"
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-0.5 inline-block h-4 w-px bg-ia-line" />;
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 transition ${
        active ? 'bg-white text-ia-ink shadow-sm' : 'text-ia-muted hover:text-ia-ink'
      }`}
    >
      {children}
    </button>
  );
}
