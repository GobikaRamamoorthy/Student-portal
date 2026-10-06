export default function EmptyState({ emoji = '📭', title, subtitle, children }) {
  return (
    <div className="empty">
      <div className="emoji">{emoji}</div>
      <h3 className="mt-1">{title}</h3>
      {subtitle && <p className="muted mt-1">{subtitle}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
