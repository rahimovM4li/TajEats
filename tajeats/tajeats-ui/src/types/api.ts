// Backend DTO Types - Exact mapping to Spring Boot DTOs

export interface RestaurantDTO {
  id: number;
  name: string;
  image: string;
  logo?: string;
  category: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  description: string;
  isOpen: boolean;
}

export interface DishDTO {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  isPopular?: boolean;
}

export interface OrderDTO {
  id?: number;
  restaurantId: number;
  restaurantName?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  total: number;
  status?: string;
  createdAt?: string;
  estimatedDelivery?: string;
  items: CartItemDTO[];
}

export interface CartItemDTO {
  id?: number;
  orderId?: number;
  dishId: number;
  quantity: number;
  sessionId?: string;
}

export interface CartItemResponseDTO {
  id: number;
  sessionId: string;
  dish: DishDTO;
  quantity: number;
}

export interface ReviewDTO {
  id?: number;
  restaurantId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

// API Error Response
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
