// src/components/Common/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon: Icon, iconColor = 'violet', footer }) => {
  const iconBgColors = {
    violet: 'bg-violet-50',
    emerald: 'bg-emerald-50',
    rose: 'bg-rose-50',
    blue: 'bg-blue-50'
  };

  const iconTextColors = {
    violet: 'text-violet-500',
    emerald: 'text-emerald-500',
    rose: 'text-rose-500',
    blue: 'text-blue-500'
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={`w-10 h-10 ${iconBgColors[iconColor]} rounded-full flex items-center justify-center`}>
          <Icon size={20} className={iconTextColors[iconColor]} />
        </div>
      </div>
      {footer && <p className="text-xs text-slate-400 mt-2">{footer}</p>}
    </div>
  );
};

export default StatsCard;