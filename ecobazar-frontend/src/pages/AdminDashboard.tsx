import React, { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { authService } from '@/lib/auth';

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {currentUser.username}</h1>
      <p>Role: {currentUser.role}</p>
    </div>
  );
};

export default AdminDashboard;
