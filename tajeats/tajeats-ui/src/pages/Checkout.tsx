import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Phone, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { orderService } from '@/services/orderService';
import type { OrderDTO } from '@/types/api';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, getTotalPrice, clearCart } = useCart();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        notes: '',
        paymentMethod: 'cash'
    });

    const [isLoading, setIsLoading] = useState(false);

    const subtotal = getTotalPrice();
    const deliveryFee = 5;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Transform cart items to OrderDTO format
            const orderDTO: OrderDTO = {
                restaurantId: Number(items[0].dish.restaurantId), // Get from first item
                customerName: formData.fullName,
                customerPhone: formData.phone,
                customerAddress: formData.address,
                total: total,
                items: items.map(item => ({
                    dishId: Number(item.dish.id),
                    quantity: item.quantity,
                })),
            };

            // Create order via API
            const createdOrder = await orderService.create(orderDTO);

            // Clear cart after successful order
            await clearCart();

            toast({
                title: "Order placed successfully!",
                description: `Your order #${createdOrder.id} has been placed and will be delivered soon.`,
            });

            navigate(`/order-status/${createdOrder.id}`);
        } catch (error: any) {
            toast({
                title: "Error placing order",
                description: error.message || "There was a problem placing your order. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Delivery Information */}
                                <Card className="glass border-border/20">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            Delivery Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="fullName" className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    Full Name *
                                                </Label>
                                                <Input
                                                    id="fullName"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="border-border/20"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="phone" className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    Phone Number *
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="border-border/20"
                                                    placeholder="+992 XX XXX XXXX"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="address">Delivery Address *</Label>
                                            <Textarea
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                className="border-border/20"
                                                placeholder="Enter your full delivery address..."
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="notes">Special Instructions (Optional)</Label>
                                            <Textarea
                                                id="notes"
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                className="border-border/20"
                                                placeholder="Any special instructions for delivery..."
                                                rows={2}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Payment Method */}
                                <Card className="glass border-border/20">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                            Payment Method
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <RadioGroup
                                            value={formData.paymentMethod}
                                            onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="cash" id="cash" />
                                                <Label htmlFor="cash" className="flex-1 cursor-pointer">
                                                    <div className="flex justify-between items-center">
                                                        <span>Cash on Delivery</span>
                                                        <span className="text-sm text-muted-foreground">Pay when your order arrives</span>
                                                    </div>
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-2 opacity-50">
                                                <RadioGroupItem value="card" id="card" disabled />
                                                <Label htmlFor="card" className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <span>Credit/Debit Card</span>
                                                        <span className="text-sm text-muted-foreground">Coming soon</span>
                                                    </div>
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </CardContent>
                                </Card>

                                {/* Estimated Delivery Time */}
                                <Card className="glass border-border/20">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Estimated Delivery Time</h3>
                                                <p className="text-sm text-muted-foreground">35-45 minutes</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="glass border-border/20 sticky top-8">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Order Items */}
                                    <div className="space-y-3">
                                        {items.map(item => (
                                            <div key={item.dish.id} className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm">{item.dish.name}</h4>
                                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                                <span className="font-semibold">${(item.dish.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Pricing Breakdown */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Delivery fee</span>
                                            <span>${deliveryFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax</span>
                                            <span>${tax.toFixed(2)}</span>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full btn-hero"
                                        disabled={isLoading}
                                        onClick={handleSubmit}
                                    >
                                        {isLoading ? 'Placing Order...' : 'Place Order'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;