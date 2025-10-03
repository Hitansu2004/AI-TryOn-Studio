'use client';

import { createContext, useContext, useReducer, ReactNode, useState, useEffect } from 'react';
import { Heart, X, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

interface WishlistState {
  items: Product[];
  compareItems: Product[];
}

type WishlistAction = 
  | { type: 'ADD_TO_WISHLIST'; product: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; productId: string }
  | { type: 'ADD_TO_COMPARE'; product: Product }
  | { type: 'REMOVE_FROM_COMPARE'; productId: string }
  | { type: 'CLEAR_COMPARE' };

const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
} | null>(null);

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      if (state.items.find(item => item.id === action.product.id)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.product],
      };
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.productId),
      };
    
    case 'ADD_TO_COMPARE':
      if (state.compareItems.length >= 3) {
        return state; // Max 3 items for comparison
      }
      if (state.compareItems.find(item => item.id === action.product.id)) {
        return state;
      }
      return {
        ...state,
        compareItems: [...state.compareItems, action.product],
      };
    
    case 'REMOVE_FROM_COMPARE':
      return {
        ...state,
        compareItems: state.compareItems.filter(item => item.id !== action.productId),
      };
    
    case 'CLEAR_COMPARE':
      return {
        ...state,
        compareItems: [],
      };
    
    default:
      return state;
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    compareItems: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WishlistContext.Provider value={{ state, dispatch }}>
      <div suppressHydrationWarning={!mounted}>
        {children}
      </div>
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

interface HeartButtonProps {
  product: Product;
  className?: string;
}

export function HeartButton({ product, className = '' }: HeartButtonProps) {
  const { state, dispatch } = useWishlist();
  const isLiked = state.items.some(item => item.id === product.id);

  const handleToggle = () => {
    if (isLiked) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', productId: product.id });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', product });
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative p-2 rounded-full transition-colors hover:scale-105 active:scale-95 ${
        isLiked 
          ? 'bg-red-100 text-red-500 dark:bg-red-900/30' 
          : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500 dark:bg-gray-800/80 dark:text-gray-400'
      } ${className}`}
    >
      <Heart className={`h-5 w-5 transition-transform ${isLiked ? 'fill-current scale-110' : ''}`} />
    </button>
  );
}

interface CompareButtonProps {
  product: Product;
  className?: string;
}

export function CompareButton({ product, className = '' }: CompareButtonProps) {
  const { state, dispatch } = useWishlist();
  const isInCompare = state.compareItems.some(item => item.id === product.id);
  const canAdd = state.compareItems.length < 3;

  const handleToggle = () => {
    if (isInCompare) {
      dispatch({ type: 'REMOVE_FROM_COMPARE', productId: product.id });
    } else if (canAdd) {
      dispatch({ type: 'ADD_TO_COMPARE', product });
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={!canAdd && !isInCompare}
      className={`relative p-2 rounded-full transition-all hover:scale-105 active:scale-95 ${
        isInCompare 
          ? 'bg-blue-100 text-blue-500 dark:bg-blue-900/30' 
          : canAdd 
            ? 'bg-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-500 dark:bg-gray-800/80 dark:text-gray-400'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
      } ${className}`}
    >
      <Eye className="h-5 w-5" />
      
      {/* Compare indicator */}
      {state.compareItems.length > 0 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center transition-all">
          {state.compareItems.length}
        </div>
      )}
    </button>
  );
}

export function WishlistDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state, dispatch } = useWishlist();

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
      />
      
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto transform transition-transform">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Wishlist</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-opacity"
                >
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="font-semibold text-primary">${item.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_FROM_WISHLIST', productId: item.id })}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function CompareDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state, dispatch } = useWishlist();

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
      />
      
      <div className="fixed bottom-0 left-0 right-0 h-2/3 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto rounded-t-2xl transform transition-transform">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Compare Products ({state.compareItems.length}/3)</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch({ type: 'CLEAR_COMPARE' })}
                disabled={state.compareItems.length === 0}
              >
                Clear All
              </Button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {state.compareItems.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No products to compare</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {state.compareItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-opacity"
                >
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-4" />
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_FROM_COMPARE', productId: item.id })}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <h3 className="font-medium mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  <p className="font-semibold text-primary mb-4">${item.price}</p>
                  <Button size="sm" className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              ))}
              
              {/* Empty slots */}
              {[...Array(3 - state.compareItems.length)].map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 transition-opacity"
                >
                  <Eye className="h-8 w-8 mb-2" />
                  <p className="text-sm">Add product to compare</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
