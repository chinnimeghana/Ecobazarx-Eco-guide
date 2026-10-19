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
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: 'ELECTRONICS' | 'CLOTHING' | 'FOOD' | 'HOME_GARDEN' | 'PERSONAL_CARE' | 'OTHER';
  carbonFootprint: number;
  ecoRating: number;
  imageUrl: string | null;
}