/**
 * Single source of truth for every backend route the frontend calls.
 * Swap these paths to match your Express router and nothing else changes.
 */
export const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    logout: "/auth/logout",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    sendOtp: "/auth/otp/send",
    verifyOtp: "/auth/otp/verify",
  },
  products: {
    list: "/products",
    detail: (slug: string) => `/products/${slug}`,
    related: (slug: string) => `/products/${slug}/related`,
    search: "/products/search",
    suggestions: "/products/suggestions",
  },
  categories: {
    list: "/categories",
    detail: (slug: string) => `/categories/${slug}`,
  },
  collections: {
    list: "/collections",
    detail: (slug: string) => `/collections/${slug}`,
  },
  cart: {
    get: "/cart",
    sync: "/cart/sync",
  },
  wishlist: {
    get: "/wishlist",
    toggle: "/wishlist/toggle",
  },
  coupons: {
    list: "/coupons",
    validate: "/coupons/validate",
  },
  orders: {
    list: "/orders",
    detail: (id: string) => `/orders/${id}`,
    create: "/orders",
    cancel: (id: string) => `/orders/${id}/cancel`,
  },
  addresses: {
    list: "/addresses",
    create: "/addresses",
    update: (id: string) => `/addresses/${id}`,
    remove: (id: string) => `/addresses/${id}`,
  },
  reviews: {
    list: (slug: string) => `/products/${slug}/reviews`,
    create: (slug: string) => `/products/${slug}/reviews`,
  },
  notifications: {
    list: "/notifications",
    markRead: (id: string) => `/notifications/${id}/read`,
  },
  newsletter: {
    subscribe: "/newsletter/subscribe",
  },
  contact: {
    send: "/contact",
  },
  payments: {
    createOrder: "/payments/razorpay/order",
    verify: "/payments/razorpay/verify",
    status: (id: string) => `/payments/${id}/status`,
  },
  admin: {
    dashboard: "/admin/dashboard",
    analytics: "/admin/analytics",
    products: "/admin/products",
    product: (id: string) => `/admin/products/${id}`,
    categories: "/admin/categories",
    orders: "/admin/orders",
    order: (id: string) => `/admin/orders/${id}`,
    users: "/admin/users",
    coupons: "/admin/coupons",
    reviews: "/admin/reviews",
    banners: "/admin/banners",
    offers: "/admin/offers",
  },
} as const;
