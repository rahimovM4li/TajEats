import apiClient from '@/lib/api';
import type { OrderDTO } from '@/types/api';

export const orderService = {
  /**
   * Get all orders
   */
  async getAll(): Promise<OrderDTO[]> {
    const response = await apiClient.get<OrderDTO[]>('/orders');
    return response.data;
  },

  /**
   * Get order by ID
   */
  async getById(id: number): Promise<OrderDTO> {
    const response = await apiClient.get<OrderDTO>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Create new order
   */
  async create(data: Omit<OrderDTO, 'id' | 'createdAt'>): Promise<OrderDTO> {
    const response = await apiClient.post<OrderDTO>('/orders', data);
    return response.data;
  },

  /**
   * Update order status
   */
  async updateStatus(id: number, status: string): Promise<OrderDTO> {
    const response = await apiClient.put<OrderDTO>(`/orders/${id}/status`, { status });
    return response.data;
  },

  /**
   * Get orders by restaurant
   */
  async getByRestaurant(restaurantId: number): Promise<OrderDTO[]> {
    const response = await apiClient.get<OrderDTO[]>(`/orders/restaurant/${restaurantId}`);
    return response.data;
  },

  /**
   * Get active orders by restaurant
   */
  async getActiveByRestaurant(restaurantId: number): Promise<OrderDTO[]> {
    const response = await apiClient.get<OrderDTO[]>(`/orders/restaurant/${restaurantId}/active`);
    return response.data;
  },

  /**
   * Get active delivery orders by restaurant (for riders)
   */
  async getDeliveryByRestaurant(restaurantId: number): Promise<OrderDTO[]> {
    const response = await apiClient.get<OrderDTO[]>(`/orders/restaurant/${restaurantId}/delivery`);
    return response.data;
  },

  /**
   * Update existing order
   */
  async update(id: number, data: Partial<OrderDTO>): Promise<OrderDTO> {
    const response = await apiClient.put<OrderDTO>(`/orders/${id}`, data);
    return response.data;
  },

  /**
   * Delete order
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/orders/${id}`);
  },
};
