import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct } from '@/lib/shopify';

// Get or create session-specific wishlist key
const getWishlistKey = (userId?: string): string => {
  if (userId) {
    return `miravo-wishlist-${userId}`;
  }
  // For guests, use session-based storage
  let guestId = sessionStorage.getItem('miravo-guest-id');
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('miravo-guest-id', guestId);
  }
  return `miravo-wishlist-${guestId}`;
};

interface WishlistItem {
  productId: string;
  productHandle: string;
  product: ShopifyProduct;
  addedAt: number;
}

interface WishlistStore {
  items: WishlistItem[];
  userId: string | null;
  
  addItem: (product: ShopifyProduct) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  setUserId: (userId: string | null) => void;
  syncFromGuest: () => void;
}

// Create a store factory to handle per-user storage
const createWishlistStore = () => {
  return create<WishlistStore>()(
    persist(
      (set, get) => ({
        items: [],
        userId: null,

        addItem: (product) => {
          const { items } = get();
          const productId = product.node.id;
          
          if (items.some(item => item.productId === productId)) {
            return; // Already in wishlist
          }
          
          set({
            items: [...items, {
              productId,
              productHandle: product.node.handle,
              product,
              addedAt: Date.now()
            }]
          });
        },

        removeItem: (productId) => {
          set({
            items: get().items.filter(item => item.productId !== productId)
          });
        },

        isInWishlist: (productId) => {
          return get().items.some(item => item.productId === productId);
        },

        clearWishlist: () => {
          set({ items: [] });
        },

        setUserId: (userId) => {
          const currentUserId = get().userId;
          
          if (userId && userId !== currentUserId) {
            // User logged in - load their wishlist from localStorage
            const userWishlistKey = getWishlistKey(userId);
            const savedWishlist = localStorage.getItem(userWishlistKey);
            
            if (savedWishlist) {
              try {
                const parsed = JSON.parse(savedWishlist);
                set({ 
                  userId, 
                  items: parsed.state?.items || [] 
                });
              } catch {
                set({ userId, items: [] });
              }
            } else {
              set({ userId });
            }
          } else if (!userId && currentUserId) {
            // User logged out - clear and reset to guest
            set({ userId: null, items: [] });
          } else {
            set({ userId });
          }
        },

        syncFromGuest: () => {
          const { userId, items } = get();
          if (!userId) return;
          
          // Get guest wishlist
          const guestId = sessionStorage.getItem('miravo-guest-id');
          if (!guestId) return;
          
          const guestKey = getWishlistKey();
          const guestWishlist = localStorage.getItem(guestKey);
          
          if (guestWishlist) {
            try {
              const parsed = JSON.parse(guestWishlist);
              const guestItems: WishlistItem[] = parsed.state?.items || [];
              
              // Merge guest items with user items (avoid duplicates)
              const mergedItems = [...items];
              guestItems.forEach(guestItem => {
                if (!mergedItems.some(item => item.productId === guestItem.productId)) {
                  mergedItems.push(guestItem);
                }
              });
              
              set({ items: mergedItems });
              
              // Clear guest wishlist after merge
              localStorage.removeItem(guestKey);
            } catch (e) {
              console.error('Failed to sync guest wishlist:', e);
            }
          }
        }
      }),
      {
        name: 'miravo-wishlist-default',
        storage: createJSONStorage(() => localStorage),
        // Custom storage name based on user
        onRehydrateStorage: () => (state) => {
          if (state?.userId) {
            const userKey = getWishlistKey(state.userId);
            const saved = localStorage.getItem(userKey);
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                state.items = parsed.state?.items || [];
              } catch {
                // Keep current items
              }
            }
          }
        }
      }
    )
  );
};

export const useWishlistStore = createWishlistStore();

// Helper to persist wishlist for current user
export const persistUserWishlist = () => {
  const state = useWishlistStore.getState();
  if (state.userId) {
    const userKey = getWishlistKey(state.userId);
    localStorage.setItem(userKey, JSON.stringify({
      state: { items: state.items }
    }));
  }
};
