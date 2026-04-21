// components/categories/CategoryCard.jsx
import {
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  Pencil,
  Trash2,
  MinusCircle,
  // icon map imports
  Utensils, Car, ShoppingBag, HeartPulse, Home, Film, Plane,
  BookOpen, Zap, Music, Dumbbell, Coffee, PawPrint, Gift,
  Briefcase, Banknote, Smartphone, Bus, Wine, Stethoscope,
  Globe, Gamepad2, Landmark, BarChart2,
} from "lucide-react";

const ICON_MAP = {
  utensils: Utensils,
  car: Car,
  "shopping-bag": ShoppingBag,
  "heart-pulse": HeartPulse,
  home: Home,
  film: Film,
  plane: Plane,
  "book-open": BookOpen,
  zap: Zap,
  music: Music,
  dumbbell: Dumbbell,
  coffee: Coffee,
  "paw-print": PawPrint,
  gift: Gift,
  briefcase: Briefcase,
  banknote: Banknote,
  smartphone: Smartphone,
  bus: Bus,
  wine: Wine,
  stethoscope: Stethoscope,
  globe: Globe,
  "gamepad-2": Gamepad2,
  landmark: Landmark,
  "chart-bar": BarChart2,
};

function BudgetBar({ spent, budget }) {
  const pct = Math.min(100, Math.round((spent / budget) * 100));
  const barColor =
    pct >= 100 ? "#E24B4A" : pct >= 80 ? "#BA7517" : "#1D9E75";

  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
        <span>Spent</span>
        <span>
          Rs {spent.toLocaleString()} / {budget.toLocaleString()}
        </span>
      </div>
      <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
    </div>
  );
}

export default function CategoryCard({ category, onEdit, onDelete }) {
  const {
    name,
    icon,
    iconBg,
    iconColor,
    type,
    budget,
    spent,
    transactionCount,
  } = category;

  const Icon = ICON_MAP[icon] ?? Utensils;
  const isExpense = type === "expense";

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div
          className="w-[33px] h-[33px] rounded-[8px] flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}
        >
          <Icon size={16} color={iconColor} />
        </div>

        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${
            isExpense
              ? "bg-[#FAECE7] text-[#993C1D]"
              : "bg-[#EAF3DE] text-[#3B6D11]"
          }`}
        >
          {isExpense ? <ArrowDownRight size={9} /> : <ArrowUpRight size={9} />}
          {type}
        </span>
      </div>

      {/* Name & count */}
      <p className="text-[12.5px] font-medium text-gray-900 leading-none mb-0.5">
        {name}
      </p>
      <p className="text-[11px] text-gray-500 flex items-center gap-1">
        <Receipt size={10} />
        {transactionCount} transaction{transactionCount !== 1 ? "s" : ""}
      </p>

      {/* Budget */}
      {budget > 0 ? (
        <BudgetBar spent={spent} budget={budget} />
      ) : (
        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1.5">
          <MinusCircle size={10} />
          No budget set
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-1.5 mt-2.5 pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit?.(category)}
          className="flex-1 flex items-center justify-center gap-1 text-[11px] text-gray-500 border border-gray-200 rounded-md py-1 hover:bg-gray-50 transition-colors"
        >
          <Pencil size={11} />
          Edit
        </button>
        <button
          onClick={() => onDelete?.(category)}
          className="flex-1 flex items-center justify-center gap-1 text-[11px] text-red-700 border border-red-200 rounded-md py-1 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={11} />
          Delete
        </button>
      </div>
    </div>
  );
}