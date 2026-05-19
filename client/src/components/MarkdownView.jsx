import ReactMarkdown from 'react-markdown';

export default function MarkdownView({ md, className = '', empty = '—' }) {
  const text = (md || '').trim();
  if (!text) return <p className="text-ia-muted">{empty}</p>;
  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}
