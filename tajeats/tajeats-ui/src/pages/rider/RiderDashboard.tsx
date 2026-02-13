import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Bike,
    Package,
    MapPin,
    Phone,
    User,
    LogOut,
    Truck,
    CheckCircle,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { orderService } from '@/services/orderService';
import type { OrderDTO } from '@/types/api';

const RiderDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('open');
    const [orders, setOrders] = useState<OrderDTO[]>([]);
    const [allOrders, setAllOrders] = useState<OrderDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Check if rider has a restaurant linked
    if (!user?.restaurantId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="glass border-border/20 max-w-md">
                    <CardContent className="p-8 text-center">
                        <Bike className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Kein Restaurant zugewiesen</h3>
                        <p className="text-muted-foreground">
                            Ihr Konto ist noch keinem Restaurant zugeordnet. Bitte kontaktieren Sie den Administrator.
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => { logout(); window.location.href = '/rider/login'; }}>
                            Abmelden
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const restaurantId = Number(user.restaurantId);

    // Fetch delivery orders for this restaurant
    const fetchOrders = async () => {
        try {
            const deliveryOrders = await orderService.getDeliveryByRestaurant(restaurantId);
            setOrders(deliveryOrders);

            const all = await orderService.getByRestaurant(restaurantId);
            setAllOrders(all.filter(o => o.deliveryType === 'DELIVERY'));
        } catch (err) {
            console.error('Fehler beim Laden der Bestellungen:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [restaurantId]);

    const handleUpdateStatus = async (orderId: number, status: string) => {
        try {
            await orderService.updateStatus(orderId, status);
            await fetchOrders();
            toast({
                title: 'Status aktualisiert',
                description: `Bestellung #${orderId} ist jetzt "${status === 'on-the-way' ? 'Unterwegs' : 'Geliefert'}".`,
            });
        } catch (error) {
            toast({
                title: 'Fehler',
                description: 'Status konnte nicht aktualisiert werden.',
                variant: 'destructive',
            });
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/rider/login';
    };

    const openOrders = orders.filter(o => o.status === 'approved');
    const activeOrders = orders.filter(o => o.status === 'on-the-way');
    const completedOrders = allOrders.filter(o => o.status === 'delivered');

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
                            <h1 className="hidden md:block text-lg font-semibold">
                                <Bike className="w-5 h-5 inline mr-2" />
                                Fahrer-Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-muted-foreground hidden md:block">{user.name}</span>
                            <Button variant="ghost" size="icon" onClick={handleLogout}>
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="glass border-border/20">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-muted-foreground">Offene Bestellungen</p>
                                    <p className="text-2xl font-bold mt-1">{openOrders.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass border-border/20">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-muted-foreground">Aktive Lieferungen</p>
                                    <p className="text-2xl font-bold mt-1">{activeOrders.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <Truck className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass border-border/20">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-muted-foreground">Heute geliefert</p>
                                    <p className="text-2xl font-bold mt-1">{completedOrders.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid grid-cols-3 w-full max-w-md">
                        <TabsTrigger value="open">
                            Offen ({openOrders.length})
                        </TabsTrigger>
                        <TabsTrigger value="active">
                            Unterwegs ({activeOrders.length})
                        </TabsTrigger>
                        <TabsTrigger value="completed">
                            Abgeschlossen
                        </TabsTrigger>
                    </TabsList>

                    {/* Open Orders - Ready for pickup by rider */}
                    <TabsContent value="open" className="space-y-4">
                        {isLoading ? (
                            <p className="text-center text-muted-foreground py-8">Laden...</p>
                        ) : openOrders.length === 0 ? (
                            <Card className="glass border-border/20">
                                <CardContent className="p-8 text-center">
                                    <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold mb-2">Keine offenen Bestellungen</h3>
                                    <p className="text-muted-foreground">Es gibt derzeit keine Bestellungen zur Abholung.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            openOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    actions={
                                        <Button
                                            className="bg-gradient-primary"
                                            onClick={() => handleUpdateStatus(order.id!, 'on-the-way')}
                                        >
                                            <Truck className="w-4 h-4 mr-2" />
                                            Lieferung starten
                                        </Button>
                                    }
                                />
                            ))
                        )}
                    </TabsContent>

                    {/* Active Orders - Currently being delivered */}
                    <TabsContent value="active" className="space-y-4">
                        {activeOrders.length === 0 ? (
                            <Card className="glass border-border/20">
                                <CardContent className="p-8 text-center">
                                    <Truck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold mb-2">Keine aktiven Lieferungen</h3>
                                    <p className="text-muted-foreground">Sie haben derzeit keine aktiven Lieferungen.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            activeOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    actions={
                                        <Button
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => handleUpdateStatus(order.id!, 'delivered')}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Lieferung abschließen
                                        </Button>
                                    }
                                />
                            ))
                        )}
                    </TabsContent>

                    {/* Completed Orders */}
                    <TabsContent value="completed" className="space-y-4">
                        {completedOrders.length === 0 ? (
                            <Card className="glass border-border/20">
                                <CardContent className="p-8 text-center">
                                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold mb-2">Keine abgeschlossenen Bestellungen</h3>
                                    <p className="text-muted-foreground">Noch keine Lieferungen abgeschlossen.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            completedOrders.map(order => (
                                <OrderCard key={order.id} order={order} />
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

// Reusable order card component
interface OrderCardProps {
    order: OrderDTO;
    actions?: React.ReactNode;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, actions }) => {
    const statusColors: Record<string, string> = {
        'approved': 'bg-yellow-100 text-yellow-800',
        'on-the-way': 'bg-blue-100 text-blue-800',
        'delivered': 'bg-green-100 text-green-800',
    };
    const statusLabels: Record<string, string> = {
        'placed': 'Bestellt',
        'approved': 'Bereit zur Abholung',
        'on-the-way': 'Unterwegs',
        'delivered': 'Geliefert',
    };

    return (
        <Card className="glass border-border/20">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg">Bestellung #{order.id}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status || ''] || 'bg-gray-100 text-gray-800'}`}>
                                {statusLabels[order.status || ''] || order.status}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {order.restaurantName}
                        </p>
                        {order.createdAt && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" />
                                {new Date(order.createdAt).toLocaleString()}
                            </p>
                        )}
                    </div>
                    <p className="text-lg font-bold text-primary">${order.total}</p>
                </div>

                {/* Customer Info */}
                <div className="space-y-2 mb-4 p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${order.customerPhone}`} className="text-primary hover:underline">
                            {order.customerPhone}
                        </a>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span>{order.customerAddress}</span>
                    </div>
                </div>

                {/* Actions */}
                {actions && (
                    <div className="flex gap-2 pt-2 border-t border-border/20">
                        {actions}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RiderDashboard;
