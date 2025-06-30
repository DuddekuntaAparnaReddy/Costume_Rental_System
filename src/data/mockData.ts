import { User, Costume, Rental } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@costumeworld.com',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'user'
  }
];

export const mockCostumes: Costume[] = [
  {
    id: '1',
    name: 'Medieval Knight Armor',
    description: 'Complete medieval knight costume with chainmail and sword',
    category: 'Historical',
    size: 'L',
    price: 45,
    image: 'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg',
    available: true,
    condition: 'excellent'
  },
  {
    id: '2',
    name: 'Victorian Ball Gown',
    description: 'Elegant Victorian-era ball gown with corset and bustle',
    category: 'Historical',
    size: 'M',
    price: 65,
    image: 'https://images.pexels.com/photos/6069113/pexels-photo-6069113.jpeg',
    available: true,
    condition: 'excellent'
  },
  {
    id: '3',
    name: 'Superhero Cape Set',
    description: 'Classic superhero costume with cape, mask, and emblem',
    category: 'Superhero',
    size: 'L',
    price: 35,
    image: 'https://images.pexels.com/photos/6069114/pexels-photo-6069114.jpeg',
    available: false,
    condition: 'good'
  },
  {
    id: '4',
    name: 'Pirate Captain Outfit',
    description: 'Complete pirate costume with hat, sword, and accessories',
    category: 'Fantasy',
    size: 'XL',
    price: 40,
    image: 'https://images.pexels.com/photos/6069115/pexels-photo-6069115.jpeg',
    available: true,
    condition: 'good'
  },
  {
    id: '5',
    name: 'Fairy Princess Dress',
    description: 'Magical fairy princess costume with wings and tiara',
    category: 'Fantasy',
    size: 'S',
    price: 30,
    image: 'https://images.pexels.com/photos/6069116/pexels-photo-6069116.jpeg',
    available: true,
    condition: 'excellent'
  },
  {
    id: '6',
    name: 'Zombie Apocalypse Set',
    description: 'Terrifying zombie costume with special effects makeup',
    category: 'Horror',
    size: 'M',
    price: 55,
    image: 'https://images.pexels.com/photos/6069117/pexels-photo-6069117.jpeg',
    available: true,
    condition: 'fair'
  }
];

export const mockRentals: Rental[] = [
  {
    id: '1',
    userId: '2',
    costumeId: '3',
    startDate: '2024-12-20',
    endDate: '2024-12-22',
    status: 'active',
    totalCost: 70
  }
];