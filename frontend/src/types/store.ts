export type SellerType = 'physical' | 'digital';
export type StoreType = 'personal' | 'umkm' | 'official';
export type SellerTier = 'regular' | 'star' | 'star_plus' | 'top' | 'official';
export type VerifStatus = 'unverified' | 'pending' | 'approved' | 'rejected' | 'suspended' | 'banned';

export interface Store {
  id: string;
  sellerId: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  city?: string;
  province?: string;
  district?: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  holidayMode: boolean;
  holidayNote?: string;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  totalSales: number;
  totalReviews: number;
  // FASE 1
  sellerType: SellerType;
  storeType: StoreType;
  sellerTier: SellerTier;
  tierProgress: number;
  badgeVisible: boolean;
  verifStatus: VerifStatus;
  totalTransactions: number;
  avgRating: number;
  responseRate: number;
  complaintRate: number;
  activeSince?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TierInfo {
  currentTier: SellerTier;
  tierProgress: number;
  badgeVisible: boolean;
  nextTier: SellerTier | null;
  criteria: {
    minTransactions?: string;
    minRating?: string;
    minMonths?: string;
  } | null;
  metrics: {
    totalTransactions: number;
    avgRating: number;
    responseRate: number;
    complaintRate: number;
    activeSince: string;
  };
}

export interface StoreVerification {
  id: string;
  storeId: string;
  sellerType: SellerType;
  storeType: StoreType;
  documentKtp?: string;
  documentSelfie?: string;
  documentNib?: string;
  documentSiup?: string;
  documentAkta?: string;
  documentNpwp?: string;
  documentBrand?: string;
  notesFromSeller?: string;
  notesFromAdmin?: string;
  status: 'pending' | 'approved' | 'rejected' | 'need_revision';
  submittedAt: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface SellerApplication {
  id: string;
  userId: string;
  sellerTypeRequested: SellerType;
  reason: string;
  marketplaceLinks?: object;
  estimatedProducts?: number;
  estimatedRevenue?: number;
  experienceYears?: number;
  documentKtp: string;
  documentSupport?: string;
  status: 'pending' | 'approved' | 'rejected' | 'need_info';
  submittedAt: string;
  reviewedAt?: string;
  adminNotes?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface PlatformSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  dataType: 'string' | 'boolean' | 'number' | 'json';
  updatedAt: string;
}