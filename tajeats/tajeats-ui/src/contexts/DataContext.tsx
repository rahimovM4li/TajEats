import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Restaurant, Dish, Order, Review } from '@/types/domain';
import type { RestaurantDTO, DishDTO, OrderDTO, ReviewDTO } from '@/types/api';
import { restaurantService } from '@/services/restaurantService';
import { dishService } from '@/services/dishService';
import { orderService } from '@/services/orderService';
import { reviewService } from '@/services/reviewService';

// Type converters (Backend uses number IDs, Frontend uses string)
const convertRestaurantFromAPI = (dto: RestaurantDTO): Restaurant => ({
    id: dto.id.toString(),
    name: dto.name,
    image: dto.image,
    logo: dto.logo,
    category: dto.category,
    rating: dto.rating,
    reviewCount: dto.reviewCount,
    deliveryTime: dto.deliveryTime,
    deliveryFee: dto.deliveryFee,
    minOrder: dto.minOrder,
    description: dto.description,
    isOpen: dto.isOpen,
    street: dto.street,
    houseNumber: dto.houseNumber,
    postalCode: dto.postalCode,
    city: dto.city,
    phone: dto.phone,
    email: dto.email,
    website: dto.website,
    deliveryMode: dto.deliveryMode as Restaurant['deliveryMode'],
    openingMonday: dto.openingMonday,
    openingTuesday: dto.openingTuesday,
    openingWednesday: dto.openingWednesday,
    openingThursday: dto.openingThursday,
    openingFriday: dto.openingFriday,
    openingSaturday: dto.openingSaturday,
    openingSunday: dto.openingSunday,
});

const convertDishFromAPI = (dto: DishDTO): Dish => ({
    id: dto.id.toString(),
    restaurantId: dto.restaurantId.toString(),
    name: dto.name,
    description: dto.description,
    price: dto.price,
    image: dto.image,
    category: dto.category,
    isAvailable: dto.isAvailable,
    isPopular: dto.isPopular,
});

const convertOrderFromAPI = (dto: OrderDTO): Order => ({
    id: dto.id?.toString() || '',
    restaurantId: dto.restaurantId.toString(),
    restaurantName: dto.restaurantName || '',
    customerName: dto.customerName,
    customerPhone: dto.customerPhone,
    customerAddress: dto.customerAddress,
    total: dto.total,
    status: (dto.status as Order['status']) || 'placed',
    createdAt: dto.createdAt || new Date().toISOString(),
    estimatedDelivery: dto.estimatedDelivery,
    items: [],
});

const convertReviewFromAPI = (dto: ReviewDTO): Review => ({
    id: dto.id?.toString() || '',
    restaurantId: dto.restaurantId.toString(),
    userName: dto.userName,
    userAvatar: dto.userAvatar,
    rating: dto.rating,
    comment: dto.comment,
    date: dto.date,
});

interface DataContextType {
    // Restaurants
    restaurants: Restaurant[];
    isLoadingRestaurants: boolean;
    restaurantsError: string | null;
    addRestaurant: (restaurant: Omit<Restaurant, 'id'>) => Promise<Restaurant>;
    updateRestaurant: (id: string, updates: Partial<Restaurant>) => Promise<void>;
    deleteRestaurant: (id: string) => Promise<void>;
    refreshRestaurants: () => Promise<void>;

    // Dishes
    dishes: Dish[];
    isLoadingDishes: boolean;
    dishesError: string | null;
    addDish: (dish: Omit<Dish, 'id'>) => Promise<Dish>;
    updateDish: (id: string, updates: Partial<Dish>) => Promise<void>;
    deleteDish: (id: string) => Promise<void>;
    getDishesByRestaurant: (restaurantId: string) => Dish[];
    refreshDishes: () => Promise<void>;

    // Orders
    orders: Order[];
    isLoadingOrders: boolean;
    ordersError: string | null;
    addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
    updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
    getOrdersByRestaurant: (restaurantId: string) => Order[];
    refreshOrders: () => Promise<void>;

    // Reviews
    reviews: Review[];
    isLoadingReviews: boolean;
    reviewsError: string | null;
    addReview: (review: Omit<Review, 'id'>) => Promise<Review>;
    updateReview: (id: string, updates: Partial<Review>) => Promise<void>;
    deleteReview: (id: string) => Promise<void>;
    getReviewsByRestaurant: (restaurantId: string) => Review[];
    refreshReviews: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

interface DataProviderProps {
    children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    // State
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
    const [restaurantsError, setRestaurantsError] = useState<string | null>(null);

    const [dishes, setDishes] = useState<Dish[]>([]);
    const [isLoadingDishes, setIsLoadingDishes] = useState(false);
    const [dishesError, setDishesError] = useState<string | null>(null);

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState<string | null>(null);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [reviewsError, setReviewsError] = useState<string | null>(null);

