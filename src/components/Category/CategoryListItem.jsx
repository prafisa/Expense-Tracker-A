import React from 'react';
import Icon from '../Icon';

const CategoryListItem = ({ category, onEdit, onDelete }) => {
  const categoryName = category.name || 'Unnamed';
  
  // Determine the type correctly for display
  let displayType = 'EXPENSE';
  const originalType = category.type;
  
  if (typeof originalType === 'number') {
    displayType = originalType === 0 ? 'INCOME' : 'EXPENSE';
  } else if (typeof originalType === 'string') {
    displayType = originalType.toUpperCase();
  }
  
  const categoryIcon = category.icon || 'Tag';
  const categoryColor = category.color || '#64748b';
  const categoryDescription = category.description || '';
  
  console.log(`Category: ${categoryName}, Original Type: ${originalType}, Display Type: ${displayType}`);
  
  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-4 hover:border-zinc-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${categoryColor}15` }}
          >
            <Icon name={categoryIcon} color={categoryColor} size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-zinc-800">{categoryName}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                displayType === 'INCOME' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'bg-rose-50 text-rose-600'
              }`}>
                {displayType}
              </span>
            </div>
            {categoryDescription && (
              <p className="text-xs text-zinc-400">{categoryDescription}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(category)}
            className="px-3 py-1.5 text-sm text-zinc-600 hover:text-violet-500 rounded-md transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="px-3 py-1.5 text-sm text-zinc-600 hover:text-rose-500 rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryListItem;