import {
  Briefcase, Gift, TrendingUp, PiggyBank, Sparkles, GraduationCap,
  ShoppingBag, ShoppingCart, Shirt, Coffee, Utensils, Beer, Cake,
  Home, Droplet, Zap, Wifi, Car, Bus, Plane, Film, Tv, Gamepad2,
  Music, Heart, Dumbbell, Book, Paintbrush, Scissors, Phone, Stethoscope,
  Dog, Tag
} from 'lucide-react';

export const iconComponents = {
  // Income Icons
  Briefcase: Briefcase,
  Gift: Gift,
  TrendingUp: TrendingUp,
  PiggyBank: PiggyBank,
  Sparkles: Sparkles,
  GraduationCap: GraduationCap,
  
  // Expense Icons
  ShoppingBag: ShoppingBag,
  ShoppingCart: ShoppingCart,
  Shirt: Shirt,
  Coffee: Coffee,
  Utensils: Utensils,
  Beer: Beer,
  Cake: Cake,
  Home: Home,
  Droplet: Droplet,
  Zap: Zap,
  Wifi: Wifi,
  Car: Car,
  Bus: Bus,
  Plane: Plane,
  Film: Film,
  Tv: Tv,
  Gamepad2: Gamepad2,
  Music: Music,
  Heart: Heart,
  Dumbbell: Dumbbell,
  Book: Book,
  Paintbrush: Paintbrush,
  Scissors: Scissors,
  Phone: Phone,
  Stethoscope: Stethoscope,
  Dog: Dog,
  Tag: Tag
};

export const iconNameMap = {
  // Income Icons
  Briefcase: 'Salary / Business',
  Gift: 'Gift / Bonus',
  TrendingUp: 'Investment',
  PiggyBank: 'Savings',
  Sparkles: 'Freelance',
  GraduationCap: 'Scholarship',
  
  // Expense Icons
  ShoppingBag: 'Shopping',
  ShoppingCart: 'Groceries',
  Utensils: 'Dining',
  Coffee: 'Coffee',
  Home: 'Housing',
  Zap: 'Electricity',
  Droplet: 'Water',
  Wifi: 'Internet',
  Car: 'Transport',
  Bus: 'Public Transport',
  Plane: 'Travel',
  Film: 'Entertainment',
  Tv: 'Streaming',
  Gamepad2: 'Gaming',
  Music: 'Music',
  Heart: 'Health',
  Dumbbell: 'Fitness',
  Book: 'Education',
  Shirt: 'Clothing',
  Scissors: 'Salon',
  Phone: 'Mobile',
  Stethoscope: 'Medical',
  Dog: 'Pet',
  Beer: 'Bars',
  Cake: 'Celebrations',
  Paintbrush: 'Hobbies',
  Tag: 'Other'
};

export const getCategoryNameFromIcon = (iconName) => {
  return iconNameMap[iconName] || iconName;
};

export const incomeIcons = [
  { value: 'Briefcase', label: '💼 Salary / Business' },
  { value: 'Gift', label: '🎁 Gift / Bonus' },
  { value: 'TrendingUp', label: '📈 Investment' },
  { value: 'PiggyBank', label: '🐷 Savings' },
  { value: 'Sparkles', label: '✨ Freelance' },
  { value: 'GraduationCap', label: '🎓 Scholarship' }
];

export const expenseIcons = [
  { value: 'ShoppingBag', label: '🛍️ Shopping' },
  { value: 'ShoppingCart', label: '🛒 Groceries' },
  { value: 'Utensils', label: '🍽️ Dining' },
  { value: 'Coffee', label: '☕ Coffee' },
  { value: 'Home', label: '🏠 Housing' },
  { value: 'Zap', label: '⚡ Electricity' },
  { value: 'Droplet', label: '💧 Water' },
  { value: 'Wifi', label: '📡 Internet' },
  { value: 'Car', label: '🚗 Transport' },
  { value: 'Bus', label: '🚌 Public Transport' },
  { value: 'Plane', label: '✈️ Travel' },
  { value: 'Film', label: '🎬 Entertainment' },
  { value: 'Tv', label: '📺 Streaming' },
  { value: 'Gamepad2', label: '🎮 Gaming' },
  { value: 'Music', label: '🎵 Music' },
  { value: 'Heart', label: '❤️ Health' },
  { value: 'Dumbbell', label: '💪 Fitness' },
  { value: 'Book', label: '📚 Education' },
  { value: 'Shirt', label: '👕 Clothing' },
  { value: 'Scissors', label: '✂️ Salon' },
  { value: 'Phone', label: '📱 Mobile' },
  { value: 'Stethoscope', label: '🏥 Medical' },
  { value: 'Dog', label: '🐕 Pet' },
  { value: 'Beer', label: '🍺 Bars' },
  { value: 'Cake', label: '🎂 Celebrations' },
  { value: 'Paintbrush', label: '🎨 Hobbies' },
  { value: 'Tag', label: '🏷️ Other' }
];