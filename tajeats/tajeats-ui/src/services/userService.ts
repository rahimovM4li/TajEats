import apiClient from '@/lib/api';
import type { UserDTO } from '@/types/api';

export const getPendingUsers = async (): Promise<UserDTO[]> => {
  const response = await apiClient.get<UserDTO[]>('/users/pending');
  return response.data;
};

export const approveUser = async (userId: number): Promise<UserDTO> => {
  const response = await apiClient.put<UserDTO>(`/users/${userId}/approve`);
  return response.data;
};

export const rejectUser = async (userId: number): Promise<void> => {
  await apiClient.delete(`/users/${userId}/reject`);
};

export const getRidersByRestaurant = async (restaurantId: number): Promise<UserDTO[]> => {
  const response = await apiClient.get<UserDTO[]>(`/users/riders/restaurant/${restaurantId}`);
  return response.data;
};

export const linkUserToRestaurant = async (userId: number, restaurantId: number): Promise<UserDTO> => {
  const response = await apiClient.put<UserDTO>(`/users/${userId}/restaurant/${restaurantId}`);
  return response.data;
};
