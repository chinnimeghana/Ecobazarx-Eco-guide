import { User } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const userService = {
  // Fetch all users
  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE_URL}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  // Update user status (active, blocked, pending)
  async updateUser(userId: string, data: { status?: string; role?: string }): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },
};
