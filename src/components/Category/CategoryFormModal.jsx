// components/categories/CategoryFormModal.jsx
import {
  Tag, Type, ArrowDownUp, Grid2x2, Palette, CircleDollarSign,
  X, Check,
  Utensils, Car, ShoppingBag, HeartPulse, Home, Film, Plane,
  BookOpen, Zap, Music, Dumbbell, Coffee, PawPrint, Gift,
  Briefcase, Banknote, Smartphone, Bus, Wine, Stethoscope,
  Globe, Gamepad2, Landmark, BarChart2,
} from "lucide-react";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "../../data/categories";

const ICON_MAP = {
  utensils: Utensils, car: Car, "shopping-bag": ShoppingBag,
  "heart-pulse": HeartPulse, home: Home, film: Film, plane: Plane,
  "book-open": BookOpen, zap: Zap, music: Music, dumbbell: Dumbbell,
  coffee: Coffee, "paw-print": PawPrint, gift: Gift, briefcase: Briefcase,
  banknote: Banknote, smartphone: Smartphone, bus: Bus, wine: Wine,
  stethoscope: Stethoscope, globe: Globe, "gamepad-2": Gamepad2,
  landmark: Landmark, "chart-bar": BarChart2,
};

// selectedIcon and selectedColor are props to show pre-selected state (static UI only)
export default function CategoryFormModal({
  mode = "add",            // "add" | "edit"
  category = null,         // populated when mode === "edit"
  selectedIcon = "utensils",
  selectedColor = "#E24B4A",
  onClose,
  onSubmit,
}) {
  const title = mode === "add" ? "Add category" : "Edit category";
  const submitLabel = mode === "add" ? "Add category" : "Save changes";

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className="bg-white border border-gray-100 rounded-xl w-[340px] p-5 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Tag size={15} className="text-gray-400" />
          <h2 className="text-[14px] font-medium text-gray-900">{title}</h2>
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
            <Type size={11} /> Name
          </label>
          <input
            type="text"
            defaultValue={category?.name ?? ""}
            placeholder="e.g. Groceries"
            className="w-full h-[30px] border border-gray-200 rounded-lg px-2.5 text-[12px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        {/* Type */}
        <div className="mb-3">
          <label className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
            <ArrowDownUp size={11} /> Type
          </label>
          <select
            defaultValue={category?.type ?? "expense"}
            className="w-full h-[30px] border border-gray-200 rounded-lg px-2.5 text-[12px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Icon picker */}
        <div className="mb-3">
          <label className="flex items-center gap-1 text-[11px] text-gray-500 mb-1.5">
            <Grid2x2 size={11} /> Icon
          </label>
          <div className="grid grid-cols-7 gap-1">
            {CATEGORY_ICONS.map(({ name }) => {
              const Icon = ICON_MAP[name];
              const isSelected = name === selectedIcon;
              return (
                <button
                  key={name}
                  title={name}
                  className={`w-[31px] h-[31px] rounded-[7px] flex items-center justify-center border transition-colors
                    ${isSelected
                      ? "border-gray-900 bg-gray-100"
                      : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                >
                  {Icon && (
                    <Icon
                      size={14}
                      className={isSelected ? "text-gray-900" : "text-gray-500"}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color picker */}
        <div className="mb-3">
          <label className="flex items-center gap-1 text-[11px] text-gray-500 mb-1.5">
            <Palette size={11} /> Color
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORY_COLORS.map(({ hex, label }) => (
              <button
                key={hex}
                title={label}
                className={`w-[21px] h-[21px] rounded-full transition-all
                  ${hex === selectedColor
                    ? "ring-2 ring-offset-1 ring-gray-900 scale-110"
                    : "hover:scale-110"
                  }`}
                style={{ background: hex }}
              />
            ))}
          </div>
        </div>

        {/* Monthly budget */}
        <div className="mb-4">
          <label className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
            <CircleDollarSign size={11} /> Monthly budget (optional)
          </label>
          <input
            type="number"
            defaultValue={category?.budget ?? ""}
            placeholder="0"
            min="0"
            className="w-full h-[30px] border border-gray-200 rounded-lg px-2.5 text-[12px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X size={12} /> Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Check size={12} /> {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}