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
  minOrder?: number;
  description: string;
  isOpen: boolean;

  // Address
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;

  // Contact
  phone?: string;
  email?: string;
  website?: string;

  // Delivery mode: DELIVERY | PICKUP | BOTH
  deliveryMode?: string;

  // Opening hours per weekday (e.g. "09:00-22:00", null = closed)
  openingMonday?: string;
  openingTuesday?: string;
  openingWednesday?: string;
  openingThursday?: string;
  openingFriday?: string;
  openingSaturday?: string;
  openingSunday?: string;
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
  deliveryType?: string; // DELIVERY or PICKUP
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

// User & Auth Types
export interface UserDTO {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'RESTAURANT_OWNER' | 'CUSTOMER' | 'RIDER';
  restaurantId?: number;
  phone?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'RESTAURANT_OWNER' | 'CUSTOMER' | 'RIDER';
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
  message?: string;
}
