export interface User {
  userId: string;
  id?: string;
  name?: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  role: "buyer" | "seller" | "admin";
  kycStatus?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface UserAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  district?: string;
  postalCode: string;
  isDefault: boolean;
}
