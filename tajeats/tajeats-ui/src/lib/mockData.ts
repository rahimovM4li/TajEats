// Mock data for TajEats application
// TODO: Replace with actual API calls

import restaurant1 from "@/assets/restaurant-1.jpg";
import dishPalov from "@/assets/dish-palov.jpg";
import dishManti from "@/assets/dish-manti.jpg";

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
    description: string;
    isOpen: boolean;
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
    status: 'placed' | 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';
    createdAt: string;
    estimatedDelivery?: string;
}

// Mock Restaurants Data
export const mockRestaurants: Restaurant[] = [
    {
        id: '1',
        name: 'Tajik Traditional Kitchen',
        image: restaurant1,
        category: 'Traditional',
        rating: 4.8,
        reviewCount: 245,
        deliveryTime: '25-35 min',
        deliveryFee: 5,
        description: 'Authentic Tajik cuisine prepared with traditional recipes and fresh local ingredients.',
        isOpen: true,
    },
    {
        id: '2',
        name: 'Pamir Palace',
        image: restaurant1,
        category: 'Fine Dining',
        rating: 4.9,
        reviewCount: 189,
        deliveryTime: '35-45 min',
        deliveryFee: 8,
        description: 'Elegant dining experience with premium Tajik and Central Asian dishes.',
        isOpen: true,
    },
    {
        id: '3',
        name: 'Dushanbe Delights',
        image: restaurant1,
        category: 'Fast Food',
        rating: 4.5,
        reviewCount: 567,
        deliveryTime: '15-25 min',
        deliveryFee: 3,
        description: 'Quick and delicious Tajik fast food favorites.',
        isOpen: true,
    },
    {
        id: '4',
        name: 'Mountain View Restaurant',
        image: restaurant1,
        category: 'Traditional',
        rating: 4.7,
        reviewCount: 324,
        deliveryTime: '30-40 min',
        deliveryFee: 6,
        description: 'Traditional Tajik dishes with a modern twist and beautiful presentation.',
        isOpen: false,
    }
];

// Mock Dishes Data
export const mockDishes: Dish[] = [
    {
        id: '1',
        restaurantId: '1',
        name: 'Oshi Palov',
        description: 'Traditional Tajik rice pilaf with tender lamb, carrots, and aromatic spices',
        price: 25,
        image: dishPalov,
        category: 'Main Course',
        isAvailable: true,
        isPopular: true,
    },
    {
        id: '2',
        restaurantId: '1',
        name: 'Steamed Manti',
        description: 'Large steamed dumplings filled with seasoned lamb and onions',
        price: 18,
        image: dishManti,
        category: 'Main Course',
        isAvailable: true,
        isPopular: true,
    },
    {
        id: '3',
        restaurantId: '1',
        name: 'Qurutob',
        description: 'Traditional bread salad with yogurt balls, onions, and fresh vegetables',
        price: 15,
        image: dishPalov,
        category: 'Appetizer',
        isAvailable: true,
    },
    {
        id: '4',
        restaurantId: '1',
        name: 'Sambusa',
        description: 'Crispy pastries filled with spiced meat and vegetables',
        price: 12,
        image: dishManti,
        category: 'Appetizer',
        isAvailable: true,
    },
    {
        id: '5',
        restaurantId: '2',
        name: 'Royal Palov',
        description: 'Premium palov with select cuts of beef and saffron',
        price: 35,
        image: dishPalov,
        category: 'Main Course',
        isAvailable: true,
        isPopular: true,
    },
    {
        id: '6',
        restaurantId: '2',
        name: 'Kabab Platter',
        description: 'Mixed grilled meats with traditional sides and bread',
        price: 32,
        image: '/src/assets/dish-manti.jpg',
        category: 'Main Course',
        isAvailable: true,
    }
];

// Mock Reviews Data
export const mockReviews: Review[] = [
    {
        id: '1',
        restaurantId: '1',
        userName: 'Ahmad Rahimov',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        comment: 'Amazing traditional Tajik food! The palov was perfectly cooked and very authentic.',
        date: '2024-01-15',
    },
    {
        id: '2',
        restaurantId: '1',
        userName: 'Mavluda Nazarova',
        userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b6b0f93c?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        comment: 'Best manti in Dushanbe! Fast delivery and still hot when it arrived.',
        date: '2024-01-14',
    },
    {
        id: '3',
        restaurantId: '1',
        userName: 'Farid Karimov',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        rating: 4,
        comment: 'Good food quality and reasonable prices. Will order again.',
        date: '2024-01-13',
    }
];

// Mock Orders Data
export const mockOrders: Order[] = [
    {
        id: 'ORD-001',
        restaurantId: '1',
        restaurantName: 'Tajik Traditional Kitchen',
        customerName: 'Rustam Shoev',
        customerPhone: '+992 92 123 4567',
        customerAddress: 'Rudaki Avenue 45, Dushanbe',
        items: [
            { dish: mockDishes[0], quantity: 2 },
            { dish: mockDishes[1], quantity: 1 }
        ],
        total: 68,
        status: 'preparing',
        createdAt: '2024-01-15T14:30:00Z',
        estimatedDelivery: '2024-01-15T15:15:00Z'
    },
    {
        id: 'ORD-002',
        restaurantId: '2',
        restaurantName: 'Pamir Palace',
        customerName: 'Nigina Saidova',
        customerPhone: '+992 93 987 6543',
        customerAddress: 'Ismoil Somoni Avenue 22, Dushanbe',
        items: [
            { dish: mockDishes[4], quantity: 1 }
        ],
        total: 43,
        status: 'on-the-way',
        createdAt: '2024-01-15T13:45:00Z',
        estimatedDelivery: '2024-01-15T14:30:00Z'
    }
];

// Dashboard Statistics (Mock)
export const mockStats = {
    totalOrders: 1247,
    totalRevenue: 45600,
    activeRestaurants: 34,
    activeCustomers: 892,
    ordersToday: 87,
    revenueToday: 2340
};

// Chart Data (Mock)
export const mockChartData = [
    { name: 'Mon', orders: 45, revenue: 1200 },
    { name: 'Tue', orders: 52, revenue: 1400 },
    { name: 'Wed', orders: 38, revenue: 980 },
    { name: 'Thu', orders: 61, revenue: 1650 },
    { name: 'Fri', orders: 78, revenue: 2100 },
    { name: 'Sat', orders: 95, revenue: 2800 },
    { name: 'Sun', orders: 87, revenue: 2340 }
];