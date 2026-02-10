import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Package,
    Star,
    TrendingUp,
    DollarSign,
    Plus,
    Edit,
    Bell,
    Settings,
    LogOut,
    Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import AddDishDialog from '@/components/AddDishDialog';
import EditDishDialog from '@/components/EditDishDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import OrderDetailsDialog from '@/components/OrderDetailsDialog';
import EditReviewDialog from '@/components/EditReviewDialog';
import apiClient from '@/lib/api';

const RestaurantDashboard: React.FC = () => {
    const { restaurants, dishes, orders, reviews, deleteDish, refreshReviews } = useData();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    // Check if user has a restaurant linked
    if (!user?.restaurantId) {
        // Redirect to restaurant setup if no restaurant is linked
        window.location.href = '/restaurant/setup';
        return null;
    }

    // Get restaurant ID from authenticated user
    const restaurantId = user.restaurantId;
    const restaurant = restaurants.find(r => r.id === restaurantId);
    
    const restaurantOrders = orders.filter(o => o.restaurantId === restaurantId);
    const restaurantDishes = dishes.filter(d => d.restaurantId === restaurantId);
    const restaurantReviews = reviews.filter(r => r.restaurantId === restaurantId);
    
    // Calculate today and yesterday data
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    // Filter orders by date
    const todayOrders = restaurantOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= todayStart;
    });

    const yesterdayOrders = restaurantOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= yesterdayStart && orderDate < yesterdayEnd;
    });

    // Calculate metrics
    const totalRevenue = restaurantOrders.reduce((sum, order) => sum + order.total, 0);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate average rating from reviews
    const averageRating = restaurantReviews.length > 0
        ? restaurantReviews.reduce((sum, review) => sum + review.rating, 0) / restaurantReviews.length
        : restaurant?.rating || 0;

    // Get previous rating (simplified: assume current restaurant.rating is from yesterday)
    const previousRating = restaurant?.rating || 0;
    const ratingChange = averageRating - previousRating;

    const restaurantData = {
        name: restaurant?.name || 'Restaurant',
        image: restaurant?.image || '',
        rating: averageRating,
        totalOrders: restaurantOrders.length,
        revenue: totalRevenue,
        todayOrders: todayOrders.length,
        todayRevenue: todayRevenue
    };

    // Calculate changes and trends
    const calculateChange = (current: number, previous: number): { change: string; trend: "up" | "down" | "neutral" } => {
        if (previous === 0) {
            return current > 0 ? { change: "+100%", trend: "up" } : { change: "0%", trend: "neutral" };
        }
        const percentChange = ((current - previous) / previous) * 100;
        const roundedChange = Math.round(percentChange);
        const sign = roundedChange > 0 ? "+" : "";
        return {
            change: `${sign}${roundedChange}%`,
            trend: roundedChange > 0 ? "up" : roundedChange < 0 ? "down" : "neutral"
        };
    };

    const todayOrdersChange = calculateChange(todayOrders.length, yesterdayOrders.length);
    const todayRevenueChange = calculateChange(todayRevenue, yesterdayRevenue);
    
    // Calculate total orders change (compare current week to previous week)
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const lastWeekOrders = restaurantOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= weekAgo && orderDate < todayStart;
    });
    const thisWeekOrders = restaurantOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= todayStart;
    });
    const totalOrdersChange = calculateChange(thisWeekOrders.length, lastWeekOrders.length);

    const stats = [
        {
            title: "Today's Orders",
            value: restaurantData.todayOrders,
            icon: Package,
            change: todayOrdersChange.change,
            trend: todayOrdersChange.trend
        },
        {
            title: "Today's Revenue",
            value: `$${restaurantData.todayRevenue.toFixed(2)}`,
            icon: DollarSign,
            change: todayRevenueChange.change,
            trend: todayRevenueChange.trend
        },
        {
            title: "Average Rating",
            value: averageRating.toFixed(1),
            icon: Star,
            change: ratingChange >= 0 ? `+${ratingChange.toFixed(1)}` : ratingChange.toFixed(1),
            trend: ratingChange > 0 ? "up" : ratingChange < 0 ? "down" : "neutral"
        },
        {
            title: "Total Orders",
            value: restaurantData.totalOrders,
            icon: TrendingUp,
            change: totalOrdersChange.change,
            trend: totalOrdersChange.trend
        }
    ];

    const handleLogout = () => {
        logout();
        window.location.href = '/restaurant';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-border/20 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">T</span>
                                </div>
                                <span className="text-xl font-bold gradient-text">TajEats</span>
                            </Link>
                            <div className="hidden md:block w-px h-6 bg-border" />
                            <h1 className="hidden md:block text-lg font-semibold">Restaurant Dashboard</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon">
                                <Bell className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Settings className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleLogout}>
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Restaurant Info */}
                <Card className="glass border-border/20 mb-8">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                            <img
                                src={restaurantData.image}
                                alt={restaurantData.name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2">{restaurantData.name}</h2>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span>{restaurantData.rating} rating</span>
                                    </div>
                                    <span>•</span>
                                    <span>{restaurantData.totalOrders} total orders</span>
                                    <span>•</span>
                                    <span>${restaurantData.revenue} total revenue</span>
                                </div>
                            </div>
                            <Badge className="bg-accent/90">Active</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid grid-cols-4 w-full max-w-md">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="menu">Menu</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <Card key={stat.title} className="glass border-border/20">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                                    <p className={`text-sm mt-1 ${
                                                        stat.trend === 'up' ? 'text-accent' : 
                                                        stat.trend === 'down' ? 'text-destructive' : 
                                                        'text-muted-foreground'
                                                    }`}>
                                                        {stat.change} {stat.trend !== 'neutral' ? (stat.title.includes('Total') ? 'this week' : 'from yesterday') : ''}
                                                    </p>
                                                </div>
                                                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Recent Orders */}
                        <Card className="glass border-border/20">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Recent Orders</CardTitle>
                                <Button variant="slice(0, 5).outline" size="sm">View All</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {todayOrders.map((order) => (
                                        <div key={order.id} className="flex justify-between items-center p-4 border border-border/20 rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold">Order #{order.id}</h4>
                                                    <Badge variant={
                                                        order.status === 'delivered' ? 'default' :
                                                            order.status === 'preparing' ? 'secondary' :
                                                                order.status === 'on-the-way' ? 'outline' : 'destructive'
                                                    }>
                                                        {order.status.replace('-', ' ')}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{order.customerName}</p>
                                                <p className="text-sm text-muted-foreground">{order.items.length} items • ${order.total}</p>
                                                <OrderDetailsDialog order={order} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="orders" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Orders Management</h2>
                            <div className="flex gap-2">
                                <Button variant="outline">Filter</Button>
                                <Button variant="outline">Export</Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {restaurantOrders.map((order) => (
                                <Card key={order.id} className="glass border-border/20">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg">Order #{order.id}</h3>
                                                <p className="text-muted-foreground">{order.customerName} • {order.customerPhone}</p>
                                                <p className="text-sm text-muted-foreground">{order.customerAddress}</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant={
                                                    order.status === 'delivered' ? 'default' :
                                                        order.status === 'preparing' ? 'secondary' :
                                                            order.status === 'on-the-way' ? 'outline' : 'destructive'
                                                }>
                                                    {order.status.replace('-', ' ')}
                                                </Badge>
                                                <p className="text-lg font-bold mt-2">${order.total}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center text-sm">
                                                    <span>{item.quantity}x {item.dish.name}</span>
                                                    <span>${(item.dish.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <OrderDetailsDialog order={order} />
                                            {order.status === 'placed' && (
                                                <Button size="sm" className="bg-gradient-primary">Accept Order</Button>
                                            )}
                                            {order.status === 'preparing' && (
                                                <Button size="sm" className="bg-gradient-accent">Mark Ready</Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="menu" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Menu Management</h2>
                            <AddDishDialog 
                                restaurantId={restaurantId}
                                trigger={
                                    <Button className="btn-hero">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add New Dish
                                    </Button>
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {restaurantDishes.map((dish) => (
                                <Card key={dish.id} className="glass border-border/20">
                                    <div className="relative">
                                        <img
                                            src={dish.image}
                                            alt={dish.name}
                                            className="w-full h-40 object-cover rounded-t-lg"
                                        />
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <EditDishDialog 
                                                dish={dish}
                                                trigger={
                                                    <Button size="icon" variant="secondary" className="w-8 h-8">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                }
                                            />
                                            <DeleteConfirmDialog
                                                title="Delete Dish"
                                                description={`Are you sure you want to delete ${dish.name}? This action cannot be undone.`}
                                                onConfirm={async () => {
                                                    await deleteDish(dish.id);
                                                }}
                                                trigger={
                                                    <Button size="icon" variant="secondary" className="w-8 h-8 text-destructive">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold">{dish.name}</h3>
                                                <Badge variant={dish.isAvailable ? 'default' : 'destructive'}>
                                                    {dish.isAvailable ? 'Available' : 'Out of Stock'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{dish.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-primary">${dish.price}</span>
                                                <span className="text-sm text-muted-foreground">{dish.category}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Customer Reviews</h2>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{restaurantData.rating}</div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {restaurantReviews.map((review) => (
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

                                                <div className="flex gap-2 mt-4">
                                                    <EditReviewDialog 
                                                        review={review}
                                                        onSuccess={refreshReviews}
                                                    />
                                                    <DeleteConfirmDialog
                                                        title="Delete Review"
                                                        description="Are you sure you want to delete this review? This action cannot be undone."
                                                        onConfirm={async () => {
                                                            await apiClient.delete(`/reviews/${review.id}`);
                                                            await refreshReviews();
                                                        }}
                                                        trigger={
                                                            <Button size="sm" variant="outline" className="text-destructive">
                                                                Delete
                                                            </Button>
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default RestaurantDashboard;