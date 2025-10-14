export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED' | null;
  createdAt: string | null;
  updatedAt: string | null;
  enabled: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  authorities: { authority: string }[];
}
