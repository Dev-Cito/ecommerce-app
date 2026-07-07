import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  variantId: string;
  productName: string;
  variantName: string;
  unitPriceCents: number;
  currency: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),
      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),
      setQuantity: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "cart-storage" },
  ),
);

export const cartTotalItems = (items: CartItem[]) => items.reduce((sum, i) => sum + i.quantity, 0);
export const cartTotalCents = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
