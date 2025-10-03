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