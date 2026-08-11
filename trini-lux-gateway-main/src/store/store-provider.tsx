import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { toast } from "sonner";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { TOKEN_STORAGE_KEY } from "@/services/api/client";
import type { Address, CartItem, Product, User } from "@/types";

interface StoreValue {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;

  wishlist: string[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  wishlistItems: CartItem[];

  recentlyViewed: string[];
  pushRecentlyViewed: (slug: string) => void;

  user: User | null;
  signIn: (user: User, token: string) => void;
  signOut: () => void;

  addresses: Address[];
  saveAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  hydrated: boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

const toCartItem = (p: Product, quantity: number, variant?: string): CartItem => ({
  productId: p._id,
  slug: p.slug,
  title: p.name,
  image: p.images[0],
  price: p.price,
  mrp: p.mrp,
  quantity,
  variant,
  stock: p.stock,
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const cartStore = useLocalStorage<CartItem[]>("trini.cart", []);
  const wishStore = useLocalStorage<CartItem[]>("trini.wishlist", []);
  const recentStore = useLocalStorage<string[]>("trini.recent", []);
  const userStore = useLocalStorage<User | null>("trini.user", null);
  const addressStore = useLocalStorage<Address[]>("trini.addresses", []);

  const { setValue: setCart } = cartStore;
  const { setValue: setWish } = wishStore;
  const { setValue: setRecent } = recentStore;
  const { setValue: setUser } = userStore;
  const { setValue: setAddresses } = addressStore;

  const addToCart = useCallback(
    (product: Product, quantity = 1, variant?: string) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.productId === product._id && i.variant === variant);
        if (existing) {
          return prev.map((i) =>
            i === existing
              ? { ...i, quantity: Math.min(i.quantity + quantity, Math.max(1, product.stock)) }
              : i,
          );
        }
        return [...prev, toCartItem(product, quantity, variant)];
      });
      toast.success("Added to bag", { description: product.name });
    },
    [setCart],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) =>
      setCart((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i)),
      ),
    [setCart],
  );

  const removeFromCart = useCallback(
    (productId: string) => setCart((prev) => prev.filter((i) => i.productId !== productId)),
    [setCart],
  );

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWish((prev) => {
        const exists = prev.some((i) => i.productId === product._id);
        toast[exists ? "message" : "success"](exists ? "Removed from wishlist" : "Saved to wishlist", {
          description: product.name,
        });
        return exists
          ? prev.filter((i) => i.productId !== product._id)
          : [...prev, toCartItem(product, 1)];
      });
    },
    [setWish],
  );

  const pushRecentlyViewed = useCallback(
    (slug: string) => setRecent((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 8)),
    [setRecent],
  );

  const signIn = useCallback(
    (u: User, token: string) => {
      setUser(u);
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    },
    [setUser],
  );

  const signOut = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    toast.message("Signed out");
  }, [setUser]);

  const saveAddress = useCallback(
    (address: Address) =>
      setAddresses((prev) => {
        const next = prev.some((a) => a.id === address.id)
          ? prev.map((a) => (a.id === address.id ? address : a))
          : [...prev, address];
        return address.isDefault ? next.map((a) => ({ ...a, isDefault: a.id === address.id })) : next;
      }),
    [setAddresses],
  );

  const removeAddress = useCallback(
    (id: string) => setAddresses((prev) => prev.filter((a) => a.id !== id)),
    [setAddresses],
  );

  const setDefaultAddress = useCallback(
    (id: string) => setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id }))),
    [setAddresses],
  );

  const value = useMemo<StoreValue>(
    () => ({
      cart: cartStore.value,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount: cartStore.value.reduce((s, i) => s + i.quantity, 0),
      wishlist: wishStore.value.map((i) => i.productId),
      wishlistItems: wishStore.value,
      toggleWishlist,
      isWishlisted: (id: string) => wishStore.value.some((i) => i.productId === id),
      recentlyViewed: recentStore.value,
      pushRecentlyViewed,
      user: userStore.value,
      signIn,
      signOut,
      addresses: addressStore.value,
      saveAddress,
      removeAddress,
      setDefaultAddress,
      hydrated: cartStore.hydrated,
    }),
    [
      cartStore.value,
      cartStore.hydrated,
      wishStore.value,
      recentStore.value,
      userStore.value,
      addressStore.value,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      pushRecentlyViewed,
      signIn,
      signOut,
      saveAddress,
      removeAddress,
      setDefaultAddress,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
