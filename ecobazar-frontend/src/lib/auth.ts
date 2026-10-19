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

const API_BASE = 'http://localhost:8082';

class AuthService {
  private currentUser: User | null = null;

  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid credentials');
    }

    const data = await response.json();

    const user: User = {
      id: String(data.user.id),
      username: data.user.username,
      email: data.user.email,
      role: data.user.role ? data.user.role.toLowerCase() as any : 'buyer',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', data.token);

    return user;
  }

  async signup(username: string, email: string, password: string, role: 'seller' | 'buyer'): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role: role.toUpperCase() }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Signup failed');
    }

    const data = await response.json();

    const user: User = {
      id: String(data.user.id),
      username: data.user.username,
      email: data.user.email,
      role: data.user.role ? data.user.role.toLowerCase() as any : 'buyer',
      status: role === 'seller' ? 'pending' : 'active',
      createdAt: new Date().toISOString(),
    };

    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', data.token);

    return user;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role.toLowerCase();
  }
}

export const authService = new AuthService();