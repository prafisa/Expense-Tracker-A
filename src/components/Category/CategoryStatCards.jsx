// components/categories/CategoryStatCards.jsx
import { Layers, TrendingDown, TrendingUp, CircleDollarSign } from "lucide-react";

const stats = [
  { label: "Total",       value: 8,  icon: Layers            },
  { label: "Expense",     value: 6,  icon: TrendingDown      },
  { label: "Income",      value: 2,  icon: TrendingUp        },
  { label: "With budget", value: 4,  icon: CircleDollarSign  },
];

export default function CategoryStatCards() {
  return (
    <div className="grid grid-cols-4 gap-3 ">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="bg-gray-100 rounded-lg px-3 py-2.5 "
        >
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
            <Icon size={13} />
            {label}
          </div>
          <div className="text-[23px] font-medium text-gray-900">{value}</div>
        </div>
      ))}
    </div>
  );
}