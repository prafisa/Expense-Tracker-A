import React from 'react';
import { Tag, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, iconBg, iconColor, subtitle }) => (
  <div className="bg-white rounded-lg border border-zinc-200 p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-zinc-500">{title}</p>
        <p className="text-2xl font-semibold text-zinc-800">{value || 0}</p>
      </div>
      <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
    <p className="text-xs text-zinc-400 mt-2">{subtitle}</p>
  </div>
);

const CategoryStats = ({ stats }) => {
  // Ensure stats values are numbers
  const total = stats.total || 0;
  const incomeCount = stats.incomeCount || 0;
  const expenseCount = stats.expenseCount || 0;
  
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-zinc-800 mb-6">Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Categories" 
          value={total} 
          icon={Tag}
          iconBg="bg-violet-50"
          iconColor="text-violet-500"
          subtitle="All categories"
        />
        
        <StatCard 
          title="Income" 
          value={incomeCount} 
          icon={ArrowUpRight}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          subtitle="Income categories"
        />
        
        <StatCard 
          title="Expense" 
          value={expenseCount} 
          icon={ArrowDownRight}
          iconBg="bg-rose-50"
          iconColor="text-rose-500"
          subtitle="Expense categories"
        />
      </div>
    </div>
  );
};

export default CategoryStats;