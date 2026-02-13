import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, Package, MapPin, Phone, ShoppingBag, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { orderService } from '@/services/orderService';
import type { OrderDTO } from '@/types/api';

const OrderStatus: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<OrderDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Poll order status every 5 seconds
    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;
            try {
                const data = await orderService.getById(Number(orderId));
                setOrder(data);
            } catch (err) {
                console.error('Failed to fetch order:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
        const interval = setInterval(fetchOrder, 5000);
        return () => clearInterval(interval);
    }, [orderId]);

    const currentStatus = order?.status || 'placed';
    const isPickup = order?.deliveryType === 'PICKUP';

    const statusSteps = useMemo(() => {
        if (isPickup) {
            return [
                { key: 'placed', label: 'Bestellt', icon: Package, description: 'Bestellung wurde aufgegeben' },
                { key: 'approved', label: 'Best\u00e4tigt', icon: ThumbsUp, description: 'Restaurant hat best\u00e4tigt' },
                { key: 'delivered', label: 'Abgeholt', icon: ShoppingBag, description: 'Bestellung abgeholt' },
            ];
        }
        return [
            { key: 'placed', label: 'Bestellt', icon: Package, description: 'Bestellung wurde aufgegeben' },
            { key: 'approved', label: 'Best\u00e4tigt', icon: ThumbsUp, description: 'Restaurant hat best\u00e4tigt' },
            { key: 'on-the-way', label: 'Unterwegs', icon: Truck, description: 'Fahrer ist unterwegs' },
            { key: 'delivered', label: 'Geliefert', icon: CheckCircle, description: 'Erfolgreich geliefert' },
        ];
    }, [isPickup]);

    const getCurrentStepIndex = () => {
        return statusSteps.findIndex(step => step.key === currentStatus);
    };

    const progress = useMemo(() => {
        const idx = getCurrentStepIndex();
        if (idx < 0) return 0;
        return Math.round(((idx + 1) / statusSteps.length) * 100);
    }, [currentStatus, statusSteps]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Bestellung wird geladen...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Bestellung nicht gefunden.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Bestellstatus</h1>
                        <p className="text-muted-foreground">Bestellung #{orderId}</p>
                        <Badge variant="outline" className="mt-2">
                            {isPickup ? 'Selbstabholung' : 'Lieferung'}
                        </Badge>
                    </div>

                    {/* Status Progress */}
                    <Card className="glass border-border/20 mb-8">
                        <CardHeader>
                            <CardTitle>Tracking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <Progress value={progress} className="h-2" />
                                    {order.estimatedDelivery && (
                                        <p className="text-sm text-muted-foreground text-center">
                                            Gesch\u00e4tzte {isPickup ? 'Abholung' : 'Lieferung'}: {new Date(order.estimatedDelivery).toLocaleTimeString()}
                                        </p>
                                    )}
                                </div>

                                {/* Status Steps */}
                                <div className={`grid grid-cols-1 ${isPickup ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-4`}>
                                    {statusSteps.map((step, index) => {
                                        const Icon = step.icon;
                                        const isActive = index <= getCurrentStepIndex();
                                        const isCurrent = step.key === currentStatus;

                                        return (
                                            <div
                                                key={step.key}
                                                className={`text-center p-4 rounded-lg transition-all ${
                                                    isActive
                                                        ? isCurrent
                                                            ? 'bg-primary/10 border-2 border-primary animate-pulse-slow'
                                                            : 'bg-accent/10 border border-accent'
                                                        : 'bg-muted/20 border border-muted'
                                                }`}
                                            >
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                                                    isActive ? 'bg-gradient-primary' : 'bg-muted'
                                                }`}>
                                                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                                                </div>
                                                <h3 className={`font-semibold mb-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {step.label}
                                                </h3>
                                                <p className={`text-xs ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                                                    {step.description}
                                                </p>
                                                {isCurrent && (
                                                    <Badge className="mt-2 bg-primary/90">Aktuell</Badge>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Details */}
                        <Card className="glass border-border/20">
                            <CardHeader>
                                <CardTitle>Bestelldetails</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Von: {order.restaurantName}</h4>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Gesamt</span>
                                        <span className="text-primary">${order.total}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Info */}
                        <Card className="glass border-border/20">
                            <CardHeader>
                                <CardTitle>{isPickup ? 'Abholinformationen' : 'Lieferinformationen'}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {!isPickup && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-semibold">Lieferadresse</p>
                                                <p className="text-sm text-muted-foreground">{order.customerAddress}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="font-semibold">Kontakt</p>
                                            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="text-center mt-8 space-y-4">
                        {currentStatus === 'delivered' ? (
                            <div className="space-y-4">
                                <div className="p-6 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg">
                                    <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">
                                        {isPickup ? 'Bestellung erfolgreich abgeholt!' : 'Bestellung erfolgreich geliefert!'}
                                    </h3>
                                    <p className="text-muted-foreground">Vielen Dank f\u00fcr Ihre Bestellung bei TajEats!</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link to="/restaurants">
                                        <Button size="lg" className="btn-hero">
                                            Erneut bestellen
                                        </Button>
                                    </Link>
                                    <Button variant="outline" size="lg">
                                        Bewertung abgeben
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    Brauchen Sie Hilfe? Kontaktieren Sie unser Support-Team.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button variant="outline">Support kontaktieren</Button>
                                    <Button variant="outline">Restaurant anrufen</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStatus;