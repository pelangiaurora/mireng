export interface User {
  userId: string;
  name?: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
}
