import apiClient from '@/lib/api';
import type { ReviewDTO } from '@/types/api';

export const reviewService = {
  /**
   * Get all reviews (optionally filtered by restaurant)
   */
  async getAll(restaurantId?: number): Promise<ReviewDTO[]> {
    const params = restaurantId ? { restaurantId } : {};
    const response = await apiClient.get<ReviewDTO[]>('/reviews', { params });
    return response.data;
  },

  /**
   * Get review by ID
   */
  async getById(id: number): Promise<ReviewDTO> {
    const response = await apiClient.get<ReviewDTO>(`/reviews/${id}`);
    return response.data;
  },

  /**
   * Get reviews by restaurant ID
   */
  async getByRestaurant(restaurantId: number): Promise<ReviewDTO[]> {
    const response = await apiClient.get<ReviewDTO[]>('/reviews', {
      params: { restaurantId },
    });
    return response.data;
  },

  /**
   * Create new review
   */
  async create(data: Omit<ReviewDTO, 'id'>): Promise<ReviewDTO> {
    const response = await apiClient.post<ReviewDTO>('/reviews', data);
    return response.data;
  },

  /**
   * Update existing review
   */
  async update(id: number, data: Partial<ReviewDTO>): Promise<ReviewDTO> {
    const response = await apiClient.put<ReviewDTO>(`/reviews/${id}`, data);
    return response.data;
  },

  /**
   * Delete review
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/reviews/${id}`);
  },
};
