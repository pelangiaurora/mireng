export interface User {
  userId: string;
  name?: string;
  email: string;
  role: 'customer' | 'seller' | 'admin';
}
