export default function StatCard({ icon: Icon, label, value, sub, accent }) {
  const accentMap = {
    violet: 'bg-violet-50 text-violet-600',
    rose: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  }
  
  return (
    <div className="bg-white border border-zinc-100 rounded-xl p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${accentMap[accent]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-xl font-semibold text-zinc-800">{value}</p>
        {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}