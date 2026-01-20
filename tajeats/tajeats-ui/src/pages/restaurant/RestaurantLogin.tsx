'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const RestaurantLogin: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { login, user } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Redirect if already logged in
    useEffect(() => {
        if (user && user.role === 'restaurant') {
            navigate('/restaurant/dashboard');
        }
    }, [user, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const success = await login(formData.email, formData.password, 'restaurant');

            if (success) {
                toast({
                    title: "Login successful",
                    description: "Welcome to your restaurant dashboard!",
                });
                navigate('/restaurant/dashboard');
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            toast({
                title: "Login failed",
                description: "Please check your credentials and try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="w-full max-w-md mx-auto px-4">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">T</span>
                        </div>
                        <span className="text-3xl font-bold gradient-text">TajEats</span>
                    </Link>
                    <p className="text-muted-foreground mt-2">Restaurant Partner Portal</p>
                </div>

                <Card className="glass border-border/20">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Store className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl">Restaurant Login</CardTitle>
                        <p className="text-muted-foreground">Access your restaurant dashboard</p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="restaurant@example.com"
                                    required
                                    className="border-border/20"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        required
                                        className="border-border/20 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full btn-hero"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center space-y-2">
                            <Link
                                to="/restaurant/forgot-password"
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot your password?
                            </Link>

                            <div className="text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <Link to="/restaurant/register" className="text-primary hover:underline">
                                    Partner with us
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                        ← Back to TajEats
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RestaurantLogin;