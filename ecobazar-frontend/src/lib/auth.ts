import { User } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class AuthService {
  private currentUser: User | null = null;

  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Invalid credentials');
    }

    const user: User = await res.json();
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }

  async signup(
    username: string,
    email: string,
    password: string,
    role: 'seller' | 'buyer'
  ): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Signup failed');
    }

    const newUser: User = await res.json();
    this.currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) this.currentUser = JSON.parse(stored);
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
