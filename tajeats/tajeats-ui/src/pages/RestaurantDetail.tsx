import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, Truck, MapPin, Phone, Heart, AlertCircle, Mail, Globe, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import DishCard from '@/components/DishCard';
import AddReviewDialog from '@/components/AddReviewDialog';
import { useData } from '@/contexts/DataContext';
import { getOpenStatusText } from '@/lib/restaurantUtils';
import type { Restaurant, Dish, Review } from '@/types/domain';

const RestaurantDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { restaurants, dishes, reviews, isLoadingRestaurants, isLoadingDishes, isLoadingReviews } = useData();
    const [isFavorite, setIsFavorite] = useState(false);

    const restaurant = restaurants.find(r => r.id === id);
    const restaurantDishes = dishes.filter(d => d.restaurantId === id);
    const restaurantReviews = reviews.filter(r => r.restaurantId === id);
    const openStatus = restaurant ? getOpenStatusText(restaurant) : { text: 'Unknown', isOpen: false };

    const isLoading = isLoadingRestaurants || isLoadingDishes || isLoadingReviews;

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Skeleton className="w-full h-80" />
                <div className="container mx-auto px-4 py-8">
                    <div className="space-y-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Restaurant not found</h1>
                    <p className="text-muted-foreground">The restaurant you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    const categories = [...new Set(restaurantDishes.map(dish => dish.category))];

    return (
        <div className="min-h-screen">
            {/* Restaurant Header */}
            <div className="relative h-80 overflow-hidden">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="container mx-auto">
                        <div className="flex justify-between items-end">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant={openStatus.isOpen ? "default" : "destructive"}>
                                        {openStatus.text}
                                    </Badge>
                                    <Badge variant="secondary">{restaurant.category}</Badge>
                                </div>

                                <h1 className="text-4xl font-bold">{restaurant.name}</h1>

                                <div className="flex items-center gap-4 text-white/90">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                        <span className="font-semibold">{restaurant.rating}</span>
                                        <span>({restaurant.reviewCount} reviews)</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Clock className="w-5 h-5" />
                                        <span>{restaurant.deliveryTime}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Truck className="w-5 h-5" />
                                        <span>${restaurant.deliveryFee} delivery</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                onClick={() => setIsFavorite(!isFavorite)}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Restaurant Info */}
                <Card className="glass border-border/20 mb-8">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* About + Contact */}
                            <div className="md:col-span-2">
                                <h2 className="text-2xl font-semibold mb-3">About</h2>
                                <p className="text-muted-foreground mb-4">{restaurant.description}</p>

                                <div className="space-y-2">
                                    {(restaurant.street || restaurant.city) && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                                            <span>
                                                {[restaurant.street, restaurant.houseNumber].filter(Boolean).join(' ')}
                                                {restaurant.postalCode || restaurant.city ? ', ' : ''}
                                                {[restaurant.postalCode, restaurant.city].filter(Boolean).join(' ')}
                                            </span>
                                        </div>
                                    )}
                                    {restaurant.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-primary shrink-0" />
                                            <span>{restaurant.phone}</span>
                                        </div>
                                    )}
                                    {restaurant.email && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-primary shrink-0" />
                                            <a href={`mailto:${restaurant.email}`} className="hover:underline">{restaurant.email}</a>
                                        </div>
                                    )}
                                    {restaurant.website && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Globe className="w-4 h-4 text-primary shrink-0" />
                                            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{restaurant.website}</a>
                                        </div>
                                    )}
                                </div>

                                {/* Delivery Mode Badges */}
                                {restaurant.deliveryMode && (
                                    <div className="flex items-center gap-2 mt-4">
                                        {(restaurant.deliveryMode === 'DELIVERY' || restaurant.deliveryMode === 'BOTH') && (
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                <Truck className="w-3 h-3" /> Delivery
                                            </Badge>
                                        )}
                                        {(restaurant.deliveryMode === 'PICKUP' || restaurant.deliveryMode === 'BOTH') && (
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                <ShoppingBag className="w-3 h-3" /> Pickup
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Delivery Info + Opening Hours */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Delivery Info</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery time:</span>
                                        <span className="font-semibold">{restaurant.deliveryTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery fee:</span>
                                        <span className="font-semibold">${restaurant.deliveryFee}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Minimum order:</span>
                                        <span className="font-semibold">${restaurant.minOrder ?? 0}</span>
                                    </div>
                                </div>

                                {/* Opening Hours */}
                                {(restaurant.openingMonday || restaurant.openingTuesday || restaurant.openingWednesday || restaurant.openingThursday || restaurant.openingFriday || restaurant.openingSaturday || restaurant.openingSunday) && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-3">Opening Hours</h3>
                                        <div className="space-y-1 text-sm">
                                            {[
                                                { day: 'Mon', hours: restaurant.openingMonday },
                                                { day: 'Tue', hours: restaurant.openingTuesday },
                                                { day: 'Wed', hours: restaurant.openingWednesday },
                                                { day: 'Thu', hours: restaurant.openingThursday },
                                                { day: 'Fri', hours: restaurant.openingFriday },
                                                { day: 'Sat', hours: restaurant.openingSaturday },
                                                { day: 'Sun', hours: restaurant.openingSunday },
                                            ].map(({ day, hours }) => (
                                                <div key={day} className="flex justify-between">
                                                    <span className="text-muted-foreground w-10">{day}</span>
                                                    <span className={hours ? 'font-medium' : 'text-muted-foreground'}>
                                                        {hours || 'Closed'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Menu and Reviews */}
                <Tabs defaultValue="menu" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="menu">Menu ({restaurantDishes.length})</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews ({restaurantReviews.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="menu" className="space-y-6">
                        {categories.map(category => {
                            const categoryDishes = restaurantDishes.filter(dish => dish.category === category);
                            return (
                                <div key={category}>
                                    <h2 className="text-2xl font-bold mb-4">{category}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {categoryDishes.map(dish => (
                                            <DishCard key={dish.id} dish={dish} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </TabsContent>

                    <TabsContent value="reviews" className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Customer Reviews</h3>
                            <AddReviewDialog
                                restaurantId={restaurant.id}
                                restaurantName={restaurant.name}
                                userName="Current User"
                                onSuccess={() => window.location.reload()}
                            />
                        </div>
                        {restaurantReviews.length === 0 ? (
                            <Card className="glass border-border/20">
                                <CardContent className="p-8 text-center">
                                    <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review!</p>
                                    <AddReviewDialog
                                        restaurantId={restaurant.id}
                                        restaurantName={restaurant.name}
                                        userName="Current User"
                                        onSuccess={() => window.location.reload()}
                                    />
                                </CardContent>
                            </Card>
                        ) : (
                            restaurantReviews.map(review => (
                                <Card key={review.id} className="glass border-border/20">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <Avatar>
                                                <AvatarImage src={review.userAvatar} />
                                                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-semibold">{review.userName}</h4>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(review.date).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <p className="text-muted-foreground">{review.comment}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )))
                        }
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default RestaurantDetail;