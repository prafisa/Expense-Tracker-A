import * as LucideIcons from "lucide-react";

const CategoryIcon = ({ iconName, color, size = 16 }) => {
  const Icon = LucideIcons[iconName] || LucideIcons.Tag;

  const safeColor = color || "#6b7280";

  return (
    <div
      className="flex items-center justify-center rounded-lg w-9 h-9"
      style={{ backgroundColor: `${safeColor}20` }}
    >
      <Icon size={size} color={safeColor} />
    </div>
  );
};

export default CategoryIcon;