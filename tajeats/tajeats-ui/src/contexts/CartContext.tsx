import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Dish } from '@/lib/mockData';
import { cartService } from '@/services/cartService';
import type { CartItemResponseDTO } from '@/types/api';

interface CartContextType {
    items: CartItem[];
    isLoading: boolean;
    error: string | null;
    addToCart: (dish: Dish) => Promise<void>;
    removeFromCart: (dishId: string) => Promise<void>;
    updateQuantity: (dishId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

// Convert API response to CartItem
const convertCartItemFromAPI = (dto: CartItemResponseDTO): CartItem => ({
    dish: {
        id: dto.dish.id.toString(),
        restaurantId: dto.dish.restaurantId.toString(),
        name: dto.dish.name,
        description: dto.dish.description,
        price: dto.dish.price,
        image: dto.dish.image,
        category: dto.dish.category,
        isAvailable: dto.dish.isAvailable,
        isPopular: dto.dish.isPopular,
    },
    quantity: dto.quantity,
});

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load cart from backend on mount
    useEffect(() => {
        refreshCart();
    }, []);

    const refreshCart = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const cartItems = await cartService.getCart();
            setItems(cartItems.map(convertCartItemFromAPI));
        } catch (err: any) {
            setError(err.message || 'Failed to load cart');
            console.error('Error loading cart:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (dish: Dish) => {
        setError(null);
        try {
            // Optimistic update
            const existingItem = items.find(item => item.dish.id === dish.id);
            if (existingItem) {
                setItems(currentItems =>
                    currentItems.map(item =>
                        item.dish.id === dish.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                );
            } else {
                setItems(currentItems => [...currentItems, { dish, quantity: 1 }]);
            }

            // Sync with backend
            await cartService.addItem(Number(dish.id), 1);
        } catch (err: any) {
            setError(err.message || 'Failed to add to cart');
            // Revert on error
            await refreshCart();
            throw err;
        }
    };

    const removeFromCart = async (dishId: string) => {
        setError(null);
        try {
            // Find item to remove
            const item = items.find(i => i.dish.id === dishId);
            if (!item) return;

            // Optimistic update
            setItems(currentItems => currentItems.filter(item => item.dish.id !== dishId));

            // Sync with backend - need to find the actual cart item ID from backend
            const backendItems = await cartService.getCart();
            const backendItem = backendItems.find(i => i.dish.id.toString() === dishId);
            if (backendItem) {
                await cartService.removeItem(backendItem.id);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to remove from cart');
            // Revert on error
            await refreshCart();
            throw err;
        }
    };

    const updateQuantity = async (dishId: string, quantity: number) => {
        if (quantity <= 0) {
            await removeFromCart(dishId);
            return;
        }

        setError(null);
        try {
            // Optimistic update
            setItems(currentItems =>
                currentItems.map(item =>
                    item.dish.id === dishId ? { ...item, quantity } : item
                )
            );

            // Sync with backend
            const backendItems = await cartService.getCart();
            const backendItem = backendItems.find(i => i.dish.id.toString() === dishId);
            if (backendItem) {
                await cartService.updateItem(backendItem.id, quantity);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update quantity');
            // Revert on error
            await refreshCart();
            throw err;
        }
    };

    const clearCart = async () => {
        setError(null);
        try {
            // Optimistic update
            setItems([]);

            // Sync with backend
            await cartService.clearCart();
        } catch (err: any) {
            setError(err.message || 'Failed to clear cart');
            // Revert on error
            await refreshCart();
            throw err;
        }
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + (item.dish.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            items,
            isLoading,
            error,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalPrice,
            getTotalItems,
            refreshCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};