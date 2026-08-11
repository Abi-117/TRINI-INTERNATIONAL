export type ID = string;

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  status: boolean;
}

export interface ProductVariant {
  id: ID;
  label: string;
  value: string;
  priceDelta?: number;
  inStock: boolean;
}

export interface Review {
  id: ID;
  author: string;
  avatar?: string;
  rating: number;
  title?: string;
  body: string;
  createdAt: string;
  verified?: boolean;
}
export interface Product {
  _id: string;
  name: string;
  slug: string;

  brand: string;

  category: {
    _id: string;
    name: string;
    slug: string;
  };

  description: string;

  highlights: string[];
  specifications: Record<string, string>;

  price: number;
  mrp: number;
  stock: number;

  ageGroup: string;

  images?: string[];
    video?: string;
  videos?: string[];

  colors: string[];
  sizes: string[];

  tags: string[];

  featured: boolean;
  bestSeller: boolean;

  rating?: number;
  reviewCount?: number;
}

export type ProductTag =
  | "flash-sale"
  | "todays-deal"
  | "featured"
  | "best-seller"
  | "new-arrival"
  | "trending";

export interface CartItem {
  productId: ID;
  slug: string;
  title: string;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
  variant?: string;
  stock: number;
}

export interface Address {
  id: ID;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}



export interface Coupon {
  id?: string;
  _id?: string;

  code: string;

  description?: string;

  discountType: "percentage" | "fixed";

  discountValue: number;

  minOrderAmount: number;

  maxDiscountAmount?: number | null;

  startDate?: string;

  expiryDate?: string;

  isActive?: boolean;

  usageLimit?: number | null;

  usedCount?: number;
}



export interface OrderItem extends CartItem {}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: ID;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  address: Address;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "paid" | "pending" | "failed";
}

export interface User {
   _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
   createdAt?: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ProductQuery {
  search?: string;
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  ageGroups?: string[];
  inStockOnly?: boolean;
  tag?: ProductTag;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest"
  | "discount";
