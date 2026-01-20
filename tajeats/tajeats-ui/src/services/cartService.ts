import apiClient from '@/lib/api';
import { getOrCreateSessionId } from '@/lib/sessionManager';
import type { CartItemResponseDTO } from '@/types/api';

export const cartService = {
  /**
   * Get current session's cart
   */
  async getCart(): Promise<CartItemResponseDTO[]> {
    const sessionId = getOrCreateSessionId();
    const response = await apiClient.get<CartItemResponseDTO[]>(`/cart/session/${sessionId}`);
    return response.data;
  },

  /**
   * Add item to cart (or update quantity if exists)
   */
  async addItem(dishId: number, quantity: number): Promise<CartItemResponseDTO> {
    const sessionId = getOrCreateSessionId();
    const response = await apiClient.post<CartItemResponseDTO>(
      `/cart/session/${sessionId}`,
      { dishId, quantity }
    );
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  async updateItem(itemId: number, quantity: number): Promise<void> {
    await apiClient.put(`/cart/${itemId}`, { quantity });
  },

  /**
   * Remove specific item from cart
   */
  async removeItem(itemId: number): Promise<void> {
    const sessionId = getOrCreateSessionId();
    await apiClient.delete(`/cart/session/${sessionId}/item/${itemId}`);
  },

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    const sessionId = getOrCreateSessionId();
    await apiClient.delete(`/cart/session/${sessionId}`);
  },
};
