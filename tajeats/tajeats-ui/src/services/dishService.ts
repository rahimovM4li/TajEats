import apiClient from '@/lib/api';
import type { DishDTO } from '@/types/api';

export const dishService = {
  /**
   * Get all dishes (optionally filtered by restaurant)
   */
  async getAll(restaurantId?: number): Promise<DishDTO[]> {
    const params = restaurantId ? { restaurantId } : {};
    const response = await apiClient.get<DishDTO[]>('/dishes', { params });
    return response.data;
  },

  /**
   * Get dish by ID
   */
  async getById(id: number): Promise<DishDTO> {
    const response = await apiClient.get<DishDTO>(`/dishes/${id}`);
    return response.data;
  },

  /**
   * Get dishes by restaurant ID
   */
  async getByRestaurant(restaurantId: number): Promise<DishDTO[]> {
    const response = await apiClient.get<DishDTO[]>('/dishes', {
      params: { restaurantId },
    });
    return response.data;
  },

  /**
   * Create new dish
   */
  async create(data: Omit<DishDTO, 'id'>): Promise<DishDTO> {
    const response = await apiClient.post<DishDTO>('/dishes', data);
    return response.data;
  },

  /**
   * Update existing dish
   */
  async update(id: number, data: Partial<DishDTO>): Promise<DishDTO> {
    const response = await apiClient.put<DishDTO>(`/dishes/${id}`, data);
    return response.data;
  },

  /**
   * Delete dish
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/dishes/${id}`);
  },
};
