export interface Restaurant {
    id: string;
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

    // Delivery mode
    deliveryMode?: 'DELIVERY' | 'PICKUP' | 'BOTH';

    // Opening hours per weekday
    openingMonday?: string;
    openingTuesday?: string;
    openingWednesday?: string;
    openingThursday?: string;
    openingFriday?: string;
    openingSaturday?: string;
    openingSunday?: string;
}

export interface Dish {
    id: string;
    restaurantId: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isAvailable: boolean;
    isPopular?: boolean;
}

export interface Review {
    id: string;
    restaurantId: string;
    userName: string;
    userAvatar: string;
    rating: number;
    comment: string;
    date: string;
}

export interface CartItem {
    dish: Dish;
    quantity: number;
}

export interface Order {
    id: string;
    restaurantId: string;
    restaurantName: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    items: CartItem[];
    total: number;
    status: 'placed' | 'approved' | 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';
    deliveryType: 'DELIVERY' | 'PICKUP';
    createdAt: string;
    estimatedDelivery?: string;
}
