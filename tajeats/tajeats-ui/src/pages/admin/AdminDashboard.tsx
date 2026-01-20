import React, { useState } from 'react';
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
    Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import AddRestaurantDialog from '@/components/AddRestaurantDialog';
import EditRestaurantDialog from '@/components/EditRestaurantDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import OrderDetailsDialog from '@/components/OrderDetailsDialog';

const AdminDashboard: React.FC = () => {
    const { restaurants, orders, deleteRestaurant } = useData();
    const [activeTab, setActiveTab] = useState('overview');

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const activeRestaurants = restaurants.filter(r => r.isOpen).length;

    const stats = [
        {
            title: "Total Orders",
            value: orders.length.toLocaleString(),
            icon: Package,
            change: "+12%",
            trend: "up"
        },
        {
            title: "Total Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            change: "+8%",
            trend: "up"
        },
        {
            title: "Active Restaurants",
            value: activeRestaurants,
            icon: Store,
            change: "+3",
            trend: "up"
        },
        {
            title: "Active Customers",
            value: "0",
            icon: Users,
            change: "+15%",
            trend: "up"
        }
    ];

    // Mock chart data - TODO: Replace with real analytics
    const mockChartData = [
        { name: 'Mon', orders: 45, revenue: 850 },
        { name: 'Tue', orders: 52, revenue: 920 },
        { name: 'Wed', orders: 48, revenue: 880 },
        { name: 'Thu', orders: 61, revenue: 1050 },
        { name: 'Fri', orders: 73, revenue: 1200 },
        { name: 'Sat', orders: 89, revenue: 1450 },
        { name: 'Sun', orders: 67, revenue: 1100 },
    ];

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
                            <Link to="/admin">
                                <Button variant="ghost" size="icon">
                                    <LogOut className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid grid-cols-4 w-full max-w-md">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
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
                                                    <p className={`text-sm mt-1 ${stat.trend === 'up' ? 'text-accent' : 'text-destructive'}`}>
                                                        {stat.change} from last month
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
                                        {mockChartData.map((day) => (
                                            <div key={day.name} className="flex justify-between items-center">
                                                <span className="text-sm font-medium">{day.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-primary transition-all"
                                                            style={{ width: `${(day.orders / 100) * 100}%` }}
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
                                        {mockChartData.map((day) => (
                                            <div key={day.name} className="flex justify-between items-center">
                                                <span className="text-sm font-medium">{day.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-accent transition-all"
                                                            style={{ width: `${(day.revenue / 3000) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold w-16">${day.revenue}</span>
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
                </Tabs>
            </div>
        </div>
    );
};

export default AdminDashboard;