    // Fetch data on mount
    useEffect(() => {
        refreshRestaurants();
        refreshDishes();
        refreshOrders();
        refreshReviews();
    }, []);

    // Restaurant methods
    const refreshRestaurants = async () => {
        setIsLoadingRestaurants(true);
        setRestaurantsError(null);
        try {
            const data = await restaurantService.getAll();
            setRestaurants(data.map(convertRestaurantFromAPI));
        } catch (error: any) {
            setRestaurantsError(error.message || 'Failed to fetch restaurants');
            console.error('Error fetching restaurants:', error);
        } finally {
            setIsLoadingRestaurants(false);
        }
    };

    const addRestaurant = async (restaurantData: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
        try {
            const dto: Omit<RestaurantDTO, 'id'> = {
                name: restaurantData.name,
                image: restaurantData.image,
                logo: restaurantData.logo,
                category: restaurantData.category,
                rating: restaurantData.rating,
                reviewCount: restaurantData.reviewCount,
                deliveryTime: restaurantData.deliveryTime,
                deliveryFee: restaurantData.deliveryFee,
                minOrder: restaurantData.minOrder,
                description: restaurantData.description,
                isOpen: restaurantData.isOpen,
                street: restaurantData.street,
                houseNumber: restaurantData.houseNumber,
                postalCode: restaurantData.postalCode,
                city: restaurantData.city,
                phone: restaurantData.phone,
                email: restaurantData.email,
                website: restaurantData.website,
                deliveryMode: restaurantData.deliveryMode,
                openingMonday: restaurantData.openingMonday,
                openingTuesday: restaurantData.openingTuesday,
                openingWednesday: restaurantData.openingWednesday,
                openingThursday: restaurantData.openingThursday,
                openingFriday: restaurantData.openingFriday,
                openingSaturday: restaurantData.openingSaturday,
                openingSunday: restaurantData.openingSunday,
            };
            const created = await restaurantService.create(dto);
            const newRestaurant = convertRestaurantFromAPI(created);
            setRestaurants(prev => [...prev, newRestaurant]);
            return newRestaurant;
        } catch (error: any) {
            setRestaurantsError(error.message || 'Failed to add restaurant');
            throw error;
        }
    };

    const updateRestaurant = async (id: string, updates: Partial<Restaurant>) => {
        try {
            const dto: Partial<RestaurantDTO> = {
                ...updates,
                id: Number(id),
            };
            const updated = await restaurantService.update(Number(id), dto);
            setRestaurants(prev => prev.map(r => r.id === id ? convertRestaurantFromAPI(updated) : r));
        } catch (error: any) {
            setRestaurantsError(error.message || 'Failed to update restaurant');
            throw error;
        }
    };

    const deleteRestaurant = async (id: string) => {
        try {
            await restaurantService.delete(Number(id));
            setRestaurants(prev => prev.filter(r => r.id !== id));
            setDishes(prev => prev.filter(d => d.restaurantId !== id));
        } catch (error: any) {
            setRestaurantsError(error.message || 'Failed to delete restaurant');
            throw error;
        }
    };

    // Dish methods
    const refreshDishes = async () => {
        setIsLoadingDishes(true);
        setDishesError(null);
        try {
            const data = await dishService.getAll();
            setDishes(data.map(convertDishFromAPI));
        } catch (error: any) {
            setDishesError(error.message || 'Failed to fetch dishes');
            console.error('Error fetching dishes:', error);
        } finally {
            setIsLoadingDishes(false);
        }
    };

    const addDish = async (dishData: Omit<Dish, 'id'>): Promise<Dish> => {
        try {
            const dto: Omit<DishDTO, 'id'> = {
                restaurantId: Number(dishData.restaurantId),
                name: dishData.name,
                description: dishData.description,
                price: dishData.price,
                image: dishData.image,
                category: dishData.category,
                isAvailable: dishData.isAvailable,
                isPopular: dishData.isPopular,
            };
            const created = await dishService.create(dto);
            const newDish = convertDishFromAPI(created);
            setDishes(prev => [...prev, newDish]);
            return newDish;
        } catch (error: any) {
            setDishesError(error.message || 'Failed to add dish');
            throw error;
        }
    };

    const updateDish = async (id: string, updates: Partial<Dish>) => {
        try {
            const dto: Partial<DishDTO> = {
                ...updates,
                id: Number(id),
                restaurantId: updates.restaurantId ? Number(updates.restaurantId) : undefined,
            };
            const updated = await dishService.update(Number(id), dto);
            setDishes(prev => prev.map(d => d.id === id ? convertDishFromAPI(updated) : d));
        } catch (error: any) {
            setDishesError(error.message || 'Failed to update dish');
            throw error;
        }
    };

