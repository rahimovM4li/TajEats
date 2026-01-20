import apiClient from '@/lib/api';
import type { RestaurantDTO } from '@/types/api';

export const restaurantService = {
  /**
   * Get all restaurants
   */
  async getAll(): Promise<RestaurantDTO[]> {
    const response = await apiClient.get<RestaurantDTO[]>('/restaurants');
    return response.data;
  },

  /**
   * Get restaurant by ID
   */
  async getById(id: number): Promise<RestaurantDTO> {
    const response = await apiClient.get<RestaurantDTO>(`/restaurants/${id}`);
    return response.data;
  },

  /**
   * Create new restaurant
   */
  async create(data: Omit<RestaurantDTO, 'id'>): Promise<RestaurantDTO> {
    const response = await apiClient.post<RestaurantDTO>('/restaurants', data);
    return response.data;
  },

  /**
   * Update existing restaurant
   */
  async update(id: number, data: Partial<RestaurantDTO>): Promise<RestaurantDTO> {
    const response = await apiClient.put<RestaurantDTO>(`/restaurants/${id}`, data);
    return response.data;
  },

  /**
   * Delete restaurant
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/restaurants/${id}`);
  },
};
