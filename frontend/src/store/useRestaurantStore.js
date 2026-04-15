import { create } from 'zustand';

import imgSubzEBiryani from '../images/Subz-e-Biryani.avif';
import imgMurghEKhaas from '../images/Murgh-e-Khaas.webp';
import imgZaikedaarPaneer from '../images/Zaikedaar Paneer.jpg';
import imgDumGosht from '../images/Dum Gosht.webp';
import imgNooraniKheer from '../images/Noorani Kheer.jpg';
import imgShahiTukda from '../images/Shahi Tukda.jpg';
import imgDalMakhani from '../images/Dal Makhani.webp';
import imgMuttonRoganJosh from '../images/Mutton Rogan Josh.avif';
import imgKeemaNaan from '../images/Keema Naan.jpg';
import imgGarlicKulcha from '../images/Garlic Kulcha.webp';
import imgMasalaChaiKulfi from '../images/Masala Chai Kulfi.jpg';
import imgSeekhKebab from '../images/Seekh Kebab.webp';
import imgPaneerTikka from '../images/Paneer Tikka.webp';
import imgMuttonBiryani from '../images/Mutton Biryani.jpg';
import imgRoyalShirazi from '../images/Royal Shirazi.webp';
import imgMangoLassi from '../images/Mango Lassi.jpg';

const MENU_ITEMS = [
  { id: 'm1', name: 'Subz-e-Biryani', category: 'Biryani', price: 349, description: 'Fragrant basmati rice layered with garden vegetables and royal spices', type: 'Signature', available: true, image: imgSubzEBiryani, emoji: '🍚' },
  { id: 'm2', name: 'Murgh-e-Khaas', category: 'Mains', price: 520, description: 'Tender chicken slow-cooked in a rich saffron and cream gravy', type: 'Premium', available: true, image: imgMurghEKhaas, emoji: '🍗' },
  { id: 'm3', name: 'Zaikedaar Paneer', category: 'Mains', price: 310, description: 'Cottage cheese cubes in a velvety tomato and cashew curry', type: 'Classic', available: true, image: imgZaikedaarPaneer, emoji: '🧀' },
  { id: 'm4', name: 'Dum Gosht', category: 'Mains', price: 680, description: 'Slow-cooked mutton with whole spices in a sealed handi', type: 'Signature', available: true, image: imgDumGosht, emoji: '🥘' },
  { id: 'm5', name: 'Noorani Kheer', category: 'Desserts', price: 180, description: 'Rose-infused rice pudding topped with pistachios and silver leaf', type: 'Dessert', available: true, image: imgNooraniKheer, emoji: '🍮' },
  { id: 'm6', name: 'Shahi Tukda', category: 'Desserts', price: 220, description: 'Deep-fried bread soaked in saffron milk, layered with rabri', type: 'Dessert', available: true, image: imgShahiTukda, emoji: '🍞' },
  { id: 'm7', name: 'Dal Makhani', category: 'Mains', price: 280, description: 'Slow-simmered black lentils with butter and cream, 12-hour cooked', type: 'Classic', available: true, image: imgDalMakhani, emoji: '🫘' },
  { id: 'm8', name: 'Mutton Rogan Josh', category: 'Mains', price: 720, description: 'Kashmiri-style mutton in a bold, aromatic red chili gravy', type: 'Premium', available: false, image: imgMuttonRoganJosh, emoji: '🥩' },
  { id: 'm9', name: 'Keema Naan', category: 'Breads', price: 120, description: 'Stuffed flatbread with spiced minced lamb, baked in tandoor', type: 'Classic', available: true, image: imgKeemaNaan, emoji: '🫓' },
  { id: 'm10', name: 'Garlic Kulcha', category: 'Breads', price: 80, description: 'Soft leavened bread with roasted garlic and herbs', type: 'Classic', available: true, image: imgGarlicKulcha, emoji: '🥙' },
  { id: 'm11', name: 'Masala Chai Kulfi', category: 'Desserts', price: 160, description: 'Spiced tea-infused ice cream on a stick, a heritage recipe', type: 'Dessert', available: true, image: imgMasalaChaiKulfi, emoji: '🍦' },
  { id: 'm12', name: 'Seekh Kebab', category: 'Starters', price: 380, description: 'Minced lamb with ginger, green chili and herbs on skewers', type: 'Premium', available: true, image: imgSeekhKebab, emoji: '🍢' },
  { id: 'm13', name: 'Paneer Tikka', category: 'Starters', price: 320, description: 'Marinated cottage cheese grilled in tandoor with bell peppers', type: 'Classic', available: true, image: imgPaneerTikka, emoji: '🫕' },
  { id: 'm14', name: 'Mutton Biryani', category: 'Biryani', price: 580, description: 'Dum-cooked mutton with aged basmati rice, a masterpiece', type: 'Signature', available: true, image: imgMuttonBiryani, emoji: '🍛' },
  { id: 'm15', name: 'Royal Shirazi', category: 'Drinks', price: 120, description: 'Persian-style cucumber and tomato salad with rose water', type: 'Classic', available: true, image: imgRoyalShirazi, emoji: '🥗' },
  { id: 'm16', name: 'Mango Lassi', category: 'Drinks', price: 99, description: 'Chilled yogurt drink blended with Alphonso mangoes', type: 'Classic', available: true, image: imgMangoLassi, emoji: '🥛' },
];

const INITIAL_TABLES = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  number: i + 1,
  capacity: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
  status: i === 2 ? 'occupied' : i === 5 ? 'reserved' : i === 8 ? 'occupied' : 'available',
  customerName: i === 2 ? 'Ravi Gupta' : i === 8 ? 'Anjali Mehta' : null,
  orderId: null,
}));

const CATEGORIES = ['All', 'Starters', 'Biryani', 'Mains', 'Breads', 'Desserts', 'Drinks'];

const useRestaurantStore = create((set, get) => ({
  menuItems: MENU_ITEMS,
  tables: INITIAL_TABLES,
  categories: CATEGORIES,

  getMenuByCategory: (category) => {
    const { menuItems } = get();
    if (category === 'All') return menuItems;
    return menuItems.filter(item => item.category === category);
  },

  toggleItemAvailability: (itemId) => set((state) => ({
    menuItems: state.menuItems.map(item =>
      item.id === itemId ? { ...item, available: !item.available } : item
    ),
  })),

  addMenuItem: (item) => set((state) => ({
    menuItems: [...state.menuItems, { ...item, id: `m${Date.now()}`, available: true }],
  })),

  removeMenuItem: (itemId) => set((state) => ({
    menuItems: state.menuItems.filter(item => item.id !== itemId),
  })),

  seatCustomer: (tableId, customerName) => set((state) => ({
    tables: state.tables.map(t =>
      t.id === tableId ? { ...t, status: 'occupied', customerName } : t
    ),
  })),

  clearTable: (tableId) => set((state) => ({
    tables: state.tables.map(t =>
      t.id === tableId ? { ...t, status: 'available', customerName: null, orderId: null } : t
    ),
  })),

  reserveTable: (tableId, customerName) => set((state) => ({
    tables: state.tables.map(t =>
      t.id === tableId ? { ...t, status: 'reserved', customerName } : t
    ),
  })),

  updateTableOrder: (tableId, orderId) => set((state) => ({
    tables: state.tables.map(t =>
      t.id === tableId ? { ...t, orderId } : t
    ),
  })),
}));

export default useRestaurantStore;
