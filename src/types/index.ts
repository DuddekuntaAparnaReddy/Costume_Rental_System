export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Costume {
  id: string;
  name: string;
  description: string;
  category: string;
  size: string;
  price: number;
  image: string;
  available: boolean;
  condition: 'excellent' | 'good' | 'fair';
}

export interface Rental {
  id: string;
  userId: string;
  costumeId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'returned' | 'cancelled';
  totalCost: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signup: (email: string, password: string, name: string) => boolean;
  isLoading: boolean;
}