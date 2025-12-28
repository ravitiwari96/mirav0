import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, createStorefrontCheckout } from '@/lib/shopify';

// Generate a unique session ID for guest users
const getSessionId = (): string => {
  const existingSessionId = sessionStorage.getItem('miravo-session-id');
  if (existingSessionId) {
    return existingSessionId;
  }
  const newSessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  sessionStorage.setItem('miravo-session-id', newSessionId);
  return newSessionId;
};

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  sessionId: string;
  
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  createCheckout: () => Promise<string | null>;
  setSessionId: (sessionId: string) => void;
  resetForNewSession: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      sessionId: getSessionId(),

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(item => item.variantId !== variantId)
        });
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },

      setCartId: (cartId) => set({ cartId }),
      setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
      setLoading: (isLoading) => set({ isLoading }),
      setSessionId: (sessionId) => set({ sessionId }),

      resetForNewSession: () => {
        const newSessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('miravo-session-id', newSessionId);
        set({ 
          items: [], 
          cartId: null, 
          checkoutUrl: null, 
          sessionId: newSessionId 
        });
      },

      createCheckout: async () => {
        const { items, setLoading, setCheckoutUrl } = get();
        if (items.length === 0) return null;

        setLoading(true);
        try {
          const checkoutUrl = await createStorefrontCheckout(items);
          setCheckoutUrl(checkoutUrl);
          return checkoutUrl;
        } catch (error) {
          console.error('Failed to create checkout:', error);
          throw error;
        } finally {
          setLoading(false);
        }
      }
    }),
    {
      name: 'miravo-cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist items and sessionId, regenerate others
      partialize: (state) => ({ 
        items: state.items,
        sessionId: state.sessionId
      }),
    }
  )
);

// Utility to check if cart belongs to current session
export const validateCartSession = () => {
  const store = useCartStore.getState();
  const currentSessionId = getSessionId();
  
  if (store.sessionId !== currentSessionId) {
    // Cart belongs to different session, clear it
    store.resetForNewSession();
  }
};
