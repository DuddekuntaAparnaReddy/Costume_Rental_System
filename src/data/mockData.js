import { UserRole, CostumeCondition, RentalStatus } from '../types/index.js';

export const mockUsers = [
  {
    id: '1',
    email: 'pehennawa@gmail.com',
    name: 'PEHENNAWA Admin',
    role: UserRole.ADMIN
  },
  {
    id: '2',
    email: 'john@example.com',
    name: 'John Doe',
    role: UserRole.USER,
    phone: '+1-555-0123'
  },
  {
    id: '3',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: UserRole.USER,
    phone: '+1-555-0124'
  }
];

export const mockCostumes = [
  {
    id: '1',
    name: 'Princess Belle Dress',
    description: 'Beautiful yellow princess dress with golden details, perfect for fairy tale parties and dress-up play.',
    category: 'Princess',
    size: 'S',
    price: 25,
    image: 'https://images.pexels.com/photos/8088495/pexels-photo-8088495.jpeg',
    available: true,
    condition: CostumeCondition.EXCELLENT,
    quantity: 3,
    totalQuantity: 3
  },
  {
    id: '2',
    name: 'Doctor Costume Set',
    description: 'Complete doctor costume with white coat, stethoscope, and medical accessories for aspiring young doctors.',
    category: 'Professional',
    size: 'M',
    price: 20,
    image: 'https://images.pexels.com/photos/8088496/pexels-photo-8088496.jpeg',
    available: true,
    condition: CostumeCondition.EXCELLENT,
    quantity: 4,
    totalQuantity: 4
  },
  {
    id: '3',
    name: 'Superhero Captain Set',
    description: 'Classic superhero costume with cape, mask, and emblem. Perfect for saving the day!',
    category: 'Superhero',
    size: 'L',
    price: 30,
    image: 'https://images.pexels.com/photos/8088497/pexels-photo-8088497.jpeg',
    available: false,
    condition: CostumeCondition.GOOD,
    quantity: 0,
    totalQuantity: 2
  },
  {
    id: '4',
    name: 'Police Officer Uniform',
    description: 'Authentic-looking police uniform with badge, hat, and accessories for law enforcement role play.',
    category: 'Professional',
    size: 'M',
    price: 22,
    image: 'https://images.pexels.com/photos/8088498/pexels-photo-8088498.jpeg',
    available: true,
    condition: CostumeCondition.GOOD,
    quantity: 2,
    totalQuantity: 3
  },
  {
    id: '5',
    name: 'Firefighter Hero Costume',
    description: 'Brave firefighter costume with helmet, jacket, and rescue accessories for emergency heroes.',
    category: 'Professional',
    size: 'L',
    price: 28,
    image: 'https://images.pexels.com/photos/8088499/pexels-photo-8088499.jpeg',
    available: true,
    condition: CostumeCondition.EXCELLENT,
    quantity: 3,
    totalQuantity: 3
  },
  {
    id: '6',
    name: 'Chef Master Outfit',
    description: 'Professional chef costume with hat, apron, and cooking utensils for culinary adventures.',
    category: 'Professional',
    size: 'S',
    price: 18,
    image: 'https://images.pexels.com/photos/8088500/pexels-photo-8088500.jpeg',
    available: true,
    condition: CostumeCondition.GOOD,
    quantity: 5,
    totalQuantity: 5
  },
  {
    id: '7',
    name: 'Pirate Adventure Set',
    description: 'Complete pirate costume with hat, sword, eye patch, and treasure map for high seas adventures.',
    category: 'Fantasy',
    size: 'M',
    price: 26,
    image: 'https://images.pexels.com/photos/8088501/pexels-photo-8088501.jpeg',
    available: true,
    condition: CostumeCondition.EXCELLENT,
    quantity: 2,
    totalQuantity: 2
  },
  {
    id: '8',
    name: 'Fairy Princess Wings',
    description: 'Magical fairy costume with iridescent wings, wand, and sparkling dress for enchanted play.',
    category: 'Fantasy',
    size: 'S',
    price: 24,
    image: 'https://images.pexels.com/photos/8088502/pexels-photo-8088502.jpeg',
    available: true,
    condition: CostumeCondition.EXCELLENT,
    quantity: 4,
    totalQuantity: 4
  }
];

export const mockRentals = [
  {
    id: '1',
    userId: '2',
    costumeId: '3',
    startDate: '2024-12-20',
    endDate: '2024-12-22',
    status: RentalStatus.ACTIVE,
    totalCost: 60,
    paymentMethod: 'online'
  },
  {
    id: '2',
    userId: '2',
    costumeId: '1',
    startDate: '2024-11-15',
    endDate: '2024-11-17',
    status: RentalStatus.RETURNED,
    totalCost: 50,
    paymentMethod: 'cod'
  },
  {
    id: '3',
    userId: '3',
    costumeId: '2',
    startDate: '2024-10-31',
    endDate: '2024-11-02',
    status: RentalStatus.RETURNED,
    totalCost: 40,
    paymentMethod: 'online'
  }
];