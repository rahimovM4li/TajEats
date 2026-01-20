import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Eye, MapPin, Phone, User, Calendar, Package } from 'lucide-react';
import type { Order } from '@/lib/mockData';

interface OrderDetailsDialogProps {
    order: Order;
    trigger?: React.ReactNode;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ order, trigger }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'default';
            case 'preparing':
                return 'secondary';
            case 'on-the-way':
                return 'outline';
            default:
                return 'destructive';
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle>Order #{order.id}</DialogTitle>
                            <DialogDescription>
                                Placed on {new Date(order.createdAt).toLocaleString()}
                            </DialogDescription>
                        </div>
                        <Badge variant={getStatusColor(order.status)}>
                            {order.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Customer Information */}
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium">{order.customerName}</p>
                                    <p className="text-sm text-muted-foreground">Customer</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium">{order.customerPhone}</p>
                                    <p className="text-sm text-muted-foreground">Phone Number</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium">{order.customerAddress}</p>
                                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Restaurant Information */}
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <h3 className="font-semibold text-lg mb-3">Restaurant</h3>
                            <div className="flex items-start gap-3">
                                <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium">{order.restaurantName}</p>
                                    <p className="text-sm text-muted-foreground">Restaurant Name</p>
                                </div>
                            </div>
                            {order.estimatedDelivery && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">{order.estimatedDelivery}</p>
                                        <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3">
                                                <img
                                                    src={item.dish.image}
                                                    alt={item.dish.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div>
                                                    <p className="font-medium">{item.dish.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        ${item.dish.price.toFixed(2)} × {item.quantity}
                                                    </p>
                                                    <Badge variant="outline" className="mt-1">
                                                        {item.dish.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <p className="font-semibold">
                                                ${(item.dish.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                        {index < order.items.length - 1 && (
                                            <Separator className="mt-3" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            {/* Order Summary */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery Fee</span>
                                    <span>$0.00</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Timeline */}
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-4">Order Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className={`w-3 h-3 rounded-full mt-1 ${
                                        order.status === 'placed' || order.status === 'preparing' || 
                                        order.status === 'on-the-way' || order.status === 'delivered'
                                            ? 'bg-primary' : 'bg-muted'
                                    }`} />
                                    <div>
                                        <p className="font-medium">Order Placed</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className={`w-3 h-3 rounded-full mt-1 ${
                                        order.status === 'preparing' || order.status === 'on-the-way' || 
                                        order.status === 'delivered'
                                            ? 'bg-primary' : 'bg-muted'
                                    }`} />
                                    <div>
                                        <p className="font-medium">Preparing</p>
                                        <p className="text-sm text-muted-foreground">
                                            Restaurant is preparing your order
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className={`w-3 h-3 rounded-full mt-1 ${
                                        order.status === 'on-the-way' || order.status === 'delivered'
                                            ? 'bg-primary' : 'bg-muted'
                                    }`} />
                                    <div>
                                        <p className="font-medium">On the Way</p>
                                        <p className="text-sm text-muted-foreground">
                                            Order is out for delivery
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className={`w-3 h-3 rounded-full mt-1 ${
                                        order.status === 'delivered' ? 'bg-primary' : 'bg-muted'
                                    }`} />
                                    <div>
                                        <p className="font-medium">Delivered</p>
                                        <p className="text-sm text-muted-foreground">
                                            Order has been delivered
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailsDialog;
