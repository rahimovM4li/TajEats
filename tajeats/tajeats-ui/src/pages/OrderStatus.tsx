import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, Package, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const OrderStatus: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [currentStatus, setCurrentStatus] = useState<'placed' | 'preparing' | 'on-the-way' | 'delivered'>('placed');
    const [progress, setProgress] = useState(25);

    // Mock order data - TODO: Replace with API call
    const orderData = {
        id: orderId,
        restaurantName: 'Tajik Traditional Kitchen',
        customerName: 'Rustam Shoev',
        customerPhone: '+992 92 123 4567',
        customerAddress: 'Rudaki Avenue 45, Dushanbe',
        items: [
            { name: 'Oshi Palov', quantity: 2, price: 50 },
            { name: 'Steamed Manti', quantity: 1, price: 18 }
        ],
        total: 73,
        estimatedDelivery: '45 minutes',
        driverName: 'Ahmad Karimov',
        driverPhone: '+992 93 456 7890'
    };

    const statusSteps = [
        {
            key: 'placed' as const,
            label: 'Order Placed',
            icon: CheckCircle,
            description: 'Your order has been confirmed'
        },
        {
            key: 'preparing' as const,
            label: 'Preparing',
            icon: Package,
            description: 'Restaurant is preparing your food'
        },
        {
            key: 'on-the-way' as const,
            label: 'On the Way',
            icon: Truck,
            description: 'Driver is heading to your location'
        },
        {
            key: 'delivered' as const,
            label: 'Delivered',
            icon: CheckCircle,
            description: 'Order delivered successfully'
        }
    ];

    // Mock status progression - TODO: Replace with real-time updates
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStatus(prev => {
                switch (prev) {
                    case 'placed':
                        setProgress(50);
                        return 'preparing';
                    case 'preparing':
                        setProgress(75);
                        return 'on-the-way';
                    case 'on-the-way':
                        setProgress(100);
                        return 'delivered';
                    default:
                        return prev;
                }
            });
        }, 10000); // Change status every 10 seconds for demo

        return () => clearInterval(timer);
    }, []);

    const getCurrentStepIndex = () => {
        return statusSteps.findIndex(step => step.key === currentStatus);
    };

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Order Status</h1>
                        <p className="text-muted-foreground">Order #{orderId}</p>
                    </div>

                    {/* Status Progress */}
                    <Card className="glass border-border/20 mb-8">
                        <CardHeader>
                            <CardTitle>Tracking Your Order</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <Progress value={progress} className="h-2" />
                                    <p className="text-sm text-muted-foreground text-center">
                                        Estimated delivery: {orderData.estimatedDelivery}
                                    </p>
                                </div>

                                {/* Status Steps */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                                    <Badge className="mt-2 bg-primary/90">Current</Badge>
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
                                <CardTitle>Order Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">From: {orderData.restaurantName}</h4>
                                    <div className="space-y-2">
                                        {orderData.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">
                          {item.quantity}x {item.name}
                        </span>
                                                <span className="font-semibold">${item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">${orderData.total}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Info */}
                        <Card className="glass border-border/20">
                            <CardHeader>
                                <CardTitle>Delivery Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-semibold">Delivery Address</p>
                                            <p className="text-sm text-muted-foreground">{orderData.customerAddress}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="font-semibold">Contact</p>
                                            <p className="text-sm text-muted-foreground">{orderData.customerPhone}</p>
                                        </div>
                                    </div>

                                    {currentStatus === 'on-the-way' && (
                                        <div className="border-t pt-4">
                                            <div className="flex items-center gap-3">
                                                <Truck className="w-5 h-5 text-primary" />
                                                <div>
                                                    <p className="font-semibold">Your Driver</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {orderData.driverName} • {orderData.driverPhone}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                    <h3 className="text-xl font-bold mb-2">Order Delivered Successfully!</h3>
                                    <p className="text-muted-foreground">Thank you for choosing TajEats. We hope you enjoyed your meal!</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link to="/restaurants">
                                        <Button size="lg" className="btn-hero">
                                            Order Again
                                        </Button>
                                    </Link>
                                    <Button variant="outline" size="lg">
                                        Rate Your Experience
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    Need help? Contact our support team or the restaurant directly.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button variant="outline">Contact Support</Button>
                                    <Button variant="outline">Call Restaurant</Button>
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