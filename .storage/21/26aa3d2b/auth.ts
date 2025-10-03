export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'seller' | 'buyer';
  status: 'active' | 'pending' | 'blocked';
  createdAt: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sellerId: string;
  sellerName: string;
  carbonFootprint: number;
  ecoRating: number;
  image: string;
  status: 'active' | 'pending' | 'removed';
  createdAt: string;
}

// Mock data for demonstration
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@ecobazar.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    username: 'seller1',
    email: 'seller1@example.com',
    role: 'seller',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    username: 'buyer1',
    email: 'buyer1@example.com',
    role: 'buyer',
    status: 'active',
    createdAt: '2024-02-01',
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Eco-Friendly Water Bottle',
    description: 'Sustainable bamboo water bottle with zero plastic',
    price: 29.99,
    category: 'Home & Garden',
    sellerId: '2',
    sellerName: 'EcoSeller',
    carbonFootprint: 2.5,
    ecoRating: 9.2,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    status: 'active',
    createdAt: '2024-02-15',
  },
  {
    id: '2',
    name: 'Solar Power Bank',
    description: 'Portable solar-powered charging device',
    price: 89.99,
    category: 'Electronics',
    sellerId: '2',
    sellerName: 'EcoSeller',
    carbonFootprint: 4.2,
    ecoRating: 8.7,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    description: 'Fair trade organic cotton t-shirt with natural dyes',
    price: 24.99,
    category: 'Fashion',
    sellerId: '2',
    sellerName: 'GreenFashion',
    carbonFootprint: 1.8,
    ecoRating: 9.5,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    status: 'active',
    createdAt: '2024-02-22',
  },
  {
    id: '4',
    name: 'Biodegradable Phone Case',
    description: 'Compostable phone case made from plant-based materials',
    price: 19.99,
    category: 'Electronics',
    sellerId: '2',
    sellerName: 'TechGreen',
    carbonFootprint: 1.2,
    ecoRating: 9.8,
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400',
    status: 'active',
    createdAt: '2024-02-25',
  },
  {
    id: '5',
    name: 'Reusable Beeswax Food Wraps',
    description: 'Natural beeswax wraps to replace plastic food storage',
    price: 16.99,
    category: 'Home & Garden',
    sellerId: '2',
    sellerName: 'ZeroWaste',
    carbonFootprint: 0.8,
    ecoRating: 9.6,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    status: 'active',
    createdAt: '2024-02-28',
  },
  {
    id: '6',
    name: 'LED Smart Bulb',
    description: 'Energy-efficient smart LED bulb with 90% less energy consumption',
    price: 34.99,
    category: 'Electronics',
    sellerId: '2',
    sellerName: 'SmartHome',
    carbonFootprint: 3.1,
    ecoRating: 8.9,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
    status: 'active',
    createdAt: '2024-03-01',
  },
  {
    id: '7',
    name: 'Bamboo Toothbrush Set',
    description: 'Set of 4 biodegradable bamboo toothbrushes',
    price: 12.99,
    category: 'Personal Care',
    sellerId: '2',
    sellerName: 'NaturalCare',
    carbonFootprint: 0.5,
    ecoRating: 9.7,
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400',
    status: 'active',
    createdAt: '2024-03-03',
  },
  {
    id: '8',
    name: 'Recycled Plastic Backpack',
    description: 'Durable backpack made from 100% recycled ocean plastic',
    price: 79.99,
    category: 'Fashion',
    sellerId: '2',
    sellerName: 'OceanSaver',
    carbonFootprint: 5.2,
    ecoRating: 8.4,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    status: 'active',
    createdAt: '2024-03-05',
  },
  {
    id: '9',
    name: 'Compostable Coffee Cups',
    description: 'Pack of 50 compostable coffee cups made from cornstarch',
    price: 22.99,
    category: 'Food & Beverage',
    sellerId: '2',
    sellerName: 'GreenCafe',
    carbonFootprint: 1.5,
    ecoRating: 9.3,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
    status: 'active',
    createdAt: '2024-03-07',
  },
  {
    id: '10',
    name: 'Solar Garden Lights',
    description: 'Set of 6 solar-powered LED garden lights with motion sensors',
    price: 45.99,
    category: 'Home & Garden',
    sellerId: '2',
    sellerName: 'SolarGarden',
    carbonFootprint: 2.8,
    ecoRating: 8.8,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
    status: 'active',
    createdAt: '2024-03-10',
  },
  {
    id: '11',
    name: 'Organic Shampoo Bar',
    description: 'Zero-waste shampoo bar with natural ingredients',
    price: 14.99,
    category: 'Personal Care',
    sellerId: '2',
    sellerName: 'PureNature',
    carbonFootprint: 0.7,
    ecoRating: 9.4,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    status: 'active',
    createdAt: '2024-03-12',
  },
  {
    id: '12',
    name: 'Hemp Sneakers',
    description: 'Sustainable sneakers made from hemp and recycled rubber',
    price: 89.99,
    category: 'Fashion',
    sellerId: '2',
    sellerName: 'EcoFootwear',
    carbonFootprint: 4.5,
    ecoRating: 8.6,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    status: 'active',
    createdAt: '2024-03-15',
  }
];

class AuthService {
  private currentUser: User | null = null;

  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
        if (user && password === 'password123') {
          this.currentUser = user;
          localStorage.setItem('currentUser', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  signup(username: string, email: string, password: string, role: 'seller' | 'buyer'): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
          reject(new Error('Email already exists'));
          return;
        }

        const newUser: User = {
          id: Date.now().toString(),
          username,
          email,
          role,
          status: role === 'seller' ? 'pending' : 'active',
          createdAt: new Date().toISOString(),
        };

        mockUsers.push(newUser);
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        resolve(newUser);
      }, 1000);
    });
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}

export const authService = new AuthService();