    const deleteDish = async (id: string) => {
        try {
            await dishService.delete(Number(id));
            setDishes(prev => prev.filter(d => d.id !== id));
        } catch (error: any) {
            setDishesError(error.message || 'Failed to delete dish');
            throw error;
        }
    };

    const getDishesByRestaurant = (restaurantId: string): Dish[] => {
        return dishes.filter(dish => dish.restaurantId === restaurantId);
    };

    // Order methods
    const refreshOrders = async () => {
        setIsLoadingOrders(true);
        setOrdersError(null);
        try {
            const data = await orderService.getAll();
            setOrders(data.map(convertOrderFromAPI));
        } catch (error: any) {
            setOrdersError(error.message || 'Failed to fetch orders');
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
        try {
            const dto: Omit<OrderDTO, 'id' | 'createdAt'> = {
                restaurantId: Number(orderData.restaurantId),
                restaurantName: orderData.restaurantName,
                customerName: orderData.customerName,
                customerPhone: orderData.customerPhone,
                customerAddress: orderData.customerAddress,
                total: orderData.total,
                status: orderData.status,
                estimatedDelivery: orderData.estimatedDelivery,
                items: orderData.items.map(item => ({
                    dishId: Number(item.dish.id),
                    quantity: item.quantity,
                })),
            };
            const created = await orderService.create(dto);
            const newOrder = convertOrderFromAPI(created);
            setOrders(prev => [...prev, newOrder]);
            return newOrder;
        } catch (error: any) {
            setOrdersError(error.message || 'Failed to add order');
            throw error;
        }
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        try {
            await orderService.updateStatus(Number(id), status);
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        } catch (error: any) {
            setOrdersError(error.message || 'Failed to update order status');
            throw error;
        }
    };

    const getOrdersByRestaurant = (restaurantId: string): Order[] => {
        return orders.filter(order => order.restaurantId === restaurantId);
    };

    // Review methods
    const refreshReviews = async () => {
        setIsLoadingReviews(true);
        setReviewsError(null);
        try {
            const data = await reviewService.getAll();
            setReviews(data.map(convertReviewFromAPI));
        } catch (error: any) {
            setReviewsError(error.message || 'Failed to fetch reviews');
            console.error('Error fetching reviews:', error);
        } finally {
            setIsLoadingReviews(false);
        }
    };

    const addReview = async (reviewData: Omit<Review, 'id'>): Promise<Review> => {
        try {
            const dto: Omit<ReviewDTO, 'id'> = {
                restaurantId: Number(reviewData.restaurantId),
                userName: reviewData.userName,
                userAvatar: reviewData.userAvatar,
                rating: reviewData.rating,
                comment: reviewData.comment,
                date: reviewData.date,
            };
            const created = await reviewService.create(dto);
            const newReview = convertReviewFromAPI(created);
            setReviews(prev => [...prev, newReview]);

            // Refresh restaurants to get updated rating
            await refreshRestaurants();

            return newReview;
        } catch (error: any) {
            setReviewsError(error.message || 'Failed to add review');
            throw error;
        }
    };

    const updateReview = async (id: string, updates: Partial<Review>) => {
        try {
            const dto: Partial<ReviewDTO> = {
                ...updates,
                id: Number(id),
                restaurantId: updates.restaurantId ? Number(updates.restaurantId) : undefined,
            };
            const updated = await reviewService.update(Number(id), dto);
            setReviews(prev => prev.map(r => r.id === id ? convertReviewFromAPI(updated) : r));

            // Refresh restaurants to get updated rating
            await refreshRestaurants();
        } catch (error: any) {
            setReviewsError(error.message || 'Failed to update review');
            throw error;
        }
    };

    const deleteReview = async (id: string) => {
        try {
            await reviewService.delete(Number(id));
            setReviews(prev => prev.filter(r => r.id !== id));

            // Refresh restaurants to get updated rating
            await refreshRestaurants();
        } catch (error: any) {
            setReviewsError(error.message || 'Failed to delete review');
            throw error;
        }
    };

    const getReviewsByRestaurant = (restaurantId: string): Review[] => {
        return reviews.filter(review => review.restaurantId === restaurantId);
    };

    return (
        <DataContext.Provider value={{
            restaurants,
            isLoadingRestaurants,
            restaurantsError,
            addRestaurant,
            updateRestaurant,
            deleteRestaurant,
            refreshRestaurants,

            dishes,
            isLoadingDishes,
            dishesError,
            addDish,
            updateDish,
            deleteDish,
            getDishesByRestaurant,
            refreshDishes,

            orders,
            isLoadingOrders,
            ordersError,
            addOrder,
            updateOrderStatus,
            getOrdersByRestaurant,
            refreshOrders,

            reviews,
            isLoadingReviews,
            reviewsError,
            addReview,
            updateReview,
            deleteReview,
            getReviewsByRestaurant,
            refreshReviews,
        }}>
            {children}
        </DataContext.Provider>
    );
};