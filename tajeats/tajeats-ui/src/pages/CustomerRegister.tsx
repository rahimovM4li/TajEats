'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

const CustomerRegister: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validatePassword = (password: string): boolean => {
        // Min 8 characters, 1 uppercase, 1 lowercase, 1 number
        const minLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        return minLength && hasUppercase && hasLowercase && hasNumber;
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await authService.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'CUSTOMER'
            });

            toast({
                title: "Registration successful!",
                description: "Your account has been created. You can now log in.",
            });

            // Redirect to home page after successful registration
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
            toast({
                title: "Registration failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 py-12">
            <div className="w-full max-w-md mx-auto px-4">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">T</span>
                        </div>
                        <span className="text-3xl font-bold gradient-text">TajEats</span>
                    </Link>
                    <p className="text-muted-foreground mt-2">Create Your Account</p>
                </div>

                <Card className="glass border-border/20">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl">Sign Up</CardTitle>
                        <p className="text-sm text-muted-foreground">Join TajEats and start ordering</p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    required
                                    className={`border-border/20 ${errors.name ? 'border-destructive' : ''}`}
                                />
                                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="you@example.com"
                                    required
                                    className={`border-border/20 ${errors.email ? 'border-destructive' : ''}`}
                                />
                                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        required
                                        className={`border-border/20 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                                <p className="text-xs text-muted-foreground mt-1">
                                    Min 8 characters, 1 uppercase, 1 lowercase, 1 number
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        required
                                        className={`border-border/20 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
                            </div>

                            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                <div className="flex items-start space-x-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-green-900 dark:text-green-100">
                                        <p className="font-medium">Instant Activation</p>
                                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                            Your account will be activated immediately. Start ordering delicious food right away!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full gradient-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>

                            <div className="text-center text-sm space-y-2">
                                <div>
                                    <span className="text-muted-foreground">Already have an account? </span>
                                    <Link to="/" className="text-primary hover:underline font-medium">
                                        Login here
                                    </Link>
                                </div>
                                <div className="pt-2 border-t border-border/20">
                                    <span className="text-muted-foreground">Restaurant owner? </span>
                                    <Link to="/restaurant/register" className="text-accent hover:underline font-medium">
                                        Register your restaurant
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CustomerRegister;
