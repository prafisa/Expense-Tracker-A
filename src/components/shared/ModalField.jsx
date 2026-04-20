

export default function ModalField({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-rose-500">{error}</p>
      )}
    </div>
  )
}