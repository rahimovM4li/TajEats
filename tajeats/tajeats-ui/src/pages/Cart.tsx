import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';

const Cart: React.FC = () => {
    const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

    const subtotal = getTotalPrice();
    const deliveryFee = items.length > 0 ? 5 : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + deliveryFee + tax;

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-6">
                        Looks like you haven't added any items to your cart yet. Start exploring our delicious restaurants!
                    </p>
                    <Link to="/restaurants">
                        <Button size="lg" className="btn-hero">
                            Browse Restaurants
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Your Order</h1>
                        <Button
                            variant="outline"
                            onClick={clearCart}
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Cart
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map(item => (
                                <Card key={item.dish.id} className="glass border-border/20">
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <img
                                                src={item.dish.image}
                                                alt={item.dish.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />

                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{item.dish.name}</h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {item.dish.description}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeFromCart(item.dish.id)}
                                                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="w-8 h-8"
                                                            onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="w-8 h-8"
                                                            onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-primary">
                                                            ${(item.dish.price * item.quantity).toFixed(2)}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            ${item.dish.price} each
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="glass border-border/20 sticky top-8">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Subtotal ({items.length} items)</span>
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

                                    <Link to="/checkout" className="block mt-6">
                                        <Button className="w-full btn-hero">
                                            Proceed to Checkout
                                        </Button>
                                    </Link>

                                    <Link to="/restaurants" className="block mt-3">
                                        <Button variant="outline" className="w-full">
                                            Continue Shopping
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;