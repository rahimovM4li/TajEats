import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Store,
    Package,
    TrendingUp,
    DollarSign,
    Plus,
    Edit,
    Trash2,
    Bell,
    Settings,
    LogOut,
    Search,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AddRestaurantDialog from '@/components/AddRestaurantDialog';
import EditRestaurantDialog from '@/components/EditRestaurantDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import OrderDetailsDialog from '@/components/OrderDetailsDialog';
import type { UserDTO } from '@/types/api';
import { getPendingUsers, approveUser, rejectUser } from '@/services/userService';

const AdminDashboard: React.FC = () => {
    const { restaurants, orders, deleteRestaurant } = useData();
    const { logout } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [pendingUsers, setPendingUsers] = useState<UserDTO[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    useEffect(() => {
        if (activeTab === 'approvals') {
            fetchPendingUsers();
        }
    }, [activeTab]);

    const fetchPendingUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const users = await getPendingUsers();
            setPendingUsers(users);
        } catch (error) {
            toast({
                title: "Failed to fetch pending users",
                description: "Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleApprove = async (userId: number) => {
        try {
            await approveUser(userId);
            toast({
                title: "User approved",
                description: "Restaurant owner can now access the dashboard.",
            });
            fetchPendingUsers();
        } catch (error) {
            toast({
                title: "Failed to approve user",
                description: "Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleReject = async (userId: number) => {
        try {
            await rejectUser(userId);
            toast({
                title: "User rejected",
                description: "Registration request has been declined.",
            });
            fetchPendingUsers();
        } catch (error) {
            toast({
                title: "Failed to reject user",
                description: "Please try again.",
                variant: "destructive",
            });
        }
    };

    // Calculate current and previous month data
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Current month orders
    const currentMonthOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= currentMonthStart;
    });

    // Previous month orders
    const previousMonthOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= previousMonthStart && orderDate <= previousMonthEnd;
    });

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const activeRestaurants = restaurants.filter(r => r.isOpen).length;
    
    const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const previousMonthRevenue = previousMonthOrders.reduce((sum, order) => sum + order.total, 0);
    
    const currentMonthCustomers = new Set(currentMonthOrders.map(o => o.customerPhone)).size;
    const previousMonthCustomers = new Set(previousMonthOrders.map(o => o.customerPhone)).size;

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

    const ordersChange = calculateChange(currentMonthOrders.length, previousMonthOrders.length);
    const revenueChange = calculateChange(currentMonthRevenue, previousMonthRevenue);
    const customersChange = calculateChange(currentMonthCustomers, previousMonthCustomers);

    // Note: Restaurant count change is absolute since we don't have historical data
    const restaurantChange = { change: `${activeRestaurants} active`, trend: "neutral" as const };

    const stats = [
        {
            title: "Total Orders",
            value: orders.length.toLocaleString(),
            icon: Package,
            change: ordersChange.change,
            trend: ordersChange.trend
        },
        {
            title: "Total Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            change: revenueChange.change,
            trend: revenueChange.trend
        },
        {
            title: "Active Restaurants",
            value: activeRestaurants,
            icon: Store,
            change: restaurantChange.change,
            trend: restaurantChange.trend
        },
        {
            title: "Active Customers",
            value: new Set(orders.map(o => o.customerPhone)).size.toString(),
            icon: Users,
            change: customersChange.change,
            trend: customersChange.trend
        }
    ];

    // Calculate chart data from real orders
    const getChartData = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - (6 - i));
            return d;
        });

        return last7Days.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const dayOrders = orders.filter(o => o.createdAt.startsWith(dateStr));

            return {
                name: days[date.getDay()],
                orders: dayOrders.length,
                revenue: dayOrders.reduce((sum, o) => sum + o.total, 0)
            };
        });
    };

    const chartData = getChartData();

    const handleLogout = () => {
        logout();
        window.location.href = '/admin';
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
                            <h1 className="hidden md:block text-lg font-semibold">Admin Dashboard</h1>
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
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid grid-cols-5 w-full max-w-2xl">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="approvals">
                            Pending Approvals
                            {pendingUsers.length > 0 && (
                                <Badge variant="destructive" className="ml-2">
                                    {pendingUsers.length}
                                </Badge>
                            )}
                        </TabsTrigger>
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
                                                        {stat.change} {stat.trend !== 'neutral' ? 'from last month' : ''}
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

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="glass border-border/20">
                                <CardHeader>
                                    <CardTitle>Daily Orders</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {chartData.map((day) => (
                                            <div key={day.name} className="flex justify-between items-center">
                                                <span className="text-sm font-medium">{day.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                                        {/* Scaling: Max orders approx 20 for now, or use max from data */}
                                                        <div
                                                            className="h-full bg-gradient-primary transition-all"
                                                            style={{ width: `${Math.min((day.orders / 20) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold w-8">{day.orders}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="glass border-border/20">
                                <CardHeader>
                                    <CardTitle>Daily Revenue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {chartData.map((day) => (
                                            <div key={day.name} className="flex justify-between items-center">
                                                <span className="text-sm font-medium">{day.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                                        {/* Scaling: Max revenue approx 500 for now */}
                                                        <div
                                                            className="h-full bg-gradient-accent transition-all"
                                                            style={{ width: `${Math.min((day.revenue / 500) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold w-16">${day.revenue.toFixed(0)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <Card className="glass border-border/20">
                            <CardHeader>
                                <CardTitle>Recent Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {orders.slice(0, 5).map((order) => (
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
                                                <p className="text-sm text-muted-foreground">
                                                    {order.restaurantName} • {order.customerName} • ${order.total}
                                                </p>
                                                <OrderDetailsDialog order={order} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="restaurants" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Restaurant Management</h2>
                            <AddRestaurantDialog
                                trigger={
                                    <Button className="btn-hero">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Restaurant
                                    </Button>
                                }
                            />
                        </div>

                        {/* Search and Filters */}
                        <Card className="glass border-border/20 p-4">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input placeholder="Search restaurants..." className="pl-10" />
                                </div>
                                <Select>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="traditional">Traditional</SelectItem>
                                        <SelectItem value="fast-food">Fast Food</SelectItem>
                                        <SelectItem value="fine-dining">Fine Dining</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </Card>

                        {/* Restaurant List */}
                        <div className="space-y-4">
                            {restaurants.map((restaurant) => (
                                <Card key={restaurant.id} className="glass border-border/20">
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <img
                                                src={restaurant.image}
                                                alt={restaurant.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />

                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-lg">{restaurant.name}</h3>
                                                        <p className="text-sm text-muted-foreground">{restaurant.category}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={restaurant.isOpen ? 'default' : 'destructive'}>
                                                            {restaurant.isOpen ? 'Open' : 'Closed'}
                                                        </Badge>
                                                        <div className="flex gap-1">
                                                            <EditRestaurantDialog
                                                                restaurant={restaurant}
                                                                trigger={
                                                                    <Button size="icon" variant="outline" className="w-8 h-8">
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                }
                                                            />
                                                            <DeleteConfirmDialog
                                                                title="Delete Restaurant"
                                                                description={`Are you sure you want to delete ${restaurant.name}? This action cannot be undone.`}
                                                                onConfirm={async () => {
                                                                    await deleteRestaurant(restaurant.id);
                                                                }}
                                                                trigger={
                                                                    <Button size="icon" variant="outline" className="w-8 h-8 text-destructive">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <TrendingUp className="w-4 h-4" />
                                                        {restaurant.rating} rating
                                                    </span>
                                                    <span>{restaurant.reviewCount} reviews</span>
                                                    <span>{restaurant.deliveryTime}</span>
                                                    <span>${restaurant.deliveryFee} delivery</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
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
                            {orders.map((order) => (
                                <Card key={order.id} className="glass border-border/20">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg">Order #{order.id}</h3>
                                                <p className="text-muted-foreground">{order.restaurantName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Customer: {order.customerName} • {order.customerPhone}
                                                </p>
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
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <OrderDetailsDialog order={order} />
                                            <Button size="sm" variant="outline">Contact Customer</Button>
                                            <Button size="sm" variant="outline">Track Order</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">User Management</h2>
                            <Button className="btn-hero">
                                <Plus className="w-4 h-4 mr-2" />
                                Add User
                            </Button>
                        </div>

                        <Card className="glass border-border/20">
                            <CardContent className="p-6">
                                <div className="text-center py-12">
                                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">User Management</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Customer and restaurant partner management features will be implemented here.
                                    </p>
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">• Customer account management</p>
                                        <p className="text-sm text-muted-foreground">• Restaurant partner verification</p>
                                        <p className="text-sm text-muted-foreground">• Role and permission management</p>
                                        <p className="text-sm text-muted-foreground">• Support ticket management</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="approvals" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Pending Approvals</h2>
                            <Badge variant="outline" className="text-lg px-4 py-1">
                                {pendingUsers.length} Pending
                            </Badge>
                        </div>

                        <Card className="glass border-border/20">
                            <CardContent className="p-6">
                                {isLoadingUsers ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                        <p className="text-muted-foreground mt-4">Loading pending approvals...</p>
                                    </div>
                                ) : pendingUsers.length === 0 ? (
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                                        <p className="text-muted-foreground">
                                            No pending restaurant registrations at the moment.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingUsers.map((user) => (
                                            <Card key={user.id} className="border-border/20">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="text-lg font-semibold">{user.name}</h3>
                                                                <Badge variant="outline" className="text-xs">
                                                                    Restaurant Owner
                                                                </Badge>
                                                            </div>
                                                            <p className="text-muted-foreground text-sm mb-1">
                                                                {user.email}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Registered: {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                className="bg-accent hover:bg-accent/90"
                                                                onClick={() => handleApprove(user.id)}
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleReject(user.id)}
                                                            >
                                                                <XCircle className="w-4 h-4 mr-1" />
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AdminDashboard;