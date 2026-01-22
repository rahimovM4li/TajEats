import apiClient from '@/lib/api';
import type { LoginRequest, RegisterRequest, AuthResponse, UserDTO } from '@/types/api';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const request: LoginRequest = { email, password };
    const response = await apiClient.post<AuthResponse>('/auth/login', request);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<{ user: UserDTO; message?: string }> {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<UserDTO> {
    const response = await apiClient.get<UserDTO>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    // No backend call needed - just remove token locally
    return Promise.resolve();
  },
};
