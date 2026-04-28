import React from 'react';
import { iconComponents } from '../utils/iconMapper';

const Icon = ({ name, size = 20, color = '#64748b', strokeWidth = 1.5 }) => {
  const IconComponent = iconComponents[name];
  
  if (!IconComponent) {
    return null;
  }
  
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} />;
};

export default Icon;