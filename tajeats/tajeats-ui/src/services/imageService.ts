import apiClient from '@/lib/api';

export const imageService = {
    /**
     * Upload restaurant image
     */
    uploadRestaurantImage: async (restaurantId: number, file: File): Promise<{ imageUrl: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await apiClient.post(`/restaurants/${restaurantId}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    /**
     * Upload restaurant logo
     */
    uploadRestaurantLogo: async (restaurantId: number, file: File): Promise<{ logoUrl: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await apiClient.post(`/restaurants/${restaurantId}/logo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    /**
     * Upload dish image
     */
    uploadDishImage: async (dishId: number, file: File): Promise<{ imageUrl: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await apiClient.post(`/dishes/${dishId}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    /**
     * Validate image file before upload
     */
    validateImageFile: (file: File): { valid: boolean; error?: string } => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: 'Invalid file type. Allowed: JPEG, PNG, WebP',
            };
        }

        if (file.size > maxSize) {
            return {
                valid: false,
                error: 'File size exceeds 5MB limit',
            };
        }

        return { valid: true };
    },
};
