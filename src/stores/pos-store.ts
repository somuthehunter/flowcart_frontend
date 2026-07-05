import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Product } from "@/services/api/product-ep";
import { config } from "@/lib/config";

export interface CartItem {
    product: Product;
    quantity: number;
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
    addToCart: (product: Product, quantity: number) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
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

            addToCart: (product, quantity) =>
                set(
                    (state) => {
                        const existing = state.cart[product.id];
                        return {
                            cart: {
                                ...state.cart,
                                [product.id]: {
                                    product,
                                    quantity: existing ? existing.quantity + quantity : quantity,
                                },
                            },
                        };
                    },
                    false,
                    `${STORE}/addToCart`
                ),

            updateQuantity: (productId, quantity) =>
                set(
                    (state) => {
                        const existing = state.cart[productId];
                        if (!existing) return state;
                        return {
                            cart: {
                                ...state.cart,
                                [productId]: { ...existing, quantity },
                            },
                        };
                    },
                    false,
                    `${STORE}/updateQuantity`
                ),

            removeFromCart: (productId) =>
                set(
                    (state) => {
                        const newCart = { ...state.cart };
                        delete newCart[productId];
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
