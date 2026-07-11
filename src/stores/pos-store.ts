import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Product } from "@/services/api/product-ep";
import { config } from "@/lib/config";

export interface CartItem {
    id: string; // Composite ID: `${productId}-${brandId || 'default'}`
    product: Product;
    quantity: number;
    brand_id?: string;
}

export interface Customer {
    name: string;
    mobile: string;
}

interface PosState {
    isSessionActive: boolean;
    customer: Customer | null;
    cart: Record<string, CartItem>;
}

interface PosActions {
    startSession: (customer: Customer) => void;
    addToCart: (product: Product, quantity: number, brandId?: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    removeFromCart: (cartItemId: string) => void;
    clearSession: () => void;
}

const STORE = "posStore";

export const usePosStore = create<PosState & PosActions>()(
    devtools(
        (set) => ({
            isSessionActive: false,
            customer: null,
            cart: {},

            startSession: (customer) =>
                set({ isSessionActive: true, customer, cart: {} }, false, `${STORE}/startSession`),

            addToCart: (product, quantity, brandId) =>
                set(
                    (state) => {
                        const cartItemId = `${product.id}-${brandId || 'default'}`;
                        const existing = state.cart[cartItemId];
                        return {
                            cart: {
                                ...state.cart,
                                [cartItemId]: {
                                    id: cartItemId,
                                    product,
                                    quantity: existing ? existing.quantity + quantity : quantity,
                                    brand_id: brandId,
                                },
                            },
                        };
                    },
                    false,
                    `${STORE}/addToCart`
                ),

            updateQuantity: (cartItemId, quantity) =>
                set(
                    (state) => {
                        const existing = state.cart[cartItemId];
                        if (!existing) return state;
                        return {
                            cart: {
                                ...state.cart,
                                [cartItemId]: { ...existing, quantity },
                            },
                        };
                    },
                    false,
                    `${STORE}/updateQuantity`
                ),

            removeFromCart: (cartItemId) =>
                set(
                    (state) => {
                        const newCart = { ...state.cart };
                        delete newCart[cartItemId];
                        return { cart: newCart };
                    },
                    false,
                    `${STORE}/removeFromCart`
                ),

            clearSession: () =>
                set({ isSessionActive: false, customer: null, cart: {} }, false, `${STORE}/clearSession`),
        }),
        { name: STORE, enabled: config.env.MODE !== "production" }
    )
);
